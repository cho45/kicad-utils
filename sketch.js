#!/usr/bin/env node

const { Transform } = require("./kicad_common");
const { CanvasPlotter } = require("./kicad_plotter");
const { Library } = require("./kicad_lib");

const fs = require('fs');

//console.log(fs.readdirSync("/Library/Application Support/kicad/library"));
//const content = fs.readFileSync('/Library/Application Support/kicad/library/device.lib', 'utf-8')
//const lib = Library.load(content);

const express = require('express');
const app = express();

app.use(express.static('static'));

//app.get("/api/library/components", function (req, res, next) {
//	res.json(lib.components.map( (i) => i.name ));
//});

const server = app.listen(3000, function () {
	console.log('server port: http://localhost:' + server.address().port);
});
