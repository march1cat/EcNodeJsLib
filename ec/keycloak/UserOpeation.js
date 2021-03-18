'use strict'
const KeycloakError = require("./KeycloakError").KeycloakError;
const KeycloakRole = require("./KeycloakRole").KeycloakRole;

class UserOperation {

    keycloakAdapter = null;

    constructor(keycloakAdapter){
        this.keycloakAdapter = keycloakAdapter;
    }

    async find(opSession , username) {
        let queryUri = `auth/admin/realms/${this.keycloakAdapter.keycloakRealm.name}/users?username=${username}`;
        return await this.keycloakAdapter.API.get(queryUri , opSession.keycloakUser);
    }

    async getID(opSession , username){
        let findUserResDatas = await this.find(opSession , username);
        if (findUserResDatas && findUserResDatas.length){
            const target_user_id = findUserResDatas[0].id;
            return target_user_id;
        }
    }

    async create(opSession , username , password , options){
        let queryUri = `auth/admin/realms/${this.keycloakAdapter.keycloakRealm.name}/users`;
        let postData = {
            username : username ,
            credentials : [
                { 
                  type : "password",
                  value : password,
                  temporary : false
                }
            ] , 
            enabled : true
        }
        if(options){
            const keys = Object.keys(options);
            keys.forEach(key => {
                postData[key] = options[key];
            });
        }
        
        await this.keycloakAdapter.API.post(queryUri , JSON.stringify(postData) , "application/json" , opSession.keycloakUser);
        return true;
    }

    async delete(opSession , username){
        const target_user_id = await this.getID(opSession , username);
        if (target_user_id){
            let queryUri = `auth/admin/realms/${this.keycloakAdapter.keycloakRealm.name}/users/${target_user_id}`;
            await this.keycloakAdapter.API.delete(queryUri , opSession.keycloakUser);
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
            let queryUri = `auth/admin/realms/${this.keycloakAdapter.keycloakRealm.name}/users/${target_user_id}`;
            let postData = {}
    
            if(options){
                const keys = Object.keys(options);
                keys.forEach(key => {
                    postData[key] = options[key];
                })
            }
            await this.keycloakAdapter.API.put(queryUri , JSON.stringify(postData) , "application/json" , opSession.keycloakUser);
            return true;
        } else throw new KeycloakError(`User[${username}] not exist!!`); 
    }

    async resetPassword(opSession , username , password){
        const target_user_id = await this.getID(opSession , username);
        if (target_user_id){
            let queryUri = `auth/admin/realms/${this.keycloakAdapter.keycloakRealm.name}/users/${target_user_id}/reset-password`;
            let postData = {
                credentials : { 
                    type : "password",
                    value : password,
                    temporary : false
                  }
            }
            await this.keycloakAdapter.API.put(queryUri , JSON.stringify(postData) , "application/json" , opSession.keycloakUser);
            return true;
        } else throw new KeycloakError(`User[${username}] not exist!!`); 
    }


    async assignClientRole(opSession , username , keycloakRole){
        const target_user_id = await this.getID(opSession , username);
        if(target_user_id) {
            let queryUri = `auth/admin/realms/${this.keycloakAdapter.keycloakRealm.name}/users/${target_user_id}/`;
            queryUri += `role-mappings/clients/${this.keycloakAdapter.keycloakClient.id}`;
            let postData = [
                {
                    id : keycloakRole.id , 
                    name : keycloakRole.name , 
                    composite : keycloakRole.composite ,
                    clientRole : true , 
                    containerId : this.keycloakAdapter.keycloakClient.id
                }
            ]
            const res = await this.keycloakAdapter.API.post(queryUri , JSON.stringify(postData) , "application/json" ,opSession.keycloakUser);
            return true;
        } else throw new KeycloakError(`User[${username}] not exist!!`);  
    }

    async getBelongRoles(opSession , username ){
        const target_user_id = await this.getID(opSession , username);
        if(target_user_id) {
            let queryUri = `auth/admin/realms/${this.keycloakAdapter.keycloakRealm.name}/users/${target_user_id}/`;
            queryUri += `role-mappings/clients/${this.keycloakAdapter.keycloakClient.id}`;
            const roleDatas = await this.keycloakAdapter.API.get(queryUri ,opSession.keycloakUser);
            if(roleDatas && roleDatas.length){
                const roles = [];
                roleDatas.forEach(roleData => {
                    roles.push(
                        KeycloakRole.newInstance(roleData.id , roleData.name)
                    )
                });
                return roles;
            } else return [];
        }
    }



}

module.exports.UserOperation = UserOperation;