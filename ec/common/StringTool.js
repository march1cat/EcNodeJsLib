'use strict';

class StringTool {
    now(){
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2,'0')+'-'+today.getDate().toString().padStart(2,'0');
        var time = today.getHours().toString().padStart(2,'0') + ":" + today.getMinutes().toString().padStart(2,'0') + ":" + today.getSeconds().toString().padStart(2,'0');
        return date + " " + time;
    }

    sysDate(){
        var today = new Date();
        var date = today.getFullYear()+''+(today.getMonth()+1).toString().padStart(2,'0')+''+today.getDate().toString().padStart(2,'0');
        return date;
    }
    sysTime(){
        var today = new Date();
        var time = today.getHours().toString().padStart(2,'0') + "" + today.getMinutes().toString().padStart(2,'0') + "" + today.getSeconds().toString().padStart(2,'0');
        return  time;
    }

    toFormatDate(date , delimiter){
        let sep = delimiter ? delimiter : "";
        return date.getFullYear()+ sep +(date.getMonth()+1).toString().padStart(2,'0') + sep + date.getDate().toString().padStart(2,'0');
    }

    toFormatTime(date , delimiter){
        let sep = delimiter ? delimiter : "";
        return date.getHours().toString().padStart(2,'0') + sep + date.getMinutes().toString().padStart(2,'0') + sep + date.getSeconds().toString().padStart(2,'0');
    }

    regSearch (regExpText , data) {
        const re = new RegExp(regExpText);
        return re.exec(data);
    }

    parsingUrl(url){
        
        try {
            let ans = this.regSearch('^(.*)://([A-Za-z0-9\-\.]+):([0-9]+)?(.*)$' , url);
            let data = {
                protocol : ans[1] ,
                host : ans[2] ,
                port : ans[3] ,
                path : ans[4] ,
            }
            return data;
        } catch(err){
            let ans = this.regSearch('^(.*)://([A-Za-z0-9\-\.]+)/(.*)$' , url);
            let data = {
                protocol : ans[1] ,
                host : ans[2] ,
                path : ans[3] ,
            }
            data.port = data.protocol.toLocaleLowerCase() == 'https' ? 443 : 80;
            return data;
        }
    }

    regValidate (regExpText , data){
        const re = new RegExp(regExpText);
        return re.test(data);
    }

    isNumber(data){
        return !this.regValidate('[a-z|A-Z]' , data);
    }

    formaFloat(value , keepPointLen){
        return value.toFixed(keepPointLen);
    }
}


module.exports = {
    StringTool : StringTool
}