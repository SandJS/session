var mockery = require('mockery');
var sand = require('sand');

describe('Sessions', function() {
  var app;
  before(function(done) {
    mockery.enable({
      warnOnUnregistered: false
    });
    mockery.registerSubstitute('riak-js', 'riak-mock');

    var Session = require('../lib/Session');
    app = new sand({
      appPath: __dirname + '/app'
    })
    .use(require('sand-riak'), {})
    .use(Session, {
      all: {
        clientOptions: {
          bucket: 'sessions'
        }
      }
    })
    .start(done);
  });

  it('should save session', function(done) {
    var session = {
      test: true
    };

    global.sand.session.set('1', session, done);
  });

  it ('should get session', function(done) {
    global.sand.session.get('1', function(err, data) {
      data.test.should.be.ok;
      done();
    });
  });

  it('should destroy session', function(done) {
    global.sand.session.destroy('1');
    global.sand.session.get('1', function(err, data) {
      err.should.be.an.Object;
      done();
    });
  });

  after(function() {
    mockery.deregisterAll();
    mockery.disable();

    app.shutdown();
  });
});