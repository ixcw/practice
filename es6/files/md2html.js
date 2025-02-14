const marked = require('marked');
const katex = require('katex')

class Md2HtmlUtil {

    static frac2html(content) {
        if (content) {
            content = content.replace(new RegExp("(\\\\\\$)", 'g'), '<d>');
            let parsedContent = "";
            let blockLatex = ''
            let inlineLatex = ''
            let hasLatex = 0 //0,无公式，1内联公式2行间公式
            for (let i = 0; i < content.length; i++) {
                if (content[i] === '$') {
                    if (hasLatex == 0) {
                        if (content[i + 1] === '$') {
                            hasLatex = 2
                            i = i + 1
                        } else {
                            hasLatex = 1
                        }
                    } else if (hasLatex === 1) {
                        try {
                            parsedContent += katex.renderToString(inlineLatex, {
                                throwOnError: true,
                                displayMode: false
                            })

                        } catch (error) {
                            parsedContent += ("$" + inlineLatex + "$")
                        }

                        //doParseInline Latex
                        inlineLatex = ''
                        blockLatex = ''
                        hasLatex = 0
                    } else if (hasLatex = 2) {
                        if (content[i + 1] === '$') {
                            hasLatex = 0
                            try {
                                parsedContent += katex.renderToString(blockLatex, {
                                    throwOnError: true,
                                    displayMode: false
                                })

                            } catch (error) {
                                parsedContent += ("$$" + blockLatex + "$$")
                            }

                            //doParseBlock Latex
                            blockLatex = ''
                            inlineLatex = ''
                            i = i + 1
                        } else {
                            parsedContent += "$"
                            inlineLatex += blockLatex
                            hasLatex = 0
                            try {
                                parsedContent += katex.renderToString(inlineLatex, {
                                    throwOnError: true,
                                    displayMode: false
                                })
                            } catch (e) {
                                parsedContent += ('$' + inlineLatex + '$')
                            }

                            blockLatex = ''
                            inlineLatex = ''
                        }

                    }
                } else {
                    if (hasLatex === 1) {
                        inlineLatex += content[i]
                    } else if (hasLatex === 2) {
                        blockLatex += content[i]
                    } else {
                        parsedContent += content[i]
                    }
                }
            }
            parsedContent = parsedContent.replace(new RegExp("<d>", "g"), '$');
            return parsedContent
        }

        return undefined
    }

    static md2html(content) {
        if (content) {
            let parsedContent = Md2HtmlUtil.frac2html(content);
            let htmlStr = marked(parsedContent, { breaks: true });
            return htmlStr
        }
        return undefined
    }

    static processQuestions(questions, baseUrl) {
        if (!questions || questions.length == 0) {
            return [];
        }
        const getLength = function (str) {
            return str.replace(/[\u0391-\uFFE5]/g, "aa").length;   //先把中文替换成两个字节的英文，在计算长度
        };
        questions = questions.map(question => {
            question.content = Md2HtmlUtil.processContent(question.content, question.contentPng, baseUrl)
            question.dataContent = Md2HtmlUtil.processContent(question.dataContent, question.dataContentPng, baseUrl)
            question.answer = Md2HtmlUtil.processContent(question.answer, question.answerPng, baseUrl)
            question.answer = Md2HtmlUtil.cleanAnswerAndAnalysisFlag(question.answer)
            question.analysis = Md2HtmlUtil.processContent(question.analysis, question.analysisPng, baseUrl)
            question.analysis = Md2HtmlUtil.cleanAnswerAndAnalysisFlag(question.analysis)
            if (question.optionList) {
                let optionLength = 0;
                question.optionList.forEach(option => {
                    let optionContent = String(option.content).replace(new RegExp("(\\\\\\$)", 'g'), '');
                    optionLength = optionLength + getLength(optionContent);//计算统计所有选项的长度
                    option.content = Md2HtmlUtil.processContent(option.content, option.contentPng, baseUrl);
                })
                question.optionLength = optionLength;
            }
            if (question.questionData) {
                question.questionData.content = Md2HtmlUtil.processContent(question.questionData.content, question.contentPng, baseUrl)
                if (question.questionList && question.questionList.length > 0) {
                    Md2HtmlUtil.processQuestions(question.questionList);
                }
            }
            return question;
        })

        return questions
    }

    static processContent(content, contentPng, baseUrl) {
        content = Md2HtmlUtil.fixContent(content, contentPng, baseUrl);
        content = Md2HtmlUtil.frac2html(content);
        return content;
    }

    /**
     * 处理内容文本
     * @param content
     * @param contentPng
     * @param baseUrl
     * @returns {string|*}
     */
    static fixContent(content, contentPng, baseUrl) {
        content = content || "";
        if (contentPng) {
            content = content == 'null' ? '' : content;
        }
        content = content.replace(new RegExp("↵", "g"), "\n");
        content = content.replace(new RegExp("\\([ ]{0,4}\\)", "g"), "(　　)");
        content = content.replace(new RegExp("\\([　]{0,2}\\)", "g"), "(　　)");
        content = content.replace(new RegExp("（[ ]{0,4}）", "g"), "（　　）");
        content = content.replace(new RegExp("（[　]{0,2}）", "g"), "（　　）");
        //处理<br/>
        content = content.replace(new RegExp("&lt;br\\/&gt;", "g"), "&nbsp;&nbsp;&nbsp;&nbsp;");
        content = content.replace(new RegExp("<br/s>", "g"), "&nbsp;&nbsp;&nbsp;&nbsp;");
        //处理&Num&
        content = content.replace(new RegExp("&amp;Num&amp;", "g"), "__");
        content = content.replace(new RegExp("&Num&", "g"), "__");
        let contentPngList = [];
        if (contentPng) {
            contentPng.split(",").map((it) => {
                let size = "";
                if (it.indexOf("?") != -1) {
                    let itArr = it.split("?");
                    let width = itArr[1]
                    size = `width="${width}px"`;
                    it = itArr[0];
                }
                if (!it.startsWith("http")) {
                    it = baseUrl + it;
                }
                contentPngList.push(`<img src="${it}"  ${size}  >`)
            })
        }
        contentPngList = contentPngList.reverse();

        // 解析题干中有图片的情况
        if (content && content.includes('[myImgCur]') && Array.isArray(contentPngList) && contentPngList.length > 0) {
            let tmpContentList = content.split('[myImgCur]');
            let contentList = [];
            tmpContentList.forEach(it => {
                contentList.push(it)
                let img = contentPngList.pop();
                if (img) {
                    contentList.push(img)
                }
            })
            content = contentList.join('')
        }
        if (contentPngList && contentPngList.length > 0) {
            if (content && content.length > 0 && content !== "null") {
                content += (`<br/><div class="contentPngList-box">${contentPngList.join("")}</div><br/>`);
            } else {
                content += (contentPngList.join("") + "<br/>")
            }

        }
        if (content && content.includes('\n')) {//转义处理 去掉markdown的字体解析
            content = content.replace(new RegExp("\\n", "g"), "<br/>")
        }
        content = content.replace(new RegExp(/_{8,12}/, "g"), "\_\_\_\_\_\_\_\_\_\_\_\_\_\_");

        // 解析着重符号标记
        if (content && content.includes('[strong]')) {
            let contentList = content.split('[strong]');
            contentList = contentList.map((it, index) => {
                if (index % 2) {//解析多个字的情况
                    let itList = it.split('');
                    itList = itList.map((cIt, cIndex) => {
                        if (cIt == ' ') {
                            return '';
                        } else {
                            return (`<span class="bottom-tag-point">${cIt}</span>`);
                        }
                    })
                    return itList.join('');
                } else {
                    return it;
                }
                // return it + (contentList.length - 1 == index ? '' : (!(index % 2) ? "<span class='bottom-tag-point'>" : "</span>"))
            })
            content = contentList.join('')
        }

        //处理换行等
        //处理换行
        // if (content.indexOf("&lt;br/&gt;") != -1) {
        //     let contentArr = content.split("&lt;br/&gt;");
        //     contentArr = contentArr
        //         .map(it => it.replace(/(^\s+)|(\s+$)/g, ""))
        //         .filter(it => [",", ";", "。", "；", "，"].indexOf(it) != -1);
        //
        // }

        return content
    }

    static cleanAnswerAndAnalysisFlag(content) {
        if (content && content.indexOf("【解析】") != -1) {
            content = content.replace("【解析】", "");
        }
        if (content && content.indexOf("【答案】") != -1) {
            content = content.replace("【答案】", "");
        }
        return content;
    }


    /**
     * 对字符串进行URL编码
     * @param str
     * @returns {string}
     */
    static urlEncode(str) {
        str = (str + '').toString();

        return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
    }
    /**
    * 处理题号定位材料中的位置
    * @param materialContent :题目材料信息
    * @param numArray: 题目材料信息
    */
    static dealQuestionNum(materialContent = '', numArray = []) {
        let tempMaterialContent = materialContent;
        // let tempMaterialContent = "Dialogue 2<br/>Clerk:&Num&1______,sir?<br/>Harry: Yes, I'd like to open a savings account.<br/>Clerk:Certainly sir.We’ll have to fill out some forms.&Num&2______?<br/>Harry: It's Harry, John Harry.<br/>Clerk: How do you spell your last name Mr.Harry?<br/>Harry: It's H-A-R-R-Y.<br/>Clerk: And 29______?<br/>Harry: 2418 Grey Stone Road.<br/>Clerk: Is that in Chicago?<br/>Harry: Yes, that's right.<br/>Clerk: And your zip code?<br/>Harry: 60602.<br/>Clerk:30______, Mr. Harry?<br/>Harry: 364-9758.<br/>Clerk: 364-9758. And your job?<br/>Harry:31______.<br/>Clerk: I see. What's the name of your employer?<br/>Harry: I work for IBM.<br/>Clerk: Fine. Just a minute, please.<br/>";
        const replaceKeyword = '&Num&';
        // 当替换的题号为空或者材料中不包含特殊字符时 不处理
        if (!numArray || numArray.length < 1) {
            return tempMaterialContent;
        }
        numArray.map((item, key) => {
            let tempKey = key + 1;
            let numString = `${replaceKeyword}${tempKey}`;
            let titleNumber = String(tempKey);
            if (item && item.questionNum) {
                numString = `${replaceKeyword}${item.questionNum}`;
            }
            tempMaterialContent = tempMaterialContent.replace(numString, ` ${titleNumber}___`);
        })
        tempMaterialContent = tempMaterialContent.replace(new RegExp(/&Num&\d+/, "g"), "");
        return tempMaterialContent;
    }

    /**
   * 对题组进行处理
   * @param groupList
   * @param baseUrl
   * @returns {Array}
   */
    static dealQuestionGroupList(groupList, baseUrl) {
        let tempGroupList = groupList && groupList.map((groupItem) => {
            const rule = groupItem.rule;
            const isHaveStockOption = groupItem.categoryName && (groupItem.categoryName.includes('完型填空')
                || groupItem.categoryName.includes('阅读理解'));//有题材 但是小题是选择题
            const isHaveMoreAnswer = groupItem.categoryName && (groupItem.categoryName.includes('解答题')
                || groupItem.categoryName.includes('简答题')
                || groupItem.categoryName.includes('实验题')
                || groupItem.categoryName.includes('综合题')
                || groupItem.categoryName.includes('作图题')
                || groupItem.categoryName.includes('计算题')
                || groupItem.categoryName.includes('证明题')
            );//答案过多的情况 
            const objectiveHeight = 60;//客观题默认高度
            const subjectiveHeight = 200;//主观题默认高度
            groupItem.questionList = groupItem.questionList && groupItem.questionList.map((item) => {
                // 组装题目序号
                // item.content = item.sequenceCode + '、' + item.content;
                let materialQuestionList = item.materialQuestionList;
                //没有设置作答区域及打分区域的高度时 启用默认值 客观题60 主观题200
                item.height = item.height ? item.height : (rule == 1 ? objectiveHeight : isHaveMoreAnswer ? 2 * subjectiveHeight : subjectiveHeight);
                // 处理题目有材料列表的情况
                if (Array.isArray(materialQuestionList) && materialQuestionList.length) {
                    let numArray = [];
                    // 获取每一个小题在题组里面的编号
                    materialQuestionList = materialQuestionList.map((serialItem, questionNum) => {
                        numArray.push({ questionNum: questionNum + 1 })
                        //没有设置作答区域及打分区域的高度时 启用默认值 客观题60 主观题200
                        serialItem.height = serialItem.height ? serialItem.height : (rule == 1 || isHaveStockOption ? objectiveHeight : isHaveMoreAnswer ? 2 * subjectiveHeight : subjectiveHeight);
                        return serialItem;
                    })
                    // 处理题号定位材料中的位置
                    item.dataContent = Md2HtmlUtil.dealQuestionNum(item.dataContent, numArray);
                    item.materialQuestionList = Md2HtmlUtil.processQuestions(materialQuestionList, baseUrl);
                }
                return item;
            })
            groupItem.questionList = Md2HtmlUtil.processQuestions(groupItem.questionList, baseUrl)
            return groupItem;
        })
        return tempGroupList;
    }


}

module.exports = Md2HtmlUtil;
