/*
Author:韦靠谱
Description:教师审核
Date:2023/05/11
*/

import React, { useEffect, useState, useRef, memo } from 'react'
import { Descriptions,Modal, Tabs, Image, Table, Col, Alert, Divider, Upload, message, Row, Button, Input, Select, Empty, Space, Spin } from 'antd';
import { useReactToPrint } from 'react-to-print';
import { LoadingOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { connect } from 'dva';
import { TeacherData as namespace } from '@/utils/namespace';
import { excelType } from "@/utils/const";
import accessTokenCache from "@/caches/accessToken";
import styles from './TeacherDataReview.less'
const { TextArea } = Input;
const { confirm } = Modal
const cssBox = {
  title: { textAlign: 'center',margin: '15px 0 5px 0',fontSize: '16px',fontWeight: 800 },
  box_1: { border: '1px dashed #bababa', borderRadius: '5px', padding: '10px', marginBottom: '20px' }
}
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
function TeacherDataReview(props) {
  const { TeacherDataReviewOpen, StatTeacherStatisticsApi, ListDataCurrentPage, getTeacherList,ListDataPageSize, AllScreening, showTeacherDataReview, trainOptions, physResultOptions, TeacherDetailId, dispatch } = props;
  const printDom = useRef()
  const token = accessTokenCache() && accessTokenCache();
  const [loading, setLoading] = useState(true)
  const [TeacherDetail, setTeacherDetail] = useState({})
  const [TrainingListData, setTrainingListData] = useState([])
  const [NewTrainingListData, setNewTrainingListData] = useState([])
  const [RejectionDisplay, setRejectionDisplay] = useState(false)
  const [PassDisplay, setPassDisplay] = useState(false)
  const [AuditRecord, setAuditRecord] = useState([])
  const [ReportImage, setReportImage] = useState([])
  const [PhysicalListData, setPhysicalListData] = useState([])
  const [NewPhysicalListData, setNewPhysicalListData] = useState([])
  const [PhysResultResultChange, setPhysResultResultChange] = useState(null)
  const [PhysicalYearsChange, setPhysicalYearsChange] = useState(null)
  const [ReviewTextArea, setReviewTextArea] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([])
  const [okLoading, setOkLoading] = useState(false)

  //   上传组件配置信息
  const UploadProps = {
    name: 'file',
    listType: "picture-card",
    action: '/auth/web/front/v1/upload/uploadImage',
    headers: { Authorization: token },
    accept: '.jpg,.jpeg,.png,.bmp,.JPG,.JPEG,.PNG,.BMP',
    onChange({ fileList: newFileList }) {
      setFileList(newFileList)
    },
  };
  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = (file) => {
    setPreviewImage('')
    setPreviewImage(file.response?.data || file.thumbUrl || getBase64(file.originFileObj));
    setPreviewTitle(file.name);
    setPreviewOpen(true);
  };
  const uploadButton = (<div><PlusOutlined /><div style={{ marginTop: 8 }}>点击上传</div></div>);

  useEffect(() => {
    if (TeacherDataReviewOpen && !!TeacherDetailId) {
			setLoading(true)
			dispatch({
				type: namespace + '/viewTeacherDetail',
				payload: { id: TeacherDetailId },
				callback: res => {
					if (res) {
						setLoading(res.result && res.result.length > 0)
						setTeacherDetail(res?.result)
						setTrainingListData(
							res?.result?.trainList?.map(item => {
								return {
									...item,
									key: item.id,
									trainDateYears: new Date(item.trainDate).getFullYear(),
									trainDateTime: new Date(item.trainDate).getMonth() + 1 + '月' + new Date(item.trainDate).getDate() + '日',
									perception: `培训感悟：${item.perception ? item.perception : '无'}`
								}
							})
						)
						setNewTrainingListData(
							res?.result?.trainList?.map(item => {
								return {
									...item,
									key: item.id,
									trainDateYears: new Date(item.trainDate).getFullYear(),
									trainDateTime: new Date(item.trainDate).getMonth() + 1 + '月' + new Date(item.trainDate).getDate() + '日',
									perception: `培训感悟：${item.perception ? item.perception : '无'}`
								}
							})
						)
						setPhysicalListData(
							res?.result?.physList?.map(item => {
								return { ...item, key: item.id }
							})
						)
						setNewPhysicalListData(
							res?.result?.physList?.map(item => {
								return { ...item, key: item.id }
							})
						)
					}
				}
			})
    }
  }, [TeacherDataReviewOpen])

  // 家庭信息列头
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
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '工作省份',
      dataIndex: 'workProvince',
      key: 'workProvince',
    },
    {
      title: '工作情况',
      dataIndex: 'workTypeText',
      key: 'workTypeText',
    },
    {
      title: '工作单位',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: '政治面貌',
      dataIndex: 'politicsText',
      key: 'politicsText',
    },
    {
      title: '家庭地址',
      dataIndex: 'address',
      key: 'address',
    },
  ]
  // 工作信息列头
  const jobColumns = [
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: '截止时间',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: '工作单位',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: '职务',
      dataIndex: 'post',
      key: 'post',
    }
  ]
  // 培训信息列头
  const trainingColumns = [
    {
      title: '培训年份',
      dataIndex: 'trainDateYears',
      key: 'trainDateYears',
    },
    {
      title: '培训级别',
      dataIndex: 'trainLevelText',
      key: 'trainLevelText',
    },
    {
      title: '培训形式',
      dataIndex: 'trainWayText',
      key: 'trainWayText',
    },
    {
      title: '培训时间',
      dataIndex: 'trainDateTime',
      key: 'trainDateTime',
    },
    {
      title: '培训地点',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '培训内容',
      dataIndex: 'content',
      key: 'content',
    }
  ]
  // 体检信息列头
  const CheckUpColumns = [
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
    }
  ]
  // 审核记录列头
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
  ]

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

  const TrainingYearsOptions = TeacherDetail?.trainList && removeDuplicates(TeacherDetail?.trainList?.map(item => { return { value: item.trainDate, label: new Date(item.trainDate).getFullYear() } }))
  const PhysicalYearsOptions = TeacherDetail?.physList && removeDuplicates(TeacherDetail?.physList?.map(item => { return { value: item.year, label: item.year } }))
  const [TrainingYearsChange,setTrainingYearsChange] = useState(null)
  const [MedicalFormChange,setMedicalFormChange] = useState(null)
    const handleTrainingYearsChange = (value) => {
      setTrainingYearsChange(value)
      if (!value) {
        setTrainingListData(NewTrainingListData?.filter(item => (MedicalFormChange ? item.trainWay == MedicalFormChange : true)))
      } else {
        setTrainingListData(NewTrainingListData?.filter(item => new Date(item.trainDate).getFullYear() == new Date(value).getFullYear() && (MedicalFormChange ? item.trainWay == MedicalFormChange : true)))
      }
    }
    const handleMedicalFormChange = (value) => {
      setMedicalFormChange(value)
      if (!value) {
        setTrainingListData(NewTrainingListData?.filter(item => (TrainingYearsChange ? new Date(item.trainDate).getFullYear() == new Date(TrainingYearsChange).getFullYear() : true)))
      } else {
        setTrainingListData(NewTrainingListData?.filter(item => item.trainWay - 0 == value && (TrainingYearsChange ? new Date(item.trainDate).getFullYear() == new Date(TrainingYearsChange).getFullYear() : true)))
      }
    }
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

  // 驳回理由
  const onTextAreaChange = (e) => {
    setReviewTextArea(e.target.value)
  }

  // 标签页切换
  const onChangeTabs = (key) => {
    if (key == 'AuditRecord') {
      setLoading(true)
      dispatch({
        type: namespace + "/postTeacherListExamineRecordApi",
        payload: { userId: TeacherDetailId, examineResult: 4 },
        callback: (res) => {
          if (res.result) {
            setLoading(false)
            setAuditRecord(res?.result?.map(item => { return { ...item, key: item.id } }))
          }
        }
      })
    }
  };

  // 审核通过
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
					type: namespace + '/postTeacherSaveExamineResultApi',
					payload: {
						userId: TeacherDetailId,
						passFlag: 1
					},
					callback: res => {
						if (res.result === null) {
							message.success('审核通过！')
							setOkLoading(false)
							showTeacherDataReview(!TeacherDataReviewOpen)
							setFileList([])
							getTeacherList(ListDataCurrentPage, ListDataPageSize, AllScreening)
							StatTeacherStatisticsApi()
						} else {
							setOkLoading(false)
						}
					}
				})
			}
		})
	}

  // 审核驳回
  const ReviewReject = () => {
    setPassDisplay(false)
    setRejectionDisplay(!RejectionDisplay)
  }

  // 打印
  const handlePrint = useReactToPrint({
    content: () => printDom.current,
  });


  // 提交--驳回
  const AuditSubmitReject = () => {
    if (ReviewTextArea) {
      setLoading(true)
      dispatch({
        type: namespace + "/postTeacherSaveExamineResultApi",
        payload: {
          userId: TeacherDetailId,
          passFlag: 0,
          rejectReason: ReviewTextArea
        },
        callback: (res) => {
          if (res.result === null) {
            message.success('审核驳回！');
            setLoading(false)
            showTeacherDataReview(!TeacherDataReviewOpen)
            setFileList([])
            getTeacherList(ListDataCurrentPage, ListDataPageSize, AllScreening)
            StatTeacherStatisticsApi()
          } else { setLoading(false) }
        }
      })
    } else {
      message.error('驳回理由为必填项');
    }
  }


  // 提交--通过
  const AuditSubmitPass = () => {
		if (fileList.length <= 0) return message.success('请上传确认件图片！')
		setLoading(true)
		dispatch({
			type: namespace + '/postTeacherSaveExamineResultApi',
			payload: {
				userId: TeacherDetailId,
				passFlag: 1,
				confirmPng: fileList
					?.map(item => {
						return item?.response?.data
					})
					.join(';')
			},
			callback: res => {
				if (res.result === null) {
					message.success('审核通过！')
					setLoading(false)
					showTeacherDataReview(!TeacherDataReviewOpen)
					setFileList([])
          getTeacherList(ListDataCurrentPage, ListDataPageSize, AllScreening)
          StatTeacherStatisticsApi()
				} else {
					setLoading(false)
				}
			}
		})
	}

  const onCancel = () => {
    showTeacherDataReview(!TeacherDataReviewOpen)
    setFileList([])
    setRejectionDisplay(null)
    setPassDisplay(null)
  }

  return (
    <>
      <Modal title="审核" visible={TeacherDataReviewOpen} width={830} onCancel={onCancel} destroyOnClose={true} footer={null} bodyStyle={{ padding: '0 24px 24px 24px' }}>
        <Tabs defaultActiveKey="1" className={styles['TeacherDataReview']} onChange={onChangeTabs}>
          <Tabs.TabPane tab="教师信息" key="BasicInformation">
            <Spin spinning={loading}>
              <div ref={printDom} className={styles["printPage"]}>
                <div>
                  <h3 style={cssBox.title}>基础信息</h3>
                  <div style={cssBox.box_1}>
                    <Row>
                      <Col span={20}>
                      <Descriptions>
                        <Descriptions.Item label="姓名">{TeacherDetail?.userName}</Descriptions.Item>
                        <Descriptions.Item label="性别">{TeacherDetail?.sexText}</Descriptions.Item>
                        <Descriptions.Item label="民族">{TeacherDetail?.nationText}</Descriptions.Item>
                        <Descriptions.Item label="籍贯" span={3}>{TeacherDetail?.areaName}</Descriptions.Item>
                        <Descriptions.Item label="证件类型">{TeacherDetail?.docTypeName ? TeacherDetail?.docTypeName : '居民身份证'}</Descriptions.Item>
                        <Descriptions.Item label="证件号码">{TeacherDetail?.identityCard}</Descriptions.Item>
                        <Descriptions.Item label="年龄">{TeacherDetail?.age}</Descriptions.Item>
                        <Descriptions.Item label="婚姻状况">{TeacherDetail?.marryText}</Descriptions.Item>
                        <Descriptions.Item label="政治面貌">{TeacherDetail?.politText}</Descriptions.Item>
                      </Descriptions>
                      </Col>
                      <Col span={4}>
                      { TeacherDetail.photo ? <Image width={100} height={120} src={TeacherDetail.photo} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无一寸照' /> }
                      </Col>
                    </Row>
                    <Descriptions>
                    <Descriptions.Item label="入党时间">{TeacherDetail?.partyTime && new Date(TeacherDetail?.partyTime).getFullYear() + '-' + (new Date(TeacherDetail?.partyTime).getMonth() + 1) + '-' + new Date(TeacherDetail?.partyTime).getDate()}</Descriptions.Item>
                    <Descriptions.Item label="所属支部名称">{TeacherDetail?.partyOrgName}</Descriptions.Item>
                    <Descriptions.Item label="党内职务">{TeacherDetail?.partyPost}</Descriptions.Item>
                    <Descriptions.Item label="联系电话">{TeacherDetail?.phone}</Descriptions.Item>
                    <Descriptions.Item label="紧急联系人">{TeacherDetail?.urgentName}</Descriptions.Item>
                    <Descriptions.Item label="紧急联系电话">{TeacherDetail?.urgentPhone}</Descriptions.Item>
                    <Descriptions.Item label="家庭住址" span={3}>{TeacherDetail?.address}</Descriptions.Item>
                  </Descriptions>
                    <Row style={{ textAlign: 'center' }}>
                    <Col span={11}>
                      { TeacherDetail.identityDown ? <Image width={150} height={100} src={TeacherDetail.identityDown} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无身份证国徽面图片' /> }
                     </Col>
                    <Col span={11}>
                    { TeacherDetail.identityUp ? <Image width={150} height={100} src={TeacherDetail.identityUp} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无身份证人像面图片' /> }
                     </Col>
                  </Row>
                  </div>
                </div>
                <div>
                  <h3 style={cssBox.title}>家庭信息</h3>
                  <Table columns={familyColumns} dataSource={TeacherDetail?.familyList?.map(item => { return { ...item, key: item.id } })} bordered pagination={false} />
                </div>
                <div>
                  <h3 style={cssBox.title}>档案信息</h3>
                  <div style={cssBox.box_1}>
                  <Descriptions>
                    <Descriptions.Item label="教师类别">{TeacherDetail?.teacherTypeText}</Descriptions.Item>
                    <Descriptions.Item label="特岗教师">{TeacherDetail?.specialTeacherText}</Descriptions.Item>
                    <Descriptions.Item label="学段">{TeacherDetail?.studyName}</Descriptions.Item>
                    <Descriptions.Item label="编制所在单位">{TeacherDetail?.schoolName}</Descriptions.Item>
                    <Descriptions.Item label="实际工作单位">{TeacherDetail?.workSchoolName}</Descriptions.Item>
                    <Descriptions.Item label="抽用截止时间">{TeacherDetail?.secondEndTime}</Descriptions.Item>
                    <Descriptions.Item label="进入编制所在单位时间">{TeacherDetail?.joinSchoolTime && new Date(TeacherDetail?.joinSchoolTime).getFullYear() + '-' + (new Date(TeacherDetail?.joinSchoolTime).getMonth() + 1) + '-' + new Date(TeacherDetail?.joinSchoolTime).getDate()}</Descriptions.Item>
                    <Descriptions.Item label="进入编制所在单位方式">{TeacherDetail?.jonSchoolWayText}</Descriptions.Item>
                    <Descriptions.Item label="在岗情况">{TeacherDetail?.isPostText}</Descriptions.Item>
                    <Descriptions.Item label="所属教研组">{TeacherDetail?.teachGroups}</Descriptions.Item>
                    <Descriptions.Item label="所在处室">{TeacherDetail?.orgName}</Descriptions.Item>
                    <Descriptions.Item label="职务">{TeacherDetail?.postName}</Descriptions.Item>
                    <Descriptions.Item label="参加工作时间"></Descriptions.Item>
                    <Descriptions.Item label="教龄"></Descriptions.Item>
                    <Descriptions.Item label="档案年龄"></Descriptions.Item>
                    <Descriptions.Item label="最高学历">{TeacherDetail?.maxEducText}</Descriptions.Item>
                    <Descriptions.Item label="最高学历性质">{TeacherDetail?.educTypeText}</Descriptions.Item>
                    <Descriptions.Item label="最高职称">{TeacherDetail?.postTitleText}</Descriptions.Item>
                    <Descriptions.Item label="获得职称时间">{TeacherDetail?.titleTime && new Date(TeacherDetail?.titleTime).getFullYear() + '-' + (new Date(TeacherDetail?.titleTime).getMonth() + 1) + '-' + new Date(TeacherDetail?.titleTime).getDate()}</Descriptions.Item>
                    <Descriptions.Item label="岗位类别">{TeacherDetail?.postTypeText}</Descriptions.Item>
                    <Descriptions.Item label="现聘任岗位">{TeacherDetail?.enjoyPostLevelText}</Descriptions.Item>
                    <Descriptions.Item label="岗位等级">{TeacherDetail?.postLevelText}</Descriptions.Item>
                    <Descriptions.Item label="专业技术或工勤技能职务" span={2}>{TeacherDetail?.postFunctionText}</Descriptions.Item>
                    <Descriptions.Item label="分管工作" span={2}>{TeacherDetail?.jobContent}</Descriptions.Item>
                  </Descriptions>
                    <Row style={{ padding: '10px 0',pageBreakInside: 'avoid' }} gutter={[8, 0]}>
                    <Col span={6}>职称岗位相关证书</Col>
                    {TeacherDetail.postTitlePng ?
                      (TeacherDetail.postTitlePng.includes(";") ? TeacherDetail.postTitlePng.split(';') : [TeacherDetail.postTitlePng])?.map((item, index) => {
                        return (
                          <Col span={6} key={index}>
                            <Image width={150} height={100} src={item} />
                          </Col>
                        )
                      }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无图片' />
                    }
                    </Row>
                    {/* <Row style={{ padding: '10px 0',pageBreakInside: 'avoid' }} gutter={[8, 0]}>
                      <Col span={6}>进入本单位文号：<div>{TeacherDetail?.jonSchoolNo}</div></Col>
                      {TeacherDetail?.contractFile ?
                        TeacherDetail.contractFile.includes(";") ? TeacherDetail.contractFile.split(';') : [TeacherDetail.contractFile]?.map((item, index) => {
                          return (
                            <Col span={6} key={index}>
                              <Image width={150} height={100} src={item} />
                            </Col>
                          )
                        }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无图片' />
                      }
                    </Row> */}
                    <Row style={{ padding: '10px 0',pageBreakInside: 'avoid' }} gutter={[8, 0]}>
                      <Col span={6}>聘用合同编号：<div>{TeacherDetail?.contractNo}</div></Col>
                      {TeacherDetail?.jonSchoolFile ?
                        TeacherDetail.jonSchoolFile.includes(";") ? TeacherDetail.jonSchoolFile.split(';') : [TeacherDetail.jonSchoolFile]?.map((item, index) => {
                          return (
                            <Col span={6} key={index}>
                              <Image width={150} height={100} src={item} />
                            </Col>
                          )
                        }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无图片' />
                      }
                    </Row>
                    <h4 style={cssBox.title}>工作经历</h4>
                    <Table style={{pageBreakInside: 'avoid'}} columns={jobColumns} dataSource={TeacherDetail?.jobList?.map(item => { return { ...item, key: item.id } })} bordered pagination={false} />
                    <h4 style={cssBox.title}>教育经历</h4>

                  <div className={styles['miniBox']}>
                    <h4 style={{ textAlign: 'center',fontWeight: 800,fontSize: '14px' }}>第一学历</h4>
                    <Row style={{ padding: '10px 0' }}>
                      <Col span={12}>开始时间：{TeacherDetail.firstEdu?.startTime}</Col>
                      <Col span={12}>截至时间：{TeacherDetail.firstEdu?.endTime}</Col>
                    </Row>
                    <Row style={{ padding: '10px 0' }}>
                      <Col span={12}>学历层次：{TeacherDetail.firstEdu?.educationText}</Col>
                      <Col span={12}>学历性质：{TeacherDetail.firstEdu?.natureText}</Col>
                    </Row>
                    <Row style={{ padding: '10px 0' }}>
                      <Col span={12}>学位：{(TeacherDetail.firstEdu?.degreeTypeText && TeacherDetail.firstEdu?.degreeTypeText != '无' ? TeacherDetail.firstEdu?.degreeTypeText : '') + (TeacherDetail.firstEdu?.degreeLevelText && TeacherDetail.firstEdu?.degreeLevelText != '无' ? TeacherDetail.firstEdu?.degreeLevelText : '')}</Col>
                      <Col span={12}>学制：{TeacherDetail.firstEdu?.studyYearText}</Col>
                    </Row>
                    <Row style={{ padding: '10px 0' }}>
                      <Col span={24}>毕业院校：{TeacherDetail.firstEdu?.schoolName}</Col>
                    </Row>
                    <Row>
                      <Col span={24}>就读专业：{TeacherDetail.firstEdu?.major}</Col>
                    </Row>
                    <Row style={{ padding: '10px 0' }}>
                      <Col span={12}>
                        {TeacherDetail.firstEdu?.diploma ? <Image width={200} height={120} src={TeacherDetail.firstEdu?.diploma} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无毕业证图片' />}
                      </Col>
                      <Col span={12}>
                        {TeacherDetail.firstEdu?.degree ? <Image width={200} height={120} src={TeacherDetail.firstEdu?.degree} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无学位证图片' />}
                      </Col>
                    </Row>
                  </div>
                  <div className={styles['miniBox']}>
                    <h4 style={{ textAlign: 'center',fontWeight: 800,fontSize: '14px' }}>最高学历</h4>
                    <Row style={{ padding: '10px 0' }}>
                      <Col span={12}>开始时间：{TeacherDetail.topEdu?.startTime}</Col>
                      <Col span={12}>截至时间：{TeacherDetail.topEdu?.endTime}</Col>
                    </Row>
                    <Row style={{ padding: '10px 0' }}>
                      <Col span={12}>学历层次：{TeacherDetail.topEdu?.educationText}</Col>
                      <Col span={12}>学历性质：{TeacherDetail.topEdu?.natureText}</Col>
                    </Row>
                    <Row style={{ padding: '10px 0' }}>
                      <Col span={12}>学位：{(TeacherDetail.topEdu?.degreeTypeText && TeacherDetail.topEdu?.degreeTypeText != '无' ? TeacherDetail.topEdu?.degreeTypeText : '') + (TeacherDetail.topEdu?.degreeLevelText && TeacherDetail.topEdu?.degreeLevelText != '无' ? TeacherDetail.topEdu?.degreeLevelText : '')}</Col>
                      <Col span={12}>学制：{TeacherDetail.topEdu?.studyYearText}</Col>
                    </Row>
                    <Row style={{ padding: '10px 0' }}>
                      <Col span={24}>毕业院校：{TeacherDetail.topEdu?.schoolName}</Col>
                    </Row>
                    <Row>
                      <Col span={24}>就读专业：{TeacherDetail.topEdu?.major}</Col>
                    </Row>
                    <Row style={{ padding: '10px 0' }}>
                      <Col span={12}>
                        {TeacherDetail.topEdu?.diploma ? <Image width={200} height={120} src={TeacherDetail.topEdu?.diploma} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无毕业证图片' />}
                      </Col>
                      <Col span={12}>
                        {TeacherDetail.topEdu?.degree ? <Image width={200} height={120} src={TeacherDetail.topEdu?.degree} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无学位证图片' />}
                      </Col>
                    </Row>
                  </div>


                    {/* {TeacherDetail?.educationList?.length > 0 ?
                      TeacherDetail?.educationList?.map(item => {
                        return (
                          <div key={item.id} style={{pageBreakInside: 'avoid'}}>
                          <Row justify="space-around" align="middle" style={{ padding: '10px 0', textAlign: 'center' }}>
                            <Col span={8}>开始时间：{item.startTime}</Col>
                            <Col span={8}>截止时间：{item.endTime}</Col>
                          </Row>
                          <Row style={{ padding: '10px 0' }}>
                            <Col span={7} offset={1}>学历层次：{item.educationText}</Col>
                            <Col span={8}>学历性质：{item.natureText}</Col>
                            <Col span={8}>学位：{(item?.degreeTypeText && item?.degreeTypeText != '无' ? item?.degreeTypeText : '') + (item?.degreeLevelText && item?.degreeLevelText != '无' ? item?.degreeLevelText : '')}</Col>
                          </Row>
                          <Row style={{ padding: '10px 0 20px 0' }}>
                            <Col span={7} offset={1}>学制：{item.studyYearText}</Col>
                            <Col span={8}>就读专业：{item.major}</Col>
                            <Col span={8}>毕业院校：{item.schoolName}</Col>
                          </Row>
                          <Row justify="space-around" align="middle" style={{ textAlign: 'center' }}>
                            <Col span={8}>
                              <span>毕业证</span>
                              {item.diploma ? <Image width={200} height={120} src={item.diploma} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无毕业证图片' />}
                            </Col>
                            <Col span={8}>
                              <span>学位证</span>
                              {item.degree ? <Image width={200} height={120} src={item.degree} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无学位证图片' />}
                            </Col>
                          </Row>
                            <Divider />
                          </div>
                        )
                      }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />} */}
                    
                    
                    <h4 style={cssBox.title}>教师资格证情况</h4>
                    {TeacherDetail?.certificateList?.filter((item) => { return item.certType == 1 })?.length > 0 ?
                      TeacherDetail?.certificateList?.map(item => {
                        if (item.certType == '1') {
                          return (
                            <div key={item.id} style={{pageBreakInside: 'avoid'}}>
                              <Row>
                                <Col span={8}><p style={{ textAlign: 'center' }}>取得时间：{item.getTime}</p></Col>
                                <Col span={8}><p style={{ textAlign: 'center' }}>取得教资所属学段：{item.study}</p></Col>
                                <Col span={8}><p style={{ textAlign: 'center' }}>取得教资科目：{item.subjectName}</p></Col>
                              </Row>

                              <Row justify="space-around" align="middle">
                                {item.filePng != null && item.filePng !== '' ? (
                                  item.filePng.includes(";") ? (
                                    item.filePng.split(";").map((pngItem, index) => (
                                      <Col span={8} key={index}>
                                        <Image width={200} height={120} src={pngItem} />
                                      </Col>
                                    ))
                                  ) : (
                                    <Col span={8}>
                                      <Image width={200} height={120} src={item.filePng} />
                                    </Col>
                                  )
                                ) : (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'暂无图片'} />)}
                              </Row>

                              <Divider />
                            </div>
                          )
                        }
                      }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                    <h4 style={cssBox.title}>普通话证书及等级情况</h4>
                    {TeacherDetail?.certificateList?.filter((item) => { return item.certType == 2 })?.length > 0 ?
                      TeacherDetail?.certificateList?.map(item => {
                        if (item.certType == '2') {
                          return (
                            <div key={item.id} style={{pageBreakInside: 'avoid'}}>
                              <Row>
                                <Col span={12}><p style={{ textAlign: 'center' }}>取得时间：{item.getTime}</p></Col>
                                <Col span={12}><p style={{ textAlign: 'center' }}>取得普通话最高等级：{item.gradeText}</p></Col>
                              </Row>

                              <Row justify="space-around" align="middle">
                                {item.filePng != null && item.filePng !== '' ? (
                                  item.filePng.includes(";") ? (
                                    item.filePng.split(";").map((pngItem, index) => (
                                      <Col span={8} key={index}>
                                        <Image width={200} height={120} src={pngItem} />
                                      </Col>
                                    ))
                                  ) : (
                                    <Col span={8}>
                                      <Image width={200} height={120} src={item.filePng} />
                                    </Col>
                                  )
                                ) : (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'暂无图片'} />)}
                              </Row>

                              <Divider />
                            </div>
                          )
                        }
                      }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                    <h4 style={cssBox.title}>取得成果</h4>
                    {TeacherDetail?.achievementList?.length > 0 ?
                      TeacherDetail?.achievementList?.map(item => {
                        return (
                          <div key={item.id} style={{pageBreakInside: 'avoid'}}>
                            <Row style={{ padding: '10px 0' }}>
                              <Col span={9}>成果名称：{item.name}</Col>
                              <Col span={8}>取得成果时间：{item.getTime}</Col>
                              <Col span={7}>成果级别：{item.achiLevelText}</Col>
                            </Row>

                            <Row justify="space-around" align="middle">
                              {item.achiPng != null && item.achiPng !== '' ? (
                                item.achiPng.includes(";") ? (
                                  item.achiPng.split(";").map((pngItem, index) => (
                                    <Col span={8} key={index}>
                                      <Image width={200} height={120} src={pngItem} />
                                    </Col>
                                  ))
                                ) : (
                                  <Col span={8}>
                                    <Image width={200} height={120} src={item.achiPng} />
                                  </Col>
                                )
                              ) : (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'暂无图片'} />)}
                            </Row>

                            <Divider />
                          </div>
                        )
                      }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                    <h4 style={cssBox.title}>取得荣誉</h4>
                    {TeacherDetail?.honourList?.length > 0 ?
                      TeacherDetail?.honourList?.map(item => {
                        return (
                          <div key={item.id} style={{pageBreakInside: 'avoid'}}>
                            <Row style={{ padding: '10px 0' }} gutter={[8, 0]}>
                              <Col span={14}>取得荣誉时间：{item.getTime}</Col>
                              <Col span={10}>荣誉级别：{item.honourLevelText}</Col>
                              <Col span={14}>荣誉类型：{item.honourTypeText}</Col>
                              <Col span={10}>荣誉名称：{item.name}</Col>
                            </Row>

                            <Row justify="space-around" align="middle">
                              {item.honourPng != null && item.honourPng !== '' ? (
                                item.honourPng.includes(";") ? (
                                  item.honourPng.split(";").map((pngItem, index) => (
                                    <Col span={8} key={index}>
                                      <Image width={200} height={120} src={pngItem} />
                                    </Col>
                                  ))
                                ) : (
                                  <Col span={8}>
                                    <Image width={200} height={120} src={item.honourPng} />
                                  </Col>
                                )
                              ) : (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'暂无图片'} />)}
                            </Row>

                            <Divider />
                          </div>
                        )
                      }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                  </div>
                </div>
                <div>
                  <h3 style={cssBox.title}>培训情况</h3>
                  <Row style={{ padding: '10px 0' }}>
                    <Col span={9}>
                      <Space>培训年份 <Select options={TrainingYearsOptions} allowClear onChange={handleTrainingYearsChange} style={{ width: '100px' }} /></Space>
                    </Col>
                    <Col span={7} offset={8}>
                      <Space>培训形式 <Select options={trainOptions} allowClear onChange={handleMedicalFormChange} style={{ width: '100px' }} /></Space>
                    </Col>
                  </Row>
                  <Table style={{pageBreakInside: 'avoid'}} key={TrainingListData} columns={trainingColumns} dataSource={TrainingListData} bordered pagination={false} expandable={{ expandedRowRender: (record) => (<span>{record.perception}</span>), defaultExpandAllRows: true }} />
                </div>
                <div>
                  <h3 style={cssBox.title}>体检情况</h3>
                  <Row style={{ padding: '10px 0' }}>
                    <Col span={9}>
                      <Space>体检年度 <Select options={PhysicalYearsOptions} allowClear onChange={handlePhysicalYearsChange} getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: '100px' }} /></Space>
                    </Col>
                    <Col span={7} offset={8}>
                      <Space>体检结果 <Select options={physResultOptions} allowClear onChange={handlePhysResultResultChange} getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: '100px' }} /></Space>
                    </Col>
                  </Row>
                  {/* <Table columns={CheckUpColumns} dataSource={PhysicalListData} bordered pagination={false} />
                  <div style={{ marginTop: '15px', marginBottom: '20px' }} >
                    <Space style={{ marginBottom: '10px' }}>查看体检报告年份 <Select allowClear options={PhysicalYearsOptions} onChange={handlePhysicalYearsImgChange} getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: '100px' }} /></Space>
                    <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                      {
                        ReportImage?.map((item, index) => {
                          return (
                            <Image key={index} width={190} height={130} src={item.contentPng ? `${item.contentPng}` : "error"}
                              fallback="data:image/png;base64,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"
                            />
                          )
                        })
                      }
                    </div>
                  </div> */}
                   <div className={styles['miniBox']} style={{ marginTop: '10px' }}>
              {PhysicalListData?.length > 0 ?
                    PhysicalListData?.map(item => {
                      return (
                        <div key={item.id} style={{pageBreakInside: 'avoid'}}>
                          <Row style={{ padding: '10px 0' }} gutter={[8, 0]}>
                            <Col span={5}>体检年份：{item.year}</Col>
                            <Col span={6}>体检结果：{item.resultText}</Col>
                            <Col span={13}>诊断结果：{item.content}</Col>
                          </Row>
                          <Row justify="space-around" align="middle">
                            {item.contentPng != null && item.contentPng !== '' ? (
                              item.contentPng.includes(";") ? (
                                item.contentPng.split(";").map((pngItem, index) => (
                                  <Col span={8} key={index}>
                                    <Image width={200} height={100} src={pngItem} />
                                  </Col>
                                ))
                              ) : (
                                <Col span={8}>
                                  <Image width={200} height={120} src={item.contentPng} />
                                </Col>
                              )
                            ) : (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'暂无图片'} />)}
                          </Row>
                          <Divider />
                        </div>
                      )
                    }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                </div>



                </div>
              </div>
            </Spin>
            <div style={{ textAlign: 'center', marginBottom: 10 }}>
              <Button onClick={BeApproved} loading={okLoading} type="primary" size='large' style={{ width: '100px', marginRight: '100px' }}>通过</Button>
              <Button onClick={ReviewReject} type="primary" size='large' style={{ width: '100px' }} danger>驳回</Button>
            </div>
            {RejectionDisplay &&
              <>
                <Row style={{ marginTop: '15px' }} >
                  <Col span={3} >驳回理由：</Col>
                  <Col span={21} >
                    <TextArea rows={4} onChange={onTextAreaChange} placeholder="请填写驳回理由..." />
                  </Col>
                </Row>
                <div style={{ display: 'flex', justifyContent: 'center' }}><Button loading={loading} type="primary" size='large' onClick={AuditSubmitReject} style={{ width: '100px', marginTop: '20px' }}>提交</Button></div>
              </>
            }
            {/* {PassDisplay &&
              <div style={{ textAlign: 'center' }}>
                <Button onClick={handlePrint} type="dashed" style={{ width: '100%', height: '100px', margin: '20px 0', fontWeight: 600, fontSize: '16px', color: '#555555' }}>打印预览</Button>
                <Upload {...UploadProps} fileList={fileList} onPreview={handlePreview}>
                  {fileList.length >= 5 ? null : uploadButton}
                </Upload>
                <Alert style={{ marginTop: 6 }} message={`温馨提示：确认件每页都需要 加盖学校公章，并拍照以JPG/PNG等图片格式进行上传。`} type="warning" showIcon />
                <div style={{ display: 'flex', justifyContent: 'center' }}><Button loading={loading} type="primary" size='large' onClick={AuditSubmitPass} style={{ width: '100px', marginTop: '20px' }} >提交</Button></div>
              </div>
            } */}
            {/* <Modal visible={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
              <img style={{ width: '100%' }} alt={previewTitle} src={previewImage} />
            </Modal> */}
          </Tabs.TabPane>

          <Tabs.TabPane forceRender={true} tab="驳回记录" key="AuditRecord">
            <Spin spinning={loading}>
              <Table pagination={false} dataSource={AuditRecord} columns={AuditRecordColumns} />
            </Spin>
          </Tabs.TabPane>
        </Tabs >
      </Modal >
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    trainOptions: state[namespace].trainOptions,
    physResultOptions: state[namespace].physResultOptions,
  }
}

export default memo(connect(mapStateToProps)(TeacherDataReview))
