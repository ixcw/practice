/**
 * 微课列表models
 * @author:熊伟
 * @date:2020年08月21日
 * @version:v1.0.0
 * */

import Model from 'dva-model';
import { routerRedux } from 'dva/router';
import { notification } from 'antd';
import queryString from 'query-string';
import { SmallClassList as namespace } from '@/utils/namespace';
import {
    findRelatedCourse,//------热门微课 非单题微课
    getSubjectList,//获取科目(根据当前班级获取科目)
} from '@/services/smallClassList'
import effect from 'dva-model/effect';
import userInfoCache from '@/caches/userInfo';

export default Model({
    namespace,
    state: {

    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                const { pathname, search } = location;
                const query = queryString.parse(search);
                const userInfo =userInfoCache()
                if (pathname === '/smallClassList') {
                    //微课
                    if(userInfo.code=="TEACHER"){
                        dispatch({
                            type: 'findRelatedCourse',
                            payload: {
                                subjectId:userInfo.subjectId,
                                page: query.p || 1,
                                size: query.s || 8,
                            }
                        })
                    }else{
                        dispatch({
                            type: 'findRelatedCourse',
                            payload: {
                                subjectId:query.subjectId>0?query.subjectId:null,
                                page: query.p || 1,
                                size: query.s || 8,
                            }
                        })
                    }
                    
                    
                }

            });
        },
    },
    effects: {

    },

    reducers: {

        // 获取热门微课---非题目微课
        findRelatedCourseSuccess(state, action) {
            //   const { total = 0, data = [] } = action.result
            return { ...state, findRelatedCourseList: action.result, loading: false };
        },
        // 获取热门微课---非题目微课
        getSubjectListSuccess(state, action) {
            //   const { total = 0, data = [] } = action.result
            return { ...state, getSubjectList: action.result, loading: false };
        },

    }
}, {
    findRelatedCourse,//------热门微课 非单题微课
    getSubjectList,//获取科目(根据当前班级获取科目)
}
)