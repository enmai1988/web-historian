const path = require('path');
const fs = require('fs');
const url = require('url');
const archive = require('../helpers/archive-helpers');
const helpers = require('../web/http-helpers');
const worker = require('../workers/htmlfetcher');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  const pathname = url.parse(req.url).pathname;
  const loadingHtml = `${archive.paths.siteAssets}/loading.html`;

  if (req.method === 'GET') {
    if (pathname === '/') {
      helpers.serveAssets(`${archive.paths.siteAssets}/index.html`, data => {
        helpers.sendRes(res, 200, data);
      });
    } else {
      archive.isUrlArchived(pathname.slice(1), isArchived => {
        if (isArchived) {
          helpers.serveAssets(`${archive.paths.archivedSites}/${pathname.slice(1)}`, data => {
            helpers.sendRes(res, 200, data);
          });
        } else {
          helpers.serveAssets(loadingHtml, data => {
            helpers.sendRes(res, 404, data);
          });
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
      console.log('url from POST req: ', url);
      url = url.substring(4);
      let filePath = `${archive.paths.archivedSites}/${url}`;

      archive.isUrlInList(url, exist => {
        if (exist) {
          archive.isUrlArchived(url, isArchived => {
            if (isArchived) {
              helpers.serveAssets(filePath, data => {
                helpers.sendRes(res, 200, data);
              });
            } else {
              archive.downloadUrls([url]);
              helpers.serveAssets(loadingHtml, data => {
                helpers.sendRes(res, 200, data);
              });
            }
          });
        } else {
          archive.addUrlToList(url, worker.htmlfetcher);
          helpers.serveAssets(loadingHtml, data => {
            helpers.sendRes(res, 302, data);
          });
        }
      });

    });
  }
  // res.end(archive.paths.list);
};
