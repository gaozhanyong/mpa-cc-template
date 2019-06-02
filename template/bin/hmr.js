require('colors')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require("webpack-hot-middleware")

const configs = require('./webpack.dev.conf')
const { isPlainObj, webpackCallback } = require('./utils')

module.exports = function (app, publicPath) {
  const js = configs[0]
  const useDevMiddleware = compiler => {
    app.use(webpackDevMiddleware(compiler, {
      noInfo: true,
      publicPath,
      lazy: false,
      logLevel: 'info', // debug
    }))
  }

  if (process.env.HMR) {
    console.log('Using HMR')
    const jsEntries = js.entry
    const devclient = '../bin/dev-client.js'// require('webpack-hot-middleware/client')

    js.plugins = js.plugins.concat([
      new webpack.HotModuleReplacementPlugin(),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ])
    if (isPlainObj(jsEntries)) {
      Object.keys(jsEntries).forEach(entry => {
        jsEntries[entry] = [devclient].concat(jsEntries[entry])
      })
    } else if (Array.isArray(js.entry) ||
      typeof js.entry === 'string') {
      js.entry = [devclient].concat(js.entry)
    } else {
      throw new Error('[Error]: configs[0].entry error: ' + js.entry)
    }

    const compiler = webpack(js)

    useDevMiddleware(compiler)

    app.use(webpackHotMiddleware(compiler, {
      path: publicPath,
      timeout: 3000,
      overlay: true,
      reload: true,
      noInfo: false,
      quiet: false,
      autoConnect: true,
      heartbeat: 1000
    }))
  } else {
    const compiler = webpack(js)
    useDevMiddleware(compiler)
  }

  if (process.env.PARALLEL) {
    const run = require('parallel-webpack').run

    run(require.resolve('./webpack.dev.conf'), {
      watch: true,
      maxRetries: 3,
      stats: true,
      maxConcurrentWorkers: 2
    })
  } else {
    webpack(configs.slice(0, 1), webpackCallback)

    if (process.env.WEBPACK === 'js') {
      console.log('Only compile js'.red.bold)
    } else {
      // callback hell
      webpack(configs.slice(1), function (err, stats) {
        webpackCallback(err, stats, function () {
          console.log('Compile all completely!!!'.bold.green)
        })
      })
    }
  }
}



