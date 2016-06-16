'use strict'
var HtmlWebpackPlugin = require("html-webpack-plugin")
var path = require('path')
var _ = require('lodash')
let localConfig = function () {
  return {}
}
try {
  localConfig = require(__dirname + '/config/webpack/environments/local')
}
catch (e) {
}
var _configs = {

  // global section
  global: require(__dirname + '/config/webpack/global'),

  // config by enviroments
  production: require(__dirname + '/config/webpack/environments/production'),
  development: require(__dirname + '/config/webpack/environments/development'),
  local: localConfig
}

var _load = function () {
  var ENV = process.env.NODE_ENV
    ? process.env.NODE_ENV
    : 'production'

  console.log('Current Environment: ', ENV)

  // load config file by environment
  var webpackConfigs = _.merge(
    _configs.global(__dirname),
    _configs[ENV](__dirname),
    _configs.local(__dirname)
  )

  webpackConfigs.plugins = webpackConfigs.plugins.concat([
    new HtmlWebpackPlugin({
      rootUrlPath: webpackConfigs.rootUrlPath || '',
      filename: 'index.html',
      template: path.join(__dirname, 'src', 'index.html.ejs')
    })
  ])
  return webpackConfigs
}

module.exports = _load()
