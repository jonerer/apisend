module.exports = function(errors) {
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
      if (code === 0) {
        var toRespond = {
          status: 'ok',
          response: contents
        }
        res.send(200, toRespond)
      } else {
        var error = getError(code)
        var conts = typeof(contents) == 'undefined' ? error.response : contents
        var toRespond = {
          status: 'fail',
          response: conts,
          code: code
        }
        res.send(error.http, toRespond)
      }
    }

    res.apisend = apisend
    next()
  }

}