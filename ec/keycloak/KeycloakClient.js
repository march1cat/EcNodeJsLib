'use strict'

class KeycloakClient {

    name = null;
    secretText = null;


    static build(name , secretText){
        let client = new KeycloakClient();
        client.name = name;
        client.secretText = secretText;
        return client;
    }
}

module.exports.KeycloakClient = KeycloakClient;
