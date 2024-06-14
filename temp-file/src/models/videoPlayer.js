/**
 *@Author:xiongwei
 *@Description:
 *@Date:Created in  2020/9/15
 *@Modified By:
 */
import Model from 'dva-model';
import { VideoPlayer as namespace, PayCenter } from '@/utils/namespace';
import { queryParamIsChange } from '@/utils/utils'
import queryString from 'query-string';
import {
    findQuestionVideoById,//获取单个视频详细信息
    findQuestionVideoByQuestionId,//根据视频id获取题目id查询相关视频
    findVideoById,// 根据视频Id查看视频信息(包含题目微课及课程微课)
    findRelatedCourseById,//根据视频id获取题目id查询相关视频---课程微课
    updateVideoNumById,//获取视频播放量
} from '@/services/videoPlayer'
import userInfoCache from "@/caches/userInfo";
let lastQuery = undefined;
export default Model({
    namespace,
    state: {
        Videoloading: false,
        Videolistloading: false,
    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                const { pathname, search } = location;
                const query = queryString.parse(search);
                const userInfo = userInfoCache();
                const studyId = userInfo ? userInfo.studyId : null;
                if (pathname === '/video') {
                    //获取商品信息
                    // dispatch({
                    //     type: PayCenter + '/getGoodsList',
                    //     payload: {
                    //         studyId: studyId,
                    //         goodsType: 3,
                    //     }
                    // })
                    //获取视频数据
                    if (query.videoId) {
                        // if (queryParamIsChange(lastQuery, query, ['videoId'], ['videoId'])) {console.log(1111111111)
                        dispatch({
                            type: 'saveState',
                            payload: {
                                Videoloading: true
                            },
                        })
                        // dispatch({
                        //     type: 'updateVideoNumById',
                        //     payload: {
                        //         videoId: query.videoId,
                        //         videoType: query.videoType,
                        //     },
                        // })
                        
                        if (query.videoType == 2) {
                            dispatch({
                                type: 'findVideoById',
                                payload: {
                                    videoId: query.videoId,
                                    videoType: query.videoType,
                                }
                            })
                        } else {
                            dispatch({
                                type: 'findQuestionVideoById',
                                payload: {
                                    videoId: query.videoId,
                                    // videoType: query.videoType||1,
                                }
                            })
                        }
                        // }

                        if (queryParamIsChange(lastQuery, query, ['s'], ['s'])) {
                            dispatch({
                                type: 'saveState',
                                payload: {
                                    Videolistloading: true
                                },
                            })
                            if (query.videoType == 2) {
                                dispatch({
                                    type: 'findRelatedCourseById',
                                    payload: {
                                        videoId: query.videoId,
                                        page: query.p || 1,
                                        size: query.s || 6,
                                    },
                                })
                            } else {
                                dispatch({
                                    type: 'findQuestionVideoByQuestionId',
                                    payload: {
                                        videoId: query.videoId,
                                        page: query.p || 1,
                                        size: query.s || 6,
                                    },
                                })
                            }


                        }
                    }
                    lastQuery = query
                }
            })
        }
    },
    // effects: {
    //     * getOptionalClassList(action, saga) {
    //         yield saga.call(effect(getStudentClassList, 'getOptionalClassListSuccess'), action, saga);
    //     },
    // },
    reducers: {
        /*赋值 state里的值 区分 方便各个组件使用*/
        saveState(state, { payload }) {
            return { ...state, ...payload };
        },
        findQuestionVideoByIdSuccess(state, action) {
            return { ...state, videoParticulars: action.result, loading: false, Videoloading: false };
        },
        findQuestionVideoByQuestionIdSuccess(state, action) {
            return { ...state, videoList: action.result, loading: false, Videolistloading: false };
        },
        findRelatedCourseByIdSuccess(state, action) {
            return { ...state, videoList: action.result, loading: false, Videolistloading: false };
        },
        findVideoByIdSuccess(state, action) {
            return { ...state, videoParticulars: action.result, loading: false, Videoloading: false };
        },
    }
}, {
    findQuestionVideoById,//获取单个视频详细信息
    findQuestionVideoByQuestionId,//根据视频id获取题目id查询相关视频
    findVideoById,// 根据视频Id查看视频信息(包含题目微课及课程微课)
    findRelatedCourseById,//根据视频id获取题目id查询相关视频---课程微课
    updateVideoNumById,//获取视频播放量
}
)