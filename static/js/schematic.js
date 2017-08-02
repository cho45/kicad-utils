const {
	Transform,
	CanvasPlotter,
	SVGPlotter,
	Library,
	Schematic,
} = require("kicad-utils");

const app = new Vue({
	el: '#app',
	data: {
		url: [
			"https://raw.githubusercontent.com/cho45/Keble/master/Root-cache.lib",
			"https://raw.githubusercontent.com/cho45/Keble/master/_keymodule_l.sch"
		].join("\n"),
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
			const files = Array.from(this.$refs.fileInput.files).map( (f) => ({ name: f.name, url: window.URL.createObjectURL(f) }) );
			this.loadFiles(files);
		},

		onSubmit: function () {
			const urls = this.url.replace(/^\s+|\s+$/g, '').split(/\s+/).map( (u) => ({ name: u, url: u }));
			if (!urls.length) {
				this.status = "url is required";
				return;
			}
			this.loadFiles(urls);
		},

		loadFiles: async function (urls) {
			console.log('loadFiles', urls);
			urls = urls.filter( (url) => /[.](sch|lib)$/i.test(url.name) );

			const res = await Promise.all(urls.map( (url) => fetch(url.url)));
			const text = await Promise.all(res.map( (r) => r.text()));
			const files = text.map( (t, i) => ({ url: urls[i], content: t }) );

			const schFiles = [];
			const libFiles = [];
			for (let file of files) {
				if (file.url.name.toLowerCase().endsWith(".sch")) {
					schFiles.push(file);
				} else
				if (file.url.name.toLowerCase().endsWith(".lib")) {
					libFiles.push(file);
				}
			}

			if (!schFiles.length) {
				this.status = ".sch file is needed";
				return;
			}

			if (!libFiles.length) {
				this.status = ".lib file is needed";
			}

			const libs = libFiles.map( (file) => Library.load(file.content) );
			const sch = Schematic.load(schFiles[0].content);

			const svgPlotter = new SVGPlotter();
			svgPlotter.plotSchematic(sch, libs);
			const svg = svgPlotter.output;

			if (typeof Blob !== 'undefined') {
				const blob = new Blob([svg], {type : 'image/svg+xml'});
				this.$refs.img.src = URL.createObjectURL(blob);
			} else {
				this.$refs.img.src = 'data:image/svg+xml,' + encodeURIComponent(svg);
			}
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
