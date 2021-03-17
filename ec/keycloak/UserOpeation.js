'use strict'
const KeycloakError = require("./KeycloakError").KeycloakError;

class UserOperation {

    keycloakAdapter = null;

    constructor(keycloakAdapter){
        this.keycloakAdapter = keycloakAdapter;
    }

    async find(opSession , username) {
        let queryUri = `auth/admin/realms/${keycloakAdapter.keycloakRealm.name}/users?username=${username}`;
        return await this.keycloakAdapter.getApi(queryUri , opSession.keycloakUser);
    }

    async getID(opSession , username){
        let findUserResDatas = await this.find(opSession , username);
        if (findUserResDatas && findUserResDatas.length){
            const target_user_id = findUserResDatas[0].id;
            return target_user_id;
        }
    }

    async create(opSession , username , password){
        let queryUri = `auth/admin/realms/${keycloakAdapter.keycloakRealm.name}/users`;
        let postData = {
            username : username ,
            credentials : [
                { type : "password",
                  value : password,
                  temporary : false
                }
            ] , 
            enabled : true
        }
        await keycloakAdapter.postApi(queryUri , JSON.stringify(postData) , "application/json" , opSession.keycloakUser);
        return true;
    }

    async delete(opSession , username){
        const target_user_id = await this.getID(opSession , username);
        if (target_user_id){
            let queryUri = `auth/admin/realms/${keycloakAdapter.keycloakRealm.name}/users/${target_user_id}`;
            await keycloakAdapter.deleteApi(queryUri , opSession.keycloakUser);
            return true;
        }  else throw new KeycloakError(`User[${username}] not exist!!`); 
    }

    /*
        please refer 
        https://www.keycloak.org/docs-api/5.0/rest-api/index.html#_userrepresentation
        for detail attributes
    */
    async update(opSession , username , options){
        if(!options) throw new KeycloakError(`Update attributes can't be empty!!`); 
        const target_user_id = await this.getID(opSession , username);
        if (target_user_id){
            let queryUri = `auth/admin/realms/${keycloakAdapter.keycloakRealm.name}/users`;
            let postData = {}
    
            if(options){
                const keys = Object.keys(options);
                keys.forEach(key => {
                    if(key.toLocaleLowerCase() == 'password') {
                        postData.credentials = [
                            { 
                                type : "password",
                                value : options[key],
                                temporary : false
                            }
                        ]
                    } else {
                        postData[key] = options[key];
                    }
                })
            }
            await keycloakAdapter.postApi(queryUri , JSON.stringify(postData) , "application/json" , opSession.keycloakUser);
            return true;
        } else throw new KeycloakError(`User[${username}] not exist!!`); 
    }



}

module.exports.UserOperation = UserOperation;