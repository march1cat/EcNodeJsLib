'use strict'

class KeycloakRealm {

    name = null;

    static build(name){
        let realm = new KeycloakRealm();
        realm.name = name;
        return realm;
    }
}

module.exports.KeycloakRealm = KeycloakRealm;
