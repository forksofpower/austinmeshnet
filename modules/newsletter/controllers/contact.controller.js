'use strict'

let
    path      = require('path')
  , config    = require(path.resolve('./config/config'))
  , sg        = require('sendgrid')(config.sendGrid.api_key)
  , async     = require('async')
  , request   = require('request')

let listId = 847856

const checkEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

class Contact {
  constructor(data) {
    if (!this.isValidEmail(data.email)) return { message: 'Email is not valid'}
    else {
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.email = data.email;
    }
  }

  // Methods
  isValidEmail(email) {
    return (email) ? checkEmail.test(email) : checkEmail.test(this.email)
  }

  isUniqueEmail(done) {
    if (this.unique) return true
    else {
      let request = sg.emptyRequest({
        method: 'GET',
        path: `/v3/contactdb/recipients/search?email=${this.email}`
      })
      sg.API(request, (err, response) => {
        if (err) return done(err)
        else if (response.body.recipients.length > 0) return done({ message: 'Email already exists'})
        else {
          this.unique = true
          return done()
        }
      })
    }
  }

  createRecipient(done) {
    let recipients = [{
        first_name: this.firstName
      , last_name: this.lastName
      , email: this.email
    }]
    let request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/contactdb/recipients',
      body: recipients
    })
    sg.API(request, (err, response) => {
      if (err) return done(err)
      else {
        this.id = response.body.persisted_recipients[0]
        return done()
      }
    })
  }

  addToMailingList(done) {
    let request = sg.emptyRequest({
        method: 'POST'
      , path: `/v3/contactdb/lists/${listId}/recipients`
      , body: [this.id]
    })
    sg.API(request, (err, response) => { return done(err) })
  }
}

module.exports = Contact
