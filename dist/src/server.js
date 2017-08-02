#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const fs = require("fs");
const path = require("path");
const mimeTypes = {
    "js": "application/javascript",
    "css": "text/css",
    "json": "application/json",
    "png": "image/png",
    "jpg": "image/jpeg",
    "html": "text/html",
};
const args = process.argv.slice(2);
const root = args.shift() || ".";
const server = http.createServer(function (req, res) {
    console.log(req.method, req.url);
    let base = (req.url || "/").replace(/[.]{1,2}\//g, '');
    if (base.endsWith("/"))
        base += "index.html";
    const ext = path.extname(base).slice(1);
    const target = path.join(root, base);
    const mimeType = mimeTypes[ext];
    console.log('serving', root, target, ext, mimeType);
    fs.readFile(target, function (e, content) {
        if (e) {
            if (e.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found', 'utf-8');
            }
            else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`500 Internal Server Error\n${e}`, 'utf-8');
            }
            return;
        }
        res.writeHead(200, { 'Content-Type': mimeType });
        res.end(content, 'utf-8');
    });
});
const port = 5000;
server.listen(port);
console.log('Local Development Server running at http://127.0.0.1:' + port + '/');
//# sourceMappingURL=server.js.map