'use strict'
const KeycloakError = require("./KeycloakError").KeycloakError;
const KeycloakUser = require("./KeycloakUser").KeycloakUser;
const OperationSession = require("./OperationSession").OperationSession;
const KeycloakRole = require("./KeycloakRole").KeycloakRole;
const UserOperation = require("./UserOpeation").UserOperation;
const KeycloakAPI = require("./KeycloakAPI").KeycloakAPI;
class KeycloakAdapter {
    
    serverHost = null;
    serverPort = 0;
    useHttps = false;
    keycloakRealm = null;
    keycloakClient = null;

    User = new UserOperation(this);
    API = new KeycloakAPI(this);


    async openSession(username , passord){
        let queryUri = `auth/realms/${this.keycloakRealm.name}/protocol/openid-connect/token`;
        let postData = "";
        postData += "grant_type=password&";
        postData += `client_id=${this.keycloakClient.name}&`;
        postData += `client_secret=${this.keycloakClient.secretText}&`;
        postData += `username=${username}&`;
        postData += `password=${passord}`;
        let resData = await this.API.post(queryUri , postData , "application/x-www-form-urlencoded");

        if (!resData.access_token)  throw new KeycloakError("access token missed!!")
        else {
            let user = KeycloakUser.build(resData.access_token);
            const session = OperationSession.open(user);
            if(true){
                let userInfoResData = await this.validateToken(user.accessToken);
                user.name = userInfoResData.name;
                user.preferedName = userInfoResData.preferred_username;
                user.email = userInfoResData.email;
            }

            if(true){
                let clients = await this.getRealmClients(session);
                const clientData = clients.find( client => client.clientId == this.keycloakClient.name);
                this.keycloakClient.id = clientData.id;
            }
            return session;
        }
    }

    async validateToken( accessToken ){
        let user = KeycloakUser.build(accessToken);
        let queryUri = `auth/realms/${this.keycloakRealm.name}/protocol/openid-connect/userinfo`;
        const resData = await this.API.get(queryUri , user);
        return resData;
    }

    async getRealmClients( opSession ){
        let queryUri = `auth/admin/realms/${this.keycloakRealm.name}/clients`;
        const resData = await this.API.get(queryUri , opSession.keycloakUser);
        return resData;
    }

    async getClientRoles( opSession ){
        let queryUri = `auth/admin/realms/${this.keycloakRealm.name}/clients/${this.keycloakClient.id}/roles`;
        const roleDatas = await this.API.get(queryUri , opSession.keycloakUser);
        const roles = [];
        roleDatas.forEach(roleData => {
            roles.push(
                KeycloakRole.newInstance(roleData.id , roleData.name)
            )
        });
        return roles;
    }

    

    

    async mappingClientUserRole(opSession , username , keycloakRole){
        const target_user_id = await this.User.getID(opSession , username);
        if(target_user_id) {
            let queryUri = `auth/admin/realms/${this.keycloakRealm.name}/users/${target_user_id}/`;
            queryUri += `role-mappings/clients/${this.keycloakClient.id}`;
            let postData = [
                {
                    id : keycloakRole.id , 
                    name : keycloakRole.name , 
                    composite : keycloakRole.composite ,
                    clientRole : true , 
                    containerId : this.keycloakClient.id
                }
            ]
            const res = await this.API.post(queryUri , JSON.stringify(postData) , "application/json" ,opSession.keycloakUser);
            return true;
        } else throw new KeycloakError(`User[${username}] not exist!!`);  
        
    }

    static open(serverHost , serverPort , keycloakRealm , keycloakClient){
        let adapter = new KeycloakAdapter();
        adapter.serverHost = serverHost;
        adapter.serverPort = serverPort;
        adapter.keycloakRealm = keycloakRealm;
        adapter.keycloakClient = keycloakClient;
        adapter.useHttps = true;
        return adapter;
    }
}

module.exports.KeycloakAdapter = KeycloakAdapter;