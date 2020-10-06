'use strict'
const Basis = require("../system/Basis").Basis;
const StreamChannel = require("./StreamChannel").StreamChannel;
class GrpcClient extends Basis {

    client = null;

    constructor(client){
        super();
        this.client = client;
    }

    callSimpleApi(methodName , sendData){
        return new Promise(
            (resolve , reject) => {
                this.client[methodName]( sendData , (err , res) => {
                    if(err) reject(err);
                    else resolve(res);
                })
            }
        );
    }


    buildServerStreamChannel(methodName , sendData){
        const streamChannel = new StreamChannel();
        const channel = this.client[methodName](sendData);
        streamChannel.bindGrpcChannel(channel);
        channel.on('data' , res => streamChannel.onServerResponse(res));
        channel.on('error' , res => streamChannel.onServerError(res));
        channel.on('end' , () => streamChannel.onServerComplete());
        return streamChannel;
    }


    buildClientStreamChannel(methodName){
        const streamChannel = new StreamChannel();
        const channel = this.client[methodName](
            (err , stat) => {
                if(err) streamChannel.onServerError(err);
                else streamChannel.onServerResponse(stat);
            }
        );
        streamChannel.bindGrpcChannel(channel);
        return streamChannel;
    }


    buildBidirectionStreamChannel(methodName){
        const streamChannel = this.buildClientStreamChannel(methodName);
        streamChannel.getGrpcChannel().on('data' , res => streamChannel.onServerResponse(res));
        streamChannel.getGrpcChannel().on('error' , res => streamChannel.onServerError(res));
        streamChannel.getGrpcChannel().on('end' , () => streamChannel.onServerComplete());
        return streamChannel;
    }

}

module.exports.GrpcClient = GrpcClient;