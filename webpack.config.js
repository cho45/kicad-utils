
const path = require('path');
//const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
//const saveLicense = require('uglify-save-license');


const babelOptions = {
	"presets": [ [ "@babel/preset-env", {
		modules: false,
		targets: {
			browsers: ["last 2 versions"] 
		}
	} ] ]
};

module.exports = {
	mode: 'development',

	entry: {
		library: ['url-search-params-polyfill', 'babel-polyfill', 'whatwg-fetch', './static/js/library.js'],
		schematic: ['url-search-params-polyfill', 'babel-polyfill', 'whatwg-fetch', './static/js/common.js', './static/js/schematic.js'],
		pcb: ['url-search-params-polyfill', 'babel-polyfill', 'whatwg-fetch', './static/js/common.js', './static/js/pcb.js'],
		viewer: ['url-search-params-polyfill', 'babel-polyfill', 'whatwg-fetch', './static/js/common.js', './static/js/viewer.js'],
		worker: ['babel-polyfill', './static/js/common.js', './static/js/worker.js'],
	},

	output: {
		path: __dirname + "/static/js",
		filename: '[name].bundle.js',
	},

	node: {
		'fs': 'empty',
	},

	devtool: 'source-map',

	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.common.js'
		},
		extensions: ['.ts', '.js'],
		modules: [
			path.join(__dirname, "src"),
			"node_modules"
		]
	},

	module: {
		rules: [
			{
				test: /\.html?$/,
				use: [
					{
						loader: 'raw-loader',
					},
				]
			},
			{
				test: /\.js?$/,
				exclude: /node_modules/, 
				use: [
					{
						loader: 'babel-loader',
						options: babelOptions,
					}
				]
			},
			{
				test: /\.ts?$/,
				use: [
					/*
					{
						loader: 'babel-loader',
						options: babelOptions,
					},
					*/
					{
						loader: 'ts-loader'
					}
				],
				exclude: /node_modules/
			},
		]
	},

	plugins: [
//		new UglifyJSPlugin({
//			sourceMap: true,
//			parallel: true,
//			output: {
//				comments: saveLicense
//			}
//		})
	]
};
