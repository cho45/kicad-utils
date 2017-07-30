
const { Transform } = require("kicad_common");
const { CanvasPlotter } = require("kicad_plotter");
const { Library } = require("kicad_lib");
//import { Trasform } from "../../kicad_common";
//import { CanvasPlotter } from "../../kicad_plotter";
//import { Library } from "../../kicad_lib";

//const lib = Library.load("foobar");
//console.log(lib);


const app = new Vue({
	el: '#app',
	data: {
		fileName : "",
		status: "init",
		lib: {},
		components: [],
	},

	created: function () {
	},

	mounted: function () {
		console.log(this.$refs);
		if (location.search) {
			this.loadLibrary(location.search.substring(1) || '/lib/device.lib');
		}
	},

	methods: {
		fileSelected: function () {
			const file = this.$refs.fileInput.files[0];
			this.fileName = file.name;
			const objectURL = window.URL.createObjectURL(file);
			this.loadLibrary(objectURL);
		},

		loadLibrary: async function (url) {
			this.status = "loading";
			console.log('loadLibrary');
			const res = await fetch(url);
			const text = await res.text();
			this.status = "parsing";
			const lib = Library.load(text);
			this.lib = lib;
			this.components = lib.components;
			await Vue.nextTick();
			this.status = "rendering";
			console.log(this.$refs);
			const canvasElements = this.$refs.canvas;
			for (let canvas of canvasElements) {
				const name = canvas.getAttribute('data-name');
				console.log(canvas, name);
				const component = lib.findByName(name);
				const rect = component.draw.getBoundingRect();
				if (!rect) {
					return "data:";
				}

				const PADDING = 500;
				const width = rect.getWidth() + PADDING, height = rect.getHeight() + PADDING;

				canvas.width  = 500;
				canvas.height = 500;

				const scale = Math.min(canvas.width / width, canvas.height / height);
				console.log('plot', component.name, rect, width, height, scale);

				const ctx = canvas.getContext('2d');
				ctx.translate(canvas.width / 2, canvas.height / 2);
				ctx.scale(scale, scale);
				ctx.stokeStyle = '#000';
				ctx.fillStyle  = '#000';

				const plotter = new CanvasPlotter(ctx);
				plotter.plotLibComponent(component, 1, 1, { x: 0, y: 0 }, new Transform());
			}
			this.status = "done";
		}
	}
})
