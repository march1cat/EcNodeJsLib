'use strict'
const KeycloakUser = require("./KeycloakUser").KeycloakUser;
const KeycloakError = require("./KeycloakError").KeycloakError;
const KeycloakClientUser = require("./KeycloakClientUser").KeycloakClientUser;
const jwt_decode = require("jwt-decode");

class AccessTokenAdpater {

    keycloakAdapter = null;
    constructor(keycloakAdapter){
        this.keycloakAdapter = keycloakAdapter;
    }

    async get(username , passord , decodeJWT){
        let queryUri = `auth/realms/${this.keycloakAdapter.keycloakRealm.name}/protocol/openid-connect/token`;
        let postData = "";
        postData += "grant_type=password&";
        postData += `client_id=${this.keycloakAdapter.keycloakClient.name}&`;
        postData += `client_secret=${this.keycloakAdapter.keycloakClient.secretText}&`;
        postData += `username=${username}&`;
        postData += `password=${passord}`;
        let resData = await this.keycloakAdapter.API.post(queryUri , postData , "application/x-www-form-urlencoded");
        if (!resData.access_token)  throw new KeycloakError("access token missed!!")
        else {
            if(decodeJWT){
                this.decodeJWTToClientUser(resData.access_token);
            } else return resData.access_token;
        }
    }

    async validate( accessToken ){
        let user = KeycloakUser.build(accessToken);
        let queryUri = `auth/realms/${this.keycloakAdapter.keycloakRealm.name}/protocol/openid-connect/userinfo`;
        const resData = await this.keycloakAdapter.API.get(queryUri , user);
        return resData;
    }

    decodeJWTToClientUser(accessToken){
        const decoded = jwt_decode(accessToken);
        let user = KeycloakClientUser.newInstance(accessToken);
        user.expired = decoded.exp;
        user.belongClient = decoded.azp;
        user.roles = decoded.resource_access[user.belongClient].roles;
        return user;
    }

}

module.exports.AccessTokenAdpater = AccessTokenAdpater;