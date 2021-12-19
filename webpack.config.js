require('dotenv').config()
const path = require('path')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


const isDev = process.env.NODE_ENV === 'development'

const serverConfig = {
    entry: {
        server : ["@babel/polyfill", './index.ts'],
    },
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: './server.node.js',
    },
    module: {
        rules: [
            {
                test: /\.js|jsx$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            "@babel/preset-env",
                        ]
                    }
                }
            },
            {
                test: /\.ts|tsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'ts-loader',
                    // options: {
                    //     presets: [
                    //         "@babel/preset-env",
                    //         "@babel/plugin-transform-runtime"
                    //     ]
                    // }
                } ,
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
}

// const clientConfig = {
//     entry: {
//         main : ["@babel/polyfill", './src/index.tsx'],
//     },
//     output: {
//         filename: './[name].[contenthash].js',
//         path: path.resolve(__dirname, 'dist'),
//         clean: true
//     },
//     devServer: {
//         contentBase: path.join(__dirname, 'dist'),
//         compress: true,
//         port: 3000,
//         watchContentBase: true,
//         progress: true,
//         open: true,
//         hot: true,
//         historyApiFallback: true,
        
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.js|jsx$/,
//                 exclude: /(node_modules|bower_components|server)/,
//                 use: {
//                     loader: 'babel-loader',
//                     options: {
//                         presets: [
//                             ["@babel/preset-env",
//                             {
//                                 modules: false
//                             },
//                             "@babel/preset-react",]
                            
//                         ]
//                     }
//                 }
//             },
//             {
//                 test: /\.ts|tsx?$/,
//                 exclude: /(node_modules|bower_components|server)/,
//                 use: 'ts-loader',
//                 exclude: /node_modules/,
//             },
//             {
//                 test: /\.(scss)$/,
//                 exclude: /node_modules/,
//                 use: [
//                     MiniCssExtractPlugin.loader,
//                     'css-loader',
//                     {
//                         loader: "postcss-loader",
//                         options: {
//                             postcssOptions: {
//                                 plugins: [
//                                     [
//                                         "postcss-preset-env",
//                                         {
//                                             browsers: 'last 3 versions',
//                                         },
//                                     ],
//                                 ],
//                             },
//                         },
//                     },
//                     'sass-loader'
//                 ]
//             },
//             {
//                 test: /\.(png|svg|jpg|gif)$/,
//                 use: ['file-loader']
//             }
//         ]
//     },
//     optimization: {
//         minimizer: [
//             new CssMinimizerPlugin(),
//             new UglifyJsPlugin(),
//         ],
//     },
//     resolve: {
//         extensions: ['.tsx', '.ts', '.js', '.jsx'],
//     },
//     devtool: isDev ? 'source-map' : false,
//     plugins: [
//         new MiniCssExtractPlugin({
//             filename: isDev ? '[name].css' : '[name].[contenthash].css',
//             chunkFilename: isDev ? '[id].css' : '[id].[contenthash].css',
//         }),
//         new htmlwebpackplugin({
//             template: './src/index.html'
//         }),
//         // new BundleAnalyzerPlugin({
//         //     analyzerMode: 'server',
//         //     analyzerHost: 'localhost',
//         //     analyzerPort: 8888,
//         //     reportFilename: 'report.html',
//         //     defaultSizes: 'parsed',
//         //     openAnalyzer: true,
//         //     generateStatsFile: false,
//         //     statsFilename: 'stats.json',
//         //     statsOptions: null,
//         //     logLevel: 'info'
//         //   })
//     ]
// }
module.exports = [ serverConfig ];