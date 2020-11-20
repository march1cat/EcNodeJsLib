'use strict'

const Basis = require("../system/Basis").Basis;
const grpc = require("grpc");

class GrpcServer extends Basis {

    server = null;
    proto = null;

    constructor(server){
        super();
        this.server = server;
    }

    setProto(proto){
        this.proto = proto;
    }

    bindServiceMethod(serviceName , funcs){
        if(this.proto[serviceName] && this.proto[serviceName].service)
            this.server.addService(this.proto[serviceName].service ,  funcs);
        else this.log(`Service Name ${serviceName} not exist in proto file`);
    }

    start(port , bindingIP){
        const host = bindingIP ? `${bindingIP}:${port}` : `0.0.0.0:${port}`;
        this.server.bind(host, grpc.ServerCredentials.createInsecure());
        this.server.start();
    }


    genSimpleApiFunc(handleFunc){
        const func = async function(call , callback){
            const result = await handleFunc(call.request);
            callback( null , result);
        };
        return func;
    }

    genServerStreamFunc(handleFunc){
        const func = async function(call){
            await handleFunc(call.request , streamData => call.write(streamData) );
            call.end();
        };
        return func;
    }

    genClientStreamFunc( onData , onComplete){
        const func = function(call , callback){
            call.on('data', async function(data) {
                await onData(data);
            });
            call.on('end', async function() {
                const result = await onComplete();
                callback(null , result);
            });
        }
        return func;
    }

    genBidStreamFunc ( onData , onComplete ){
        const func = function(call){
            const reply = resData => call.write(resData);

            call.on('data', async function(data) {
                const res = await onData(data);
                reply(res);
            });
            call.on('end', async function() {
                await onComplete();
                call.end();
            });
        };
        return func;
    }


}

module.exports.GrpcServer = GrpcServer;