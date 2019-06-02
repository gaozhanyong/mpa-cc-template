require('colors')
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const useragent = require('express-useragent')
const morgan = require('morgan')

const { isdev, env, [env]: { assetsPublicPath, assetsRoot, ccAssetsPublicPath, ccAssetsRoot, port } } = require('./bin/config')
{{#if_eq useproxy true}}
const proxy = require('./proxy')
{{/if_eq}}

const app = express()
const setLocals = locals => Object.keys(locals).forEach(key => app.locals[key] = locals[key])

app.set('views', assetsRoot)
app.set('view engine', 'jade')

if (isdev) {
  console.log('Using Development Env Config'.cyan.inverse)
  require('./bin/hmr')(app, assetsPublicPath)
  app.use(morgan('dev'))
  app.use(require('./mock'))
} else {
  console.log('Using Production Env Config'.red.inverse)
}

setLocals({
  isdev: isdev,
  pretty: isdev
})
{{#if_eq useproxy true}}
proxy(app)
{{/if_eq}}

// use middleware
app.use(cookieParser())
app.use(useragent.express())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

// static assets
app.use(assetsPublicPath, express.static(assetsRoot))
app.use(ccAssetsPublicPath, express.static(ccAssetsRoot))

require('./middlewares')(app)

app.use(require('./controllers'))

// 404 error handler
app.use(function (req, res) {
  res.status(404)
  res.render('common/html/404')
})

// 500 error handler
app.use(function (err, req, res, next) {
  res.status(500)
  res.render('common/html/500', {
    error: err
  })
})

app.listen(port, function () {
  const pkg = require('./package.json')
  console.log(pkg.name + ' started on port ' + String(port).red.bold + '...')
})
