var apisend = require('./lib.js')

var request = require('supertest')
require('should')

describe('apisend basic', function() {
  var app,
    closer;

  before(function(done) {
    var express = require('express')
    app = express()

    app.use(apisend())
    app.get('/', function(req, res) {
      res.apisend(0)
    })
    app.get('/empty_conts', function(req, res) {
      res.apisend(0)
    })
    app.get('/string_conts', function(req, res) {
      res.apisend(0, 'some_result')
    })
    closer = app.listen(3000, done)
  })

  it('should send a basic 200 response', function(done) {
    request(app).get('/').expect(200).end(function(err, res) {
      if (err) return done(err)
      res.body.should.have.property('status', 'ok')
      done()
    })
  })

  it('should n\'t include any content in the response', function(done) {
    request(app).get('/empty_conts').expect(200).end(function(err, res) {
      if (err) return done(err)
      res.body.should.have.property('status', 'ok')
      res.body.should.not.have.property('response')
      done()
    })
  })

  it('should have content in this response', function(done) {
    request(app).get('/string_conts').expect(200).end(function(err, res) {
      if (err) return done(err)
      res.body.should.have.property('status', 'ok')
      res.body.should.have.property('response', 'some_result')
      done()
    })
  })

  after(function(done) {
    closer.close(done)
  })
})


describe('apisend error codes', function() {
  var app,
    closer;
  
  before(function(done) {
    var express = require('express')
    app = express()

    var errors = {
      UNAUTH: {
        http: 401,
        code: 1,
        response: 'You are not authorized'
      }
    }
    app.use(apisend(errors, true))
    app.get('/', function(req, res) {
      res.apisend(0)
    })
    app.get('/unauthorized', function(req, res) {
      res.apisend(1)
    })
    app.get('/unauthorized_meta', function(req, res) {
      res.apisend(1, 'Some meta')
    })
    closer = app.listen(3000, done)
  })

  it('should send a basic 200 response', function(done) {
    request(app).get('/').expect(200).end(function(err, res) {
      if (err) return done(err)
      res.body.should.have.property('status', 'ok')
      done()
    })
  })

  it('should work with a basic error code', function(done) {
    request(app).get('/unauthorized').expect(401).end(function(err, res) {
      if (err) return done(err)
      res.body.should.have.property('status', 'fail')
      res.body.should.have.property('response', 'You are not authorized')
      res.body.should.have.property('code', '1')
      done()
    })
  })

  it('should work with an error code and some meta', function(done) {
    request(app).get('/unauthorized_meta').expect(401).end(function(err, res) {
      if (err) return done(err)
      res.body.should.have.property('status', 'fail')
      res.body.should.have.property('response', 'You are not authorized')
      res.body.should.have.property('meta', 'Some meta')
      res.body.should.have.property('code', '1')
      done()
    })
  })

  after(function(done) {
    closer.close(done)
  })

})