const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const package = require("./package.json");

module.exports = (env, argv) => ({
  entry: './src/speedy.js',
  plugins: [
    new webpack.BannerPlugin({
        banner: (({ name, version, homepage, description, year, author, license, date }) => [
            `${name} v${version}`,
            `${homepage}`,
            ``,
            `${description}`,
            `Copyright ${year} ${author}`,
            `@license ${license}`,
            ``,
            `Includes gpu.js (MIT license)`,
            `by the gpu.js team (http://gpu.rocks)`,
            ``,
            `Date: ${date}`,
        ].join('\n'))(Object.assign(package, {
            'date': (new Date()).toISOString(),
            'year': [...(new Set([2020, new Date().getFullYear()]))].join('-'),
            'author': package.author.replace('@', '(at)'),
        }))
    }),
    new webpack.DefinePlugin({
      'PACKAGE_VERSION': JSON.stringify(package.version),
    }),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: argv.mode == 'development' ? 'speedy-vision.js' : 'speedy-vision.min.js',
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