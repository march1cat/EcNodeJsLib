'use strict'

class OperationSession {

    keycloakUser = null;

    constructor(keycloakUser){
        this.keycloakUser = keycloakUser;
    }

    static open(keycloakUser){
        let session = new OperationSession(keycloakUser);
        return session;
    }
}

module.exports.OperationSession = OperationSession;