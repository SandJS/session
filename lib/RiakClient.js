"use strict";
const _ = require('lodash');

class RiakClient {
  constructor(options) {
    if (!sand.riak) {
      throw new Error('Sand-Riak is required to be loaded first.');
    }

    var riakConfig = options && options.clientOptions ? options.clientOptions : {};
    this.client = sand.riak;
    this.config = _.merge(this.client.config, riakConfig);
  }

  get(id, done) {
    this.client.get(this.config.bucket, id, done);
  }

  save(id, value, done) {
    this.client.save(this.config.bucket, id, value, done);
  }

  delete(id, done) {
    this.client.delete(this.config.bucket, id, done);
  }
}

module.exports = RiakClient;