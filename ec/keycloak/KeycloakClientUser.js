'use strict'

class KeycloakClientUser {

    accessToken = null;

    expired = 0;
    belongClient = null;
    roles = [];

    constructor(accessToken){
        this.accessToken = accessToken;
    }

    static newInstance(accessToken){
        const user = new KeycloakClientUser(accessToken);
        return user;
    }




}


module.exports.KeycloakClientUser = KeycloakClientUser;