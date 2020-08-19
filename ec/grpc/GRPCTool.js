'use strict'
const Basis = require("../system/Basis").Basis;
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const GrpcClient = require("./GrpcClient").GrpcClient;

class GRPCTool extends Basis {

    protoBufferUri = null;

    constructor(protoBufferUri){
        super();
        this.protoBufferUri = protoBufferUri;
    }

    buildClient(serveUrl , packageName , service){
        let proto = grpc.loadPackageDefinition(this.loadProtoBuffer());
        let packages = packageName.split(".");
        for(var i in packages){
            let p = packages[i];
            proto = proto[p];
        }
        let client = new proto[service](serveUrl ,  grpc.credentials.createInsecure());
        let gClient = new GrpcClient(client);
        return gClient;
    }

    loadProtoBuffer(){
        let protoDefition = protoLoader.loadSync(
            this.protoBufferUri ,
            {
                keepCase : true , 
                longs : String , 
                enums : String , 
                defaults : true , 
                oneofs : true
            }
        );
        return protoDefition;
    }




}

module.exports.GRPCTool = GRPCTool;