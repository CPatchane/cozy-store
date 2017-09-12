'use strict'

const {production} = require('./webpack.vars')
const path = require('path')

module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/,
        include: /(sprites|icons)/,
        loader: 'svg-sprite-loader',
        options: {
          name: '[name]_[hash]'
        }
      },
      {
        test: /\.(png|gif|jpe?g|svg)$/i,
        exclude: /(sprites|icons)/,
        loader: `file-loader`,
        options: {
          path: 'img',
          name: `[name]${production ? '.[hash]' : ''}.[ext]`
        }
      }
    ]
  }
}
