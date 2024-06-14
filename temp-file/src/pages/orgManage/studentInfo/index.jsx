/**
* 学生管理
* @author:张江
* @date:2020年09月09日
* @version:v1.0.0
* 2021-09-24--xiongwei ------------添加学生分组功能弹窗 *
* 2022-01-09--张江 ------------添加学生口令操作显示 *
* */

// eslint-disable-next-line
import React from 'react';
import { connect } from "dva";
import classNames from 'classnames';
import {
    Button,
    Modal,
    Table,
    Divider,
    message,
    Spin,
    // Cascader,
    Select,
    Empty,
    Progress,
    Menu,
    Dropdown,
    Popover,
} from 'antd';
import queryString from 'query-string';
import { SearchOutlined, UploadOutlined, PlusOutlined, DownloadOutlined, } from '@ant-design/icons';
import { routerRedux } from 'dva/router';
import { getIcon, stdColumns, doHandleYear, openNotificationWithIcon, dealTimestamp, copyText } from "@/utils/utils";
import { particularYear, pumaNodeTypeList } from "@/utils/const";
import Page from '@/components/Pages/page';
import paginationConfig from '@/utils/pagination';
import styles from './index.less';
import { StudentMange as namespace, Public, Auth, PenManage, ClassAndTeacherManage } from '@/utils/namespace';
import ClassList from '@/components/ClassList/ClassList';
// import schoolInfoCache from '@/caches/schoolInfo';
import userInfoCache from '@/caches/userInfo';

import StudentMigration from './components/StudentMigration/index';//学生迁移
import BulkImport from './components/BulkImport/index';//批量导入
import AddOrEdit from './components/AddOrEdit/index';//学生新增、编辑
import StudentGroup from './components/StudentGroup/index';//学生分组
import studentGroupInfoCache from "@/caches/generalCacheByKey";
import { saveFileToLink } from 'web-downloadfile'
import classInfoStyles from '@/pages/orgManage/classManage/classInfo.less';

const { Option, OptGroup } = Select;
const IconFont = getIcon();

@connect(state => ({
    loading: state[Public].loading,//显示加载中

    studyAndGradeList: state[Public].studyAndGradeList,//学段年级列表
    gradeList: state[Public].gradeList,//年级列表

    studentClassList: state[namespace].studentClassList,//班级列表
    classStudentInfo: state[namespace].classStudentInfo,//班级下的学生信息
    studentLoading: state[namespace].studentLoading,//显示加载中
    classLoading: state[namespace].classLoading,//显示加载中
    authButtonList: state[Auth].authButtonList,//按钮权限数据

    generationLoading: state[namespace].generationLoading,//显示加载中

    findStudentGroup: state[namespace].findStudentGroup,//学生分组 组类

    findStudentGroupLoading: state[namespace].findStudentGroupLoading,//学生分组Loading

}))

export default class StudentInfoMange extends React.Component {
    constructor(props) {
        super(...arguments);
        this.state = {
            addEditModalVisible: false,
            assignAuthModalVisible: false,
            platformId: '',
            singleRoleInfo: {},
            roleName: '',


            gradeCode: '',
            learningLevelCode: doHandleYear(),
            selectedClassCode: '',

            bulkImportVisible: false,
            isShowAddOrEditModal: false,
            showStudentGroupModal: false,
            studentInfo: {},

            schoolId: '',
            progressValue: 100,

            isDownload: false,
            downloadUrl: '',
            isUpdate: true,

            downloadUrlArray: [],
            QRCInfo: {},//口令信息
        };
    };

    UNSAFE_componentWillMount() {

    }

    componentDidMount() {
        const { dispatch, location, } = this.props;
        const { search } = location;
        const query = queryString.parse(search);
        const loginUserInfo = userInfoCache() || {};
        if (loginUserInfo && loginUserInfo.schoolId) {
            this.setState({
                schoolId: loginUserInfo.schoolId,
            })
        }
        if (loginUserInfo.code == 'SCHOOL_ADMIN') {//学校管理员
            dispatch({// 获取学段和年级
                type: Public + '/getStudyAndGradeList',
                payload: {
                    studyId: loginUserInfo.studyIds,
                },
                callback: (result) => {
                    if (result && result.length > 0) {
                        let gradeCode = query && query.gradeId ? Number(query.gradeId) : result[1] ? result[1].gradeList[0].gradeId : result[0].gradeList[0].gradeId;
                        this.setState({
                            gradeCode,
                        })

                    }

                }
            });
            dispatch({// 获取年级列表
                type: Public + '/getGradeList',
                payload: {},
                callback: (result) => {
                    if (result && result.length > 0) {
                        // let gradeCode = query && query.gradeId ? Number(query.gradeId) : result[11] ? result[11].id : result[0].id;
                        let learningLevelCode = query && query.learningLevelCode ? query.learningLevelCode : doHandleYear();
                        this.setState({
                            // gradeCode,
                            learningLevelCode,
                        }, () => {
                            if (loginUserInfo && loginUserInfo.schoolId) {
                                this.getStudentClassList(loginUserInfo.schoolId)
                            }
                        })
                    }
                }
            });
            // 2021年05月28日 任课老师或者班主任查看学生管理 张江 加
        } else if ((loginUserInfo.code == 'TEACHER' || loginUserInfo.code == 'CLASS_HEAD') && loginUserInfo.classId) {
            this.setState({
                selectedClassCode: loginUserInfo.classId
            })
            // 任课老师与班主任
            this.getStudentList(loginUserInfo.classId)
        }

    }

    /**
* 页面组件即将卸载时：清空数据
*/
    componentWillUnmount() {
        const { dispatch } = this.props;
        clearInterval(this.intervalTimer);//清除定时器
        dispatch({
            type: namespace + '/saveState',
            payload: {
                studentLoading: false,
                classStudentInfo: {}
            },
        });
        this.setState = (state, callback) => {
            return;
        };
        // schoolInfoCache.clear();
    }


    /**
    * 主页获取班级列表
    * @param schoolId  ：机构id
    */
    getStudentClassList = (schoolId, type) => {
        const {
            dispatch,
            location
        } = this.props;
        const { learningLevelCode, gradeCode } = this.state
        const { search } = location;
        const query = queryString.parse(search);
        this.setState({
            schoolId,
        })
        dispatch({// 显示加载 清空数据
            type: namespace + '/saveState',
            payload: {
                classLoading: false,
                studentClassList: []
            }
        });

        dispatch({
            type: namespace + '/getStudentClassList',
            payload: {
                schoolId: schoolId,
                gradeId: gradeCode,
                studyYear: String(learningLevelCode),
                page: 1,
                size: 10000,
            },
            callback: (result) => {
                if (result && result.data && result.data.length > 0) {
                    let selectedClassCode = query && query.classId ? query.classId : result.data[0].id;
                    if (type == 1) {
                        selectedClassCode = result.data[0].id;
                    }
                    dispatch({// 显示加载 清空数据
                        type: namespace + '/saveState',
                        payload: {
                            classLoading: false,
                        }
                    });
                    this.replaceSearch({ classId: selectedClassCode })
                    this.setState({
                        selectedClassCode,
                    }, () => {
                        dispatch({// 显示加载 清空数据
                            type: namespace + '/saveState',
                            payload: {
                                classLoading: true,
                            }
                        });
                    })
                    this.getStudentList(selectedClassCode)
                } else {
                    this.setState({
                        selectedClassCode: '',
                    })
                }
            }
        });
    }

    /**
    * 获取学生列表
    * @param classId  ：班级id
    */
    getStudentList = (classId) => {
        const {
            dispatch,
            location
        } = this.props;
        const { learningLevelCode, gradeCode, isUpdate } = this.state
        dispatch({// 显示加载 清空数据
            type: namespace + '/saveState',
            payload: {
                studentLoading: false,
                classStudentInfo: {}
            }
        });

        dispatch({
            type: namespace + '/getStudentList',
            payload: {
                classId: classId,
            },
            callback: () => {
                //判断获取链接下载链接/制作状态
                this.getDownloadUrl();
            }
        });
    }

    /**
    * 组件筛选获取班级列表
    * @param selectedLevelCode  ：学级code
    */
    getOptionalClassList = (selectedLevelCode) => {
        const {
            dispatch,
            location
        } = this.props;
        const { gradeCode, schoolId, learningLevelCode } = this.state
        dispatch({// 显示加载 清空数据
            type: namespace + '/saveState',
            payload: {
                optionalClassList: null,
            }
        });

        dispatch({
            type: namespace + '/getOptionalClassList',
            payload: {
                schoolId: schoolId,
                // gradeId: gradeCode,
                studyYear: String(selectedLevelCode),
                page: 1,
                size: 10000,
            },
        });
    }

    /**
    * 根据传入的对象，往地址栏添加对应的参数
    * @param obj  ：参数对象
    */
    replaceSearch = (obj) => {
        const { dispatch, location } = this.props;
        const { search, pathname } = location;
        let query = queryString.parse(search);
        query = { ...query, ...obj };
        //修改地址栏最新的请求参数
        dispatch(routerRedux.replace({
            pathname,
            search: queryString.stringify(query),
        }));
    };

    /**
    * 输入框值变化
    * @param e ：事件对象
    */
    handleValueOnChange = (e) => {
        this.setState({
            roleName: e.target.value,
        })
    }

    /**
    * 搜索
    */
    onSearch = () => {
        const { schoolId, gradeCode, learningLevelCode } = this.state;
        if (!schoolId) {
            message.warning('请先选择机构');
            return;
        }
        this.replaceSearch({ gradeId: gradeCode, learningLevelCode, p: 1, classId: '' })
        this.getStudentClassList(schoolId, 1)
    }


    /**
    * 机构或者学校级联选择
    * @param value ：选择的值
    */
    onCascaderChange = (value, selectedOptions) => {
        const {
            dispatch,
        } = this.props;
        if (value && value.length == 4) {

            this.replaceSearch({ schoolId: JSON.stringify(value), p: 1, classId: '' })
            this.getStudentClassList(value[3], 1)
        }
    }

    /**
* 选择年级
* @param gradeCode  ：年级id
*/
    handleGradeChange = (gradeCode) => {
        this.setState({
            gradeCode,
        })

    }

    /**
* 选择学级
* @param learningLevelCode  ：学级code
*/
    handleLearningLevelChange = (learningLevelCode) => {
        this.setState({
            learningLevelCode,
        })

    }

    /**
* 选中班级
* @param learningLevelCode  ：班级code
*/
    selectedClassCodeChange = (selectedClassCode, page) => {
        this.setState({
            selectedClassCode,
        })
        this.getStudentList(selectedClassCode);
        this.replaceSearch({ classId: selectedClassCode })
    }


    /**
    * 学生迁移抽屉
    */
    showStudentMigrationDrawer = () => {
        const { learningLevelCode } = this.state;
        this.getOptionalClassList(learningLevelCode)
        this.setState({
            topDrawerVisible: true,
        });

    };

    onCloseStudentMigration = () => {
        const {
            dispatch,
        } = this.props;
        this.setState({
            topDrawerVisible: false,
        });
        const { schoolId, gradeCode, learningLevelCode } = this.state
        dispatch({
            type: namespace + '/getStudentClassList',
            payload: {
                schoolId: schoolId,
                gradeId: gradeCode,
                studyYear: String(learningLevelCode),
                page: 1,
                size: 10000,
            },
        });

    };


    /**
* 批量导入抽屉
*/
    showBulkImportDrawer = (isSchoolAdmin) => {
        const { learningLevelCode } = this.state;
        // 2021年05月28日 任课老师或者班主任查看学生管理 张江 加 非学校管理员不拉取班级列表
        if (isSchoolAdmin) {
            this.getOptionalClassList(learningLevelCode)
        }
        this.setState({
            bulkImportVisible: true,
        });
    };

    onCloseBulkImport = () => {
        this.setState({
            bulkImportVisible: false,
        });
    };


    /**
* 学生分组Modal
*/
    showStudentGroupModal = (isSchoolAdmin) => {
        const {
            dispatch,
        } = this.props;
        // const { learningLevelCode } = this.state;
        // if (isSchoolAdmin) {
        //     this.getOptionalClassList(learningLevelCode)
        // }
        this.setState({
            showStudentGroupModal: true,
        });
        dispatch({
            type: namespace + '/findStudentGroup',
            payload: {
            },
        });
    };

    onCloseStudentGroupModal = (isOk) => {
        const { findStudentGroup = [], classStudentInfo } = this.props;
        const loginUserInfo = userInfoCache() || {};
        const { classId = loginUserInfo.classId } = classStudentInfo || {};
        const {
            dispatch,
        } = this.props;

        if (isOk == 1) {
            let studentGroupDto = []
            findStudentGroup.map(({ id }) => {
                let arr = studentGroupInfoCache(id + 'defaultSelectedList') || []
                studentGroupDto.push({
                    groupId: id,
                    studentIds: arr
                })
            })
            console.log('studentGroupDto', studentGroupDto)
            dispatch({
                type: namespace + '/saveStudentsGroup',
                payload: studentGroupDto,
                callback: (result) => {
                    message.success('分组成功')
                    this.getStudentList(classId)
                    this.setState({
                        showStudentGroupModal: false,
                    });
                }
            });
        } else {
            this.setState({
                showStudentGroupModal: false,
            });
        }
    };

    /**
* 展示添加弹窗
* @param studentInfo  ：单个学生数据
*/
    showModal = (studentInfo) => {
        const { learningLevelCode } = this.state;
        if (studentInfo.isSchoolAdmin) {
            this.getOptionalClassList(learningLevelCode)
        }
        this.setState({
            isShowAddOrEditModal: true,
            studentInfo,
        });
    };

    handleHideModalVisible = () => {
        this.setState({
            isShowAddOrEditModal: false,
            studentInfo: {},
        });
    }

    /**
    * 保存学生信息
      * @param payload  ：参数
      * * @param callback  ：回调
            */
    saveStudentInfo = (payload, callback) => {

        const {
            dispatch,
            location
        } = this.props;
        const { selectedClassCode } = this.state

        dispatch({
            type: namespace + '/saveStudentInfo',
            payload: {
                ...payload,
            },
            callback: (result) => {
                if (payload.id) {
                    message.success('学生修改成功');
                } else {
                    message.success('学生添加成功');
                }
                this.getStudentList(selectedClassCode)
                callback();
            }
        });


    }


    /**
  * 剔除学生操作
  * @param item  ：单个数据
  */
    handleDeleteOper(item) {
        const {
            dispatch,
        } = this.props;
        const { schoolId } = this.state
        Modal.confirm({
            title: '提示信息',
            content: `您确定将学生【${item.userName || ''}】剔除【${item.fullName || ''}】？`,
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                dispatch({
                    type: namespace + '/deleteClassStudentInfo',
                    payload: {
                        studentId: item.id,
                        schoolId: schoolId,
                        classId: item.classId
                    },
                    callback: (result) => {
                        message.success('学生已成功剔除该班级');
                        this.getStudentList(item.classId)
                    }
                });
            }
        });
    }



    /**
* 批量上传学生
* @param payload  ：传参
*/
    saveUploadBulkImport = (payload, callback) => {
        const {
            dispatch,
        } = this.props;
        const { schoolId } = this.state
        let formData = new FormData();
        payload.schoolId = schoolId;
        Object.keys(payload).forEach(key => {
            if (typeof payload[key] === 'undefined') {
                delete payload[key]
            } else {
                formData.append(key, payload[key]);
            }
        });
        dispatch({//批量上传学生
            type: namespace + '/batchImportStudentList',
            payload: {
                formData: formData,
            },
            callback: (result) => {
                callback();
                message.success('批量上传成功');
                this.getStudentList(payload.classId)
            }
        });

    }


    /**
   *   学生迁移
     * @param payload  ：参数
     * * @param callback  ：回调
           */
    saveStudentMigration = (payload, callback) => {

        const {
            dispatch,
            location
        } = this.props;
        const { selectedClassCode } = this.state
        dispatch({
            type: namespace + '/saveStudentTransferInfo',
            payload: {
                ...payload,
            },
            callback: (result) => {
                message.success('学生迁移成功');
                this.getStudentList(selectedClassCode)
                callback();
            }
        });

    }

    /**
  *   制作或更新链接卡
    * @param payload  ：参数
          */
    generationConnectionCard = (payload) => {
        const {
            dispatch,
            location
        } = this.props;
        dispatch({// 显示制作更新
            type: namespace + '/saveState',
            payload: {
                generationLoading: true,
            }
        });
        this.setState({
            isUpdate: false
        })
        const resetLoading = () => {
            dispatch({// 重置加载中
                type: namespace + '/saveState',
                payload: {
                    generationLoading: false,
                }
            });
        }
        let loadingTimer = setTimeout(() => {
            this.setState({
                isUpdate: true
            })
            clearTimeout(loadingTimer)
            resetLoading();
        }, 10000)
        dispatch({
            type: namespace + '/generationConnectionCard',
            payload: {
                ...payload,
            },
            callback: (result) => {
                clearTimeout(loadingTimer)
                resetLoading();
                const returnJudge = window.$HandleAbnormalStateConfig(result);
                if (returnJudge && !returnJudge.isContinue) { return; };//如果异常 直接返回
                // message.success(result);
                openNotificationWithIcon('info', '制作/更新链接卡', '', `正在制作/更新中，请稍候...`);
                let getTimer = setTimeout(() => {
                    clearTimeout(getTimer);
                    this.setState({
                        isUpdate: true
                    }, () => { this.getDownloadUrl(); })
                }, 3000)
            }
        });
    }

    /**
    *   获取链接卡的下载url或者实时获取获取动态
      */
    getDownloadUrl = () => {
        const {
            dispatch,
            classStudentInfo,
        } = this.props;
        const { isUpdate } = this.state
        const loginUserInfo = userInfoCache() || {};
        const { classId = loginUserInfo.classId } = classStudentInfo || {};
        // clearInterval(this.intervalTimer)
        // this.intervalTimer = setInterval(this.getDownloadUrl, 6000);
        // this.setState({
        //     downloadUrl: '',
        // })
        // let getTimer = 0;
        // if (isUpdate) {
        //     getTimer = setTimeout(() => {
        //         clearTimeout(getTimer);
        //         clearInterval(this.intervalTimer);//清除定时器
        //     }, 8000)
        // } else {
        //     clearTimeout(getTimer);
        // }
        this.setState({
            downloadUrlArray: []
        })
        dispatch({
            type: namespace + '/getConnectionCardList',
            payload: {
                classId,
            },
            callback: (result) => {
                // clearTimeout(getTimer);
                // const { state, url } = result || {}
                this.setState({
                    downloadUrlArray: result || []
                })
                const returnJudge = window.$HandleAbnormalStateConfig(result);
                if (returnJudge && !returnJudge.isContinue) { return; };//如果异常 直接返回
                // 点阵铺设状态 0：未开始 1：铺设中 2：铺设完成且成功 3：铺设完成且失败
                // if (state != 1) {//0：未开始
                //     clearInterval(this.intervalTimer);//清除定时器
                //     if (url) {
                //         this.setState({
                //             downloadUrl: url,
                //         })
                //     }
                //     if (state == 3) {//3：铺设完成且失败
                //         openNotificationWithIcon('warn', '铺码提示', '', `铺设完成但是失败,请重新制作/更新链接卡尝试！`);
                //     }
                //     this.setState({
                //         isUpdate: true,
                //     })
                // } else {
                //     this.setState({
                //         isUpdate: false
                //     })
                // }//1：铺设中
            }
        });
    }

    /**
 * 动态请求qrc并显示
 * @param id
 */
    handleQRC = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: ClassAndTeacherManage + '/getClassCommandInfo',
            payload: { id },
            callback: (response) => {
                if (Object.keys(response).length) {
                    this.setState({ QRCInfo: response })
                }
            }
        })
    }
    /**
     * 控制口令信息关闭清空信息状态
     * @param status
     */
    onVisibleChange = (status) => {
        if (!status) {
            this.setState({ QRCInfo: {} })
        }
    }

    /**
 * 放大二维码
 * @param qr 二维码地址
 */
    openQR = (qr) => () => {
        window.open(qr, '_blank', "height=" + (800) + ",width=" + (800) + ",top=0, left=0,toolbar=no, menubar=no, scrollbars=no, location=no, status=no");
    };

    /**
     * 复制到剪贴板
     */
    copyQrCode = () => {
        const qrCodeDom = this.qrCode;
        copyText(qrCodeDom.innerText)
    };

    render() {
        const {
            location,
            dispatch,
            loading,
            studyAndGradeList,
            gradeList,
            studentLoading,
            studentClassList,
            classStudentInfo,
            classLoading,
            authButtonList,//按钮权限数据

            generationLoading,
            findStudentGroup = [],
            findStudentGroupLoading
        } = this.props;
        const {
            studentInfo,
            selectedClassCode,
            gradeCode,
            learningLevelCode,
            topDrawerVisible,
            bulkImportVisible,
            showStudentGroupModal,
            isShowAddOrEditModal,
            progressValue,

            isDownload,
            isUpdate,
            downloadUrl,

            downloadUrlArray,
            QRCInfo
        } = this.state;
        const loginUserInfo = userInfoCache() || {};
        const { pathname, search } = location;
        const query = queryString.parse(search);
        const title = '学生管理';
        const breadcrumb = [title];
        const header = (
            <Page.Header breadcrumb={breadcrumb} title={title} />
        );
        const { classId = loginUserInfo.classId, female = 0, male = 0, other = 0, studentList = [], fullName = loginUserInfo.className } = classStudentInfo || {};
        // 权限判断处理
        const powerDeal = (buttonName) => {
            return window.$PowerUtils.judgeButtonAuth(authButtonList, buttonName);
        }
        const isSchoolAdmin = loginUserInfo.code == 'SCHOOL_ADMIN';//是否是学校管理员

        /**
  * 下载通用答题卡 20210805 张江加
  */
        const downLoadAnswerCar = () => {
            dispatch({
                type: PenManage + '/getConnectionCard',
                callback: (request) => {
                    if (request && request.url) {
                        window.open(`${request?.url}`)
                    } else {
                        openNotificationWithIcon('warn', '下载通用答题卡提示', '', `还未上传通用答题卡,请联系客服或管理员！`);
                    }
                }
            })
        }

        const columns = [
            {
                title: '姓名',
                dataIndex: 'userName',
                render: text => <span>{text || '--'}</span>,
            },
            {
                title: '性别',
                dataIndex: 'sexStr',
            },
            {
                title: '账号',
                dataIndex: 'account',
            },
            {
                title: '分组',
                dataIndex: 'groupName',
                render: (text) => {
                    return text ? text : '未分组'
                }
            },
            {
                title: '学号/唯一码',
                dataIndex: 'schoolOnlyId',
                render: (text) => {
                    return text ? text : '-'
                }
            },
            // {
            //     title: '班级',
            //     dataIndex: 'fullName',
            //     key: 'fullName',
            // },
            {
                title: '修改时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
            },
            {
                title: '操作',
                dataIndex: 'id',
                render: (text, record) => (
                    <span>
                        {
                            record.isLock != 1 ? [
                                <span key={1}>
                                    {
                                        powerDeal('编辑') ? [<a key={1} onClick={() => { record.isSchoolAdmin = isSchoolAdmin; this.showModal(record) }}>编辑</a>,
                                        ] : null
                                    }
                                </span>,
                                <span key={2}>
                                    {
                                        powerDeal('剔除') && isSchoolAdmin ? [<Divider key={2} type="vertical" />, <a key={3} style={{ color: '#ff4d4f' }} onClick={() => { this.handleDeleteOper(record) }}>剔除</a>] : null
                                    }
                                </span>
                            ] : null
                        }

                    </span>
                ),
            },
        ];

        const handleTableChange = (pagination, filters, sorter) => {
            this.replaceSearch({
                p: pagination.current,
                // s: pagination.pageSize,
            })
        };

        //口令显示
        const popoverContent = (record) => {
            return (
                <Spin spinning={!!loading} tip="正在加载中...">
                    <div className={classInfoStyles['popoverBox']}>
                        <div className={classInfoStyles['message']}>
                            <p>1:学生通过口令字符串或口令二维码，可以加入对应的班级</p>
                            <p>2:口令信息请勿随意泄漏，以免造成无关人员加入</p>
                            <p>3:此口令将在{dealTimestamp(record.endTime, 'YYYY-MM-DD')}失效</p>
                        </div>
                        <div className={classInfoStyles['content']}>
                            <div className={classInfoStyles['title']}>
                                {record.fullName}
                            </div>
                            <div className={classInfoStyles['wordBox']}>

                                <div className={classInfoStyles['qrCode']}>
                                    <div className={classInfoStyles['name']}>口令字符串</div>
                                    <div className={classInfoStyles['qrBox']}>

                                        <div className={classInfoStyles['coped']} ref={(ref) => {
                                            this.qrCode = ref
                                        }}>
                                            {record.qrCode}
                                        </div>
                                        <a onClick={this.copyQrCode}>复制</a>
                                    </div>
                                </div>

                                <div className={styles['qrCodeAddress']}>
                                    <div className={styles['name']}>口令二维码</div>
                                    <div className={styles['qrImgBox']}>
                                        <div className={styles['coped']}>
                                            <img onClick={this.openQR(record.qrCodeAddress)} src={record.qrCodeAddress} alt="二维码" />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </Spin>
            )
        };
        const classString = classNames(styles['studentInfo-mange-content'], 'gougou-content');
        return (
            <Page header={header} loading={!!loading}>
                {/* 学生迁移 */}
                {
                    topDrawerVisible ? <StudentMigration
                        location={location}
                        gradeList={gradeList}
                        studyAndGradeList={studyAndGradeList}
                        onCloseStudentMigration={this.onCloseStudentMigration}
                        getOptionalClassList={this.getOptionalClassList}
                        saveStudentMigration={this.saveStudentMigration}
                        topDrawerVisible={topDrawerVisible}
                        loginUserInfo={loginUserInfo}
                    /> : null
                }

                {/* 批量导入 */}
                <BulkImport
                    classId={classId}
                    fullName={fullName}
                    isSchoolAdmin={isSchoolAdmin}
                    location={location}
                    onCloseBulkImport={this.onCloseBulkImport}
                    getOptionalClassList={this.getOptionalClassList}
                    saveUploadBulkImport={this.saveUploadBulkImport}
                    bulkImportVisible={bulkImportVisible}
                />

                {/* 学生分组 */}
                <StudentGroup
                    findStudentGroup={findStudentGroup}
                    studentList={studentList}
                    loading={findStudentGroupLoading}
                    location={location}
                    onCloseStudentGroupModal={this.onCloseStudentGroupModal}
                    showStudentGroupModal={showStudentGroupModal}
                />

                {/* 学生信息添加、编辑 */}
                {
                    isShowAddOrEditModal ?
                        <AddOrEdit
                            classId={classId}
                            location={location}
                            isShowModal={isShowAddOrEditModal}
                            studentInfo={studentInfo}
                            handleHideModalVisible={this.handleHideModalVisible}
                            saveStudentInfo={this.saveStudentInfo}
                            getOptionalClassList={this.getOptionalClassList}
                            loginUserInfo={loginUserInfo}
                        /> : null
                }

                <div className={classString}>

                    <div>
                        <div className={styles['header-option']}>
                            {

                                powerDeal("搜索") && isSchoolAdmin ? <div className={styles['search-box']}>
                                    <div>
                                        <label>学校：</label>
                                        <div className={styles['school-name']}>{loginUserInfo.schoolName || ''}</div>
                                    </div>

                                    <div>
                                        <label>年级：</label>
                                        <Select
                                            value={Number(gradeCode)}
                                            style={{ width: 120 }}
                                            onChange={this.handleGradeChange}>
                                            {/* <Option key={0} value={''}>全部</Option> */}
                                            {
                                                studyAndGradeList && studyAndGradeList.map((item) => {
                                                    return (
                                                        <OptGroup label={item.studyName} key={item.studyId}>
                                                            {
                                                                item.gradeList && item.gradeList.map((item) => {
                                                                    return (
                                                                        <Option key={item.gradeId} value={item.gradeId}>{item.gradeName}</Option>
                                                                    )
                                                                })
                                                            }
                                                        </OptGroup>
                                                    )
                                                })
                                            }

                                        </Select>
                                    </div>

                                    <div>
                                        <label>学级：</label>
                                        <Select
                                            value={Number(learningLevelCode)}
                                            style={{ width: 120 }}
                                            onChange={this.handleLearningLevelChange}>
                                            {
                                                particularYear && particularYear.map((item) => {
                                                    return (<Option key={item.code} value={item.code}>{item.code}级</Option>)
                                                })
                                            }
                                        </Select>
                                    </div>
                                    {
                                        powerDeal('搜索') ? <Button
                                            icon={<SearchOutlined />}
                                            style={{ marginTop: '10px' }}
                                            onClick={() => { this.onSearch() }}
                                        >搜索</Button> : null
                                    }
                                </div> :
                                    // 2021年05月28日 任课老师或者班主任查看学生管理 张江 加 只有班级时显示班级名称
                                    <div className={styles['search-box']}>
                                        <div>
                                            {/* 下载通用答题卡 20210805 张江加 */}
                                            {
                                                powerDeal('下载通用答题卡') ?
                                                    <Button type="primary" onClick={downLoadAnswerCar} style={{ marginRight: '12px' }}>下载通用答题卡</Button> : null
                                            }

                                            <label style={{ marginTop: 4 }}>班级名称：</label>
                                            <div className={styles['school-name']}>
                                                {loginUserInfo.className || ''}
                                                <Popover onVisibleChange={this.onVisibleChange} id={classInfoStyles['popover']} placement="bottom" title={'班级口令'}
                                                    content={popoverContent(QRCInfo)}
                                                    trigger="click">
                                                    <a onClick={() => this.handleQRC(loginUserInfo.classId)} style={{ fontWeight: 'bold', fontSize: 16 }}>（班级口令）</a>
                                                </Popover>
                                            </div>
                                        </div>
                                    </div>
                            }
                            {
                                loginUserInfo.schoolId && ((studentClassList && studentClassList.length > 0) || loginUserInfo.classId) ? <div className={styles['right']}>
                                    {/* 2021-09-24--xiongwei 添加学生分组功能弹窗 */}
                                    {
                                        powerDeal('学生分组') ?
                                            <Button
                                                icon={<PlusOutlined />}
                                                onClick={() => {
                                                    this.showStudentGroupModal(isSchoolAdmin)
                                                }}
                                                style={{ marginRight: 20 }}
                                            >学生分组</Button>
                                            : null
                                    }

                                    {
                                        powerDeal('批量导入') ?
                                            <Button
                                                icon={<UploadOutlined />}
                                                onClick={() => {
                                                    this.showBulkImportDrawer(isSchoolAdmin)
                                                }}
                                                style={{ marginRight: 20 }}
                                            >批量导入</Button>
                                            : null
                                    }

                                    {
                                        powerDeal('添加') ?
                                            <Button
                                                type="primary"
                                                icon={<PlusOutlined />}
                                                onClick={() => {
                                                    this.showModal({ isSchoolAdmin: isSchoolAdmin })
                                                }}
                                            >添加</Button>
                                            : null
                                    }

                                </div>
                                    : null
                            }
                        </div>



                        {
                            loginUserInfo.schoolId ?
                                <div className={styles['content-box']}>
                                    {
                                        powerDeal("搜索") && isSchoolAdmin ?
                                            <div className={styles['content-left']}>
                                                <Spin tip="班级正在加载中..." spinning={!classLoading}>
                                                    {
                                                        selectedClassCode && classLoading ?
                                                            <ClassList
                                                                isPaging={false}
                                                                location={location}
                                                                classList={studentClassList}
                                                                selectedClassCodeChange={this.selectedClassCodeChange}
                                                                defaultSelectedClass={selectedClassCode}
                                                                boxHeight="75vh"
                                                            /> : <Empty description='暂无班级' />
                                                    }
                                                </Spin>
                                            </div> : null
                                    }


                                    <div className={styles['content-right']} style={isSchoolAdmin ? {} : { width: '100%' }}>
                                        {
                                            studentList && studentList.length > 0 ? <Spin tip="学生正在加载中..." spinning={!studentLoading}>
                                                <div className={styles['statistical-box']}>
                                                    <div className={styles['statistical-right']}>
                                                        {
                                                            [
                                                                { key: 1, title: '总人数', iconfont: 'icon-zongrenshu', number: male + female + other },
                                                                { key: 2, title: '男生', iconfont: 'icon-nan', number: male },
                                                                { key: 3, title: '女生', iconfont: 'icon-nv', number: female },
                                                                { key: 4, title: '其他', iconfont: 'icon-qita', number: other },
                                                            ].map((item) => {
                                                                return (<div className={styles['statistical-item']} key={item.key}>
                                                                    <IconFont type={item.iconfont} className={styles['iconfont']} />
                                                                    <label>{item.title}</label>
                                                                    <span className={styles['number']}>{item.number}</span>
                                                                </div>)
                                                            })
                                                        }
                                                    </div>
                                                    <div className={styles['statistical-left']}>
                                                        {

                                                            powerDeal('迁移学生') && isSchoolAdmin ? <div className={styles['statistical-item']} onClick={() => {
                                                                this.showStudentMigrationDrawer()
                                                            }}>
                                                                <IconFont type={'icon-shujuqianyi'} className={styles['iconfont']} />
                                                                <span>迁移学生</span>
                                                            </div> : null
                                                        }
                                                        {
                                                            powerDeal('链接卡') ? <div className={styles['statistical-item']}>
                                                                <Button
                                                                    type="primary"
                                                                    // disabled={(Number(progressValue) < 100 && progressValue != 0) || (progressValue && progressValue != 100)}
                                                                    disabled={!isUpdate}
                                                                    loading={!!generationLoading}
                                                                    onClick={() => {
                                                                        this.generationConnectionCard({ classId })
                                                                    }}
                                                                >{generationLoading || !isUpdate ? '正在制作/更新中...' : "制作/更新链接卡"}</Button>
                                                                {/* <div className={styles['progress-box']}>
                                                                    <Progress percent={Number(progressValue)} status="active" steps={5} />
                                                                </div> */}

                                                                <Dropdown overlay={<Menu>
                                                                    {
                                                                        downloadUrlArray && downloadUrlArray.map((dItem) => {
                                                                            const dName = `下载链接卡-${pumaNodeTypeList[Number(dItem.latticeType) - 1]?.name}`;
                                                                            return (
                                                                                <Menu.Item key={dItem.id}>
                                                                                    <span onClick={() => {
                                                                                        window.open(dItem.url, "_blank");
                                                                                        // openNotificationWithIcon('info', '下载链接卡', '', '正在下载链接卡，请稍候！')
                                                                                        // saveFileToLink(downloadUrl, `${fullName}-链接卡`, 'pdf', () => { });
                                                                                        // //  @ts-ignore
                                                                                        if (window._czc) {
                                                                                            //  @ts-ignore
                                                                                            window._czc.push(['_trackEvent', `${window.$systemTitleName}-${dName}`, '下载']);
                                                                                        }
                                                                                    }}>{dName}</span>
                                                                                </Menu.Item>
                                                                            )
                                                                        })
                                                                    }
                                                                </Menu>}
                                                                    placement="bottomLeft"
                                                                    disabled={!(!downloadUrlArray || downloadUrlArray.length > 0)}
                                                                >
                                                                    <Button
                                                                        type="primary"
                                                                        style={{ marginLeft: '12px' }}
                                                                        // disabled={Number(progressValue) < 100}
                                                                        icon={<DownloadOutlined />}
                                                                    >
                                                                        下载链接卡
                                                                    </Button>
                                                                </Dropdown>
                                                                {/* <Button
                                                                    type="primary"
                                                                    style={{ marginLeft: '12px' }}
                                                                    // disabled={Number(progressValue) < 100}
                                                                    disabled={!downloadUrl}
                                                                    icon={<DownloadOutlined />}
                                                                    onClick={() => {
                                                                        window.open(downloadUrl, "_blank");
                                                                        // openNotificationWithIcon('info', '下载链接卡', '', '正在下载链接卡，请稍候！')
                                                                        // saveFileToLink(downloadUrl, `${fullName}-链接卡`, 'pdf', () => { });
                                                                        // //  @ts-ignore
                                                                        if (window._czc) {
                                                                            //  @ts-ignore
                                                                            window._czc.push(['_trackEvent', `${window.$systemTitleName}-下载链接卡`, '下载']);
                                                                        }
                                                                    }}
                                                                >
                                                                    下载链接卡
                                                            </Button> */}
                                                            </div> : null
                                                        }

                                                    </div>
                                                </div>
                                                <div className={styles['table-box']}>
                                                    <Table
                                                        bordered
                                                        columns={stdColumns(columns)}
                                                        rowKey='id'
                                                        dataSource={studentList && studentList.length > 0 ? studentList : []}
                                                        pagination={paginationConfig({ s: 12, p: query.p }, studentList ? studentList.length : 0)}
                                                        onChange={handleTableChange}
                                                    />
                                                </div>
                                            </Spin> : <div className={styles['not-data']}><Spin tip="学生正在加载中..." spinning={!!classId && !studentLoading}><Empty description='暂无学生' /></Spin></div>
                                        }

                                    </div>

                                </div>
                                : <div className={styles['not-data']}><Empty description='请选择机构' /> </div>
                        }

                    </div>

                </div>
            </Page>
        );
    }
}

