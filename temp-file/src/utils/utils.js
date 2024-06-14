/**
 * 通用方法集合
 * @author:张江
 * @date:2019年11月21日
 * @version:v1.0.0
 * */

import moment from 'moment';
import userInfoCache from '@/caches/userInfo';
import { myRegExp, scriptUrl, abnormalStateConfig } from "./const";
import queryString from 'query-string'
import { routerRedux } from 'dva/router'
import { notification, message, Modal } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
import rememberScrollTopCache from '@/caches/rememberScrollTop';//记录body滚动的距离
import QRCode from 'qrcode2';

export function randomString(e) {
  e = e || 32;
  var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
    a = t.length,
    n = "";
  for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n
}

/**
 * 创建自定义图标组件
 * @return {React.SFC<IconProps>}
 */
export function getIcon() {
  let IconFont = createFromIconfontCN({ //IconFont 可自己命名为其他的
    scriptUrl: scriptUrl,
  });
  return IconFont;
}


/**
 *根据传入的时间戳，获取对应的时间样式值
 * @param timestamp  ：时间戳
 * @param TimeStyle  :时间样式
 * @returns {string} ：返回样式值
 */
export function dealTimestamp(timestamp, TimeStyle) {
  let DateString;
  if (timestamp) {
    // 'YYYY-MM-DD HH:mm:ss'
    DateString = moment(timestamp).format(TimeStyle);
  } else {
    DateString = '暂无'
  }
  return DateString;
}

/**
 * 表格一些参数及时间处理
 * @param cols  ：列值
 */
export function stdColumns(cols) {
  return cols.map(col => {
    if (col.key === 'createTime' || col.key === 'completeTime' || col.key === 'updateTime') {
      col.render = v => v ? moment(v).format('YYYY-MM-DD HH:mm:ss') : '-';
      if (typeof col.width === 'undefined') {
        col.width = 60;
      }
    }

    if (col.key === 'payTime') {
      col.render = v => v ? moment(v).format('YYYY-MM-DD') : '-';
      if (typeof col.width === 'undefined') {
        col.width = 60;
      }
    }

    if (typeof col.dataIndex === 'undefined') {
      col.dataIndex = col.key;
    }

    if (typeof col.width === 'undefined') {
      col.width = 60;
    }

    return col;
  });
}


/**
 * 题目 切割图片链接 渲染出图片
 * @param imgUrls  ：图片链接
 * @returns {object} ：返回样式值
 */
export function dealQuestionRender(imgUrls, isDirect = false) {
  if (!imgUrls) {
    return null;
  }
  const userInfo = userInfoCache();
  const qiniuPath = userInfo && userInfo.qiniuPath ? userInfo.qiniuPath : 'https://resformalqb.gg66.cn/';
  let imgUrlsA = imgUrls.includes(',') ? imgUrls.split(',') : isDirect ? [imgUrls] : imgUrls;
  // 处理图片宽度 约定符号?   // 处理图片宽度 约定符号?  7a004ba838d04f14b685594a3d869ced.png?135
  const dealImgWidth = (imgUrl) => {
    let imgArray = imgUrl.includes('?') ? imgUrl.split('?') : imgUrl;
    let imgInfo = {
      imgUrl: imgArray,
      imgWidth: null,
    }
    if (Array.isArray(imgArray)) {
      imgInfo.imgUrl = existArr(imgArray) ? imgArray[0] : '';
      imgInfo.imgWidth = existArr(imgArray) && imgArray.length > 1 ? imgArray[1] + 'px' : null
    }
    return imgInfo;
  }

  if (isDirect && Array.isArray(imgUrlsA)) {
    // style='display: inline-block;padding:0px;max-width:auto;max-height: auto;'
    imgUrlsA = imgUrlsA.map((item, key) => {
      if (item == 'null' || !item) {
        return;
      }
      const imgInfo = dealImgWidth(item) || {};
      return (`<img key=${key} src=${qiniuPath + imgInfo.imgUrl} style='width:${imgInfo.imgWidth}' alt='图片'/>`
      )
    })
    return imgUrlsA;
  }
  if (Array.isArray(imgUrlsA)) {
    return (
      <div style={{ flexWrap: 'wrap', justifyContent: 'flex-start' }}>
        {
          imgUrlsA.map((item, key) => {
            if (item == 'null' || !item) {
              return;
            }
            const imgInfo = dealImgWidth(item) || {};
            return (
              <img
                style={{ margin: '0px 10px', width: imgInfo.imgWidth }}
                key={key}
                src={qiniuPath + imgInfo.imgUrl}
                alt='图片'
              />
            )
          })
        }
      </div>
    )
  } else {
    if (imgUrlsA == 'null' || !imgUrlsA) {
      return;
    }
    const imgInfo = dealImgWidth(imgUrlsA) || {};
    return (
      <img
        src={qiniuPath + imgInfo.imgUrl}
        style={{ display: 'block', width: imgInfo.imgWidth }}
        alt='图片'
      />
    )
  }
}

/**
 *根据传入的参数，获取对应的时间样式值
 * @param n  ：7上周的开始时间,1上周的结束时间,0本周的开始时间,-6本周的结束时间
 * @param TimeStyle  :时间样式
 * @returns {string} ：返回样式值
 */
export function getWeekBeginEnd(n, TimeStyle) {
  let now = new Date();
  var year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDay();
  //判断是否为周日,如果不是的话,就让今天的day-1(例如星期二就是2-1)
  if (day !== 0) {
    n = n + (day - 1);
  } else {
    n = n + day;
  }
  if (day) {
    //解决跨年的问题
    if (month > 1) {
      // month = month;
    }
    //解决跨年的问题,月份是从0开始的
    else {
      year = year - 1;
      month = 12;
    }
  }
  now.setDate(now.getDate() - n);
  let DateString = dealTimestamp(new Date(now).getTime(), TimeStyle)
  return DateString;
}


/**
 * 处理题目信息 拼接字符串修改 编辑 不包含图片
 * @param QContent  ：题目信息
 */
export function dealQuestionEdit(QContent) {
  let question = '';
  const questionMaterialData = QContent && QContent.questionData ? QContent.questionData : {};
  const materialContent = QContent && QContent.dataContent ? QContent.dataContent : questionMaterialData && questionMaterialData.content ? questionMaterialData.content : '';
  if (materialContent) {//材料编辑
    question += '【类型标记-题材]\n' + materialContent + '\n';
  }
  // if (QContent && QContent.content) {//题干编辑
  //   question += '【类型标记-题干]\n' + QContent.content;
  // }
  question += '【类型标记-题干]\n' + (QContent && QContent.content && QContent.content != 'null' ? QContent.content : '');
  if (QContent && QContent.optionList) {//选项修改编辑
    const categoryName = QContent.rule == 4 ? '\n【类型标记-小问]\n' : '\n【类型标记-选项]\n';
    if (Array.isArray(QContent.optionList)) {
      let allOptions = [];
      // eslint-disable-next-line
      QContent.optionList.map(it => {
        let str = it.code + ' ' + it.content;
        if (allOptions.indexOf(str) < 0) {
          allOptions.push(str)
        }
      });
      if (allOptions.length > 0) {//判断数组是否为空
        question += categoryName + allOptions.join(" ");
      }
    } else {
      question += categoryName + QContent.optionList;
    }
  }

  if (QContent && QContent.answer) {//答案修改编辑
    question += '\n【类型标记-答案]\n' + QContent.answer;
  }

  if (QContent && QContent.analysis) {//解析修改编辑
    question += '\n【类型标记-解析]\n' + QContent.analysis;
  }

  return question;
}

/**
 * 处理后台返回数据
 * @param array{object};(数组)
 * @returns {array}最终返回的数组
 */
export function dealFieldName(array) {
  let newArray = [];
  if (array && array.length > 0) {
    newArray = array.map((item, index) => {
      return { label: item.name, value: item.id }
    }
    )
  }
  return newArray
}

/**
 * 处理数据拼接 传入后台
 * @param v  ：数据 数组形式
 * @param field  ：字段
 * @returns {String}最终返回的字符串
 */
export function dealDataJoinByField(v, field) {
  let dataJoinArray = [];
  // eslint-disable-next-line
  v && v.map(it => {
    dataJoinArray.push(it[field]);
  });
  const dataJoinStr = dataJoinArray.join(',');
  return dataJoinStr;
};

/**
 * 修改树形数据结构的键名，
 * @param treeData：树形数据； 数据类型：array
 * @param childFieldName:指明下一级遍历的字段名称，默认为‘children’
 * @param keyNames：需要修改的键名，以及被修改的键名 ；
 *                  数据类型：对象数组
 *                           [
 *                            {oldKeyName:xxx,newKeyName:xxx},
 *                            {oldKeyName:xxx,newKeyName:xxx},
 *                            ...
 *                           ]
 * return:返回新的树形数据
 */
export function modifyKeyNamesOfTreeData(treeData, keyNames, childFieldName = 'children') {
  treeData = treeData ? treeData : []
  let newTreeData = [];
  //定义递归的方法
  let recursionTreeData = (treeData) => {
    let array = [];
    //1.递归遍历数据
    treeData && treeData.length > 0 && treeData.map(item => {
      let obj = {};
      //使用for-in 遍历数据，判断查找匹配的键名，然后对应修改内容
      for (let keyName in item) {
        //判断原型链上是否含有指定的属性，避免遍历不必要的，在Object原型上的数据被遍历到
        // if (!Object.hasOwnProperty.call(treeData, keyName)) continue;
        //循环遍历需要修改的键名，查找符合的键名，然后进行修改
        if (keyNames && keyNames.length > 0) {
          for (let i = 0; i < keyNames.length; i++) {
            /*判断keyName是否与传入的需要修改的keyName相同
              如果相同，则修改，如果不同，则不操作
             */
            if (keyName === keyNames[i].oldKeyName) {
              //将键名修改后，并且值依然保持不变
              if (keyNames[i].newKeyName) {
                obj[keyNames[i].newKeyName] = item[keyName];
              } else {
                console.warn("需要的keyNames[" + i + "].newKeyName不存在，请在传入的keyNames中指定新旧对应的字段名，格式为：[{oldKeyName:'val',newKeyNme:'val'}]");
              }
              //判断需要修改的字段是否恰好是往下遍历的字段，如果是，还需要继续往下遍历
              if (keyName === childFieldName) {
                obj.children = recursionTreeData(item[childFieldName]);
              }
              //找到符合的键名并且修改后，直接退出循环
              break
            } else if (keyName === childFieldName || keyName === 'children') {
              //判断当前的键是否是children，如果是，进行递归，并且添加到array中
              obj.children = recursionTreeData(item[childFieldName]);
            } else {
              //如果该字段名没有被修改过
              if (!obj[keyName]) {
                obj[keyName] = item[keyName];
              }
            }
          }
        }
      }
      array.push(obj);
    });
    return array;
  };
  if (treeData instanceof Array && keyNames instanceof Array) {
    newTreeData = recursionTreeData(treeData)
  } else {
    throw new Error("modifyKeyNamesOfTreeData()方法时，传入的数据类型与期望值不符！");
  }
  return newTreeData;
}

/**
 * 获取当前地址栏searc参数，并转换为js对象
 * @returns {null|{nodes, links}|any}
 */
export function getPageQuery() {
  return queryString.parse(window.location.href.split('?')[1]);
}


/*
 * 根据传入的对象，将对象中的参数，放到地址栏中
 * @param dispatch ：类型:方法：路由组件的dispatch方法
 * @param location  ：类型：对象; 路由组件的location对象
 * @param dataParam ：参数对象
 * @param type ：改变模式1:改变或者添加,2:清空再添加
 */
export function replaceSearch(dispatch, location, dataParam, type = 1) {
  const { search, pathname } = location || {};
  let query = type === 1 ? queryString.parse(search) : {};
  query = { ...query, ...dataParam };
  //如果传入的参数是对象，则对对象解析，如果是单个字符串
  if (typeof dataParam === "object") {
    dispatch && dispatch(routerRedux.replace({
      pathname,
      search: queryString.stringify(query),
    }))
  } else {
    let error = new ErrorEvent("传入参数类型有误！");
    throw error;
  }
}

/**
 *当query变化时，判断两次query是否所需参数中，是否有参数发生变化
 * @param lastQuery:变化之前的query
 * @param currentQuery：当前query
 * @param paramsArray：判断参数数组
 * @param requiredParams:必须要传入的参数
 * @returns {boolean}：是否其中一个参数发生变化
 */
export function queryParamIsChange(lastQuery = {}, currentQuery = {}, paramsArray, requiredParams) {
  let queryItemIsChange = false;
  let requireParamIsComplete = true;//必须参数是否齐全(默认不判断必要参数)
  paramsArray && paramsArray.map(queryItem => {
    queryItemIsChange = queryItemIsChange || (lastQuery[queryItem] !== currentQuery[queryItem]);
  });
  requiredParams && requiredParams.map(requiredParamItem => {
    //注意：一定要||上参数为0的情况，因为0和空字符串会隐式类型转换为false，如果不做这歩操作，当参数为0时，条件会变为false
    requireParamIsComplete = requireParamIsComplete && (currentQuery[requiredParamItem] || currentQuery[requiredParamItem] == 0 || currentQuery[requiredParamItem] == "");
  });
  return requireParamIsComplete && queryItemIsChange;
}


/**
 * 打开一个全局通知框
 * @param type ：通知框类型
 * @param msg ：通知标题
 * @param titleColor ：通知标题文字颜色字符串
 * @param describtion ：通知内容
 * @param duration ：通知框显示时长
 * @param icon:图标
 */
export function openNotificationWithIcon(type, msg, titleColor, describtion, duration, icon) {
  notification[type]({
    message: <span style={{ fontSize: 16, color: titleColor }}>{msg}</span>,
    description: describtion,
    duration,
    icon
  });
}

/**
 * 将20以内的数据转换为中文
 * @param num
 * @return {undefined}
 */
export function uppercaseNum(num) {
  let uppercaseArr = ['零', '一', '二', "三", "四", "五", '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十'];
  let uppercasedNum = num;
  num = parseInt(num, 10);
  if (num >= 0 && num <= 20) {
    uppercasedNum = uppercaseArr[num];
  } else {
    console.error(`传入的数字（${num}）不是（0-20）的数字类型！`);
    // throw new Error(`传入的数字（${num}）不是（0-20）的数字类型！`);
  }
  return uppercasedNum;
}

/**
 *根据传入的dom对象以及样式名，获取该元素当前生效的样式值
 * @param obj  ：dom对象
 * @param styleStr：样式名字符串
 * @returns {*} ：返回样式值
 */
export function getStyle(obj, styleStr) {
  let style;
  if (window.currentStyle) {
    style = window.currentStyle(obj, null);
  } else {
    style = window.getComputedStyle(obj, null)
  }
  return style[styleStr];
}

/**
 * 将 xxx.  格式的分数，自动末尾自动添加0  例如： 5. ===>5.0
 * @param score
 */
export function calibrationScore(score) {
  score += ''
  if (myRegExp.pointEnding.test(score)) {
    score += "0"
  }
  return score
}

/**
 * 保留制定位数的小数,(默认保留2位)
 * @param numStr:原数据
 * @param length：保留位数
 */
export function save2NumAfterPoint(numStr, length = 2) {
  if (numStr && Number(numStr) && String(numStr).includes('.')) {//  数字且不为零 并且有小数时保留一位
    let numberTo = Number(numStr).toFixed(length);
    return numberTo
  } else {
    return numStr;
  }
}

/**
 * 取出两个数组的相同元素
 * @param arr1:数组1
 * @param arr2：数组2
 */
export function getArrayEqual(arr1, arr2) {
  let newArr = [];
  for (let i = 0; i < arr2.length; i++) {
    for (let j = 0; j < arr1.length; j++) {
      if (arr1[j] === arr2[i]) {
        newArr.push(arr1[j]);
      }
    }
  }
  return newArr;
}

/**
 * 处理数据 如果有小数点 则根据位数保留位 否则返回原数
 * @param number :数值
 * @param digit :位数 金融数字 默认保留两位
 * @param unit :单位
 * @return {string}
 */
export function processDataRetainDigit(number, digit = 2, unit) {
  Number.prototype.toFixed = function (s) {//覆写toFixed方法,解决不能得到正确的四舍五入的结果的问题
    // @ts-ignore
    return (parseInt(this * Math.pow(10, s) + 0.5) / Math.pow(10, s)).toString();
  }
  if (number && Number(number) && String(number).includes('.')) {//  数字且不为零 并且有小数时保留一位
    let numberTo = Number(number).toFixed(digit);
    return unit ? numberTo + unit : numberTo
  } else {
    number = (number || number == 0) ? (unit ? number + '.00' + unit : number + '.00') : '-';//如果有值 则判断是否有单位
    return number;
  }
}

/**
 * 获取系统浏览器及版本
 * @param isGlobal：是否全局调用
 * @returns {object} ：返回值 浏览器类型 版本号及是否支持回放
 */
export function getBrowserVersion(isGlobal) {
  const openNotificationWithIcon = (type) => {
    notification[type]({
      message: '版本不支持',
      description: '当前浏览器版本不支持回放,如需使用回放功能,请先更新浏览器到最新版本。',
      duration: 10,
    });
  };
  let Sys = {};
  let ua = navigator.userAgent.toLowerCase();
  let re = /(edge|msie|firefox|chrome|opera|safari).*?([\d.]+)/;
  let BrowserInfo = ua.match(re);
  Sys.browser = BrowserInfo ? BrowserInfo[1] : '';//浏览器类型
  Sys.version = BrowserInfo ? BrowserInfo[2] : '';//浏览器版本号
  Sys.supported = true;//是否支持
  // console.log('浏览器主要版本号',Sys.version.split('.')[0])
  //chrome内核的浏览器 360 新版opera 谷歌浏览器等
  if (Sys.browser === 'chrome' && Sys.version.split('.')[0] < 57) {//获取主要版本号对比 谷歌内核版本57(不包括57)以下的均不支持回放
    openNotificationWithIcon('warning');
    Sys.supported = false;
  }
  return Sys;
}


/**
 * 将数字转换成大写
 * @param {number} money 需转换的数字
 * @returns {string}
 */
export function digitUppercase(money) {
  const cnNums = new Array(["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"]); //汉字的数字
  const cnIntRadice = new Array(["", "拾", "佰", "仟"]); //基本单位
  const cnIntUnits = new Array(["", "万", "亿", "兆"]); //对应整数部分扩展单位
  const cnDecUnits = new Array(["角", "分", "毫", "厘"]); //对应小数部分单位
  const cnInteger = ""; //整数金额时后面跟的字符
  const cnIntLast = ""; //整型完以后的单位
  const maxNum = 999999999999999.9999; //最大处理的数字
  let IntegerNum; //金额整数部分
  let DecimalNum; //金额小数部分
  let ChineseStr = ""; //输出的中文金额字符串
  let parts; //分离金额后用的数组，预定义
  let Symbol = "";//正负值标记
  if (money == "") {
    return "";
  }

  money = parseFloat(money);
  if (money >= maxNum) {
    // ToastWarn('超出最大处理数字');
    return "";
  }
  if (money == 0) {
    ChineseStr = cnNums[0] + cnIntLast + cnInteger;
    return ChineseStr;
  }
  if (money < 0) {
    money = -money;
    Symbol = "负 ";
  }
  money = money.toString(); //转换为字符串
  if (money.indexOf(".") == -1) {
    IntegerNum = money;
    DecimalNum = '';
  } else {
    parts = money.split(".");
    IntegerNum = parts[0];
    DecimalNum = parts[1].substr(0, 4);
  }
  if (parseInt(IntegerNum, 10) > 0) { //获取整型部分转换
    let zeroCount = 0;
    let IntLen = IntegerNum.length;
    for (let i = 0; i < IntLen; i++) {
      let n = IntegerNum.substr(i, 1);
      let p = IntLen - i - 1;
      let q = p / 4;
      let m = p % 4;
      if (n == "0") {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          ChineseStr += cnNums[0];
        }
        zeroCount = 0; //归零
        ChineseStr += cnNums[parseInt(n, 10)] + cnIntRadice[m];
      }
      if (m == 0 && zeroCount < 4) {
        ChineseStr += cnIntUnits[q];
      }
    }
    ChineseStr += cnIntLast;
    //整型部分处理完毕
  }
  if (DecimalNum != '') { //小数部分
    let decLen = DecimalNum.length;
    for (let i = 0; i < decLen; i++) {
      let n = DecimalNum.substr(i, 1);
      if (n != '0') {
        ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
  }
  if (ChineseStr == '') {
    ChineseStr += cnNums[0] + cnIntLast + cnInteger;
  } else if (DecimalNum == '') {
    ChineseStr += cnInteger;
  }
  ChineseStr = Symbol + ChineseStr;

  return ChineseStr;
}


/**
 * 对象的判空，空对象返回null,否则返回对象本身
 * @param obj
 */
export const objectIsNull = (obj) => {
  return Object.keys(obj).length ? obj : null
};


/**
 * 根据传入的标记，生成标记加随机字符串以及时间戳 qiniu上传生成返回的key 标记唯一文件
 * 根据位数产生指定长度随机字母数字组合
 * 根据maxDigits~digits产生任意区间长度随机字母数字组合
 * @param tagString  ：标记的字符串
 * @param timeTag  ：是否添加时间戳标记 默认false
 * @param digits  ：待返回的位数/范围时最小位数
 * @param maxDigits  ：范围时最大位数
 * @call : createRandomString(TagString,true,32) createRandomString('',false,32) createRandomString(TagString,false,1,4)
 * @returns {string} ：返回值
 */
export function createRandomString(tagString, timeTag = false, digits = 0, maxDigits = 0) {
  let resource_key = tagString ? tagString : '';//待返回的字符串
  const RandomString = (min, max) => {
    let range = min
    let RandomArr = [
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ];//随机字母数字组合数组
    // 随机产生区间任意长度
    if (max && Number(max) > 0 && max > min) {
      range = Math.round(Math.random() * (max - min)) + min;//随机获取位数
    }
    for (let i = 0; i < range; i++) {
      let pos = Math.round(Math.random() * (RandomArr.length - 1));//随机获取一个字符
      resource_key += RandomArr[pos];//进行拼接
    }
  };
  if (!timeTag && digits && Number(digits) > 0) {
    RandomString(digits, maxDigits)
  } else {
    let getTime = new Date().getTime();//获取当前时间戳
    resource_key += getTime;// qiniu 资源名，必须是 UTF-8 编码 避免重复
    RandomString(digits - resource_key.length);//拼接32位
  }
  return resource_key;
}


/**
 * 制作水印的方法
 * @param {number} settings 设置的参数
 * @param {boolean} isClear 是否清除
 */
export function watermark(settings, isClear = false) {
  //默认设置
  var defaultSettings = {
    watermark_txt: window.$systemTitleName,
    watermark_x: 20, //水印起始位置x轴坐标
    watermark_y: 20, //水印起始位置Y轴坐标
    watermark_rows: 20, //水印行数
    watermark_cols: 20, //水印列数
    watermark_x_space: 100, //水印x轴间隔
    watermark_y_space: 50, //水印y轴间隔
    watermark_color: '#ccc', //水印字体颜色
    watermark_alpha: 0.4, //水印透明度
    watermark_fontsize: '15px', //水印字体大小
    watermark_font: '微软雅黑', //水印字体
    watermark_width: 130, //水印宽度
    watermark_height: 80, //水印长度
    watermark_angle: 20 //水印倾斜度数
  };
  if (arguments.length === 1 && typeof arguments[0] === "object") {
    var src = arguments[0] || {};
    for (let key in src) {
      if (src[key] && defaultSettings[key] && src[key] === defaultSettings[key]) continue;
      else if (src[key]) defaultSettings[key] = src[key];
    }
  }
  var oTemp = document.createDocumentFragment();
  //获取页面最大宽度
  var page_width = Math.max(document.body.scrollWidth, document.body.clientWidth);
  var cutWidth = page_width * 0.0150;
  page_width = page_width - cutWidth;
  //获取页面最大高度
  var page_height = Math.max(document.body.scrollHeight, document.body.clientHeight);
  page_height = Math.max(page_height, window.innerHeight - 30);
  //如果将水印列数设置为0，或水印列数设置过大，超过页面最大宽度，则重新计算水印列数和水印x轴间隔
  if (defaultSettings.watermark_cols == 0 || (parseInt(defaultSettings.watermark_x + defaultSettings.watermark_width * defaultSettings.watermark_cols + defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1), 10) > page_width)) {
    defaultSettings.watermark_cols = parseInt((page_width - defaultSettings.watermark_x + defaultSettings.watermark_x_space) / (defaultSettings.watermark_width + defaultSettings.watermark_x_space), 10);
    defaultSettings.watermark_x_space = parseInt((page_width - defaultSettings.watermark_x - defaultSettings.watermark_width * defaultSettings.watermark_cols) / (defaultSettings.watermark_cols - 1), 10);
  }
  //如果将水印行数设置为0，或水印行数设置过大，超过页面最大长度，则重新计算水印行数和水印y轴间隔
  if (defaultSettings.watermark_rows == 0 || (parseInt(defaultSettings.watermark_y + defaultSettings.watermark_height * defaultSettings.watermark_rows + defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1), 10) > page_height)) {
    defaultSettings.watermark_rows = parseInt((defaultSettings.watermark_y_space + page_height - defaultSettings.watermark_y) / (defaultSettings.watermark_height + defaultSettings.watermark_y_space), 10);
    defaultSettings.watermark_y_space = parseInt(((page_height - defaultSettings.watermark_y) - defaultSettings.watermark_height * defaultSettings.watermark_rows) / (defaultSettings.watermark_rows - 1), 10);
  }
  var x;
  var y;
  for (var i = 0; i < defaultSettings.watermark_rows; i++) {
    y = defaultSettings.watermark_y + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i;
    for (var j = 0; j < defaultSettings.watermark_cols; j++) {
      x = defaultSettings.watermark_x + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j;
      var mask_div = document.createElement('div');
      mask_div.id = 'mask_div' + i + j;

      let mask_divId = document.getElementById(mask_div.id);
      if (mask_divId) {//如果已存在 则移除
        mask_divId.parentNode.removeChild(mask_divId);
      }
      if (!isClear) {//执行清除时 不执行
        mask_div.className = 'mask_div';
        mask_div.appendChild(document.createTextNode(defaultSettings.watermark_txt));
        //设置水印div倾斜显示
        mask_div.style.webkitTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
        mask_div.style.MozTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
        mask_div.style.msTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
        mask_div.style.OTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
        mask_div.style.transform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
        mask_div.style.visibility = "";
        mask_div.style.position = "absolute";
        mask_div.style.left = x + 'px';
        mask_div.style.top = y + 'px';
        mask_div.style.overflow = "hidden";
        mask_div.style.zIndex = "9999";
        //让水印不遮挡页面的点击事件
        mask_div.style.pointerEvents = 'none';
        mask_div.style.opacity = defaultSettings.watermark_alpha;
        mask_div.style.fontSize = defaultSettings.watermark_fontsize;
        mask_div.style.fontFamily = defaultSettings.watermark_font;
        mask_div.style.color = defaultSettings.watermark_color;
        mask_div.style.textAlign = "center";
        mask_div.style.width = defaultSettings.watermark_width + 'px';
        mask_div.style.height = defaultSettings.watermark_height + 'px';
        mask_div.style.display = "block";
        oTemp.appendChild(mask_div);
      }
    }
    ;
  }
  ;
  if (!isClear) {
    document.getElementById('watermark').appendChild(oTemp);
  }
}

/**
 * 获取当前年份
 */
export function doHandleYear() {
  let myDate = new Date();
  let tYear = myDate.getFullYear();
  return tYear;
}

/**
 * 复制到剪贴板
 * @param text
 */
export const copyText = (text) => {
  // 数字没有 .length 不能执行selectText 需要转化成字符串
  const textString = text.toString();
  let input = document.querySelector('#copy-input');
  if (!input) {
    input = document.createElement('input');
    input.id = "copy-input";
    input.readOnly = "readOnly";        // 防止ios聚焦触发键盘事件
    input.style.position = "fixed";
    input.style.left = "-1000px";
    input.style.zIndex = "-1000";
    document.body.appendChild(input)
  }

  input.value = textString;
  // ios必须先选中文字且不支持 input.select();
  selectText(input, 0, textString.length);
  if (document.execCommand('copy')) {
    document.execCommand('copy');
    message.success('复制成功！')
  }
  input.blur();

  // input自带的select()方法在苹果端无法进行选择，所以需要自己去写一个类似的方法
  // 选择文本。createTextRange(setSelectionRange)是input方法
  function selectText(textbox, startIndex, stopIndex) {
    textbox.setSelectionRange(startIndex, stopIndex);
    textbox.focus();
  }
};

/**
 * 判断参数类型
 * @param tgt undefined、null、string、number、boolean、array、object、symbol、date、regexp、function、asyncfunction、arguments、set、map、weakset、weakmap
 * @param type
 * DataType("young"); // "string"
 * DataType(20190214); // "number"
 * DataType(true); // "boolean"
 * DataType([], "array"); // true
 * DataType({}, "array"); // false
 * @returns {*} true || false
 */
export function dataType(tgt, type) {
  const dataType = Object.prototype.toString.call(tgt).replace(/\[object (\w+)\]/, "$1").toLowerCase();
  return type ? dataType === type : dataType;
}

/**
 * 判断数组是否存在
 * @param arr
 * @returns {boolean} true不为空数组false为空数组
 */
export const existArr = (arr) => {
  return Array.isArray(arr) && arr.length ? arr : false;
}

/**
 * 判断对象是否存在
 * @param obj
 */
export const existObj = (obj) => {
  return dataType(obj, "object") && Object.keys(obj).length ? obj : false;
}
/**
 * 扁平化数组
 * @param arr
 * @returns {*[]} deepFlatten([1, [2], [[3], 4], 5]); // [1,2,3,4,5]
 */
export const deepFlatten = arr => [].concat(...arr.map(v => (Array.isArray(v) ? deepFlatten(v) : v)));


/**
 * 取交集
 * @param a
 * @param b
 * @param fn
 * @returns {*}
 */
export const intersection = (a, b) => {
  const s = new Set(b);
  return a.filter(x => s.has(x));
};

/**
 * 判断对象是否为空
 * @param seconds :秒数
 * @param formatStyle :转换格式 {
     h:'时',
     m:'分',
     s:'秒'
}
 */
export const formatSecondsToHMS = (
  seconds = 0,
  formatStyle = {
    h: '时',
    m: '分',
    s: '秒'
  }
) => {
  let result = parseInt(seconds, 10)
  let h = Math.floor(result / 3600) < 10 ? Math.floor(result / 3600) : Math.floor(result / 3600);
  let m = Math.floor((result / 60 % 60)) < 10 ? Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
  let s = Math.floor((result % 60)) < 10 ? Math.floor((result % 60)) : Math.floor((result % 60));

  let formatString = '';
  if (h != '0') formatString += `${h}${formatStyle.h}`;
  if (m != '0') formatString += `${m}${formatStyle.m}`;
  formatString += `${s}${formatStyle.s}`;
  return formatString;
}

/**
 * 获取菜单列表
 * @param roleId 角色id
 */
export function getMenueList(roleCode) {//1获取用户信息---------------学生1--普通教师2--家长5----学校管理员6----班主任7----导题员8-----题库管理员9-------------
  let list = [
    { value: 1, table: '我的信息', icon: 'wodexinxi2' },
    { value: 3, table: '我的收藏', icon: 'shoucang2' },
    // { value: 6, table: '我的邀请', icon: 'fenxiaoyuebao' },
    { value: 9, table: '修改密码', icon: 'mima2' },
  ]
  if (roleCode == 'STUDENT') {
    list = [
      { value: 1, table: '我的信息', icon: 'wodexinxi2' },
      { value: 2, table: '我的班级', icon: 'wodebanji2' },
      { value: 3, table: '我的收藏', icon: 'shoucang2' },
      // { value: 4, table: '我的关联', icon: 'guanlian2' },
      { value: 5, table: '我的微课', icon: 'weike2' },
      // { value: 6, table: '我的邀请', icon: 'fenxiaoyuebao' },
      { value: 9, table: '修改密码', icon: 'mima2' },
    ];
  }
  if (roleCode == 'TEACHER' || roleCode == 'CLASS_HEAD') {
    list = [
      { value: 1, table: '我的信息', icon: 'wodexinxi2' },
      { value: 2, table: '我的班级', icon: 'wodebanji2' },
      { value: 5, table: '我的微课', icon: 'weike2' },
      { value: 3, table: '我的收藏', icon: 'shoucang2' },
      // { value: 6, table: '我的邀请', icon: 'fenxiaoyuebao' },
      { value: 9, table: '修改密码', icon: 'mima2' },
    ];
  }
  if (roleCode == 'PARENT') {
    list = [
      { value: 1, table: '我的信息', icon: 'wodexinxi2' },
      { value: 3, table: '我的收藏', icon: 'shoucang2' },
      // { value: 4, table: '我的关联', icon: 'guanlian2' },
      // { value: 6, table: '我的邀请', icon: 'fenxiaoyuebao' },
      { value: 9, table: '修改密码', icon: 'mima2' },
    ];
  }
  return list;
}


/**
 * 根据传入的对象，打开新页面 可返回 一般用于进入详情页
 * @param obj  ：参数对象
 * @param pathname  ：路由
 * @param dispatch ：类型:方法：路由组件的dispatch方法
 * @param routerType : 路由跳转类型
 */
export const pushNewPage = (obj = {}, pathname = '/home', dispatch, routerType = 'push') => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop; //变量t就是滚动条滚动时，到顶部的距离
  rememberScrollTopCache(scrollTop);
  const newQuery = { ...obj };
  //修改地址栏最新的请求参数
  dispatch && dispatch(routerRedux[routerType]({
    pathname,
    search: queryString.stringify(newQuery),
  }));
};

/**
 * 获取指定时间的最后一天
 * @param format 2019-04-30
 * @returns {Date}
 */
export const getCurrentMonthLast = (format = null) => {
  let date
  if (format) {
    date = new Date(format);
  } else {
    date = new Date()
  }
  let currentMonth = date.getMonth();
  let nextMonth = ++currentMonth;
  let nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
  let oneDay = 1000 * 60 * 60 * 24;
  return new Date(nextMonthFirstDay - oneDay);
}

/**
 * date格式化
 * @param fmt "YYYY-mm-dd HH:MM"
 * @param date (new Date)
 * @returns {*}  2019-06-06 19:45
 */
export let dateFormat = (fmt, date) => {
  let ret;
  const opt = {
    "Y+": date.getFullYear().toString(),        // 年
    "m+": (date.getMonth() + 1).toString(),     // 月
    "d+": date.getDate().toString(),            // 日
    "H+": date.getHours().toString(),           // 时
    "M+": date.getMinutes().toString(),         // 分
    "S+": date.getSeconds().toString()          // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    }
    ;
  }
  ;
  return fmt;
}


/**
 * url处理
 * @param url ：连接
 */
export const urlToList = url => {
  const urllist = url.split('#').map(i => {
    if (i.indexOf('?') > 0) {
      return i.split('?')[0];
    } else {
      return i
    }
  });
  return urllist[urllist.length - 1];
};

/**
 *获取当前时间的年月
 * @param TimeStyle  :时间连接符号
 * @returns {string} ：返回样式值
 */
export function getTimestamp(TimeStyle) {
  let DateString;
  const Time = new Date();
  const year = Time.getFullYear();
  const month = Time.getMonth() + 1;
  DateString = year + TimeStyle + month;
  return DateString;
}

/**
 *获取当前时间的年月日
 * @param TimeStyle  :时间连接符号
 * @returns {string} ：返回样式值
 */
export function getTimestampDay(TimeStyle) {
  let DateString;
  const Time = new Date();
  const year = Time.getFullYear();
  const month = Time.getMonth() + 1;
  const day = Time.getDate();
  DateString = year + TimeStyle + month + TimeStyle + day;
  return DateString;
}

/**
 * 通过location提取出query,pathname,search
 * @param location
 * @returns {{query: {}, pathname, search}}
 */
export const getLocationObj = location => {
  const { search, pathname } = existObj(location) ? { ...location } : {}
  const query = existObj(queryString.parse(search)) ? { ...queryString.parse(search) } : {};
  return { query, pathname, search }

}

/**
 * 验证特殊字符
 * @param newName
 * @returns {Boolean}
 */
export const validatingSpecialCharacters = newName => {
  const regEn = /[`!@#$%^&*+?:"{},.\/;'[\]]/im,
    flSpaceReg = /^\s+|\s+$/gi,
    spaceReg = new RegExp(/\s+/g),
    regCn = /[·！#￥（——）：；“”‘、，。？、[\]]/im;
  const tempNewName = newName.replace(spaceReg, "");//去除所有空格
  if (!tempNewName) {
    openNotificationWithIcon('warning', `不能全是空格`, 'rgba(0,0,0,.85)', '', 3)
    return true;
  }
  if (flSpaceReg.test(newName)) {
    openNotificationWithIcon('warning', `首尾不能包含空格`, 'rgba(0,0,0,.85)', '', 3)
    return true;
  }
  if (regEn.test(newName) || regCn.test(newName)) {
    openNotificationWithIcon('warning', `不能包含特殊字符!`, 'rgba(0,0,0,.85)', '', 3)
    return true;
  } else {
    return false;
  }
}


/**
 * 处理播放量的显示
 * @param num :播放量
 */
export const dealVideoNum = (
  num = 0
) => {
  let numString = num;
  numString = parseInt(num, 10) >= 1000 ? (parseInt(num, 10) / 1000).toFixed(1) + 'k' : num;
  numString = parseInt(num, 10) >= 10000 ? (parseInt(num, 10) / 1000).toFixed(1) + 'k' : numString;
  numString = parseInt(num, 10) >= 100000 ? (parseInt(num, 10) / 10000).toFixed(1) + 'w' : numString;
  return numString;
}

//班级报告总分分布表格数据处理，自动分页
/**
 *返回表格DataSource
 * @param data  :数据
 * * @param p  :页码
 */
export function backDataSource(data = {}, p = 1) {
  let TableDataSource = [];
  let DataSource = [];
  let persoSum = 0;//人数
  data.yData && data.yData.map((item, index) => {
    persoSum = persoSum + item;
  })
  data.xData && data.xData.map((item, index) => {
    let objData = {};
    objData.key = index;
    objData.segmentation = item;
    objData.number = data.yData[index];
    objData.accounted = Number(data.yDataRate[index]).toFixed(2) + '%';
    objData.proportion = data.yData[index] + '人(' + Number(data.yDataRate[index]).toFixed(2) + '%)';
    TableDataSource.push(objData)
  })
  // if (p == 1) {
  //   DataSource = TableDataSource.slice(0, 10);
  // }
  // if (p == 2) {
  //   DataSource = TableDataSource.slice(10, 20);
  // }
  // if (p == 3) {
  //   DataSource = TableDataSource.slice(20, 30);
  // }

  /** ********************************************************* 根据页码动态计算数据 start author:张江 date:2020年12月07日 *************************************************************************/
  if (p && p > 0) {
    DataSource = TableDataSource.slice((p - 1) * 10, p * 10);
  }
  /** ********************************************************* 根据页码动态计算数据 start author:张江 date:2020年12月07日 *************************************************************************/

  return DataSource;
}


/**
 * 计算题目数量
 * @param list  :题目数据列表
 */
export const calQuestionNum = (list) => {
  let questionNum = 0;
  list && list.map((item) => {
    if (existArr(item.materialQuestionList)) {
      item.materialQuestionList.map((cItem, index) => {
        questionNum += 1;
      })
    } else {
      questionNum += 1;
    }
  })
  return questionNum;
}

/**
 * 处理含材料题目取值
 * @param question  :含材料的题目信息
 * @param field  :待取字段
 */
export const handleFetchingField = (question, field) => {
  let fieldString = question[field];
  if (question[field]) {
    fieldString = question[field]
  } else {
    if (existArr(question.materialQuestionList)) {
      fieldString = question.materialQuestionList[0][field]
    }
  }
  return fieldString;
}


/**
 * 异常状态配置处理
 * @param statusJson  :返回待处理的字段
 * @param isTip  :是否提示
 * @returns {Object}  :处理之后的返回值{isContinue:true,code:200}   {isContinue:false,code:412}
 */
export const HandleAbnormalStateConfig = (statusJson, isTip = false) => {
  let returnJson = { isContinue: true, code: 200, data: null };
  if (!statusJson) {
    return returnJson;
  }
  ;//如果不存在 直接返回
  for (const item of abnormalStateConfig) {
    if (statusJson.code == item.code) {//只有配置异常状态的才进入
      returnJson.isContinue = false;//false 没必要之后后续的逻辑
      returnJson.code = statusJson.code;//后台返回的状态码
      returnJson.data = statusJson;//后台返回的数据
      if (isTip) {
        const messageTip = returnJson.message || returnJson.msg || item.name;
        Modal.warning({
          title: '提示信息',
          content: messageTip,
        });
      }
      break;
    }
  }
  return returnJson;
}


/**
 * 生成二维码
 * @param idString  :标签Id
 * @param qrText  :生成二维码的字符
 */
export const generateQRCode = (idString = '', qrText = '') => {
  if (!idString || !qrText) { return; }
  const QRCodeLabel = document.getElementById(idString);//承载二维码的标签
  if (!QRCodeLabel) { return; }
  QRCodeLabel.innerHTML = '';//清空生成的二维码
  new QRCode(QRCodeLabel, {
    text: qrText,
    width: 160,
    height: 160,
    colorDark: "#000",
    colorLight: "#fff",
    correctLevel: QRCode.CorrectLevel.H
  });
}

/**
 * 取题目中以及材料下题目中对应的id
 * @param topic ：题目信息
 * @param field ：待取的字段
 * @returns String,Number;
 */
export const dealMaterialQuestionList = (topic, field) => {
  let questionString;
  if (topic.dataId && existArr(topic.materialQuestionList)) {
    let tempIdArray = []
    for (const item of topic.materialQuestionList) {
      tempIdArray.push(item[field])
    }
    questionString = tempIdArray.join(',')
  } else {
    questionString = topic[field];
  }
  return questionString;
}

/**
 * 试题板处理id与name的数据组合
 * @param topic ：题目信息
 * @param fieldId ：待取的字段
 * @param fieldName ：待取的字段
 * @returns Array;
 */
export const dealQuestionfieldIdOrName = (topic = {}, fieldId = 'knowIds', fieldName = 'knowName', splitString = ',') => {
  let fieldJsonArray = [];
  const fieldIdArray = topic[fieldId] ? topic[fieldId].split(splitString) : [];
  const fieldNameArray = topic[fieldName] ? topic[fieldName].split(splitString) : [];
  fieldJsonArray = fieldIdArray.map((item, index) => {
    return {
      code: item,
      name: fieldNameArray[index] || '知识点-' + item
    };
  })
  return fieldJsonArray;
}


/**
 * 取题目中以及材料下题目中对应的dataid以及材料题中某一个题目id
 * @param topic ：题目信息
 * @param field ：待取的字段
 * @returns String,Number;
 */
export const dealQuestionToGetDataIdQuestionId = (topic, field) => {
  let dataIdAndQuestionId = {
    dataId: topic.dataId,
    questionId: '',
  };
  if (topic.dataId && existArr(topic.materialQuestionList)) {
    dataIdAndQuestionId.questionId = topic.materialQuestionList[0][field];
  } else {
    dataIdAndQuestionId.questionId = topic[field];
  }
  return JSON.stringify(dataIdAndQuestionId);
}


/**
 * 分页计算序号-根据当前页序号 页码 数据条数
 * calculateSerialNumber(index, query.p || 1, query.s||10)
 * @param index ：当前页序号index 从0开始
 * @param page ：当前页码
 * @param size ：当前页数据条数
 * @returns String,Number;
 */
export const calculateSerialNumber = (index, page, size) => {
  const pageNumber = Number(page);
  const pageSize = Number(size);
  let serialNumber = Number(index) + 1;
  if (pageNumber && pageSize) {
    serialNumber = Number(index) + 1 + (pageNumber - 1) * pageSize;
  }
  return serialNumber;
}

/**
 * 手机号部分加密
 * @param phone : 手机号
 * @return {*}
 */

export function encryptionPhone(phone) {
  let phoneNo = String(phone)
  let tel = phoneNo.substr(0, 3) + '****' + phoneNo.substr(7)
  return tel
}

/**
 * 数字转换成数字长度的数组
 * @param number: 待转换数字
 * @return {*}
 */

export function numericArrayByInterval(number) {
  let numberInfo = Number(number);
  let numberArray = [];
  // if (numberInfo < 40) {
  for (let i = 0; i < numberInfo + 1; i++) {
    if (i > numberInfo) {//处理出现小数分数段的情况
      i = save2NumAfterPoint(numberInfo, 1)
    }
    numberArray.push(i)
  }
  // }
  return numberArray;
}

/**
 * 秒转换成1:12:00
 * @param number: 待转换数字
 * @return {*}
 */

export function timeTransformation(number) {
  let numberInfo = Number(number);
  let hours, minutes, seconds, timeStr = ''
  if (numberInfo < 60) {
    seconds = numberInfo < 10 ? '0' + numberInfo : numberInfo
    timeStr = '00:' + seconds
  } else if (numberInfo > 60 && numberInfo < 3600) {
    minutes = parseInt(numberInfo / 60)
    seconds = (numberInfo % 60) < 10 ? '0' + numberInfo % 60 : numberInfo % 60
    timeStr = minutes + ":" + seconds
  } else if (numberInfo > 3600) {
    hours = parseInt(numberInfo / 3600)
    let yu = numberInfo % 3600
    minutes = parseInt(yu / 60) < 10 ? '0' + parseInt(yu / 60) : parseInt(yu / 60)
    seconds = (yu % 60) < 10 ? '0' + yu % 60 : yu % 60
    timeStr = hours + ':' + minutes + ':' + seconds
  }
  return timeStr;
}

/**
 * 打开第三方应用
 * @param href  ：第三方应用协议
 */
export function openingThirdPartyApp(href) {
  const openingFunction = () => {
    let openingElement = document.createElement('a');
    openingElement.href = href;
    document.body.appendChild(openingElement);
    // openingElement.click(); //点击下载
    document.body.removeChild(openingElement); //下载完成移除元素
  }
  window.protocolCheck(href,
    function () {
      openNotificationWithIcon('warning', '提示', '', '请先安装对应的桌面端直播平台应用！');
    }, openingFunction(), () => {
      openNotificationWithIcon('warning', '提示', '', '当前浏览器不支持打开第三方应用,请切换浏览器或更新浏览器版本后再尝试！');
    });
}

/**
 * 观看直播
 * @param data  ：观看直播的对应参数
 */
export function watchLiveBroadcast(idString, data) {
  if (!data?.liveUrl) return;
  let player = new TcPlayer(idString, {
    "m3u8": data?.liveUrl.replace('.m3u8', '').replace('http://', 'webrtc://').replace('https://', 'webrtc://'),//data?.liveUrl,//data.liveUrl,
    // "flv": data?.liveUrl.replace('.m3u8', '.flv'), //增加了一个 flv 的播放地址，用于PC平台的播放
    // "m3u8_hd": "http://200002949.vod.myqcloud.com/200002949_b6ffc.f230.av.m3u8",
    // "m3u8_sd": "http://200002949.vod.myqcloud.com/200002949_b6ffc.f220.av.m3u8",
    "autoplay": true,      //iOS 下 safari 浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
    "poster": data?.coverUrl,
    // "width": '480',//视频的显示宽度，请尽量使用视频分辨率宽度
    // "height": '320',//视频的显示高度，请尽量使用视频分辨率高度
    "wording": {
      2032: "请求视频失败，请检查网络",
      2048: "请求m3u8文件失败，可能是网络错误或者跨域问题",
      13: '直播已结束，敬请关注最新直播信息'
    }
  });
  return player;
}