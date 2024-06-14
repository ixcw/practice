/**
 *@Author:xiongwei
 *@Description:消息中心
 *@Date:Created in  2022/5/12
 *@Modified By:
 */
import Model from 'dva-model';
import { SchoolNoticeHistory as namespace } from '@/utils/namespace';
import { getLocationObj, dealTimestamp } from '@/utils/utils'
import {
    schoolMessage,//查询学校通知列表
    schoolMessageSave,//新建/修改通知
    checkSchoolMessage,//查看
    uploadPictures,//上传图片
    uploadFile,//上传文件
    sendSchoolMessage,//id发送通知
    deleteMessage,//删除通知
    saveAndPushMessage//兴建并发送通知
} from '@/services/schoolNotice'


export default Model({
    namespace,
    state: {},
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                const { pathname, query } = getLocationObj(location);
                if (pathname === namespace) {
                    // let date = new Date();
                    dispatch({
                        type: 'saveState',
                        payload: {
                            tableLoading:true,
                        },
                    })
                    dispatch({
                        type: 'schoolMessage',
                        payload: {
                            size: query.s || 10,
                            page: query.p || 1,
                        }
                    })
                }
            });
        },
    },
    effects: {},

    reducers: {
        /*赋值 state里的值 区分 方便各个组件使用*/
        saveState(state, { payload }) {
            return { ...state, ...payload };
        },
        //查询学校通知列表
        schoolMessageSuccess(state, action) {
            return { ...state, schoolMessage: action.result, tableLoading: false };
        },
    }
}, {
    schoolMessage,//查询学校通知列表
    schoolMessageSave,//新建/修改通知
    checkSchoolMessage,//查看
    uploadPictures,//上传图片
    uploadFile,//上传文件
    sendSchoolMessage,//id发送通知
    deleteMessage,//删除通知
    saveAndPushMessage//兴建并发送通知
}
)