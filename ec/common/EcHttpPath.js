'use strict'
const StringTool = require('./StringTool').StringTool; 
const Basis = require('../system/Basis').Basis; 


class EcHttpPath extends Basis {

    static HTTP_PROTOCOL = {
        HTTP :  'http' ,
        HTTPS : 'https'
    }

    protocol = null;
    host = "";
    port = 0;
    path = "";
    appendedPath = null;
    auth = null;

    header = {
        ContentType: {
           Key : "Content-Type" , 
           Value : "application/json"  
        }
    }

    constructor(urlPath){
        super();
        this.parse(urlPath);
    }

    parse(url){
        let new_url = url.endsWith("/") ?  url : url + "/";
        const strTool = new StringTool();
        let urlVars = strTool.parsingUrl(new_url);
        this.protocol  = urlVars.protocol == 'https' ? 
            EcHttpPath.HTTP_PROTOCOL.HTTPS : EcHttpPath.HTTP_PROTOCOL.HTTP;
        this.host = urlVars.host;
        this.port = urlVars.port;
        this.path = urlVars.path.startsWith("/") ? urlVars.path : "/" + urlVars.path;
    }

    appendPath(appendText){
        this.appendedPath = appendText;
    }

    setBasicAuth(username , userpwd){
        this.auth = 'Basic ' + Buffer.from(username + ':' + userpwd).toString('base64');
    }

    setBearerToken(token){
        this.auth = 'Bearer ' + token;
    }

    getAuth(){
        return this.auth;
    }

    getProtocol(){
        return this.protocol;
    }

    getHost(){
        return this.host;
    }
    getPort(){
        return this.port;
    }
    getPath(){
        return this.path + (this.appendedPath ? this.appendedPath : "");
    }

    getFullUrl(){
        return this.getProtocol() + "://" + this.getHost() + ( ![80 , 443].includes(this.getPort()) ? ":" + this.getPort() : "") + "/" + this.getPath();
    }

    getHeader(){
        return this.header;
    }


}

module.exports = {
    EcHttpPath : EcHttpPath
}