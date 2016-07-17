"use strict";

class MemcacheClient {
  constructor(options) {
    if (!sand.memcache) {
      throw new Error('Sand-Memcache is required to be loaded first');
    }

    var memcacheConfig = options && options.clientOptions ? options.clientOptions : {};
    this.client = sand.memcache;
    this.config = _.merge(this.client.config, memcacheConfig);
  }

  get(key, done) {
    this.client.get(key, bind(done));
  }

  save(key, value, done) {
    this.client.set(key, value, bind(done));
  }

  delete(key, done) {
    this.client.del(key, bind(done));
  }
}

function bind(fn) {
  return process.domain ? process.domain.bind(fn) : fn;
}

module.exports = MemcacheClient;