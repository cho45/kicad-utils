const {
	Transform,
	CanvasPlotter,
	SVGPlotter,
	SchPlotter,
	Lib,
	Sch,
} = require("kicad-utils");

const Vue = require("vue");

const app = new Vue({
	el: '#app',
	data: {
		url: [
			"https://github.com/cho45/Keble/blob/master/Root-cache.lib",
			"https://github.com/cho45/Keble/blob/master/Root.sch",
			"https://github.com/cho45/Keble/blob/master/_keymodule_l.sch",
			"https://github.com/cho45/Keble/blob/master/_keymodule_r.sch",
			"https://github.com/cho45/Keble/blob/master/_main.sch",
		].join("\n"),
		status: "init",
		lib: {},
		results: [],
		errors: [],
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

			const libs = libFiles.map( (file) => Lib.Library.load(file.content) );

			this.results = [];
			for (let schFile of schFiles) {
				this.status = 'loading ' + schFile;
				const sch = Sch.Schematic.load(schFile.content);

				const svgPlotter = new SVGPlotter();
				svgPlotter.pageInfo = sch.descr.pageInfo;
				svgPlotter.startPlot();
				new SchPlotter(svgPlotter).plotSchematic(sch, libs);
				svgPlotter.endPlot();
				const svg = svgPlotter.output;
				for (let error of svgPlotter.errors) {
					this.errors.push(error);
				}

				let src;
				if (typeof Blob !== 'undefined') {
					const blob = new Blob([svg], {type : 'image/svg+xml'});
					src = URL.createObjectURL(blob);
				} else {
					src = 'data:image/svg+xml,' + encodeURIComponent(svg);
				}
				this.results.push({
					url: schFile.url,
					src: src
				});
			}
			this.status = 'done';
		},

		basename: function (url) {
			const matched = url.replace(/[#?].+$/, '').match(/[^/]+$/);
			return decodeURIComponent(matched[0] || '');
		}
	}
})
