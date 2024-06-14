/**
* 直播管理
* @author: 张江 
* @date: 2022年04月26日
* @version:v1.0.0
* */
import model from 'dva-model'
import queryString from 'query-string';
import { LiveManage as namespace } from "@/utils/namespace";
import {
  saveLive,//保存直播
  getPageList,//查询直播列表
  updateLive,//修改直播
  deleteLive,//删除直播
  getPageListViewer,//分页获取直播观众列表
  addClassViewer,//添加班级观众
  startLive,//开始直播
  stopLive,//结束直播
  getListCurrentGoods,//查询商品列表
  testLive,//测试直播
  getLiveDetail,//直播详情
  getPageListByUser,//分页获取直播列表
  playToCount,//观看(仅是计数)
  getMangeLiveDetail,//管理端直播详情
  liveFreeJoin,//免费预约直播
} from '@/services/BusinessManagement/liveManage';

export default model({
  state: {
    latticeList: {},////查询点阵铺设列表
    getCompleteTPdfPaper: [],//获取完成制作点阵的pdf列表
  },
  namespace,
  subscriptions: {
    setup: ({ dispatch, history }) => {
      history.listen(location => {
        const { pathname, search = '' } = location;
        const query = queryString.parse(search) || {};
        if (pathname === '/mylive-manage') {
          /**
 * 初始化列表数据
 */
          dispatch({
            type: 'getPageList',
            payload: {
              page: query.p || 1,
              size: 10,
              gradeId: query.gradeId || undefined,//年级
              name: query.name || undefined,//视频名称
              subjectId: query.subjectId || undefined,//科目id
              teacherName: query.teacherName || undefined,//教师姓名
              openType: query.openType || undefined,//开放类型 1:全部用户开放，2:对特定班级开放，3：对全部用户和特定班级开放
            }
          })
        }
      })
    }
  },
  reducers: {
    //对课程数组添加一个key
    getPageListSuccess(state, action) {
      let dataList = action.result ? action.result.data : [];
      const currentPage = action.result && action.result.currentPage ? action.result.currentPage : 1;
      if (dataList.length) {
        dataList.map((re, index) => re.key = ((currentPage - 1) * 10 + (index + 1)))
      }
      action.result.data = dataList;
      return { ...state, liveMangeList: action.result, loading: false };
    },
    //微课价格
    getListCurrentGoodsSuccess(state, action) {
      return { ...state, listCurrentGoods: action.result, loading: false };
    },
    //对查询题目微课数组添加一个key
    findTQuestionVideoListSuccess(state, action) {
      let dataList = action.result ? action.result.data : [];
      const currentPage = action.result && action.result.currentPage ? action.result.currentPage : 1;
      if (dataList.length) {
        dataList.map((re, index) => {
          re.key = ((currentPage - 1) * 10 + (index + 1));
          re.status = re.checkStatus;//审核状态
          re.cover = re.pngUrl;//封面
          re.url = re.video;//视频地址
          return re;
        })
      }
      action.result.data = dataList;
      return { ...state, liveMangeList: action.result, loading: false };
    },
    getPageListViewerSuccess(state, action) {
      let dataList = action.result ? action.result.data : [];
      const currentPage = action.result && action.result.currentPage ? action.result.currentPage : 1;
      if (dataList.length) {
        dataList.map((re, index) => re.key = ((currentPage - 1) * 10 + (index + 1)))
      }
      action.result.data = dataList;
      return { ...state, liveViewerList: action.result, loading: false };
    },
    //分页获取直播列表
    getPageListByUserSuccess(state, action) {
      return { ...state, livePageList: action.result, loading: false };
    },
  }
}, {
  saveLive,//保存直播
  getPageList,//查询直播列表
  updateLive,//修改直播
  deleteLive,//删除直播
  getPageListViewer,//分页获取直播观众列表
  addClassViewer,//添加班级观众
  startLive,//开始直播
  stopLive,//结束直播
  getListCurrentGoods,//查询商品列表
  testLive,//测试直播
  getLiveDetail,//直播详情
  getPageListByUser,//分页获取直播列表
  playToCount,//观看(仅是计数)
  getMangeLiveDetail,//管理端直播详情
  liveFreeJoin,//免费预约直播
})
