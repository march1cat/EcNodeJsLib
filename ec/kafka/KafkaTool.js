'use strict'
const Basis = require("../system/Basis").Basis;
const SchemaRegistry = require("../kafka/SchemaRegistry").SchemaRegistry;

class KafkaTool extends Basis {

    kafkaConn = null;
    schemaRegistry = null;
    doPrintLog = false;

    constructor(kafkaConn){
        super();
        this.kafkaConn = kafkaConn;
    }

    setSchemaRegistryInfo(registryHost){
        this.schemaRegistry = new SchemaRegistry(registryHost);
    }

    isAvroActivated(){
        return this.schemaRegistry ? true : false;
    }

    switchOnLog(){
        this.doPrintLog = true;
    }
}

module.exports = {
    KafkaTool : KafkaTool
}