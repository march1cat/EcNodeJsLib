'use strict'
const Basis = require("../system/Basis").Basis;

class StreamChannel extends Basis {

    grpc_channel = null;
    onResponse = null;
    onError = null;
    onComplete = null;

    constructor(){
        super();
    }

    bindGrpcChannel(grpc_channel){
        this.grpc_channel = grpc_channel;
    }

    onServerResponse(res){
        if(this.onResponse) this.onResponse(res);
    }

    onServerError(err){
        if(this.onError) this.onError(err);
    }

    onServerComplete(){
        if(this.onComplete) this.onComplete();
    }

    getGrpcChannel(){
        return this.grpc_channel;
    }


    //** public method */ */

    subscribeServerRes(onResponse){
        this.onResponse = onResponse;
    }

    subscribeServerError(onError){
        this.onError = onError;
    }

    subscribeServerComplete(onComplete){
        this.onComplete = onComplete;
    }

    write(data){
        return new Promise (
            (resolve , reject) => {
                try {
                    this.grpc_channel.write(data);
                    resolve();
                } catch(err){
                    reject(err);
                }
            }
        );
    }

     writeDatas(sendDatas){
        return new Promise(
            (resolve , reject) => {
                try {
                    for(let i = 0 ; i < sendDatas.length; i++){
                        this.grpc_channel.write(sendDatas[i]);
                    }
                    resolve();
                } catch(err){
                    reject(err);
                }
            }
        );
    }

    close(){
        this.grpc_channel.end();
    }

}


module.exports.StreamChannel = StreamChannel;