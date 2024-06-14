/*
Author:韦靠谱
Description:职工数据
Date:2023/04/23
Modified By:
*/

import React, { useState, useEffect, useRef } from 'react'
import { withRouter } from 'react-router-dom'
import { Col, Row, Spin,Empty, Form, DatePicker, Cascader, Button, Upload, Select, message, Input, Space, Table, Modal, Dropdown, Menu, Checkbox, Pagination, Radio } from 'antd';
import { SettingOutlined, ExclamationCircleOutlined, SearchOutlined, HomeOutlined, MailOutlined, UserOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { connect } from 'dva'
import { excelType } from '@/utils/const'
import { EmployeeData as namespace } from '@/utils/namespace'
import NewEmployee from './components/NewEmployee/NewEmployee';
import EmployeeDetails from './components/EmployeeDetails/employeeDetails'
import EmployeeDataReview from './components/EmployeeDataReview'
import EmployeeModification from './components/EmployeeModification/EmployeeModification';
import EmployeeChange from './components/EmployeeChange/EmployeeChange'
import accessTokenCache from "@/caches/accessToken";
import userInfoCache from '@/caches/userInfo';
import Page from "@/components/Pages/page";
import DeleteEmployee from './components/DeleteEmployee'
import styles from './employeeData.less'

const title = '数据中心-职工数据';
const breadcrumb = [title];
const header = (<Page.Header breadcrumb={breadcrumb} title={title}/>)
const { Search } = Input;
const { confirm } = Modal;

function employeeData(props) {
    const loginUserInfo = userInfoCache() || {};
    const token = accessTokenCache() && accessTokenCache();
    const { location,dispatch, ProvinceCityAddressOptions, nationOptions, eduOptions, sexOptions, SchoolPostsOptions, SchoolOrgsOptions } = props
    const [loading, setLoading] = useState(true);
    const [ButtonLoading, setButtonLoading] = useState({ perfect :false,Download:false});
    const [DetailLoading, setDetailLoading] = useState(true);
    const [TableDataSource, setTableDataSource] = useState([]);
    const [ListDataCurrentPage, setListDataCurrentPage] = useState(1);
    const [ListDataPageSize, setListDataPageSize] = useState(10);
    const [ListDataTotal, setListDataTotal] = useState([]);
    const [WorkersStatistics, setWorkersStatistics] = useState([]);
    const [AllScreening, setAllScreening] = useState([]);
    const [selectedRows, setSelectedRows] = useState([])//多选-被选中的行
    const [CheckboxDefaultValues, setCheckboxDefaultValues] = useState(['index', 'userName', 'sexText', 'orgName', 'post', 'jobStatusText', 'completedStatusText', 'examineStatusText', 'phone', 'action']);
    const DeleteEmployeeRef = useRef(null)
    // 自选展示的表格字段
    const [NewColumns, setNewColumns] = useState([])
    // 表格滚动宽度
    const [TableRollingWidth, setTableRollingWidth] = useState(0)
    // 展开/折叠筛选
    const [ExpansionScreening, setExpansionScreening] = useState(false)

    // 职工弹窗状态
    const [NewEmployeeOpen, setNewEmployeeOpen] = useState(false);
    const showNewEmployee = () => { setNewEmployeeOpen(!NewEmployeeOpen) }
    const [EmployeeDetailsOpen, setEmployeeDetailsOpen] = useState(false);
    const showEmployeeDetails = () => { setEmployeeDetailsOpen(!EmployeeDetailsOpen) }
    const [EmployeeDataReviewOpen, setEmployeeDataReviewOpen] = useState(false);
    const showEmployeeDataReview = () => { setEmployeeDataReviewOpen(!EmployeeDataReviewOpen) }
    const [EmployeeModificationOpen, setEmployeeModificationOpen] = useState(false);
    const showEmployeeModification = () => { setEmployeeModificationOpen(!EmployeeModificationOpen) }
    const [EmployeeChangeOpen, setEmployeeChangeOpen] = useState(false);
    const showEmployeeChange = () => { setEmployeeChangeOpen(!EmployeeChangeOpen) }


    useEffect(() => {
        if (loginUserInfo.code == 'SCHOOL_ADMIN') {//学校管理员
            dispatch({
              type: namespace + '/getCommonBatchLoadDictGroupsApi',
              payload: {
                dictCodes:
                  'DICT_DOC_TYPE,DICT_DEGREE,DICT_DEGREE_TYPE,DICT_TEACHER_TYPE,DICT_PHYS_RESULT,DICT_RELATION,DICT_NATION,DICT_SEX,DICT_MARRIAGE,DICT_POLIT,DICT_WORK,DICT_POST_INFO,DICT_STUDY_STATUS,DICT_UNIT_METHOD,DICT_EDU,DICT_NATURE,DICT_POST_CHANGE_TYPE,DICT_MANDARIN_LEVEL,DICT_TITLE,DICT_POST,DICT_POST_FUNCTION,DICT_POST_TYPE,HIGH_JOB,DICT_STUDY_YEAR'
              }
            })
			dispatch({
			type: namespace + '/getCommonGetNativeTreeApi',
			payload: { deep: 3 } //查询深度，2：市级：3：区县级
			})
			dispatch({
			type: namespace + '/getCommonGetOrgsApi'
			})
            getCenterStatWorkers()
        }
    }, [])

    const getCenterStatWorkers = () => {
        dispatch({
            type: namespace + "/getWorkerDataCenterStatWorkersApi",
            callback: (res) => {
                if (res) {
                    setWorkersStatistics(res?.result)
                }
            }
        })
    }

    useEffect(() => { setListDataTotal(ListDataTotal) }, [ListDataTotal])

    // 详情
    const sendTeacherDetailId = (userId) => {
        setDetailLoading(true)
        new Promise((resolve) => {
            dispatch({
                type: namespace + "/getWorkerDataCenterFindWorkerInfoApi",
                payload: { userId, resolve },
            })
        }).then((res) => {
            if (Reflect.has(res, 'result')) {
                setDetailLoading(false)
            }
        })
        dispatch({
            type: namespace + "/getWorkerDataCenterFindChangeModifyApi",
            payload: { userId },
        })
    }

    // 职工列表请求
    const getTeacherList = (page = 1, size = 10, value) => {
        setLoading(true)
        dispatch({
            type: namespace + "/postWorkerDataCenterFindWorkerListApi",
            payload: { page, size, ...value },
            callback: (res) => {
                if (res) {
                    setLoading(false)
                    setTableDataSource(res?.result?.data?.map(item => { return { ...item, key: item.userId } }))
                    setListDataTotal(res?.result?.total)
                    setListDataCurrentPage(res?.result?.currentPage)
                }
            }
        })
    }

  // 对下拉框选项进行模糊搜索
  const TitleFilterOption = (input, option) => {
    return (option?.label ? option?.label : '').toLowerCase().includes(input.toLowerCase())
  }

    // 一键督促完善
    const UrgeImproveSuccess = () => {
        setButtonLoading({ ...ButtonLoading, perfect: true });
        dispatch({
            type: namespace + "/getWorkerDataCenterUrgePerfectApi",
            callback: (res) => {
                if (!!res?.result) {
                    setButtonLoading({ ...ButtonLoading, perfect: false });
                    Modal.success({
                        title: '督促完善成功提示',
                        content: (
                            <div>
                                <p>已成功向 {WorkersStatistics?.incompleteNumber} 名未完善信息职工发送完善信息提示！</p>
                            </div>
                        )
                    });
                } else {
                    message.error(res?.result)
                    setButtonLoading({ ...ButtonLoading, perfect: false });
                }
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
								您确定要删除名为 <span style={{ color: '#1890ff', margin: '10px 0 0 0' }}>{record.userName}</span> 的职工吗？
							</div>
						)}
						<div style={{ fontWeight: 800, margin: '10px 0 0 0' }}>该删除操作不可逆。</div>
					</>
				),
				okType: 'danger',
				onOk() {
					DeleteEmployeeRef.current.showDeleteEmployee(record)
				}
			})
		}

    // 列表--列
    const columns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            fixed: 'left',
            render: (text, record, index) => (ListDataCurrentPage - 1) * ListDataPageSize + index + 1,
            width: 50,
        },
        {
            title: '姓名',
            dataIndex: 'userName',
            key: 'userName',
            fixed: 'left',
            width: 80,
        },
        {
            title: '性别',
            dataIndex: 'sexText',
            key: 'sexText',
            width: 70,
        },
        {
            title: '民族',
            dataIndex: 'nation',
            key: 'nation',
            width: 70,
        },
        {
            title: '籍贯',
            dataIndex: 'nativePlace',
            key: 'nativePlace',
            width: 90,
        },
        {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
            width: 90,
        },
        {
            title: '最高学历',
            dataIndex: 'maxEducText',
            key: 'maxEducText',
            width: 90,
        },
        {
            title: '所属处室',
            dataIndex: 'orgName',
            key: 'orgName',
            width: 80,
        },
        {
            title: '职务',
            dataIndex: 'post',
            key: 'post',
            width: 80,
        },
        {
            title: '岗位类别',
            dataIndex: 'postTypeText',
            key: 'postTypeText',
            width: 100,
        },
        {
            title: '岗位等级',
            dataIndex: 'postLevelText',
            key: 'postLevelText',
            width: 80,
        },
        {
            title: '专业技术或工勤技能职务',
            dataIndex: 'postFunctionText',
            key: 'postFunctionText',
            width: 200,
        },
        {
            title: '入职时间',
            dataIndex: 'entryTime',
            key: 'entryTime',
            width: 80,
            render: (_, record) => (record.entryTime && new Date(record.entryTime).getFullYear() + '-' + (new Date(record.entryTime).getMonth() + 1) + '-' + new Date(record.entryTime).getDate()),

        },
        {
            title: '联系电话',
            dataIndex: 'phone',
            key: 'phone',
            width: 100,
        },
        {
            title: '完善资料情况',
            dataIndex: 'completedStatusText',
            key: 'completedStatusText',
            width: 80,

        },
        {
            title: '状态',
            dataIndex: 'jobStatusText',
            key: 'jobStatusText',
            width: 80,
        },
        {
            title: '审核状态',
            dataIndex: 'examineStatusText',
            key: 'examineStatusText',
            width: 100,
        },
        {
            title: '操作',
            key: 'action',
            width: 180,
            render: (_, record) => (
                <Space size="middle">
                    {(record.examineStatus == 2 || record.examineStatus == 6) ?
                        window.$PowerUtils.judgeButtonAuth(location, '审核') && <a onClick={() => { showEmployeeDataReview(); sendTeacherDetailId(record.userId); }}>审核</a> :
                        window.$PowerUtils.judgeButtonAuth(location, '详情') && <a onClick={() => { showEmployeeDetails(); sendTeacherDetailId(record.userId); }}>职工详情</a>
                    }
                    {window.$PowerUtils.judgeButtonAuth(location, '修改') && <a onClick={() => { showEmployeeModification(); sendTeacherDetailId(record.userId); }}>修改</a>}
                    {window.$PowerUtils.judgeButtonAuth(location, '变动') && <a onClick={() => { showEmployeeChange(); sendTeacherDetailId(record.userId); }}>变动</a>}
                    {window.$PowerUtils.judgeButtonAuth(location, '删除') && <a onClick={() => {showDeleteConfirm(record)}}>删除</a>}
                </Space>
            ),
        },
    ]

    // 表格字段按钮 下拉菜单
    const basicsOptions = [
        { label: '姓名', value: 'userName', disabled: true },
        { label: '年龄', value: 'age' },
        { label: '性别', value: 'sexText' },
        { label: '联系电话', value: 'phone' },
        { label: '职务', value: 'post' },
        { label: '民族', value: 'nation' },
        { label: '籍贯', value: 'nativePlace' },
        { label: '最高学历', value: 'maxEducText' },
        { label: '入职时间', value: 'entryTime' },
        { label: '所属处室', value: 'orgName' },
        { label: '岗位类别', value: 'postTypeText' },
        { label: '岗位等级', value: 'postLevelText' },
        { label: '专业技术或工勤技能职务', value: 'postFunctionText' },
        { label: '完善资料情况', value: 'completedStatusText', disabled: true },
        { label: '状态', value: 'jobStatusText', disabled: true },
        { label: '审核状态', value: 'examineStatusText', disabled: true },
        { label: '操作', value: 'action', disabled: true },
        { label: '序号', value: 'index', disabled: true },
    ];

    // 表格字段筛选
    const onCheckboxChange = (checkedValues) => {
        setCheckboxDefaultValues(checkedValues)
        setNewColumns(columns.filter(item => checkedValues.includes(item.key)))
        setTableRollingWidth(columns.filter(item => checkedValues.includes(item.key)).map(item => item.width).reduce((prev, cur) => prev + cur))
    };
    useEffect(() => {
        setNewColumns(columns.filter(item => CheckboxDefaultValues.includes(item.key)))
        setTableRollingWidth(columns.filter(item => CheckboxDefaultValues.includes(item.key)).map(item => item.width).reduce((prev, cur) => prev + cur))
    }, [ListDataCurrentPage])
    const DropdownItems = (
        <Menu multiple={true} forceSubMenuRender={true} className='DropdownPopup'>
            <Menu.SubMenu title="基础信息" key="foundation" icon={<HomeOutlined />}>
                <Checkbox.Group options={basicsOptions} defaultValue={CheckboxDefaultValues} onChange={onCheckboxChange} />
            </Menu.SubMenu>
            <Menu.Item key="examine" disabled={true} icon={<MailOutlined />}>体检信息</Menu.Item>
            <Menu.Item key="condition" disabled={true} icon={<UserOutlined />}>状态</Menu.Item>
        </Menu>
    )

    // 下拉框数据处理
    const conditionOptions = [{ value: '0', label: '离职' }, { value: '1', label: '在职' }]
    // 筛选事件
    const handleSchoolPostsChange = (value) => { setAllScreening({ ...AllScreening, postId: value }) }
    const handleSexChange = (value) => { setAllScreening({ ...AllScreening, sex: value }) }
    const handleConditionChange = (value) => { setAllScreening({ ...AllScreening, jobStatus: value }) }
    const onEmployeeNameSearch = (value) => { setAllScreening({ ...AllScreening, userName: value }) }
    const onTelSearch = (value) => { setAllScreening({ ...AllScreening, phone: value }) }
    const handleEduChange = (value) => { setAllScreening({ ...AllScreening, maxEduc: value }) }
    const handleNationChange = (value) => { setAllScreening({ ...AllScreening, nationId: value }) }
    const handleCityAddressChange = (value) => { setAllScreening({ ...AllScreening, areaId: value[1] }) }
    const onAgeFinish = (value) => { setAllScreening({ ...AllScreening, ...value }) }
    const handleSchoolOrgsChange = (value) => {
        setAllScreening({ ...AllScreening, orgId: value })
        SchoolPostsApi(value)
    }
    const onEntryTimeFinish = (value) => {
        setAllScreening({ ...AllScreening, ...{ minEntryTime: value?.minEntryTime && value?.minEntryTime.format('YYYY/MM/DD'), maxEntryTime: value?.maxEntryTime && value?.maxEntryTime.format('YYYY/MM/DD') } })
    }
    const SchoolPostsApi = (orgId) => {
        dispatch({
            type: namespace + "/getCommonGetPostsApi",
            payload: { orgId }
        })
    }
    // 分页器
    const onPaginationChange = (page, size) => {
        setSelectedRows([])
        getTeacherList(page, size, AllScreening)
        setListDataCurrentPage(page)
        setListDataPageSize(size)
    }

    // 表格左侧切换
    const onChangeRadio = (e) => {
        if (e.target.value == 'all') {
            setAllScreening({ ...AllScreening, examineStatus: null })
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

    // 展开/折叠筛选
    const onExpansionScreening = () => {
        if (!ExpansionScreening) {
            Modal.success({
                title: '温馨提醒',
                content: (
                    <div>
                        <p>更多筛选需要在<b>表格字段</b>中勾选才会在下列表格中展示！</p>
                    </div>
                )
            })
        }
        setExpansionScreening(!ExpansionScreening)
    }

    // 自定义ajax请求 修改接收格式responseType='blob'
    const customRequest = (option) => {
        const getError = (option, xhr) => {
            var msg = "cannot ".concat(option.method, " ").concat(option.action, " ").concat(xhr.status, "'");
            var err = new Error(msg);
            err.status = xhr.status;
            err.method = option.method;
            err.url = option.action;
            return err;
        }

        const getBody = (xhr) => {

            if (xhr.responseType && xhr.responseType !== 'text') {
                return xhr.response;
            }
            var text = xhr.responseText || xhr.response;

            if (!text) {
                return text;
            }

            try {
                return JSON.parse(text);
            } catch (e) {
                return text;
            }
        }

        // eslint-disable-next-line no-undef
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';

        if (option.onProgress && xhr.upload) {
            xhr.upload.onprogress = function progress(e) {
                if (e.total > 0) {
                    e.percent = e.loaded / e.total * 100;
                }

                option.onProgress(e);
            };
        } // eslint-disable-next-line no-undef


        var formData = new FormData();

        if (option.data) {
            Object.keys(option.data).forEach(function (key) {
                var value = option.data[key]; // support key-value array data

                if (Array.isArray(value)) {
                    value.forEach(function (item) {
                        // { list: [ 11, 22 ] }
                        // formData.append('list[]', 11);
                        formData.append("".concat(key, "[]"), item);
                    });
                    return;
                }

                formData.append(key, option.data[key]);
            });
        } // eslint-disable-next-line no-undef


        if (option.file instanceof Blob) {
            formData.append(option.filename, option.file, option.file.name);
        } else {
            formData.append(option.filename, option.file);
        }

        xhr.onerror = function error(e) {
            option.onError(e);
        };

        xhr.onload = function onload() {
            // allow success when 2xx status
            // see https://github.com/react-component/upload/issues/34
            if (xhr.status < 200 || xhr.status >= 300) {
                return option.onError(getError(option, xhr), getBody(xhr));
            }

            return option.onSuccess(getBody(xhr), xhr);
        };

        xhr.open(option.method, option.action, true); // Has to be after `.open()`. See https://github.com/enyo/dropzone/issues/179

        if (option.withCredentials && 'withCredentials' in xhr) {
            xhr.withCredentials = true;
        }

        var headers = option.headers || {}; // when set headers['X-Requested-With'] = null , can close default XHR header
        // see https://github.com/react-component/upload/issues/33

        if (headers['X-Requested-With'] !== null) {
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        }

        Object.keys(headers).forEach(function (h) {
            if (headers[h] !== null) {
                xhr.setRequestHeader(h, headers[h]);
            }
        });
        xhr.send(formData);
        return {
            abort: function abort() {
                xhr.abort();
            }
        };
    }
    // 批量导入前的文件效验
    const beforeUpload = (file) => {
        let vaild;
        const acceptType = () => {
            if (excelType.indexOf && typeof (excelType.indexOf) === 'function') {
                const index = excelType.indexOf(file.type);
                if (index >= 0) {
                    return true;
                } else if (index < 0 && (!file.type || file.type === '') && file.name) {
                    const regex = new RegExp("(\\.xls$)|(\\.xlsx$)");
                    return regex.test(file.name)
                }
            }
            return false;
        };
        vaild = acceptType();
        if (!vaild) {
            message.error('请上传正确格式的excel!');
        }

        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('上传文件必须小于10m!');
        }
        return vaild && isLt10M;
    };
    //   上传组件配置信息
    const UploadProps = {
        name: 'file',
        action: "/auth/web/front/v1/WorkerDataCenter/importExcel",
        headers: { Authorization: token },
        accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel ",//指定选择文件框默认文件类型(.xls/.xlsx)
        onChange(info) {
            //正在上传
            if (info.file.status === 'uploading') {
                setLoading(true);
            }
            if (info.file.status === 'done') {
                if (info.file.response.type == 'application/json') {
                    const reader = new FileReader();
                    reader.readAsText(info.file.response);
                    reader.onload = function (event) {
                        const jsonData = JSON.parse(event.target.result);
                        if (jsonData.code == 200) {
                            message.success('职工数据导入成功！');
                            getTeacherList()
                            setLoading(false);
                        } else {
                            message.error('职工数据导入失败！');
                            setLoading(false);
                        }
                    }
                } else {
                    const blob = new Blob([info.file.response], { type: 'application/vnd.ms-excel;charset=UTF-8' })
                    const a = document.createElement('a') // 转换完成，创建一个a标签用于下载
                    a.download = '职工数据导入反馈.xlsx'
                    a.href = window.URL.createObjectURL(blob)
                    a.click()
                    a.remove()
                    getTeacherList()
                    getCenterStatWorkers()
                    setLoading(false);
                    Modal.warning({
                        title: '导入失败',
                        content: '职工数据导入失败原因已下载,请打开Excel查看具体原因！',
                    });
                }

            } else if (info.file.status === 'error') {
                setLoading(false);
                message.error(`${info.file.name} 上传出错`);
            }

        }
    };

    // 批量导出
    const onBatchDerive = () => {
        confirm({
            title: '导出提示',
            icon: <ExclamationCircleOutlined />,
            content: '您即将导出的职工数据为表格字段中所选中的字段!',
            onOk() {
                function request() {
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', '/auth/web/front/v1/WorkerDataCenter/exportWorkerBath', true);
                    xhr.responseType = 'blob'; // 包装返回数据格式, 打印出来是 Blob 格式的数据，不是乱码的文本
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.setRequestHeader('Authorization', token);
                    xhr.onload = function () {
                        download(xhr.response);
                    };
                    xhr.send(JSON.stringify({ ...AllScreening, exportFields: CheckboxDefaultValues.toString().replace(/Text/g, '').split(",").filter(item => item !== 'action' && item !== 'index') }));
                };

                function download(blobUrl) {
                    const xlsx = 'application/vnd.ms-excel;charset=UTF-8'
                    const blob = new Blob([blobUrl], { type: xlsx })
                    const a = document.createElement('a') // 转换完成，创建一个a标签用于下载
                    a.download = '职工批量导出数据.xls'
                    a.href = window.URL.createObjectURL(blob)
                    a.click()
                    a.remove()
                    message.success('职工批量导出数据已下载！');
                }
                request()
            },
            onCancel() {

            },
        });

    }

    // 下载职工导入模板（完整版）
    const onDownloadTemple = () => {
        setButtonLoading({...ButtonLoading,Download:true})
        function request() {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', '/auth/web/front/v1/WorkerDataCenter/downloadTemple', true);
            xhr.responseType = 'blob'; // 包装返回数据格式, 打印出来是 Blob 格式的数据，不是乱码的文本
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', token);
            xhr.onload = function () {
                download(xhr.response);
            };
            xhr.send();
        };
        function download(blobUrl) {
            const xlsx = 'application/vnd.ms-excel;charset=UTF-8'
            const blob = new Blob([blobUrl], { type: xlsx })
            const a = document.createElement('a') // 转换完成，创建一个a标签用于下载
            a.download = '完整版职工导入模板.xlsx'
            a.href = window.URL.createObjectURL(blob)
            a.click()
            a.remove()
            message.success('完整版职工导入模板 已下载！');
            setButtonLoading({ ...ButtonLoading, Download: false });
        }
        request()
    }

    useEffect(() => {
        setAllScreening(AllScreening)
        getTeacherList(1, ListDataPageSize, AllScreening)
    }, [AllScreening])


    return (
        <Page header={header}>
            {loginUserInfo.code != 'SCHOOL_ADMIN' && //不是学校管理员
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'当前角色没有权限查看当前页面,请联系管理员！'} />
            }
            {loginUserInfo.code == 'SCHOOL_ADMIN' && //学校管理员
                <div id={styles['employeeData']}>
                    {/* 头部 */}
                    <div className={styles['header']}>
                        <div className={styles['left']}>
                            <p>已完善资料职工人数：{WorkersStatistics?.completedNumber}人</p>
                            <p>未完善资料职工人数：{WorkersStatistics?.incompleteNumber}人</p>
                            {window.$PowerUtils.judgeButtonAuth(location, '督促') && <Button loading={ButtonLoading.perfect} type="primary" onClick={UrgeImproveSuccess}>一键督促完善</Button>}
                        </div>
                        <div className={styles['right']}>
                            <Space>
                                <Button type="link" loading={ButtonLoading.Download} onClick={onDownloadTemple}>下载批量导入模板</Button>
                                {window.$PowerUtils.judgeButtonAuth(location, '导入') && <Upload {...UploadProps} beforeUpload={beforeUpload} customRequest={customRequest} showUploadList={false}>
                                    <Button type="link">批量导入</Button>
                                </Upload>}
                                {window.$PowerUtils.judgeButtonAuth(location, '导出') && <Button type="link" onClick={onBatchDerive}>批量导出</Button>}
                            </Space>
                        </div>
                    </div>
                    {/* 筛选 */}
                    <div className={styles['screening']}>
                        <Row>
                            <Col span={23}>
                                <Space size={[8, 16]} wrap>
                                    <Space>处室：<Select showSearch optionFilterProp="label" filterOption={TitleFilterOption} options={SchoolOrgsOptions} onChange={handleSchoolOrgsChange} allowClear style={{ width: 140 }} /></Space>
                                    <Space>职务：<Select showSearch optionFilterProp="label" filterOption={TitleFilterOption} options={SchoolPostsOptions} onChange={handleSchoolPostsChange} allowClear style={{ width: 160 }} /></Space>
                                    <Space>性别：<Select options={sexOptions} onChange={handleSexChange} allowClear style={{ width: 70 }} /></Space>
                                    <Space>状态：<Select options={conditionOptions} onChange={handleConditionChange} allowClear style={{ width: 80 }} /></Space>
                                    <Space>姓名：<Search allowClear onSearch={onEmployeeNameSearch} style={{ width: 180 }} /></Space>
                                    <Space>联系电话：<Search allowClear onSearch={onTelSearch} style={{ width: 150 }} /></Space>
                                </Space>
                            </Col>
                            <Col span={1}>
                                <Button type="link" onClick={onExpansionScreening} icon={ExpansionScreening ? <UpOutlined /> : <DownOutlined />}>更多筛选</Button>
                            </Col>
                        </Row>

                        {ExpansionScreening && <div style={{ margin: '20px 0 0 0' }}>
                            <Space size={[8, 16]} wrap>
                                <Space>学历层次：<Select showSearch optionFilterProp="label" filterOption={TitleFilterOption} options={eduOptions} onChange={handleEduChange} allowClear style={{ width: 80 }} /></Space>
                                <Space>民族：<Select showSearch optionFilterProp="label" filterOption={TitleFilterOption} options={nationOptions} allowClear onChange={handleNationChange} style={{ width: 100 }} /></Space>
                                <Space>籍贯：<Cascader showSearch optionfilterprop="label" filterOption={TitleFilterOption} options={ProvinceCityAddressOptions} onChange={handleCityAddressChange} allowClear style={{ width: 250 }} /></Space>
                                <Space>体检情况：<Select disabled allowClear style={{ width: 80 }} /></Space>
                                <Space>
                                    <Form name="age" onFinish={onAgeFinish}>
                                        <Space size={[0, 0]}>
                                            <Form.Item label="年龄" name="minAge" style={{ marginBottom: '0' }}><Input allowClear style={{ width: 60, borderRight: 0 }} /></Form.Item>
                                            <Input style={{ width: 30, borderLeft: 0, borderRight: 0, pointerEvents: 'none' }} placeholder="~" disabled />
                                            <Form.Item name="maxAge" style={{ marginBottom: '0' }}><Input allowClear style={{ width: 60, borderLeft: 0, borderRight: 0 }} /></Form.Item>
                                            <Form.Item style={{ marginBottom: '0' }}><Button htmlType="submit" icon={<SearchOutlined style={{ color: '#8c8c8c' }} />}></Button></Form.Item>
                                        </Space>
                                    </Form>
                                </Space>
                                <Space>
                                    <Form name="EntryTime" onFinish={onEntryTimeFinish}>
                                        <Space size={[0, 0]}>
                                            <Form.Item label="入职时间" name="minEntryTime" style={{ marginBottom: '0' }}><DatePicker style={{ borderRight: 0 }} /></Form.Item>
                                            <Input style={{ width: 40, borderLeft: 0, borderRight: 0, pointerEvents: 'none' }} placeholder="至" disabled />
                                            <Form.Item name="maxEntryTime" style={{ marginBottom: '0' }}><DatePicker style={{ borderLeft: 0, borderRight: 0 }} /></Form.Item>
                                            <Form.Item style={{ marginBottom: '0' }}><Button htmlType="submit" icon={<SearchOutlined style={{ color: '#8c8c8c' }} />}></Button></Form.Item>
                                        </Space>
                                    </Form>
                                </Space>

                            </Space>
                        </div>}
                    </div>
                    {/* 创建 */}
                    <div className={styles['createStaff']}>
                        <Row gutter={16}>
                            <Col span={18}>
                                {window.$PowerUtils.judgeButtonAuth(location, '添加') && <Button type="dashed" size={"large"} block onClick={showNewEmployee}>快速创建职工账号</Button>}
                            </Col>
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
                                <Radio.Button value="all">全部<br />{WorkersStatistics?.totalNumber}人</Radio.Button>
                                <Radio.Button value="recheck">待复核<br />{WorkersStatistics?.recheckNumber}人</Radio.Button>
                                <Radio.Button value="rejected">已驳回<br />{WorkersStatistics?.rejectedNumber}人</Radio.Button>
                                <Radio.Button value="uncheck">未审核<br />{WorkersStatistics?.uncheckNumber}人</Radio.Button>
                                <Radio.Button value="incomplete">待完善<br />{WorkersStatistics?.uncompletedNumber}人</Radio.Button>
                                <Radio.Button value="StaySubmitReview">待提交复核<br />{WorkersStatistics?.modifiedNumber}人</Radio.Button>
                            </Radio.Group>
                        </Col>
                        <Col span={22}>
                            <Spin spinning={loading}>
                                <Table rowSelection={window.$PowerUtils.judgeButtonAuth(location, '批量删除') ? rowSelection : null } columns={NewColumns} dataSource={TableDataSource} pagination={false} scroll={{ x: TableRollingWidth + 450,y:550 }} />
                            </Spin>
                            <Pagination
                                onChange={onPaginationChange}
                                total={ListDataTotal}
                                showTotal={(total) => `总计 ${total} 人`}
                                defaultPageSize={10}
                                showSizeChanger={true}
                                current={ListDataCurrentPage}
                                style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}
                            />
                        </Col>
                    </Row>

                    <NewEmployee NewEmployeeOpen={NewEmployeeOpen} showNewEmployee={showNewEmployee} getTeacherList={getTeacherList} getCenterStatWorkers={getCenterStatWorkers} DetailLoading={DetailLoading} />
                    <EmployeeDetails EmployeeDetailsOpen={EmployeeDetailsOpen} showEmployeeDetails={showEmployeeDetails} getTeacherList={getTeacherList} DetailLoading={DetailLoading} />
                    <EmployeeDataReview EmployeeDataReviewOpen={EmployeeDataReviewOpen} showEmployeeDataReview={showEmployeeDataReview} getCenterStatWorkers={getCenterStatWorkers} DetailLoading={DetailLoading} getTeacherList={getTeacherList} ListDataCurrentPage={ListDataCurrentPage} ListDataPageSize={ ListDataPageSize} AllScreening={ AllScreening} />
                    <EmployeeModification EmployeeModificationOpen={EmployeeModificationOpen} showEmployeeModification={showEmployeeModification} DetailLoading={DetailLoading} getTeacherList={getTeacherList} ListDataCurrentPage={ListDataCurrentPage} ListDataPageSize={ ListDataPageSize} AllScreening={ AllScreening} />
                    <EmployeeChange EmployeeChangeOpen={EmployeeChangeOpen} showEmployeeChange={showEmployeeChange} DetailLoading={DetailLoading} getTeacherList={getTeacherList} ListDataCurrentPage={ListDataCurrentPage} ListDataPageSize={ ListDataPageSize} AllScreening={ AllScreening} />
                    <DeleteEmployee innerRef={DeleteEmployeeRef} setSelectedRows={setSelectedRows} getCenterStatWorkers={getCenterStatWorkers} getTeacherList={getTeacherList} ListDataCurrentPage={ListDataCurrentPage} ListDataPageSize={ ListDataPageSize} AllScreening={ AllScreening} />
                </div >
            }
        </Page>
    )
}

const mapStateToProps = (state) => {
    return {
        CityAddressOptions: state[namespace].CityAddressOptions,
        nationOptions: state[namespace].nationOptions,
        eduOptions: state[namespace].eduOptions,
        sexOptions: state[namespace].sexOptions,
        SchoolOrgsOptions: state[namespace].SchoolOrgsOptions,
        SchoolPostsOptions: state[namespace].SchoolPostsOptions,
        ProvinceCityAddressOptions: state[namespace].ProvinceCityAddressOptions,
    }
}

export default withRouter(connect(mapStateToProps)(employeeData))
