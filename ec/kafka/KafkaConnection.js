'use strict'
const Basis = require("../system/Basis").Basis;
const kafka = require('kafka-node');

class KafkaConnection extends Basis {

    kafkaHost = null;
    userName = null;
    userPwd = null;

    

    constructor(host){
        super();
        this.kafkaHost = host;
    }

    setAuthInfo(acct , pwd){
        this.userName = acct;
        this.userPwd = pwd;
    }

    buildConsumer(groupId , topic , offset , isAvroActivated){
        let clientOpts = this.defaultClientOption();
        clientOpts.groupId = groupId;
        clientOpts.encoding = isAvroActivated ? 'buffer' : 'utf8';
        clientOpts.fromOffset = offset;

        let consumeTarget = typeof topic == 'string' ? [ topic ] : topic
        let client =  new kafka.ConsumerGroup(clientOpts, consumeTarget );
        return client;
    }

    buildProducer(){
        let clientOpts = this.defaultClientOption();

        let client = new kafka.KafkaClient(clientOpts);
        let producer = new kafka.Producer(client, {
            partitionerType: 2
        });
        return producer;
    }


    defaultClientOption(){
        let option = {
            kafkaHost: this.kafkaHost,
            connectTimeout: 10000,
            requestTimeout: 30000,
            autoConnect: true,
            connectRetryOptions: {
              retries: 5,
              factor: 0,
              minTimeout: 1000,
              maxTimeout: 1000,
              randomize: false
            },
            idleConnection: 5 * 60 * 1000,
            maxAsyncRequests: 10
          };

        if (this.userName && this.userPwd) {
            option.sasl = {
              mechanism: 'plain',
              username: this.userName,
              password: this.userPwd
            };
        }
        return  option;
    }

    toKeyedMessage (key, message) {
        return new kafka.KeyedMessage(key, message);
    }

}



module.exports = {
    KafkaConnection : KafkaConnection
}