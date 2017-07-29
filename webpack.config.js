
const path = require('path');

module.exports = {
	entry: './static/js/app.js',
	output: {
		filename: './static/js/bundle.js',
	},

	devtool: 'source-map',

	resolve: {
		alias: {
			".": path.resolve(__dirname)
		},
		extensions: ['.ts', '.js']
	},

	module: {
		rules: [
			{
				test: /\.ts?$/,
				use: [
					{loader: 'ts-loader'}
				]
			}
		]
	}
};
