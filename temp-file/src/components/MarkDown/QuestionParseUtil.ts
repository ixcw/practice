import Question from './Qustion';
import Option from './Option';
import { SUBJECT, categoryCode, categoryType } from '@/utils/const';
import { randomString } from "@/utils/utils";
import { message } from 'antd';
import DimenObj from "./DimenObj";
import crypto from 'crypto';
// @ts-ignore
export default class QuestionParseUtil {
  /**
   *
   * @type {string}
   */
  private static QUESTION_SPLITTER_REGEX: string = '((([0-2][0-2])([A-Z\\_]{2,5}){0,1})\\|(([A-Z])(#\\d{1,2}){0,5}))';

  /**
   * 题目分隔正则，匹配开头
   * @type {string}
   * Full match  0-13  `@00MA|S(eCC)@`
   Group 1.  1-7  `00MA|S`
   Group 2.  1-5  `00MA`
   Group 3.  1-3  `00`
   Group 4.  3-5  `MA`
   Group 5.  6-7  `S`
   Group 6.  6-7  `S`
   Group 8.  7-12  `(eCC)`
   Group 9.  8-11  `eCC`
   */
  private static QU_REGEX: string = '^\\s*@((([0-2][0-2])([A-Z\\_]{2,5}){0,1})\\|(([A-Z])(#\\d{1,2}){0,5}))(\\((e[A-Za-z\\d]{2,31})\\)){0,1}#{0,5}@';

  /**
   * 内联题正则1
   * @type {string}
   * Full match  19-40  `>@01PHY|S#1(eVVV)@___`
   Group 1.  21-36  `01PHY|S#1(eVVV)`
   Group 2.  21-30  `01PHY|S#1`
   Group 3.  21-26  `01PHY`
   Group 4.  21-23  `01`
   Group 5.  23-26  `PHY`
   Group 6.  27-30  `S#1`
   Group 7.  27-28  `S`
   Group 8.  28-30  `#1`
   Group 9.  30-36  `(eVVV)`
   Group 10.  31-35  `eVVV`
   Group 12.  37-40  `___`
   Group 14.  37-40  `___`
   */
  private static INLINE_REGEX1: string =
    '[^\\\\^-^_^<\\s]@((((0[0-2])([A-Z\\_]{2,5}))\\|(([A-Z])(#\\d{1,2}){1,5}))(\\((e[A-Za-z\\d]{2,31})\\)){0,1})@([(（【\\[][^<]\\d+[）)\\]】]){0,1}([^<^\\\\^_^—]*(<u>[^<^（^(]+<\\/u>)|([\\\\_]+))'

  /**
   * 内联题正则2
   * @type {string}
   *
   * Match 1
   * Full match  5-35  `<u>@01PHY|S#1(eVVV)@(18)  </u>`
   Group 1.  5-35  `<u>@01PHY|S#1(eVVV)@(18)  </u>`
   Group 2.  9-18  `01PHY|S#1`
   Group 3.  9-14  `01PHY`
   Group 4.  9-11  `01`
   Group 5.  11-14  `PHY`
   Group 6.  15-18  `S#1`
   Group 7.  15-16  `S`
   Group 8.  16-18  `#1`
   Group 9.  18-24  `(eVVV)`
   Group 10.  19-23  `eVVV`
   Group 11.  25-29  `(18)`
   Match 2
   Full match  36-63  `___@01PHY|S#1(eVVV)@(18)___`
   Group 12.  36-63  `___@01PHY|S#1(eVVV)@(18)___`
   Group 13.  40-49  `01PHY|S#1`
   Group 14.  40-45  `01PHY`
   Group 15.  40-42  `01`
   Group 16.  42-45  `PHY`
   Group 17.  46-49  `S#1`
   Group 18.  46-47  `S`
   Group 19.  47-49  `#1`
   Group 20.  49-55  `(eVVV)`
   Group 21.  50-54  `eVVV`
   Group 22.  56-60  `(18)`
   */
  private static INLINE_REGEX2: string =
    '(<u>[^<^\\\\^—]*@((((0[0-2])([A-Z\\_]{2,5}){0,1})\\|(([A-Z])(#\\d{1,2}){1,5}))(\\((e[A-Za-z\\d]{2,31})\\)){0,1})@([(（【\\[][^<]\\d+[）)\\]】]){0,1}[^<^\\\\^_^—]*[^<^（^(]*<\\/u>)|([\\\\_]+@((((0[0-2]){0,1}([A-Z\\_]{2,5}){0,1})\\|(([A-Z])(#\\d{1,2}){1,5}))(\\((e[A-Za-z\\d]{2,31})\\)){0,1})@([(（【\\[][^<]\\d+[）)\\]】]){0,1}[_\\\\]+)'
  /**
   * 题目题号正则
   * @type {string}
   */
  private static QUESTION_CODE_REGEX: string = '^\\s*([\\(（\\[【]{0,1}[\\dIVXivx]{1,5}[\\)）\\]】]{0,1}[\\.．、]{0,1})';
  private static QUESTION__CODE_REGEX_UNIQUE: string = '^\\s*([①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳⓪❶❷❸❹❺❻❼❽❾❿⓫⓬⓭⓮⓯⓰⓱⓲⓳⓴㊀㊁㊂㊃㊄㊅㊆㊇㊈㊉㈠㈡㈢㈣㈤㈥㈦㈧㈨㈩⑴⑵⑶⑷⑸⑹⑺⑻⑼⑽⑾⑿⒀⒁⒂⒃⒄⒅⒆⒇⒈⒉⒊⒋⒌⒍⒎⒏⒐⒑⒒⒓⒔⒕⒖⒗⒘⒙⒚⒛ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫⅰⅱⅲⅳⅴⅵⅶⅷⅸⅹⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ⒜⒝⒞⒟⒠⒡⒢⒣⒤⒥⒦⒧⒨⒩⒪⒫⒬⒭⒮⒯⒰⒱⒲⒳⒴⒵][\\.．、]{0,1})';

  /**
   * Match 1
   Full match  40-50  `@(eVVV)@A.`
   Group 1.  40-48  `@(eVVV)@`
   Group 2.  41-47  `(eVVV)`
   Group 3.  42-46  `eVVV`
   */
  private static OPTION_CODE_REGEX: string = '^(@(\\((e[A-Za-z\\d]{2,31})\\)){0,1}@){0,1}([A-Za-z][\\\\.．,，、])';

  public static SPLIT_FLAG: string = '@(\\d{2}[A-Z_]{2,5}\\|[A-Z]\\d{0,1}(#\\d+)*(\\((e[A-Za-z\\d]{2,18})\\)){0,1}@)|@(#\\d+)+(\\((e[A-Za-z\\d]{2,31})\\)){0,1}@'

  public static OPTION_ID_FLAG: string = '@\\(e[A-Z\\da-z]{2,18}\\)@'


  public static parseQuestion(content: String): Question {
    const lines = content.split('\n');
    let lastContent = '';
    let lastSplitter = '';
    let lastGroup = new Array();
    const question: Question = new Question();
    for (let i = 0; i < lines.length; i++) {
      const it = lines[i];
      const regex = new RegExp(this.QU_REGEX)
      const result = regex.test(it)
      if (result) {
        const groups = it.match(regex);
        if (groups && groups.length > 0) {
          if (lastGroup && lastSplitter.length > 0 && lastContent.length > 0) {
            this.assembleQuestion(question, lastGroup, lastContent);
            lastContent = it.replace(this.QU_REGEX, '');
            lastSplitter = groups[0];
            lastGroup = groups;
          } else {
            lastContent = it.replace(this.QU_REGEX, '');
            lastSplitter = groups[0];
            lastGroup = groups;
          }
        } else {
          lastContent += '\n' + it;
        }

      } else {
        lastContent += '\n' + it;
      }
      if (i === lines.length - 1) {
        this.assembleQuestion(question, lastGroup, lastContent);
      }
    }

    return question;
  };

  private static parseInlineQuestion(question: Question, content: string): void {
    const match1 = content.match(new RegExp(this.INLINE_REGEX1, 'gm'));
    const match2 = content.match(new RegExp(this.INLINE_REGEX2, 'gm'));
    const inlineQuestions: Array<string> = new Array<string>();
    if (match1 && match1.length > 0) {
      match1.map(it => {
        let m = it.match(new RegExp(this.INLINE_REGEX1));
        if (m && m.length > 0) {
          if (m[1]) {
            inlineQuestions.push(m[2]);
          }
        }

      });
    }

    if (match2 && match2.length > 0) {
      match2.map(it => {
        let m = it.match(new RegExp(this.INLINE_REGEX2));
        if (m && m[2]) {
          inlineQuestions.push(m[2]);
        } else if (m && m[15]) {
          inlineQuestions.push(m[15]);
        }
      });
    }
    inlineQuestions.sort((a, b) => parseInt(a[a.length - 1]) - parseInt(b[b.length - 1]));
    for (let i = 0; i < inlineQuestions.length; i++) {
      let inlineContent = inlineQuestions[i]
      if (inlineContent) {
        const groups = inlineQuestions[i].match(this.QUESTION_SPLITTER_REGEX) || new Array();
        if (groups.length > 0) {
          const structCode = this.getStructCode(inlineContent + '');
          content = content.replace(inlineContent + '', structCode + '');
          this.assembleInlineQuestion(question, groups, '');
        }
      }
    }
    question.content = content

  };

  private static getStructCode(inlineContent: string): String {
    let structCode = '';
    if (inlineContent.indexOf('#') != -1) {
      const start = inlineContent.indexOf('#');
      let end
      if (inlineContent.indexOf("(") != -1) {
        end = inlineContent.indexOf("(");
      } else {
        end = inlineContent.length;
      }
      structCode = inlineContent.substring(start, end);
    }
    return structCode;
  }


  public static findObjectByIdInArray(arr: Array<DimenObj>, targetId: number, compare = (a, b) => a === b) {
    if (!arr) return {};
    return arr.find(value => compare(value.id, targetId))
  }

  public static findObjectByCodeInArray(arr: Array<DimenObj>, targetCode: string, compare = (a, b) => a === b) {
    if (!arr) return new DimenObj;
    return arr.find(value => compare(value.code, targetCode))
  }


  private static assembleInlineQuestion(theQuestion: Question, splitterGroups: Array<Object>, content: string): void {
    if (!splitterGroups || splitterGroups && splitterGroups.length == 0) {
      return;
    }
    let group0: string = splitterGroups[0].toString();
    // @ts-ignore
    let questionFlag: string = null;//题目标志，两位，第一位表示为parentFlag
    if (splitterGroups[4]) {
      questionFlag = splitterGroups[4].toString()
    } else if (splitterGroups[15]) {
      questionFlag = splitterGroups[15].toString()
    }
    // @ts-ignore
    let subjectCode: string = null
    if (splitterGroups[5]) {
      subjectCode = splitterGroups[5].toString()
    } else if (splitterGroups[16]) {
      subjectCode = splitterGroups[16].toString()
    }
    let category: string
    if (splitterGroups[7]) {
      category = splitterGroups[7].toString()
    } else if (splitterGroups[18]) {
      category = splitterGroups[18].toString()
    }

    const layer = 1;
    const question: Question = this.searchQuestion(theQuestion, layer, false, true);

    let structCode
    if (splitterGroups[2]) {
      this.getStructCode(splitterGroups[2].toString());
    } else if (splitterGroups[13]) {
      this.getStructCode(splitterGroups[13].toString());
    }
    question.constructCode = structCode;
    content = content.replace(group0 + '', '');
    question.content = content;
    if (questionFlag) {
      question.parentFlag = parseInt(questionFlag[0], 10);
      question.childFlag = parseInt(questionFlag[1], 10);
    }

    // @ts-ignore
    const subject: DimenObj = this.findObjectByCodeInArray(SUBJECT, subjectCode)
    question.subjectId = subject.id;
    question.subjectName = subject.name;
    // @ts-ignore
    const questionCategory: DimenObj = this.findObjectByCodeInArray(categoryType, category)
    question.category = questionCategory.id;
    question.categoryName = questionCategory.name
    let group = content.match(this.QUESTION_CODE_REGEX);
    if (!group || group.length == 0) {
      group = content.match(this.QUESTION__CODE_REGEX_UNIQUE);
    }
    if (group && group.length > 0) {
      question.code = group[1];
      question.content = content.replace(group[1], '');
    }

    if (questionFlag && questionFlag[0] === '2') {
      this.parseInlineQuestion(question, question.content);
    }

  };

  private static assembleQuestion(theQuestion: Question, splitterGroups: Array<Object>, content: string): void {
    if (!splitterGroups || splitterGroups && splitterGroups.length == 0) {
      return;
    }
    let group0: string = splitterGroups[0].toString();
    let group1: string = splitterGroups[1].toString();
    const questionFlag: string = splitterGroups[3].toString(); //题目标志，两位，第一位表示为parentFlag
    const subjectCode: string = splitterGroups[4].toString();
    const category: string = splitterGroups[6].toString(); //题型

    let layer = group0.split('#').length - 1;
    if (layer < 0) layer = 0;
    const question = this.searchQuestion(theQuestion, layer, false, false);
    const structCode = this.getStructCode(group1);

    //如果有id,则取出id
    if (splitterGroups[9]) {
      question.id = splitterGroups[9].toString(); //题目 id
    }
    // @ts-ignore
    question.constructCode = structCode;
    content = content.replace(group0 + '', '');
    question.content = content;
    question.parentFlag = parseInt(questionFlag[0]);
    question.childFlag = parseInt(questionFlag[1]);
    // @ts-ignore
    const subject: DimenObj = this.findObjectByCodeInArray(SUBJECT, subjectCode)
    question.subjectId = subject.id;
    question.subjectName = subject.name;
    // @ts-ignore
    const questionCategory: DimenObj = this.findObjectByCodeInArray(categoryType, category)
    question.category = questionCategory.id;
    question.categoryName = questionCategory.name
    let group = content.match(this.QUESTION_CODE_REGEX);
    if (!group || group.length == 0) {
      group = content.match(this.QUESTION__CODE_REGEX_UNIQUE);
    }
    if (group && group.length > 0) {
      question.code = group[1];
      question.content = content.replace(group[1], '');
    }
    if (splitterGroups[3][0] === '2') {
      this.parseInlineQuestion(question, question.content);
    }

    // @ts-ignore
    if (questionCategory.id <= 3) {
      this.parseOptions(question);
    }

  };


  private static parseOptions(question: Question): void {
    let content = question.content;
    let questionContent = '';
    const options = new Array<Option>();
    const lines = content.split('\n');
    let lastCode = '';
    let lastOptionContent = '';
    let optionParseBegin = false;
    let lastId = ""
    for (let i = 0; i < lines.length; i++) {
      const regex = new RegExp(this.OPTION_CODE_REGEX);
      const result = regex.test(lines[i]);
      if (result && lines[i]) {
        const group = lines[i].match(regex);
        if (group && group.length > 0) {
          if (lastCode.length > 0) {
            let option = this.assembleOption(question.id, lastId, lastCode, lastOptionContent);
            options.push(option);
          }
          const match = group[0]
          lastCode = group[4];
          lastId = group[3]
          lastOptionContent = lines[i].replace(match, '');
          optionParseBegin = true;
        }
      } else {
        if (optionParseBegin) {
          lastOptionContent += `${lines[i]}\n`;
        } else {
          questionContent += `${lines[i]}\n`;
        }
      }

      if (i === lines.length - 1 && lastCode.length > 0) {
        let option = this.assembleOption(question.id, lastId, lastCode, lastOptionContent);
        options.push(option);
      }
    }
    questionContent = this.fixContent(questionContent)
    question.content = questionContent;
    question.options = options;
  }


  private static assembleOption(questionId: string, id: string, code: string, content: string): Option {
    let option: Option = new Option();
    if (id && id.trim().length > 0) {
      option.id = id
    }
    option.code = code;
    option.content = content;
    option.questionId = questionId;
    return option;
  }

  /**
   * 搜索目标
   */
  private static searchQuestion(question: Question, layer: number, createNew: boolean, isInline: boolean): Question {
    let index = 0;
    while (index <= layer) {
      question = this.doSearchQuestion(
        question,
        index,
        createNew || layer === index,
        isInline,
      );
      index++;
    }
    return question;
  };

  private static doSearchQuestion(question: Question, layer: number, createNew: boolean, isInline: boolean): Question {
    if (layer === 0) {
      if (question === null || question === undefined) {
        question = new Question();
      }
      return question;
    }
    if (createNew || isInline) {
      if (question.children == null && question.children == undefined) {
        question.children = [];
      }
      question.children.push(new Question());
    }
    return question.children[question.children.length - 1];
  };


  public static reverseParseQuestion(question: Question): string {
    const content = new Array<string>();
    this.assembleContent(content, question);
    return content.join("\n")
  }


  private static assembleContent(content: Array<string>, question) {
    if (!question || !(question.status === null || question.status === undefined || question.status !== -1)) {
      return
    }
    let cont = '';
    let splitterFlag = this.assembleSplitterFlag(question);
    if (question.childFlag != 2) {
      question.content = question.content ? question.content.toString().trim() : '';
      cont = (splitterFlag || '') + (question.code || '') + question.content + "\n"
    }
    if (content.length > 0 && content.length > 0 && question.childFlag == 2) {
      let needReplaceContent = content[content.length - 1];
      needReplaceContent = needReplaceContent.replace(`@${question.constructCode}@`, splitterFlag)
      content[content.length - 1] = needReplaceContent
    }

    if (question && question.childFlag != null && question.childFlag != undefined && question.childFlag != 2) {
      content.push(cont)
    }
    if (question.category <= 3 && question.options && question.options.length > 0) {
      question.options.map(it => {
        if (question.status != -1 && it.status != -1) {
          const code = this.assembleOptionFlag(it)
          cont = `${code}${it.content}`;
          content.push(cont);
          cont = ""
        }
      })
    }
    if (question && question.children && question.children.length > 0) {
      question.children.map(it => {
        this.assembleContent(content, it)
      })
    }
  }

  private static assembleOptionFlag(option: Option): string {
    let ret = ''
    if (option) {
      const idFlag = option.id && option.id.trim().length > 0 ? `@(${option.id})@` : ""
      ret = `${idFlag}${option.code || ""}`
    }
    return ret
  }

  private static assembleSplitterFlag(question: Question): string {
    let ret = '';
    if (question) {
      // @ts-ignore
      const subject: DimenObj = this.findObjectByIdInArray(SUBJECT, question.subjectId);
      // @ts-ignore
      const category: DimenObj = this.findObjectByIdInArray(categoryType, question.category);
      const subjectCode = subject && subject.code ? subject.code : '';
      const categoryCode = category && category.code ? category.code : '';
      const constructCode = question.constructCode && question.constructCode.indexOf("#") !== -1 ? question.constructCode : ""
      const idFlag = (question.id && question.id.length > 0) ? `(${question.id || ''})` : ""
      ret = `@${question.parentFlag + '' || ''}${question.childFlag + '' || ''}${subjectCode}|${categoryCode}${constructCode}${idFlag}@`;
    }
    return ret

  }


  // public static fixContent(content: string, contentPng=[]) {
  //   if (content) {
  //     content = content.replace(new RegExp("↵", "g"), "\n")
  //   }
  //   // 解析题干中有图片的情况
  //   if (content && content.includes('[myImgCur]') && Array.isArray(contentPng) && contentPng.length>0) {
  //     let contentList = content.split('[myImgCur]');
  //     contentList = contentList.map((it,index)=>{
  //       return it + (index > contentList.length - 2 ? contentPng[index]?('<br/>'+contentPng[index]):'':contentPng[index])
  //     })
  //     content = contentList.join('')
  //   }

  //   if (content && content.includes('__')) {//转义处理 去掉markdown的字体解析
  //     content = content.replace(new RegExp("_", "g"), "\\_")
  //   }
  //   return content
  // }

  public static fixContent(content: string, contentPng = []) {
    if (!content) {//判空处理
      return '';
    }
    content = content.replace(new RegExp("↵", "g"), "\n")
    content = content.replace(new RegExp(/^\s+/, "gi"), "");//去掉首部空格 渲染标签<br/>等
    // 解析题干中有图片的情况
    if (content && content.includes('[myImgCur]') && Array.isArray(contentPng) && contentPng.length > 0) {
      let contentList = content.split('[myImgCur]');
      if (contentPng.length > contentList.length) {
        contentList = contentPng.map((it, index) => {
          return (contentList[index] ? contentList[index] : '') + (index > contentList.length - 2 ? it ? ('<br/>' + it) : '' : it)
        })
      } else {
        contentList = contentList.map((it, index) => {
          return it + (index > contentList.length - 2 ? contentPng[index] || '' ? ('<br/>' + contentPng[index] || '') : '' : contentPng[index] || '')
        })
      }
      content = contentList.join('')
    }
    if (content && content.includes('\n')) {//转义处理 去掉markdown的字体解析
      //  content = content.replace(new RegExp("\\n", "g"), "<br/>")
      let newContent = content;
      if (content.includes('$')) {//匹配去掉公式之中的换行符
        let nweContenArray = content.split('$');
        newContent = '';
        nweContenArray.map((item, index) => {
          newContent += index % 2 ? `$${item.replace(new RegExp("\\n", "g"), "")}$` : item;
        })
      }
      content = newContent.replace(new RegExp("\\n", "g"), "<br/>")
    }
    if (content && content.includes('</br>')) {//替换处理 以免出现成对时报错
      content = content.replace(new RegExp("</br>", "g"), "<br/>")
    }
    // if (content && content.includes('__')) {//转义处理 去掉markdown的字体解析
    //   content = content.replace(new RegExp("_", "g"), "\\_\\_");
    // }
    content = content.replace(new RegExp(/_{2,12}/, "g"), "\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_");

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
              return ("<span class='bottom-tag-point'>" + cIt + "</span>");
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
    return content
  }

  /**
* 处理题号定位材料中的位置
* @param materialContent :题目材料信息
* @param numArray: 题目材料信息
*/
  public static dealQuestionNum(materialContent = '', numArray = []) {
    let tempMaterialContent = materialContent;
    // let tempMaterialContent = "Dialogue 2<br/>Clerk:&Num&1______,sir?<br/>Harry: Yes, I'd like to open a savings account.<br/>Clerk:Certainly sir.We’ll have to fill out some forms.&Num&2______?<br/>Harry: It's Harry, John Harry.<br/>Clerk: How do you spell your last name Mr.Harry?<br/>Harry: It's H-A-R-R-Y.<br/>Clerk: And 29______?<br/>Harry: 2418 Grey Stone Road.<br/>Clerk: Is that in Chicago?<br/>Harry: Yes, that's right.<br/>Clerk: And your zip code?<br/>Harry: 60602.<br/>Clerk:30______, Mr. Harry?<br/>Harry: 364-9758.<br/>Clerk: 364-9758. And your job?<br/>Harry:31______.<br/>Clerk: I see. What's the name of your employer?<br/>Harry: I work for IBM.<br/>Clerk: Fine. Just a minute, please.<br/>";
    const replaceKeyword = '&Num&';
    // 当替换的题号为空或者材料中不包含特殊字符时 不处理
    if (!numArray || numArray.length < 1 || !tempMaterialContent.includes(replaceKeyword)) {
      return tempMaterialContent;
    }
    numArray.map((item: Option, key) => {
      let tempKey = key + 1;
      let numString = `${replaceKeyword}${tempKey}`;
      let titleNumber = String(tempKey);
      if (item && item.questionNum) {
        numString = `${replaceKeyword}${item.questionNum}`;
        titleNumber = item.singleCode || titleNumber
      }
      tempMaterialContent = tempMaterialContent.replace(numString, `***&nbsp;${titleNumber}***`);
    })
    tempMaterialContent = tempMaterialContent.replace(new RegExp(/&Num&\d+/, "g"), "");
    return tempMaterialContent;
  }

  private static setValuesOfQuestion(originQuestion: Question, question: Question): Question {
    if (originQuestion.status === -1) return originQuestion
    originQuestion.content = question.content
    originQuestion.childFlag = question.childFlag
    originQuestion.parentFlag = question.parentFlag
    originQuestion.code = question.code
    originQuestion.category = question.category
    if (question.constructCode) {
      originQuestion.constructCode = question.constructCode
    }
    if (originQuestion.category) {
      const category = categoryType.find((value) => value.id === originQuestion.category)
      originQuestion.categoryName = category ? category.name : null
    }
    if (originQuestion.subjectId) {
      const category = SUBJECT.find((value) => value.id === originQuestion.subjectId)
      originQuestion.subjectName = category ? category.subjectName : null
    }

    //设置选项值
    this.checkOptionRepeatElement(question.options)
    this.removeEmptyIdOptionElement(originQuestion.options)
    if (!originQuestion.options || originQuestion.options.length == 0) {
      if (question.options) {
        originQuestion.options = question.options
        originQuestion.options.map(it => {
          delete it['id']
        })
      }
    } else {
      for (let option of originQuestion.options) {
        this.doSearchOptionAndSetValue(option, question.options)
      }
      if (question && question.status !== -1 && question.options && question.options.length > 0) {
        if (originQuestion.options === null) {
          originQuestion.options = new Array<Option>()
        }
        question.options.map(it => {
          originQuestion.options.push(it)
        })
      }
    }
    return originQuestion
  }


  //检查选项重复元素
  private static doSearchOptionAndSetValue(option: Option, options: Array<Option>) {
    if (option && option.id && options) {
      let index = options.findIndex(value => value.id === option.id)
      if ((index === 0 || index) && index !== -1 && options && options.length > 0) {
        let ret: Option = options[index]
        if (ret) {
          option.code = ret.code
          option.content = ret.content
          options.splice(index, 1)
        } else {
          option.status = -1
        }
      } else {
        option.status = -1
      }
    }

  }

  //检查题目重复元素
  public static checkQuestionRepeatElement(questions: Array<Question>) {
    if (questions && questions.length > 0) {
      let codeSet = new Set<string>()
      let codeArr = new Array<string>()
      let structSet = new Set<string>()
      let structArr = new Array<string>()
      let idSet = new Set<string>()
      let idArr = new Array<string>()
      questions.map((it) => {
        if (it.status !== -1) {
          this.checkOptionRepeatElement(it.options)
          if (it.id) {
            idSet.add(it.id)
            idArr.push(it.id)
          }
          if (it.code) {
            codeSet.add(it.code)
            codeArr.push(it.code)
          }
          if (it.constructCode) {
            structSet.add(it.constructCode)
            structArr.push(it.constructCode)
          }
        }
      })

      if (codeSet.size != codeArr.length) {
        this.errorTip('题目编号有重复！');
        return false
      }
      if (idSet.size != idArr.length) {
        this.errorTip('题目id有重复！');
        return false
      }
      if (structSet.size != structArr.length) {

        this.errorTip('题目小题分隔标识有重复！');
        return false
      }
    }

    return true

  }

  private static removeEmptyIdOptionElement(values: Array<Option>) {
    if (values && values.length > 0) {
      let index = values.findIndex(value => value.id === null || value.id === undefined)
      while (((index === 0 || index) && index != -1) && values && values.length > 0) {
        values.splice(index, 1)
        index = values.findIndex(value => value.id === null || value.id === undefined)
      }
    }
  }

  static compareAndCopyValue(orgQuestion: Question, question: Question) {
    if (orgQuestion && question && question.id !== orgQuestion.id) {
      this.errorTip("id发生变动!")
      return
    }
    const orgQuestions: Array<Question> = new Array()
    const questions: Array<Question> = new Array()
    this.flatQuestion(question, questions, 0)
    if (orgQuestion && orgQuestion.id && orgQuestion.status != -1) {
      this.flatQuestion(orgQuestion, orgQuestions, 0)
    }

    //检查重复元素
    this.checkQuestionRepeatElement(questions)
    if (orgQuestions.length === 0) {
      if (questions && questions.length > 0) {
        questions.map((it) => {
          orgQuestions.push(it)
        })

      }
      for (let q of orgQuestions) {
        if (q) {
          delete q['id']
          delete q['parentId']
          if (q.options) {
            for (let option of q.options) {
              delete option['id']
            }
          }
        }
      }
    } else {

      //删除id为空的数据
      let index = orgQuestions.findIndex(value => value.id === null && value.id === undefined)
      while (orgQuestions.length > 0 && orgQuestions && ((index == 0 || index) && index != -1)) {
        orgQuestions.splice(index, 1)
        index = orgQuestions.findIndex(value => value.id === null && value.id === undefined)
      }


      for (let i = 0; i < orgQuestions.length; i++) {
        let temQuestion = orgQuestions[i]
        if (questions && questions.length > 0) {
          let index = questions.findIndex(value => value.id === temQuestion.id)
          if (index == -1) {
            temQuestion.status = -1
          }
          if (temQuestion.status !== -1 && temQuestion.id) {
            this.searchAndDealQuestion(temQuestion, questions)
          }
        }

      }

      if (questions.length > 0) {
        questions.map(it => {
          orgQuestions.push(it)
        })
      }

    }

    let ret = orgQuestions.find((value, index, arr) => {
      return value['layer'] === 0 && value['status'] != -1
    })

    this.assembleFlattedQuestion(ret, orgQuestions)
    return ret
  }


  private static searchAndDealQuestion(question: Question, questions: Array<Question>): void {
    let index = -1
    let ret: Question
    if (questions && questions.length > 0 && question) {
      for (let i = 0; i < questions.length; i++) {
        if (questions[i] && questions[i].id === question.id) {
          index = i
          // @ts-ignore
          ret = questions[i]
          if (ret && ret.id) {
            questions.splice(index, 1)
            this.setValuesOfQuestion(question, ret)
          } else {
            this.doDeleteFlagQuestions(question.id, questions)
          }
        }

      }
    }
  }

  private static doDeleteFlagQuestions(id: string, values: Array<Question>) {
    if (values && values.length > 0) {
      values.map(it => {
        if (it.parentId === id && it.status != -1) {
          it.status = -1
          // @ts-ignore
          this.doDeleteFlagQuestions(it.id, values)
        }
      })
    }
  }


  public static flatQuestion(question: any, flattedArr: Array<Question>, layer: number) {
    let children: Array<Question> = question.children
    delete question["children"]
    if (!question.id) {
      question['k'] = question.id
    } else {
      question['k'] = randomString(6);
    }
    question['layer'] = layer
    flattedArr.push(question)
    if (children && children.length > 0) {
      children.map(it => {
        if (it) {
          it.parentId = question.id
          it['layer'] = layer + 1
          it['pk'] = question['k']
          this.flatQuestion(it, flattedArr, layer)
        }

      })
    }
  }

  private static assembleFlattedQuestion(question: any, flattedArr: Array<Question>) {
    if (!question) {
      // @ts-ignore
      question = flattedArr.find((value, index, arr) => {
        return value['layer'] === 0
      })
    }
    if (question && question.status != -1) {
      // @ts-ignore
      let key = question['k']
      let pk = question['pk']
      let layer = question['layer']
      delete question["k"]
      delete question["pk"]
      delete question["layer"]
      question.children = new Array<Question>()
      flattedArr.map(it => {
        if (it['pk'] == key && it['layer'] == layer) {
          question.children.push(it)
        }
      })
      if (question.children.length > 0) {
        question.children = question.children.sort((a, b) => {
          if (a.constructCode && b.constructCode) {
            a.constructCode.localeCompare(b.constructCode.toString())
          } else if (a.code && b.code) {
            return a.code.localeCompare(b.code.toString())
          } else if (!a) {
            return -1
          }
          return 1

        })
        question.children.map(it => {
          if (it.status != -1) {
            this.assembleFlattedQuestion(it, flattedArr)
          }
        })
      } else {
        delete question["children"]
      }


    }
  }

  private static checkOptionRepeatElement(options: Array<Option>) {
    if (options && options.length > 0) {
      let codeSet = new Set<string>()
      let codeArr = new Array<string>()
      let idSet = new Set<string>()
      let idArr = new Array<string>()
      options.map((it) => {
        if (it.status !== -1) {
          if (it.id) {
            idSet.add(it.id)
            idArr.push(it.id)
          }
          if (it.code) {
            codeSet.add(it.code)
            codeArr.push(it.code)
          } else {
            this.errorTip("有选项没有code!")
            return false
          }
        }
      })
      if (codeSet.size != codeArr.length) {
        this.errorTip("题目编号有重复!")
        return false
      }
      if (idSet.size != idArr.length) {
        this.errorTip("题目id有重复!")
        return false
      }
    }
    return true
  }

  private static errorTip(info: string) {
    message.error(info)
    // console.log(info)
  }

  /**
   * 获取Question对象的ID和结构hash
   * @param question
   */
  public static getQuestionHashOfStructAndId(question: Question) {
    if (!question) return null
    let obj = QuestionParseUtil.getStructsAndIds(null, question)
    let content = JSON.stringify(obj)
    let objHash = crypto.createHmac('sha256', 'md5').update(content).digest('hex');
    // console.log("=======>hash", objHash)
    return objHash
  }

  /**
   * 对比两个Question的结构，id是否一致
   * @param a
   * @param b
   */
  public static compareQuestionConstructAndId(a: Question, b: Question): boolean {
    let aHash = this.getQuestionHashOfStructAndId(a)
    let bHash = this.getQuestionHashOfStructAndId(b)
    return aHash === bHash
  }


  private static getStructsAndIds(obj: any, question: Question): any {
    if (!obj) {
      obj = {}
    }
    obj['id'] = question.id
    obj['flag'] = question.parentFlag + '' + question.children
    if (question.children && question.children.length > 0) {
      if (!obj['children']) {
        obj['children'] = []
      }
      question.children.map(it => {
        if (it.status !== -1) {
          let childObj = QuestionParseUtil.getStructsAndIds(null, it)
          obj['children'].push(childObj)
        }
      })

    }
    return obj
  }
}
