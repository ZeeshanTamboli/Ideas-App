const moment = require('moment-timezone');

const pdf = require('pdfkit');
const fs = require('fs');

module.exports = {
  formatDate(date, format) {
    if (process.env.NODE_ENV === 'production') {
      return moment(date)
        .tz('Asia/Kolkata')
        .format(format);
    } else {
      return moment(date).format(format);
    }
  },
  PDFgenerator(ideas) {
    const myDoc = new pdf();
    for (let i = 0; i < ideas.length; i++) {
      let Idea = ideas[i].idea;
      myDoc.pipe(fs.createWriteStream('idea.pdf'));
      myDoc
        .font('Times-Roman')
        .fontSize(10)
        .text(Idea, 100, 100);
    }
    myDoc.end();
    return myDoc;
  }
};
