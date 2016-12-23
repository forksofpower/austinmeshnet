'use strict'
let
    express = require('express')
  , router = express.Router()
  , async = require('async')
  , Contact = require('../controllers/contact.js')
  ;

router.post('/', (req, res, next) => {
  // console.log(req)
  let data = req.body
  let contact = new Contact(data)

  if (contact) {
    async.series([
      (cb) => {
        contact.isUniqueEmail((err) => {
          if (!err) {
            res.send(data)
          }
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
      if (err) return res.send(err)
      else return res.send({ email: req.body.email })
    })
  }
})

module.exports = router
