const proxy = require('express-http-proxy')
const proxyTable = require('./proxy-table')
const { isdev, env } = require('./bin/config')
const hostalias = isdev ? env : process.env.HOSTALIAS || 'prod'
const useProxy = app => (path, uri) => app.use(path, proxy(uri))

if (typeof window !=='undefined')
  console.error('You SHOULD NOT require proxy.js in client-side js!!!');

module.exports = function (app) {
  const _useProxy = useProxy(app)
  Object.entries(proxyTable[env]).forEach(entry => {
    _useProxy(...entry)
  })
}
