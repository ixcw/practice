/*
Author:韦靠谱
Description:教师数据
Date:2023/05/04
@Modified By:韦靠谱-2023/9/4
*/
import React, { useState, useEffect, useRef } from 'react'
import { withRouter } from 'react-router-dom'
import { Col, Row, Button, Select, Empty, Cascader, Input, DatePicker, Spin, Space, Form, Table, Modal, Dropdown, Menu, Checkbox, Pagination, Radio, message, Upload } from 'antd';
import { SettingOutlined, ExclamationCircleOutlined, HomeOutlined, MailOutlined, UserOutlined, SearchOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { connect } from 'dva'
import { TeacherData as namespace } from '@/utils/namespace'
import userInfoCache from '@/caches/userInfo'
import Page from '@/components/Pages/page'
import NewTeacher from './components/NewTeacher/NewTeacher';
import NewTeacherEasy from './components/NewTeacherEasy';
import TeacherDetails from './components/TeacherDetails/TeacherDetails'
import TeacherDataReview from './components/TeacherDataReview/TeacherDataReview'
import TeacherModification from './components/TeacherModification/TeacherModification';
import TeacherChange from './components/TeacherChange/TeacherChange'
import ActionTeacher from './components/ActionTeacher'
import AddHeadTeacher from './components/AddHeadTeacher'
import DeleteTeacher from './components/DeleteTeacher'
import ImportAndExport from './components/ImportAndExport'
import styles from './TeacherData.less'

const title = '数据中心-教师数据';
const breadcrumb = [title];
const header = (<Page.Header breadcrumb={breadcrumb} title={title} />)
const { Search } = Input;
const { confirm } = Modal

function employeeData(props) {
    const loginUserInfo = userInfoCache() || {}
    const { location,dispatch, SchoolOrgsOptions, CityAddressOptions, ProvinceCityAddressOptions, SchoolPostsOptions, nationOptions, sexOptions, titleOptions, postInfoOptions, marriageOptions, politOptions, unitMethodOptions, eduOptions, eduNatureOptions, mandarinLevelOptions, postOptions, physResultOptions } = props;
    const ActionTeacherRef = useRef(null)
    const AddHeadTeacherRef = useRef(null)
    const DeleteTeacherRef = useRef(null)
    // 传递id
    const [ClassGradeList, setClassGradeList] = useState([])//班级列表
    const [StudyAndGradeList, setStudyAndGradeList] = useState([])//学段和年级列表
    const [TeacherDetailId, setTeacherDetailId] = useState(null)
    const [AllScreening, setAllScreening] = useState({})
    const [loading, setLoading] = useState(true);
    const [ButtonLoading, setButtonLoading] = useState({ perfect :false,Download:false});
    const [NewColumns, setNewColumns] = useState([])
    const [DetailLoading, setDetailLoading] = useState(true);
    const [listDataSource, setListDataSource] = useState([])
    const [listDataTotal, setListDataTotal] = useState(0)
    const [ListDataCurrentPage, setListDataCurrentPage] = useState(1)
    const [ListDataPageSize, setListDataPageSize] = useState(10);
    const [TableRollingWidth, setTableRollingWidth] = useState(0)
    const [ExpansionScreening, setExpansionScreening] = useState(false)
    const [StatTeacherStatistics, setStatTeacherStatistics] = useState({})
    const [selectedRows, setSelectedRows] = useState([])//多选-被选中的行
    const [BasicsCheckboxDefaultValues, setBasicsCheckboxDefaultValues] = useState(['index', 'sexText', 'userName', 'isWork', 'action', 'examineStatusStr', 'phone', 'completeStatusStr', 'isPostText','haveClassText'])
    const [FileCheckboxDefaultValues, setFileCheckboxDefaultValues] = useState(['postTitleText', 'subjectName'])
    const [OtherCheckboxDefaultValues, setOtherCheckboxDefaultValues] = useState([])

    // 教师弹窗状态
    const [NewTeacherOpen, setNewTeacherOpen] = useState(false);
    const showNewTeacher = () => { setNewTeacherOpen(!NewTeacherOpen) }
    const [NewTeacherEasyOpen, setNewTeacherEasyOpen] = useState(false);
    const showNewTeacherEasy = () => { setNewTeacherEasyOpen(!NewTeacherEasyOpen) }
    const [TeacherDetailsOpen, setTeacherDetailsOpen] = useState(false);
    const showTeacherDetails = () => { setTeacherDetailsOpen(!TeacherDetailsOpen) }
    const [TeacherDataReviewOpen, setTeacherDataReviewOpen] = useState(false);
    const showTeacherDataReview = () => { setTeacherDataReviewOpen(!TeacherDataReviewOpen) }
    const [TeacherModificationOpen, setTeacherModificationOpen] = useState(false);
    const showTeacherModification = () => { setTeacherModificationOpen(!TeacherModificationOpen) }
    const [TeacherChangeOpen, setTeacherChangeOpen] = useState(false);
    const showTeacherChange = () => { setTeacherChangeOpen(!TeacherChangeOpen) }

    useEffect(() => {
        if (loginUserInfo.code == 'SCHOOL_ADMIN') {
          //学校管理员
          StatTeacherStatisticsApi();
          dispatch({
            type: namespace + '/getDictionaryDictGroups',
            payload: {
              dictCodes:
                'DICT_NATION,DICT_TRAIN,DICT_TRAIN_LEVEL,DICT_HONOUR_TYPE,DICT_HONOR,DICT_ACHV_LEVEL,DICT_WORK,DICT_PHYS_RESULT,DICT_RELATION,DICT_SEX,DICT_MARRIAGE,DICT_POLIT,DICT_WORK,DICT_POST_INFO,DICT_STUDY_STATUS,DICT_UNIT_METHOD,DICT_EDU,DICT_NATURE,DICT_POST_CHANGE_TYPE,DICT_MANDARIN_LEVEL,DICT_TITLE,DICT_POST,DICT_DEGREE,DICT_DEGREE_TYPE,DICT_STUDY_YEAR,DICT_TEACHER_TYPE,DICT_POST_FUNCTION,DICT_POST_TYPE,DICT_SPEC_TEACHER,DICT_DOC_TYPE'
            }
          })
          dispatch({
            type: namespace + "/getDictionaryAddress",
            payload: { deep: 3 }, //查询深度，2：市级：3：区县级
          });
          dispatch({
            type: namespace + "/getSchoolOrgs",
          });
          dispatch({
            type: namespace + "/getSchoolStudies",
          });
          // 获取学段和年级---2023.8.25新增
          dispatch({
            type: namespace + "/getStudyAndGradeListApi",
            payload: {
              studyId: loginUserInfo.studyIds,
            },
            callback: (res) => {
              if (res.result && res.result.length > 0) {
                const transformedArray = res.result.map((item) => {
                  return {
                    label: item.studyName,
                    options: item.gradeList.map((grade) => {
                      return {
                        label: grade.gradeName,
                        value: grade.gradeId.toString(),
                      };
                    }),
                  };
                });
                setStudyAndGradeList(transformedArray);
              }
            },
          });
        }
    }, [])

    const [YearCode, setYearCode] = useState(null)//年级
    const [GradeCode, setGradeCode] = useState(null)//学届

    useEffect(() => {
        //请求班级列表---2023.8.25新增
         if (YearCode && GradeCode) {
        dispatch({
            type: namespace + '/findClassListApi',
            payload: {
                spoceId: YearCode,
                gradeId: GradeCode,
                schoolId: loginUserInfo.schoolId
            }, callback: (res) => {
                setClassGradeList([
                { value: -1, label: '未分配',},
                ...res.result?.map(item => {
                    return {
                      value: item.id - 0,
                      label: item.name,
                      gradeid: item.gradeId,
                      schoolid: item.schoolId,
                      spoceid: item.spoceId,
                    };
                  })]);
            }
        });
    }
    }, [YearCode, GradeCode])

    const StatTeacherStatisticsApi = () => {
        dispatch({
            type: namespace + "/getStatTeacherStatistics",
            callback: (res) => {
                if (JSON.stringify(res.result) !== '{}') {
                    setStatTeacherStatistics(res?.result)
                }
            }
        })
    }

    const sendTeacherDetailId = (id) => { setTeacherDetailId(id) }

    // 教师列表函数
    const getTeacherList = (page = 1, size = ListDataPageSize, value) => {
        setLoading(true)
        dispatch({
            type: namespace + "/getTeacherPageList",
            payload: { page, size, ...value },
            callback: (res) => {
                if (res) {
                    setLoading(false)
                    setListDataSource(res?.data?.map(item => { return { ...item, key: item.id } }))
                    setListDataTotal(res?.total)
                    setListDataCurrentPage(res?.currentPage)
                }
            }
        })
    }

    // 一键督促完善
    const UrgeImproveSuccess = () => {
        setButtonLoading({ ...ButtonLoading, perfect: true });
        dispatch({
            type: namespace + "/getTeacherDoUrgeApi",
            callback: (res) => {
                setButtonLoading({ ...ButtonLoading, perfect: false });
                Modal.success({
                    title: '督促完善成功提示',
                    content: (
                        <div>
                            <p>已成功向 {StatTeacherStatistics?.incompleteNumber} 名未完善信息教师发送完善信息提示！</p>
                        </div>
                    )
                });
            }
        })
    };

    // 确认删除弹窗
    const showDeleteConfirm = record => {
			confirm({
				title: '删除提示',
				icon: <ExclamationCircleOutlined />,
				content: (
					<>
						{Array.isArray(record) ? (
							<div>您确定要进行批量删除操作吗？</div>
						) : (
							<div>
								您确定要删除名为 <span style={{ color: '#1890ff', margin: '10px 0 0 0' }}>{record.userName}</span> 的教师吗？
							</div>
						)}
						<div style={{ fontWeight: 800, margin: '10px 0 0 0' }}>该删除操作不可逆。</div>
					</>
				),
				okType: 'danger',
				onOk() {
					DeleteTeacherRef.current.showDeleteTeacher(record)
				}
			})
		}

    // 列表--列头
    const columns = [
      {
        title: "序号",
        dataIndex: "index",
        key: "index",
        fixed: "left",
        render: (text, record, index) =>
          (ListDataCurrentPage - 1) * ListDataPageSize + index + 1,
        width: 50,
      },
      {
        title: "教师姓名",
        dataIndex: "userName",
        key: "userName",
        fixed: "left",
        width: 90,
      },
      {
        title: "性别",
        dataIndex: "sexText",
        key: "sexText",
        width: 70,
      },
      {
        title: "体检情况",
        dataIndex: "isDisease",
        key: "isDisease",
        width: 90,
      },
      {
        title: "教授科目",
        dataIndex: "subjectName",
        key: "subjectName",
        width: 90,
      },
      {
        title: "最高职称等级",
        dataIndex: "postTitleText",
        key: "postTitleText",
        width: 110,
      },
      {
        title: "联系电话",
        dataIndex: "phone",
        key: "phone",
        width: 110,
      },
      {
        title: "民族",
        dataIndex: "nationText",
        key: "nationText",
        width: 80,
      },
      {
        title: "籍贯",
        dataIndex: "areaName",
        key: "areaName",
        width: 120,
      },
      {
        title: "婚姻状态",
        dataIndex: "marryText",
        key: "marryText",
        width: 70,
      },
      {
        title: "政治面貌",
        dataIndex: "politText",
        key: "politText",
        width: 90,
      },
      {
        title: "年龄",
        dataIndex: "age",
        key: "age",
        width: 70,
      },
      {
        title: "所在教研组",
        dataIndex: "teachGroups",
        key: "teachGroups",
        width: 100,
      },
      {
        title: "所在处室",
        dataIndex: "orgName",
        key: "orgName",
        width: 90,
      },
      {
        title: "职务",
        dataIndex: "postName",
        key: "postName",
        width: 100,
      },
      {
        title: "教龄",
        dataIndex: "teachAge",
        key: "teachAge",
        width: 70,
      },
      {
        title: "进入本单位时间",
        dataIndex: "joinSchoolTime",
        key: "joinSchoolTime",
        width: 110,
        render: (_, record) =>
          record.joinSchoolTime &&
          new Date(record.joinSchoolTime).getFullYear() +
            "-" +
            (new Date(record.joinSchoolTime).getMonth() + 1) +
            "-" +
            new Date(record.joinSchoolTime).getDate(),
      },
      {
        title: "进入本单位方式",
        dataIndex: "jonSchoolWayText",
        key: "jonSchoolWayText",
        width: 110,
      },
      {
        title: "学历层次",
        dataIndex: "maxEducText",
        key: "maxEducText",
        width: 80,
      },
      {
        title: "学历性质",
        dataIndex: "educTypeText",
        key: "educTypeText",
        width: 80,
      },
      {
        title: "岗位类别",
        dataIndex: "postTypeText",
        key: "postTypeText",
        width: 100,
      },
      {
        title: "岗位等级",
        dataIndex: "postLevelText",
        key: "postLevelText",
        width: 80,
      },
      {
        title: "享受岗位",
        dataIndex: "enjoyPostLevelText",
        key: "enjoyPostLevelText",
        width: 100,
      },
      {
        title: "教师类别",
        dataIndex: "teacherTypeText",
        key: "postLevelText",
        width: 100,
      },
      {
        title: "特岗教师",
        dataIndex: "specialTeacherText",
        key: "specialTeacherText",
        width: 150,
      },
      {
        title: "专业技术或工勤技能职务",
        dataIndex: "postFunctionText",
        key: "postFunctionText",
        width: 200,
      },
      {
        title: "是否具有教师资格证",
        dataIndex: "hasTeacherCertificate",
        key: "hasTeacherCertificate",
        width: 140,
      },
      {
        title: "普通话等级",
        dataIndex: "mandarinLevelText",
        key: "mandarinLevelText",
        width: 90,
      },
      {
        title: "分配授课状态",
        dataIndex: "haveClassText",
        key: "haveClassText",
        width: 90,
      },
      {
        title: "完善资料情况",
        dataIndex: "completeStatusStr",
        key: "completeStatusStr",
        width: 90,
      },
      {
        title: "在岗情况",
        dataIndex: "isPostText",
        key: "isPostText",
        width: 80,
      },
      {
        title: "在职情况",
        dataIndex: "isWork",
        key: "isWork",
        width: 80,
      },
      {
        title: "审核状态",
        dataIndex: "examineStatusStr",
        key: "examineStatusStr",
        width: 80,
      },
      {
        title: "操作",
        key: "action",
        width: 200,
        render: (_, record) => (
          <Space size="middle">
            {record.examineStatus == 2 || record.examineStatus == 6 ? (
            window.$PowerUtils.judgeButtonAuth(location, '审核') && <a onClick={() => {showTeacherDataReview();sendTeacherDetailId(record.id);}}>审核</a>
            ) : (
            window.$PowerUtils.judgeButtonAuth(location, '详情') && <a onClick={() => {showTeacherDetails();sendTeacherDetailId(record.id);}}>更多详情</a>)}
            {window.$PowerUtils.judgeButtonAuth(location, '修改') && <a onClick={() => {showTeacherChange();sendTeacherDetailId(record.id);}}>修改</a>}
            {window.$PowerUtils.judgeButtonAuth(location, '变动') && <a onClick={() => {showTeacherModification();sendTeacherDetailId(record.id);}}>变动</a>}
            {window.$PowerUtils.judgeButtonAuth(location, '配置') && <a onClick={() => {ActionTeacherRef.current.showActionTeacher(record);}}>配置</a>}
            {window.$PowerUtils.judgeButtonAuth(location, '删除') && <a onClick={() => {showDeleteConfirm(record)}}>删除</a>}
          </Space>
        ),
      },
    ];
    // 表格字段按钮 下拉菜单
    const basicsOptions = [
        { label: '教师姓名', value: 'userName', disabled: true },
        { label: '性别', value: 'sexText' },
        { label: '年龄', value: 'age' },
        { label: '联系电话', value: 'phone' },
        { label: '民族', value: 'nationText' },
        { label: '籍贯', value: 'areaName' },
        { label: '婚姻状态', value: 'marryText' },
        { label: '政治面貌', value: 'politText' },
        { label: '分配班级状态', value: 'haveClassText', disabled: true },
        { label: '完善资料情况', value: 'completeStatusStr', disabled: true },
        { label: '在职情况', value: 'isWork', disabled: true },
        { label: '在岗情况', value: 'isPostText', disabled: true },
        { label: '审核状态', value: 'examineStatusStr', disabled: true },
        { label: '操作', value: 'action', disabled: true },
        { label: '序号', value: 'index', disabled: true },
    ];
    const fileOptions = [
        { label: '教授科目', value: 'subjectName' },
        { label: '所在教研组', value: 'researchGroup' },
        { label: '所在处室', value: 'orgName' },
        { label: '职务', value: 'postName' },
        { label: '教龄', value: 'teachAge' },
        { label: '进入本单位时间', value: 'joinSchoolTime' },
        { label: '进入本单位方式', value: 'jonSchoolWayText' },
        { label: '学历层次', value: 'maxEducText' },
        { label: '学历性质', value: 'educTypeText' },
        { label: '最高职称等级', value: 'postTitleText' },
        { label: '岗位类别', value: 'postTypeText' },
        { label: '岗位等级', value: 'postLevelText' },
        { label: '享受岗位', value: 'enjoyPostLevelText' },
        { label: '教师类别', value: 'teacherTypeText' },
        { label: '特岗教师', value: 'specialTeacherText' },
        { label: '专业技术或工勤技能职务', value: 'postFunctionText' },
        { label: '是否具有教师资格证', value: 'hasTeacherCertificate' },
        { label: '普通话等级', value: 'mandarinLevelText' },
    ];
    const otherOptions = [
        { label: '体检情况', value: 'isDisease' },
    ]

    // 表格字段筛选
    const onBasicsCheckboxChange = (checkedValues) => {
        setBasicsCheckboxDefaultValues(checkedValues)
        setNewColumns(columns.filter(item => [...FileCheckboxDefaultValues, ...OtherCheckboxDefaultValues, ...checkedValues].includes(item.key)))
        setTableRollingWidth(columns.filter(item => [...FileCheckboxDefaultValues, ...OtherCheckboxDefaultValues, ...checkedValues].includes(item.key)).map(item => item.width).reduce((prev, cur) => prev + cur))
    };
    const onFileCheckboxChange = (checkedValues) => {
        setFileCheckboxDefaultValues(checkedValues)
        setNewColumns(columns.filter(item => [...BasicsCheckboxDefaultValues, ...OtherCheckboxDefaultValues, ...checkedValues].includes(item.key)))
        setTableRollingWidth(columns.filter(item => [...BasicsCheckboxDefaultValues, ...OtherCheckboxDefaultValues, ...checkedValues].includes(item.key)).map(item => item.width).reduce((prev, cur) => prev + cur))
    };
    const onOtherCheckboxChange = (checkedValues) => {
        setOtherCheckboxDefaultValues(checkedValues)
        setNewColumns(columns.filter(item => [...BasicsCheckboxDefaultValues, ...FileCheckboxDefaultValues, ...checkedValues].includes(item.key)))
        setTableRollingWidth(columns.filter(item => [...BasicsCheckboxDefaultValues, ...FileCheckboxDefaultValues, ...checkedValues].includes(item.key)).map(item => item.width).reduce((prev, cur) => prev + cur))
    };
    useEffect(() => {
        setNewColumns(columns.filter(item => [...FileCheckboxDefaultValues, ...OtherCheckboxDefaultValues, ...BasicsCheckboxDefaultValues].includes(item.key)))
        setTableRollingWidth(columns.filter(item => [...FileCheckboxDefaultValues, ...OtherCheckboxDefaultValues, ...BasicsCheckboxDefaultValues].includes(item.key)).map(item => item.width).reduce((prev, cur) => prev + cur))
    }, [ListDataCurrentPage])
    const DropdownItems = (
        <Menu multiple={true} forceSubMenuRender={true} className='DropdownPopup'>
            <Menu.SubMenu title="基础信息" key="foundation" icon={<HomeOutlined />}>
                <Checkbox.Group options={basicsOptions} defaultValue={BasicsCheckboxDefaultValues} onChange={onBasicsCheckboxChange} />
            </Menu.SubMenu>
            <Menu.SubMenu title="档案信息" key="FileInformation" icon={<MailOutlined />}>
                <Checkbox.Group options={fileOptions} defaultValue={FileCheckboxDefaultValues} onChange={onFileCheckboxChange} />
            </Menu.SubMenu>
            <Menu.SubMenu title="其他信息" key="OtherInformation" icon={<UserOutlined />}>
                <Checkbox.Group options={otherOptions} defaultValue={OtherCheckboxDefaultValues} onChange={onOtherCheckboxChange} />
            </Menu.SubMenu>
        </Menu>
    )

    // 表格左侧切换
    const onChangeRadio = (e) => {
        if (e.target.value == 'all') {
            setAllScreening({ ...AllScreening, examineStatus: undefined })
        } else if (e.target.value == 'recheck') {
            setAllScreening({ ...AllScreening, examineStatus: '6' })
        } else if (e.target.value == 'rejected') {
            setAllScreening({ ...AllScreening, examineStatus: '4' })
        } else if (e.target.value == 'uncheck') {
            setAllScreening({ ...AllScreening, examineStatus: '2' })
        } else if (e.target.value == 'incomplete') {
            setAllScreening({ ...AllScreening, examineStatus: '1' })
        } else if (e.target.value == 'StaySubmitReview') {
            setAllScreening({ ...AllScreening, examineStatus: '5' })
        }
    }

    // rowSelection对象表示需要行选择
	const rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
		    setSelectedRows(selectedRows)
		}
    }
    // 多选删除
    const onMultipleDel = () => {
        showDeleteConfirm(selectedRows)
    }

    // 展开/折叠更多筛选
    const onExpansionScreening = () => {
        if (!ExpansionScreening) {
            Modal.success({
                title: '温馨提醒',
                content: (<div><p>更多筛选需要在<b>表格字段</b>中勾选才会在下列表格中展示！</p></div>)
            })
        }
        setExpansionScreening(!ExpansionScreening)
    }

    // 下拉框的内容处理
    const TeacherCertificationOptions = [{ value: '0', label: '否' }, { value: '1', label: '是' }]
    const isWorkOptions = [{ value: '1', label: '在职' }, { value: '0', label: '离职' }]

    // 筛选事件
    const handleIsWorkChange = (value) => { setAllScreening({ ...AllScreening, isWork: value }) }
    const handleNationChange = (value) => { setAllScreening({ ...AllScreening, nationId: value }) }
    const handleSexChange = (value) => { setAllScreening({ ...AllScreening, sex: value }) }
    const handleTitleChange = (value) => { setAllScreening({ ...AllScreening, postTitle: value }) }
    const handlePostInfoChange = (value) => { setAllScreening({ ...AllScreening, isPost: value }) }
    const handleMarriageChange = (value) => { setAllScreening({ ...AllScreening, marryId: value }) }
    const handleSchoolPostsChange = (value) => { setAllScreening({ ...AllScreening, postId: value }) }
    const handlePostChange = (value) => { setAllScreening({ ...AllScreening, postLevel: value }) }
    const handlePolitChange = (value) => { setAllScreening({ ...AllScreening, politId: value }) }
    const handleEduChange = (value) => { setAllScreening({ ...AllScreening, maxEduc: value }) }
    const handleEduNatureChange = (value) => { setAllScreening({ ...AllScreening, educType: value }) }
    const handleUnitMethodChange = (value) => { setAllScreening({ ...AllScreening, jonSchoolWay: value }) }
    const handleMandarinLevelChange = (value) => { setAllScreening({ ...AllScreening, mandarinLevel: value }) }
    const handleTeacherCertificationChange = (value) => { setAllScreening({ ...AllScreening, hasTeacherCertificate: value }) }
    const onTeacherNameSearch = (value) => { setAllScreening({ ...AllScreening, userName: value }) }
    const handlePhysResultChange = (value) => { setAllScreening({ ...AllScreening, isDisease: value }) }
    const handleCityAddressChange = (value) => { setAllScreening({ ...AllScreening, areaId: value && value[value.length-1] })}
    const onTelSearch = (value) => {
        if (value) {
            setAllScreening({ ...AllScreening, phone: value })
        } else {
            setAllScreening(delete AllScreening.phone)
        }
    }
    const handleSchoolOrgsChange = (value) => {
        setAllScreening({ ...AllScreening, orgId: value })
        SchoolPostsApi(value)
    }
    const onAgeFinish = (value) => { setAllScreening({ ...AllScreening, ...value }) }
    const onEntryTimeFinish = (value) => {
        setAllScreening({ ...AllScreening, ...{ joinSchoolStartTime: value?.joinSchoolStartTime && value?.joinSchoolStartTime.format('YYYY/MM/DD'), joinSchoolEndTime: value?.joinSchoolEndTime && value?.joinSchoolEndTime.format('YYYY/MM/DD') } })
    }
    const onWorkTimeFinish = (value) => {
        setAllScreening({ ...AllScreening, ...{ joinWorkStartTime: value?.joinWorkStartTime && value?.joinWorkStartTime.format('YYYY/MM/DD'), joinWorkEndTime: value?.joinWorkEndTime && value?.joinWorkEndTime.format('YYYY/MM/DD') } })
    }
    const SchoolPostsApi = (orgId) => {
        dispatch({
            type: namespace + "/getSchoolPosts",
            payload: { orgId }
        })
    }

    // 对下拉框选项进行模糊搜索
    const TitleFilterOption = (input, option) => {
        return (option?.label ? option?.label : '').toLowerCase().includes(input.toLowerCase())
    }

    useEffect(() => {
        if (loginUserInfo.code == 'SCHOOL_ADMIN') {//学校管理员
            setAllScreening(AllScreening)
            getTeacherList(1, ListDataPageSize, AllScreening)
        } else {
            Modal.warning({
                title: '提示信息',
                content: '当前角色没有权限！',
            });
        }
    }, [AllScreening])


    // 表格分页
    const onPaginationChange = (page, size) => {
        setSelectedRows([])
        getTeacherList(page, size, AllScreening)
        setListDataCurrentPage(page)
        setListDataPageSize(size)
    }

    const [isInstructor, setIsInstructor] = useState(null)//是否显示班主任配置
    const [InstructorInfo, setInstructorInfo] = useState({})//班主任信息
    const [ClassLeaderLoading, setClassLeaderLoading] = useState(false)//班主任加载

    //年级下拉事件
    const handleGradeChange = (value) => {
        setIsInstructor(undefined)
        if (AllScreening.classId) setAllScreening(delete AllScreening.classId)
        setGradeCode(value)
    }
    //学届下拉事件
    const handleYearChange = (date, dateString) => {
        setIsInstructor(undefined)
        setYearCode(dateString)
    }
    //班级下拉事件
    const handleClassGradeChange = (value) => {
        setIsInstructor(value)
        if (value && Object.keys(value).length) {
            setInstructorInfo({})
            setClassLeaderLoading(true)
            // 获取班级下的班主任
            dispatch({
                type: namespace + "/getClassLeaderApi",
                payload: { classId: value.key },
                callback: (res) => {
                    setInstructorInfo(res.result)
                    setClassLeaderLoading(false)
                }
            })
            //筛选列表数据
            setAllScreening({ ...AllScreening, classId: value.key })
        } else {
            setInstructorInfo({})
            //筛选列表数据
            setAllScreening(delete AllScreening.classId)
        }
    }
    // 打开配置班主任弹窗
    const handleAddHeadTeacher=()=>{
        AddHeadTeacherRef.current.showAddHeadTeacher(isInstructor)
    }

    return (
        <Page header={header}>
            {loginUserInfo.code != 'SCHOOL_ADMIN' && //不是学校管理员
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'当前角色没有权限查看当前页面,请联系管理员！'} />
            }
            {loginUserInfo.code == 'SCHOOL_ADMIN' && //学校管理员
                <div id={styles['TeacherData']}>
                    {/* 头部 */}
                    <div className={styles['header']}>
                        <div className={styles['left']}>
                            <p>已完善资料教师人数：{StatTeacherStatistics?.completedNumber} 人</p>
                            <p>未完善资料教师人数：{StatTeacherStatistics?.incompleteNumber} 人</p>
                            {window.$PowerUtils.judgeButtonAuth(location, '督促') && <Button type="primary" loading={ButtonLoading.perfect} onClick={UrgeImproveSuccess}>一键督促完善</Button>}
                        </div>
                        <div className={styles['right']}>
                            <ImportAndExport getTeacherList={getTeacherList} AllScreening={AllScreening} NewColumns={NewColumns} setLoading={setLoading} StatTeacherStatisticsApi={StatTeacherStatisticsApi} />
                        </div>
                    </div>
                    {/* 筛选 */}
                    <div className={styles['screening']}>
                        <Row>
                            <Col span={23}>
                                <Space size={[8, 16]} wrap>
                                    <Space>性别：<Select options={sexOptions} onChange={handleSexChange} allowClear style={{ width: 80 }} /></Space>
                                    <Space>教授科目：<Select disabled allowClear style={{ width: 100 }} /></Space>
                                    <Space>最高职称等级：<Select showSearch optionFilterProp="label" filterOption={TitleFilterOption} options={titleOptions} onChange={handleTitleChange} allowClear style={{ width: 140 }} /></Space>
                                    <Space>在岗情况：<Select options={postInfoOptions} onChange={handlePostInfoChange} allowClear style={{ width: 110 }} /></Space>
                                    <Space>离职情况：<Select options={isWorkOptions} onChange={handleIsWorkChange} allowClear style={{ width: 80 }} /></Space>
                                    <Space>教师姓名：<Search allowClear onSearch={onTeacherNameSearch} style={{ width: 150 }} /></Space>
                                    <Space>联系电话：<Search allowClear onSearch={onTelSearch} style={{ width: 150 }} /></Space>
                                </Space>
                            </Col>
                            <Col span={1}>
                                <Button type="link" onClick={onExpansionScreening} icon={ExpansionScreening ? <UpOutlined /> : <DownOutlined />}>更多筛选</Button>
                            </Col>
                        </Row>
                        {ExpansionScreening && <div style={{ margin: '20px 0 0 0' }}>
                            <Space size={[8, 16]} wrap>
                                <Space>民族：<Select showSearch optionFilterProp="label" filterOption={TitleFilterOption} options={nationOptions} allowClear onChange={handleNationChange} style={{ width: 120 }} /></Space>
                                <Space>婚姻状况：<Select options={marriageOptions} onChange={handleMarriageChange} allowClear style={{ width: 80 }} /></Space>
                                <Space>所在教研组：<Select disabled allowClear style={{ width: 80 }} /></Space>
                                <Space>所属处室：<Select showSearch optionFilterProp="label" filterOption={TitleFilterOption} options={SchoolOrgsOptions} onChange={handleSchoolOrgsChange} allowClear style={{ width: 140 }} /></Space>
                                <Space>职务：<Select showSearch optionFilterProp="label" filterOption={TitleFilterOption} options={SchoolPostsOptions} onChange={handleSchoolPostsChange} allowClear style={{ width: 160 }} /></Space>
                                <Space>岗位级别：<Select showSearch optionFilterProp="label" filterOption={TitleFilterOption} options={postOptions} onChange={handlePostChange} allowClear style={{ width: 90 }} /></Space>
                                <Space>政治面貌：<Select showSearch optionFilterProp="label" filterOption={TitleFilterOption} options={politOptions} onChange={handlePolitChange} allowClear style={{ width: 120 }} /></Space>
                                <Space>学历层次：<Select showSearch optionFilterProp="label" filterOption={TitleFilterOption} options={eduOptions} onChange={handleEduChange} allowClear style={{ width: 80 }} /></Space>
                                <Space>学历性质：<Select showSearch optionFilterProp="label" filterOption={TitleFilterOption} options={eduNatureOptions} onChange={handleEduNatureChange} allowClear style={{ width: 80 }} /></Space>
                                <Space>进入编制所在单位方式：<Select showSearch optionFilterProp="label" filterOption={TitleFilterOption} options={unitMethodOptions} onChange={handleUnitMethodChange} allowClear style={{ width: 120 }} /></Space>
                                <Space>籍贯：<Cascader changeOnSelect showSearch optionfilterprop="label" filterOption={TitleFilterOption} options={ProvinceCityAddressOptions} onChange={handleCityAddressChange} allowClear style={{ width: 250 }} /></Space>
                                <Space>是否具有教师资格证：<Select options={TeacherCertificationOptions} onChange={handleTeacherCertificationChange} allowClear style={{ width: 80 }} /></Space>
                                <Space>普通话等级：<Select showSearch optionFilterProp="label" filterOption={TitleFilterOption} options={mandarinLevelOptions} onChange={handleMandarinLevelChange} allowClear style={{ width: 100 }} /></Space>
                                <Space>
                                    <Form name="age" onFinish={onAgeFinish}>
                                        <Space size={[0, 0]}>
                                            <Form.Item label="年龄" name="ageMin" style={{ marginBottom: '0' }}><Input allowClear style={{ width: 60, borderRight: 0 }} /></Form.Item>
                                            <Input style={{ width: 30, borderLeft: 0, borderRight: 0, pointerEvents: 'none' }} placeholder="~" disabled />
                                            <Form.Item name="ageMax" style={{ marginBottom: '0' }}><Input allowClear style={{ width: 60, borderLeft: 0, borderRight: 0 }} /></Form.Item>
                                            <Form.Item style={{ marginBottom: '0' }}><Button htmlType="submit" icon={<SearchOutlined style={{ color: '#8c8c8c' }} />}></Button></Form.Item>
                                        </Space>
                                    </Form>
                                </Space>
                                <Space>
                                    <Form name="EntryTime" onFinish={onEntryTimeFinish}>
                                        <Space size={[0, 0]}>
                                            <Form.Item label="进入编制所在单位时间" name="joinSchoolStartTime" style={{ marginBottom: '0' }}><DatePicker style={{ borderRight: 0 }} /></Form.Item>
                                            <Input style={{ width: 40, borderLeft: 0, borderRight: 0, pointerEvents: 'none' }} placeholder="至" disabled />
                                            <Form.Item name="joinSchoolEndTime" style={{ marginBottom: '0' }}><DatePicker style={{ borderLeft: 0, borderRight: 0 }} /></Form.Item>
                                            <Form.Item style={{ marginBottom: '0' }}><Button htmlType="submit" icon={<SearchOutlined style={{ color: '#8c8c8c' }} />}></Button></Form.Item>
                                        </Space>
                                    </Form>
                                </Space>
                                <Space>
                                    <Form name="WorkTime" onFinish={onWorkTimeFinish}>
                                        <Space size={[0, 0]}>
                                            <Form.Item label="参加工作时间" name="joinWorkStartTime" style={{ marginBottom: '0' }}><DatePicker /></Form.Item>
                                            <Input style={{ width: 40, borderLeft: 0, borderRight: 0, pointerEvents: 'none' }} placeholder="至" disabled />
                                            <Form.Item name="joinWorkEndTime" style={{ marginBottom: '0' }}><DatePicker style={{ borderLeft: 0, borderRight: 0 }} /></Form.Item>
                                            <Form.Item style={{ marginBottom: '0' }}><Button htmlType="submit" icon={<SearchOutlined style={{ color: '#8c8c8c' }} />}></Button></Form.Item>
                                        </Space>
                                    </Form>
                                </Space>

                                <Space>体检情况：<Select options={physResultOptions} onChange={handlePhysResultChange} allowClear style={{ width: 130 }} /></Space>

                            </Space>
                        </div>}
                        <Row style={{ padding: '20px 0 0 0' }}>
                            <Space size={[8, 16]} wrap>
                                <Space>学届：<DatePicker onChange={handleYearChange} picker="year" /></Space>
                                <Space>年级：<Select onChange={handleGradeChange} style={{ width: 150 }} options={StudyAndGradeList} allowClear /></Space>
                                <Space>班级：<Select onChange={handleClassGradeChange} labelInValue={true} value={isInstructor} style={{ width: 200 }} options={ClassGradeList} allowClear /></Space>
                            </Space>
                        </Row>
                    </div>
                    {/* 创建 */}
                    <div className={styles['createStaff']}>
                        <Row gutter={16}>
                            {window.$PowerUtils.judgeButtonAuth(location, '添加完整版') && <Col span={window.$PowerUtils.judgeButtonAuth(location, '添加完整版') && !window.$PowerUtils.judgeButtonAuth(location, '添加精简版') ? 18 : (!window.$PowerUtils.judgeButtonAuth(location, '添加完整版') && window.$PowerUtils.judgeButtonAuth(location, '添加精简版') ? 18 : (window.$PowerUtils.judgeButtonAuth(location, '添加完整版') && window.$PowerUtils.judgeButtonAuth(location, '添加精简版') ? 9 : 0))}>
                                <Button type="dashed" size={"large"} block onClick={showNewTeacher}>快速创建教师账号（完整版）</Button>
                            </Col>}
                            {window.$PowerUtils.judgeButtonAuth(location, '添加精简版') && <Col span={window.$PowerUtils.judgeButtonAuth(location, '添加精简版') && !window.$PowerUtils.judgeButtonAuth(location, '添加完整版') ? 18 : (!window.$PowerUtils.judgeButtonAuth(location, '添加精简版') && window.$PowerUtils.judgeButtonAuth(location, '添加完整版') ? 18 : (window.$PowerUtils.judgeButtonAuth(location, '添加精简版') && window.$PowerUtils.judgeButtonAuth(location, '添加完整版') ? 9 : 0))}>
                                <Button onClick={showNewTeacherEasy} type="dashed" size={"large"} block style={{ height: '50px' }}>快速创建教师账号（精简版）</Button>
                            </Col>}
                            <Col span={6}>
                                <Dropdown overlay={DropdownItems} arrow={true} trigger={['click']}>
                                    <Button type="primary" icon={<SettingOutlined />}>表格字段</Button>
                                </Dropdown>
                                {window.$PowerUtils.judgeButtonAuth(location, '批量删除') && <Button type="primary" onClick={onMultipleDel} disabled={!selectedRows.length > 0} danger style={{margin:'0 10px'}}>一键删除</Button>}
                            </Col>
                        </Row>
                    </div>
                    {/* 列表 */}
                    <Row gutter={[16, 0]}>
                        <Col span={2} className='listLeft'>
                            <Radio.Group defaultValue="all" buttonStyle="solid" onChange={onChangeRadio}>
                                <Radio.Button value="all">全部<br />{StatTeacherStatistics?.totalNumber}人</Radio.Button>
                                <Radio.Button value="recheck">待复核<br />{StatTeacherStatistics?.recheckNumber}人</Radio.Button>
                                <Radio.Button value="rejected">已驳回<br />{StatTeacherStatistics?.rejectedNumber}人</Radio.Button>
                                <Radio.Button value="uncheck">未审核<br />{StatTeacherStatistics?.uncheckNumber}人</Radio.Button>
                                <Radio.Button value="incomplete">待完善<br />{StatTeacherStatistics?.incompleteNumber}人</Radio.Button>
                                <Radio.Button value="StaySubmitReview">待提交复核<br />{StatTeacherStatistics?.modifiedNumber}人</Radio.Button>
                            </Radio.Group>
                        </Col>
                        <Col span={22}>
                            <Spin spinning={loading}>
                                {isInstructor && Object.keys(isInstructor).length && isInstructor?.value !=-1 &&
                                    <div className={styles['headTeacherManage']}>
                                        <div className={styles['headTeacherLittle']}>
                                            <div>班主任</div>
                                            <div onClick={handleAddHeadTeacher} className={styles['settingIconBox']}>
                                                <SettingOutlined />
                                            </div>
                                        </div>
                                        <Spin spinning={ClassLeaderLoading}>
                                        <div className={styles['teacherName']}>
                                            {
                                                InstructorInfo && Object.keys(InstructorInfo).length ?
                                                    <div>{InstructorInfo.name}</div>
                                                    :
                                                    <div className={styles['noData']}>暂无班主任信息，请前往配置</div>
                                            }
                                        </div>
                                        </Spin>
                                    </div>
                                }

                                <Table rowSelection={window.$PowerUtils.judgeButtonAuth(location, '批量删除') ? rowSelection : null } columns={NewColumns} dataSource={listDataSource} bordered pagination={false} scroll={{ x: TableRollingWidth + 450,y:550 }} />
                            </Spin>
                            <Pagination
                                onChange={onPaginationChange}
                                total={listDataTotal}
                                current={ListDataCurrentPage}
                                defaultPageSize={10}
                                showSizeChanger={true}
                                showTotal={(listDataTotal) => `总计 ${listDataTotal} 人`}
                                style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}
                            />
                        </Col>
                    </Row>

                    <NewTeacher NewTeacherOpen={NewTeacherOpen} StatTeacherStatisticsApi={StatTeacherStatisticsApi} showNewTeacher={showNewTeacher} getTeacherList={getTeacherList} DetailLoading={DetailLoading} />
                    <NewTeacherEasy NewTeacherEasyOpen={NewTeacherEasyOpen} showNewTeacherEasy={showNewTeacherEasy} StatTeacherStatisticsApi={StatTeacherStatisticsApi} getTeacherList={getTeacherList} DetailLoading={DetailLoading} />
                    <TeacherDetails TeacherDetailsOpen={TeacherDetailsOpen} showTeacherDetails={showTeacherDetails} TeacherDetailId={TeacherDetailId} DetailLoading={DetailLoading} />
                    <TeacherDataReview TeacherDataReviewOpen={TeacherDataReviewOpen} showTeacherDataReview={showTeacherDataReview} StatTeacherStatisticsApi={StatTeacherStatisticsApi} TeacherDetailId={TeacherDetailId} DetailLoading={DetailLoading} getTeacherList={getTeacherList} ListDataCurrentPage={ListDataCurrentPage} ListDataPageSize={ ListDataPageSize} AllScreening={ AllScreening} />
                    <TeacherModification TeacherModificationOpen={TeacherModificationOpen} showTeacherModification={showTeacherModification} TeacherDetailId={TeacherDetailId} setTeacherDetailId={setTeacherDetailId} DetailLoading={DetailLoading} getTeacherList={getTeacherList} ListDataCurrentPage={ListDataCurrentPage} ListDataPageSize={ ListDataPageSize} AllScreening={ AllScreening} />
                    <TeacherChange TeacherChangeOpen={TeacherChangeOpen} showTeacherChange={showTeacherChange} TeacherDetailId={TeacherDetailId} setTeacherDetailId={setTeacherDetailId} DetailLoading={DetailLoading} getTeacherList={getTeacherList} ListDataCurrentPage={ListDataCurrentPage} ListDataPageSize={ ListDataPageSize} AllScreening={ AllScreening} />
                    <ActionTeacher innerRef={ActionTeacherRef} GradeCodes={GradeCode} ClassGradeLists={ClassGradeList} getTeacherList={getTeacherList} ListDataCurrentPage={ListDataCurrentPage} ListDataPageSize={ ListDataPageSize} AllScreening={ AllScreening} />
                    <AddHeadTeacher innerRef={AddHeadTeacherRef} handleClassGradeChange={handleClassGradeChange} />
                    <DeleteTeacher innerRef={DeleteTeacherRef} setSelectedRows={setSelectedRows} StatTeacherStatisticsApi={StatTeacherStatisticsApi} getTeacherList={getTeacherList} ListDataCurrentPage={ListDataCurrentPage} ListDataPageSize={ ListDataPageSize} AllScreening={ AllScreening} />

                </div>
            }
        </Page>

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
        ProvinceCityAddressOptions: state[namespace].ProvinceCityAddressOptions,
    }
}

export default withRouter(connect(mapStateToProps)(employeeData))
