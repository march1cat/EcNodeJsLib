'use strict'


class Page {
    page = null; // PDF Document , virtual page opertion
    constructor(page){
        this.page = page;
    }

    addText(text , xpos , ypos){
        if(xpos && ypos) {
            this.page.text(text , xpos , ypos);
        } else this.page.text(text);
    }

    addImage(imgPath){
        this.page.image(imgPath , 0 , 0 , { fit : [792 - 7 , 612 - 7] });
    }

}

module.exports.Page = Page;