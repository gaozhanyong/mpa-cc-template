const merge = require('webpack-merge')
const { env, [env]: { assetsRoot, assetsPublicPath } } = require('./config')
const baseConfs = require('./webpack.base.conf')
const plugins = require('./plugins')
const prodPlugins = plugins.getProdHelperPlugins()

const jsManifest = plugins.getManifestPlugin(assetsRoot, assetsPublicPath, 'js')
const cssManifest = plugins.getManifestPlugin(assetsRoot, assetsPublicPath, 'stylus')

baseConfs[0].plugins = prodPlugins.concat(baseConfs[0].plugins).concat(jsManifest)
baseConfs[1].plugins = prodPlugins.concat(baseConfs[1].plugins).concat(cssManifest)

module.exports = baseConfs
