const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { name, version, author, homepage, description, license } = require("./package.json");

module.exports = (env, argv) => ({
  entry: './src/speedy.js',
  plugins: [
    new webpack.BannerPlugin({
        banner: (date => [
            `${name} v${version}`,
            `${homepage}`,
            ``,
            `${description}`,
            `Copyright 2020 ${author.replace('@', '(at)')}`,
            `Released under the ${license} @license`,
            ``,
            `Includes gpu.js (MIT license)`,
            `by the gpu.js team (http://gpu.rocks)`,
            ``,
            `Date: ${date}`,
        ].join('\n'))((new Date()).toISOString())
    }),
    new webpack.DefinePlugin({
      'PACKAGE_VERSION': JSON.stringify(version),
    }),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: argv.mode == 'development' ? 'speedy-features.js' : 'speedy-features.min.js',
    library: 'Speedy',
    libraryTarget: 'var',
  },
  devtool: argv.mode == 'development' ? 'source-map' : undefined,
  devServer: {
      host: process.env.HOST || 'localhost',
      port: process.env.PORT || 8080,
      contentBase: __dirname,
      publicPath: '/dist/',
  },
  optimization: argv.mode == 'development' ? { minimize: false } : {
      minimizer: [new TerserPlugin({
          terserOptions: {
              mangle: false,
              compress: {
                  defaults: false,
              },
              output: {
                  comments: /^!/,
              },
          },
          extractComments: false,
      })],
      minimize: true,
  },
});