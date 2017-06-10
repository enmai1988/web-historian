// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
const archive = require('../helpers/archive-helpers');
const http = require('http');
const fs = require('fs');

exports.htmlfetcher = (url) => {
  let index = '';
  let options = {
    hostname: url
  };
  http.get(options, res => {
    res.setEncoding('utf8');
    res.on('data', chunk => {
      index += chunk;
    });
    res.on('end', () => {
      fs.writeFile(`${archive.paths.archivedSites}/${url}`, index);
    });
  });
};
