/**
 *@Author:xiongwei
 *@Description:考题参数分析表格
 *@Date:Created in  2021/3/8
 *@Modified By:
 */
import React from 'react'
import { Table } from 'antd';
import styles from './index.less';
import ObjectiveTable from './ObjectiveTable';
import SubjectiveTable from './SubjectiveTable';
import classNames from 'classnames';
export default class ParameterAnalysisTable extends React.Component {
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
    render() {
        const { findExemQuestionDataAnalysis = [],location } = this.props;
        return (
            <div>
                <div>
                    {
                        findExemQuestionDataAnalysis && findExemQuestionDataAnalysis.map(({ objective, data, bigCategoryName }, index) => {
                            return <div key={index}>
                                <div className={classNames(styles['Table-title'])}>{bigCategoryName}</div>
                                {data && data.map(({ isObject, quesAnalysisDetailVoList, options }, index) => {
                                    if (isObject === 0) {
                                        return <SubjectiveTable data={quesAnalysisDetailVoList} options={options} key={index} location={location}/>
                                    }
                                    if (isObject === 1) {
                                        return <ObjectiveTable data={quesAnalysisDetailVoList} key={index}  location={location}/>
                                    }
                                })}
                            </div>
                        })
                    }
                </div>
            </div>
        )
    }
}