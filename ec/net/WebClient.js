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

    async getAsDom (url , disableAutoEncodeUtf8){
        try {
            var response = await this.get(url , disableAutoEncodeUtf8);
            return response.document;
        } catch(error){
            throw error;
        }
    }

    async getBody (url , disableAutoEncodeUtf8){
        try {
            var response = await this.get(url , disableAutoEncodeUtf8);
            return response.body;
        } catch(error){
            throw error;
        }
    }

    async get (url , disableAutoEncodeUtf8){
        try {
            var response = await this.httpGet(url , disableAutoEncodeUtf8);
            const { JSDOM } = jsdom;
            const dom = new JSDOM(response.body);
            return {
                document : dom.window.document , 
                body : disableAutoEncodeUtf8 ? String(response.body) : response.body
            }
        } catch(error){
            throw error;
        }
    }


    //Normal get web page return html
    httpGet(url , disableAutoEncodeUtf8){
        return new Promise( 
            (resovle , reject) => {
                this.log("Prepare connect url[" + decodeURIComponent(url) + "]");
                const reqOption = !disableAutoEncodeUtf8 ? {url :  url} : { url :  url , encoding: null}
                request( reqOption , 
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
                    const streamToFile = function(response){
                        response.pipe(file);
                        file.on('finish', function() {
                            file.close(resovle);  // close() is async, call cb after close completes.
                        });
                    }

                    const strTool = new StringTool();
                    const useHttps = strTool.regValidate('https.*?' , url);
                    let httpTool = useHttps ? https : http;
                    const request = httpTool.get(url, function( response) {
                        const errorCodes = [403 , 404];
                        if(!errorCodes.includes(response.statusCode)){
                            streamToFile(response);
                        } else reject(`Download fail , Error Code : ${response.statusCode} , Url : ${url}`);
                    });
                    
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