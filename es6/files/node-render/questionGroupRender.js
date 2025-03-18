const express = require('express');
const router = express.Router();
const path = require('path');
const stringRandom = require('string-random');
const crypto = require('crypto');
const ejs = require('ejs');
const date = require("silly-datetime");
const fs = require('fs');

const md2htmlUtils = require('../utils/md2html');
const renderService = require('../service/RenderService');
const puppeteerService = require('../service/PuppeteerService');
const calculateService = require('../service/CalculateService');
const Utils = require('../utils/utils');
const api = require('../utils/api');

const json = require("../groupTest")


const viewPath = path.join(__dirname, '../views')


function getQuestionCssAndJsList(paramsData) {
    Utils.loadCssFile(paramsData, "A4Print.css");
    Utils.loadCssFile(paramsData, "qGroup.css");
    Utils.loadCssFile(paramsData, "katex.min.css");
    Utils.loadJsFile(paramsData, "watermark.js");
    Utils.loadJsFile(paramsData, "polyfill.min.js");
    Utils.loadJsFile(paramsData, "lodash.min.js");
    Utils.loadJsFile(paramsData, "jquery.min.js");
    Utils.loadJsFile(paramsData, "bookjs/latest/bookjs-eazy.min.js");

}


router.get("/index", function (req, res, next) {
    let params = Utils.parsePdfQueryParams(req);
    console.log("hasWatermark:", params.hasWatermark)
    let content = JSON.stringify(json);
    let groupList = JSON.parse(content);
    let baseUrl = "http://res.test.gogoquestionbank.gg66.cn/";
    getQuestionCssAndJsList(params);
    groupList = md2htmlUtils.dealQuestionGroupList(groupList, baseUrl)
    params.groupList = groupList;
    params.title = '0915测试001'
    res.render('question-group-render-print', params);
})


/**
 * 渲染成html
 */
router.post("/questions2html", function (req, res, next) {
    let paramsData = Utils.parsePdfQueryParams(req);

    req.rawBody = ''
    req.on('data', function (chunk) {
        req.rawBody += chunk;
    });
    getQuestionCssAndJsList(paramsData);
    req.on('end', function () {
        let content = req.rawBody.toString();
        if (content) {
            let groupList = JSON.parse(content)
            groupList = md2htmlUtils.dealQuestionGroupList(groupList, paramsData.baseUrl)
            paramsData.groupList = groupList;
            let renderPaging = paramsData.renderPaging || 1;
            let template = renderPaging ? 'question-group-render-print' : 'question-render';
            res.render(template, paramsData);
        }
        res.end();
    });
});


/**
 * 渲染成 pdf 打印
 */
router.get("/questions2pdfOut", async function (req, res, next) {
  let paramsData = Utils.parsePdfQueryParams(req)
  console.log('打印渲染参数paramsData:', paramsData)
  let token = req.header("Authorization")
  const newAccessToken = req.query.newAccessToken
  let today = date.format(new Date(), 'YYYY-MM-DD')
  getQuestionCssAndJsList(paramsData);
  req.rawBody = ''
  req.on('data', function (chunk) {
    req.rawBody += chunk
  })
  req.on('end', async () => {
    let groupList = []
    let paperPreview = {}
    const paperId = req.query.paperId
    if (token && paperId) {
      groupList = await api.findQuetionInfoByPaperId(token, paperId).catch(next)
      paperPreview = await api.getInstructionPaperPreview(newAccessToken, paperId).catch(next)
    }
    // 本地数据测试（勿删）
    // const got = require('got')
    // const local = await got.get('http://localhost:6666/local').json()
    // groupList = local.groupList
    // paperPreview = local.paperPreview
    // 题组合并模板数据
    groupList = Utils.mergeQuestionAndTemplate(
      Utils.organizeCategoryQuestionList(groupList),
      paperPreview.questionInfoList
    )
    for (const item of groupList) {
      Utils.dealWithQuestionLatex(item.questionList)
    }
    groupList[0].stuName = paperPreview.stuName
    groupList[0].stuNameId = paperPreview.stuNameId
    groupList[0].stuClass = paperPreview.stuClass
    groupList[0].stuClassId = paperPreview.stuClassId
    groupList[0].stuNum = paperPreview.stuNum
    groupList[0].stuNumId = paperPreview.stuNumId
    groupList[0].font = paperPreview.font
    groupList[0].wordSize = paperPreview.wordSize
    groupList[0].composeType = paperPreview.composeType
    groupList[0].alignment = paperPreview.alignment
    groupList[0].sealLine = paperPreview.sealLine
    const checkSortItems = [
      {
        key: paperPreview.stuNameId,
        include: paperPreview.stuName,
        value: '姓名'
      },
      {
        key: paperPreview.stuClassId,
        include: paperPreview.stuClass,
        value: '班级'
      },
      {
        key: paperPreview.stuNumId,
        include: paperPreview.stuNum,
        value: '学号'
      }
    ]
    const checkListValue = checkSortItems
      .filter(item => item.include == 1)
      .sort((item1, item2) => item1.key - item2.key)
      .map(item => item.value)
    groupList[0].checkListValue = checkListValue
    // 开始处理题组数据
    let data = {status: 1, code: 601, msg: 'pdf generating', alert: ""}
    if (groupList && groupList.length > 0) {
      let fileKey = stringRandom(32)
      // 进一步处理题组中的文本材料
      const baseUrl = paramsData.baseUrl ? paramsData.baseUrl : 'https://ossquesback.gg66.cn/'
      groupList = md2htmlUtils.dealQuestionGroupList(groupList, baseUrl)
      groupList = Utils.handleDataContentWithCheerio(groupList)
      paramsData.groupList = groupList
      // 处理 pdf 文件名
      let fileName = paramsData.fileName || paramsData.title || ""
      fileName = fileName.replace(".pdf", today + "-" + stringRandom(16) + ".pdf")
      if (fileName.lastIndexOf(".pdf") == -1) {
        fileName = fileName + ".pdf"
      }
      // 调用 ejs 模板渲染题组为 html
      let renderPaging = paramsData.renderPaging || 1
      let template = renderPaging ? '/question-group-render-print.ejs' : '/question-render.ejs'
      const renderFilePath = path.join(viewPath, template)
      const html = await ejs.renderFile(renderFilePath, paramsData)
      // 调用 puppeteer 服务 渲染 html 为 pdf
      let renderOption = {pdfEnhance: true, timeout: 10000}
      // console.log('fileKey:', fileKey)
      // console.log('paramsData:', paramsData, paramsData.format)
      puppeteerService.html2Pdf(fileKey, html, {format: paramsData.format}, renderOption).then(ret => {
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Length': ret.pdf.length,
          'Content-Disposition': 'attachment;filename=' + encodeURIComponent(fileName)
        })
        res.send(ret.pdf)
      })
    } else {
      data.msg = "题目为空"
      data.alert = "题目为空"
      res.send(data)
    }
  })
})

/**
 * 渲染成 pdf 铺码
 */
router.post("/questions2pdfUrl", async function (req, res, next) {
  let paramsData = Utils.parsePdfQueryParams(req)
  console.log('paramsData: ', paramsData)
  // 旧 token
  const oldNodeToken = req.query.oldNodeToken
  // ** 铺码时，这个才是新 token **
  const token = decodeURIComponent(req.query.token).replace('+', ' ')
  let today = date.format(new Date(), 'YYYY-MM-DD')
  getQuestionCssAndJsList(paramsData)
  req.rawBody = ''
  req.on('data', function (chunk) {
    req.rawBody += chunk
  })
  req.on('end', async () => {
    let groupList = []
    let paperPreview = {}
    const paperId = req.query.paperId
    // ** 铺码和打印不同，题目信息是直接传送过来的 **
    let content = req.rawBody.toString()
    if (!(content && content.length > 0)) {
      groupList = JSON.parse(content)
    } else {
      // 无 content 则发请求获取
      if (oldNodeToken && paperId) {
        groupList = await api.findQuetionInfoByPaperId(oldNodeToken, paperId).catch(next)
      }
    }
    paperPreview = await api.getInstructionPaperPreview(token, paperId).catch(next)
    console.log('paperPreview: ', paperPreview)
    // 题组合并模板数据
    groupList = Utils.mergeQuestionAndTemplate(
      Utils.organizeCategoryQuestionList(groupList),
      paperPreview.questionInfoList
    )
    console.log('groupList: ', groupList)
    for (const item of groupList) {
      Utils.dealWithQuestionLatex(item.questionList)
    }
    groupList[0].stuName = paperPreview.stuName
    groupList[0].stuNameId = paperPreview.stuNameId
    groupList[0].stuClass = paperPreview.stuClass
    groupList[0].stuClassId = paperPreview.stuClassId
    groupList[0].stuNum = paperPreview.stuNum
    groupList[0].stuNumId = paperPreview.stuNumId
    groupList[0].font = paperPreview.font
    groupList[0].wordSize = paperPreview.wordSize
    groupList[0].composeType = paperPreview.composeType
    groupList[0].alignment = paperPreview.alignment
    groupList[0].sealLine = paperPreview.sealLine
    const checkSortItems = [
      {
        key: paperPreview.stuNameId,
        include: paperPreview.stuName,
        value: '姓名'
      },
      {
        key: paperPreview.stuClassId,
        include: paperPreview.stuClass,
        value: '班级'
      },
      {
        key: paperPreview.stuNumId,
        include: paperPreview.stuNum,
        value: '学号'
      }
    ]
    const checkListValue = checkSortItems
      .filter(item => item.include == 1)
      .sort((item1, item2) => item1.key - item2.key)
      .map(item => item.value)
    groupList[0].checkListValue = checkListValue
    let retData = {status: 1, code: 0, msg: 'pdf generating'}
    if (groupList && groupList.length > 0) {
      // 进一步处理题组中的文本材料
      const baseUrl = paramsData.baseUrl ? paramsData.baseUrl : 'https://ossquesback.gg66.cn/'
      groupList = md2htmlUtils.dealQuestionGroupList(groupList, baseUrl)
      groupList = Utils.handleDataContentWithCheerio(groupList)
      paramsData.groupList = groupList
      // 处理 pdf 文件名
      // let questionProcessedLength = groupList.length
      // let fileName = paramsData.fileName || paramsData.title
      // if (!fileName) {
      //   fileName = "勾勾教学-题目导出" + questionProcessedLength + "种题型的题目.pdf"
      // }
      // fileName = fileName.replace(".pdf", today + "-" + stringRandom(16) + ".pdf")
      // if (!fileName.includes(".pdf")) {
      //   fileName += ".pdf"
      // }
      let fileName = paramsData.fileName || paramsData.title || ""
      fileName = fileName.replace(".pdf", today + "-" + stringRandom(16) + ".pdf")
      if (fileName.lastIndexOf(".pdf") == -1) {
        fileName = fileName + ".pdf"
      }
      // 调用 ejs 模板渲染题组为 html
      let renderPaging = paramsData.renderPaging || 1
      let template = renderPaging ? '/question-group-render-print.ejs' : '/question-render.ejs'
      const renderFilePath = path.join(viewPath, template)
      const html = await ejs.renderFile(renderFilePath, paramsData)
      // console.log('铺码待渲染 html：', html)
      // 调用 puppeteer服务 渲染 html 为 pdf，与打印相比增加了计算功能和上传
      let renderOption = {
        pdfEnhance: true,
        timeout: 120000,
        calFunction: calculateService.calculatePaperQuestionAreaData // ** 计算功能 **
      }
      // 生成 pdf 上传
      let fileKey = stringRandom(32)
      let {url, data} = await renderService.html2pdfAndUpload2Cloud(fileName, fileKey, html, { format: undefined }, renderOption).catch(next)
      retData.data = {url, ...data}
      retData.msg = "pdf generated"
    } else {
      retData.data = null
      retData.code = 600
      retData.msg = "题目为空"
    }
    res.send(retData)
  })
})

module.exports = router
