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



    patch(ecHttpPath , data ){
        return this.post(ecHttpPath , data , "PATCH");
    }

    post (ecHttpPath , data  , method) {
        if(!method) method = "POST";
        return new Promise(
            (resovle , reject) => {
                process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

                const options = {
                    hostname: ecHttpPath.getHost(),
                    port: ecHttpPath.getPort(),
                    path: ecHttpPath.getPath(),
                    method: method ,
                    headers: {
                        'Content-Length': data.length
                    }
                }
                let headerAttributes = Object.keys(ecHttpPath.getHeader());
                headerAttributes.forEach(headerAttribute => {
                    options.headers[ ecHttpPath.getHeader()[headerAttribute].Key ] = ecHttpPath.getHeader()[headerAttribute].Value;
                });

                if(ecHttpPath.getBasicAuth()) options.headers = {
                    'Authorization' : ecHttpPath.getBasicAuth()
                }
               
                let httpTool = ecHttpPath.getProtocol() == EcHttpPath.HTTP_PROTOCOL.HTTP ? http : https;
                let request = httpTool.request(options, function( response ) {
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
                request.write(data);
                request.end();
            }
        );
    }

}

module.exports = {
    HttpClient : HttpClient
}