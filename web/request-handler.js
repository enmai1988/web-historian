var path = require('path');
var fs = require('fs');
var qs = require('querystring');
var archive = require('../helpers/archive-helpers');
var helpers = require('../web/http-helpers');
var worker = require('../workers/htmlfetcher');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  let serverUrl = './web/public/index.html';

  // function to get html info from computer file
  let getAsset = (res, asset) => {
    fs.readFile(asset, 'utf8', (err, data) => {
      if (err) { throw err; }
      res.writeHead(200, helpers.headers);
      res.end(data);
    });
  };
    
  if (req.method === 'GET') {
    helpers.serveAssets(res, serverUrl, getAsset);
  } else if (req.method === 'POST') {
    let url = '';
    req.on('data', data => {
      url += data;
    });
    req.on('end', () => {
      // Read list of urls in  archives sites.txt
      let list = helpers.readListOfUrls();
      // if url is in the list
       
        // if url is archived, send it to the client

        // else, archived the url and send the loading html to client

      // if url is not in the list

        // add url to list 

        // download the url to the archives/sites folder

        // send the loading html to client
      
    });
  }
  // res.end(archive.paths.list);
};
