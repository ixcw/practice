/**
 *@Author:xiongwei
 *@Description:考题参数分析表格
 *@Date:Created in  2021/3/8
 *@Modified By:
 */
import React from 'react'
import { Table, message } from 'antd';
import styles from './SubjectiveTable.less';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import ListModal from './listModal';
import queryString from 'query-string'
import { TopicManage as namespace } from '@/utils/namespace'
import { existArr, uppercaseNum } from "@/utils/utils";
import classNames from 'classnames';
import { connect } from 'dva';
@connect(state => ({
}))
export default class SubjectiveTable extends React.Component {
    constructor(props) {
        super(...arguments);
        this.state = {
            unfoldObjectiveTable: false,//表格是否展开
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
    /**
 * 获取detailRef
 * @param ref
 */
    getDetailRef = (ref) => {
        this.detailRef = ref;
    }
    checkPeople = (record) => {
        const { location, dispatch } = this.props;
        const { search } = location;
        const query = queryString.parse(search);
        if (record.exceptionLoseScore) {
            dispatch({
                type: namespace + "/findExemReportStudentInfoByExcepId",
                payload: {
                    jobId: query.jobId,
                    excepId: 2,//1 正常得分; 2 异常失分 ; 3 异常得分 ; 4 正常失分
                    questionId: record.questionId || '',
                },
                callback: (re) => {
                    if (existArr(re)) {
                        this.detailRef.detailSwitch(true, record)
                    } else {
                        message.warning('0人');
                    }

                }
            })
        } else {
            message.warning('0人');
        }
    }
    render() {
        const { data = [], options = ['A', 'B', 'C', 'D'] } = this.props;
        const { unfoldObjectiveTable } = this.state;
        let column = [
            {
                title: '题号',
                dataIndex: 'serialCode',
                key: 'serialCode',
                align: 'center',
                render: (text) => text == null ? '--' : text
            },
            {
                title: '难度',
                dataIndex: 'difficulty',
                key: 'difficulty',
                align: 'center',
                render: (text) => text == null ? '--' : text
            },
            {
                title: '能力要求',
                dataIndex: 'abilityNeed',
                key: 'abilityNeed',
                align: 'center',
                render: (text) => text == null ? '--' : text
            },
            {
                title: '能力水平',
                dataIndex: 'ability',
                key: 'ability',
                align: 'center',
                render: (text) => text == null ? '--' : text
            },
            {
                title: '知识点',
                dataIndex: 'knowledges',
                key: 'knowledges',
                align: 'center',
                render: (text) => text == null ? '--' : text
            },
            {
                title: '认知层次',
                dataIndex: 'cognName',
                key: 'cognName',
                align: 'center',
                render: (text) => text == null ? '--' : text
            },
            {
                title: '关键能力',
                dataIndex: 'abilityName',
                key: 'abilityName',
                align: 'center',
                render: (text) => text == null ? '--' : text
            },
            {
                title: '正确率',
                dataIndex: 'correctRate',
                key: 'correctRate',
                align: 'center',
                render: (text) => text == null ? '--' : text.toFixed(0) + '%'
            },
            {
                title: '异常正确',
                dataIndex: 'exceptionGetScore',
                key: 'exceptionGetScore',
                align: 'center',
                render: (text) => text == null ? '--' : text + '人'
            },
            {
                title: '异常错误',
                dataIndex: 'exceptionLoseScore',
                key: 'exceptionLoseScore',
                align: 'center',
                render: (text, record) => record.exceptionLoseScore ? <span onClick={() => this.checkPeople(record)} title='查看名单'><a>{text}人</a></span> : text + '人'
            },
        ];
        options.map((item, index) => {
            column.push({
                title: item,
                dataIndex: `${item.toLowerCase()}Rate`,
                key: `${item.toLowerCase()}Rate`,
                align: 'center',
                render: (text, record) => record.answer && record.answer.search(item) != -1 ?
                    (text == null ? '--' : <span style={{ color: '#52C41A' }} title='正确答案'>{(text * 100).toFixed(0)}%</span>)
                    :
                    (text == null ? '--' : <span title='错误答案'>{(text * 100).toFixed(0)}%</span>)
            })
        })
        return (
            <div>
                <div className={classNames(styles['Table'], 'classReport-sprin-open')}>
                    <div style={{ maxHeight: unfoldObjectiveTable ? '20000px' : '608px', overflow: 'hidden' }}>
                        <Table
                            columns={column}
                            dataSource={data}
                            bordered
                            rowKey='questionId'
                            pagination={false}
                        />
                    </div>
                    {
                        data ?
                            <div className={classNames(styles['Table-down'], 'no-print')} >
                                <a onClick={() => { this.setState({ unfoldObjectiveTable: !unfoldObjectiveTable }) }}>{!unfoldObjectiveTable ? <span>展开<DownOutlined /></span> : <span>收起<UpOutlined /></span>}</a>
                            </div>
                            : null
                    }
                </div>
                <ListModal onRef={this.getDetailRef} />
            </div>
        )
    }
}