'use strict'
const Basis = require("../system/Basis").Basis;
const schedule = require("node-schedule");

class DailyJob extends Basis {

    scheduleSetting = null;
    jobName = null;
    constructor (){
        super();
    }

    setExecuteCronTime( cronTimeText ){
        //* * * * *
        this.scheduleSetting = cronTimeText;
    }

    setExecuteTime( time ){
        //10:50
        if(time.includes(":")){
            let paras = time.split(":");
            let cronTimeText = paras[0] + " " + paras[1] + " * * *";
            this.setExecuteCronTime(cronTimeText);
        } else {
            this.log("Not validate schedule time format!!");
        }
    }

    setJobName( name ){
        this.jobName = name;
    }

    start( executeFunc ){
        this.log("Start Daily Job " + (this.jobName != null ? "(" + this.jobName +  ")" : "")  + " , execute time = " + this.scheduleSetting);
        schedule.scheduleJob( this.scheduleSetting ,  () => {
            this.log("Prepare execute Daily Job " + (this.jobName != null ? "(" + this.jobName +  ")" : ""));
            executeFunc();
        }); 
    }

}


module.exports = {
    DailyJob : DailyJob
}