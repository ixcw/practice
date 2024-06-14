/**
 * 学生管理models
 * @author:张江
 * @date:2020年09月09日
 * @version:v1.0.0
 * */

import Model from 'dva-model';
import { routerRedux } from 'dva/router';
import { StudentMange as namespace } from '@/utils/namespace';
import {
    getStudentClassList,//查询班级列表
    getStudentList,//通过班级ID，查找班级下面的学生
    saveStudentInfo,//保存/修改一个学生信息
    deleteClassStudentInfo,//从班级中剔除学生,这里只删除学生在班级中的信息
    saveClassInfo,//保存班级信息
    batchImportStudentList,//批量导入学生
    saveStudentTransferInfo,//迁移学生

    /** ********************************************************* 链接卡 start author:张江 date:2021年07月05日 *************************************************************************/
    generationConnectionCard,//开始制作连接卡
    getConnectionCardList,//查询制作的连接卡信息列表
    /** ********************************************************* 链接卡 end author:张江 date:2021年07月08日 *************************************************************************/


    /** ********************************************************* 学生分组 start author:xiongwei date:2021年09月24日 *************************************************************************/
    findStudentGroup,//学生分组查询
    saveStudentsGroup//保存学生分组
    /** ********************************************************* 学生分组 end author:xiongwei date:2021年09月24日 *************************************************************************/
} from '@/services/studentManage'
import queryString from 'query-string';
import pageRecord from '@/caches/pageRecord';
import effect from 'dva-model/effect';


export default Model({
    namespace,
    state: {

    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {

            });
        },
    },
    effects: {
        * getOptionalClassList(action, saga) {
            yield saga.call(effect(getStudentClassList, 'getOptionalClassListSuccess'), action, saga);
        },

        * getTargetClassStudentList(action, saga) {
            yield saga.call(effect(getStudentList, 'getTargetClassStudentListSuccess'), action, saga);
        },
    },

    reducers: {
        /*赋值 state里的值 区分 方便各个组件使用*/
        saveState(state, { payload }) {
            return { ...state, ...payload };
        },

        //查询班级列表
        getStudentClassListSuccess(state, action) {
            return { ...state, studentClassList: action.result.data || [], optionalClassList: action.result.data || [], classLoading: true };
        },

        //查询班级列表
        getOptionalClassListSuccess(state, action) {
            return { ...state, optionalClassList: action.result.data || [] };
        },

        //通过班级ID，查找班级下面的学生
        getStudentListSuccess(state, action) {
            return { ...state, classStudentInfo: action.result, studentLoading: true };
        },

        //通过班级ID，查找班级下面的学生
        getTargetClassStudentListSuccess(state, action) {
            return { ...state, targetClassStudentList: action.result };
        },

        //查询学生分组
        findStudentGroupSuccess(state, action) {
            return { ...state, findStudentGroup: action.result, findStudentGroupLoading: true };
        },
    }
}, {
    getStudentClassList,//查询班级列表
    getStudentList,//通过班级ID，查找班级下面的学生
    saveStudentInfo,//保存/修改一个学生信息
    deleteClassStudentInfo,//从班级中剔除学生,这里只删除学生在班级中的信息
    saveClassInfo,//保存班级信息
    batchImportStudentList,//批量导入学生
    saveStudentTransferInfo,//迁移学生

    /** ********************************************************* 链接卡 start author:张江 date:2021年07月05日 *************************************************************************/
    generationConnectionCard,//开始制作连接卡
    getConnectionCardList,//查询制作的连接卡信息列表
    /** ********************************************************* 链接卡 end author:张江 date:2021年07月08日 *************************************************************************/
    /** ********************************************************* 学生分组 start author:xiongwei date:2021年09月24日 *************************************************************************/
    findStudentGroup,//学生分组查询
    saveStudentsGroup//保存学生分组
    /** ********************************************************* 学生分组 end author:xiongwei date:2021年09月24日 *************************************************************************/
}
)

