/*
Author:韦靠谱
Description:职工详情
Date:2023/04/24
Modified By:
*/

import React, { useState, useEffect } from 'react'
import { Modal, Tabs, Table, Form, DatePicker, Button, Empty, Col, Row, Divider, Image, Space, Select, Spin } from 'antd';
import { connect } from 'dva';
import { EmployeeData as namespace } from '@/utils/namespace';
import styles from './employeeDetails.less'
import StaffDetails from './StaffDetails'
import { SearchOutlined } from '@ant-design/icons';
const cssBox = {
    title: { textAlign: 'center', color: '#1890ff' },
    box_1: { border: '1px dashed #1890ff', borderRadius: '5px', padding: '10px', marginBottom: '20px' }
}
const { Option } = Select;

function employeeDetails(props) {
    const { dispatch, DetailLoading, EmployeeDetailsOpen, showEmployeeDetails, physResultOptions, getWorkerDataCenterFindChangeModify, getWorkerDataCenterFindWorkerInfo } = props;
    const [AuditRecord, setAuditRecord] = useState([])
    const [loading, setLoading] = useState(true)
    const [ImageUrl, setImageUrl] = useState([])
    const [ReportImage, setReportImage] = useState([])
    const [GroundsRejection, setGroundsRejection] = useState('')
    const [ChangeRecordResult, setChangeRecordResult] = useState([])
    // 体检信息相关
    const [PhysicalListData, setPhysicalListData] = useState([])
    const [NewPhysicalListData, setNewPhysicalListData] = useState([])
    const [PhysResultResultChange, setPhysResultResultChange] = useState(null)
    const [PhysicalYearsChange, setPhysicalYearsChange] = useState(null)

    useEffect(() => {
        if (!!getWorkerDataCenterFindChangeModify) {
            setChangeRecordResult(getWorkerDataCenterFindChangeModify.result)
        }
    }, [getWorkerDataCenterFindChangeModify])

    useEffect(() => {
        if (EmployeeDetailsOpen) {
            setPhysicalListData(prevListData => getWorkerDataCenterFindWorkerInfo?.reportVos?.map(item => {
                return { ...item, key: item.id }
            }))
            setNewPhysicalListData(prevListData => getWorkerDataCenterFindWorkerInfo?.reportVos?.map(item => {
                return { ...item, key: item.id }
            }))
        }
    }, [EmployeeDetailsOpen, getWorkerDataCenterFindWorkerInfo])

    // 切换tab
    const onChangeTabs = (key) => {
        if (key == 'AuditRecord') {
            setLoading(true)
            dispatch({
                type: namespace + "/getWorkerDataCenterFindAuditRecordApi",
                payload: { userId: getWorkerDataCenterFindWorkerInfo?.workerId, examineStatus: 0 },
                callback: (res) => {
                    if (res) {
                        setLoading(false)
                        setAuditRecord(res?.result?.map(item => { return { ...item, key: item.id } }))
                    }
                }
            })
        }
    };

    // 数组去重
    function removeDuplicates(data) {
        const uniqueLabels = [];
        const uniqueLabelsSet = new Set();

        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (!uniqueLabelsSet.has(item.label)) {
                uniqueLabelsSet.add(item.label);
                uniqueLabels.push(item);
            }
        }
        return uniqueLabels;
    }

    const PhysicalYearsOptions = getWorkerDataCenterFindWorkerInfo?.reportVos && removeDuplicates(getWorkerDataCenterFindWorkerInfo?.reportVos?.map(item => { return { value: item.year, label: item.year } }))

    const handlePhysResultResultChange = (value) => {
        setPhysResultResultChange(value)
        if (!value) {
            setPhysicalListData(NewPhysicalListData?.filter(item => (PhysicalYearsChange ? item.year == PhysicalYearsChange : true)))
        } else {
            setPhysicalListData(NewPhysicalListData?.filter(item => item.result == value && (PhysicalYearsChange ? item.year == PhysicalYearsChange : true)))
        }
    }
    const handlePhysicalYearsChange = (value) => {
        setPhysicalYearsChange(value)
        if (!value) {
            setPhysicalListData(NewPhysicalListData?.filter(item => (PhysResultResultChange ? item.result == PhysResultResultChange : true)))
        } else {
            setPhysicalListData(NewPhysicalListData?.filter(item => item.year == value && (PhysResultResultChange ? item.result == PhysResultResultChange : true)))
        }
    }

    const handleOk = () => {
        showEmployeeDetails(false)
    };

    const handleCancel = () => {
        showEmployeeDetails(false);
        setImageUrl([])
        setGroundsRejection('')
        setReportImage([])
        setStartDatePicker(null)
        setEndDatePicker(null)

    };

    const handleYearChange = (value) => {
        setReportImage(getWorkerDataCenterFindWorkerInfo?.reportVos?.find((item) => item.year == value)?.report)
    }
    // 审核记录-查看详情
    const ViewDetails = (record) => {
        if (record.examineStatus == 3) {
            setGroundsRejection(null)
            setImageUrl(record.confirmPng?.split(/[;,]/).map((item, index) => ({ img: item, key: index })))
        } else {
            setImageUrl([])
            setGroundsRejection('驳回理由：' + record.content)
        }
    }

    // 开始时间不能大于结束时间
    const [StartDatePicker, setStartDatePicker] = useState(null)
    const [EndDatePicker, setEndDatePicker] = useState(null)
    const onStartDatePicker = (value) => { !value ? setStartDatePicker(null) : setStartDatePicker(new Date(Date.parse(value?.format()))?.getTime()) }
    const onEndDatePicker = (value) => { !value ? setEndDatePicker(null) : setEndDatePicker(new Date(Date.parse(value?.format()))?.getTime()) }
    const disabledStartDate = (Value) => {
        const startValue = new Date(Date.parse(Value.format())).getTime()
        if (!startValue || !EndDatePicker) {
            return false;
        }
        return startValue.valueOf() > EndDatePicker.valueOf();
    }
    const disabledEndDate = (Value) => {
        const endValue = new Date(Date.parse(Value.format())).getTime()
        if (!endValue || !StartDatePicker) {
            return false;
        }
        return StartDatePicker.valueOf() >= endValue.valueOf();
    }

    // 变动记录
    const onChangeRecordFinish = (values) => {
        setChangeRecordResult([])
        dispatch({
            type: namespace + "/getWorkerDataCenterFindPostChangeModifyApi",
            payload: {
                ...values, ...{
                    userId: getWorkerDataCenterFindWorkerInfo?.workerId,
                    startTime: values['startTime'] && values['startTime'].format('YYYY/MM/DD'),
                    endTime: values['endTime'] && values['endTime'].format('YYYY/MM/DD')
                }

            },
            callback: (res) => {
                if (res.result && res.result?.length > 0) {
                    setChangeRecordResult(res.result)
                }
            }
        })
    };

    // 家庭信息表格
    const familyColumns = [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '关系',
            dataIndex: 'relationText',
            key: 'relationText',
        },
        {
            title: '学历',
            dataIndex: 'educationText',
            key: 'educationText',
        },
        {
            title: '工作省份',
            dataIndex: 'workProvinceText',
            key: 'workProvinceText',
        },
        {
            title: '工作情况',
            dataIndex: 'workTypeText',
            key: 'workTypeText',
        }

    ];
    // 审核记录表格
    const AuditRecordColumns = [
        {
            title: '序号',
            render: (text, record, index) => `${index + 1}`
        },
        {
            title: '审核状态',
            dataIndex: 'examineStatus',
            key: 'examineStatus',
            render: (_, record) => (record.examineStatus == 3 ? '已通过' : record.examineStatus == 4 ? '已驳回' : `未识别状态码--${record.examineStatus}`)
        },
        {
            title: '审核时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (_, record) => (new Date(record.createTime).getFullYear() + '-' + (new Date(record.createTime).getMonth() + 1) + '-' + new Date(record.createTime).getDate()),
        },
        {
            title: '审核结果',
            dataIndex: 'verify',
            key: 'verify',
            render: (_, record) => (
                <a onClick={() => { ViewDetails(record) }}> {record.examineStatus == 3 ? '查看确认件' : '查看驳回理由'}</a>
            ),
        },

    ];
    // 体检
    const PhysicalExaminationColumns = [
        {
            title: '年份',
            dataIndex: 'year',
            key: 'year',
        },
        {
            title: '体检结果',
            dataIndex: 'resultText',
            key: 'resultText',
        },
        {
            title: '诊断结果',
            dataIndex: 'content',
            key: 'content',
        },
    ]

    return (
        <>
            <Modal title="职工详情" visible={EmployeeDetailsOpen} destroyOnClose={true} onOk={handleOk} onCancel={handleCancel} width={700} bodyStyle={{ padding: '0 24px 24px 24px' }}>
                <Tabs defaultActiveKey="1" onChange={onChangeTabs} className={styles['employeeDetailsCss']}>
                    <Tabs.TabPane tab="职工信息" key="EmployeeInformation">

                        {/* <StaffDetails /> */}
                        <Spin spinning={DetailLoading}>
                            <div className={styles["printPage"]}>
                                <div>
                                    <h3 style={cssBox.title}>基础信息</h3>
                                    <div style={cssBox.box_1}>
                                        <Row>
                                            <Col span={20}>
                                                <Row style={{ padding: '10px 0' }}>
                                                    <Col span={9}>姓名：{getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.userName}</Col>
                                                    <Col span={8}>性别：{getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.sexText}</Col>
                                                    <Col span={7}>民族：{getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.nation}</Col>
                                                </Row>
                                                <Row style={{ padding: '10px 0' }}>
                                                    <Col span={17}>籍贯：{getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.nativePlace}</Col>
                                                    <Col span={7}>年龄：{getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.age}</Col>
                                                </Row>
                                                <Row style={{ padding: '10px 0' }}>
                                                    <Col span={9}>证件类型：{getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.docTypeName ? getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.docTypeName : '居民身份证'}</Col>
                                                    <Col span={15}>证件号码：{getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.identityCard}</Col>
                                                </Row>
                                            </Col>
                                            <Col span={3}>
                                                { getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.imgHead ? <Image width={100} height={120} src={getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.imgHead} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无一寸照' /> }
                                            </Col>
                                        </Row>
                                        <Row style={{ padding: '10px 0' }}>
                                            <Col span={10}>所属处室：{getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.orgName}</Col>
                                            <Col span={14}>职务：{getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.post}</Col>
                                        </Row>
                                        <Row style={{ padding: '10px 0' }}>
                                            <Col span={10}>入职时间：{getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.entryTime && new Date(getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.entryTime).getFullYear() + '-' + (new Date(getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.entryTime).getMonth() + 1) + '-' + new Date(getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.entryTime).getDate()}</Col>
                                            <Col span={14}>联系电话：{getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.phone}</Col>
                                        </Row>
                                        <Row style={{ padding: '10px 0' }}>
                                            <Col span={10}>紧急联系人：{getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.urgentName}</Col>
                                            <Col span={14}>紧急联系电话：{getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.urgentPhone}</Col>
                                        </Row>
                                        <Row style={{ padding: '10px 0' }}>
                                            <Col span={10}>最高学历：{getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.maxEducText}</Col>
                                            <Col span={14}>最高学历性质：{getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.educTypeText}</Col>
                                        </Row>
                                        <Row style={{ padding: '10px 0' }}>
                                            <Col span={10}>岗位类别：{getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.postTypeText}</Col>
                                            <Col span={14}>岗位等级：{getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.postLevelText}</Col>
                                        </Row>
                                        <Row style={{ padding: '10px 0' }}>
                                            <Col span={10}>主要工作：{getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.hightJobText}</Col>
                                            <Col span={14}>专业技术或工勤技能职务：{getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.postFunctionText}</Col>
                                        </Row>
                                        <Row style={{ padding: '10px 0' }}>
                                            <Col span={24}>家庭住址：{getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.address}</Col>
                                        </Row>
                                        <Row style={{ textAlign: 'center' }}>
                                            <Col span={11}>
                                                { getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.identityDown ? <Image width={150} height={100} src={getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.identityDown} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无身份证国徽面图片' /> }
                                            </Col>
                                            <Col span={11}>
                                                { getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.identityUp ? <Image width={150} height={100} src={getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.identityUp} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无身份证人像面图片' /> }
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div>
                                    <h3 style={cssBox.title}>学历信息</h3>
                                    <div style={cssBox.box_1}>
                                        {getWorkerDataCenterFindWorkerInfo?.educationVos?.length > 0 ?
                                            getWorkerDataCenterFindWorkerInfo?.educationVos?.map(item => {
                                                return (
                                                    <div key={item.id} style={{ textAlign: "center", paddingBottom: '20px' }}>
                                                        <Row>
                                                            <Col span={12} style={{ textAlign: "center" }}>
                                                                <div>开始时间：{item?.startTime}</div>
                                                                <div>毕业院校：{item?.schoolName}</div>
                                                                <div>学位：{(item?.degreeTypeText && item?.degreeTypeText != '无' ? item?.degreeTypeText : '') + (item?.degreeLevelText && item?.degreeLevelText != '无' ? item?.degreeLevelText : '')}</div>
                                                                <div>学历性质：{item?.natureText}</div>
                                                                <div style={{ marginTop: '10px' }}>毕业证</div>
                                                                { item?.diploma ? <Image width={250} height={120} src={item?.diploma} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无毕业证图片' /> }
                                                            </Col>
                                                            <Col span={12} style={{ textAlign: "center" }}>
                                                                <div>结束时间：{item?.endTime}</div>
                                                                <div>学历层次：{item?.educationText}</div>
                                                                <div>就读专业：{item?.major}</div>
                                                                <div>学制：{item?.studyYearText}</div>
                                                                <div style={{ marginTop: '10px' }}>学位证</div>
                                                                { item?.degree ? <Image width={250} height={120} src={item?.degree} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无学位证图片' /> }
                                                            </Col>
                                                        </Row>
                                                    </div>

                                                )
                                            }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                        }

                                    </div>
                                </div>
                                <div>
                                    <h3 style={cssBox.title}>家庭信息</h3>
                                    <div style={cssBox.box_1}>
                                        <Table pagination={false} dataSource={getWorkerDataCenterFindWorkerInfo?.workerFamilyInfoVos?.map(item => { return { ...item, key: item.id } })} columns={familyColumns} />
                                    </div>
                                </div>

                                <div>
                                    <h3 style={cssBox.title}>体检信息</h3>
                                    <div style={cssBox.box_1}>
                                        {/* <Table pagination={false} dataSource={getWorkerDataCenterFindWorkerInfo?.reportVos?.map(item => { return { ...item, key: item.id } })} columns={PhysicalExaminationColumns} />
                                        <Space style={{ margin: '20px 0 15px 0' }}>
                                            查看体检报告的年份：
                                            <Select options={yearOptions} onChange={handleYearChange} getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: '100px' }} />
                                        </Space>
                                        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                            {
                                                ReportImage?.map((item, index) => {
                                                    return (
                                                        <Image key={index} width={190} height={130} src={item ? `${item}` : "error"}
                                                            fallback="data:image/png;base64,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"
                                                        />
                                                    )
                                                })
                                            }
                                        </div> */}
                                        <Row style={{ padding: '10px 0' }}>
                                            <Col span={9}>
                                                <Space>体检年度 <Select options={PhysicalYearsOptions} allowClear onChange={handlePhysicalYearsChange} getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: '100px' }} /></Space>
                                            </Col>
                                            <Col span={7} offset={8}>
                                                <Space>体检结果 <Select options={physResultOptions} allowClear onChange={handlePhysResultResultChange} getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: '100px' }} /></Space>
                                            </Col>
                                        </Row>
                                        {PhysicalListData?.length > 0 ?
                                            PhysicalListData?.map(item => {
                                                return (
                                                    <div key={item.id}>
                                                        <Row style={{ padding: '10px 0' }} gutter={[8, 0]}>
                                                            <Col span={5}>体检年份：{item.year}</Col>
                                                            <Col span={6}>体检结果：{item.resultText}</Col>
                                                            <Col span={13}>诊断结果：{item.content}</Col>
                                                        </Row>
                                                        <Row justify="space-around" align="middle">
                                                            {item.report?.length > 0 ? item.report?.map((pngItem, index) => (
                                                                <Col span={8} key={index}>
                                                                    <Image width={200} height={120} src={pngItem} />
                                                                </Col>
                                                            )) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'暂无图片'} />}
                                                        </Row>
                                                        <Divider />
                                                    </div>
                                                )
                                            }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}

                                    </div>
                                </div>

                            </div>

                            <div>
                                <Form name="ChangeRecord" onFinish={onChangeRecordFinish}>
                                    <Space>
                                        <Form.Item label="变动类型" name="changeType">
                                            <Select allowClear getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: '100px', marginRight: '6px' }}>
                                                <Option value="1">兼职</Option>
                                                <Option value="2">轮岗</Option>
                                                <Option value="4">离职</Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="时间" name="startTime"><DatePicker onChange={onStartDatePicker} disabledDate={disabledStartDate} /></Form.Item>
                                        <Form.Item label="至" name="endTime"><DatePicker onChange={onEndDatePicker} disabledDate={disabledEndDate} /></Form.Item>
                                        <Form.Item >
                                            <Button htmlType="submit" icon={<SearchOutlined />}>搜索</Button>
                                        </Form.Item>
                                    </Space>
                                </Form>
                                {ChangeRecordResult?.length > 0 &&
                                    ChangeRecordResult?.map((item, index) => {
                                        return (
                                            <div style={cssBox.box_1} key={index}>
                                                <Row>
                                                    <Col span={11}>
                                                        <p>{item?.flag == 4 ? '离职时间' : '开始时间'}：{item?.startDate && new Date(item?.startDate).getFullYear() + '-' + (new Date(item?.startDate).getMonth() + 1) + '-' + new Date(item?.startDate).getDate()}</p>
                                                        <p>变动类型：{item?.flagText}</p>
                                                        {item?.orgName && <p>变动前处室：{item?.oldOrgName}</p>}
                                                        {item?.postName && <p>变动前职务：{item?.oldPostName}</p>}
                                                    </Col>
                                                    <Col span={11} offset={2}>
                                                        {item?.flag != 4 &&
                                                            <p>截止时间：{item?.endDate && new Date(item?.endDate).getFullYear() + '-' + (new Date(item?.endDate).getMonth() + 1) + '-' + new Date(item?.endDate).getDate()}</p>
                                                        }
                                                        {item?.flag != 4 &&
                                                            <p>调整类型：{item?.orgName && '【处室调整】'}{item?.postName && '【职务调整】'}</p>
                                                        }
                                                        {item?.orgName && <p>变动后处室：{item?.orgName}</p>}
                                                        {item?.postName && <p>变动后职务：{item?.postName}</p>}
                                                    </Col>
                                                </Row>
                                                {item?.flag === 4 ? <p>离职原因：{item?.reason}</p> : null}
                                            </div>
                                        )
                                    })

                                }
                                {ChangeRecordResult?.length <= 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                            </div>

                        </Spin>

                    </Tabs.TabPane>
                    <Tabs.TabPane tab="审核记录" key="AuditRecord">
                        <Spin spinning={loading}>
                            <Table pagination={false} sortOrder={null} dataSource={AuditRecord} columns={AuditRecordColumns} />
                        </Spin>
                        {ImageUrl?.length >= 0 &&
                            <div style={{ marginTop: '10px' }}>
                                <Image.PreviewGroup>
                                    {
                                        ImageUrl.map(item => {
                                            return (
                                                <Image key={item.key} src={item.img} />
                                            )
                                        })
                                    }
                                </Image.PreviewGroup>
                            </div>
                        }
                        {GroundsRejection &&
                            <div style={{ marginTop: '10px' }}>
                                <p>{GroundsRejection}</p>
                            </div>
                        }
                    </Tabs.TabPane>
                </Tabs>
            </Modal>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        getWorkerDataCenterFindWorkerInfo: state[namespace].getWorkerDataCenterFindWorkerInfo,
        getWorkerDataCenterFindChangeModify: state[namespace].getWorkerDataCenterFindChangeModify,
        physResultOptions: state[namespace].physResultOptions,
    }
}

export default connect(mapStateToProps)(employeeDetails);