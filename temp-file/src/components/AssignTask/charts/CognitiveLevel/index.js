/**
 *@Author:xiongwei
 *@Description:认知层次
 *@Date:Created in  2021/3/8
 *@Modified By:
 */
import React from 'react'
import styles from './index.less';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';
import { TopicManage, StudentPersonReport } from '@/utils/namespace'
import CognitiveLevelRadar from '@/components/Charts/CognitiveLevelRadar'//知识层次雷达图
import AcoringAverage from '@/components/Charts/AcoringAverage'//知识层次得分率
import { existArr } from '@/utils/utils'
import { Select } from 'antd';
import classNames from 'classnames';
const { Option } = Select;
export default class CognitiveLevel extends React.Component {
    constructor(props) {
        super(...arguments);
        this.state = {
        }
    }
    /**
* 页面组件即将卸载时：清空数据
*/
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }
    handleChange = (value, model, text) => {
        const { dispatch, location } = this.props;
        const { search, pathname } = location;
        const query = queryString.parse(search);
        console.log(value, model, text)
        //修改地址栏最新的请求参数
        // dispatch(routerRedux.replace({
        //     pathname,
        //     search: queryString.stringify(query),
        // }));
        if (model === 'topicManage') {
            if (text === 'findExemReportCognInfo') {
                dispatch({
                    type: TopicManage + '/saveState',
                    payload: {
                        findExemReportCognInfo: undefined
                    },
                });
                dispatch({
                    type: TopicManage + '/findExemReportCognInfo',
                    payload: {
                        jobId: query.jobId,
                        level: value,
                        studentId: query.id,
                    },
                });
            }
            if (text === 'findExemReporTabilityInfo') {
                dispatch({
                    type: TopicManage + '/saveState',
                    payload: {
                        findExemReporTabilityInfo: undefined
                    },
                });
                dispatch({
                    type: TopicManage + '/findExemReporTabilityInfo',
                    payload: {
                        jobId: query.jobId,
                        level: value,
                        studentId: query.id,
                    },
                });
            }
            if (text === 'findExemReportCompInfo') {
                dispatch({
                    type: TopicManage + '/saveState',
                    payload: {
                        findExemReportCompInfo: undefined
                    },
                });
                dispatch({
                    type: TopicManage + '/findExemReportCompInfo',
                    payload: {
                        jobId: query.jobId,
                        level: value,
                        studentId: query.id,
                    },
                });
            }
        }
        if (model === 'studentPersonReport') {
            if (text === 'findStudentKeyAbility') {
                dispatch({
                    type: StudentPersonReport + '/saveState',
                    payload: {
                        findStudentKeyAbility: undefined
                    },
                });
                dispatch({
                    type: StudentPersonReport + '/findStudentKeyAbility',
                    payload: {
                        jobId: query.jobId,
                        level: value,
                        studentId: query.id,
                    },
                });
            }
            if (text === 'findStudentKeyCompetencies') {
                dispatch({
                    type: StudentPersonReport + '/saveState',
                    payload: {
                        findStudentKeyCompetencies: undefined
                    },
                });
                dispatch({
                    type: StudentPersonReport + '/findStudentKeyCompetencies',
                    payload: {
                        jobId: query.jobId,
                        level: value,
                        studentId: query.id,
                    },
                });
            }
            if (text === 'findStudentCognitionLevel') {
                dispatch({
                    type: StudentPersonReport + '/saveState',
                    payload: {
                        findStudentCognitionLevel: undefined
                    },
                });
                dispatch({
                    type: StudentPersonReport + '/findStudentCognitionLevel',
                    payload: {
                        jobId: query.jobId,
                        level: value,
                        studentId: query.id,
                    },
                });
            }
        }

    }
    render() {
        const { findExemReportCognInfo = [], findExemReportCognInfoOne = [], model, text = '', id, loading, name } = this.props;
        let xData = findExemReportCognInfo.map(({ name }) => { return { name: name, max: 100 } });
        let yDatai = findExemReportCognInfo.map(({ scoreRate }) => scoreRate);
        let xDatai = findExemReportCognInfo.map(({ name }) => name);
        let yData = findExemReportCognInfo.map(({ classScoreRate }) => classScoreRate);
        let xDataOne = findExemReportCognInfoOne.map(({ name }) => { return { name: name, max: 100 } });
        let yDataOne =findExemReportCognInfoOne[0].scoreRate!=undefined ? findExemReportCognInfoOne.map(({ scoreRate }) => scoreRate) : findExemReportCognInfoOne.map(({ classScoreRate }) => classScoreRate);
        return (
            <div className={styles['CognitiveLevelmain']}>
                {/* <div></div> */}
                {
                    name != '核心素养' ? <div className={classNames(styles['Select'], 'no-print')}>
                        <Select defaultValue="1" style={{ width: 120 }} onChange={(value) => { this.handleChange(value, model, text) }}>
                            <Option value="1">第一级</Option>
                            <Option value="2">第二级</Option>
                            <Option value="3">第三级</Option>
                        </Select>
                    </div> : ''
                }
                <div className={styles['CognitiveLevel']}>
                    <div className={styles['CognitiveLevelone']}>
                        {
                            (existArr(yDataOne) && existArr(xDataOne)) ? <CognitiveLevelRadar xData={xDataOne} yData={yDataOne} id={id} name={name} /> :
                                <div>暂无数据</div>
                        }
                    </div>
                    <div className={styles['CognitiveLeveltwo']}>
                        {
                            (existArr(xDatai) && existArr(yData)) ? <AcoringAverage xData={xDatai} yData={yData} yDatai={yDatai} id={id + 'e'} name={name} /> :
                                <div>暂无数据</div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}