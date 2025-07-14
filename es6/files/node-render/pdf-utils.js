const { PDFDocument,rgb } =  require('pdf-lib');
const fs = require('fs');

class PdfUtil{
    async drawRectangle(){
        let pdfPath = "/Users/qintianhao/Downloads/lattice_test.pdf"
        let pdfOutPath = "/Users/qintianhao/Downloads/lattice_test_out.pdf"
        let jsonPath = "/Users/qintianhao/Downloads/lattice_test.json"
        let pointJsonPath = "/Users/qintianhao/Downloads/lattice_point_test.json"
        let data = JSON.parse(fs.readFileSync(jsonPath, "utf-8").toString())
        const latticePoints = JSON.parse(fs.readFileSync(pointJsonPath, "utf-8").toString())
        let rectangles = data.datas
        const pageW = data.pageW
        const pageH = data.pageH
        const latticeW = 5600;
        const latticeH = 7920;
        let pdf =  await fs.readFileSync(pdfPath)
        const pdfDoc =  await  PDFDocument.load(pdf)
        let pages = pdfDoc.getPages()
        for (let i = 0; i < pages.length; i++) {
            let page = pages[i]
            const pdfWidth =  page.getWidth();
            const pdfHeight =  page.getHeight();
            const widthP = pdfWidth / pageW;
            const heightP = pdfHeight / pageH;
            const lWidthP = pdfWidth / latticeW;
            const lHeightP = pdfHeight / latticeH;
            console.log(`pdfW:${page.getWidth()}, pdfH:${page.getHeight()}, widthP:${widthP}, heightP:${heightP}, lWidthP:${lWidthP}, lHeightP:${lHeightP}`)
            rectangles.filter(it=>it.pageNum==(i+1))
                .forEach(it=>{
                    const pointX = it.x * widthP;
                    const pointY = (pageH - it.y) * heightP
                    const pWidth = it.w * widthP
                    const pHeight = it.h * heightP
                    const pageLatticePoints = latticePoints.filter(lp=>lp.question_id==it.dataId);
                    page.drawRectangle({
                        x: pointX,
                        y: pointY - pHeight,
                        width: pWidth,
                        height: pHeight,
                        borderColor: rgb(1, 0, 0),
                        borderWidth: 0.1,
                    })
                    for (let latticePoint of pageLatticePoints) {
                        const width = (latticePoint.cx2 - latticePoint.cx1) * lWidthP;
                        const height = (latticePoint.cy2 - latticePoint.cy1) * lHeightP;
                        const x = latticePoint.cx1 * lWidthP;
                        const y = (latticeH - latticePoint.cy2) * lHeightP
                        page.drawRectangle({
                            x: x,
                            y: y,
                            width: width,
                            height: height,
                            borderColor: rgb(0, 0, 1),
                            borderWidth: 0.1,
                        })
                        page.drawText(`A(${latticePoint.cx1},${latticePoint.cy1})`, {
                            x: x,
                            y: y+height,
                            size: 8,
                            color: rgb(1, 0,0),
                        })
                        page.drawText(`B(${latticePoint.cx2}, ${latticePoint.cy2})`, {
                            x: x+width - 8 * 10,
                            y: y,
                            size: 8,
                            color: rgb(1,0,0),
                        })
                    }
                })
        }
        fs.writeFileSync(pdfOutPath,  await pdfDoc.save());
    }

    /**
     * 移除 PDF 最后一页
     */
    async removeLastPage(pdfBuffer) {
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      const totalPages = pdfDoc.getPageCount();
      if (totalPages > 1) {
        pdfDoc.removePage(totalPages - 1);
        return Buffer.from(await pdfDoc.save());
      }
      return pdfBuffer;
    }
}
module.exports = new PdfUtil();
// new PdfUtil().drawRectangle()
