kicad-utils
========

KiCAD library / schematic / pcb parser and plotter written in TypeScript (JavaScript)

DEMO
====

- <a href="https://cho45.stfuawsc.com/kicad-utils/static/library.html">Library Viewer</a>
- <a href="https://cho45.stfuawsc.com/kicad-utils/static/viewer.html">Schematic/PCB Viewer</a>

Setup bookmarklet for github: https://cho45.stfuawsc.com/kicad-utils/static/ .

.sch to .svg/.png in command-line
=================================

```
npx kicad-utils sch2svg path/to/file.sch
```

or latest from github:

```
npx -p github:cho45/kicad-utils kicad-utils sch2svg
```

Development
===========

Edit .ts files.

## start foreman

```
npm install
./node_modules/.bin/nf start
```

## For only web assets (static/)

```
npm install
./node_modules/.bin/webpack --watch
```

## For only CUI assets (bin/)
```
npm install
tsc --watch
```
