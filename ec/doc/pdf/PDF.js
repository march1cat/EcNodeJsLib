'use strict'
const PDFDocument = require('pdfkit');
const Basis = require('../../system/Basis').Basis;
const FileTool = require('../../common/FileTool').FileTool;
const Page = require('./Page').Page;

class PDF extends Basis {

    doc = null;
    nowPage = null; // PDF Document , virtual page opertion
    pageOption = { layout: 'landscape'}

    constructor(uri){
        super();
        const fileTool = new FileTool();
        this.doc = new PDFDocument( this.pageOption );
        this.doc.pipe(fileTool.createOutputStream(uri));
        this.nowPage = new Page(this.doc);
        this.setFontSize();
    }

    getNowPage(){
        return this.nowPage;
    }

    setFontSize(size = 24){
        this.doc.fontSize(size);
    }

    newPage(){
        
        const page = new Page(this.doc.addPage(this.pageOption));
        this.nowPage = page;
        return page;
        //this.doc.addPage().text('Here is some vector graphics...', 100, 100)
    }

    close(){
        this.doc.end();
    }


}


module.exports.PDF = PDF;