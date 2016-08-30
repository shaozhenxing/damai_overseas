'use strict'

var merge = require('webpack-merge')
var webpack= require('webpack')

var webpack_config = require('./webpack.config.base')

// console.log(webpack_config({ debug: true }))

module.exports = merge(webpack_config({ debug: false }))