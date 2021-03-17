'use strict'

class KeycloakError extends Error {

    errResponse = null;
    constructor(serverErrResponse){
       super(serverErrResponse);
       this.errResponse = serverErrResponse;
    }
}


module.exports.KeycloakError = KeycloakError;