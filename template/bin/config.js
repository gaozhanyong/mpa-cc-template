const $path = require('path');

require('colors')

const resolve = function (dir = '') {
  return $path.join(process.cwd(), dir)
}

const DEV_ALIAS = 'development'
const PROD_ALIAS = 'production'
const DEV = 'dev'
const PROD = 'prod'
const IS_DEV = process.env.NODE_ENV === 'production' ? false : true

module.exports = {
  isdev: IS_DEV,
  env: IS_DEV ? DEV : PROD,
  paths: {
    src: resolve('src'),
    ccSrc: resolve('cocos'),
    build: resolve('build'),
    root: resolve(),
    cache: resolve('build/tmp'),
  },
  [DEV]: {
    env: {
      NODE_ENV: DEV_ALIAS
    },
    port: {{ port }},
    assetsRoot: resolve('build/dev'),
    assetsPublicPath: '/static/',
    ccAssetsRoot: resolve('build/cocos'),
    ccAssetsPublicPath: '/cc-static/'
  },
  [PROD]: {
    env: {
      NODE_ENV: PROD_ALIAS
    },
    port: {{ port }},
    assetsRoot: resolve('build/prod'),
    assetsPublicPath: '/static/',
    ccAssetsRoot: resolve('build/cocos'),
    ccAssetsPublicPath: '/cc-static/'
  },
  externals: {
    'vue': 'Vue',
    'vuex': 'Vuex',
    'vue-router': 'VueRouter',
    'moment': 'moment',
    'axios': 'axios'
  },
  alias: {
    '@': resolve('src')
  }
}
