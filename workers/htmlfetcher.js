// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
const archive = require('../helpers/archive-helpers');

exports.htmlfetcher = () => {
  archive.readListOfUrls(list => {
    console.log('worker: ', list);
    archive.downloadUrls(list);
  });
};
