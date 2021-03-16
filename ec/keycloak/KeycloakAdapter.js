'use strict'

class KeycloakAdapter {
    
    serverHost = null;
    serverPort = 0;
    useHttps = false;

    getAccessToken(){
        
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