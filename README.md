kicad-js
========

KiCAD library parser and plotter with JavaScript

DEMO
====

- <a href="https://cho45.stfuawsc.com/kicad-js/static/library.html">Library Viewer</a>

.sch to .svg/.png in command-line
=================================

```
npx kicad-js sch2svg path/to/file.sch
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
