'use restrict';
const Basis = require('../system/Basis').Basis;
const http = require('http');
const https = require('https');
const EcHttpPath = require("../common/EcHttpPath").EcHttpPath;
const StringTool = require('../common/StringTool').StringTool;

class HttpClient extends Basis {

    constructor(){
        super();
    }

   
    get(ecHttpPath){
        return new Promise (
            (resovle , reject) => {
                process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
                const options = {
                    hostname: ecHttpPath.getHost(),
                    port: ecHttpPath.getPort(),
                    path: ecHttpPath.getPath(),
                    method: 'GET' 
                }
                if(ecHttpPath.getBasicAuth()) options.headers = {
                    'Authorization' : ecHttpPath.getBasicAuth()
                }

                let httpTool = ecHttpPath.getProtocol() == EcHttpPath.HTTP_PROTOCOL.HTTP ? http : https;
                let request = httpTool.get(options, function( response ) {
                    response.setEncoding('utf8');
                    let body = '';
                    response.on('data', (chunk) => {
                        body += chunk;
                    });
                    response.on('end', (chunk) => {
                        resovle(body);
                    });
                });

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
                        let body = '';
                        response.on('data', (chunk) => {
                            body += chunk;
                        });
                        response.on('end', (chunk) => {
                            resovle(body);
                        });
                    })
                } else {
                    request = http.request(options, response => {
                        response.setEncoding('utf8');
                        let body = '';
                        response.on('data', (chunk) => {
                            resovle(chunk);
                        });
                        response.on('end', (chunk) => {
                            resovle(body);
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