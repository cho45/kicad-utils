
const { Transform } = require("./kicad_common");
const { CanvasPlotter } = require("./kicad_plotter");
const { Library } = require("./kicad_lib");
//import { Trasform } from "../../kicad_common";
//import { CanvasPlotter } from "../../kicad_plotter";
//import { Library } from "../../kicad_lib";

//const lib = Library.load("foobar");
//console.log(lib);


const app = new Vue({
	el: '#app',
	data: {
		lib: {},
		components: [],
	},

	created: function () {
		this.loadLibrary();
	},

	methods: {
		loadLibrary: async function (url) {
			console.log('loadLibrary');
			// const res = await fetch("/lib/device.lib");
			const res = await fetch(location.search.substring(1) || '/lib/device.lib');
			const text = await res.text();
			const lib = Library.load(text);
			this.lib = lib;
			this.components = lib.components;
		},

		plot: function (component) {
			const rect = component.draw.getBoundingRect();
			if (!rect) {
				return "data:";
			}
			const width = rect.getWidth(), height = rect.getHeight();
			console.log('plot', component.name, rect, width, height);
			const canvas = document.createElement('canvas');
			canvas.width = width + 400;
			canvas.height = height + 400;
			const ctx = canvas.getContext('2d');
			ctx.translate(canvas.width / 2, canvas.height / 2);
			ctx.stokeStyle = '#000';
			ctx.fillStyle  = '#000';

			const plotter = new CanvasPlotter(ctx);
			plotter.plotComponent(component, { x: 0, y: 0 }, new Transform());

			return canvas.toDataURL();
		}
	}
})
