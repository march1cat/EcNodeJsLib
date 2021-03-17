'use strict'
const EcHttpPath = require("../common/EcHttpPath").EcHttpPath;
const HttpClient = require("../net/HttpClient").HttpClient;
const KeycloakError = require("./KeycloakError").KeycloakError;
const KeycloakUser = require("./KeycloakUser").KeycloakUser;
const OperationSession = require("./OperationSession").OperationSession;
class KeycloakAdapter {
    
    serverHost = null;
    serverPort = 0;
    useHttps = false;
    keycloakRealm = null;
    keycloakClient = null;


    async openSession(username , passord){
        let queryUri = `auth/realms/${this.keycloakRealm.name}/protocol/openid-connect/token`;
        let postData = "";
        postData += "grant_type=password&";
        postData += `client_id=${this.keycloakClient.name}&`;
        postData += `client_secret=${this.keycloakClient.secretText}&`;
        postData += `username=${username}&`;
        postData += `password=${passord}`;
        let resData = await this.postApi(queryUri , postData , "application/x-www-form-urlencoded");

        if (!resData.access_token)  throw new KeycloakError("access token missed!!")
        else {
            let user = KeycloakUser.build(resData.access_token);
            const session = OperationSession.open(user);
            if(true){
                let userInfoResData = await this.getUserInfo(user);
                user.name = userInfoResData.name;
                user.preferedName = userInfoResData.prefered_username;
                user.email = userInfoResData.email;
            }

            if(true){
                let clients = await this.getRealmClients(session);
                const clientData = clients.finds( client => client.clientId == this.keycloakClient.name);
                this.keycloakClient.id = clientData.id;
            }
            return session;
        }
    }

    async getUserInfo( data ){
        let user =  ( data instanceof KeycloakUser) ? data : KeycloakUser.build(data);
        let queryUri = `auth/realms/${this.keycloakRealm.name}/protocol/openid-connect/userinfo`;
        const resData = await this.getApi(queryUri , user);
        return resData;
    }


    async getRealmClients( opSession ){
        let queryUri = `auth/admin/realms/${this.keycloakRealm.name}/clients`;
        const resData = await this.getApi(queryUri , opSession.keycloakUser);
        return resData;
    }

    async getClientRoles( opSession ){
        let queryUri = `auth/admin/realms/${this.keycloakRealm.name}/clients/${this.keycloakClient.id}/roles`;
        const resData = await this.getApi(queryUri , opSession.keycloakUser);
        return resData;
    }


    async getApi(queryUri , user){
        let webPath = this.transToApiWebPath(queryUri , user);
        let httpClient = new HttpClient();
        const res = await httpClient.get(webPath);
        let resData = JSON.parse(res);
        if(resData.error) throw new KeycloakError(res);
        return resData;
    }

    async postApi(queryUri , postData , postDataContentType , user){
        let webPath = this.transToApiWebPath(queryUri , user);
        webPath.getHeader().ContentType.Value = postDataContentType;
        let httpClient = new HttpClient();
        const res = await httpClient.post(webPath , postData);
        let resData = JSON.parse(res);
        if(resData.error) throw new KeycloakError(res);
        return resData;
    }


    transToApiWebPath(queryUri , user){
        let url = `https://${this.serverHost}:${this.serverPort}`;
        let webPath = new EcHttpPath(url);
        webPath.appendPath(queryUri);
        
        if( user ) webPath.setBearerToken(user.accessToken);
        return webPath;
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