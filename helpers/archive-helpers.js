const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const worker = require('../workers/htmlfetcher');


/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', (err, data) => {
    let list = data.split('\n');
    callback(list);
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(list => {
    callback(_.contains(list, url));
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, `${url}\n`, 'utf8', callback);
};

exports.isUrlArchived = function(url, callback) {
  let filePath = `${exports.paths.archivedSites}/${url}`;
  fs.access(filePath, (err) => {
    if (err === null) {
      callback(true);
    } else {
      callback(false);
    }
  });
};

exports.downloadUrls = function(urls) {
  urls.forEach(url => worker.htmlfetcher(url));
};
