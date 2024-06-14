/**
 *@Author:xiongwei
 *@Description:
 *@Date:Created in  2021/4/13
 *@Modified By:
 */
import React from 'react';
import { Modal, Button, Table, Tooltip } from 'antd'
import { TopicManage as namespace } from '@/utils/namespace'
import { connect } from 'dva'
import { existArr, uppercaseNum } from "@/utils/utils";


@connect(state => ({
    findExemReportStudentInfoByExcepId: state[namespace].findExemReportStudentInfoByExcepId,
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
                    findExemReportStudentInfoByExcepId: [],
                }
            })
        }
    }


    render() {
        const { visible, record = {} } = this.state;
        const { findExemReportStudentInfoByExcepId } = this.props
        const ExemReportStudentInfoByExcepId = existArr(findExemReportStudentInfoByExcepId) || [];
        const column = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                align: 'center',
                render: (text, record, index) => index + 1
            },
            {
                title: '姓名',
                dataIndex: 'studentName',
                key: 'studentName',
                align: 'center',
                render: (text) => text == null ? '--' : text
            },
            // {
            //     title: '能力要求',
            //     dataIndex: 'abilityNeed',
            //     key: 'abilityNeed',
            //     align: 'center',
            //     render: (text) => text == null ? '--' : text
            // },
            // {
            //     title: '能力水平',
            //     dataIndex: 'ability',
            //     key: 'ability',
            //     align: 'center',
            //     render: (text) => text == null ? '--' : text
            // },
        ];
        return (
            <div>
                { existArr(ExemReportStudentInfoByExcepId) ?
                    <Modal
                        title={'第' + record.serialCode + '题--异常错误名单'}
                        visible={visible}
                        onOk={() => this.detailSwitch(false)}
                        onCancel={() => this.detailSwitch(false)}
                        width={'40%'}
                        footer={[
                            <Button key="back" onClick={() => this.detailSwitch(false)}>
                                确认
                        </Button>
                        ]}
                    >
                        <Table
                            columns={column}
                            dataSource={ExemReportStudentInfoByExcepId}
                            // bordered
                            rowKey='studentName'
                            pagination={false}
                        />
                    </Modal> : ''}
            </div>
        )
    }
}