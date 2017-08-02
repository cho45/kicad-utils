kicad-utils
========

KiCAD library / schematic parser and plotter written in TypeScript (JavaScript)

DEMO
====

- <a href="https://cho45.stfuawsc.com/kicad-js/static/library.html">Library Viewer</a>

.sch to .svg/.png in command-line
=================================

```
npx -p kicad-utils sch2svg path/to/file.sch
```

or latest from github:

```
npx -p github:cho45/kicad-utils sch2svg
```

Development
===========

Edit .ts files.

## For web assets (static/)

```
npm install
./node_modules/.bin/webpack --watch
```

## For CUI assets (bin/)
```
npm install
tsc --watch
```
