'use strict'
let
    express = require('express')
  , router = express.Router()
  , async = require('async')
  , contacts = require('../controllers/contacts.controller.js')
  ;


router.post('/', (req, res, next) => {
  // console.log(req)
  async.series([
    (cb) => {
      contacts.isValidEmail(req.body.email, (err) => { return cb(err) })
    },
    (cb) => {
      contacts.isUniqueEmail(req.body.email, (err) => { return cb(err) })
    },
    (cb) => {
      contacts.appendToMailingList(req.body.email, (err) => { return cb(err) })
    },
  ], (err) => {
    if (err) return res.status(400).send(err)
    else return res.send({ email: req.body.email })
  })
})

module.exports = router
