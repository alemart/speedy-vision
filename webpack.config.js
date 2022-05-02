const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const pack = require("./package.json");

module.exports = (env, argv) => ({
    entry: './src/main.js',
    mode: argv.mode == 'development' ? 'development' : 'production',
    devtool: argv.mode == 'development' ? 'source-map' : undefined,

    output: {
        filename: !env.minimize ? 'speedy-vision.js' : 'speedy-vision.min.js',
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
            banner: (({ version, homepage, description, year, author, license, date }) => [
                `Speedy Vision version ${version}`,
                `${description}`,
                `Copyright ${year} ${author}`,
                `${homepage}`,
                ``,
                `@license ${license}`,
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
            '__SPEEDY_WEBSITE__': JSON.stringify(pack.homepage),
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

    devServer: {
        //https: true,
        host: env.HOST || '0.0.0.0',
        port: env.PORT || 8080,
        static: ['assets', 'demos', 'tests'].map(dir => ({
            directory: path.resolve(__dirname, dir),
            publicPath: `/${dir}/`,
        })),
    },

    optimization: !env.minimize ? { minimize: false } : {
        minimize: true,
        minimizer: [new TerserPlugin({
            terserOptions: {
                /*output: {
                    comments: /^!/,
                },*/
                format: {
                    comments: /@license/i,
                },
                compress: {
                    defaults: true,
                },
                mangle: true,
            },
            extractComments: false,
        })],
    },
});
