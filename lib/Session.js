"use strict";

const SandGrain = require('sand-grain');
const noop = function () {};

const clients = {
  redis: './RedisClient',
  riak: './RiakClient',
  datastore: './DatastoreClient'
};

/**
 * Create A new Session Management Object
 *
 * @param {string} [sessionId] Load this session Id
 * @param {object} [options] if config is passed we merge with defaults, otherwise we use defaults
 * @param {function} [cb] Optional Callback
 *
 * @constructor
 */
class Session extends SandGrain {
  constructor() {
    super();
    this.defaultConfig = require('./defaultConfig');
    this.version = require('../package').version;
  }

  init(config, done) {
    super.init(config);

    if (typeof this.config.client === 'string' && clients[this.config.client]) {
      this.client = new (require(clients[this.config.client]))(this.config);
    } else {
      this.client = new this.config.client(this.config);
    }
    this.prefix = this.config.prefix || 'sess:';

    done();
  }

  /**
   * Attempt to fetch session by the given `sid`.
   *
   * @param {String} sid
   * @param {Function} fn
   * @api public
   */
  get(sid, fn) {
    var psid = this.prefix + sid;

    if (!fn) {
      fn = noop;
    }

    this.log('GET "%s"', sid);

    this.client.get(psid, function (err, data) {
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
      } catch (e) {
        return fn(err);
      }

      return fn(null, result);
    });
  }

  /**
   * Commit the given `sess` object associated with the given `sid`.
   *
   * @param {String} sid
   * @param {Session} sess
   * @param {Function} fn
   * @api public
   */
  set(sid, sess, fn) {
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
    this.client.save(psid, jsess, function (err) {
      if (err) {
        return fn(err);
      }
      fn.apply(this, arguments);
    });
  }

  /**
   * Destroy the session associated with the given `sid`.
   *
   * @param {String} sid
   * @param {Function} fn
   * @api public
   */
  destroy(sid, fn) {
    var psid = this.prefix + sid;
    this.log('DEL "%s"', sid);
    this.client.delete(psid, fn);
  }
}

module.exports = Session;