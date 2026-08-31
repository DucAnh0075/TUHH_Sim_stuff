#!/usr/bin/env python3
"""Misst die Ausschnitte der Abbildungen in den Berichts-PDFs und schreibt sie
nach figures.manifest.json. Einmal laufen lassen, wenn sich die PDFs ändern.

    .venv/bin/python3 scripts/calibrate-figures.py

Braucht Pillow + numpy (nur hier, nicht zur Laufzeit der App)."""
import json, subprocess, sys, tempfile
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

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


def rtc_grid(png):
    """
    Die Real-Time-Calculus-Seite von SS 2024 ist ein Scan: die 6 Antwort-Karten
    beruehren sich, ihre Raender bilden EINEN riesigen Blob, in dem sich normale
    Luecken-Erkennung nicht trennen laesst. Stattdessen werden per 4-Connectivity-
    Labeling die 6 mittelgrossen Komponenten gesucht - das sind genau die
    Kurven+Achsen jeder Karte (viel kleiner als der Kartenrand-Blob, viel groesser
    als die (A)-Kreise). Liefert 6 Rechtecke in Lesereihenfolge.
    """
    im = np.array(Image.open(png).convert('L'))
    h, w = im.shape
    ink = im < 253
    y_start = int(0.14 * h)  # Kopfzeile, blaue Box und Hinweiszeile ueberspringen
    region = ink[y_start:, :]
    struct = np.array([[0, 1, 0], [1, 1, 1], [0, 1, 0]])
    labeled, n = ndimage.label(region, structure=struct)
    sizes = ndimage.sum(region, labeled, range(1, n + 1))
    page_area = w * h
    boxes = []
    for i, size in enumerate(sizes):
        if not (0.0008 * page_area <= size <= 0.01 * page_area):
            continue
        ys, xs = np.where(labeled == i + 1)
        boxes.append((int(xs.min()), int(xs.max()), int(ys.min()) + y_start, int(ys.max()) + y_start))
    boxes.sort(key=lambda b: (b[2], b[0]))  # oben nach unten, dann links nach rechts
    return boxes, w, h


# Sonderfaelle des Berichts SS 2024, dessen Seiten reine Bilder sind.


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

            # Real-Time Calculus: normalerweise sind die Kurven echte eingebettete
            # Bilder; SS 2024 ist ein Scan ohne einzeln ansprechbare Bilder, dort
            # werden die 6 Karten stattdessen ueber rtc_grid() auseinandergerechnet.
            if exam == 'ss2024':
                png = render(pdf, 12, tmp)
                boxes, w, h = rtc_grid(png)
                if len(boxes) != 6:
                    problems.append(f'{exam}/rtc: {len(boxes)} Karten gefunden, erwartet 6')
                # Nur 12px Rand: die richtige Antwort ist im Bericht gruen hinterlegt,
                # ab 14px ragt diese Flaeche in den Ausschnitt hinein.
                pad = 12
                for i, (x0, x1, y0, y1) in enumerate(boxes):
                    figures[f'{exam}/rtc-{chr(97 + i)}'] = {
                        'page': 12,
                        'rect': [
                            round((x0 - pad) / w, 4),
                            round((y0 - pad) / h, 4),
                            round((x1 - x0 + 2 * pad) / w, 4),
                            round((y1 - y0 + 2 * pad) / h, 4),
                        ],
                    }
            else:
                count = 6 if exam == 'ws2425' else 5
                for i in range(count):
                    figures[f'{exam}/rtc-{chr(97 + i)}'] = {'page': 12, 'image': i}

    manifest['figures'] = dict(sorted(figures.items()))
    (ROOT / 'figures.manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    print(f'{len(figures)} Abbildungen vermessen.')
    for p in problems:
        print('  !', p)


if __name__ == '__main__':
    main()
