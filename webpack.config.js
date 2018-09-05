'use strict';
const path = require('path');

module.exports = [{
    target: 'node',
    mode: "production",
    externals: [
      /^[a-z\-0-9]+$/ // Ignore node_modules folder
    ],
    output: {
        filename: 'index.js', // output file
        path: path.join(__dirname,"/build"),
        libraryTarget: "commonjs"
    },
    entry: './test.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: [ '.ts', '.tsx', '.js' ],
        modules: [
            path.join(__dirname,"/node_modules"),
            'node_modules'
        ]
    }
},
{
    target: 'node',
    mode: "production",
    externals: [
        /^[a-z\-0-9]+$/ // Ignore node_modules folder
    ],
    output: {
        filename: 'swader.js', // output file
        path: __dirname,
        libraryTarget: "commonjs"
    },
    entry: './swader/index.ts',
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'ts-loader',
            options: {
                configFile: 'lib.tsconfig.json'
            }
        }]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        modules: [
            path.join(__dirname, "/node_modules"),
            'node_modules'
        ]
    }
}]
