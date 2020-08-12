'use strict'
const KafkaTool = require("../kafka/KafkaTool").KafkaTool;
const AvroConvert = require("../kafka/AvroConvert").AvroConvert;

class KafkaConsumer extends KafkaTool {

    static OFFSET_EARLIEST = "earliest";
    static OFFSET_LATEST = "latest";

    constructor(kafkaConn){
        super(kafkaConn);
    }

    start(groupId , topic , offset , onMessage , onError) {
        let consumer = this.kafkaConn.buildConsumer(groupId , topic , offset , this.isAvroActivated());
        consumer.on('message', message => {
            if(this.isAvroActivated()){
                this.decodeMessage(message).then( data => {
                    if(this.doPrintLog) this.log(`[${topic}] Consume Message , ` , data);
                    onMessage(data);
                }).catch(err => onError(err));
            } else {
                if(this.doPrintLog) this.log(`[${topic}] Consume Message , ` , message);
                onMessage(message);
            }
        });
        consumer.on('error', message => {
            if(onError) onError(message);
        });
    }

    decodeMessage(message){
        return new Promise(
           async (resolve , reject) => {
                try {
                    if (message.value.readUInt8(0) === 0) {
                        let schemaId = message.value.readUInt32BE(1);
                        let res = await this.schemaRegistry.getSchemaById(schemaId);
                        let schema = JSON.parse(res.schema);
                        let data = AvroConvert.decode(schema , message.value.slice(5));
                        message.value = data;
                        resolve(message);
                    }
                } catch(err){
                    reject(err);
                }
            }
        );
    }

}



module.exports = {
    KafkaConsumer : KafkaConsumer
}