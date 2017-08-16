
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

let libs = [];

MethodWorker.work({
	echo: function (arg) {
		return ['echo'].concat(Array.from(arguments));
	},
	
	loadLibs: function (contents) {
		libs = libs.concat(contents.map((content) => Lib.Library.load(content) ));
	},

	unloadLibs: function () {
		libs = [];
	},

	renderPCB: function (content) {
		const L = Pcb.PCB_LAYER_ID;
		const pcb = Pcb.PCB.load(content);
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
		const layers = [
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
		];

		return {
			errors: [],
			layers: layers,
		};
	},

	renderSch: function (content) {
		const sch = Sch.Schematic.load(content);

		const svgPlotter = new SVGPlotter();
		svgPlotter.pageInfo = sch.descr.pageInfo;
		svgPlotter.startPlot();
		new SchPlotter(svgPlotter).plotSchematic(sch, libs);
		svgPlotter.endPlot();
		const svg = svgPlotter.output;

		let src;
		if (typeof Blob !== 'undefined') {
			const blob = new Blob([svg], {type : 'image/svg+xml'});
			src = URL.createObjectURL(blob);
		} else {
			src = 'data:image/svg+xml,' + encodeURIComponent(svg);
		}

		return {
			src: src,
			errors: svgPlotter.errors,
		};
	}

});
