module.exports = {
  client: require('./RiakClient'),
  prefix: 'sess:',
  riak: {
    bucket: 'sessions'
  }
};