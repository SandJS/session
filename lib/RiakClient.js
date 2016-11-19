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
    this.client.get(this.config.bucket, id, function(error, data) {
      if (error) {
        done(error);
        return;
      }

        if (data && data.values && data.values[0] && data.values[0].value) {
          let value = data.values[0].value.toString('utf8');
          if (_.isString(value)) {
            value = JSON.parse(value);
          }
          done(null, value, data);
          return;
        }

        done(null, null)
    });
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
        
        if (typeof body === 'string') {
          body = JSON.parse(body);
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