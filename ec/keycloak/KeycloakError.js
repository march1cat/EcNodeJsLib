'use strict'

class KeycloakError extends Error {

    errResponse = null;
    constructor(serverErrResponse){
       this.errResponse = serverErrResponse;
    }
}


module.exports.KeycloakError = KeycloakError;