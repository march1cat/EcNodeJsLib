'use strict'
const EcHttpPath = require("../common/EcHttpPath").EcHttpPath;
const HttpClient = require("../net/HttpClient").HttpClient;
const KeycloakError = require("./KeycloakError").KeycloakError;
const KeycloakUser = require("./KeycloakUser").KeycloakUser;
class KeycloakAdapter {
    
    serverHost = null;
    serverPort = 0;
    useHttps = false;
    keycloakRealm = null;
    keycloakClient = null;


    async login(username , passord){
        let queryUri = `auth/realms/${this.keycloakRealm.name}/protocol/openid-connect/token`;
        let postData = "";
        postData += "grant_type=password&";
        postData += `client_id=${this.keycloakClient.name}&`;
        postData += `client_secret=${this.keycloakClient.secretText}&`;
        postData += `username=${username}&`;
        postData += `password=${passord}`;
        let res = await this.postApi(queryUri , postData , "application/x-www-form-urlencoded");

        let resData = JSON.parse(res);
        if(resData.error) throw new KeycloakError(res);
        else if (!resData.access_token)  throw new KeycloakError("access token missed!!")
        else {
            let user = KeycloakUser.build(resData.access_token);
            return user;
        }
    }

    async getUserInfo( accessToken ){
        let user = KeycloakUser.build(accessToken);
        let queryUri = `auth/realms/${this.keycloakRealm.name}/protocol/openid-connect/userinfo`;
        const res = await this.getApi(queryUri , user);
        console.log("res = " , res);
    }


    async getApi(queryUri , user){
        let webPath = this.transToApiWebPath(queryUri , user);
        let httpClient = new HttpClient();
        return await httpClient.post(webPath , postData);
    }

    async postApi(queryUri , postData , postDataContentType , user){
        let webPath = this.transToApiWebPath(queryUri , user);
        webPath.getHeader().ContentType.Value = postDataContentType;
        let httpClient = new HttpClient();
        return await httpClient.post(webPath , postData);
    }


    transToApiWebPath(queryUri , user){
        let url = `https://${this.serverHost}:${this.serverPort}`;
        let webPath = new EcHttpPath(url);
        webPath.appendPath(queryUri);
        
        if( user ) webPath.setBearerToken(user.accessToken);
    }

    static open(serverHost , serverPort , keycloakRealm , keycloakClient){
        let adapter = new KeycloakAdapter();
        adapter.serverHost = serverHost;
        adapter.serverPort = serverPort;
        adapter.keycloakRealm = keycloakRealm;
        adapter.keycloakClient = keycloakClient;
        adapter.useHttps = true;
        return adapter;
    }
}

module.exports.KeycloakAdapter = KeycloakAdapter;