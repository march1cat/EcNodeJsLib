'use strict'

const KafkaTool = require("../kafka/KafkaTool").KafkaTool;
const AvroConvert = require("../kafka/AvroConvert").AvroConvert;

class KafkaProducer extends KafkaTool {

    producerClient = null;

    constructor(kafkaConn){
        super(kafkaConn);
    }


    connect(onReady , onError){
        this.producerClient = this.kafkaConn.buildProducer();
        this.producerClient .on('ready', () => {
            if (onReady)  onReady();
        });
        this.producerClient .on('error', (err) => {
            if (onError) onError(err);
        });
    }

    async publish(topic , data , key){
        try {
            let toSendData = this.isAvroActivated() ? await this.encodeToAvroByTopic(topic , data) : data;
            if(this.doPrintLog) this.log(`[${topic}] Send Message , ` , data);
            let sendResult = await this.sendToKafka(topic , toSendData , key);
            if(this.doPrintLog) this.log(`[${topic}] Send Message Success , Result =  ` , sendResult);
            return sendResult;
        } catch(err){
            return err;
        }
    }

    sendToKafka(topic , message , key){
        return new Promise(
            (resolve , reject) => {
                let datas = [];
                if(message instanceof Array) {
                    let dataCollections = [];
                    message.forEach(item => {
                        let keyMessage = key ? this.kafkaConn.toKeyedMessage(key , item) : item;
                        dataCollections.push(keyMessage);
                    })
                    datas.push ({
                        topic: topic , 
                        messages : dataCollections
                    });
                } else {
                    let keyMessage = key ? this.kafkaConn.toKeyedMessage(key , message) : message;
                    datas.push ({
                        topic: topic , 
                        messages : [ keyMessage ]
                    });
                }
                
                this.producerClient.send(datas , 
                    (err , result) => {
                        if(err) reject(err);
                        else resolve(result);
                    }
                );
            }
        );
    }

    async encodeToAvroByTopic(topic , message){
        let schemaData = await this.schemaRegistry.getLatestSchema(topic);
        let schemaId = schemaData.id;
        let schema = JSON.parse(schemaData.schema);

        if(message instanceof Array){
            let results = [];
            message.forEach(
                item => {
                    let buf = AvroConvert.encode(schema, item);
                    let result = Buffer.alloc(buf.length + 5);
                    result.writeUInt8(0);
                    result.writeUInt32BE(schemaId, 1);
                    buf.copy(result, 5);
                    results.push(result);
                }
            );
            return results;
        } else {
            let buf = AvroConvert.encode(schema, message);
            let result = Buffer.alloc(buf.length + 5);
            result.writeUInt8(0);
            result.writeUInt32BE(schemaId, 1);
            buf.copy(result, 5);
            return result;
        }
    }


    

}

module.exports = {
    KafkaProducer : KafkaProducer
}