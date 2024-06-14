/*
Author:韦靠谱
Description:新建教师账号
Date:2023/05/05
*/
import React, { useEffect, useState, memo } from 'react'
import { Button, Modal, Tabs, Upload, Form, Input, Col, Space, Table, Row, Select, DatePicker, notification, Cascader, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import moment from 'moment';
import { connect } from 'dva'
import { TeacherData as namespace } from '@/utils/namespace'
import { phoneReg, IdCardReg } from '@/utils/const'
import accessTokenCache from "@/caches/accessToken";
import CustomDatePicker from '@/components/CustomDatePicker'
import styles from './NewTeacher.less'
const { Option } = Select;
const { RangePicker } = DatePicker;
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
function NewTeacher(props) {
  const {
    dispatch,
    nationOptions,
    workOptions,
    StatTeacherStatisticsApi,
    docTypeOptions,
    relationOptions,
    CityAddressOptionsText,
    SchoolSubjectsIdOptions,
    sexOptions,
    titleOptions,
    postInfoOptions,
    marriageOptions,
    politOptions,
    unitMethodOptions,
    eduOptions,
    eduNatureOptions,
    mandarinLevelOptions,
    postOptions,
    ProvinceCityAddressOptions,
    CityAddressOptions,
    NewTeacherOpen,
    getTeacherList,
    showNewTeacher,
    SchoolOrgsOptions,
    SchoolStudiesOptions,
    SchoolPostsOptions,
    degreeLevelOptions,
    degreeTypeOptions,
    studyYearOptions,
    teacherTypeOptions,
    postFunctionOptions,
    postTypeOptions,
    specTeacherOptions
  } = props
  const token = accessTokenCache() && accessTokenCache()
  const [SwitchTag, setSwitchTag] = useState('BasicInformation')
  const [handlePolit, setHandlePolit] = useState(null)
  const [IdCardAge, setIdCardAge] = useState(null)
  const [loading, setLoading] = useState(false)
  const [OneInchImageUrl, setOneInchImageUrl] = useState([]) //一寸照
  const [IDdownImageUrl, setIDdownImageUrl] = useState([]) //身份证人像
  const [IDImageUrl, setIDImageUrl] = useState([]) //身份证国徽
  const [MandarinImg, setMandarinImg] = useState([]) //普通话图片
  const [firstEduImg, setFirstEduImg] = useState({ one: [], two: [] }) //第一学历图片
  const [topEduImg, setTopEduImg] = useState({ one: [], two: [] }) //最高学历图片
  const [ProfessionalTitleImg, setProfessionalTitleImg] = useState([]) //职称图片
  const [docTypeValue, setDocTypeValue] = useState(1) //证件类型  1身份证 2护照...
  const [PreviewOpen, setPreviewOpen] = useState(false)
  const [isExamineModalOpen, setIsExamineModalOpen] = useState(false)
  const [PreviewImage, setPreviewImage] = useState(null)
  const [PreviewTitle, setPreviewTitle] = useState(null)
  const [basicForm] = Form.useForm() //基本信息
  const [ExamineForm] = Form.useForm() //考核信息

  const [fields1, setFields1] = useState([]) // 技能证书-教师资格证certificateListFields函数的字段
  const [imageLists1, setImageLists1] = useState([]) // 技能证书-教师资格证certificateListFields函数的图片列表
  const [fields2, setFields2] = useState([]) // 教育经历-学历证书-函数的字段
  const [imageLists2, setImageLists2] = useState([]) // 教育经历-学历证书-函数的图片列表
  // const [fields3, setFields3] = useState([]); // 教育经历-学位证书-函数的字段
  const [imageLists3, setImageLists3] = useState([]) // 教育经历-学位证书-函数的图片列表

  // 标签页切换
  const onChangeTabs = key => {
    setSwitchTag(key)
  }

  // 证件类型下拉框
  const handleDocTypeChange = value => {
    setDocTypeValue(value)
    // 清空年龄、身份证号、民族、籍贯
    basicForm.setFieldsValue({ age: null, identityCard: null, nationId: null, areaId: null })
  }

  // 所在处室下拉框
  const handleDepartmentChange = id => {
    basicForm.setFieldsValue({ postId: null })
    dispatch({
      type: namespace + '/getSchoolPosts',
      payload: { orgId: id }
    })
  }

  // 取得教师资格证学段
  const handleStudiesChange = (value, sjc) => {
    basicForm.setFieldsValue({ [sjc]: { subjectName: null } })
    dispatch({
      type: namespace + '/getSchoolSubjects',
      payload: { studyId: value.key }
    })
  }

  // 婚姻状况---关联数据
  const [MarryState, setMarryState] = useState(2)
  const handleMarryChange = value => {
    setMarryState(value)
    if (value != 2) {
      basicForm.setFieldsValue({ spouse: [{ relation: 3 }] })
    }
    if (value == 1) {
      basicForm.setFieldsValue({ Children: [{ relation: 4 }] })
    }
  }

  // 限制可选择的时间
  const disabledDate = current => {
    return current && current > moment().endOf('day')
  }

  // 教育经历开始时间不能大于结束时间
  const [EduStartDatePicker, setEduStartDatePicker] = useState(null)
  const [EduEndDatePicker, setEduEndDatePicker] = useState(null)
  const onEduStartDatePicker = value => {
    !value ? setEduStartDatePicker(null) : setEduStartDatePicker(new Date(Date.parse(value.format())).getTime())
  }
  const onEduEndDatePicker = value => {
    !value ? setEduEndDatePicker(null) : setEduEndDatePicker(new Date(Date.parse(value.format())).getTime())
  }
  const disabledEduStartDate = Value => {
    const startValue = new Date(Date.parse(Value.format())).getTime()
    if (!startValue || !EduEndDatePicker) {
      return false
    }
    return startValue.valueOf() > EduEndDatePicker.valueOf()
  }
  const disabledEduEndDate = Value => {
    const endValue = new Date(Date.parse(Value.format())).getTime()
    if (!endValue || !EduStartDatePicker) {
      return false
    }
    return EduStartDatePicker.valueOf() >= endValue.valueOf()
  }
  // 工作经历开始时间不能大于结束时间
  const [JobStartDatePicker, setJobStartDatePicker] = useState(null)
  const [JobEndDatePicker, setJobEndDatePicker] = useState(null)
  const onJobStartDatePicker = value => {
    !value ? setJobStartDatePicker(null) : setJobStartDatePicker(new Date(Date.parse(value.format())).getTime())
  }
  const onJobEndDatePicker = value => {
    !value ? setJobEndDatePicker(null) : setJobEndDatePicker(new Date(Date.parse(value.format())).getTime())
  }
  const disabledJobStartDate = Value => {
    const startValue = new Date(Date.parse(Value.format())).getTime()
    if (!startValue || !JobEndDatePicker) {
      return false
    }
    return startValue.valueOf() > JobEndDatePicker.valueOf()
  }
  const disabledJobEndDate = Value => {
    const endValue = new Date(Date.parse(Value.format())).getTime()
    if (!endValue || !JobStartDatePicker) {
      return false
    }
    return JobStartDatePicker.valueOf() >= endValue.valueOf()
  }

  // 根据身份证计算年龄
  const handleIdentityCardChange = event => {
    if (docTypeValue !== 1) return
    // 如果证件类型为身份证，再进行计算
    event.persist()
    const UUserCard = event.target.value
    if (UUserCard.match(IdCardReg)) {
      const date = `${UUserCard.substring(6, 10)}/${UUserCard.substring(10, 12)}/${UUserCard.substring(12, 14)}`
      setIdCardAge(moment().diff(date, 'years'))
    } else {
      setIdCardAge(null)
    }
  }

  const handlePolitChange = value => {
    // 政治面貌为群众时
    setHandlePolit(value)
    if (value == 2) {
      basicForm.setFieldsValue({ partyTime: null, partyPost: null, partyOrgName: null })
    }
  }

  useEffect(() => {
    setIdCardAge(IdCardAge)
    basicForm.setFieldsValue({ age: IdCardAge })
  }, [IdCardAge])

  // 职工创建提示
  const openNotificationWithIcon = type => {
    notification[type]({
      message: '新建教师提示',
      description: '您完成一名教师账号的新建！'
    })
  }

  // 对下拉框选项进行模糊搜索
  const TitleFilterOption = (input, option) => {
    return (option?.label ? option?.label : '').toLowerCase().includes(input.toLowerCase())
  }

  // 设置显示默认值
  useEffect(() => {
    if (NewTeacherOpen) {
      console.log('NewTeacherOpen')
      //   basicForm.setFieldsValue({ nationId: 1, sex: 0, marryId: 2, politId: 1, isPost: 1, studyId: 1, schoolId: JSON.parse(sessionStorage.getItem("gougou-front-userInfo"))?.v?.v?.schoolName })
      basicForm.setFieldsValue({ schoolId: JSON.parse(sessionStorage.getItem('gougou-front-userInfo'))?.v?.v?.schoolName })
    }
  }, [NewTeacherOpen])

  // 上传图片的预览
  const handlePreviewCancel = () => {
    setPreviewOpen(false)
    setPreviewImage('')
  }
  const handlePreview = file => {
    setPreviewImage('')
    setPreviewImage(file.response?.data || file.thumbUrl || getBase64(file.originFileObj))
    setPreviewTitle(file.name)
    setPreviewOpen(true)
  }

  //   上传组件配置信息
  const UploadProps = {
    name: 'file',
    listType: 'picture-card',
    action: '/auth/web/front/v1/upload/uploadImage',
    headers: { Authorization: token },
    accept: '.jpg,.jpeg,.png,.bmp,.JPG,.JPEG,.PNG,.BMP'
  }

  // 一寸照
  const OneInchChange = info => {
    if (info.file.status === 'removed') {
      setOneInchImageUrl([])
      return
    }
    if (info.file.status === 'error') {
      setOneInchImageUrl([info.file.thumbUrl])
      message.error('图片上传失败！')
      return
    }
    if (info.file.status === 'uploading') {
      setOneInchImageUrl([''])
      return
    }
    if (info.file.status === 'done') {
      if (info.file.response.code == 200) {
        setOneInchImageUrl([info.file.response.data])
      } else {
        message.error(info.file.response.msg)
      }
    }
  }
  // 身份证人像面
  const IDdownChange = info => {
    if (info.file.status === 'removed') {
      setIDdownImageUrl([])
      return
    }
    if (info.file.status === 'error') {
      setIDdownImageUrl([info.file.thumbUrl])
      message.error('图片上传失败！')
      return
    }
    if (info.file.status === 'uploading') {
      setIDdownImageUrl([''])
      return
    }
    if (info.file.status === 'done') {
      if (info.file.response.code == 200) {
        setIDdownImageUrl([info.file.response.data])
      } else {
        message.error(info.file.response.msg)
      }
    }
  }
  // 身份证国徽面
  const IDChange = info => {
    if (info.file.status === 'removed') {
      setIDImageUrl([])
      return
    }
    if (info.file.status === 'error') {
      setIDImageUrl([info.file.thumbUrl])
      message.error('图片上传失败！')
      return
    }
    if (info.file.status === 'uploading') {
      setIDImageUrl([''])
      return
    }
    if (info.file.status === 'done') {
      if (info.file.response.code == 200) {
        setIDImageUrl([info.file.response.data])
      } else {
        message.error(info.file.response.msg)
      }
    }
  }

  // 第一学历 ---学历证书
  const firstEduImgOneChange = ({ fileList: newFileList }) => setFirstEduImg({ ...firstEduImg, one: newFileList })
  // 第一学历 ---学位证书
  const firstEduImgTwoChange = ({ fileList: newFileList }) => setFirstEduImg({ ...firstEduImg, two: newFileList })

  // 最高学历 ---学历证书
  const topEduImgOneChange = ({ fileList: newFileList }) => setTopEduImg({ ...topEduImg, one: newFileList })
  // 最高学历 ---学位证书
  const topEduImgTwoChange = ({ fileList: newFileList }) => setTopEduImg({ ...topEduImg, two: newFileList })

  // 普通话证书
  const MandarinImgChange = ({ fileList: newFileList }) => setMandarinImg(newFileList)
  // 职称证书
  const ProfessionalTitleImgChange = ({ fileList: newFileList }) => setProfessionalTitleImg(newFileList)
  // 上传错误
  const handleUploadError = (info, field) => {
    message.error(field.msg)
    setImgLoading({ Teacher: false, Degree: false, Diploma: false })
  }
  //图片预览
  const handlePreview1 = file => {
    setPreviewImage('')
    setPreviewImage(file.url)
    setPreviewTitle('图片预览')
    setPreviewOpen(true)
  }
  // 加载状态
  const [ImgLoading, setImgLoading] = useState({ Teacher: false, Degree: false, Diploma: false })
  const onChangeLoading = (info, type) => {
    if (type == 'Teacher' && info.file.status === 'uploading') {
      setImgLoading({ ...ImgLoading, Teacher: true })
      return
    }
    if (type == 'Degree' && info.file.status === 'uploading') {
      setImgLoading({ ...ImgLoading, Degree: true })
      return
    }
    if (type == 'Diploma' && info.file.status === 'uploading') {
      setImgLoading({ ...ImgLoading, Diploma: true })
      return
    }
  }
  // 技能证书-教师资格证certificateListFields函数的上传逻辑
  const handleUpload1 = (file, field, response) => {
    setImgLoading({ ...ImgLoading, Teacher: false })
    const imageUrl = response.data
    const fieldIndex = fields1.findIndex(f => f.name === field.name)
    setImageLists1(prevImageLists => {
      const newImageLists = [...prevImageLists]
      newImageLists[fieldIndex] = [...(newImageLists[fieldIndex] || []), imageUrl]
      return newImageLists
    })
  }
  // 技能证书-教师资格证certificateListFields函数的移除图片
  const handleRemove1 = (fieldIndex, imageIndex) => {
    setImageLists1(prevImageLists => {
      const newImageLists = [...prevImageLists]
      newImageLists[fieldIndex].splice(imageIndex, 1)
      return newImageLists
    })
  }
  // 技能证书-教师资格证certificateListFields函数添加字段和图片列表
  const add1 = () => {
    const field = { name: Date.now() }
    setFields1(prevFields => [...prevFields, field])
    setImageLists1(prevImageLists => [...prevImageLists, []])
  }
  // 技能证书-教师资格证certificateListFields函数移除字段和图片列表
  const remove1 = index => {
    setFields1(prevFields => {
      const newFields = [...prevFields]
      newFields.splice(index, 1)
      return newFields
    })
    setImageLists1(prevImageLists => {
      const newImageLists = [...prevImageLists]
      newImageLists.splice(index, 1)
      return newImageLists
    })
  }
  // 教育经历-学历证书-函数的上传逻辑
  const handleUpload2 = (file, field, response) => {
    setImgLoading({ ...ImgLoading, Diploma: false })
    const imageUrl = response.data
    const fieldIndex = fields2.findIndex(f => f.name === field.name)
    setImageLists2(prevImageLists => {
      const newImageLists = [...prevImageLists]
      newImageLists[fieldIndex] = [...(newImageLists[fieldIndex] || []), imageUrl]
      return newImageLists
    })
  }
  // 教育经历-学历证书-函数的移除图片
  const handleRemove2 = (fieldIndex, imageIndex) => {
    setImageLists2(prevImageLists => {
      const newImageLists = [...prevImageLists]
      newImageLists[fieldIndex].splice(imageIndex, 1)
      return newImageLists
    })
  }
  // 教育经历-函数添加字段和图片列表
  const add2 = () => {
    const field = { name: Date.now() }
    setFields2(prevFields => [...prevFields, field])
    setImageLists2(prevImageLists => [...prevImageLists, []])
    setImageLists3(prevImageLists => [...prevImageLists, []])
    setEduEndDatePicker(null)
    setEduStartDatePicker(null)
  }
  // 教育经历-函数移除字段和图片列表
  const remove2 = index => {
    setFields2(prevFields => {
      const newFields = [...prevFields]
      newFields.splice(index, 1)
      return newFields
    })
    setImageLists2(prevImageLists => {
      const newImageLists = [...prevImageLists]
      newImageLists.splice(index, 1)
      return newImageLists
    })
    setImageLists3(prevImageLists => {
      const newImageLists = [...prevImageLists]
      newImageLists.splice(index, 1)
      return newImageLists
    })
  }
  // 教育经历-学位证书-函数的上传逻辑
  const handleUpload3 = (file, field, response) => {
    setImgLoading({ ...ImgLoading, Degree: false })
    const imageUrl = response.data
    const fieldIndex = fields2.findIndex(f => f.name === field.name)
    setImageLists3(prevImageLists => {
      const newImageLists = [...prevImageLists]
      newImageLists[fieldIndex] = [...(newImageLists[fieldIndex] || []), imageUrl]
      return newImageLists
    })
  }
  // 教育经历-学位证书-函数的移除图片
  const handleRemove3 = (fieldIndex, imageIndex) => {
    setImageLists3(prevImageLists => {
      const newImageLists = [...prevImageLists]
      newImageLists[fieldIndex].splice(imageIndex, 1)
      return newImageLists
    })
  }

  // 提交新建教师信息
  const handleOk = () => {
    basicForm
      .validateFields()
      .then(values => {
        // 技能证书-教师资格证certificateListFields函数的formData
        const formData1 = fields1
          .map((field, fieldIndex) => {
            const fieldName = field.name
            return {
              certType: 1,
              study: values[fieldName].study?.label,
              subjectName: values[fieldName].subjectName,
              getTime: values[fieldName].getTime && values[fieldName].getTime.format('YYYY-MM'),
              filePng: imageLists1[fieldIndex]?.join(';')
            }
          })
          .filter(item => {
            return item.getTime
          })
        // 技能证书-普通话
        const newMandarin = values.Mandarin.map(item => {
          return {
            certType: 2,
            grade: item.grade,
            getTime: item.getTime && item.getTime.format('YYYY-MM'),
            filePng: MandarinImg?.map(item => {
              return item?.response?.data
            }).join(';')
          }
        }).filter(item => {
          return item.getTime
        })

        // 教育经历 （多学历，动态表单）---需求变动，不使用这个功能了
        // const formData2 = fields2.map((field, fieldIndex) => {
        //   const fieldName = field.name;
        //   return {
        //     education: values[fieldName].education,
        //     nature: values[fieldName].nature,
        //     major: values[fieldName]?.major,
        //     startTime: values[fieldName].startEndTime?.length > 0 && values[fieldName].startEndTime[0].format('YYYY-MM'),
        //     endTime: values[fieldName].startEndTime?.length > 0 && values[fieldName].startEndTime[1].format('YYYY-MM'),
        //     degreeType: values[fieldName].degreeType && values[fieldName].degreeType.value,
        //     degreeLevel: values[fieldName].degreeLevel && values[fieldName].degreeLevel.value,
        //     studyYear: values[fieldName].studyYear,
        //     schoolName: values[fieldName].schoolName,
        //     diploma: imageLists2[fieldIndex]?.join(';'),
        //     degree: imageLists3[fieldIndex]?.join(';'),
        //   }
        // })

        // 教育经历----第一学历
        const newFirstEdu = values.firstEdu.map(item => {
          return {
            education: item.education,
            nature: item.nature,
            major: item?.major,
            startTime: item.startEndTime?.length > 0 ? item.startEndTime[0].format('YYYY-MM') : null,
            endTime: item.startEndTime?.length > 0 ? item.startEndTime[1].format('YYYY-MM') : null,
            degreeType: item.degreeType && item.degreeType.value,
            degreeLevel: item.degreeLevel && item.degreeLevel.value,
            studyYear: item.studyYear,
            schoolName: item.schoolName,
            diploma: firstEduImg.one
              ?.map(item => {
                return item?.response?.data
              })
              .join(';'),
            degree: firstEduImg.two
              ?.map(item => {
                return item?.response?.data
              })
              .join(';')
          }
        })
        // 教育经历----最高学历
        const newTopEdu = values.topEdu.map(item => {
          return {
            education: item.education,
            nature: item.nature,
            major: item?.major,
            startTime: item.startEndTime?.length > 0 ? item.startEndTime[0].format('YYYY-MM') : null,
            endTime: item.startEndTime?.length > 0 ? item.startEndTime[1].format('YYYY-MM') : null,
            degreeType: item.degreeType && item.degreeType.value,
            degreeLevel: item.degreeLevel && item.degreeLevel.value,
            studyYear: item.studyYear,
            schoolName: item.schoolName,
            diploma: topEduImg.one
              ?.map(item => {
                return item?.response?.data
              })
              .join(';'),
            degree: topEduImg.two
              ?.map(item => {
                return item?.response?.data
              })
              .join(';')
          }
        })

        const modifyValues = {
          ...(docTypeValue !== 1 && { birthday: values['birthday'].format('YYYY-MM-DD') }),
          identityDown: IDImageUrl?.join(';'),
          identityUp: IDdownImageUrl?.join(';'),
          photo: OneInchImageUrl?.join(';'),
          postTitlePng: ProfessionalTitleImg?.map(item => {
            return item?.response?.data
          }).join(';'),
          partyTime: values['partyTime'] && Date.parse(values['partyTime'].format()),
          areaId: values['areaId'] && values['areaId'][values.areaId.length - 1],
          familyList: [...values['Parents'], ...values['spouse'], ...values['Children']].filter(item => {
            return item.name
          }),
          secondEndTime: values['secondEndTime'],
          joinSchoolTime: values['joinSchoolTime'] && Date.parse(values['joinSchoolTime'].format()),
          titleTime: values['titleTime'] && Date.parse(values['titleTime'].format()),
          jobList:
            values['jobList'] &&
            values['jobList']
              .map(item => {
                return {
                  post: item.post,
                  company: item.company,
                  startTime: item.startTime && item.startTime.format('YYYY-MM'),
                  endTime: item.endTime
                }
              })
              .filter(item => {
                return item.company
              }),
          certificateList: [...formData1, ...newMandarin],
          // educationList: formData2   //教育经历 （多学历，动态表单）---需求变动，不使用这个功能了
          firstEdu: newFirstEdu[0],
          topEdu: newTopEdu[0]
        }
        const { Parents, spouse, Children, Mandarin, ...newValues } = { ...values, ...modifyValues }
        // 过滤掉时间戳类型的键值对
        const filteredData = Object.fromEntries(Object.entries(newValues).filter(([key]) => !/^\d+$/.test(key)))

        console.log(filteredData)

        setLoading(true)

        dispatch({
          type: namespace + '/postTeacherAddOrModify',
          payload: filteredData,
          callback: res => {
            if (res.err && res?.err?.code == 601) {
              // 错误提示
              setLoading(false)
            } else {
              openNotificationWithIcon('success')
              setLoading(false)
              showNewTeacher(false)
              getTeacherList()
              StatTeacherStatisticsApi()
              setEduStartDatePicker(null)
              setEduEndDatePicker(null)
              setJobStartDatePicker(null)
              setJobEndDatePicker(null)
              // 关闭清空图片数据
              setImageLists1([])
              setImageLists2([])
              setImageLists3([])
              setOneInchImageUrl([])
              setIDdownImageUrl([])
              setIDImageUrl([])
              setMandarinImg([])
              setFirstEduImg({ one: [], two: [] })
              setTopEduImg({ one: [], two: [] })
            }
          }
        })

      })
      .catch(info => {
        console.log(info)
        // info.errorFields && message.error('还有 ' + info.errorFields.length + ' 个必填项未填写！')
        info.errorFields &&
          Modal.warning({
            title: '提示',
            // content: '您还有 ' + info.errorFields.length + ' 个必填项未填写！',
            content: (
              <div>
                <p>{'您还有 ' + info.errorFields.length + ' 个必填项未填写！'}</p>
                <b>{'请检查 基本信息、档案信息 是否有必填项未填写！'}</b>
              </div>
            )
          })
      })
  }

  const handleCancel = () => {
    showNewTeacher(false)
    setEduStartDatePicker(null)
    setEduEndDatePicker(null)
    setJobStartDatePicker(null)
    setJobEndDatePicker(null)
    // 关闭清空图片数据
    setImageLists1([])
    setImageLists2([])
    setImageLists3([])
    setOneInchImageUrl([])
    setIDdownImageUrl([])
    setIDImageUrl([])
    setMandarinImg([])
    setFirstEduImg({ one: [], two: [] })
    setTopEduImg({ one: [], two: [] })
  }

  const EducationWorkLayout = { labelCol: { span: 7 } }

  // 技能证书-教师资格证certificateListFields
  const certificateListFields = () => {
    return (
      <>
        {fields1.map((field, fieldIndex) => (
          <div key={field.name} className={styles['miniBox']}>
            <Row justify='space-around' align='middle'>
              <Col span={22}>
                <Form.Item label='教师资格证取得时间' name={[field.name, 'getTime']} {...EducationWorkLayout}>
                  <DatePicker picker='month' disabledDate={disabledDate} getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label='取得教师资格证学段' name={[field.name, 'study']} {...EducationWorkLayout}>
                  {/* 过滤掉专升本和大学 */}
                  <Select
                    showSearch
                    optionFilterProp='label'
                    filterOption={TitleFilterOption}
                    labelInValue={true}
                    options={SchoolStudiesOptions?.filter(option => option.value != 16 && option.value != 39)}
                    onChange={value => handleStudiesChange(value, field.name)}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                  />
                </Form.Item>
                <Form.Item label='取得教师资格证科目' name={[field.name, 'subjectName']} {...EducationWorkLayout}>
                  <Select showSearch optionFilterProp='label' filterOption={TitleFilterOption} options={SchoolSubjectsIdOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                </Form.Item>
              </Col>
              <Col span={1} offset={1}>
                <MinusCircleOutlined onClick={() => remove1(fieldIndex)} />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Upload
                  {...UploadProps}
                  fileList={imageLists1[fieldIndex]?.map((image, imageIndex) => {
                    return { uid: `${fieldIndex}-${imageIndex}`, url: image }
                  })}
                  onChange={info => onChangeLoading(info, 'Teacher')}
                  onError={handleUploadError}
                  onSuccess={(response, file) => handleUpload1(file, field, response)}
                  onPreview={handlePreview1}
                  onRemove={() => handleRemove1(fieldIndex)}>
                  {imageLists1[fieldIndex]?.length >= 3 ? null : (
                    <div>
                      {ImgLoading.Teacher ? (
                        <>
                          <LoadingOutlined />
                          <div style={{ marginTop: 8 }}>上传中</div>
                        </>
                      ) : (
                        <>
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }}>点击上传</div>
                        </>
                      )}
                    </div>
                  )}
                </Upload>
              </Col>
            </Row>
          </div>
        ))}
        <Form.Item labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
          <Button type='dashed' onClick={add1} block icon={<PlusOutlined />} style={{ height: '100px', paddingTop: '18px' }}>
            添加教师资格证<p style={{ paddingTop: '10px', color: '#9E9E9E' }}>温馨提醒：若您已取得多个科目教师资格证，均需进行上传</p>
          </Button>
        </Form.Item>
      </>
    )
  }
  // 教育经历-学历证书-educationList
  const educationListFields = () => {
    return (
      <>
        {fields2.map((field, fieldIndex) => (
          <div key={field.name} className={styles['miniBox']}>
            <Row justify='space-around' align='middle'>
              <Col span={22}>
                <Row>
                  <Form.Item label='时间' name={[field.name, 'startEndTime']} labelCol={{ span: 3 }}>
                    <RangePicker picker='month' getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: '600px' }} />
                  </Form.Item>
                </Row>
                <Row gutter={[12, 0]}>
                  <Col span={12}>
                    <Form.Item label='学历层次' name={[field.name, 'education']} labelCol={{ span: 6 }}>
                      <Select showSearch optionFilterProp='label' filterOption={TitleFilterOption} options={eduOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label='学历性质' name={[field.name, 'nature']} {...EducationWorkLayout}>
                      <Select options={eduNatureOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[12, 0]}>
                  <Col span={14}>
                    <Row>
                      <Col span={14}>
                        <Form.Item label='学位' name={[field.name, 'degreeType']} labelCol={{ span: 9 }}>
                          <Select
                            labelInValue={true}
                            showSearch
                            optionFilterProp='label'
                            filterOption={TitleFilterOption}
                            options={degreeTypeOptions}
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name={[field.name, 'degreeLevel']}>
                          <Select
                            labelInValue={true}
                            showSearch
                            optionFilterProp='label'
                            filterOption={TitleFilterOption}
                            options={degreeLevelOptions}
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={10}>
                    <Form.Item label='学制' name={[field.name, 'studyYear']} {...EducationWorkLayout} labelCol={{ span: 5 }}>
                      <Select showSearch optionFilterProp='label' filterOption={TitleFilterOption} options={studyYearOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item label='毕业院校' name={[field.name, 'schoolName']} labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                  <Input />
                </Form.Item>
                <Form.Item label='就读专业' name={[field.name, 'major']} labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={1} offset={1}>
                <MinusCircleOutlined onClick={() => remove2(fieldIndex)} />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Upload
                  {...UploadProps}
                  fileList={imageLists2[fieldIndex]?.map((image, imageIndex) => {
                    return { uid: `${fieldIndex}-${imageIndex}`, url: image }
                  })}
                  onChange={info => onChangeLoading(info, 'Diploma')}
                  onError={handleUploadError}
                  onSuccess={(response, file) => handleUpload2(file, field, response)}
                  onPreview={handlePreview1}
                  onRemove={() => handleRemove2(fieldIndex)}
                  className={styles['IDImag']}>
                  {imageLists2[fieldIndex]?.length >= 1 ? null : (
                    <div>
                      {ImgLoading.Diploma ? (
                        <>
                          <LoadingOutlined />
                          <div style={{ marginTop: 8 }}>上传中</div>
                        </>
                      ) : (
                        <>
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }}>点击上传学历证书</div>
                        </>
                      )}
                    </div>
                  )}
                </Upload>
              </Col>

              <Col span={10}>
                <Upload
                  {...UploadProps}
                  fileList={imageLists3[fieldIndex]?.map((image, imageIndex) => {
                    return { uid: `${fieldIndex}-${imageIndex}`, url: image }
                  })}
                  onChange={info => onChangeLoading(info, 'Degree')}
                  onError={handleUploadError}
                  onSuccess={(response, file) => handleUpload3(file, field, response)}
                  onPreview={handlePreview1}
                  onRemove={() => handleRemove3(fieldIndex)}
                  className={styles['IDImag']}>
                  {imageLists3[fieldIndex]?.length >= 1 ? null : (
                    <div>
                      {ImgLoading.Degree ? (
                        <>
                          <LoadingOutlined />
                          <div style={{ marginTop: 8 }}>上传中</div>
                        </>
                      ) : (
                        <>
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }}>点击上传学位证书</div>
                        </>
                      )}
                    </div>
                  )}
                </Upload>
              </Col>
            </Row>
          </div>
        ))}
        <Form.Item labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
          <Button type='dashed' onClick={add2} block icon={<PlusOutlined />} style={{ height: '100px' }}>
            添加教育经历
          </Button>
        </Form.Item>
      </>
    )
  }

  // 教师考核板块--下一版新功能
  const YearExamineColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age'
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address'
    }
  ]
  const YearExamineData = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    }
  ]
  // 教师考核新增弹窗
  const handleExamineOk = () => {
    // setIsExamineModalOpen(false)
    /**
     * 关闭弹窗
     * 请求表格数据
     * 清空表单数据
     */
    ExamineForm.validateFields()
      .then(values => {
        ExamineForm.resetFields()
        console.log(values)
      })
      .catch(info => {
        console.log('Validate Failed:', info)
      })
  }
  // 教师考核新增弹窗
  const handleExamineCancel = () => {
    setIsExamineModalOpen(false)
    ExamineForm.resetFields()
  }

  return (
    <>
      <Modal title='新建教师' confirmLoading={loading} visible={NewTeacherOpen} width={810} destroyOnClose={true} onOk={handleOk} onCancel={handleCancel} bodyStyle={{ padding: '0 24px 24px 24px' }}>
        <Modal visible={PreviewOpen} footer={null} width={700} title={PreviewTitle} onCancel={handlePreviewCancel}>
          <img style={{ width: '100%' }} alt={PreviewTitle} src={PreviewImage} />
        </Modal>
        <Tabs defaultActiveKey='1' onChange={onChangeTabs} className={styles['NewTeacher']}>
          <Tabs.TabPane tab='基本信息' key='BasicInformation'>
            <Form name='basic' form={basicForm} autoComplete='off' preserve={false} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
              <Row gutter={[12, 0]}>
                <Col span={20}>
                  <Row>
                    <Col span={12}>
                      <Form.Item label='姓名' name='userName' rules={[{ required: true, message: '请填写教师姓名!' }]} labelCol={{ span: 9 }}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label='性别' name='sex' rules={[{ required: true, message: '请选择教师性别!' }]}>
                        <Select options={sexOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Form.Item label='证件类型' name='docType' rules={[{ required: true }]} labelCol={{ span: 9 }}>
                        <Select options={docTypeOptions} onChange={handleDocTypeChange} getPopupContainer={triggerNode => triggerNode.parentNode} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label='证件号码' name='identityCard' rules={[{ required: true }, { pattern: docTypeValue === 1 ? IdCardReg : null, message: '请输入正确的身份证号码！' }]}>
                        <Input
                          onChange={event => {
                            handleIdentityCardChange(event)
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Form.Item label='民族' name='nationId' rules={[{ required: true }]} labelCol={{ span: 9 }}>
                        <Select showSearch optionFilterProp='label' filterOption={TitleFilterOption} options={nationOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      {docTypeValue === 1 ? (
                        <Form.Item label='年龄' name='age'>
                          <Input disabled type='number' />
                        </Form.Item>
                      ) : (
                        <Form.Item label='出生日期' name='birthday' rules={[{ required: true }]}>
                          <DatePicker disabledDate={disabledDate} getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: '100%' }} />
                        </Form.Item>
                      )}
                    </Col>
                  </Row>
                </Col>
                <Col span={4}>
                  <Upload {...UploadProps} onChange={OneInchChange} onPreview={handlePreview} className={styles['OneInchImag']}>
                    {OneInchImageUrl.length >= 1 ? null : (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>一寸照</div>
                      </div>
                    )}
                  </Upload>
                </Col>
              </Row>
              <Row gutter={[12, 0]}>
                <Col span={24}>
                  <Form.Item label='籍贯' name='areaId' rules={[{ required: true }]} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                    <Cascader showSearch optionfilterprop='label' filterOption={TitleFilterOption} options={ProvinceCityAddressOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[12, 0]}>
                <Col span={12}>
                  <Form.Item label='婚姻状况' name='marryId' rules={[{ required: true }]}>
                    <Select options={marriageOptions} onChange={handleMarryChange} getPopupContainer={triggerNode => triggerNode.parentNode} />
                  </Form.Item>
                  <Form.Item label='入党时间' name='partyTime' rules={[{ required: handlePolit != 2 }]}>
                    <DatePicker disabled={handlePolit == 2 ? true : false} disabledDate={disabledDate} getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item label='党内职务' name='partyPost' rules={[{ required: handlePolit != 2 }]}>
                    <Input disabled={handlePolit == 2 ? true : false} />
                  </Form.Item>
                  <Form.Item label='紧急联系人' name='urgentName' rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label='政治面貌' name='politId' rules={[{ required: true }]}>
                    <Select
                      showSearch
                      optionFilterProp='label'
                      filterOption={TitleFilterOption}
                      options={politOptions}
                      onChange={handlePolitChange}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                    />
                  </Form.Item>
                  <Form.Item label='所属支部' name='partyOrgName' rules={[{ required: handlePolit != 2 }]}>
                    <Input disabled={handlePolit == 2 ? true : false} />
                  </Form.Item>
                  <Form.Item
                    label='联系电话'
                    name='phone'
                    rules={[
                      { required: true, message: '请填写教师联系电话!' },
                      { pattern: phoneReg, message: '请输入正确手机号！' }
                    ]}>
                    <Input />
                  </Form.Item>
                  <Form.Item label='紧急联系电话' name='urgentPhone' rules={[{ required: true }, { pattern: phoneReg, message: '请输入正确手机号！' }]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label='家庭住址' name='address' rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              <Row style={{ textAlign: 'end' }}>
                <Col span={12}>
                  <Upload {...UploadProps} onChange={IDdownChange} onPreview={handlePreview} className={styles['IDImag']}>
                    {IDdownImageUrl.length >= 1 ? null : (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>身份证人像面</div>
                      </div>
                    )}
                  </Upload>
                </Col>
                <Col span={12}>
                  <Upload {...UploadProps} onChange={IDChange} onPreview={handlePreview} className={styles['IDImag']}>
                    {IDImageUrl.length >= 1 ? null : (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>身份证国徽面</div>
                      </div>
                    )}
                  </Upload>
                </Col>
              </Row>

              <h3 className={styles['title']}>家庭信息</h3>
              {/* 父母信息 */}
              <div>
                <Form.List name='Parents' initialValue={[{ relation: 1 }]}>
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <div key={key} className={styles['miniBox']}>
                          <Row justify='space-around' align='middle'>
                            <Col span={key !== 0 ? 22 : 24}>
                              <Row gutter={[12, 0]}>
                                <Col span={12}>
                                  <Form.Item label='姓名' name={[name, 'name']}>
                                    <Input />
                                  </Form.Item>
                                  <Form.Item label='工作单位' name={[name, 'company']}>
                                    <Input />
                                  </Form.Item>
                                  <Form.Item label='政治面貌' name={[name, 'politics']}>
                                    <Select showSearch optionFilterProp='label' filterOption={TitleFilterOption} options={politOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                                  </Form.Item>
                                </Col>
                                <Col span={12}>
                                  <Form.Item label='关系' name={[name, 'relation']}>
                                    <Select options={relationOptions?.filter(item => item?.value == 1 || item?.value == 2)} getPopupContainer={triggerNode => triggerNode.parentNode} />
                                  </Form.Item>
                                  <Form.Item label='工作省份' name={[name, 'workProvince']}>
                                    <Select
                                      showSearch
                                      optionFilterProp='label'
                                      filterOption={TitleFilterOption}
                                      options={CityAddressOptionsText}
                                      getPopupContainer={triggerNode => triggerNode.parentNode}
                                    />
                                  </Form.Item>
                                  <Form.Item label='工作情况' name={[name, 'workType']}>
                                    <Select options={workOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Form.Item
                                label='身份证号'
                                name={[name, 'familyIdentityCard']}
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                                rules={[{ required: false }, { pattern: IdCardReg, message: '请输入正确的身份证号码！' }]}>
                                <Input />
                              </Form.Item>
                              <Form.Item label='家庭住址' name={[name, 'address']} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                                <Input />
                              </Form.Item>
                            </Col>
                            {key !== 0 && (
                              <Col span={1} offset={1}>
                                <MinusCircleOutlined onClick={() => remove(name)} />
                              </Col>
                            )}
                          </Row>
                        </div>
                      ))}
                      <Form.Item wrapperCol={{ span: 24 }}>
                        <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />} style={{ height: '100px' }}>
                          添加父母信息
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </div>
              {/* 配偶or子女信息 */}
              <div>
                <div style={{ display: MarryState == 2 ? 'block' : 'none' }}>
                  <Form.List name='spouse' initialValue={[{ relation: 3 }]}>
                    {fields => (
                      <>
                        {fields.map(({ name, key }) => (
                          <div key={key} className={styles['miniBox']}>
                            <Row gutter={[12, 0]}>
                              <Col span={12}>
                                {/* 如果 婚姻状态为 已婚 则配偶信息必填 */}
                                {/* <Form.Item label='姓名' name={[name, 'name']} rules={[{ required: MarryState == 2 ? true : false }]}>
																	<Input />
																</Form.Item> */}
                                <Form.Item label='姓名' name={[name, 'name']}>
                                  <Input />
                                </Form.Item>
                                <Form.Item
                                  label='身份证号'
                                  name={[name, 'familyIdentityCard']}
                                  labelCol={{ span: 8 }}
                                  rules={[{ required: false }, { pattern: IdCardReg, message: '请输入正确的身份证号码！' }]}>
                                  <Input />
                                </Form.Item>
                                <Form.Item label='政治面貌' name={[name, 'politics']}>
                                  <Select showSearch optionFilterProp='label' filterOption={TitleFilterOption} options={politOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item label='关系' name={[name, 'relation']}>
                                  <Select disabled options={relationOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                                </Form.Item>
                                <Form.Item label='工作省份' name={[name, 'workProvince']}>
                                  <Select
                                    showSearch
                                    optionFilterProp='label'
                                    filterOption={TitleFilterOption}
                                    options={CityAddressOptionsText}
                                    getPopupContainer={triggerNode => triggerNode.parentNode}
                                  />
                                </Form.Item>
                                <Form.Item label='工作情况' name={[name, 'workType']}>
                                  <Select options={workOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                                </Form.Item>
                              </Col>
                            </Row>
                            <Form.Item label='工作单位' labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} name={[name, 'company']}>
                              <Input />
                            </Form.Item>
                          </div>
                        ))}
                      </>
                    )}
                  </Form.List>
                </div>
                <div style={{ display: MarryState !== 1 ? 'block' : 'none' }}>
                  <Form.List name='Children' initialValue={[{ relation: 4 }]}>
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <div key={key} className={styles['miniBox']}>
                            <Row justify='space-around' align='middle'>
                              <Col span={key !== 0 ? 22 : 24}>
                                <Row gutter={[12, 0]}>
                                  <Col span={12}>
                                    <Form.Item label='姓名' name={[name, 'name']}>
                                      <Input />
                                    </Form.Item>
                                    <Form.Item
                                      label='身份证号'
                                      name={[name, 'familyIdentityCard']}
                                      labelCol={{ span: 8 }}
                                      rules={[{ required: false }, { pattern: IdCardReg, message: '请输入正确的身份证号码！' }]}>
                                      <Input />
                                    </Form.Item>
                                    <Form.Item label='政治面貌' name={[name, 'politics']}>
                                      <Select showSearch optionFilterProp='label' filterOption={TitleFilterOption} options={politOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                                    </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                    <Form.Item label='关系' name={[name, 'relation']}>
                                      <Select
                                        options={relationOptions?.filter(item => item?.value != 1 && item?.value != 2 && item?.value != 3)}
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                      />
                                    </Form.Item>
                                    <Form.Item label='工作省份' name={[name, 'workProvince']}>
                                      <Select
                                        showSearch
                                        optionFilterProp='label'
                                        filterOption={TitleFilterOption}
                                        options={CityAddressOptionsText}
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                      />
                                    </Form.Item>
                                    <Form.Item label='工作情况' name={[name, 'workType']}>
                                      <Select options={workOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                                    </Form.Item>
                                  </Col>
                                </Row>
                                <Form.Item label='工作单位' labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} name={[name, 'company']}>
                                  <Input />
                                </Form.Item>
                              </Col>
                              {key !== 0 && (
                                <Col span={1} offset={1}>
                                  <MinusCircleOutlined onClick={() => remove(name)} />
                                </Col>
                              )}
                            </Row>
                          </div>
                        ))}
                        <Form.Item wrapperCol={{ span: 24 }}>
                          <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />} style={{ height: '100px' }}>
                            添加子女信息
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </div>
              </div>
            </Form>
          </Tabs.TabPane>

          <Tabs.TabPane forceRender={true} tab='档案信息' key='FileInformation'>
            <Form name='File' form={basicForm} labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} autoComplete='off' preserve={false}>
              <Row>
                <Col span={11}>
                  <Form.Item label='教师类别' name='teacherType' rules={[{ required: true }]} labelCol={{ span: 11 }}>
                    <Select options={teacherTypeOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                  </Form.Item>
                </Col>
                <Col span={12} offset={1}>
                  <Form.Item label='特岗教师' name='specialTeacher' labelCol={{ span: 9 }} rules={[{ required: true }]}>
                    <Select options={specTeacherOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label='专业技术或工勤技能职务' name='postFunction' labelCol={{ span: 6 }} rules={[{ required: true }]}>
                <Select options={postFunctionOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
              </Form.Item>
              <Row>
                <Col span={13}>
                  <Form.Item label='在岗情况' labelCol={{ span: 9 }} name='isPost' rules={[{ required: true, message: '请选择教师的在岗情况!' }]}>
                    <Select options={postInfoOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                  </Form.Item>
                </Col>
                <Col span={10} offset={1}>
                  <Form.Item label='学段' name='studyId' rules={[{ required: true, message: '请选择教师的学段!' }]}>
                    {/* 过滤掉学段下拉框数据 专升本和大学 */}
                    <Select options={SchoolStudiesOptions?.filter(option => option.value !== 16 && option.value !== 39)} getPopupContainer={triggerNode => triggerNode.parentNode} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label='编制所在单位' name='schoolId' rules={[{ required: true, message: '请填写教师的编制所在单位!' }]}>
                <Input />
              </Form.Item>
              <Form.Item label='实际工作单位' name='workSchoolName' rules={[{ required: true, message: '请填写教师的实际工作单位!' }]}>
                <Input />
              </Form.Item>
              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <Form.Item label='抽用截止时间' name='secondEndTime' labelCol={{ span: 10 }}>
                    <CustomDatePicker onChange={value => basicForm.setFieldsValue({ secondEndTime: value })} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label='进入编制所在单位时间' name='joinSchoolTime' labelCol={{ span: 11 }}>
                    <DatePicker disabledDate={disabledDate} getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label='进入编制所在单位方式' name='jonSchoolWay'>
                <Select showSearch optionFilterProp='label' filterOption={TitleFilterOption} options={unitMethodOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
              </Form.Item>
              {/* <Form.Item label='进入本单位文号' name='jonSchoolNo'>
								<Input />
							</Form.Item> */}
              <Form.Item label='聘用合同编号' name='contractNo'>
                <Input />
              </Form.Item>
              <Form.Item label='所在教研组' name='researchGroup'>
                <Input disabled />
              </Form.Item>
              <Form.Item label='所在处室' name='orgId'>
                <Select
                  showSearch
                  optionFilterProp='label'
                  filterOption={TitleFilterOption}
                  options={SchoolOrgsOptions}
                  onChange={handleDepartmentChange}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                />
              </Form.Item>
              <Form.Item label='职务' name='postId'>
                <Select showSearch optionFilterProp='label' filterOption={TitleFilterOption} options={SchoolPostsOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
              </Form.Item>
              <Form.Item label='分管工作' name='jobContent'>
                <Input />
              </Form.Item>
              <h3 className={styles['title']}>职称岗位</h3>
              <div className={styles['miniBox']}>
                <Form.Item label='最高职称等级' name='postTitle' labelCol={{ span: 5 }}>
                  <Select showSearch optionFilterProp='label' filterOption={TitleFilterOption} options={titleOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                </Form.Item>
                <Row gutter={[12, 0]}>
                  <Col span={12}>
                    <Form.Item label='取得职称时间' name='titleTime' labelCol={{ span: 10 }}>
                      <DatePicker picker='month' disabledDate={disabledDate} getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label='现聘任岗位' name='enjoyPostLevel' {...EducationWorkLayout}>
                      <Select showSearch optionFilterProp='label' filterOption={TitleFilterOption} options={postOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[12, 0]}>
                  <Col span={12}>
                    <Form.Item label='岗位类别' name='postType' labelCol={{ span: 10 }}>
                      <Select showSearch optionFilterProp='label' filterOption={TitleFilterOption} options={postTypeOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label='岗位等级' name='postLevel' {...EducationWorkLayout}>
                      <Select showSearch optionFilterProp='label' filterOption={TitleFilterOption} options={postOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                    </Form.Item>
                  </Col>
                </Row>
                <Upload {...UploadProps} fileList={ProfessionalTitleImg} onChange={ProfessionalTitleImgChange} onPreview={handlePreview}>
                  {ProfessionalTitleImg.length >= 3 ? null : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>上传任职资格证图片</div>
                    </div>
                  )}
                </Upload>
              </div>

              <h3 className={styles['title']}>教育经历</h3>
              {/* <Row gutter={[12, 0]}>
                <Col span={12}>
                  <Form.Item label="最高学历" name="maxEduc" labelCol={{ span: 6 }}>
                    <Select showSearch optionFilterProp="label" filterOption={TitleFilterOption} options={eduOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="最高学历性质" name="educType" labelCol={{ span: 8 }}>
                    <Select options={eduNatureOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                  </Form.Item>
                </Col>
              </Row> */}

              {/* 教育经历 （多学历，动态表单）---需求变动，不使用这个功能了 */}
              {/* {educationListFields()} */}

              <div className={styles['miniBox']}>
                {/* 第一学历 */}
                <Form.List name='firstEdu' initialValue={[{}]}>
                  {fields => (
                    <>
                      {fields.map(({ name, key }) => (
                        <div key={name}>
                          <h3 className={styles['title']}>第一学历</h3>
                          <Row justify='space-around' align='middle'>
                            <Col span={22}>
                              <Row>
                                <Form.Item label='时间' name={[name, 'startEndTime']} labelCol={{ span: 3 }}>
                                  <RangePicker picker='month' getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: '600px' }} />
                                </Form.Item>
                              </Row>
                              <Row gutter={[12, 0]}>
                                <Col span={12}>
                                  <Form.Item label='学历层次' name={[name, 'education']} labelCol={{ span: 6 }}>
                                    <Select showSearch optionFilterProp='label' filterOption={TitleFilterOption} options={eduOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                                  </Form.Item>
                                </Col>
                                <Col span={12}>
                                  <Form.Item label='学历性质' name={[name, 'nature']} {...EducationWorkLayout}>
                                    <Select options={eduNatureOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Row gutter={[12, 0]}>
                                <Col span={14}>
                                  <Row>
                                    <Col span={14}>
                                      <Form.Item label='学位' name={[name, 'degreeType']} labelCol={{ span: 9 }}>
                                        <Select
                                          labelInValue={true}
                                          showSearch
                                          optionFilterProp='label'
                                          filterOption={TitleFilterOption}
                                          options={degreeTypeOptions}
                                          getPopupContainer={triggerNode => triggerNode.parentNode}
                                        />
                                      </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                      <Form.Item name={[name, 'degreeLevel']}>
                                        <Select
                                          labelInValue={true}
                                          showSearch
                                          optionFilterProp='label'
                                          filterOption={TitleFilterOption}
                                          options={degreeLevelOptions}
                                          getPopupContainer={triggerNode => triggerNode.parentNode}
                                        />
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col span={10}>
                                  <Form.Item label='学制' name={[name, 'studyYear']} {...EducationWorkLayout} labelCol={{ span: 5 }}>
                                    <Select showSearch optionFilterProp='label' filterOption={TitleFilterOption} options={studyYearOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Form.Item label='毕业院校' name={[name, 'schoolName']} labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                                <Input />
                              </Form.Item>
                              <Form.Item label='就读专业' name={[name, 'major']} labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                                <Input />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row gutter={16}>
                            <Col span={13}>
                              <Upload {...UploadProps} fileList={firstEduImg.one} onChange={firstEduImgOneChange} onPreview={handlePreview} className={styles['IDImag']}>
                                {firstEduImg.one.length >= 1 ? null : (
                                  <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>点击上传学历证书</div>
                                  </div>
                                )}
                              </Upload>
                            </Col>
                            <Col span={10}>
                              <Upload {...UploadProps} fileList={firstEduImg.two} onChange={firstEduImgTwoChange} onPreview={handlePreview} className={styles['IDImag']}>
                                {firstEduImg.two.length >= 1 ? null : (
                                  <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>点击上传学位证书</div>
                                  </div>
                                )}
                              </Upload>
                            </Col>
                          </Row>
                        </div>
                      ))}
                    </>
                  )}
                </Form.List>
                {/* 最高学历 */}
                <Form.List name='topEdu' initialValue={[{}]}>
                  {fields => (
                    <>
                      {fields.map(({ name, key }) => (
                        <div key={name}>
                          <h3 className={styles['title']}>最高学历</h3>
                          <Row justify='space-around' align='middle'>
                            <Col span={22}>
                              <Row>
                                <Form.Item label='时间' name={[name, 'startEndTime']} labelCol={{ span: 3 }}>
                                  <RangePicker picker='month' getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: '600px' }} />
                                </Form.Item>
                              </Row>
                              <Row gutter={[12, 0]}>
                                <Col span={12}>
                                  <Form.Item label='学历层次' name={[name, 'education']} labelCol={{ span: 6 }}>
                                    <Select showSearch optionFilterProp='label' filterOption={TitleFilterOption} options={eduOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                                  </Form.Item>
                                </Col>
                                <Col span={12}>
                                  <Form.Item label='学历性质' name={[name, 'nature']} {...EducationWorkLayout}>
                                    <Select options={eduNatureOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Row gutter={[12, 0]}>
                                <Col span={14}>
                                  <Row>
                                    <Col span={14}>
                                      <Form.Item label='学位' name={[name, 'degreeType']} labelCol={{ span: 9 }}>
                                        <Select
                                          labelInValue={true}
                                          showSearch
                                          optionFilterProp='label'
                                          filterOption={TitleFilterOption}
                                          options={degreeTypeOptions}
                                          getPopupContainer={triggerNode => triggerNode.parentNode}
                                        />
                                      </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                      <Form.Item name={[name, 'degreeLevel']}>
                                        <Select
                                          labelInValue={true}
                                          showSearch
                                          optionFilterProp='label'
                                          filterOption={TitleFilterOption}
                                          options={degreeLevelOptions}
                                          getPopupContainer={triggerNode => triggerNode.parentNode}
                                        />
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col span={10}>
                                  <Form.Item label='学制' name={[name, 'studyYear']} {...EducationWorkLayout} labelCol={{ span: 5 }}>
                                    <Select showSearch optionFilterProp='label' filterOption={TitleFilterOption} options={studyYearOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Form.Item label='毕业院校' name={[name, 'schoolName']} labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                                <Input />
                              </Form.Item>
                              <Form.Item label='就读专业' name={[name, 'major']} labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                                <Input />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row gutter={16}>
                            <Col span={13}>
                              <Upload {...UploadProps} fileList={topEduImg.one} onChange={topEduImgOneChange} onPreview={handlePreview} className={styles['IDImag']}>
                                {topEduImg.one.length >= 1 ? null : (
                                  <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>点击上传学历证书</div>
                                  </div>
                                )}
                              </Upload>
                            </Col>
                            <Col span={10}>
                              <Upload {...UploadProps} fileList={topEduImg.two} onChange={topEduImgTwoChange} onPreview={handlePreview} className={styles['IDImag']}>
                                {topEduImg.two.length >= 1 ? null : (
                                  <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>点击上传学位证书</div>
                                  </div>
                                )}
                              </Upload>
                            </Col>
                          </Row>
                        </div>
                      ))}
                    </>
                  )}
                </Form.List>
              </div>

              <h3 className={styles['title']}>工作经历</h3>
              <Form.List name='jobList'>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div key={key} className={styles['miniBox']}>
                        <Row justify='space-around' align='middle'>
                          <Col span={22}>
                            {/* <Row>
                              <Form.Item label='时间' name={[name, 'startEndTime']} labelCol={{ span: 3 }}>
                                <RangePicker picker='month' disabledDate={disabledDate} getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: '590px' }} />
                              </Form.Item>
                            </Row> */}
                            <Row gutter={[12, 0]}>
                              <Col span={12}>
                                <Form.Item label='开始时间' name={[name, 'startTime']} {...EducationWorkLayout}>
                                  <DatePicker picker='month' disabledDate={disabledDate} getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: '100%' }} />
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item label='截至时间' name={[name, 'endTime']} {...EducationWorkLayout}>
                                  <CustomDatePicker
                                    onChange={value => {
                                      const newJobList = [...basicForm.getFieldValue('jobList')]
                                      const currentJob = newJobList.find(job => job.key === name)
                                      if (currentJob) {
                                        currentJob.endTime = value
                                        basicForm.setFieldsValue({ jobList: newJobList })
                                      }
                                    }}
                                  />
                                </Form.Item>
                              </Col>
                            </Row>
                            <Row gutter={[12, 0]}>
                              <Col span={12}>
                                <Form.Item label='单位名称' name={[name, 'company']} {...EducationWorkLayout}>
                                  <Input />
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item label='职务' name={[name, 'post']} {...EducationWorkLayout}>
                                  <Input />
                                </Form.Item>
                              </Col>
                            </Row>
                          </Col>
                          <Col span={1} offset={1}>
                            <MinusCircleOutlined onClick={() => remove(name)} />
                          </Col>
                        </Row>
                      </div>
                    ))}
                    <Form.Item labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                      <Button
                        type='dashed'
                        onClick={() => {
                          add()
                          setJobEndDatePicker(null)
                          setJobStartDatePicker(null)
                        }}
                        block
                        icon={<PlusOutlined />}
                        style={{ height: '100px' }}>
                        添加工作经历
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
              <h3 className={styles['title']}>技能证书</h3>
              {certificateListFields()}

              {/* 普通话 */}
              <Form.List name='Mandarin' initialValue={[{}]}>
                {fields => (
                  <>
                    {fields.map(({ name, key }) => (
                      <div key={key} className={styles['miniBox']}>
                        <Col span={24}>
                          <Form.Item label='普通话证书取得时间' name={[name, 'getTime']} {...EducationWorkLayout}>
                            <DatePicker picker='month' disabledDate={disabledDate} getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: '100%' }} />
                          </Form.Item>
                          <Form.Item label='取得最高普通话等级' name={[name, 'grade']} {...EducationWorkLayout}>
                            <Select showSearch optionFilterProp='label' filterOption={TitleFilterOption} options={mandarinLevelOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                          </Form.Item>
                        </Col>
                        <Upload {...UploadProps} fileList={MandarinImg} onChange={MandarinImgChange} onPreview={handlePreview}>
                          {MandarinImg.length >= 3 ? null : (
                            <div>
                              <PlusOutlined />
                              <div style={{ marginTop: 8 }}>点击上传</div>
                            </div>
                          )}
                        </Upload>
                      </div>
                    ))}
                  </>
                )}
              </Form.List>
            </Form>
          </Tabs.TabPane>

          {/* <Tabs.TabPane tab="教师考核" key="TeacherExamine">
            <Row justify="space-between" align="middle">
              <Col span={5}><h3 className={styles['title']}>年度考核</h3></Col>
              <Col span={5} style={{ textAlign: 'right' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsExamineModalOpen(true)}>添加数据</Button>
              </Col>
            </Row>
            <Table columns={YearExamineColumns} dataSource={YearExamineData} bordered />
            <Row justify="space-between" align="middle">
              <Col span={5}><h3 className={styles['title']}>师德考核</h3></Col>
              <Col span={5} style={{ textAlign: 'right' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsExamineModalOpen(true)}>添加数据</Button>
              </Col>
            </Row>
            <span>TeachersEthics 师德</span>
            <Table columns={YearExamineColumns} dataSource={YearExamineData} bordered />

            <Modal title="新增考核数据" visible={isExamineModalOpen} onOk={handleExamineOk} onCancel={handleExamineCancel} centered={true}>
              <Form name="ExamineForm" form={ExamineForm} labelCol={{ span: 6 }} autoComplete="off">
                <Form.Item label="选择添加的年份" name="1111username" rules={[{ required: true }]}>
                <DatePicker picker="year" getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="考核等级" name="1111password" rules={[{ required: true }]}>
                <Select options={sexOptions} getPopupContainer={triggerNode => triggerNode.parentNode} />
                </Form.Item>
              </Form>
            </Modal>
          </Tabs.TabPane> */}
        </Tabs>
      </Modal>
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    DictionaryAddress: state[namespace].DictionaryAddress,
    SchoolPostsOptions: state[namespace].SchoolPostsOptions,
    SchoolOrgsOptions: state[namespace].SchoolOrgsOptions,
    SchoolStudiesOptions: state[namespace].SchoolStudiesOptions,
    nationOptions: state[namespace].nationOptions,
    sexOptions: state[namespace].sexOptions,
    titleOptions: state[namespace].titleOptions,
    postInfoOptions: state[namespace].postInfoOptions,
    marriageOptions: state[namespace].marriageOptions,
    politOptions: state[namespace].politOptions,
    unitMethodOptions: state[namespace].unitMethodOptions,
    eduOptions: state[namespace].eduOptions,
    eduNatureOptions: state[namespace].eduNatureOptions,
    mandarinLevelOptions: state[namespace].mandarinLevelOptions,
    postOptions: state[namespace].postOptions,
    physResultOptions: state[namespace].physResultOptions,
    CityAddressOptions: state[namespace].CityAddressOptions,
    relationOptions: state[namespace].relationOptions,
    SchoolSubjectsIdOptions: state[namespace].SchoolSubjectsIdOptions,
    workOptions: state[namespace].workOptions,
    ProvinceCityAddressOptions: state[namespace].ProvinceCityAddressOptions,
    CityAddressOptionsText: state[namespace].CityAddressOptionsText,
    degreeLevelOptions: state[namespace].degreeLevelOptions,
    degreeTypeOptions: state[namespace].degreeTypeOptions,
    studyYearOptions: state[namespace].studyYearOptions,
    teacherTypeOptions: state[namespace].teacherTypeOptions,
    postFunctionOptions: state[namespace].postFunctionOptions,
    postTypeOptions: state[namespace].postTypeOptions,
    specTeacherOptions: state[namespace].specTeacherOptions,
    docTypeOptions: state[namespace].docTypeOptions
  }
}

export default memo(connect(mapStateToProps)(NewTeacher))
