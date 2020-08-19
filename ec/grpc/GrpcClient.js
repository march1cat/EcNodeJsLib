'use strict'
const Basis = require("../system/Basis").Basis;

class GrpcClient extends Basis {

    client = null;

    constructor(client){
        super();
        this.client = client;
    }

    callMethod(methodName , sendData){
        return new Promise(
            (resolve , reject) => {
                this.client[methodName]( sendData , (err , res) => {
                    if(err) reject(err);
                    else resolve(res);
                })
            }
        );
    }

}

module.exports.GrpcClient = GrpcClient;