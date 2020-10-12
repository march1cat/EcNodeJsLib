'use restrict';
const Basis = require('../system/Basis').Basis;
const request = require('request');
const jsdom = require('jsdom');
const http = require('http');
const https = require('https');
const filesys = require('fs');
const FileTool = require('../common/FileTool').FileTool;
const StringTool = require('../common/StringTool').StringTool;


class WebClient extends Basis {

    constructor (logger){
        super(logger);
    }

    async getAsDom (url){
        try {
            var response = await this.get(url);
            return response.document;
        } catch(error){
            throw error;
        }
    }

    async getBody (url){
        try {
            var response = await this.get(url);
            return response.body;
        } catch(error){
            throw error;
        }
    }

    async get (url){
        try {
            var response = await this.httpGet(url);
            const { JSDOM } = jsdom;
            const dom = new JSDOM(response.body);
            return {
                document : dom.window.document , 
                body : response.body
            }
        } catch(error){
            throw error;
        }
    }


    //Normal get web page return html
    httpGet(url){
        return new Promise( 
            (resovle , reject) => {
                this.log("Prepare connect url[" + decodeURIComponent(url) + "]");
                request( { url :  url }, 
                    (error, response, body) => {
                        if(error) {
                            reject(error);
                        } else {
                            this.log("Connect url[" + decodeURIComponent(url) + "] Success");
                            resovle({
                                response : response , 
                                body : body
                            });
                        }
                    }
                );
            }
        );
    }





    download(url , saveTo , override){
        return new Promise (
            (resovle , reject) => {
                const fileTool = new FileTool();
                var doDownload = true;
                if(fileTool.isFileExist(saveTo)){
                    if(!override) {
                        doDownload = false;
                        resovle();
                    }
                }
                if(doDownload){
                    const file = filesys.createWriteStream(saveTo);
                    var request = null;
                    const strTool = new StringTool();
                    const useHttps = strTool.regValidate('https.*?' , url);
                    if (useHttps){
                        request = https.get(url, function( response) {
                            response.pipe(file);
                            file.on('finish', function() {
                                file.close(resovle);  // close() is async, call cb after close completes.
                            });
                        });
                    } else {
                        request = http.get(url, function( response) {
                            response.pipe(file);
                            file.on('finish', function() {
                                file.close(resovle);  // close() is async, call cb after close completes.
                            });
                        });
                    }

                    if(request != null) {
                        request.on('error' , err => {
                            filesys.unlink(saveTo);
                            reject(err);
                        });
                    } else {
                        filesys.unlink(saveTo);
                        reject(err);
                    }
                } else {
                    resovle();
                }
            }
        );
    }


}


module.exports = {
    WebClient : WebClient
}