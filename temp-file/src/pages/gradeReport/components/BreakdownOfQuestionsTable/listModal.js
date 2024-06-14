/**
 *@Author:xiongwei
 *@Description:
 *@Date:Created in  2021/4/13
 *@Modified By:
 */
import React from 'react';
import styles from './listModal.less'
import { Modal, Button, Table, Tooltip } from 'antd'
import { existArr, uppercaseNum } from "@/utils/utils";
import { GradeReport as namespace } from '@/utils/namespace'
import { connect } from 'dva'
@connect(state => ({
    findGradeReportExamClassDetailByQuestionLoading: state[namespace].findGradeReportExamClassDetailByQuestionLoading,
    GradeReportExamClassDetailByQuestionList: state[namespace].findGradeReportExamClassDetailByQuestion,
}))
export default class DetailsModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,//modal开关状态
            record: undefined
        };
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    /**
     * modal开关
     * @param status
     */
    detailSwitch = (status, record) => {
        this.setState({ visible: status, record })
        if (!status) {
            this.props.dispatch({
                type: namespace + '/saveState',
                payload: {
                    findGradeReportExamClassDetailByQuestion: [],
                }
            })
        }
    }


    render() {
        const { visible, record = {} } = this.state;
        const { GradeReportExamClassDetailByQuestionList = [], findGradeReportExamClassDetailByQuestionLoading } = this.props
        // const ExemReportStudentInfoByExcepId = existArr(findExemReportStudentInfoByExcepId) || [];
        /*Tooltip
        type:1,可提分学生名单 2,异常错误学生名单
        index：索引
        */
        const ReactNode = (type, index) => {
            if (type == 1) {
                return (
                    <div key={index}>
                        <p>可提分学生名单({GradeReportExamClassDetailByQuestionList[index].upSpaceScore}人)</p>
                        {
                            GradeReportExamClassDetailByQuestionList[index].upSpaceScoreNames != ' ' ?
                                <div className={styles['Tooltip-content']}>
                                    {GradeReportExamClassDetailByQuestionList[index].upSpaceScoreNames.split(',').map((item, index) => {
                                        return <p key={index}>{index + 1}--{item}</p>
                                    })}
                                </div>
                                :
                                ''
                        }
                    </div>
                )
            }
            if (type == 0) {
                return (
                    <div key={index}>
                        <p>异常错误学生名单({GradeReportExamClassDetailByQuestionList[index].countExceptErrorNum}人)</p>
                        {
                            GradeReportExamClassDetailByQuestionList[index].excepErrorName != ' ' ?
                                <div className={styles['Tooltip-content']}>
                                    {GradeReportExamClassDetailByQuestionList[index].excepErrorName.split(',').map((item, index) => {
                                        return <p key={index}>{index + 1}--{item}</p>
                                    })}
                                </div>
                                :
                                ''
                        }
                    </div>
                )
            }
        }
        const column = [
            {
                title: '班级',
                dataIndex: 'className',
                key: 'className',
                align: 'center',
                render: (text) => text == null ? '--' : text
            },
            {
                title: '得分率',
                dataIndex: 'scoreRate',
                key: 'scoreRate',
                align: 'center',
                render: (text) => text == null ? '--' : text + '%'
            },
            {
                title: '异常正确',
                dataIndex: 'countExceptTrueNum',
                key: 'countExceptTrueNum',
                align: 'center',
                render: (text) => text == null ? '--' : text + '人'
            },
            {
                title: '异常错误',
                dataIndex: 'countExceptErrorNum',
                key: 'countExceptErrorNum',
                align: 'center',
                render: (text, record, index) => text == null ? '--' :
                    <Tooltip
                        title={() => { return ReactNode(0, index) }}
                        key={index}
                        placement="bottom"
                        overlayStyle={{
                            width: GradeReportExamClassDetailByQuestionList[index].excepErrorName.split(',').length / 15 * 250,
                            minWidth: 200
                        }}
                    >
                        <span style={{ color: '#14C8F5', cursor: 'pointer' }}>{text + '人'}</span>
                    </Tooltip>
            },
            {
                title: '已做专练',
                dataIndex: 'trainNum',
                key: 'trainNum',
                align: 'center',
                render: (text) => text == null ? '--' : text + '人'
            },
            {
                title: '未做专练',
                dataIndex: 'notTrainNum',
                key: 'notTrainNum',
                align: 'center',
                render: (text) => text == null ? '--' : text + '人'
            },
            {
                title: '可提分人数',
                dataIndex: 'upSpaceScore',
                key: 'upSpaceScore',
                align: 'center',
                render: (text, record, index) => text == null ? '--' :
                    <Tooltip
                        title={() => { return ReactNode(1, index) }}
                        key={index}
                        placement="bottom"
                        overlayStyle={{
                            width: GradeReportExamClassDetailByQuestionList[index].upSpaceScoreNames.split(',').length / 15 * 250,
                            minWidth: 200
                        }}
                    >
                        <span style={{ color: '#14C8F5', cursor: 'pointer' }}>{text + '人'}</span>
                    </Tooltip>
            },
        ];
        return (
            <div>
                { existArr(GradeReportExamClassDetailByQuestionList) ?
                    <Modal
                        title={'第' + record.code + '题--详情列表'}
                        visible={visible}
                        onOk={() => this.detailSwitch(false)}
                        onCancel={() => this.detailSwitch(false)}
                        width={'80%'}
                        footer={[
                            <Button key="back" onClick={() => this.detailSwitch(false)}>
                                确认
                        </Button>
                        ]}
                    >
                        <Table
                            columns={column}
                            dataSource={GradeReportExamClassDetailByQuestionList}
                            loading={!!findGradeReportExamClassDetailByQuestionLoading}
                            rowKey='classId'
                            pagination={false}
                        />
                    </Modal>
                    : ''}
            </div>
        )
    }
}