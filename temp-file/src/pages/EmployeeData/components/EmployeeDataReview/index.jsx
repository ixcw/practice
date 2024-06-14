/*
Author:韦靠谱
Description:职工资料审核
Date:2023/04/24
Modified By:
*/

import React, { useState, useRef,useEffect } from 'react'
import { Modal, Tabs, Button, Input, Alert, Space, Select,Divider,Empty, Row, Col, Spin, Image, Table, message, Form, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { useReactToPrint } from 'react-to-print';
import { connect } from 'dva';
import { EmployeeData as namespace } from '@/utils/namespace';
import styles from '../EmployeeDetails/StaffDetails.less'
// import StaffDetails from '../EmployeeDetails/StaffDetails'
import accessTokenCache from "@/caches/accessToken";

const { TextArea } = Input;
const { confirm } = Modal
const cssBox = {
    title: { textAlign: 'center', color: '#1890ff' },
    box_1: { border: '1px dashed #1890ff', borderRadius: '5px', padding: '10px', marginBottom: '20px' }
}

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

function index(props) {
    const token = accessTokenCache() && accessTokenCache();
    const printDom = useRef()

    // 打开关闭弹窗
    const { dispatch, DetailLoading,getCenterStatWorkers, getTeacherList,ListDataPageSize, AllScreening,ListDataCurrentPage, physResultOptions,EmployeeDataReviewOpen, showEmployeeDataReview, getWorkerDataCenterFindWorkerInfo } = props
    // 驳回展示内容默认状态
    let [RejectionDisplay, setRejectionDisplay] = useState(false)
    // 通过展示内容默认状态
    let [PassDisplay, setPassDisplay] = useState(false)
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    const [ReviewTextArea, setReviewTextArea] = useState('');
    const [AuditRecord, setAuditRecord] = useState([])
    const [GroundsRejection, setGroundsRejection] = useState('')
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([])
    const [ReportImage, setReportImage] = useState([])
    const [okLoading, setOkLoading] = useState(false)
    // 体检信息相关
    const [PhysicalListData, setPhysicalListData] = useState([])
    const [NewPhysicalListData, setNewPhysicalListData] = useState([])
    const [PhysResultResultChange, setPhysResultResultChange] = useState(null)
    const [PhysicalYearsChange, setPhysicalYearsChange] = useState(null)

    // 标签页切换
    const onChangeTabs = (key) => {
        if (key == 'AuditRecord') {
            setLoading(true)
            dispatch({
                type: namespace + "/getWorkerDataCenterFindAuditRecordApi",
                payload: { userId: getWorkerDataCenterFindWorkerInfo?.workerId, examineStatus: 4 },
                callback: (res) => {
                    if (res.result) {
                        setLoading(false)
                        setAuditRecord(res?.result?.map(item => { return { ...item, key: item.id } }))
                    }
                }
            })
        }
    };

    // 体检信息相关 --- start
    useEffect(() => {
        if (EmployeeDataReviewOpen) {
            setPhysicalListData(prevListData => getWorkerDataCenterFindWorkerInfo?.reportVos?.map(item => {
                return { ...item, key: item.id }
            }))
            setNewPhysicalListData(prevListData => getWorkerDataCenterFindWorkerInfo?.reportVos?.map(item => {
                return { ...item, key: item.id }
            }))
        }
    }, [EmployeeDataReviewOpen, getWorkerDataCenterFindWorkerInfo])

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

      // 体检信息相关 --- end

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
            title: '审核结果',
            dataIndex: 'examineStatus',
            key: 'examineStatus',
            render: (_, record) => (record.examineStatus == 3 ? '已通过' : record.examineStatus == 4 ? '已驳回' : `未识别状态码--${record.examineStatus}`)
        },
        {
            title: '驳回理由',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: '驳回时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (_, record) => (new Date(record.createTime).getFullYear() + '年' + (new Date(record.createTime).getMonth() + 1) + '月' + new Date(record.createTime).getDate() + '日-' + new Date(record.createTime).getHours() + ':' + new Date(record.createTime).getMinutes()),
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

    //   上传组件配置信息
    const UploadProps = {
        name: 'file',
        listType: "picture-card",
        action: '/auth/web/front/v1/upload/uploadImage',
        headers: { Authorization: token },
        accept: '.jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PNG,.GIF,.BMP',
        onChange({ file: info, fileList: newFileList }) {
            setFileList(newFileList)
            // if (info.file.status === 'uploading') {
            //     // 上传中
            // }
            // if (info.file.status === 'done') {
            //     // 上传完成
            // } else if (info.file.status === 'error') {
            //     // 上传出错
            //     message.error(`${info.file.name} 上传出错`);
            // }
        },
    };
    const handlePreviewCancel = () => setPreviewOpen(false);
    const handlePreview = (file) => {
        setPreviewImage('')
        setPreviewImage(file.response?.data || file.thumbUrl || getBase64(file.originFileObj));
        setPreviewTitle(file.name);
        setPreviewOpen(true);
    };
    const uploadButton = (<div><PlusOutlined /><div style={{ marginTop: 8 }}>点击上传</div></div>);

    // 关闭
    const handleCancel = () => {
        showEmployeeDataReview(false)
        setRejectionDisplay(false)
        setPassDisplay(false)
        setGroundsRejection('')
        setFileList([])
        setReportImage([])
    };
    // 驳回理由
    const onTextAreaChange = (e) => {
        setReviewTextArea(e.target.value)
    }

    // 通过
    const BeApproved = () => {
			// 需要上传确认件图片的审核的逻辑
			setRejectionDisplay(false)
			setPassDisplay(!PassDisplay)

		//2024-04-11 根据最新需求隐藏上传确认件图片的审核功能
        //以下逻辑为直接通过审核
        		confirm({
							title: '确认是否审核通过？',
							icon: <ExclamationCircleOutlined />,
							content: '',
							onOk() {
								setOkLoading(true)
								dispatch({
									type: namespace + '/postWorkerDataCenterAuditWorkerInfoPassApi',
									payload: {
										userId: getWorkerDataCenterFindWorkerInfo?.workerId,
										passFlag: 1,
									},
									callback: res => {
										if (res.result === null) {
											setOkLoading(false)
											getTeacherList(ListDataCurrentPage, ListDataPageSize, AllScreening)
											getCenterStatWorkers()
											handleCancel()
											message.success('审核通过！')
										} else {
											setOkLoading(false)
										}
									}
								})
							}
						})
        
		}
    
    // 驳回
    const ReviewReject = () => {
        setPassDisplay(false)
        setRejectionDisplay(!RejectionDisplay)
    }
    // 打印
    const handlePrint = useReactToPrint({
        content: () => printDom.current,
    });

    // 提交审核
    const PassReviewSubmit = () => {
        if (fileList.length <= 0) {
            return message.error('请上传确认件图片！');
        } else {
            setLoading(true)
            dispatch({
                type: namespace + "/postWorkerDataCenterAuditWorkerInfoPassApi",
                payload: {
                    userId: getWorkerDataCenterFindWorkerInfo?.workerId,
                    passFlag: 1,
                    confirmImage: fileList?.map(item => { return (item?.response?.data) }).join(",")
                },
                callback: (res) => {
                    if (res.result === null) {
                        setLoading(false)
                        getTeacherList(ListDataCurrentPage, ListDataPageSize, AllScreening)
                        getCenterStatWorkers()
                        handleCancel()
                        message.success('审核通过！')
                    } else { setLoading(false) }
                }
            })
        }
    }


    // 提交驳回
    const RejectReviewSubmit = () => {
        if (ReviewTextArea) {
            setLoading(true)
            dispatch({
                type: namespace + "/postWorkerDataCenterAuditWorkerInfoApi",
                payload: {
                    userId: getWorkerDataCenterFindWorkerInfo?.workerId,
                    passFlag: 0,
                    refuseReason: ReviewTextArea
                },
                callback: (res) => {
                    if (res.result === null) {
                        setLoading(false)
                        getTeacherList(ListDataCurrentPage, ListDataPageSize, AllScreening)
                        getCenterStatWorkers()
                        handleCancel()
                        message.success('已驳回！')
                    } else { 
                        setLoading(false) 
                    }
                }
            })
        } else {
            message.error('驳回理由为必填项');
        }
    }




    return (
        <>
            <Modal title="职工审核" visible={EmployeeDataReviewOpen} destroyOnClose={true} footer={null} onCancel={handleCancel} width={700} bodyStyle={{ padding: '0 24px 24px 24px' }}>
                <Tabs defaultActiveKey="1" onChange={onChangeTabs} className={styles['EmployeeDataReview']}>
                    <Tabs.TabPane tab="职工详情" key="EmployeeInformation" >
                        {/* <StaffDetails ref={componentRef} /> */}
                        <Spin spinning={DetailLoading}>
                            <div ref={printDom} className={styles["printPage"]}>
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
                                {getWorkerDataCenterFindWorkerInfo?.educationVos.length > 0 &&
                                    <div>
                                        <h3 style={cssBox.title}>学历信息</h3>
                                        <div style={cssBox.box_1}>
                                            {
                                                getWorkerDataCenterFindWorkerInfo?.educationVos?.map(item => {
                                                    return (
                                                        <div key={item.id} style={{ textAlign: "center", paddingBottom: '20px' }}>
                                                            <Row>
                                                                <Col span={12} style={{ textAlign: "center" }}>
                                                                    <div>开始时间：{item?.startTime}</div>
                                                                    <div>毕业院校：{item?.schoolName}</div>
                                                                    <div>学位：{(item?.degreeTypeText && item?.degreeTypeText != '无' ? item?.degreeTypeText : '') + (item?.degreeLevelText && item?.degreeLevelText != '无' ? item?.degreeLevelText : '')}</div>
                                                                    <div>学历性质：{item?.natureText}</div>
                                                                    <div style={{marginTop:'10px'}}>毕业证</div>
                                                                    { item?.diploma ? <Image width={250} height={120} src={item?.diploma} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无毕业证图片' /> }
                                                                </Col>
                                                                <Col span={12} style={{ textAlign: "center" }}>
                                                                    <div>结束时间：{item?.endTime}</div>
                                                                    <div>学历层次：{item?.educationText}</div>
                                                                    <div>就读专业：{item?.major}</div>
                                                                    <div>学制：{item?.studyYearText}</div>
                                                                    <div style={{marginTop:'10px'}}>学位证</div>
                                                                    { item?.degree ? <Image width={250} height={120} src={item?.degree} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无学位证图片' /> }
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    )
                                                })
                                            }

                                        </div>
                                    </div>
                                }

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
                        </Spin>


                        <div style={{ textAlign: 'center' }}>
                            <Button onClick={BeApproved} loading={okLoading} type="primary" size='large' style={{ width: '100px', marginRight: '100px' }}>通过</Button>
                            <Button onClick={ReviewReject} type="primary" size='large' style={{ width: '100px' }} danger>驳回</Button>
                        </div>


                        <div style={{ display: `${RejectionDisplay ? 'block' : 'none'}` }}>
                            <Row style={{ marginTop: '15px' }} >
                                <Col span={3} >驳回理由：</Col>
                                <Col span={21} >
                                    <TextArea rows={4} onChange={onTextAreaChange} placeholder="请填写驳回理由..." />
                                </Col>
                            </Row>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button loading={loading} onClick={RejectReviewSubmit} type="primary" size='large' style={{ width: '100px', marginTop: '20px' }}>提交</Button>
                            </div>
                        </div>

                        {/* <div style={{ textAlign: 'center', marginBottom: 10, display: `${PassDisplay ? 'block' : 'none'}` }}>
                            <Button onClick={handlePrint} type="dashed" style={{ width: '100%', height: '100px', margin: '20px 0', fontWeight: 600, fontSize: '16px', color: '#555555' }}>打印预览</Button>
                            <Upload {...UploadProps} fileList={fileList} onPreview={handlePreview}>
                                {fileList.length >= 5 ? null : uploadButton}
                            </Upload>
                            <Alert style={{ marginTop: 6 }} message={`温馨提示：确认件每页都需要 加盖学校公章，并拍照以JPG/PNG等图片格式进行上传。`} type="warning" showIcon />
                            <Button loading={loading} type="primary" size='large' style={{ width: '100px', marginTop: '20px' }} onClick={PassReviewSubmit} >提交</Button>
                        </div>

                        <Modal visible={previewOpen} title={previewTitle} footer={null} onCancel={handlePreviewCancel}>
                            <img style={{ width: '100%' }} alt={previewTitle} src={previewImage} />
                        </Modal> */}

                    </Tabs.TabPane>
                    <Tabs.TabPane tab="审核记录" key="AuditRecord">
                        <Spin spinning={loading}>
                            <Table pagination={false} dataSource={AuditRecord} columns={AuditRecordColumns} />
                        </Spin>
                        {GroundsRejection &&
                            <div style={{ marginTop: '15px' }}>
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
        physResultOptions: state[namespace].physResultOptions,
    }
}

export default connect(mapStateToProps)(index);
