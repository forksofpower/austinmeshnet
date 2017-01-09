'use strict'
let
    path = require('path')
  , express = require('express')
  , router = express.Router()
  , async = require('async')
  , Contact = require(path.resolve('modules/newsletter/controllers/contact.controller.js'))
  ;

router.post('/', (req, res, next) => {
  let data = req.body
  let contact = new Contact(data)

  if (contact) {
    async.series([
      (cb) => {
        contact.isUniqueEmail((err) => {
          // finish user request
          if (!err) { res.send(data) }
          return cb(err)
        })
      },
      (cb) => {
        contact.createRecipient((err) => { return cb(err) })
      },
      (cb) => {
        contact.addToMailingList((err) => { return cb(err) })
      },
    ], (err) => {
      // deal with any errors here
      if (err) return res.send(err)
      // else return res.send({ email: req.body.email })
    })
  }
})

module.exports = router
