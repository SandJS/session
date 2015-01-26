var SandGrain = require('sand-grain');
var noop = function() {};

/**
 * Create A new Session Management Object
 *
 * @param {string} [sessionId] Load this session Id
 * @param {object} [options] if config is passed we merge with defaults, otherwise we use defaults
 * @param {function} [cb] Optional Callback
 *
 * @constructor
 */

exports = module.exports = SandGrain.extend({

  name: 'session',

  construct: function () {
    this.super();
    this.defaultConfig = require('./defaultConfig');
    this.version = require('../package').version;
  },

  init: function(config, done) {
    this.super(config);

    this.client = new this.config.client(this.config);
    this.prefix = this.config.prefix || 'sess:';

    done();
  },

  /**
   * Attempt to fetch session by the given `sid`.
   *
   * @param {String} sid
   * @param {Function} fn
   * @api public
   */
  get: function(sid, fn) {
    var psid = this.prefix + sid;

    if (!fn) {
      fn = noop;
    }

    this.log('GET "%s"', sid);

    this.client.get(psid, function(err, data) {
      if (err) {
        if (err.statusCode === 404) {
          return fn();
        }

        return fn(err);
      }

      if (!data) {
        return fn();
      }

      try {
        var result = typeof data === 'object' ? data : JSON.parse(data);
      } catch(e) {
        return fn(err);
      }

      return fn(null, result);
    });
  },

  /**
   * Commit the given `sess` object associated with the given `sid`.
   *
   * @param {String} sid
   * @param {Session} sess
   * @param {Function} fn
   * @api public
   */
  set: function(sid, sess, fn) {
    var psid = this.prefix + sid;

    if (!fn) {
      fn = noop;
    }

    try {
      var jsess = JSON.stringify(sess);
    } catch (er) {
      return fn(er);
    }

    this.log('SET "%s" %s', sid, jsess);
    this.client.save(psid, jsess, function(err) {
      if (err) {
        return fn(err);
      }
      fn.apply(this, arguments);
    });
  },

  /**
   * Destroy the session associated with the given `sid`.
   *
   * @param {String} sid
   * @param {Function} fn
   * @api public
   */
  destroy: function(sid, fn) {
    var psid = this.prefix + sid;
    this.log('DEL "%s"', sid);
    this.client.delete(psid, fn);
  }

});