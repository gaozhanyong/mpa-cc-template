const config = require('./config')
const { isdev, paths: { src, cache }, env, [env]: { assetsRoot, assetsPublicPath } } = config
const base = require('./base')
const loaders = require('./loaders')
const plugins = require('./plugins')
const loaderWithPlugins = require('./loader-with-plugins')
const { getFilesByExt, getFilename } = require('./utils')
const { getIOPathWhenDevCc } = require('./v2cc/dev-v2cc')

const configs = []

const pugLoader = loaders.getPugLoaders()
const jsLoader = loaders.getJsLoaders(cache)
const imgLoader = loaders.getImgLoaders(isdev)
const fontLoader = loaders.getFontLoaders(isdev)
const mediaLoader = loaders.getMediaLoaders(isdev)

const copyPlugin = plugins.getCopyPlugin(isdev)
const definePlugin = plugins.getDefinePlugin()
const cleanPlugin = plugins.getCleanPlugin(assetsRoot)

const tsLoaderWithPlugins = loaderWithPlugins.getTsLoaderWithPlugins()
const vueLoaderWithPlugins = loaderWithPlugins.getVueLoaderWithPlugins()
const stylLoaderMaybeWithPlugins = loaderWithPlugins.getStylLoaderMaybeWithPlugins(isdev, false)
const stlyLoaderWithPluginsAsEntryHandler = loaderWithPlugins.getStlyLoaderMaybeWithPluginsAsEntryHandler(isdev, true)
const jadeLoaderWithPlugins = loaderWithPlugins.getJadeLoaderWithPlugins(isdev, assetsRoot)

// javascript
configs.push(Object.assign({}, getIOPathWhenDevCc(env), base, {
  resolve: {
    alias: config.alias,
    modules: ['node_modules'],
    mainFields: ['main', 'module', 'browser'],
    extensions: ['.js', '.json', '.ts']
  },
  externals: config.externals,
  module: {
    rules: [tsLoaderWithPlugins.loaders, pugLoader, jsLoader, stylLoaderMaybeWithPlugins.loaders, imgLoader, fontLoader, mediaLoader, vueLoaderWithPlugins.loaders]
  },
  plugins: [definePlugin, cleanPlugin, copyPlugin, ...vueLoaderWithPlugins.plugins, ...stylLoaderMaybeWithPlugins.plugins, ...tsLoaderWithPlugins.plugins]
}))

// stylus
configs.push(Object.assign({}, base, {
  entry: getFilesByExt('.styl', { path: src, skips: ['_'] }),
  output: {
    path: assetsRoot,
    filename: getFilename(isdev, true, 'css'),
    publicPath: assetsPublicPath
  },
  module: {
    rules: [stlyLoaderWithPluginsAsEntryHandler.loaders, imgLoader, fontLoader]
  },
  plugins: [...stlyLoaderWithPluginsAsEntryHandler.plugins]
}))

// jade
configs.push(Object.assign({}, base, {
  entry: getFilesByExt('.jade', { path: src }),
  output: {
    path: assetsRoot,
    filename: getFilename(true, false, 'jade'),
    publicPath: assetsPublicPath
  },
  module: {
    rules: [jadeLoaderWithPlugins.loaders, imgLoader, fontLoader, mediaLoader, stylLoaderMaybeWithPlugins.loaders]
  },
  plugins: [...jadeLoaderWithPlugins.plugins, ...stylLoaderMaybeWithPlugins.plugins]
}))

module.exports = configs
