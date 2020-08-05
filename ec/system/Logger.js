'use restrict';
const StringTool = require('../common/StringTool').StringTool;

class Logger {
    
    useConsole = true;

    static log4jsLogger = null;

    log (message , variable) {
        if(Logger.log4jsLogger){
            if(variable) Logger.log4jsLogger.info(message , variable);
            else Logger.log4jsLogger.info(message);
        } else {
            const tool = new StringTool();
            const msg = "[" + tool.now() + "] " + message;
            if(this.useConsole) this.logInConsle(msg , variable);
        }
    }

    logInConsle(message , variable){
        if(variable) console.log(message , variable);
        else console.log(message);
    }

    static embedLog4JS( saveToPath ){
        try {
            const log4js = require('log4js');
            log4js.configure(
                {
                    appenders:  {
                            std: { type: "stdout", level: "all", layout:{type: "basic", } },
                            file: { type: "file", filename: saveToPath, encoding: "utf-8" }
                    },
                    categories: {
                        default: {appenders: ["std"], level: "debug"},
                        custom: {appenders: ["std", "file"], level: "all"}
                    }
                    
                }
              )
              Logger.log4jsLogger = log4js.getLogger('custom');
        } catch(e){
            console.log("Embed Log4JS fail , error = " , e);
        }
    }

}


module.exports = {
    Logger : Logger
}