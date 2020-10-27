'use restrict';
const StringTool = require('../common/StringTool').StringTool;

class Logger {
    
    useConsole = true;
    writeToFileName = null;

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

    static embedLog4JS( saveToPath , isDailyFile){
        try {
            const log4js = require('log4js');
            log4js.configure(
                {
                    appenders:  {
                            std: { type: "stdout", level: "all", layout:{type: "basic", } },
                            file: { type: "file", filename: saveToPath, encoding: "utf-8" } , 
                            datefile : {
                                type: 'dateFile' ,
                                filename: saveToPath , 
                                encoding: 'utf-8' , 
                                pattern: "-yyyy-MM-dd",
                                keepFileExt: true,
                                alwaysIncludePattern: true,
                            }
                    },
                    categories: {
                        default: {appenders: ["std"], level: "debug"},
                        custom: {appenders: ["std", "file"], level: "all"} , 
                        daily: {appenders: ["std", "datefile"], level: "all"}
                    }
                    
                }
              )
              Logger.log4jsLogger = isDailyFile ? log4js.getLogger('daily') : log4js.getLogger('custom');
        } catch(e){
            console.log("Embed Log4JS fail , error = " , e);
        }
    } 

    

}


module.exports = {
    Logger : Logger
}