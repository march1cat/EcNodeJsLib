'use strict'
const Basis = require("../system/Basis").Basis;
const avro = require('avsc');


class AvroConvert extends Basis {

    constructor(){
        super();
    }

    static encode(schema , data){
        if( typeof data == 'string') {
            this.log("Encode Avro fail , input data can't be type of string!!");
        } else {
            let type = avro.Type.forSchema(schema);
            let buf = type.toBuffer(data);
            return buf;
        }
    }


    static decode(schema , data){
        let type = avro.Type.forSchema(schema);
        let value = type.fromBuffer(data);
        return value;
    }

}

module.exports = {
    AvroConvert : AvroConvert
}