'use strict'
const EcHttpPath = require("../common/EcHttpPath").EcHttpPath;
const HttpClient = require("../net/HttpClient").HttpClient;

class KeycloakAdapter {
    
    serverHost = null;
    serverPort = 0;
    useHttps = false;

    async getAccessToken(keycloakRealm , keycloakClient , username , passord){
        let url = `https://${serverHost}:${serverPort}`;
        let webPath = new EcHttpPath(url);
        webPath.appendPath(`/auth/realms/${keycloakRealm.name}/protocol/openid-connect/token`);
        webPath.getHeader().ContentType = "application/x-www-form-urlencoded";
        let httpClient = new HttpClient();
        let postData = "";
        postData += "grant_type=password&";
        postData += `client_id=${keycloakClient.name}&`;
        postData += `client_secret=${keycloakClient.secretText}&`;
        postData += `username=${username}&`;
        postData += `passord=${passord}`;
        console.log("postData = " , postData);
        let res = await httpClient.post(webPath , postData);
        return res;
    }

    static buildInHttps(serverHost , serverPort){
        let adapter = new KeycloakAdapter();
        adapter.serverHost = serverHost;
        adapter.serverPort = serverPort;
        adapter.useHttps = true;
        return adapter;
    }
}

module.exports.KeycloakAdapter = KeycloakAdapter;