"use strict";
const _ = require('lodash');

class RiakClient {
  constructor(options) {
    if (!sand.riak) {
      throw new Error('Sand-Riak is required to be loaded first.');
    }

    var riakConfig = options && options.clientOptions ? options.clientOptions : {};
    this.client = sand.riak;
    this.config = _.merge({}, this.client.config, riakConfig);
  }

  get(id, done) {
    this.client.get(this.config.bucket, id, done);
  }

  save(id, value, done) {
    var self = this;
    if ('string' === typeof value) {
      try {
        value = JSON.parse(value);
      } catch(e) {}
    }

    this.get(id, function(err, body) {
      if (err) {
        return done(err);
      }

      if ('object' === typeof value) {
        if (!body) {
          body = {};
        }

        _.each(value, function(val, prop) {
          body[prop] = val;
        });
      } else {
        body = value;
      }

      self.client.save(self.config.bucket, id, body, done);
    });
  }

  delete(id, done) {
    this.client.delete(this.config.bucket, id, done);
  }
}

module.exports = RiakClient;