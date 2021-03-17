'use  strict'

class KeycloakRole {

    id = null;
    name = null;

    static newInstance(id , name){
        const role = new KeycloakRole();
        role.id = id;
        role.name = name;
        return role;
    }




}

module.exports.KeycloakRole = KeycloakRole;