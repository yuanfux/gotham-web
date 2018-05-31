const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'docs'),
		filename: 'bundle.js'
	},
	module: {
		rules: [
		{
			test: /\.js$/,
			exclude: /(node_modules)/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['env']
				}
			}
		},
		{
			test: /\.css$/,
			use: [ 'style-loader', 'css-loader' ]
		},
		{
			test: /\.(png|jpg|gif)$/,
			use: [
			{
				loader: 'file-loader',
				options: {
					name:'image/[name].[ext]'
				}
			}
			]
		}
		]
	},
	devServer: {
		contentBase: path.join(__dirname, "docs"),
		compress: true,
		port: 6324
	},
	plugins: [
	new HtmlWebpackPlugin({
		filename: 'index.html',
		template: path.resolve(__dirname, 'src', 'index.html')
	})
	]
};