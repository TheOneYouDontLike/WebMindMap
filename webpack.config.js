var webpack = require('webpack');

var commonsPlugin =
  new webpack.optimize.CommonsChunkPlugin('common.js');

module.exports = {
    entry: './components/app.jsx',
    output: {
        filename: './public/app.bundle.js'
    },
    module: {
        loaders: [
          { test: /\.jsx$/, loader: 'jsx-loader?harmony' } // loaders can take parameters as a querystring
        ]
    },
    resolve: {
        // you can now require('file') instead of require('file.coffee')
        extensions: ['', '.js', '.jsx', '.json', '.coffee']
    },
    plugins: [commonsPlugin]
};