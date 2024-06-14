/**
* 最新报告
* @author:张江
* @date:2020年08月20日
* @version:v1.0.0
* */

// eslint-disable-next-line
import React from 'react';
// import PropTypes from 'prop-types';
import {
    Button
} from 'antd';
import { connect } from "dva";
// import { routerRedux } from 'dva/router';
// import queryString from 'query-string';
import { pushNewPage, dealTimestamp } from "@/utils/utils";
import styles from './NewReport.less';
import ModuleTitle from "@/components/ModuleTitle/ModuleTitle";
import { HomeIndex as namespace } from '@/utils/namespace';
import userInfoCache from '@/caches/userInfo';

// const IconFont = getIcon();

@connect(state => ({

    newReportList: state[namespace].newReportList,//最新报告列表
    loading: state[namespace].loading,//加载中
}))
export default class NewReport extends React.Component {
    constructor(props) {
        super(...arguments);
        this.state = {

        };
    };

    // UNSAFE_componentWillMount() {}

    componentDidMount() {
        this.getClassNewReportList();
    }

    /**
* 最新报告列表
*/
    getClassNewReportList() {
        const { dispatch } = this.props;
        const loginUserInfo = userInfoCache() || {};//登录用户信息
        if (loginUserInfo.classId) {
            dispatch({
                type: namespace + '/getClassNewReportList',
                payload: {
                    classId: loginUserInfo.classId,
                },
            });
        }
    }

    render() {
        const {
            location,
            dispatch,
            newReportList = []
        } = this.props;
        if (newReportList && newReportList.length > 0) {//没有最新报告时 则不展示
            return (
                <div className={styles['new-report']}>
                    <ModuleTitle title={'最新报告'} seeMoreUrl={'/teacherReport'} />
                    <div className={styles['report-list']}>

                        {
                            newReportList.map(item => {
                                return (
                                    <div key={item.jobId} className={styles['report-item']}>
                                        <div className={styles['left']}>
                                            <span>{item.avgScore ? (String(item.avgScore).includes('.') ? item.avgScore.toFixed(2) : item.avgScore) : 0}</span>
                                            <label>平均分</label>
                                        </div>
                                        <div className={styles['right']}>
                                            <p className={styles['title']}>{item.name || '暂无标题'}</p>
                                            <div className={styles['time-oper']}>
                                                <span>
                                                    报告生成时间：{dealTimestamp(item.createTime, 'YYYY-MM-DD HH:mm')}
                                                </span>
                                                <div className={styles['oper-box']}>
                                                    {/* <Button type="primary" onClick={() => { }}>下载报告</Button> */}
                                                    <Button type="primary" onClick={() => pushNewPage({}, '/teacherReport', dispatch)}>学生报告</Button>
                                                    <Button type="primary" onClick={() => pushNewPage({ jobId: item.jobId, paperId: item.paperId, }, '/testReport', dispatch)}>班级报告</Button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                )
                            })
                        }

                    </div>
                </div>

            );
        } else {
            return null
        }
    }
}

