'use strict'
let
    express = require('express')
  , router = express.Router()
  , async = require('async')
  , emails = require('../controllers/emails.controller.js')
  ;


router.post('/', (req, res, next) => {
  // console.log(req)
  async.series([
    (cb) => {
      emails.isValidEmail(req.body.email, (err) => { return cb(err) })
    },
    (cb) => {
      emails.isUniqueEmail(req.body.email, (err) => { return cb(err) })
    },
    (cb) => {
      emails.appendMailingList(req.body.email, (err) => { return cb(err) })
    },
  ], (err) => {
    if (err) return res.status(400).send(err)
    else return res.send({ email: req.body.email })
  })
})

module.exports = router
