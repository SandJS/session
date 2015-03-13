var riak = new (require('sand-riak'));

class RiakClient {
  constructor(options) {
    var riakConfig = options && options.riak ? options.riak : {};
    this.config = riakConfig;
    this.client = riak;
    this.client.init({all: riakConfig});
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