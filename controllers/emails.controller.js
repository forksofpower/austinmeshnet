'use strict'

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

module.exports.isValidEmail = (email, done) => {
  // check for valid email
  console.log('Email is valid')
  if (!email) return done({ message: 'No email provided' })
  else if (!email.match(EMAIL_REGEX)) return done({ message: 'Not a valid email' })
  else return done()
}

module.exports.isUniqueEmail = (email, done) => {
  // check for unique email
  console.log('Email is unique')
  done()
}

module.exports.appendMailingList = (email, done) => {
  // do something to the maiing list
  console.log('Email has been appended')
  done()
}
