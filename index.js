'use strict';

var https = require('https');
var parse_url = require('url').parse;

module.exports = function (cfg, callback) {
    var to, from, message, url, token;

    try {
        if (!cfg || typeof cfg != 'object')
            throw new Error('Missing SMS configuration object');

        to = cfg.to;
        from = cfg.from;
        token = cfg.token;
        message = cfg.message;
        url = parse_url(cfg.url);

        if (!to || typeof to != 'string')
            throw new Error('Invalid recipient');
        if (token && typeof token != 'string')
            throw new Error('Invalid token');

        // tokens should not be sent over plaintext
        if (token && url.protocol != 'https:')
            throw new Error('Please use https:// protocol');
    } catch (err) {
        if (callback) {
            callback(err);
            return;
        }
        return Promise.reject(err);
    }

    var reqopt = {
        method: 'POST',
        hostname: url.hostname,
        port: url.port || (url.protocol == 'http:' ? 80 : 443),
        path: url.path,
    };

    // add token header
    if (token)
        reqopt.headers = { Authorization: 'Bearer ' + token };

    // check if we're doing callback or promise style
    if (callback) {
        var error;
        var req = https.request(reqopt, function (res) {
            // handle http errors
            if (res.statusCode < 200 || res.statusCode > 299) {
                error = new Error('HTTP error: ' + res.statusCode);
                callback(error);
            }

            // accumulate response chunks
            var body = [];
            res.on('data', function (chunk) {
                body.push(chunk);
            });
            res.on('end', function () {
                if (!error)
                    callback(null, body.join(''));
            });
        });

        req.write(JSON.stringify({
            to: to,
            from: from,
            message: message
        }));
        req.end();

        req.on('error', function (err) {
            error = err;
            callback(err);
        });
        return;
    }

    return new Promise(function (resolve, reject) {
        var req = https.request(reqopt, function (res) {
            // handle http errors
            if (res.statusCode < 200 || res.statusCode > 299)
                reject(new Error('HTTP error: ' + res.statusCode));

            // accumulate response chunks
            var body = [];
            res.on('data', function (chunk) {
                body.push(chunk);
            });
            res.on('end', function () {
                resolve(body.join(''));
            });
        });

        req.write(JSON.stringify({
            to: to,
            from: from,
            message: message
        }));
        req.end();

        req.on('error', reject);
    });
};
