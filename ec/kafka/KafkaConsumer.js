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
        consumer.on('message', async (message) => {
            if(this.isAvroActivated()){
                try {
                    let data = await this.decodeMessage(message);
                    if(this.doPrintLog) this.log(`[${topic}] Consume Message , ` , data);
                    if(onMessage) onMessage(data);
                } catch(err){
                    if(onError) onError(err);
                    else this.log("Error : " , err);
                }
            } else {
                if(this.doPrintLog) this.log(`[${topic}] Consume Message , ` , message);
                if(onMessage) onMessage(message);
            }
        });
        consumer.on('error', message => {
            if(onError) onError(message);
            else this.log("Error : " , message);
        });
    }

    async decodeMessage(message){
        if (message.value.readUInt8(0) === 0) {
            let schemaId = message.value.readUInt32BE(1);
            let res = await this.schemaRegistry.getSchemaById(schemaId);
            let schema = JSON.parse(res.schema);
            let data = AvroConvert.decode(schema , message.value.slice(5));
            message.value = data;
            return message;
        }
    }

}



module.exports = {
    KafkaConsumer : KafkaConsumer
}