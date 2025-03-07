const setting = require("../setting")
const fs = require('fs');
const path = require('path');



const cssPath = path.join(__dirname, '../public/css')
const jsFilePath = path.join(__dirname, '../public/js/')


class Utils {
    static getPageSize(format) {
        if (format && format.indexOf("IS0_")) {
            format = format.replace("IS0_", "");
        }
        let pageSize = Object.keys(setting.pageSize)
            .filter(it => it == format)
            .map(it => setting.pageSize[it])
            .pop();
        if (!pageSize) {
            pageSize = setting.pageSize.A4
        }
        return pageSize;

    }

    /**
     * 验证url是否合法
     * @param url
     * @returns {boolean}
     */
    static isUrlValid(url) {
        let regex = /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})*(:\d+)?(\/\w+\.{0,1}\w+)*\/?([\?&]\w+=[\w\:\/\.#]+)*$/
        return regex.test(url);
    }


    static parsePdfQueryParams(req) {
        let baseUrl = req.query.baseUrl
        let title = req.query.title
        let isCommon = eval(req.query.isCommon || false)
        // 1是试卷  2是答题卡 3答案解析 默认试卷
        let pdfType = req.query.pdfType || 1;
        // 1南方节点-1滕千里 2北方节点 - 2拓思德
        let latticeType = req.query.latticeType || 1;
        let hasAnswer = eval(req.query.hasAnswer || false)
        //是否加水印
        let hasWatermark = eval(req.query.hasWatermark || false)
        //是否显示页码
        let showPageNum = eval(req.query.showPageNum || false)
        //是否显示公司信息
        let showComInfo = eval(req.query.showComInfo || false)
        let fileName = req.query.fileName
        // 页面规格 A4/A3等
        let pageFormat = req.query.format
        let orientation = req.query.orientation || "portrait" //默认纵向
        if ("portrait" !== orientation && orientation !== "landscape") {
            orientation = "landscape"
        }
        let pageSize = Utils.getPageSize(pageFormat);
        pageSize.orientation = orientation;
        let questionRenderData = {
            baseUrl: baseUrl,
            questions: null,
            cssList: null,
            jsList: null,
            title: title,
            hasAnswer: hasAnswer,
            hasWatermark: hasWatermark,
            fileName: fileName,
            pageSize: pageSize,
            showPageNum: showPageNum,
            showComInfo: showComInfo,
            pdfType: pdfType,
            latticeType: latticeType,
            isCommon: isCommon,
        }
        // console.log("==>params", questionRenderData)
        return questionRenderData;
    }

    static parsePdfLinkCardParams(req) {
        let baseUrl = req.query.baseUrl
        let title = req.query.title
        let latticeType = req.query.latticeType
        //是否加水印
        let hasWatermark = eval(req.query.hasWatermark || false)
        //是否显示页码
        let showPageNum = eval(req.query.showPageNum || false)
        let fileName = req.query.fileName
        // 页面规格 A4/A3等
        let pageFormat = req.query.format
        let orientation = req.query.orientation || "portrait" //默认纵向
        if ("portrait" !== orientation && orientation !== "landscape") {
            orientation = "landscape"
        }
        let pageSize = Utils.getPageSize(pageFormat);
        pageSize.orientation = orientation;
        let renderData = {
            baseUrl: baseUrl,
            classData: null,
            cssList: null,
            jsList: null,
            title: title,
            hasWatermark: hasWatermark,
            fileName: fileName,
            pageSize: pageSize,
            showPageNum: showPageNum,
            latticeType: latticeType
        }
        return renderData;
    }


    static loadCssFile(paramsData, cssFile) {
        if (!paramsData) {
            return
        }
        if (!paramsData.cssList) {
            paramsData.cssList = [];
        }
        let filePath = cssPath + "/" + cssFile;
        if (fs.statSync(filePath) && fs.statSync(filePath).isFile()) {
            let cssContent = fs.readFileSync(filePath, 'utf-8').toString()
            paramsData.cssList.push(cssContent)
        }
    }

    static loadJsFile(paramsData, jsFile) {
        if (!paramsData) {
            return
        }
        if (!paramsData.jsList) {
            paramsData.jsList = [];
        }
        let filePath = jsFilePath + "/" + jsFile;
        if (fs.statSync(filePath) && fs.statSync(filePath).isFile()) {
            let cssContent = fs.readFileSync(filePath, 'utf-8').toString()
            paramsData.jsList.push(cssContent)
        }
    }

    /**
     * 计算元素尺寸
     * @param  elementHandler
     * @returns 元素坐标和宽高
     */
    static async calElementPos(elementHandler) {
      if (!elementHandler) {
        return null
      }
      const elementHandlerBox = await elementHandler.boundingBox()
      if (elementHandlerBox) {
        return { 
          x: (await elementHandlerBox).x,
          y: (await elementHandlerBox).y,
          w: (await elementHandlerBox).width,
          h: (await elementHandlerBox).height
        }
      } else {
        return null
      }
    }

    /**
     * 获取页数
     * @param {*} className 类名
     * @returns 
     */
    static async getPageNum(className) {
      if (!className) {
        return 0
      }
      let group = className.match(/nop-page-item-pagenum-(\d+)/)
      // 不能匹配默认返回 0
      if (!group) {
        return 0
      }
      return parseInt(group[1])
    }

  /**
   * 兼容latex
   * @param {*} arr 待处理数组
   */
  static dealWithQuestionLatex(arr) {
    if (Array.isArray(arr) && arr.length > 0) {
      arr.forEach(item => {
        if (item.content) {
          item.content = item.content.replace(/\$([\s\S]*?)\$/g, (match, content) => {
            const sanitizedContent = content.replace(/\\n/g, '\\n').replace(/\n/g, ' ')
            return `$${sanitizedContent}$`
          })
        }
        if (item.dataContent) {
          // item.dataContent = item.dataContent.replace(/\$/g, '')
        }
        // 递归处理
        if (Array.isArray(item.materialQuestionList) && item.materialQuestionList.length > 0) {
          this.dealWithQuestionLatex(item.materialQuestionList)
        }
      })
    }
  }

  /**
   * 合并题目模板数据
   * @param {*} questionList 待合并数组
   * @param {*} templateList 模板数组
   */
  static mergeQuestionAndTemplateList(questionList, templateList) {
    if (Array.isArray(questionList) && questionList.length > 0) {
      questionList = questionList.map(item => {
        // 筛选出 id 一致的题目信息合并
        let questionInfo = null
        if (Array.isArray(templateList)) {
          questionInfo = templateList.find(qInfoItem => qInfoItem.id == item.id)
        }
        if (questionInfo) {
          const clonedQuestionInfo = { ...questionInfo }
          delete clonedQuestionInfo.id
          // 字符串转数字
          for (const key in clonedQuestionInfo) {
            if (Object.prototype.hasOwnProperty.call(clonedQuestionInfo, key)) {
              if (typeof clonedQuestionInfo[key] === 'string') {
                clonedQuestionInfo[key] = Number(clonedQuestionInfo[key])
              }
            }
          }
          item = { ...item, ...clonedQuestionInfo }
        }
        if (Array.isArray(item.materialQuestionList) && item.materialQuestionList.length > 0) {
          item.materialQuestionList = Utils.mergeQuestionAndTemplateList(
            item.materialQuestionList,
            templateList
          )
        }
        if (Array.isArray(item.childrenList) && item.childrenList.length > 0) {
          item.childrenList = Utils.mergeQuestionAndTemplateList(
            item.childrenList,
            templateList
          )
        }
        return item
      })
    }
    return questionList
  }

  /**
   * 合并题目与模板数据
   * @param {*} questionList 题目列表
   * @param {*} templateList 模板数据
   * @returns {*} questionList 题目列表
   */
  static mergeQuestionAndTemplate(questionList, templateList) {
    questionList.map(qItem => {
      if (Array.isArray(qItem.questionList) && qItem.questionList.length > 0) {
        qItem.questionList = Utils.mergeQuestionAndTemplateList(qItem.questionList, templateList)
      }
      return qItem
    })
    return questionList
  }

  /**
   * 通过 parentId 组织题目列表
   * @param {*} questionList 题目列表
   */
  static organizeQuestionListByParentId = (questionList) => {
    const questionMap = new Map()
    const organizeMaterialQuestionList = (materialQuestionList) => {
      if (Array.isArray(materialQuestionList)) {
        Utils.organizeQuestionListByParentId(materialQuestionList)
        materialQuestionList.forEach(materialQuestion => {
          if (Array.isArray(materialQuestion.materialQuestionList)) {
            organizeMaterialQuestionList(materialQuestion.materialQuestionList)
          }
        })
      }
    }
    questionList.forEach(question => {
      questionMap.set(question.id, question)
      if (Array.isArray(question.materialQuestionList)) {
        const regex = /(\$\\underline{[^}]*}\$)/g
        question.dataContentList = question.dataContent.split(regex).map(part => {
          return part.startsWith('$\\underline{')
            ? `<span style="text-decoration:underline;font-size:14px;font-weight:700;">${part.slice(12, -2)}</span>`
            : part
        })
        organizeMaterialQuestionList(question.materialQuestionList)
      } else if (!question.parentId) {
        question.childrenList = []
      }
    })
    for (let i = questionList.length -1; i >= 0; i--) {
      if (questionList[i].parentId) {
        const parent = questionMap.get(questionList[i].parentId)
        if (parent) {
          const content = parent.content
          const lastIndex = content.lastIndexOf('<@>')
          if (lastIndex !== -1) {
            questionList[i].lastContent = content.slice(lastIndex + 3)
          }
          parent.content = content.replace(/<@>/g, '')
          parent.childrenList.unshift(questionList[i])
          questionList.splice(i, 1)
        }
      }
    }
  }
  
  /**
   * 组织分类题目列表
   * @param {*} categoryQuestionList 分类题目列表
   * @returns 分类题目列表
   */
  static organizeCategoryQuestionList = (categoryQuestionList) => {
    categoryQuestionList.forEach(categoryQuestion => {
      const questionList = categoryQuestion.questionList
      if (Array.isArray(questionList)) {
        Utils.organizeQuestionListByParentId(questionList)
      }
    })
    return categoryQuestionList
  }

  /**
   * dom parser 处理材料内容
   * @param {*} categoryQuestionList 分类题目列表
   * @returns 分类题目列表
   */
  static handleDataContentWithDomParser = (categoryQuestionList) => {
    function replaceContentWithSpan(questionList) {
      questionList.forEach(question => {
        if (Array.isArray(question.materialQuestionList)) {
          const regex = /(\$\\underline{[^}]*}\$)/g
          question.dataContentList = question.dataContent.split(regex).map(part => {
            return part.startsWith('$\\underline{')
              ? `<span style="text-decoration:underline;font-size:14px;font-weight:700;">${part.slice(12, -2)}</span>`
              : part
          })
          organizeMaterialQuestionList(question.materialQuestionList)
        } else if (!question.parentId) {
          question.childrenList = []
        }
      })
    }
    categoryQuestionList.forEach(categoryQuestion => {
      const questionList = categoryQuestion.questionList
      if (Array.isArray(questionList)) {
        replaceContentWithSpan(questionList)
      }
    })
    return categoryQuestionList
  }
}

module.exports = Utils;
