const lib = require('./lib');
const sharp = require('sharp');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminMozjpeg = require('imagemin-mozjpeg');

/** Download image from CDN, resize and optimize */
async function controller(req, res) {

    let uriData;
    let requestedUrl = req.protocol + '://' + req.get('Host') + req.originalUrl;

    try {
      uriData = lib.parseURI(requestedUrl);
    } catch (err) {
      res.status(400);
      console.error(err);
      return;
    }

    let imageData = await lib.getImage(requestedUrl);
    let imageDataBuffer = Buffer.from(imageData.data, 'binary');

    // resize
    if (uriData.resize) {
      try {
        imageDataBuffer = await sharp(imageDataBuffer).resize(uriData.resize.width, uriData.resize.height).toBuffer();
      } catch (err) {
        res.status(500);
        console.error(err);
        return;
      }
    }

    // optimize
    try {
      imageDataBuffer = await imagemin.buffer(imageDataBuffer, {
          plugins: [
              imageminMozjpeg(),
              imageminPngquant(),
          ]
      });
    } catch (err) {
      console.error('Cannot optimize image: ', requestedUrl);
      console.error(err);
    }

    // return result
    res.writeHead(200, {
        'Content-Type': imageData.contentType,
        'Content-Length': Buffer.byteLength(imageDataBuffer, 'binary')
    });

    res.end(imageDataBuffer, 'binary');
};

module.exports = controller;
