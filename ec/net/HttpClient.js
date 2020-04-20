'use restrict';
const Basis = require('../system/Basis').Basis;
const http = require('http');
const https = require('https');
const StringTool = require('../common/StringTool').StringTool;

class HttpClient extends Basis {

    constructor(){
        super();
    }

    get(url){
        return new Promise (
            (resovle , reject) => {
                const strTool = new StringTool();
                var request = null;
                const useHttps = strTool.regValidate('https.*?' , url);
                if (useHttps){
                    request = https.get(url, function( response ) {
                        response.setEncoding('utf8');
                        response.on('data', (chunk) => {
                            resovle(chunk);
                        });
                    });
                } else {
                    request = http.get(url, function( response ) {
                        response.setEncoding('utf8');
                        response.on('data', (chunk) => {
                            resovle(chunk);
                        });
                    });
                }
                if(request != null) {
                    request.on('error' , err => {
                        reject(err);
                    });
                }
            }
        );
    }


    post (url, data ) {
        return new Promise(
            (resovle , reject) => {
                const strTool = new StringTool();
                let urlVars = strTool.parsingUrl(url);

                const options = {
                    hostname: urlVars.host,
                    port: urlVars.port,
                    path: urlVars.path,
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Content-Length': data.length
                    }
                }
                var request = null;
                const useHttps = strTool.regValidate('https.*?' , url);
                if (useHttps){
                    request = https.request(options, response => {
                        response.setEncoding('utf8');
                        response.on('data', (chunk) => {
                            resovle(chunk);
                        });
                    })
                } else {
                    request = http.request(options, response => {
                        response.setEncoding('utf8');
                        response.on('data', (chunk) => {
                            resovle(chunk);
                        });
                    })
                }
                  
                request.on('error', error => {
                    reject(error);
                })
                request.write(data);
                request.end();

            }
        );
    }

}

module.exports = {
    HttpClient : HttpClient
}