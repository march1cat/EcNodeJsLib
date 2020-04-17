'use restrict';
const Logger = require('./Logger').Logger;


class Basis {

    logger = null;

    constructor(logger){
        if(logger) this.logger = logger;
        else this.logger = new Logger();
    }

    hold(waitTime){
        return new Promise (
            (resolve , reject) => {
                setTimeout(resolve, waitTime);
            }
        );
    }

    AppConfig(){
        return process.AppConfig;
    }

    log(message , variable){
        this.logger.log(message , variable);
    }
}

module.exports = {
    Basis : Basis
}