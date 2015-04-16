"use strict";

const redis = new (require('sand-redis'));

class RedisClient {
  constructor(options) {
    this.config = options && options.redis ? options.redis : {};
    this.client = redis;
    this.client.init({all: this.config});
  }

  get(id, done) {
    this.client.get(id, done);
  }

  save(id, value, done) {
    this.client.save(id, value, done);
  }

  delete(id, done) {
    this.client.delete(id, done);
  }
}

module.exports = RedisClient;