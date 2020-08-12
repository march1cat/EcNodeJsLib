'use strict'
const Basis = require("../system/Basis").Basis;
const HttpClient = require("../net/HttpClient").HttpClient;
const EcHttpPath = require("../common/EcHttpPath").EcHttpPath;

class SchemaRegistry extends Basis{

    host = null;
    cacheDataPool = {};


    constructor(host){
        super();
        this.host = host;
    }

    toSubjectsUrl () {
        return `${this.host}/subjects`;
    }

    toSubjectVersionsUrl (topic) {
        return `${this.toSubjectsUrl()}/${topic}-value/versions`;
    }

    getVersions( topic ){
        return new Promise(
            ( resolve , reject ) => {
                const url = new EcHttpPath(this.toSubjectVersionsUrl(topic));
                let http = new HttpClient();
                http.get(url).then( result => resolve(JSON.parse(result))).catch( err => reject(err) );
            }
        );
    }

    getSchema (topic, version) {
        return new Promise(
            ( resolve , reject ) => {
                if(this.cacheDataPool[topic]){
                    resolve(this.cacheDataPool[topic]);
                } else {
                    const url = new EcHttpPath(`${this.toSubjectVersionsUrl(topic)}/${version}`);
                    let http = new HttpClient();
                    http.get(url).then( result =>  {
                        let data = JSON.parse(result);
                        this.cacheDataPool[topic] = data;
                        this.cacheDataPool[data.id] = data;
                        resolve(data);
                    }).catch( err => reject(err) );
                }
            }
        );
    }

    getLatestVersion(topic){
        return new Promise(
            async ( resolve , reject ) => {
                try {
                    let versions = await this.getVersions(topic);
                    if(versions && versions.length > 0) {
                        resolve(Math.max(...versions));
                    } else reject("Get topic versions fail , server res = " , versions);
                } catch(err){
                    reject(err);
                }
            }
        );
    }

    getLatestSchema (topic) {
        return new Promise(
            async (resolve , reject) => {
                if(this.cacheDataPool[topic]){
                    resolve(this.cacheDataPool[topic]);
                } else {
                    try {
                        let latestVersion = await this.getLatestVersion(topic);
                        let schemaData = await this.getSchema( topic , latestVersion);
                        resolve(schemaData); 
                    } catch(err){
                        reject(err);
                    }
                }
            }
        );
     }

     getLatestSchemaID( topic ){
        return new Promise(
            async (resolve , reject) => {
                try {
                    let data = await this.getLatestSchema(topic);
                    resolve(data.id);
                } catch(err){
                    reject(err);
                }
            }
        );
     }

     getSchemaById(id){
        return new Promise(
            (resolve , reject) => {
                if(this.cacheDataPool[id]){
                    resolve(this.cacheDataPool[id]);
                } else {
                    const url = new EcHttpPath(`${this.host}/schemas/ids/${id}`);
                    let http = new HttpClient();
                    http.get(url).then( result => resolve(JSON.parse(result))).catch( err => reject(err) );
                }
            }
        );
     }

}

module.exports = {
    SchemaRegistry : SchemaRegistry
}