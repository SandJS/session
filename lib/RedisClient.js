"use strict";

class RedisClient {
  constructor(options) {
    if (!sand.redis) {
      throw new Error('Sand-Redis is required to be loaded first');
    }

    var redisConfig = options && options.clientOptions ? options.clientOptions : {};
    this.client = sand.redis;
    this.config = _.merge(this.client.config, redisConfig);
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