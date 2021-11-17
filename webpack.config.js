const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const pack = require("./package.json");

module.exports = (env, argv) => ({
    entry: './src/main.js',
    output: {
        filename: argv.mode == 'development' ? 'speedy-vision.js' : 'speedy-vision.min.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/',
        library: {
            name: 'Speedy',
            type: 'umd',
            export: 'default',
        },
    },
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
            ].join('\n'))(Object.assign({}, pack, {
                'date': (new Date()).toISOString(),
                'year': [2020, new Date().getFullYear()].join('-'),
                'author': pack.author.replace('@', '(at)'),
            }))
        }),
        new webpack.DefinePlugin({
            '__SPEEDY_VERSION__': JSON.stringify(pack.version),
            '__SPEEDY_DEVELOPMENT_MODE__': argv.mode == 'development',
        }),
        new webpack.IgnorePlugin({
            resourceRegExp: /\.ignore\./i,
        }),
    ],
    module: {
        rules: [{
            test: /\.glsl$/i,
            use: [{
                loader: path.resolve('webpack-glsl-minifier.js'),
            }],
        },{
            test: /\.wasm.txt$/i,
            use: [{
                loader: path.resolve('webpack-wasm-loader.js'),
            }],
        }],
    },
    mode: argv.mode == 'development' ? 'development' : 'production',
    devtool: argv.mode == 'development' ? 'source-map' : undefined,
    devServer: {
        host: env.HOST || 'localhost',
        port: env.PORT || 8080,
        static: ['assets', 'demos', 'tests'].map(dir => ({
            directory: path.resolve(__dirname, dir),
            publicPath: `/${dir}/`,
        })),
    },
    optimization: argv.mode == 'development' ? { minimize: false } : {
        minimize: true,
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
    },
});
