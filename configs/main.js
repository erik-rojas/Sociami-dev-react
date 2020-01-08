const BACKEND_URL_REMOTE_PROD = 'https://api.soqqle.com';
const BACKEND_URL_REMOTE_STAGING = 'https://stgapi.soqqle.com';
const BACKEND_URL_LOCAL = 'http://localhost:3001';
const LINK_SCRAPER_URL = 'https://api.urlmeta.org/';

var ConfigMain = {
  getBackendURL: function() {
    if (process.env.SOQQLE_ENV == 'local') {
      //front-end will be using remote staging backend, so no need to run local server
      return BACKEND_URL_REMOTE_STAGING;
    } else if (process.env.SOQQLE_ENV == 'local_backend') {
      return BACKEND_URL_LOCAL;
    } else {
      return process.env.SOQQLE_ENV == 'production' ? BACKEND_URL_REMOTE_PROD : BACKEND_URL_REMOTE_STAGING;
    }
  },
  getCookiesExpirationPeriod: function() {
    //10 years
    return 10 * 365 * 24 * 60 * 60 * 1000;
  },

  getLinkScraperServiceURL: function() {
    return LINK_SCRAPER_URL;
  },

  ChallengesScannerDisabled: false,

  S3BucketURL: 'https://sociamibucket.s3.amazonaws.com',
};

module.exports = ConfigMain;
