apisend
=======

A small library to extend express's res.send function. It's meant to standardize API responses.


###Usage:

  var app = require('express')(),
    apisend = require('./lib'),
    errors = {
      NO_USER: { code: 1, http: 404, response: 'No such user found' },
      NO_GROUP: { code: 2, http: 404, response: 'No such group found' }
    }

  app.use(apisend(errors))

  app.get('/groups/:group_id/add_member/:user_id', function(req, res) {
    // maybe that group isn't found
    res.apisend(errors.NO_GROUP)
    // response: HTTP 404, contents { status: 'fail', code: 2, response: 'No such group found' }

    // maybe that user isn't found
    res.apisend(errors.NO_USER)
    // response: HTTP 404, contents { status: 'fail', code: 1, response: 'No such user found' }

    // maybe it was successful
    res.apisend(0)
    // response: HTTP 200, contents { status: 'ok' }

    // maybe we want to send some data
    res.apisend(0, { number_of_users: 5 })
    // response: HTTP 200, contents { status: 'ok', response: { number_of_users: 5} }
  })

  app.listen(3000)

