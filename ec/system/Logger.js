'use restrict';
const StringTool = require('../common/StringTool').StringTool;

class Logger {
    
    useConsole = true;
    writeToFileName = null;

    log (message , variable) {
        const tool = new StringTool();
        const msg = "[" + tool.now() + "] " + message;
        if(this.useConsole) this.logInConsle(msg , variable);
        if( this.writeToFileName != null ) {

        }
    }

    logInConsle(message , variable){
        if(variable) console.log(message , variable);
        else console.log(message);
    }

    setWriteToFileName(fileName){
        this.writeToFileName = fileName;
    }

}


module.exports = {
    Logger : Logger
}