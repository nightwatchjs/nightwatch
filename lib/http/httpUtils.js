const https = require('https');

const HttpUtils = {
    httpRequest : async (params, postData) => {
        return new Promise(function(resolve, reject) {
            var req = https.request(params, function(res) {
                // reject on bad status
                if (res.statusCode < 200 || res.statusCode >= 300) {
                    return reject(new Error('statusCode=' + res.statusCode));
                }
                // cumulate data
                var body = [];
                res.on('data', function(chunk) {
                    body.push(chunk);
                });
                // resolve on end
                res.on('end', function() {
                    try {
                        body = JSON.parse(Buffer.concat(body).toString());
                    } catch(e) {
                        reject(e);
                    }
                    resolve(body);
                });
            });
            // reject on request error
            req.on('error', function(err) {
                // This is not a "Second reject", just a different sort of failure
                reject(err);
            });
            if (postData) {
                req.write(postData);
            }
            // IMPORTANT
            req.end();
        });
      }
}



module.exports = HttpUtils;