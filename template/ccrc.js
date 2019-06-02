const $path = require('path')
const { env, paths: { ccSrc, src }, [env]: { ccAssetsRoot, ccAssetsPublicPath } } = require('./bin/config')

module.exports = [{
  "name": $path.join(ccSrc, '*'),
  "template": "loading-partial",
  "temps": ["library", "local", "temp", "build-templates", "packages"],
  "platforms": [{
    "buildPath": ccAssetsRoot,
    "platform": "web-mobile",
    "sfcPath": $path.join(src, 'cc-components'),
    "buildParams": {
      "webOrientation": "Landscape"
    },
    "publicPath": ccAssetsPublicPath
  }],
  "app": "/Applications/CocosCreator.app/Contents/MacOS/CocosCreator"
}]
