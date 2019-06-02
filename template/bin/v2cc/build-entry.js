const webpackDevConf = require('../webpack.dev.conf')

// only build js
module.exports = webpackDevConf[0]
