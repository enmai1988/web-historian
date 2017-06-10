var path = require('path');
var fs = require('fs');
var qs = require('querystring');
var archive = require('../helpers/archive-helpers');
var helpers = require('../web/http-helpers');
var worker = require('../workers/htmlfetcher');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if (req.method === 'GET') {
    helpers.serveAssets(res, `${archive.paths.siteAssets}/index.html`);
  } else if (req.method === 'POST') {    
    let url = '';
    req.on('data', data => {
      url += data;
    });
    req.on('end', () => {
      url = url.substring(4);
      let filePath = `${archive.paths.archivedSites}/${url}.txt`;
      let loadingHtml = `${archive.paths.siteAssets}/loading.html`;

      archive.readListOfUrls();


      // Read list of urls in  archives sites.txt
    //   let list = helpers.readListOfUrls();
    //   // if url is in the list
    //   if (_.contains(list, url)) {
    //     fs.access(filePath, fs.constants.F_OK, (err) => {
    //       // if url is archived, send it to the client
    //       if (!err) {
    //         helpers.serveAssets(res, filePath);
    //       } else {
    //         // else, archived the url
    //         archive.downloadUrls(url);
    //         // send the loading html to client
    //         helpers.serveAssets(res, loadingHtml);
    //       }
    //     });
    //   } else {
    //     // if url is not in the list, add url to list
    //     archive.addUrlToList(url, callback);
    //     // download the url to the archives/sites folder
    //     archive.downloadUrls(url);
    //     // send the loading html to client
    //     helpers.serveAssets(res, loadingHtml);
    //   }
    });
  }
  
  // res.end(archive.paths.list);
};
