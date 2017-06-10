const path = require('path');
const fs = require('fs');
const url = require('url');
const archive = require('../helpers/archive-helpers');
const helpers = require('../web/http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  let pathname = url.parse(req.url).pathname;
  let loadingHtml = `${archive.paths.siteAssets}/loading.html`;



  if (req.method === 'GET') {
    if (pathname === '/') {
      helpers.serveAssets(res, `${archive.paths.siteAssets}/index.html`);
    } else {
      archive.isUrlArchived(pathname.slice(1), archived => {
        if (archived) {
          helpers.serveAssets(res, `${archive.paths.archivedSites}/${pathname.slice(1)}`);
        } else {
          helpers.serveAssets(res, loadingHtml);
          archive.downloadUrls([pathname.slice(1)]);
        }
      });
    }
  } else if (req.method === 'POST') {
    let url = '';
    req.on('data', data => {
      url += data;
    });
    req.on('end', () => {
      url = url.substring(4);
      let filePath = `${archive.paths.archivedSites}/${url}`;

      archive.isUrlInList(url, (exist) => {
        if (exist) {
          archive.isUrlArchived(url, (archived) => {
            if (archived) {
              helpers.serveAssets(res, filePath);
            } else {
              archive.downloadUrls([url]);
              helpers.serveAssets(res, loadingHtml);
            }
          });
        } else {
          archive.addUrlToList(url);
          archive.downloadUrls([url]);
          helpers.serveAssets(res, loadingHtml);
        }
      });

    });
  }

  // res.end(archive.paths.list);
};
