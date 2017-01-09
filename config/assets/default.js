'use strict'

module.exports = {
  client: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.css',
        'public/lib/sweetalert/dist/sweetalert.css',
        'public/lib/font-awesome/css/font-awesome.min.css'
      ],
      js: [
        'public/lib/sweetalert/dist/sweetalert.min.js'
      ]
    },
    css: [
      'modules/*/client/css/*.css'
    ]
  },
  server: {
    gulpConfig: 'gulpfile.js',
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    config: 'modules/*/server/config/*.js',
    views: 'modules/*/server/views/*.jade'
  }
}
