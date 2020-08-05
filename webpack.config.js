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
            `${description}`,
            `${homepage}`,
            ``,
            `Copyright ${year} ${author}`,
            `@license ${license}`,
            ``,
            `Date: ${date}`,
        ].join('\n'))(Object.assign(package, {
            'date': (new Date()).toISOString(),
            'year': [...(new Set([2020, new Date().getFullYear()]))].join('-'),
            'author': package.author.replace('@', '(at)'),
        }))
    }),
    new webpack.DefinePlugin({
      '__SPEEDY_VERSION__': JSON.stringify(package.version),
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /\.ignore\./i,
    }),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: argv.mode == 'development' ? 'speedy-vision.js' : 'speedy-vision.min.js',
    library: 'Speedy',
    libraryTarget: 'var',
  },
  module: {
    rules: [
      {
        test: /\.glsl$/i,
        use: [
          {
            loader: path.resolve('webpack-glsl-minifier.js'),
          }
        ],
      },
    ],
  },
  mode: argv.mode == 'development' ? 'development' : 'production',
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
              /*output: {
                  comments: /^!/,
              },*/
              compress: {
                  defaults: true,
              },
              mangle: true,
          },
          extractComments: false,
      })],
      minimize: true,
  },
});