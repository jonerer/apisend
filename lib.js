module.exports = function(errors, send_meta) {
  function getError(code) {
    for (var key in errors) {
      if (errors[key].code === code) {
        return errors[key]
      }
    }
    // TODO: handle this case. seems like there was no valid 'code'. 
    // Something like internal server error then. or an object with code: 'undefined' (not the value, the string.)
  }

  return function(req, res, next) {
    function apisend(code, contents) {
      if ('object' === typeof code) {
        code = code.code
      }
      if (code === 0) {
        var toRespond = {
          status: 'ok',
          response: contents
        }
        res.send(200, toRespond)
      } else {
        var error = getError(code)
        var conts = error.response
        var toRespond = {
          status: 'fail',
          response: conts,
          code: code
        }
        if (send_meta) {
          if (typeof(contents) === 'string') {
            toRespond.meta = contents
          } else if (typeof(contents) === 'object' && typeof(contents.message) === 'string') {
            toRespond.meta = contents.message
          }
        }
        res.send(error.http, toRespond)
      }
    }

    res.apisend = apisend
    next()
  }

}