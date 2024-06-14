/**
* 学生任务组件
* @author:张江
* @date:2020年08月20日
* @version:v1.0.0
* */

// eslint-disable-next-line
import React from 'react';
import PropTypes from 'prop-types';
import {
    Table,
    Space
} from 'antd';
import { connect } from "dva";
// import { routerRedux } from 'dva/router';
// import queryString from 'query-string';
import { pushNewPage } from "@/utils/utils";
import styles from './StudentsTask.less';
import ModuleTitle from "@/components/ModuleTitle/ModuleTitle";
import { HomeIndex as namespace, Public } from '@/utils/namespace';

// const IconFont = getIcon();

@connect(state => ({

    learningTasksList: state[namespace].learningTasksList,//学生学习列表
    loading: state[namespace].loading,//加载中
}))
export default class StudentsTask extends React.Component {
    constructor(props) {
        super(...arguments);
        this.state = {

        };
    };

    static propTypes = {
        singleItem: PropTypes.any,//数据
    };

    UNSAFE_componentWillMount() {

    }

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
            dispatch,
            learningTasksList = []
        } = this.props;
        const columns = [
            {
                title: '分类',
                dataIndex: 'name',
                key: 'name',
                width: '60px',
                render: text => <span style={text == '作业' ? { color: '#29CB97' } : text == '测验' ? { color: '#F65860' } : { color: '#4072EE' }}>{text}</span>,
            },
            {
                title: '名称',
                dataIndex: 'paperName',
                key: 'paperName',
                width: '25%'
            },
            {
                title: '科目',
                dataIndex: 'subjectName',
                key: 'subjectName',
                width: '60px',
            },
            {
                title: '布置/批阅时间',
                dataIndex: 'address',
                key: 'address2',
            },
            {
                title: '进度',
                dataIndex: 'address',
                key: 'address1',
            },

            {
                title: '操作',
                key: 'action',
                width: '420px',
                render: (text, record) => {
                    if (record.key == 3) {
                        return (<Space size="middle">
                            <a className='button-a' onClick={() => pushNewPage({ id: record.key }, '/home', dispatch)}>个人报告</a>
                            <a className='button-a' onClick={() => pushNewPage({ id: record.key }, '/home', dispatch)}> 班级报告</a>
                            <a className='button-a' onClick={() => pushNewPage({ id: record.key }, '/home', dispatch)}>查看详情</a>
                        </Space>)
                    } else if (record.key == 2) {
                        return (<Space size="middle">
                            <a className='button-a' onClick={() => pushNewPage({ id: record.key }, '/home', dispatch)}> 检查作业</a>
                        </Space>)
                    } else {
                        return (<Space size="middle">
                            <a className='button-a' onClick={() => pushNewPage({ id: record.key }, '/home', dispatch)}>查看详情</a>
                        </Space>)
                    }

                }
                ,
            },
        ];

        if (learningTasksList && learningTasksList.length > 0) {//没有学生任务时 则不展示
            return (
                <div className={styles['students-task']}>
                    <ModuleTitle title={'学生任务(10)'} seeMoreUrl={'/looking-forward'} />
                    <div className={styles['task-list']}>
                        <Table columns={columns} dataSource={learningTasksList} pagination={false} />
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }

}

