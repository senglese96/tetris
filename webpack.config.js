const path = require('path')

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname), // NEW
        filename: './main.js'
    },
    devtool: 'inline-source-map',
    resolve: {
        extensions: [".js", '.jsx', '*']
    }
};