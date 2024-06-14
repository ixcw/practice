/*
Author:韦靠谱
Description:职工资料修改
Date:2023/04/24
Modified By:
*/


import React, { useState, useContext, useEffect, useRef } from 'react'
import { Modal, Tabs, Button, Input, Alert, Spin, Row, Col, Empty, Image, Form, DatePicker, Select, message, Cascader, Table, Space } from 'antd';
import { connect } from 'dva';
import { EmployeeData as namespace } from '@/utils/namespace';
import moment from 'moment';
import styles from './EmployeeModification.less'

const { Option } = Select;

// .tableHidden

function EmployeeModification(props) {
    const { EmployeeModificationOpen, DetailLoading,docTypeOptions, getTeacherList,ListDataCurrentPage, ListDataPageSize, AllScreening, relationOptions, showEmployeeModification, PrincipalJobOptions, postFunctionOptions, postTypeOptions, postOptions, PhysicalExaminationOptions, getWorkerDataCenterFindWorkerInfo, dispatch, CityAddressOptions, ProvinceCityAddressOptions, workOptions, eduOptions, eduNatureOptions, nationOptions, sexOptions, SchoolPostsOptions, SchoolOrgsOptions } = props
    const [basicForm] = Form.useForm()
    const [Loading, setLoading] = useState(true)
    const [ButtonLoading, setButtonLoading] = useState(false)
    const [ReportImage, setReportImage] = useState([])
    const [ModificationRecord, setModificationRecord] = useState([])
    const [ModificationRecordTotal, setModificationRecordTotal] = useState(null)

    const handleDepartmentChange = (orgId) => {
        basicForm.setFieldsValue({
            "baseInfo": [{
                id: basicForm.getFieldsValue().baseInfo[0]?.id,
                docType: basicForm.getFieldsValue().baseInfo[0]?.docType ? basicForm.getFieldsValue().baseInfo[0]?.docType-0 : 1,
                userId: basicForm.getFieldsValue().baseInfo[0]?.userId,
                userName: basicForm.getFieldsValue().baseInfo[0]?.userName,
                sex: basicForm.getFieldsValue().baseInfo[0]?.sex,
                nationId: basicForm.getFieldsValue().baseInfo[0]?.nationId,
                areaId: basicForm.getFieldsValue().baseInfo[0]?.areaId,
                entryTime: basicForm.getFieldsValue().baseInfo[0]?.entryTime && moment((basicForm.getFieldsValue().baseInfo[0]?.entryTime)),
                identityCard: basicForm.getFieldsValue().baseInfo[0]?.identityCard,
                age: basicForm.getFieldsValue().baseInfo[0]?.age,
                phone: basicForm.getFieldsValue().baseInfo[0]?.phone,
                urgentName: basicForm.getFieldsValue().baseInfo[0]?.urgentName,
                urgentPhone: basicForm.getFieldsValue().baseInfo[0]?.urgentPhone,
                address: basicForm.getFieldsValue().baseInfo[0]?.address,
                orgId: basicForm.getFieldsValue().baseInfo[0]?.orgId,
                educType: basicForm.getFieldsValue().baseInfo[0]?.educType && basicForm.getFieldsValue().baseInfo[0]?.educType - 0,
                maxEduc: basicForm.getFieldsValue().baseInfo[0]?.maxEduc && basicForm.getFieldsValue().baseInfo[0]?.maxEduc - 0,
                hightJob: basicForm.getFieldsValue().baseInfo[0]?.hightJob && basicForm.getFieldsValue().baseInfo[0]?.hightJob - 0,
                postFunction: basicForm.getFieldsValue().baseInfo[0]?.postFunction && basicForm.getFieldsValue().baseInfo[0]?.postFunction - 0,
                postType: basicForm.getFieldsValue().baseInfo[0]?.postType && basicForm.getFieldsValue().baseInfo[0]?.postType - 0,
                postLevel: basicForm.getFieldsValue().baseInfo[0]?.postLevel && basicForm.getFieldsValue().baseInfo[0]?.postLevel - 0,
                postId: null,
            }]
        })
        dispatch({
            type: namespace + "/getCommonGetPostsApi",
            payload: { orgId }
        })
    };

    useEffect(() => {
        if (EmployeeModificationOpen) {
            dispatch({
                type: namespace + "/getCommonGetPostsApi",
                payload: { orgId: getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.orgId }
            })
        }
    }, [EmployeeModificationOpen])

    // 标签页切换
    const onChangeTabs = (key) => {
        if (key == 'ModificationRecord') {
            setLoading(true)
            dispatch({
                type: namespace + "/getWorkerDataCenterFindUpdateRecordApi",
                payload: { userId: getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.userId },
                callback: (res) => {
                    if (res.result) {
                        setModificationRecord(res?.result.map(item => {
                            return {
                                ...item,
                                key: item.id,
                                createTime: new Date(item.createTime).getFullYear() + '-' + (new Date(item.createTime).getMonth() + 1) + '-' + new Date(item.createTime).getDate(),
                            }
                        }))
                        setModificationRecordTotal(res?.result.length)
                        setLoading(false)
                    }
                }
            })
        }

    };

      // 限制可选择的时间
  const disabledDate = (current) => { return current && current > moment().endOf('day') }

    const yearOptions = getWorkerDataCenterFindWorkerInfo?.reportVos?.map(item => { return { value: item.year - 0, label: item.year } })

    const familyColumns = [
        {
            title: 'familyId',
            dataIndex: 'id',
            key: 'id',
            className: `${styles['tableHidden']}`,
            render: (text, record, index) => {
                return (
                    <Form.Item name={['workerFamilyInfoVos', index, 'id']} ><Input /></Form.Item>
                )
            }
        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => {
                return (
                    <Form.Item name={['workerFamilyInfoVos', index, 'name']}>
                        <Input />
                    </Form.Item>
                )
            }
        },
        {
            title: '关系',
            dataIndex: 'relation',
            key: 'relation',
            render: (text, record, index) => {
                return (
                    <Form.Item name={['workerFamilyInfoVos', index, 'relation']}>
                        <Select options={relationOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                    </Form.Item>
                )
            }
        },
        {
            title: '学历',
            dataIndex: 'education',
            key: 'education',
            render: (text, record, index) => {
                return (
                    <Form.Item name={['workerFamilyInfoVos', index, 'education']}>
                        <Select options={eduOptions} />
                    </Form.Item>
                )
            }
        },
        {
            title: '工作省份',
            dataIndex: 'workProvince',
            key: 'workProvince',
            render: (text, record, index) => {
                return (
                    <Form.Item name={['workerFamilyInfoVos', index, 'workProvince']}>
                        <Select options={CityAddressOptions} />
                    </Form.Item>
                )
            }
        },
        {
            title: '工作情况',
            dataIndex: 'workType',
            key: 'workType',
            render: (text, record, index) => {
                return (
                    <Form.Item name={['workerFamilyInfoVos', index, 'workType']}>
                        <Select options={workOptions} />
                    </Form.Item>
                )
            }
        },
    ]
    const PhysicalExaminationColumns = [
        {
            title: 'familyId',
            dataIndex: 'id',
            key: 'id',
            className: `${styles['tableHidden']}`,
            render: (text, record, index) => {
                return (
                    <Form.Item name={['reportVos', index, 'id']} ><Input /></Form.Item>
                )
            }
        },
        {
            title: '年份',
            dataIndex: 'year',
            key: 'year',
            render: (text, record, index) => {
                return (
                    <Form.Item name={['reportVos', index, 'year']}>
                        <Input />
                    </Form.Item>
                )
            }
        },
        {
            title: '体检结果',
            dataIndex: 'result',
            key: 'result',
            render: (text, record, index) => {
                return (
                    <Form.Item name={['reportVos', index, 'result']}>
                        <Select options={PhysicalExaminationOptions} />
                    </Form.Item>
                )
            }
        },
        {
            title: '诊断结果',
            dataIndex: 'content',
            key: 'content',
            render: (text, record, index) => {
                return (
                    <Form.Item name={['reportVos', index, 'content']}>
                        <Input />
                    </Form.Item>
                )
            }
        },
    ]
    const ModificationRecordColumns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            render: (text, record, index) => `${ModificationRecordTotal - index}`,
            sorter: (a, b) => a.id - b.id,
            defaultSortOrder: 'descend',
            sortOrder: 'descend',
            showSorterTooltip: false,
            sortDirections: ['descend']
        },
        {
            title: '调整字段',
            dataIndex: 'modifyColName',
            key: 'modifyColName'
        },
        {
            title: '修改前字段信息',
            dataIndex: 'oldContent',
            key: 'oldContent'
        },
        {
            title: '修改后字段信息',
            dataIndex: 'modifyContent',
            key: 'modifyContent'
        },
        {
            title: '修改时间',
            dataIndex: 'createTime',
            key: 'createTime'
        },
    ]

    const handleYearChange = (value) => {
        setReportImage(getWorkerDataCenterFindWorkerInfo?.reportVos?.find((item) => item.year == value)?.report)
    }

    // 设置显示默认值
    useEffect(() => {
        basicForm.setFieldsValue(
            {
                "baseInfo": [{
                    id: getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.id,
                    docType: getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.docType ? getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.docType-0 : 1,
                    userId: getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.userId,
                    userName: getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.userName,
                    sex: getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.sex,
                    nationId: getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.nationId,
                    areaId: getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.detailId && getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.detailId?.split(/[;,]/)?.map(Number),
                    entryTime: getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.entryTime && moment((getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.entryTime)),
                    identityCard: getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.identityCard,
                    age: getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.age,
                    phone: getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.phone,
                    urgentName: getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.urgentName,
                    urgentPhone: getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.urgentPhone,
                    address: getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.address,
                    orgId: getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.orgId,
                    postId: getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.postId,
                    educType: getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.educType && getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.educType - 0,
                    maxEduc: getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.maxEduc && getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.maxEduc - 0,
                    hightJob: getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.hightJob && getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.hightJob - 0,
                    postFunction: getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.postFunction && getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.postFunction - 0,
                    postType: getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.postType && getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.postType - 0,
                    postLevel: getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.postLevel && getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.postLevel - 0,
                }],
                "educationDtos": getWorkerDataCenterFindWorkerInfo?.educationVos?.map(item => {
                    return {
                        id: item?.id,
                        education: item?.education - 0,
                        nature: item?.nature && item?.nature - 0,
                        major: item?.major,
                        endTime: item?.endTime && moment(item?.endTime),
                        startTime: item?.startTime && moment(item?.startTime),
                    }
                }),
                'workerFamilyInfoVos': getWorkerDataCenterFindWorkerInfo?.workerFamilyInfoVos?.map(item => {
                    return {
                        ...item,
                        id: item?.id,
                        education: item?.education - 0,
                        relation: item?.relation - 0,
                        workProvince: item?.workProvince && item?.workProvince - 0,
                        workType: item?.workType && item?.workType - 0,
                    }
                }),
                'reportVos': getWorkerDataCenterFindWorkerInfo?.reportVos?.map(item => {
                    return {
                        ...item,
                        id: item?.id,
                        year: item?.year,
                        result: item?.result - 0,
                        content: item?.content,
                    }
                })
            }
        )
    }, [getWorkerDataCenterFindWorkerInfo])


    const onFinish = (values) => {
        setButtonLoading(true)
        const modifyValues = {
            ...values,
            baseInfo: {
                ...values.baseInfo[0],
                areaId: values.baseInfo[0]['areaId'] && values.baseInfo[0]['areaId'][values.baseInfo[0]['areaId'].length-1],
                entryTime: values.baseInfo[0]['entryTime'] && Date.parse(values.baseInfo[0]['entryTime'].format()),
            },
            // educationDtos: values['educationDtos']?.length > 0 ? values['educationDtos'].map(item => {
            //     return {
            //         ...item,
            //         degree: item.degree,
            //         education: item.education,
            //         major: item.major,
            //         startTime: item.startTime && item['startTime'].format('YYYY-MM-DD'),
            //         endTime: item.endTime && item['endTime'].format('YYYY-MM-DD')
            //     }
            // }) : [],
        }
        const { ...newValues } = { ...values, ...modifyValues };
        dispatch({
            type: namespace + "/postWorkerDataCenterInsertOrUpdateWorkerApi",
            payload: newValues,
            callback: (res) => {
                if (res?.err?.code !== 601) {
                    message.success('职工信息修改成功！')
                    setButtonLoading(false)
                    showEmployeeModification(false)
                    getTeacherList(ListDataCurrentPage, ListDataPageSize, AllScreening)
                } else {
                    setButtonLoading(false)
                }
            }
        })
    }


    return (
        <>
            <Modal title="修改信息" visible={EmployeeModificationOpen} destroyOnClose={true} footer={null} onCancel={() => { showEmployeeModification(false); setReportImage([]) }} width={700} bodyStyle={{ padding: '0 24px 24px 24px' }}>
                <Tabs defaultActiveKey='1' onChange={onChangeTabs} className={styles['bigBox']}>
                    <Tabs.TabPane tab="职工详情" key="EmployeeInformation">
                        <Spin spinning={DetailLoading}>
                            <Form name="basic" form={basicForm} onFinish={onFinish} autoComplete="off">
                                <h3 className={styles['title']}>基础信息</h3>
                                <Form.List name="baseInfo" >
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map(({ key, name, ...restField }) => (
                                                <div key={key} className={styles['box_1']}>
                                                    <Row>
                                                        <Col span={20}>
                                                            <Row>
                                                                <Col span={7}><Form.Item label="姓名" name={[name, "userName"]}><Input /></Form.Item></Col>
                                                                <Col span={7} offset={1}><Form.Item label="性别" name={[name, "sex"]}>
                                                                    <Select options={sexOptions} getPopupContainer={triggerNode => triggerNode.parentNode} /></Form.Item></Col>
                                                                <Col span={7} offset={1}><Form.Item label="民族" name={[name, "nationId"]} >
                                                                    <Select options={nationOptions} getPopupContainer={triggerNode => triggerNode.parentNode} /></Form.Item></Col>
                                                            </Row>
                                                            <Row>
                                                                <Col span={23}><Form.Item label="籍贯" name={[name, "areaId"]} >
                                                                    <Cascader options={ProvinceCityAddressOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                                                                </Form.Item></Col>
                                                            </Row>
                                                            <Row>
                                                                <Col span={11}>
                                                                    <Form.Item label="证件类型" name={[name, "docType"]}>
                                                                        <Select disabled options={docTypeOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                                                                    </Form.Item>
                                                                </Col>
                                                                <Col span={11} offset={1}>
                                                                    <Form.Item label="证件号码" name={[name, "identityCard"]}><Input disabled /></Form.Item>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col span={11}><Form.Item label="所属处室" name={[name, "orgId"]} >
                                                                    <Select options={SchoolOrgsOptions} onChange={handleDepartmentChange} getPopupContainer={triggerNode => triggerNode.parentNode} />
                                                                </Form.Item></Col>
                                                                <Col span={11} offset={1}><Form.Item label="职务" name={[name, "postId"]} >
                                                                    <Select options={SchoolPostsOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                                                                </Form.Item></Col>
                                                            </Row>
                                                        </Col>
                                                        <Col span={3}>
                                                            { getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.imgHead ? <Image width={100} height={120} src={getWorkerDataCenterFindWorkerInfo?.baseInfoVo?.imgHead} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无一寸照' /> }
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col span={9}>
                                                            <Form.Item label="入职时间" name={[name, "entryTime"]} >
                                                                <DatePicker disabledDate={disabledDate} style={{ width: '100%' }} getPopupContainer={triggerNode => triggerNode.parentNode} />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={5} offset={1}><Form.Item label="年龄" name={[name, "age"]}><Input disabled /></Form.Item></Col>
                                                        <Col span={8} offset={1}><Form.Item label="联系电话" name={[name, "phone"]}><Input disabled /></Form.Item></Col>
                                                    </Row>

                                                    <Row>
                                                        <Col span={9}><Form.Item label="主要工作" name={[name, "hightJob"]}>
                                                            <Select options={PrincipalJobOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                                                        </Form.Item></Col>
                                                        <Col span={14} offset={1}><Form.Item label="专业技术或工勤技能职务" name={[name, "postFunction"]}>
                                                            <Select options={postFunctionOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                                                        </Form.Item></Col>
                                                    </Row>
                                                    <Row>
                                                        <Col span={9}><Form.Item label="岗位类别" name={[name, "postType"]}>
                                                            <Select options={postTypeOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                                                        </Form.Item></Col>
                                                        <Col span={14} offset={1}><Form.Item label="岗位等级" name={[name, "postLevel"]}>
                                                            <Select options={postOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                                                        </Form.Item></Col>
                                                    </Row>

                                                    <Row>
                                                        <Col span={9}><Form.Item label="紧急联系人" name={[name, "urgentName"]}><Input /></Form.Item></Col>
                                                        <Col span={14} offset={1}><Form.Item label="紧急联系电话" name={[name, "urgentPhone"]}><Input /></Form.Item></Col>
                                                    </Row>
                                                    {/* <Row>
                                                        <Col span={9}><Form.Item label="最高学历" name={[name, "maxEduc"]}>
                                                            <Select options={eduOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                                                        </Form.Item></Col>
                                                        <Col span={14} offset={1}><Form.Item label="最高学历性质" name={[name, "educType"]}>
                                                            <Select options={eduNatureOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                                                        </Form.Item></Col>
                                                    </Row> */}
                                                    <Row>
                                                        <Col span={24}><Form.Item label="家庭住址" name={[name, "address"]}><Input /></Form.Item></Col>
                                                    </Row>
                                                </div>

                                            ))}
                                        </>
                                    )}
                                </Form.List>
                                <h3 className={styles['title']}>学历信息</h3>
                                <Alert
                                    message="提示信息"
                                    description="为方便您使用，此处信息请前往手机APP修改"
                                    type="info"
                                    showIcon
                                />
                                {/* <div className={styles['box_1']}>
                                    <Spin indicator={null} tip="为方便您使用，此处信息请前往手机APP修改" >
                                        {getWorkerDataCenterFindWorkerInfo?.educationVos?.length > 0 ?
                                            <Form.List name="educationDtos" >
                                                {(fields, { add, remove }) => (
                                                    <>
                                                        {fields.map(({ key, name, ...restField }) => (
                                                            <Row key={key}>
                                                                <Col span={12} className={styles['Educational']}>
                                                                    <Space>
                                                                        <Form.Item label="时间" name={[name, "startTime"]} style={{ marginBottom: 0 }}>
                                                                            <DatePicker getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: '100%' }} />
                                                                        </Form.Item>
                                                                        <Form.Item label="至" name={[name, "endTime"]} style={{ marginBottom: 0 }}>
                                                                            <DatePicker getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: '100%' }} />
                                                                        </Form.Item>
                                                                    </Space>
                                                                    <Form.Item label="学历性质" name={[name, "nature"]} >
                                                                        <Select options={eduNatureOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                                                                    </Form.Item>
                                                                    <h3>毕业证</h3>
                                                                    <Image width={280} height={160} src='error'
                                                                        fallback="data:image/png;base64,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"
                                                                    />
                                                                </Col>
                                                                <Col span={11} offset={1} className={styles['Educational']}>
                                                                    <Form.Item label="学历层次" name={[name, "education"]}>
                                                                        <Select options={eduOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                                                                    </Form.Item>
                                                                    <Form.Item label="所学专业" name={[name, "major"]} >
                                                                        <Input />
                                                                    </Form.Item>
                                                                    <h3>学位证</h3>
                                                                    <Image width={280} height={160} src='error'
                                                                        fallback="data:image/png;base64,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"
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        ))}
                                                    </>
                                                )}
                                            </Form.List>
                                            : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                        }
                                    </Spin>
                                </div> */}
                                <div>
                                    <h3 className={styles['title']}>家庭信息</h3>
                                    <Alert
                                        message="提示信息"
                                        description="为方便您使用，此处信息请前往手机APP修改"
                                        type="info"
                                        showIcon
                                    />
                                    {/* <div className={styles['box_1']}>
                                        <Spin indicator={null} tip="为方便您使用，此处信息请前往手机APP修改" >
                                            <Form.Item valuePropName="familyTableData">
                                                <Table bordered columns={familyColumns} pagination={false} dataSource={getWorkerDataCenterFindWorkerInfo?.workerFamilyInfoVos?.map(item => { return { ...item, key: item?.id } })} />
                                            </Form.Item>
                                        </Spin>
                                    </div> */}
                                </div>

                                <div>
                                    <h3 className={styles['title']}>体检信息</h3>
                                    <Alert
                                        message="提示信息"
                                        description="为方便您使用，此处信息请前往手机APP修改"
                                        type="info"
                                        showIcon
                                    />
                                    {/* <div className={styles['box_1']}>
                                        <Spin indicator={null} tip="为方便您使用，此处信息请前往手机APP修改" >
                                            <Form.Item valuePropName="familyTableData">
                                                <Table bordered columns={PhysicalExaminationColumns} pagination={false} dataSource={getWorkerDataCenterFindWorkerInfo?.reportVos?.map(item => { return { ...item, key: item?.id } })} />
                                            </Form.Item>
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
                                            </div>
                                        </Spin>
                                    </div> */}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'center',margin:"20px" }}><Button loading={ButtonLoading} type="primary" htmlType="submit">确定修改</Button></div>
                            </Form>
                        </Spin>


                    </Tabs.TabPane>
                    <Tabs.TabPane tab="修改记录" key="ModificationRecord">
                        <Spin spinning={Loading}>
                            <Table pagination={false} dataSource={ModificationRecord} columns={ModificationRecordColumns} />
                        </Spin>
                    </Tabs.TabPane>
                </Tabs>
            </Modal>
        </>
    )
}


const mapStateToProps = (state) => {
    return {
        getWorkerDataCenterFindWorkerInfo: state[namespace].getWorkerDataCenterFindWorkerInfo,
        sexOptions: state[namespace].sexOptions,
        nationOptions: state[namespace].nationOptions,
        eduNatureOptions: state[namespace].eduNatureOptions,
        eduOptions: state[namespace].eduOptions,
        workOptions: state[namespace].workOptions,
        ProvinceCityAddressOptions: state[namespace].ProvinceCityAddressOptions,
        CityAddressOptions: state[namespace].CityAddressOptions,
        SchoolOrgsOptions: state[namespace].SchoolOrgsOptions,
        SchoolPostsOptions: state[namespace].SchoolPostsOptions,
        PhysicalExaminationOptions: state[namespace].PhysicalExaminationOptions,
        relationOptions: state[namespace].relationOptions,
        PrincipalJobOptions: state[namespace].PrincipalJobOptions,
        postFunctionOptions: state[namespace].postFunctionOptions,
        postTypeOptions: state[namespace].postTypeOptions,
        postOptions: state[namespace].postOptions,
        docTypeOptions: state[namespace].docTypeOptions,
    }
}

export default connect(mapStateToProps)(EmployeeModification);
