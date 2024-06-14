/**
* 学习任务组件
* @author:张江
* @date:2020年08月20日
* @version:v1.0.0
* */

// eslint-disable-next-line
import React from 'react';
import PropTypes from 'prop-types';
// import {
//     Carousel,
//     Tree,
//     Pagination,
//     Button
// } from 'antd';
import { connect } from "dva";
// import { routerRedux } from 'dva/router';
// import queryString from 'query-string';
import { pushNewPage, dealTimestamp } from "@/utils/utils";
import styles from './LearningTask.less';
import ModuleTitle from "@/components/ModuleTitle/ModuleTitle";
import { HomeIndex as namespace, Public } from '@/utils/namespace';


// const IconFont = getIcon();

@connect(state => ({

    learningTasksList: state[namespace].learningTasksList,//学习任务列表
    loading: state[namespace].loading,//加载中
}))

export default class LearningTask extends React.Component {
    constructor(props) {
        super(...arguments);
        this.state = {

        };
    };

    static propTypes = {
        singleItem: PropTypes.any,//数据
    };

    // UNSAFE_componentWillMount() {}

    componentDidMount() {
        this.getLearningTasksList();
    }

    /**
* 学生任务列表
*/
    getLearningTasksList() {
        const { dispatch } = this.props;
        dispatch({
            type: namespace + '/getLearningTasksList',
            // payload: {
            //     queryType: 2,
            // },
        });
    }

    render() {
        const {
            location,
            learningTasksList = [],
            dispatch
        } = this.props;

        if (learningTasksList && learningTasksList.length > 0) {//没有最新报告时 则不展示
            return (
                <div className={styles['learning-task']}>
                    <ModuleTitle title={'学习任务(10)'} seeMoreUrl={'/looking-forward'} />
                    <div className={styles['task-list']}>
                        {
                            learningTasksList.map(item => {
                                return (
                                    <div key={item.id} className={styles['task-item']} onClick={() => pushNewPage({ id: item.id }, '/home', dispatch)}>
                                        <div className={styles['subject-status']}>
                                            <h3>{item.subjectName || '暂无'}</h3>
                                            <span>{item.isComplete == 1 ? '已完成' : '待完成'}</span>
                                        </div>
                                        <div className={styles['task-info']}>
                                            <div>
                                                名称：<span>{item.paperName || '暂无'}</span>
                                            </div>
                                            <div>
                                                截止时间：{dealTimestamp(item.endTime, 'YYYY-MM-DD HH:mm')}
                                            </div>
                                        </div>

                                        <div className={styles['subject-tag']}>{item.subjectName}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            );
        } else {
            return (null);
        }
    }
}

