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