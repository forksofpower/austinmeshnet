'use strict'
let express = require('express')
let router = express.Router()

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {
    title: 'Austin Mesh Network',
    links: [
      { site: 'reddit', url: 'https://reddit.com/r/austinmeshnet'},
    ]
  });
});

module.exports = router;
