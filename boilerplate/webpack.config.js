const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

class WebpackConfigurator {
    constructor(mainConfig) {
        this.webpackConfig = mainConfig || {};

        this.configAttachments = {
            typescript: false,
            javascript: false,
            sass: false,
            css: false,
            fileExtensions: [
                'svg',
                'jpg',
                'png',
                'woff2',
                'ttf',
                'gif'
            ],
            jsOptimization: true,
        };

        this.addParam(this.webpackConfig, 'optimization', {});
        this.addParam(this.webpackConfig, 'module', {});
        this.addParam(this.webpackConfig, 'resolve', {});
        this.addParam(this.webpackConfig, 'plugins', []);
        this.addParam(this.webpackConfig.module, 'rules', []);
        this.addParam(this.webpackConfig.resolve, 'extensions', []);
        this.addParam(this.webpackConfig.optimization, 'minimizer', []);
    }

    isProd() {
        const { NODE_ENV } = process.env;
        if (NODE_ENV !== 'production' && NODE_ENV !== 'development') {
            throw new Error('Must set NODE_ENV to either production or development.');
        }

        return NODE_ENV === 'production';
    }

    build() {
        for (const configAttachment in this.configAttachments) {
            if (this.configAttachments[configAttachment] === undefined) {
                continue;
            }

            if (this.configAttachments[configAttachment] instanceof Array === false &&
                this.configAttachments[configAttachment] !== true) {
                continue;
            }

            this._runMethod(configAttachment);
        }
    }

    attachTypescript() {
        this.configAttachments.typescript = true;
        return this;
    }

    attachJavascript() {
        this.configAttachments.javascript = true;
        return this;
    }

    attachSass() {
        this.configAttachments.sass = true;
        return this;
    }

    attachCss() {
        this.configAttachments.css = true;
        return this;
    }

    attachJsOptimization() {
        this.configAttachments.jsOptimization = true;
        return this;
    }

    _attachTypescript() {
        this.webpackConfig.module.rules.push({
            test: /\.tsx?$/,
            use: 'awesome-typescript-loader',
            exclude: /node_modules/
        });

        this.webpackConfig.resolve.extensions = this.webpackConfig.resolve.extensions.concat([ '.tsx', '.ts', '.js' ]);
    }

    _attachJavascript() {
        this.webpackConfig.module.rules.push({
            test: /\.(js|jsx)$/,
            use: 'babel-loader',
            exclude: /node_modules/
        });
    }

    _attachCss() {
        this.webpackConfig.module.rules.push({
            test: /\.css/,
            use: [{
                loader: 'css-loader',
                options: {
                    sourceMap: true,
                    // Enable CSS Modules to scope class names
                    // modules: true,
                    minimize: this.isProd(),
                    importLoaders: 1,
                }
            }, {
                // Adjust URLs in CSS files so that they are relative to the source file rather than the output file
                loader: 'resolve-url-loader'
            }],
            // Do not extract in development mode for hot reloading
            fallback: 'style-loader'
        });
    }

    _attachSass() {
        this.webpackConfig.module.rules.push({
            test: /\.scss$/,
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: "css-loader",
                    options: {
                        url: false,
                        sourceMap: true,
                        modules: false,
                    }
                },
                {
                    loader: "sass-loader",
                    options: {
                        sourceMap: true
                    }
                }
            ],
        });
    }

    _attachFileExtensions() {
        const fileExtensionsObj = {
            test: `/\\.(${this.configAttachments.fileExtensions.join('|')})$/`,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            }]
        };

        this.webpackConfig.module.rules.push(fileExtensionsObj);
    }

    _attachJsOptimization() {
        this.webpackConfig.optimization.minimizer.push(
            new UglifyJsPlugin({
                sourceMap: true,
                parallel: true,
                extractComments: true,
            })
        );
    }

    _runMethod(configMethodName) {
        const configAttachmentMethodName = `_attach${configMethodName.replace(/^\w/, c => c.toUpperCase())}`;

        this[configAttachmentMethodName]();
    }

    addParam(obj, param, value) {
        if (value === undefined) {
            value = {};
        }

        if (obj === undefined) {
            obj = {};
        }

        if (obj[param] === undefined) {
            obj[param] = value;
        }

        return obj;
    }
}

const mainConfig = {
    entry: {
        app: './src/index.tsx'
    },
    mode: 'development',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './distTest')
    },
};

const webpackConfigurator = new WebpackConfigurator(
    {
        entry: mainConfig.entry,
        output: mainConfig.output,
        mode: mainConfig.mode,
        devtool: 'inline-source-map',
        optimization: {
            usedExports: true,
        },
        devServer: {
            contentBase: mainConfig.output.path,
            hot: true,
            port: 8765,
            historyApiFallback: true,
            publicPath: '/',
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "[name].[hash].css",
            }),
            new CleanWebpackPlugin([mainConfig.output.path]),
            new HtmlWebpackPlugin({
                template: 'src/index.ejs',
                inject: 'body'
            }),
            new webpack.HotModuleReplacementPlugin(),
            // new UglifyWebpackPlugin({
            //     sourceMap: true,
            //     uglifyOptions: {
            //         ecma: 8,
            //         safari10: true
            //     }
            // })
        ]
    }
);

webpackConfigurator
    .attachTypescript()
    // .attachJavascript()
    // .attachCss()
    .attachSass()
    .build();

const webpackConfig = webpackConfigurator.webpackConfig;
console.log(webpackConfig);
console.log(webpackConfig.module);

console.log("")
console.log("")
module.exports = webpackConfig;