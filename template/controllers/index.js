const router = require('express').Router()

router.get('/', function (req, res) {
  res.render('pages/index/index')
})

module.exports = router
