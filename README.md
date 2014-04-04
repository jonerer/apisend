apisend
=======

A small library to extend express's res.send function. It's meant to standardize API responses.

The main use case is to add some granularity in error messages -- just responding 401 or 404 isn't saying enough.

This package could be paired with its cousin testing package [apitest](https://github.com/lulzmachine/apitest)


###Usage:

```
  var app = require('express')(), apisend = require('apisend'),
    errors = {
      NO_USER: { code: 1, http: 404, response: 'No such user found' },
      NO_GROUP: { code: 2, http: 404, response: 'No such group found' }
    }

  app.use(apisend(errors, true))

  app.get('/groups/:group_id/add_member/:user_id', function(req, res) {
    // maybe that group isn't found
    res.apisend(errors.NO_GROUP)
    // HTTP 404 - { status: 'fail', code: 2, response: 'No such group found' }

    // maybe that user isn't found
    res.apisend(errors.NO_USER, 'Some metadata')
    // HTTP 404 - { status: 'fail', code: 1, response: 'No such user found', meta: 'Some metadata' }

    // maybe it was successful
    res.apisend(0)
    // HTTP 200 - { status: 'ok' }

    // maybe we want to send some data
    res.apisend(0, { number_of_users: 5 })
    // HTTP 200 - { status: 'ok', response: { number_of_users: 5} }
  })

  app.listen(3000)
```
