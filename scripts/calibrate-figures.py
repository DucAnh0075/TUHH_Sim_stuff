#!/usr/bin/env python3
"""Misst die Ausschnitte der Abbildungen in den Berichts-PDFs und schreibt sie
nach figures.manifest.json. Einmal laufen lassen, wenn sich die PDFs ändern.

    .venv/bin/python3 scripts/calibrate-figures.py

Braucht Pillow + numpy (nur hier, nicht zur Laufzeit der App)."""
import json, subprocess, sys, tempfile
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
DPI = 110
PAD = 24  # Pixel Rand um jeden Ausschnitt


def render(pdf: Path, page: int, out_dir: Path) -> Path:
    prefix = out_dir / f'p{page}'
    subprocess.run(['pdftoppm', '-png', '-r', str(DPI), '-f', str(page), '-l', str(page),
                    str(pdf), str(prefix)], check=True, capture_output=True)
    return next(out_dir.glob(f'p{page}-*.png'))


def runs(mask, gap, minimum):
    out, start = [], None
    for i, v in enumerate(mask):
        if v and start is None:
            start = i
        elif not v and start is not None:
            out.append([start, i]); start = None
    if start is not None:
        out.append([start, len(mask)])
    merged = []
    for r in out:
        if merged and r[0] - merged[-1][1] < gap:
            merged[-1][1] = r[1]
        else:
            merged.append(list(r))
    return [r for r in merged if r[1] - r[0] >= minimum]


def grow(strict, loose, bounds):
    """Blöcke werden mit der strengen Maske getrennt, aber mit der lockeren
    vermessen - sonst fehlen dünne Linien wie die Ränder der Petri-Netz-Kreise."""
    lo, hi = bounds
    y0, y1 = strict
    while y0 > lo and loose[y0 - 1]:
        y0 -= 1
    while y1 < hi and loose[y1]:
        y1 += 1
    return [y0, y1]


def analyse(path):
    """Zeilen- und Spaltenbloecke der Seite. Die Schwelle von wenigen Pixeln
    filtert das Scanner-Rauschen des SS-2024-Berichts heraus."""
    ink = np.array(Image.open(path).convert('L')) < 235
    h, w = ink.shape
    rows_loose, cols_loose = ink.any(axis=1), ink.any(axis=0)
    out = []
    strict_rows = runs(ink.sum(axis=1) > 4, 6, 8)
    for i, band in enumerate(strict_rows):
        lo = strict_rows[i - 1][1] if i > 0 else 0
        hi = strict_rows[i + 1][0] if i + 1 < len(strict_rows) else h
        y0, y1 = grow(band, rows_loose, (lo, hi))
        strict_cols = runs(ink[y0:y1].sum(axis=0) > 2, 24, 8)
        if not strict_cols:
            continue
        band_cols = ink[y0:y1].any(axis=0)
        cols = []
        for j, c in enumerate(strict_cols):
            clo = strict_cols[j - 1][1] if j > 0 else 0
            chi = strict_cols[j + 1][0] if j + 1 < len(strict_cols) else w
            cols.append(grow(c, band_cols, (clo, chi)))
        out.append({'y0': y0, 'y1': y1, 'cols': cols, 'lo': lo, 'hi': hi})
    return out, w, h, ink


def content(bands, h):
    """Nur die Inhaltsblöcke: ohne Kopfzeile, blaue Box, Hinweiszeile und Fußzeile."""
    return [b for b in bands if b['y0'] >= 165 and b['y1'] - b['y0'] >= 35 and b['y0'] < 0.92 * h]


def rect(band, w, h, side=None):
    x0, x1 = band['cols'][0][0], band['cols'][-1][1]
    if side == 'left' and len(band['cols']) > 1:
        # Bis kurz vor die rechte Spalte, damit kein Rand der Fragebox mitkommt.
        x1 = band['cols'][-1][0] - 2 * PAD
    elif side == 'right' and len(band['cols']) > 1:
        # Alles rechts der ersten Spalte: die Schaltung besteht aus mehreren
        # Teilspalten, links davon steht die Wahrheitstabelle.
        x0 = band['cols'][0][1] + PAD

    # Rand nach oben/unten nur bis zur Mitte des Abstands zum Nachbarblock.
    up = min(PAD, max(0, (band['y0'] - band.get('lo', 0)) // 2))
    down = min(PAD, max(0, (band.get('hi', h) - band['y1']) // 2))
    y0, y1 = max(0, band['y0'] - up), min(h, band['y1'] + down)
    x0, x1 = max(0, x0 - PAD), min(w, x1 + PAD)
    return [round(x0 / w, 4), round(y0 / h, 4), round((x1 - x0) / w, 4), round((y1 - y0) / h, 4)]


# figure-Suffix -> (Seite, Auswahl, Seite links/rechts teilen)
# Auswahl: Index, 'last' = letzter Inhaltsblock, 'but-last' = alles ausser dem letzten.
# 'but-last' fasst z.B. das StateCharts-Modell mit seinem abgesetzten Startzustand
# zusammen, waehrend die Loesungstabelle darunter der letzte Block ist.
PLAN = {
    'statechart':          (3, 'but-last', None),
    'statechart-solution': (3, 'last', None),
    'cenet':               (4, 'but-last', None),
    'vhdl':                (6, 'all', 'right'),
    'adc1':                (7, 'all', None),
    'adc2':                (8, 'narrow', None),
    'sched-prio-solution': (9, 2, None),
    'sched-pip-solution':  (10, 2, None),
    'pareto':              (11, 'all', 'left'),
    'sched-edf-solution':  (15, 2, None),
}


def columns_for(ink, y0, y1):
    """Spalten eines beliebigen Zeilenbereichs, streng getrennt, locker vermessen."""
    strict = runs(ink[y0:y1].sum(axis=0) > 2, 24, 8)
    loose = ink[y0:y1].any(axis=0)
    out = []
    for j, c in enumerate(strict):
        lo = strict[j - 1][1] if j > 0 else 0
        hi = strict[j + 1][0] if j + 1 < len(strict) else ink.shape[1]
        out.append(grow(c, loose, (lo, hi)))
    return out


def select(blocks, how, ink):
    """Ein Block, oder die Huelle mehrerer Bloecke mit neu bestimmten Spalten."""
    if how == 'last':
        return blocks[-1]
    if how in ('all', 'but-last', 'narrow'):
        if how == 'narrow':
            # Nur die schmalen Bloecke: das Schaltbild. Die Antwortkaesten darunter
            # laufen ueber die ganze Seitenbreite.
            width = ink.shape[1]
            chosen = [b for b in blocks if b['cols'][-1][1] - b['cols'][0][0] < 0.8 * width]
            chosen = chosen or blocks[:1]
        elif how == 'all':
            chosen = blocks
        else:
            chosen = blocks[:-1] or blocks[:1]
        y0 = min(b['y0'] for b in chosen)
        y1 = max(b['y1'] for b in chosen)
        return {
            'y0': y0,
            'y1': y1,
            'cols': columns_for(ink, y0, y1),
            'lo': chosen[0].get('lo', 0),
            'hi': chosen[-1].get('hi', y1),
        }
    return blocks[how] if how < len(blocks) else None


# Sonderfaelle des Berichts SS 2024, dessen Seiten reine Bilder sind.
SS2024_EXTRA = {
    'petrinet':      (5, 'promptbox'),
    'cenet-options': (4, 'options'),
    'rtc-options':   (12, 0),
}


def main():
    manifest = json.loads((ROOT / 'figures.manifest.json').read_text())
    figures = {}
    problems = []

    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        for exam, rel in manifest['pdfs'].items():
            pdf = ROOT / rel
            if not pdf.exists():
                problems.append(f'{exam}: {rel} fehlt')
                continue

            for name, (page, how, side) in PLAN.items():
                png = render(pdf, page, tmp)
                bands, w, h, ink = analyse(png)
                blocks = content(bands, h)
                band = select(blocks, how, ink) if blocks else None
                if band is None:
                    problems.append(f'{exam}/{name}: nur {len(blocks)} Bloecke auf Seite {page}')
                    continue
                figures[f'{exam}/{name}'] = {'page': page, 'rect': rect(band, w, h, side)}

            # Real-Time Calculus: die Kurven sind echte eingebettete Bilder.
            count = 6 if exam in ('ss2024', 'ws2425') else 5
            if exam != 'ss2024':
                for i in range(count):
                    figures[f'{exam}/rtc-{chr(97 + i)}'] = {'page': 12, 'image': i}

            if exam == 'ss2024':
                for name, spec in SS2024_EXTRA.items():
                    page = spec[0]
                    png = render(pdf, page, tmp)
                    bands, w, h, ink = analyse(png)
                    if spec[1] == 'promptbox':
                        # Die Flussrelation steht in der unteren Hälfte der blauen Box.
                        box = [b for b in bands if 80 <= b['y0'] < 165][0]
                        half = {'y0': (box['y0'] + box['y1']) // 2, 'y1': box['y1'], 'cols': box['cols']}
                        figures[f'{exam}/{name}'] = {'page': page, 'rect': rect(half, w, h)}
                    elif spec[1] == 'options':
                        blocks = content(bands, h)
                        figures[f'{exam}/{name}'] = {'page': page, 'rect': rect(blocks[-1], w, h)}
                    else:
                        blocks = content(bands, h)
                        figures[f'{exam}/{name}'] = {'page': page, 'rect': rect(blocks[spec[1]], w, h)}

    manifest['figures'] = dict(sorted(figures.items()))
    (ROOT / 'figures.manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    print(f'{len(figures)} Abbildungen vermessen.')
    for p in problems:
        print('  !', p)


if __name__ == '__main__':
    main()
