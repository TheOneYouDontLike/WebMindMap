var webpack = require('webpack');

var commonsPlugin =
  new webpack.optimize.CommonsChunkPlugin('common', 'common.js');

module.exports = {
    entry: {
        app: ['./components/app.jsx'],
        common: ['react', 'superagent', 'lodash']
    },
    output: {
        path: './public',
        filename: 'app.bundle.js'
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