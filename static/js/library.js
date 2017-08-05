
const {
	Transform,
	CanvasPlotter,
	Library,
} = require("kicad-utils");

const app = new Vue({
	el: '#app',
	data: {
		url: "https://raw.githubusercontent.com/KiCad/kicad-library/master/library/device.lib",
		fileName : "",
		status: "init",
		lib: {},
		components: [],
	},

	created: function () {
		if (location.search) {
			const params = new URLSearchParams(location.search);
			if (params.has('url')) {
				this.url = params.get('url');
			}
		}
	},

	mounted: function () {
		console.log(this.$refs);
		this.onSubmit();
	},

	methods: {
		fileSelected: function () {
			const file = this.$refs.fileInput.files[0];
			this.fileName = file.name;
			const objectURL = window.URL.createObjectURL(file);
			const params = new URLSearchParams();
			params.set('url', this.url);
			history.pushState(null, '', '?' + params);
			this.loadLibrary(objectURL);
		},

		onSubmit: function () {
			const url = this.url;
			if (!url) {
				this.status = "url is required";
				return;
			}
			this.loadLibrary(url).catch( (e) => {
				this.status = e;
			});
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
				const component = lib.findByName(name);
				const rect = component.draw.getBoundingRect();
				if (!rect) {
					return "data:";
				}

				const PADDING = 500;
				const width = rect.width + PADDING, height = rect.height + PADDING;

				canvas.width  = 500;
				canvas.height = 500;

				const scale = Math.min(canvas.width / width, canvas.height / height);
				// console.log('plot', component.name, rect, width, height, scale);

				const ctx = canvas.getContext('2d');
				ctx.translate(canvas.width / 2, canvas.height / 2);
				ctx.scale(scale, scale);
				ctx.stokeStyle = '#000';
				ctx.fillStyle  = '#000';

				const plotter = new CanvasPlotter(ctx);
				plotter.plotLibComponent(component, 1, 1, new Transform());
				plotter.plotLibComponentField(component, 1, 1, new Transform());
			}
			this.status = "done";
		}
	}
})
