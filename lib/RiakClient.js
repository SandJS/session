var Class = require('sand').Class;
var riak = new (require('sand-riak'));

module.exports = Class.extend({
  construct: function(options) {
    var riakConfig = options && options.riak ? options.riak : {};
    this.config = riakConfig;
    this.client = riak;
    this.client.init({all: riakConfig});
  },

  get: function(id, done) {
    this.client.get(this.config.bucket, id, done);
  },

  save: function(id, value, done) {
    this.client.save(this.config.bucket, id, value, done);
  },

  delete: function(id, done) {
    this.client.delete(this.config.bucket, id, done);
  }
});