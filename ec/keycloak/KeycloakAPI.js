'use strict'
const EcHttpPath = require("../common/EcHttpPath").EcHttpPath;
const HttpClient = require("../net/HttpClient").HttpClient;
const KeycloakError = require("./KeycloakError").KeycloakError;

class KeycloakAPI {

    keycloakAdapter = null;

    constructor(keycloakAdapter){
        this.keycloakAdapter = keycloakAdapter;
    }


    async get(queryUri , user){
        let webPath = this.transToApiWebPath(queryUri , user);
        let httpClient = new HttpClient();
        try {
            const res = await httpClient.get(webPath);
            try {
                let resData = JSON.parse(res);
                if(resData.error) throw new KeycloakError(res);
                return resData;
            } catch(parseErr){
                return res;
            }
        } catch(err){
            throw err;
        }
    }


    async delete(queryUri , user){
        let webPath = this.transToApiWebPath(queryUri , user);
        let httpClient = new HttpClient();
        try {
            const res = await httpClient.delete(webPath);
            try {
                let resData = JSON.parse(res);
                if(resData.error) throw new KeycloakError(res);
                return resData;
            } catch(parseErr){
                return res;
            }
        } catch (err) {
            throw err;
        }
    }


    async put(queryUri , postData , postDataContentType , user){
        let webPath = this.transToApiWebPath(queryUri , user);
        webPath.getHeader().ContentType.Value = postDataContentType;
        return await this.invoke(webPath , postData , "PUT");
    }

    async post(queryUri , postData , postDataContentType , user){
        let webPath = this.transToApiWebPath(queryUri , user);
        webPath.getHeader().ContentType.Value = postDataContentType;
        return await this.invoke(webPath , postData);
    }

    async invoke(webPath , postData , method){
        let httpClient = new HttpClient();
        try {
            const res = await httpClient.post(webPath , postData , method);
            try {
                let resData = JSON.parse(res);
                if(resData.error) throw new KeycloakError(res);
                return resData;
            } catch(parseErr){
                return res;
            }
        } catch (err) {
            throw err;
        }
    }

    transToApiWebPath(queryUri , user){
        let url = `https://${this.keycloakAdapter.serverHost}:${this.keycloakAdapter.serverPort}`;
        let webPath = new EcHttpPath(url);
        webPath.appendPath(queryUri);
        
        if( user ) webPath.setBearerToken(user.accessToken);
        return webPath;
    }
}

module.exports.KeycloakAPI = KeycloakAPI;