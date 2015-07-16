module.exports = {
  client: 'riak',
  prefix: 'sess:',
  clientOptions: {
    bucket: 'sessions'
  },
  datastore: {

    /**
     * The datastore kind for a session
     */
    kind: 'Session',

    /**
     * How long should a session live
     */
    defaultTTL: 7 * 24 * 60 * 60,

    /**
     * How often to check for expired sessions
     */
    deleteSchedule: {second: 20},

    /**
     * Indicates if the scheduler should request a lock to run the expired sessions job
     */
    useLock: false
  }
};