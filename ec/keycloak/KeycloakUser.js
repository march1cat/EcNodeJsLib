'use strict'

class KeycloakUser {

    accessToken = null;
    
    name = null;
    preferedName = null;
    email = null;

    constructor(accessToken){
        this.accessToken = accessToken;
    }

    static build(accessToken) {
        let user = new KeycloakUser(accessToken);
        return user;
    }
}

module.exports.KeycloakUser = KeycloakUser;