"use strict";

const _ = require('lodash');
const async = require('async');
const moment = require('moment');

class DatastoreClient {
  constructor(options) {
    this.config = options && options.datastore ? options.datastore : {};
    if (!sand.gcloud) {
      throw new Error('sand.gcloud is not loaded yet!');
    }
    if (!sand.schedule) {
      sand.log('WARNING: sand.schedule is not loaded yet. Automatic session expiration will be disabled.');
    } else {

      let self = this;

      let job = {
        name: 'sand.session - Expiration Manager',
        when: this.config.deleteSchedule,
        useLock: !!this.config.useLock,
        run: function(done) {
          let dataset = sand.gcloud.datastore();
          let query = dataset.createQuery(self.config.kind).filter('_expires_ <', moment().unix());
          dataset.runQuery(query, function (err, results, nextCursor, details) {
            async.mapLimit(results, 20, function(sess, done) {
              dataset.delete(sess.key, function(err) {
                if (err) {
                  sand.error(err.message || err);
                }
                done();
              });
            }, function(err, results) {
              done();
            });
          });
        }
      };

      sand.schedule.job(job);
    }
  }

  get(id, done) {
    let dset = sand.gcloud.datastore();

    id = this.getKey(dset, id);
    dset.get(id, function(err, entity) {
      if (entity && entity.data) {
        entity = entity.data;
      }
      done(err, entity);
    });
  }

  save(id, value, done) {
    let dset = sand.gcloud.datastore();

    id = this.getKey(dset, id);
    done = _.once(done);

    try {
      value = JSON.parse(value);
      if (value && value.cookie && value.cookie && value.cookie.expires) {
        value._expires_ = moment(value.cookie.expires, 'YYYY-MM-DDTHH:mm:ss.SSSZ').unix();
      } else {
        value._expires_ = moment().unix() + this.config.defaultTTL;
      }
      dset.save({
        key: id,
        data: value
      }, done);

    } catch(e) {
      sand.error(e.message || e);
      done(e);
    }
  }

  delete(id, done) {
    let dset = sand.gcloud.datastore();

    dset.delete(dset.key([this.config.kind, id]), function() {
      done.apply(this, arguments);
    });
  }

  getKey(dset, id) {
    return dset.key([this.config.kind, id]);
  }
}

module.exports = DatastoreClient;