'use strict'
const KeycloakUser = require("./KeycloakUser").KeycloakUser;
const OperationSession = require("./OperationSession").OperationSession;
const KeycloakRole = require("./KeycloakRole").KeycloakRole;
const UserOperation = require("./UserOpeation").UserOperation;
const KeycloakAPI = require("./KeycloakAPI").KeycloakAPI;
const AccessTokenAdpater = require("./AccessTokenAdpater").AccessTokenAdpater;
class KeycloakAdapter {
    
    serverHost = null;
    serverPort = 0;
    useHttps = false;
    keycloakRealm = null;
    keycloakClient = null;

    User = new UserOperation(this);
    API = new KeycloakAPI(this);
    Token = new AccessTokenAdpater(this);

    async openSession(username , passord){
        const access_token = await this.Token.get(username , passord);
        let user = KeycloakUser.build(access_token);
        const session = OperationSession.open(user);
        if(true){
            let userInfoResData = await this.Token.validate(user.accessToken);
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

    async getRealmClients( opSession , clientName){
        let queryUri = `auth/admin/realms/${this.keycloakRealm.name}/clients`;
        const resData = await this.API.get(queryUri , opSession.keycloakUser);
        if(clientName){
            const targetClient = resData.find(
                client => client.name == clientName
            )
            return targetClient;
        } else return resData;
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