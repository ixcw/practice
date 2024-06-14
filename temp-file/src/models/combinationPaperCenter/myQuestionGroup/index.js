/**
* 我的组题models
* @author:张江
* @date:2020年08月29日
* @version:v1.0.0
* */
import Model from 'dva-model'
import { MyQuestionGroup as namespace, SchoolBasedQuestionBank } from '@/utils/namespace'
import {
  getHistory,
  editPaper,
  getQuetionInfoByPaperId,//通过题组id获取题目列表
  importPdfFile,//导入试卷的pdf版 或者答题卡
  getQuestionLists,//获取校本题库记录
  newLatticeMake,//开始铺设
  saveSingleDataAreaParams,//保存单个区域参数
  downloadExportPDF,//桌面端下载导出pdf
  addPaperToQuestionGroup,//首页试卷添加到我的题组
} from '@/services/combination/myQuestionGroup';
import {
  getButtonList
} from '@/services/auth';
import buttonListCache from '@/caches/buttonList';
import { getPageQuery, queryParamIsChange, existArr } from "@/utils/utils";

let lastQuery = {}
export default Model({
  namespace,
  subscriptions: {
    setup({ dispatch, history }) {

      history.listen(location => {
        const { pathname, search } = location
        //如果进入当前页面 我的题组
        if (pathname.match(namespace)) {
          let query = getPageQuery();
          queryParamIsChange(
            lastQuery,
            query,
            ['paperType', 'page', 'size', 'keyword'],
            ['paperType', 'page', 'size', 'keyword'],
          ) &&
            dispatch({
              type: 'getButtonList',
              payload: {
                url: pathname,
              },
              callback: (result) => {
                const isAsk = window.$PowerUtils.judgeButtonAuth(result, '上传') ? 1 : ''
                dispatch({
                  type: 'getHistory',
                  payload: {
                    paperType: query.paperType,
                    page: query.page || 1,
                    size: query.size || 10,
                    name: query.keyword || '',
                    // isAsk,
                  }
                })
              }
            });

          // lastQuery = query
        }

        //如果进入当前页面 校本题库
        if (pathname.match(SchoolBasedQuestionBank)) {
          let query = getPageQuery();
          queryParamIsChange(
            lastQuery,
            query,
            ['paperType', 'page', 'size', 'keyword', 'SBQBtype', 'gradeCode'],
            ['paperType', 'page', 'size', 'keyword', 'SBQBtype', 'gradeCode'],
          ) &&
            dispatch({
              type: 'getButtonList',
              payload: {
                url: pathname,
              },
              callback: (result) => {
                const isAsk = window.$PowerUtils.judgeButtonAuth(result, '上传') ? 1 : ''
                dispatch({
                  type: 'getQuestionLists',
                  payload: {
                    paperType: query.paperType,
                    page: query.page || 1,
                    size: query.size || 10,
                    name: query.keyword || '',
                    isPrivate: query.SBQBtype || '2',
                    gradeId: query.gradeCode || '',
                    // isAsk,
                  }
                })
              }
            });

          // lastQuery = query
        }
      })
    },
  },
  reducers: {
    getHistorySuccess(state, action) {
      return { ...state, paperData: action.result, loading: false }
    },
    getQuetionInfoByPaperIdSuccess(state, action) {
      let count = 0;
      const result = action.result ? action.result : [];
      let records = [];
      result.forEach((topicType, topicTypeIndex) => {
        let topicJson = {
          ...topicType,
          questionList: []
        }

        topicType.questionList && topicType.questionList.length > 0 && topicType.questionList.forEach((topic, index) => {
          if (existArr(topic.materialQuestionList)) {//获取材料下子题的id 并处理分数
            topic.materialQuestionList = topic.materialQuestionList.map((item, tIndex) => {
              topic.serialNumber = ++count;
              item.serialNumber = topic.serialNumber
              //將題目添加到记录表格中
              return {
                id: item.id,
                ...item,
                serialNumber: item.serialNumber,
                topicTypeIndex,
              }
            })
          } else {
            topic.serialNumber = ++count;
          }
          //將題目添加到记录中
          topicJson.questionList.push({
            id: topic.id,
            serialNumber: topic.serialNumber,
            ...topic,
            topicTypeIndex
          })
        })
        records.push(topicJson)
      })
      return { ...state, exportQuestionList: records, loading: false }
    },

    getButtonListSuccess(state, action) {
      buttonListCache(action.result);
      return { ...state, loading: false }
    },

    getQuestionListsSuccess(state, action) {
      return { ...state, sbqbPaperList: action.result, loading: false }
    },
  }
}, {
  getHistory,
  editPaper,
  getQuetionInfoByPaperId,//通过题组id获取题目列表
  importPdfFile,//导入试卷的pdf版 或者答题卡
  getButtonList,
  getQuestionLists,//获取校本题库记录
  newLatticeMake,//开始铺设
  saveSingleDataAreaParams,//保存单个区域参数
  downloadExportPDF,//桌面端下载导出pdf
  addPaperToQuestionGroup,//首页试卷添加到我的题组
})
