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
			const files = Array.from(this.$refs.fileInput.files).map( (f) => ({ name: f.name, url: window.URL.createObjectURL(f) }) );
			this.loadFiles(files);
		},

		onSubmit: function () {
			const urls = this.url.replace(/^\s+|\s+$/g, '').split(/\s+/).map( (u) => ({ name: u, url: u.replace(/github\.com\/(.+)\/blob\/(.+)/, 'raw.githubusercontent.com/$1/$2') }));
			console.log(urls);
			if (!urls.length) {
				this.status = "url is required";
				return;
			}
			const params = new URLSearchParams();
			params.set('url', this.url);
			history.pushState(null, '', '?' + params);
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
		}
	}
})
