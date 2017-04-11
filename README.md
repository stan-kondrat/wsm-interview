# Demo app for WSM interview

Install node modules and runs tests:

```sh
npm install
npm test
npm start
```

## Original not refactored code

```js
var url = require('url');
var https = require('https');
var sharp = require('sharp');

var hasData = false;
window.run = function(worker) {
    var server = worker.getHTTPServer();
    server.on('request', function(req, res) {
        hasData = false;
        var body = [];
        if (req.method != 'GET') {
            error(res, 400);
        }

        req.on('data', function(chunk) {
            hasData = true;
            body.push(chunk);
        });

        req.on('end', function() {
            parseURI(req.url)
                .then(function(uriData) {
                    getImage('https://cdn.google.com' + uriData.origUri)
                        .then(function(imageData) {
                            sharp(Buffer.from(imageData.data, 'binary'))
                                .resize(uriData.resizeWidth, uriData.resizeHeight)
                                .toBuffer()
                                .then(function(resizedImage) {
                                    var imagemin = require('imagemin');
                                    var imageminPngquant = require('imagemin-pngquant');
                                    imagemin.buffer(resizedImage, {
                                            plugins: [
                                                require('imagemin-mozjpeg')(),
                                                imageminPngquant(),
                                            ]
                                        })
                                        .then(function(optimazedImage) {
                                            res.writeHead(200, {
                                                'Content-Type': imageData.contentType,
                                                'Content-Length': Buffer.byteLength(optimazedImage, 'binary')
                                            });
                                            res.end(optimazedImage, 'binary');
                                        })
                                        .catch(function(err) {
                                            console.log('Cannot optimize image: ' + req.url)
                                            console.log(err)
                                            res.writeHead(200, {
                                                'Content-Type': imageData.contentType,
                                                'Content-Length': Buffer.byteLength(resizedImage, 'binary')
                                            });
                                            res.end(resizedImage, 'binary');
                                        });
                                })
                                .catch(function(err) {
                                    console.log('Image Resize failed: ' + req.url);
                                    console.log(err);
                                    error(res, 500);
                                });
                        })
                        .catch(function(err) {
                            console.log('Image Download failed: ' + 'https://cdn.google.com' + uriData.origUri);
                            error(res, 404);
                        });
                })
                .catch(function(data) {
                    console.log(data);
                    error(res, 400);
                });

        });
    });
};


function parseURI(uri) {
    return new Promise(function(resolve, reject) {
        var data = {};
        let splitedUri = uri.split('@');
        let resizeParams = splitedUri.pop();
        data['uri'] = uri
        data['resizeWidth'] = +parseInt(resizeParams.split(/x|X/)[0]) || null;
        data['resizeHeight'] = +parseInt(resizeParams.split(/x|X/)[1]) || null;
        data['origUri'] = splitedUri.join('@');
        if (data['resizeWidth'] == null && data['resizeHeight'] == null) {
            reject('Can not parse requested URI ' + uri.toString());
        }
        resolve(data);
    });
}

function getImage(uri) {
    return new Promise(function(resolve, reject) {
        //...
    });

}

function error(res, errcode) {
    //...
}
```
