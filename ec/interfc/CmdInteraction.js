'use strict'
const Basis = require('../system/Basis').Basis;

class CmdInteraction extends Basis{

    inputEncode = "utf8";
    constructor (inputEncode) {
        super();
        if( inputEncode ) this.inputEncode = inputEncode;
    }
    async listenInput(){
        try {
            let input = await this.generateConsoleInput();
            return input;
        } catch(err){
            this.log("User command interaction fail , error = " , err);
            return 'error';
        }
    }

    generateConsoleInput(){
        process.stdin.setEncoding(this.inputEncode);
        return new Promise(
            (resolve , reject) => {
                process.stdin.on('data', function(key) {
                    process.stdin.removeAllListeners();
                    resolve(key);
                });
            }
        );
    }


}



module.exports.CmdInteraction = CmdInteraction;