'use restrict';
const StringTool = require('../common/StringTool').StringTool;

class Logger {
    
    useConsole = true;

    log (message , variable) {
        const tool = new StringTool();
        const msg = "[" + tool.now() + "] " + message;
        if(this.useConsole) this.logInConsle(msg , variable);
    }

    logInConsle(message , variable){
        if(variable) console.log(message , variable);
        else console.log(message);
    }

}


module.exports = {
    Logger : Logger
}