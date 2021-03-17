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
        let url = `https://${this.serverHost}:${this.serverPort}`;
        let webPath = new EcHttpPath(url);
        webPath.appendPath(`auth/realms/${this.keycloakRealm.name}/protocol/openid-connect/token`);
        webPath.getHeader().ContentType.Value = "application/x-www-form-urlencoded";
        let httpClient = new HttpClient();
        let postData = "";
        postData += "grant_type=password&";
        postData += `client_id=${this.keycloakClient.name}&`;
        postData += `client_secret=${this.keycloakClient.secretText}&`;
        postData += `username=${username}&`;
        postData += `password=${passord}`;
        let res = await httpClient.post(webPath , postData);
        let resData = JSON.parse(res);
        if(resData.error) throw new KeycloakError(res);
        else if (!resData.access_token)  throw new KeycloakError("access token missed!!")
        else {
            let user = new KeycloakUser.build(resData.access_token);
            return user;
        }
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