const $path = require('path')
const webpack = require('webpack')
const { getFilename } = require('./utils')

exports.getDefinePlugin = function () {
  return new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.CC_DEV':  JSON.stringify(process.env.CC_DEV),
  })
}

exports.getCleanPlugin = function (...paths) {
  const CleanWebpackPlugin = require('clean-webpack-plugin');

  return new CleanWebpackPlugin(paths, { allowExternal: true })
}

exports.getCopyPlugin = function (isdev) {
  const $fs = require('fs')
  const crypto = require('crypto')
  const CopyWebpackPlugin = require('copy-webpack-plugin')
  const { paths: { src }, env, [env]: { assetsRoot, assetsPublicPath } } = require('./config')
  const manifsetImg = {}

  return new CopyWebpackPlugin([{
    context: $path.join(src, 'assets/img'),
    from: '**/*',
    to: $path.join(assetsRoot, 'assets/img', getFilename(isdev, '[hash:7]', '[ext]', '[path]')),
    transform (content, filepath) {
      const hash = crypto.createHash('md5').update(content).digest('hex').slice(0, 7)
      const ext = $path.extname(filepath)
      const dir = $path.dirname(filepath)
      const basename = $path.basename(filepath, ext)
      const relativePath = $path.relative(src, dir)
      const imgPathNoHash = relativePath + '/' + basename + ext
      const imgPath = relativePath + '/' + basename + '-' + hash + ext

      manifsetImg[assetsPublicPath + imgPathNoHash] = assetsPublicPath + imgPath
      $fs.writeFileSync($path.join(assetsRoot, 'manifest-img.json'), JSON.stringify(manifsetImg, null, 2))

      return content
    }
  }, {
    from: $path.join(src, 'public'),
    to: $path.join(assetsRoot, 'public')
  }])
}

exports.getManifestPlugin = function (path, assetsPublicPath, ext = 'js') {
  const ManifestPlugin = require('webpack-manifest-plugin')
  const isSourceMap = basename => basename.match(new RegExp(`-([0-9a-f]+)\\.${ext}\\.map$`))
  const addStamp = url => {
    const basename = $path.basename(url)
    const match = basename.match(new RegExp(`-([0-9a-f]+)\\.${ext}$`))
    if (match) {
      const hash = match[1]
      if (hash) {
        url = url + '?v=' + hash
      }
    }
    return url
  }

  return new ManifestPlugin({
    fileName: `manifest-${ext}.json`,
    basePath: $path.resolve(path) + '/',
     /**
      给 js 文件加上 ?v= 哈希值,
      解决cdn 匹配到旧文件的问题
    */
    generate: function (manifest, files) {
      files.forEach(file => {
        if (isSourceMap($path.basename(file.path))) return manifest

        const url = addStamp(file.path)
        const name = $path.join(assetsPublicPath, file.name.replace(path, ''))

        manifest[name] = url.replace(path, assetsPublicPath)
      })
      return manifest
    }
  })
}

exports.getDevHelperPlugins = function () {
  const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
  const WebpackNotifierPlugin = require('webpack-notifier')

  return [
    new WebpackNotifierPlugin(),
    new FriendlyErrorsWebpackPlugin()
  ]
}

exports.getProdHelperPlugins = function () {
  return [
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
}
