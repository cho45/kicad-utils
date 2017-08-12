
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const saveLicense = require('uglify-save-license');


const babelOptions = {
	"presets": [ [ "env", {
		browsers: ["last 2 versions"] 
	} ] ]
};

module.exports = {
	entry: {
		library: ['url-search-params-polyfill', 'babel-polyfill', 'whatwg-fetch', './static/js/library.js'],
		schematic: ['url-search-params-polyfill', 'babel-polyfill', 'whatwg-fetch', './static/js/schematic.js'],
		pcb: ['url-search-params-polyfill', 'babel-polyfill', 'whatwg-fetch', './static/js/pcb.js'],
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
				test: /\.ts?$/,
				use: [
					{
						loader: 'babel-loader',
						options: babelOptions,
					},
					{
						loader: 'ts-loader'
					}
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
			}
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
