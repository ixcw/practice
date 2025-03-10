/**
 * 常用数据类集合
 * @author:张江
 * @date:2019年11月19日
 * @version:v1.0.0
 * */

export const GET = "GET";
export const POST = "POST";
export const PUT = "PUT";
export const PATCH = "PATCH";
export const DELETE = "DELETE";
export const UPDATE = "UPDATE";

//************************************************【类型】*************************************************

export const questionType = [
  { code: 1, name: "竞赛题" },
  { code: 2, name: "高考真题" },
  { code: 9, name: "其他" },
];

/**1：竞赛，2：真题，3：模拟，4：课后习题，5：教辅习题，6：专题，9:其他**/
export const paperQuestionFlag = [
  { code: 1, name: "竞赛", importTypes: [1, 3] },
  { code: 2, name: "真题", importTypes: [1, 3] },
  { code: 3, name: "模拟", importTypes: [1, 3] },
  { code: 4, name: "课后习题", importTypes: [2] },
  { code: 5, name: "教辅习题", importTypes: [4] },
  { code: 6, name: "专题", importTypes: [2] },
  { code: 9, name: "其他", importTypes: [1, 2, 3] },
];

//收藏类型
export const collectionType = {
  QUESTION: { type: 1, name: "题目" },
  PAPER: { type: 2, name: "试卷" },
  QUESTION_VIDEO: { type: 3, name: "题目微课" },
};

// export const topicTypeArray = {
//   1: '选择题',
//   2: '多选题',
//   3: '填空题',
//   4: '解答题',
//   5: '选择题',
//   6: "填空题",
//   7: "判断题",
//   8: '主观题',
//   9: '单选题',
//   10: '多选题',
//   11: '填空题',
//   12: '判断题',
//   13: '简答题',
//   14: '材料分析',
//   15: '论述题',
//   16: '单选题',
//   17: '多选题',
//   19: '综合题',
//   20: '填空题',
//   21: '实验题',
//   22: '计算题',
//   23: '推断题',
//   24: '解答题',
//   25: '工业流程',
//   26: '单选题',
//   27: '填空题',
//   28: '实验题',
//   29: '解答题',
//   30: '作图题',
// }
//************************************************【题目难度值】*************************************************

export const difficultyType = [
  { code: 0.94, name: "容易", RandomRangeValue: "1.00~0.80" },
  { code: 0.85, name: "较易", RandomRangeValue: "0.79~0.69" },
  { code: 0.65, name: "一般", RandomRangeValue: "0.68~0.45" },
  { code: 0.4, name: "较难", RandomRangeValue: "0.44~0.21" },
  { code: 0.15, name: "困难", RandomRangeValue: "0.20~0.0.01" },
];

//************************************************【年份】*************************************************

// 获取当前年份
const currentYear = new Date().getFullYear();

// 计算起始年份和结束年份
const startYear = currentYear - 3;
const endYear = currentYear + 7;

// 生成年份数组
const yearArray = [];
for (let year = startYear; year <= endYear; year++) {
  yearArray.push({ code: year, name: year });
}

export const particularYear = yearArray;

// [
//   { code: 2025, name: '2025年' },
//   { code: 2024, name: '2024年' },
//   { code: 2023, name: '2023年' },
//   { code: 2022, name: '2022年' },
//   { code: 2021, name: '2021年' },
//   { code: 2020, name: '2020年' },
//   { code: 2019, name: '2019年' },
//   { code: 2018, name: '2018年' },
//   { code: 2017, name: '2017年' },
//   { code: 2016, name: '2016年' },
//   { code: 2015, name: '2015年' },
//   { code: 2014, name: '2014年' },
//   { code: 2013, name: '2013年' },
//   { code: 2012, name: '2012年' },
//   { code: 2011, name: '2011年' },
//   { code: 2010, name: '2010年' },
// ];

//************************************************【组织类型】*************************************************
export const organizationTypeArr = [
  { id: 1, name: "学校" },
  { id: 2, name: "机构" },
];
//************************************************【正则表达式】*************************************************

//====================================【pubsub的事件名称Start】============================================

export const pubuSubName = {
  //  代理商分润
  GET_TABLE_ISEDIT_STATE: "getTableIsEditState", //获取表格是否正在编辑的状态
};

//====================================【pubsub的事件名称End】============================================
//所有定义的正则表达式
export const myRegExp = {
  checkScoreFormat: /^\d+[.]?([5|0]?)$/g, //检查分数格式的正则 ( XXX.5   xxx.0  xxx.   只能出现这3种情况 xxx为纯数字)
  doubleOfTwoDigitOrInt: /^\d+([.]?(\d{1,2})){0,1}$/g, //检查是否整数或者2位以内的小数
  pointEnding: /^\d+[.]{1}$/g, //检差分数是否是 xxx.的情况
  isInteger: /^[0-9]+$/g, //正整数
  money: /^(0|([0-9]+)(.([0-9]{1,2})){0,1})$/g, //费用的符合标准（正数、保留小数位数后2位）
};
//************************************************【 题库管理任务状态 】*************************************************

export const qTaskStatus = [
  //1：未开始，2：完成,3:驳回，4修驳完成，5再次驳回，6定版
  { value: 0, text: "全部", color: "geekblue" },
  { value: 1, text: "未开始", color: "geekblue" },
  { value: 2, text: "审核中", color: "green" },
  { value: 3, text: "被驳回", color: "#f0ad4e" },
  { value: 4, text: "修驳审核中", color: "green" },
  { value: 5, text: "再次被驳回", color: "#f0ad4e" },
  { value: 6, text: "已定版", color: "#5cb85c" },
];

//************************************************【手机号正则表达式】*************************************************
export const phoneReg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
//************************************************【身份证正则表达式】*************************************************
export const IdCardReg =
  /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/; //身份证号(15位、18位数字)，最后一位是校验位，可能为数字或字符X
//************************************************【邮箱正则表达式】*************************************************
export const emailReg =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//************************************************【密码正则表达式】*************************************************
export const passwordReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/; // 6到16位的密码数字字母组合

//************************************************【正则表达式】*************************************************
export const specialCharReg =/^[^\s]+$|[\W_]/; // 6到16位的密码数字字母组合

//************************************************【 学段 】*************************************************

export const learningPeriod = [
  { code: 1, name: "小学" },
  { code: 2, name: "初中" },
  { code: 3, name: "高中" },
];

//************************************************【 默认按钮权限列表 】*************************************************

export const localButtons = ["查看", "添加", "编辑", "删除"];

//************************************************【 代理商审核状态情况 】*************************************************

export const agentReviewStatus = [
  { id: 2, name: "激活" },
  { id: 3, name: "冻结" },
];

//************************************************【 设参类型 】*************************************************

export const setParamTypes = [
  { id: 1, name: "未设参" },
  { id: 2, name: "已设参" },
];

//************************************************【图标代码地址】*************************************************
export const scriptUrl = "//at.alicdn.com/t/font_2006702_ydiyq29xhai.js";

//************************************************【excel MIME类型】*************************************************
export const excelType = [
  "application/vnd.ms-excel",
  "application/msexcel",
  "application/x-msexcel",
  "application/x-ms-excel",
  "application/x-excel",
  "application/x-dos_ms_excel",
  "application/xls",
  "application/x-xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

//************************************************【验证银行卡号是否正确】*************************************************
export const bankNumberTest = /^([1-9]{1})(\d{14}|\d{18})$/;

//************************************************【文件类型验证】*************************************************
export const fileType = {
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
};

//************************************************【题库修改图片的类型】*************************************************

export const questionBankImageType = [
  { code: 2, name: "题材" },
  { code: 3, name: "题干" },
  { code: 4, name: "选项/小题" },
  { code: 5, name: "答案" },
  { code: 6, name: "解析" },
];

//************************************************【设参筛选的类型】*************************************************

export const setParamScreeningType = [
  { code: 1, name: "设参未完成" },
  { code: 2, name: "微课未上传" },
  { code: 3, name: "设参已完成" },
  { code: 4, name: "微课已上传" },
];

//************************************************【权限可见】*************************************************

export const permissionVisibleList = [
  { code: "3", name: "全部" },
  { code: "2", name: "校内" },
  { code: "1", name: "仅自己" },
  { code: "4", name: "多校" },
];

//************************************************【上传微课的视频大小】*************************************************
export const MicroFileSize = 400; //视频大小限制 400M

//************************************************【 异常状态配置 】*************************************************

export const abnormalStateConfig = [{ code: 412, name: "逻辑异常" }];

//************************************************【试卷管理试卷的类型】*************************************************
export const paperMangeTypeList = [
  // { code: 1, name: '普通试卷' },
  // { code: 2, name: '单元试卷' },
  { code: 3, name: "试卷" },
  // { code: 4, name: '套题' },
  { code: 5, name: "单元卷" },
];

//************************************************【试卷类型】*************************************************

export const testPaperType = [
  { code: 1, name: "模拟" },
  { code: 2, name: "真题" },
  { code: 6, name: "专题" },
];

//************************************************【权限】*************************************************

export const jurisdiction = [
  { code: 3, name: "全部" },
  { code: 2, name: "校内" },
];

//************************************************【点阵笔类型】*************************************************

// export const penTypeList = [
//   // { code: 1, name: '腾千里' },
//   // { code: 2, name: '拓思德' }
//   { code: 1, name: '南方节点' },
//   { code: 2, name: '北方节点' }
// ];

//************************************************【科类】*************************************************
export const streamArray = [
  { code: 1, name: "文科" },
  { code: 2, name: "理科" },
  // { code: 3, name: '综合' }
];

//************************************************【 点阵笔类型/节点类型 】*************************************************

export const pumaNodeTypeList = [
  { name: "南方节点", key: "1" }, //南方节点-1滕千里
  { name: "北方节点", key: "2" }, //北方节点 - 2拓思德
];

//************************************************【 铺码类型 】*************************************************
// 类型，1：试卷、2：答题卡、3：连接卡,4：通用答题卡
export const spreadCodeTypeList = [
  { code: "1", name: "试题" },
  { code: "2", name: "答题卡" },
  { code: "3", name: "链接卡" },
  { code: "4", name: "通用答题卡" },
];

//************************************************【题组类型】*************************************************

export const questionGroupTypeArray = [
  { code: 1, name: "作业" },
  { code: 2, name: "测验" },
  { code: 3, name: "试卷" },
];

//************************************************【 直播状态 】*************************************************
// 0待开播，1直播中，2直播结束，-1直播取消
export const liveStatusList = [
  { code: 0, name: "待开播" },
  { code: 1, name: "直播中" },
  { code: 2, name: "直播结束" },
  { code: -1, name: "直播取消" },
];

//************************************************【 直播状态 】*************************************************
// 直播开放类型 1: 全部用户开放，2:对特定班级开放 ，3：对全部用户和特定班级开放
export const openTypeList = [
  { code: 1, name: "全部用户开放" },
  { code: 2, name: "对特定班级开放" },
  // { code: 3, name: '对全部用户和特定班级开放', },
];

//************************************************【 直播类型 】*************************************************
export const liveTypeList = [
  { code: 1, name: "调用摄像头" },
  { code: 2, name: "录制屏幕" },
];

//************************************************【 时间格式化 】*************************************************

export const dateFormat = "YYYY-MM-DD HH:mm:ss";

//************************************************【 APP下载链接二维码 】*************************************************
export const appDownloadUrlCodeImg = "https://reseval.gg66.cn/download-app.png";

export const editorStartValue =
  '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" /><style type="text/css">body {font-family: Helvetica, arial, sans-serif;font-size: 14px;line-height: 1.6;padding-top: 10px;padding-bottom: 10px;background-color: white;}</style></head><body>';
export const editorEndValue = "</body></html>";
