const util = require('util');
const URL = require('url').URL;

const config = require('./config');


/**
 * [getImage description]
 * @param  {string} uri [description]
 * @return {[type]}     [description]
 */
function getImage(uri) {
    return new Promise((uri) => { });
}

/**
 * [getImageCDN description]
 * @param  {string} uri [description]
 * @return {[type]}     [description]
 */
function getImageCDN(uri) {
    let uriCDN = config.format(uri);
    return getImage(uriCDN);
}

/**
 * [parseURI description]
 * @param  {string} uri [description]
 * @return {object}     [description]
 */
function parseURI(uri) {
    let re = /^(\d+)x(\d+)$/i;
    let url = new URL(uri);

    let result = {
        uri: util.format('%s//%s%s', url.protocol, url.host, url.pathname)
    };

    let resize = url.searchParams.get('resize');
    if (resize){
        if (!re.test(resize)) {
            throw new Error(util.format('Can not parse requested URI %s', uri));
        }
        let matchedSize = resize.match(re);
        result['resize'] = {
            width: +matchedSize[1],
            height: +matchedSize[2],
        };
    }

    return result;
}

module.exports = {
    getImage,
    getImageCDN,
    parseURI
};
