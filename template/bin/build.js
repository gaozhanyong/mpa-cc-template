require('colors')
const ora = require('ora')
const webpack = require('webpack')
const { isPlainObj, webpackCallback } = require('./utils')
const { isdev, env } = require('./config')
const confPath = require.resolve('./webpack.' + env + '.conf.js')

if (process.env.PARALLEL) {
  const run = require('parallel-webpack').run
  const spinner = ora('Building Javascript and Stylus and Jade...\n'.bold.yellow)
  spinner.start()

  run(confPath, {
    watch: false,
    maxRetries: 3,
    stats: true,
    maxConcurrentWorkers: 2
  }, function () {
    // console.log('Parallel build completely!!!'.bold.green)
    process.stdout.write('Parallel build completely!!!'.bold.green)
    spinner.stop()
    process.exit(0)
  })
} else {
  const configs = require(confPath)
  const spinner1 = ora('Building Javascript and Stylus...\n'.bold.yellow)
  const spinner2 = ora('Building Jade...\n'.bold.yellow)
  const js = configs[0]
  const stylus = configs[1]
  const jade = configs[2]

  spinner1.start()

  // callback hell
  webpack([js, stylus], function (err, stats) {
    webpackCallback(err, stats, function () {
      spinner1.stop()
      spinner2.start()
      webpack(jade, function (err, stats) {
        webpackCallback(err, stats, function () {
          spinner2.stop()
        })
      })
    })
  })
}

