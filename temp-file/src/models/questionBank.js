/**
 * 题库管理models
 * @author:张江
 * @date:2019年11月21日
 * @version:v1.0.0
 * */

import Model from 'dva-model';
import { routerRedux } from 'dva/router';
import { QuestionBank as namespace } from '@/utils/namespace';
import {
    getWorkList,//查询导题任务
    getGradeList,// 获取年级信息
    getSubjectList,// 获取科目信息
    getHighestKnowledge,// 查询最高级知识点
    getCategoryList,// 获取题型信息
    getQuestionListByWork,//根据任务查询该任务下的题目信息
    fixedEdition,// 定版
    updateWorkParam, // 修改导入任务参数
    importQuestionBank,// 导入word 解析题目信息
    getKnowledgeDetailsByPid,// 根据大知识点id查询旗下知识点信息
    updateQuestionKnowle,// 修改题目知识点属性
    updateQuestionDifficulty,// 修改题目难度
    completeJob,// 完成任务
    updateQuestionInfo,// 修改题目信息
    /** ********************************************************* 题库管理审核 start author:张江 date:2019年12月17日 *************************************************************************/
    getQuestionErrorMessage,//获取题目错误类信息
    addErrorQuestion,//驳回 ：添加错误试题信息
    getErrorQuestion,// 查询驳回错题信息
    updateErrorQuestionStatus,// 确认驳回错题信息 修改完毕
    cancelQuestionErro,//取消驳回
    passQuestion,//标记通过
    noPassQuestion,// 再次驳回
    /** ********************************************************* 题库管理审核 END author:张江 date:2019年12月18日 *************************************************************************/
    updateQuestionImg,//修改题目的图片信息

    /** ********************************************************* 版本题库管理 start author:张江 date:2020年08月11日 *************************************************************************/
    getTextbookVersion,//获取版本信息
    getVersionKnowledgePoints,//获取版本知识点信息
    /** ********************************************************* 版本题库管理 end author:张江 date:2020年08月11日 *************************************************************************/


    /** ********************************************************* 题库管理 核心素养 关键能力 认知层次 start author:张江 date:2020年09月05日 *************************************************************************/
    getQuestionAbilityList,//根据科目筛选关键能力
    getQuestionCompetenceList,//根据科目筛选核心素养
    getCognitionLevelList,//根据科目筛选认知层次
    /** ********************************************************* 题库管理 核心素养 关键能力 认知层次 end author:张江 date:2020年09月05日 *************************************************************************/

    /** ********************************************************* 题库-修改题目图片 start author:张江 date:2020年11月11日 *************************************************************************/

    getQuestionAllInfoById,//修改题目信息前查询题目信息
    updateQuestionAllImgById,//根据id修改题目图片，包括（题材、题干、选项/小题、答案、解析）
    uploadQuestionImg,//修改题目的图片信息（上传或者更新）
    deleteQiNiuImgByFileName,//根据文件名称删除七牛云服务器文件
    /** ********************************************************* 题库-修改题目图片 end author:张江 date:2020年11月11日 *************************************************************************/

    /** ********************************************************* 数据入库-修改分数 start author:张江 date:2021年05月07日 *************************************************************************/
    updateQuestionScore,//修改题目分数
    /** ********************************************************* 数据入库-修改分数 end author:张江 date:2021年05月07日 *************************************************************************/

    /** ********************************************************* 题库管理 知识维度查询 start author:张江 date:2022年05月20日 *************************************************************************/
    getKnowledgeDimension,//知识维度查询
   /** ********************************************************* 题库管理 知识维度查询 end author:张江 date:2022年05月20日 *************************************************************************/

} from '@/services/questionBank'
import queryString from 'query-string';
import pageRecord from '@/caches/pageRecord';
import singleTaskInfoCache from '@/caches/singleTaskInfo';
import effect from 'dva-model/effect';
import gradeListCache from '@/caches/gradeList';


export default Model({
    namespace,
    state: {

    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                const { pathname, search } = location;
                const query = queryString.parse(search);
                if (!pathname.includes('/question')) {
                    pageRecord.clear();
                }
                //查询导题任务列表
                let isVersion = pathname === '/version-question-list';
                if (pathname === '/question-task-list' || isVersion) {
                    const jqueryKnow = isVersion && query.knowId ? JSON.parse(query.knowId) : query.knowId;
                    const knowId = jqueryKnow && Array.isArray(jqueryKnow) ? jqueryKnow[jqueryKnow.length - 1] : query.knowId
                    // && query.subjectId
                    if (query && query.p) {
                        dispatch({
                            type: 'saveState',
                            payload: { taskLoading: false, }
                        });
                        dispatch({
                            type: 'getWorkList',
                            payload: {
                                // subjectId: query.subjectId,
                                // knowId: knowId,
                                jobName: query.jobName,
                                accoutName: query.accoutName,//账号/姓名
                                statusIds: !query.statusIds || query.statusIds == 0 ? '1,2,3,4,5,6' : query.statusIds,//状态筛选
                                // gradeId: query.gradeId || '',
                                page: query.p || 1,
                                size: query.s || 10,
                                importType: query.questionBankType||1,
                                // startDate: query.f,
                                // endDate: query.t,
                                // type: isVersion ? 4 : ''
                            }
                        });
                    }
                }

                const wordOption = singleTaskInfoCache()||{};
                // 查询题目列表
                if (query && ((pathname === '/question-list' && wordOption.isSee != 2) || (pathname === '/question-audit-list' && wordOption.isSee == 3))) {
                    if (query.jobId) {
                        dispatch({
                            type: 'saveState',
                            payload: { questionLoading: false, }
                        });
                        dispatch({
                            type: 'getQuestionListByWork',
                            payload: {
                                jobId: query.jobId,
                                page: query.p || 1,
                                size: query.s || 10,
                                queryType: query.queryType || 5
                            }
                        });
                    }
                } else if (query && (pathname === '/question-list' && wordOption.isSee == 2) || (pathname === '/question-audit-list' && wordOption.isSee == 4)) {
                    if (query.jobId) {
                        dispatch({
                            type: 'saveState',
                            payload: { questionLoading: false, }
                        });
                        dispatch({
                            type: 'getErrorQuestion',
                            payload: {
                                jobId: query.jobId,
                            }
                        });
                    }
                }
            });
        },
    },
    effects: {
        * getSubjectListAdd(action, saga) {
            yield saga.call(effect(getSubjectList, 'getSubjectListAddSuccess'), action, saga);
        },
        * getHighestKnowledgeAdd(action, saga) {
            yield saga.call(effect(getHighestKnowledge, 'getHighestKnowledgeAddSuccess'), action, saga);
        },
        * getTextbookVersionAdd(action, saga) {
            yield saga.call(effect(getTextbookVersion, 'getTextbookVersionAddSuccess'), action, saga);
        },
        * getVersionKnowledgePointsAdd(action, saga) {
            yield saga.call(effect(getVersionKnowledgePoints, 'getVersionKnowledgePointsAddSuccess'), action, saga);
        },

        // 获取年级列表
        *getGradeList(action, saga) {
            yield saga.call(effect(getGradeList, 'getGradeListSuccess', gradeListCache), action, saga);
        },
    },

    reducers: {
        /*赋值 state里的值 区分 方便各个组件使用*/
        saveState(state, { payload }) {
            return { ...state, ...payload };
        },

        //查询导题任务列表
        getWorkListSuccess(state, action) {
            return { ...state, taskList: action.result, taskLoading: true };
        },

        //获取年级信息列表
        getGradeListSuccess(state, action) {
            return { ...state, gradeList: action.result, loading: false };
        },

        //获取科目信息列表
        getSubjectListSuccess(state, action) {
            return { ...state, subjectList: action.result, loading: false };
        },

        //查询最高级知识点列表
        getHighestKnowledgeSuccess(state, action) {
            return { ...state, highestKnowledgeList: action.result, loading: false };
        },

        //获取科目信息列表
        getSubjectListAddSuccess(state, action) {
            return { ...state, subjectAddList: action.result, loading: false };
        },

        //查询最高级知识点列表
        getHighestKnowledgeAddSuccess(state, action) {
            return { ...state, highestKnowledgeAddList: action.result, loading: false };
        },

        // 获取题型信息列表
        getCategoryListSuccess(state, action) {
            return { ...state, categoryList: action.result, loading: false };
        },

        // 根据任务查询该任务下的题目信息列表
        getQuestionListByWorkSuccess(state, action) {
            return { ...state, questionList: action.result, questionLoading: true };
        },

        // 根据大知识点id查询旗下知识点信息列表
        getKnowledgeDetailsByPidSuccess(state, action) {
            return { ...state, knowledgeList: action.result, loading: false };
        },

        // 修改题目知识点属性
        updateQuestionKnowleSuccess(state, action) {
            return { ...state, saveLoading: false };
        },

        // 修改题目难度
        updateQuestionDifficultySuccess(state, action) {
            return { ...state, saveLoading: false };
        },

        // 修改题目信息
        updateQuestionInfoSuccess(state, action) {
            return { ...state, saveLoading: false };
        },
        /** ********************************************************* 题库管理审核 start author:张江 date:2019年12月17日 *************************************************************************/

        // 获取题目错误类信息
        getQuestionErrorMessageSuccess(state, action) {
            return { ...state, QEMessageList: action.result, loading: false };
        },

        // 查询驳回错题信息
        getErrorQuestionSuccess(state, action) {
            return { ...state, questionList: action.result, questionLoading: true };
        },


        /** ********************************************************* 题库管理审核 END author:张江 date:2019年12月17日 *************************************************************************/

        /** ********************************************************* 版本题库管理 start author:张江 date:2020年08月11日 *************************************************************************/
        //获取版本信息
        getTextbookVersionSuccess(state, action) {
            return { ...state, bookVersionList: action.result, loading: false, isSubjectChange: false };
        },

        // 获取版本知识点信息
        getVersionKnowledgePointsSuccess(state, action) {
            return { ...state, versionKnowledgePointsList: action.result, loading: false };
        },

        //获取版本信息
        getTextbookVersionAddSuccess(state, action) {
            return { ...state, addBookVersionList: action.result, loading: false, isSubjectChange: false };
        },

        // 获取版本知识点信息
        getVersionKnowledgePointsAddSuccess(state, action) {
            return { ...state, addVersionKnowledgePointsList: action.result, loading: false, isKnowledgeChange: false };
        },
        /** ********************************************************* 版本题库管理 end author:张江 date:2020年08月11日 *************************************************************************/

        /** ********************************************************* 题库管理 核心素养 关键能力 认知层次 start author:张江 date:2020年09月05日 *************************************************************************/
        //根据科目筛选关键能力
        getQuestionAbilityListSuccess(state, action) {
            return { ...state, keyAbilityList: action.result, loading: false };
        },
        //根据科目筛选核心素养
        getQuestionCompetenceListSuccess(state, action) {
            return { ...state, coreLiteracyList: action.result, loading: false };
        },
        //根据科目筛选认知层次
        getCognitionLevelListSuccess(state, action) {
            return { ...state, cognitiveLevelList: action.result, loading: false };
        },
        /** ********************************************************* 题库管理 核心素养 关键能力 认知层次 end author:张江 date:2020年09月05日 *************************************************************************/

        /** ********************************************************* 题库-修改题目图片 start author:张江 date:2020年11月10日 *************************************************************************/
        //修改题目的图片信息（上传或者更新）
        uploadQuestionImgSuccess(state, action) {
            return { ...state, imgIdUrl: action.result, loading: false };
        },
        /** ********************************************************* 题库-修改题目图片 end author:张江 date:2020年11月10日 *************************************************************************/

        /** ********************************************************* 数据入库-修改分数 start author:张江 date:2021年05月07日 *************************************************************************/
        // 修改题目分数
        updateQuestionScoreSuccess(state, action) {
            return { ...state, saveLoading: false };
        },
        /** ********************************************************* 数据入库-修改分数 end author:张江 date:2021年05月07日 *************************************************************************/
        
        /** ********************************************************* 题库管理 知识维度查询 start author:张江 date:2022年05月20日 *************************************************************************/
        //知识维度查询
        getKnowledgeDimensionSuccess(state, action) {
            return { ...state, knowledgeDimensionList: action.result, loading: false };
        },
       /** ********************************************************* 题库管理 知识维度查询 end author:张江 date:2022年05月20日 *************************************************************************/

    }
}, {
    getWorkList,//查询导题任务
    // getGradeList,// 获取年级信息
    getSubjectList,// 获取科目信息
    getHighestKnowledge,// 查询最高级知识点
    getCategoryList,// 获取题型信息
    getQuestionListByWork,//根据任务查询该任务下的题目信息
    fixedEdition,// 定版
    updateWorkParam, // 修改导入任务参数
    importQuestionBank,// 导入word 解析题目信息
    getKnowledgeDetailsByPid,// 根据大知识点id查询旗下知识点信息
    updateQuestionKnowle,// 修改题目知识点属性
    updateQuestionDifficulty,// 修改题目难度
    completeJob,// 完成任务
    updateQuestionInfo,// 修改题目信息
    /** ********************************************************* 题库管理审核 start author:张江 date:2019年12月17日 *************************************************************************/
    getQuestionErrorMessage,//获取题目错误类信息
    addErrorQuestion,//驳回 ：添加错误试题信息
    getErrorQuestion,// 查询驳回错题信息
    updateErrorQuestionStatus,// 确认驳回错题信息 修改完毕
    cancelQuestionErro,//取消驳回
    passQuestion,//标记通过
    noPassQuestion,// 再次驳回
    /** ********************************************************* 题库管理审核 END author:张江 date:2019年12月18日 *************************************************************************/
    updateQuestionImg,//修改题目的图片信息
    /** ********************************************************* 版本题库管理 start author:张江 date:2020年08月11日 *************************************************************************/
    getTextbookVersion,//获取版本信息
    getVersionKnowledgePoints,//获取版本知识点信息
    /** ********************************************************* 版本题库管理 end author:张江 date:2020年08月11日 *************************************************************************/

    /** ********************************************************* 题库管理 核心素养 关键能力 认知层次 start author:张江 date:2020年09月05日 *************************************************************************/
    getQuestionAbilityList,//根据科目筛选关键能力
    getQuestionCompetenceList,//根据科目筛选核心素养
    getCognitionLevelList,//根据科目筛选认知层次
    /** ********************************************************* 题库管理 核心素养 关键能力 认知层次 end author:张江 date:2020年09月05日 *************************************************************************/
    /** ********************************************************* 题库-修改题目图片 start author:张江 date:2020年11月11日 *************************************************************************/

    getQuestionAllInfoById,//修改题目信息前查询题目信息
    updateQuestionAllImgById,//根据id修改题目图片，包括（题材、题干、选项/小题、答案、解析）
    uploadQuestionImg,//修改题目的图片信息（上传或者更新）
    deleteQiNiuImgByFileName,//根据文件名称删除七牛云服务器文件
    /** ********************************************************* 题库-修改题目图片 end author:张江 date:2020年11月11日 *************************************************************************/
    /** ********************************************************* 数据入库-修改分数 start author:张江 date:2021年05月07日 *************************************************************************/
    updateQuestionScore,//修改题目分数
    /** ********************************************************* 数据入库-修改分数 end author:张江 date:2021年05月07日 *************************************************************************/
    
    /** ********************************************************* 题库管理 知识维度查询 start author:张江 date:2022年05月20日 *************************************************************************/
    getKnowledgeDimension,//知识维度查询
   /** ********************************************************* 题库管理 知识维度查询 end author:张江 date:2022年05月20日 *************************************************************************/

}
)

