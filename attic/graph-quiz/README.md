# Versehentlich hierher kopierte Dateien

Diese fünf Dateien sind Kopien aus [`../../../graph-quiz/src/`](../../../graph-quiz/src/) (dem
Graphentheorie-Quiz-Projekt), die durch einen externen Vorgang in `es-exam-trainer/src/` gelandet
sind und dabei `TaskHeader.tsx` und `lib/shuffle.ts` mit Konfliktmarkern überschrieben haben.

Sie sind byte-identisch mit den Originalen, werden von dieser App nirgends importiert und liegen
absichtlich außerhalb von `src/` (siehe `tsconfig.app.json`, `"include": ["src"]`), damit sie nicht
mitkompiliert oder gebündelt werden. Bei Bedarf einfach aus `graph-quiz/src/` erneut kopieren; sonst
kann dieser Ordner gefahrlos gelöscht werden.
