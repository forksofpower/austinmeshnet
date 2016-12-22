'use strict'
let
    express = require('express')
  , router = express.Router()
  , async = require('async')
  , Contact = require('../controllers/contact.js')
  ;

try {
  let person = new Contact({
    firstName: 'Patrick',
    lastName: 'Jones',
    email: 'forksofpower@gmail.com'
  })
  person.bark()
  person.createRecipient((err) => {
    if (err) console.log(err)
  })
  // person.bark()
} catch (err) {
  console.log(`error: ${err}`)
}

router.post('/', (req, res, next) => {
  // console.log(req)
  let data = req.body
  let contact = new Contact(data)

  if (contact) {
    async.series([
      (cb) => {
        contacts.isUniqueEmail((err) => { return cb(err) })
      },
      (cb) => {
        contacts.appendToMailingList((err) => { return cb(err) })
      },
    ], (err) => {
      if (err) return res.status(400).send(err)
      else return res.send({ email: req.body.email })
    })
  }
})

module.exports = router
