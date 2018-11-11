const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
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
        };

        this.addParam(this.webpackConfig, 'module', {});
        this.addParam(this.webpackConfig, 'resolve', {});
        this.addParam(this.webpackConfig, 'plugins', []);
        this.addParam(this.webpackConfig.module, 'rules', []);
        this.addParam(this.webpackConfig.resolve, 'extensions', []);
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

    _attachSass() {
        this.webpackConfig.module.rules.push({
            test: /\.scss$/,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader'
            ]
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
            new ExtractTextPlugin({
                filename: 'main.css',
                disable: true
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
    .attachSass()
    .build();

const webpackConfig = webpackConfigurator.webpackConfig;
console.log(webpackConfig);
console.log(webpackConfig.module);

console.log("")
console.log("")
module.exports = webpackConfig;