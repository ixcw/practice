/**
 * 家长数据
 * @author:shihaigui
 * date:2023年5月12日
 * */



import { Parent as namespace } from '../utils/namespace'
import { getloctionObj } from '@/utils/utils'

//查询家长信息
import { 
  queryFamilyListMes,//查询家长信息
  queryFamilyDetailsMes,//获取家长详情信息
  importFamilyMes, //批量导入学生家长信息
  getDictItems,//字典接口
  batchLoadDictGroups,//批量加载多个字典组
  getNativeTree,//加载地域树（籍贯下拉框）
  countParentNum,////统计班级家长人数
  addFamilyMes,// 新建家长基础信息
  queryFamilyClassMesAndGradeMes,//查询校级平台或班主任所管理全部家长的班级和年级信息
  getTeacherDoUrges,//一键督促完善信息
  getStatTeachers,// 主页面人数统计
  queryStudentAssocLietMes,//查询新建家长关联学生的列表
  getGradeStatusClass,
  queryTreeCatalogueMes,//查询学级，学段，年级，班级
  deleteFamilyMes,//批量删除家长数据
  getVerificationCode, //获取验证码
	verificationCode, //验证码校验
} from '@/services/ParentDataInterface'


export default {
  // 命名

  namespace,

  //状态
  state: {},

  //监听路由的变化，鼠标，键盘，服务器连接变化等，做出不同响应

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((pathname) => {

      })
    }
  },
  //异步操作
  effects: {
    //查询家长信息
    *queryFamilyListMesApi ({ payload, callback }, { call, put, select }) {
      const data = yield call(queryFamilyListMes, payload)
      callback(data.result)
    },
    //获取家长详情信息
    *queryFamilyDetailsMesApi ({ payload, callback }, { call, put, select }) {
      const data = yield call(queryFamilyDetailsMes, payload)
      callback(data)
    },
    // 批量加载多个字典组
    *batchLoadDictGroupsApi({ payload }, { call, put, select }) {
      const data = yield call(batchLoadDictGroups, payload);
      yield put({ type: 'DictionaryDictGroups', payload: data.result });
    },
    // 加载地域树（籍贯下拉框）
    *getDictionaryAddressApi({ payload }, { call, put, select }) {
      const data = yield call(getNativeTree, payload);
      yield put({ type: 'DictionaryAddress', payload: data.result });
    },

    //批量导入学生家长信息
    *importFamilyMesApi ({ payload, callback }, { call, put, select }) {
      const data = yield call(importFamilyMes, payload)
      callback(data)
    },

    //获取当前年级学籍班级信息
    *getGrateStatusClassData({ payload, callback }, { call }) {
      const data = yield call(getGradeStatusClass, payload);
      callback(data)
    },

    //统计班级家长人数
    *countParentNumApi ({ payload, callback }, { call, put, select }) {
      const data = yield call(countParentNum, payload)
      callback(data)
    },

    //一键督促完善信息
    *getTeacherDoUrgeApis({ payload, callback }, { call, put, select }) {
      const data = yield call(getTeacherDoUrges, payload);
      callback(data.result)
    },

    // 主页面人数统计
    // *getStatTeacherStatistics({ payload, callback }, { call, put, select }) {
    //   const data = yield call(getStatTeachers, payload);
    //   callback(data)
    // },
    // 新建家长基础信息
    *addFamilyMesApi({ payload, callback }, { call, put, select }) {
      const data = yield call(addFamilyMes, payload);
      callback(data)
    },

    //查询校级平台或班主任所管理全部家长的班级和年级信息
    *queryFamilyClassMesAndGradeMesApi({ payload, callback }, { call, put, select }) {
      const data = yield call(queryFamilyClassMesAndGradeMes, payload);
      callback(data)
    },

    //查询新建家长关联学生的列表
    *queryStudentAssocLietMesApi({ payload, callback }, { call, put, select }) {
      const data = yield call(queryStudentAssocLietMes, payload);
      callback(data)
    },

    //查询学级，学段，年级，班级
    *queryTreeCatalogueMesApi({ payload, callback }, { call, put, select }) {
      const data = yield call(queryTreeCatalogueMes, payload);
      callback(data)
    },

    // 获取验证码
		*getVerificationCodeApi({ payload, callback }, { call, put, select }) {
			const response = yield call(getVerificationCode, payload)
			callback(response)
		},

		// 验证码校验
		*verificationCodeApi({ payload, callback }, { call, put, select }) {
			const response = yield call(verificationCode, payload)
			callback(response)
		},

    // 批量删除家长数据
		*deleteFamilyMesApi({ payload, callback }, { call, put, select }) {
			const response = yield call(deleteFamilyMes, payload)
			callback(response)
		}

  },

  //同步操作
  reducers: {

      DictionaryAddress(state, action) {
        // 地址内容处理 （省-市-县）
        const ProvinceCityAddressOptions = action.payload?.map(item => {
            return {
                value: item.id,
                label: item.name,
                children: item.children?.map(item2 => { 
                    return { 
                        value: item2.id, 
                        label: item2.name,
                        children: item2.children?.map(item3 => { 
                            return { 
                                value: item3.id, 
                                label: item3.name,
                            } 
                        })
                    } 
                })
            }
        })
        // 地址内容处理 （省）
        const CityAddressOptions = action.payload?.map(item => { return { value: item.id, label: item.name } })
        const CityAddressOptionsText = action.payload?.map(item => { return { value: item.name, label: item.name } })
        return { ...state,ProvinceCityAddressOptions,CityAddressOptions,CityAddressOptionsText };
    },

    DictionaryDictGroups(state, action) {
      const nationAs = action.payload?.find((item) => item.dictCode === 'DICT_NATION')?.dictItems?.map(item => { return { value: item.itemValue-0, label: item.itemText } })
      const sexOptions = action.payload?.find((item) => item.dictCode === 'DICT_SEX')?.dictItems?.map(item => { return { value: item.itemValue-0, label: item.itemText } })
      const eduCational = action.payload?.find((item) => item.dictCode === 'DICT_EDU')?.dictItems?.map(item => { return { value: item.itemValue-0, label: item.itemText } })
      const sdentification = action.payload?.find((item) => item.dictCode === 'DICT_DOC_TYPE')?.dictItems?.map(item => { return { value: item.itemValue-0, label: item.itemText } })
      const situAtion = action.payload?.find((item) => item.dictCode === 'DICT_WORK')?.dictItems?.map(item => { return { value: item.itemValue-0, label: item.itemText } })
      const relationOptions = action.payload?.find((item) => item.dictCode === 'DICT_ENROLL_PARENT_RELATION')?.dictItems?.map(item => { return { value: item.itemValue-0, label: item.itemText } })
      

      return { ...state, sexOptions,sdentification,eduCational,situAtion,nationAs,relationOptions };
    },
  }
}
