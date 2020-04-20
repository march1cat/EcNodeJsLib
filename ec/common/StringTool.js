'use restrict';

class StringTool {
    now(){
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        return date + " " + time;
    }

    regSearch (regExpText , data) {
        const re = new RegExp(regExpText);
        return re.exec(data);
    }

    parsingUrl(url){
        let ans = this.regSearch('^(.*)://([A-Za-z0-9\-\.]+):([0-9]+)?(.*)$' , url);
        let data = {
            protocol : ans[1] ,
            host : ans[2] ,
            port : ans[3] ,
            path : ans[4] ,
        }
        return data;
    }

    regValidate (regExpText , data){
        const re = new RegExp(regExpText);
        return re.test(data);
    }

    isNumber(data){
        return !this.regValidate('[a-z|A-Z]' , data);
    }
}


module.exports = {
    StringTool : StringTool
}