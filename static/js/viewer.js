const {
	Transform,
	CanvasPlotter,
	Color,
	SVGPlotter,
	PCBPlotter,
	SchPlotter,
	Lib,
	Sch,
	Pcb,
} = require("kicad-utils");

const Vue = require("vue");

const worker = new MethodWorker("./js/worker.bundle.js");

const app = new Vue({
	el: '#app',
	data: {
		url: [
			"https://github.com/cho45/Keble/blob/master/Root-cache.lib",
			"https://github.com/cho45/Keble/blob/master/Root.sch",
			"https://github.com/cho45/Keble/blob/master/_keymodule_l.sch",
			"https://github.com/cho45/Keble/blob/master/_keymodule_r.sch",
			"https://github.com/cho45/Keble/blob/master/_main.sch",
			"https://github.com/cho45/Keble/blob/master/KeyModule-L.kicad_pcb",
			"https://github.com/cho45/Keble/blob/master/KeyModule-R.kicad_pcb",
			"https://github.com/cho45/Keble/blob/master/Main.kicad_pcb",
		].join("\n"),
		status: "init",
		lib: {},
		pcbs: [],
		schs: [],
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
			urls = urls.filter( (url) => /[.](kicad_pcb|lib|sch)$/i.test(url.name) );

			const res = await Promise.all(urls.map( (url) => fetch(url.url)));
			const text = await Promise.all(res.map( (r) => r.text()));
			const files = text.map( (t, i) => ({ url: urls[i], content: t }) );

			const schFiles = [];
			const libFiles = [];
			const pcbFiles = [];
			for (let file of files) {
				if (file.url.name.toLowerCase().endsWith(".kicad_pcb")) {
					pcbFiles.push(file);
				} else
				if (file.url.name.toLowerCase().endsWith(".sch")) {
					schFiles.push(file);
				} else
				if (file.url.name.toLowerCase().endsWith(".lib")) {
					libFiles.push(file);
				}
			}

			this.pcbs = [];
			this.schs = [];

			for (let pcbFile of pcbFiles) {
				this.status = 'loading ' + pcbFile.url.name;
				const res = await worker.call('renderPCB', pcbFile.content);
				this.errors.concat(res.errors);

				this.pcbs.push({
					url: pcbFile.url,
					mirror: false,
					layers: res.layers,
				});
			}


			await worker.call('loadLibs', libFiles.map((file) => file.content));

			this.schs = [];
			for (let schFile of schFiles) {
				this.status = 'loading ' + schFile.url.name;

				const res = await worker.call('renderSch', schFile.content);

				this.schs.push({
					url: schFile.url,
					src: res.src,
				});
			}

			await worker.call('unloadLibs');

			this.status = 'done';
		},

		basename: function (url) {
			const matched = url.replace(/[#?].+$/, '').match(/[^/]+$/);
			return decodeURIComponent(matched[0] || '');
		}
	}
})

