const {
	Transform,
	CanvasPlotter,
	Color,
	SVGPlotter,
	PCBPlotter,
	Pcb,
} = require("kicad-utils");

const Vue = require("vue");

const app = new Vue({
	el: '#app',
	data: {
		url: [
			"https://github.com/cho45/Keble/blob/master/KeyModule-L.kicad_pcb",
			"https://github.com/cho45/Keble/blob/master/KeyModule-R.kicad_pcb",
			"https://github.com/cho45/Keble/blob/master/Main.kicad_pcb",
		].join("\n"),
		status: "init",
		lib: {},
		components: [],
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
			urls = urls.filter( (url) => /[.](kicad_pcb)$/i.test(url.name) );

			const res = await Promise.all(urls.map( (url) => fetch(url.url)));
			const text = await Promise.all(res.map( (r) => r.text()));
			const files = text.map( (t, i) => ({ url: urls[i], content: t }) );

			const pcbFiles = [];
			for (let file of files) {
				if (file.url.name.toLowerCase().endsWith(".kicad_pcb")) {
					pcbFiles.push(file);
				} 
			}

			if (!pcbFiles.length) {
				this.status = ".kicad_pcb file is needed";
				return;
			}

			this.results = [];
			const render = (pcb, cb) => {
				const plotter = new SVGPlotter();
				plotter.pageInfo = pcb.pageInfo;
				plotter.startPlot();
				const pcbPlotter = new PCBPlotter(plotter);
				plotter.save();
				plotter.translate(0, 0);
				plotter.setColor(Color.WHITE);
				plotter.plotPageInfo(pcb.pageInfo);
				cb(plotter, pcbPlotter);
				plotter.restore();
				plotter.endPlot();
				const svg = plotter.output;
				for (let error of plotter.errors) {
					this.errors.push(error);
				}

				let src;
				if (typeof Blob !== 'undefined') {
					const blob = new Blob([svg], {type : 'image/svg+xml'});
					src = URL.createObjectURL(blob);
				} else {
					src = 'data:image/svg+xml,' + encodeURIComponent(svg);
				}
				return src;
			};

			const L = Pcb.PCB_LAYER_ID;
			for (let pcbFile of pcbFiles) {
				this.status = 'loading ' + pcbFile;
				const pcb = Pcb.PCB.load(pcbFile.content);

				this.results.push({
					url: pcbFile.url,
					mirror: false,
					layers: [
						{
							name: "F_Cu",
							src: render(pcb, (plotter, pcbPlotter) => {
								pcbPlotter.plotBoardLayers(pcb, new Pcb.LSET(
									L.F_Cu,
								));
							}),
							visible: true,
						},
						{
							name: "B_Cu",
							src: render(pcb, (plotter, pcbPlotter) => {
								pcbPlotter.plotBoardLayers(pcb, new Pcb.LSET(
									L.B_Cu,
								));
							}),
							visible: true,
						},
						{
							name: "F_Adhes",
							src: render(pcb, (plotter, pcbPlotter) => {
								pcbPlotter.plotBoardLayers(pcb, new Pcb.LSET(
									L.F_Adhes,
								));
							}),
							visible: true,
						},
						{
							name: "B_Adhes",
							src: render(pcb, (plotter, pcbPlotter) => {
								pcbPlotter.plotBoardLayers(pcb, new Pcb.LSET(
									L.B_Adhes,
								));
							}),
							visible: true,
						},
						{
							name: "F_Paste",
							src: render(pcb, (plotter, pcbPlotter) => {
								pcbPlotter.plotBoardLayers(pcb, new Pcb.LSET(
									L.F_Paste,
								));
							}),
							visible: true,
						},
						{
							name: "B_Paste",
							src: render(pcb, (plotter, pcbPlotter) => {
								pcbPlotter.plotBoardLayers(pcb, new Pcb.LSET(
									L.B_Paste,
								));
							}),
							visible: true,
						},
						{
							name: "F_SilkS",
							src: render(pcb, (plotter, pcbPlotter) => {
								pcbPlotter.plotBoardLayers(pcb, new Pcb.LSET(
									L.F_SilkS,
								));
							}),
							visible: true,
						},
						{
							name: "B_SilkS",
							src: render(pcb, (plotter, pcbPlotter) => {
								pcbPlotter.plotBoardLayers(pcb, new Pcb.LSET(
									L.B_SilkS,
								));
							}),
							visible: true,
						},
						{
							name: "F_Mask",
							src: render(pcb, (plotter, pcbPlotter) => {
								pcbPlotter.plotBoardLayers(pcb, new Pcb.LSET(
									L.F_Mask,
								));
							}),
							visible: true,
						},
						{
							name: "B_Mask",
							src: render(pcb, (plotter, pcbPlotter) => {
								pcbPlotter.plotBoardLayers(pcb, new Pcb.LSET(
									L.B_Mask,
								));
							}),
							visible: true,
						},
						{
							name: "Dwgs_User",
							src: render(pcb, (plotter, pcbPlotter) => {
								pcbPlotter.plotBoardLayers(pcb, new Pcb.LSET(
									L.Dwgs_User,
								));
							}),
							visible: true,
						},
						{
							name: "Eco1.User",
							src: render(pcb, (plotter, pcbPlotter) => {
								pcbPlotter.plotBoardLayers(pcb, new Pcb.LSET(
									L.Eco1_User
								));
							}),
							visible: true,
						},
						{
							name: "Eco2.User",
							src: render(pcb, (plotter, pcbPlotter) => {
								pcbPlotter.plotBoardLayers(pcb, new Pcb.LSET(
									L.Eco2_User
								));
							}),
							visible: true,
						},
						{
							name: "Edge_Cuts",
							src: render(pcb, (plotter, pcbPlotter) => {
								pcbPlotter.plotBoardLayers(pcb, new Pcb.LSET(
									L.Edge_Cuts,
								));
							}),
							visible: true,
						},
						{
							name: "F_CrtYd",
							src: render(pcb, (plotter, pcbPlotter) => {
								pcbPlotter.plotBoardLayers(pcb, new Pcb.LSET(
									L.F_CrtYd,
								));
							}),
							visible: true,
						},
						{
							name: "B_CrtYd",
							src: render(pcb, (plotter, pcbPlotter) => {
								pcbPlotter.plotBoardLayers(pcb, new Pcb.LSET(
									L.B_CrtYd,
								));
							}),
							visible: true,
						},
						{
							name: "F_Fab",
							src: render(pcb, (plotter, pcbPlotter) => {
								pcbPlotter.plotBoardLayers(pcb, new Pcb.LSET(
									L.F_Fab,
								));
							}),
							visible: true,
						},
						{
							name: "B_Fab",
							src: render(pcb, (plotter, pcbPlotter) => {
								pcbPlotter.plotBoardLayers(pcb, new Pcb.LSET(
									L.B_Fab,
								));
							}),
							visible: true,
						},
					]
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
