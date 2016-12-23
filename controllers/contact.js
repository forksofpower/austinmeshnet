'use strict'

let
    sg = require('sendgrid')(process.env.SENDGRID_API_KEY || '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')
  , async = require('async')
  , request = require('request')

let listId = 847856

const checkEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

class Contact {
  constructor(data) {
    // if (!firstName || !lastName || !email) return { message: 'All fields are required' }
    if (!this.isValidEmail(data.email)) return { message: 'Email is not valid'}
    else {
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.email = data.email;
    }
  }

  bark() {
      console.log(this)
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
        console.log(response.body)
        if (err) return done(err)
        else if (response.body.recipients.length > 0) return done({ message: 'Email already exists'})
        else {
          this.unique = true
          console.log('Email is unique!')
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
      console.log(response.body)
      if (err) return done(err)
      else {
        console.log(response.body.persisted_recipients[0])
        this.id = response.body.persisted_recipients[0]
        // console.log(this.id)
        return done()
      }
    })
  }

  addToMailingList(done) {
    let request = sg.emptyRequest()
    request.body = [this.id]
    request.method = 'POST'
    request.path = `/v3/contactdb/lists/${listId}/recipients`
    sg.API(request, (err, response) => {
      console.log(`Added to mailing list: ${response.body}`)
      return done()
    })
  }
}

module.exports.appendToMailingList = (email, done) => {
  // do something to the maiing list
  console.log('Email has been appended')
  done()
}

module.exports = Contact
