/**
 *@Author:ChaiLong
 *@Description:教师管理
 *@Date:Created in  2020/3/9
 *@Modified By:
 */
import React from 'react';
import {SearchOutlined} from '@ant-design/icons';
import { connect } from "dva";
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import Page from "@/components/Pages/page";
import {
  Table,
  Button,
  message,
  Upload,
  Cascader,
  Select,
  Input,
  icon
} from 'antd';
import { ClassAndTeacherManage as namespace, Public, QuestionBank } from "@/utils/namespace";
import styles from './teacher.less';
import { excelType } from "@/utils/const";
import accessTokenCache from "@/caches/accessToken";
import paginationConfig from "@/utils/pagination";
import { particularYear } from '@/utils/const'
import { doHandleYear, replaceSearch } from '@/utils/utils'
import ClassList from '@/components/ClassList/ClassList'
import ActionTeacher from './components/actionTeacher';
import AddTeacherModal from "./components/addTeacherModal";
import AddHeadTeacher from "./components/addHeadTeacher";
import userInfoCache from "@/caches/userInfo";
import { SettingOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
// const { Option, OptGroup } = Select;
const { Option, OptGroup } = Select;
@connect(state => ({
  getGradeList: state[Public].studyAndGradeList,//学段年级列表
  getTeacherList: state[namespace].getTeacherList,//教师列表
  // getGradeList: state[Public].gradeList,//获取年级
  findClassList: state[namespace].findClassList,//获取班级
  subjectList: state[QuestionBank].subjectList,//科目列表
  getClassLeader: state[namespace].getClassLeader,//当前班级班主任
  loading: state[namespace].loading
}))

export default class Teacher extends React.Component {

  constructor(props) {
    super(...arguments);
    this.state = {
      modalData: {},//教师个人数据,用于修改教师信息和配置教师信息
      modalVisible: false,//新增修改modal状态
      drawerVisible: false,//抽屉开关状态
      childrenDrawer: false,//子级抽屉
      cascaderOptions: [],//学校级联数据
      gradeCode: '',
      userName: '',//搜索--姓名
      userAccount: '',//搜索--姓名
      classId:0,
      schoolId:0,
      userInfo:{}

    };
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    const { search } = location;
    const query = queryString.parse(search);
    console.log(query);
    this.setState({
      userName: query.userName || '',
      userAccount: query.userAccount || '',
  })
    const userInfo = userInfoCache();//用户信息

    this.setState({
      schoolId:userInfo.schoolId
    });

    //初始化年级
    // dispatch({
    //   type: Public + '/getGradeList',
    // });
    dispatch({// 获取学段和年级
      type: Public + '/getStudyAndGradeList',
      payload: {
        studyId: userInfo.studyIds,
      },
      callback: (result) => {
        if (result && result.length > 0) {
          let gradeCode = query && query.gradeId ? Number(query.gradeId) : result[1] ? result[1].gradeList[0].gradeId : result[0].gradeList[0].gradeId;
          let querys = { ...query, gradeCode: gradeCode }
          replaceSearch(dispatch, location, querys);
          this.setState({
            gradeCode,
          })

        }

      }
    });

    //请求班级列表
    dispatch({
      type: namespace + '/findClassList',
      payload: {
        spoceId: query.spoceId || doHandleYear(),
        gradeId: query.gradeId || 15,
        schoolId: userInfo.schoolId || undefined
      }
    });

    //请求教师
    dispatch({
      type: namespace + '/findTeacherList',
      payload: {
        spoceId: query.spoceId || doHandleYear(),
        classId: query.classId && parseInt(query.classId, 10) || undefined,
        schoolId: userInfo.schoolId,
        userName: query.userName || '',
        userAccount: query.userAccount || '',
        page: query.p || 1,
        size: 10
      }
    });
  }

  componentWillUnmount() {
    /*清理残留数据，以免影响到学生用户*/
    const { dispatch } = this.props;
    dispatch({
      type: namespace + '/set',
      payload: {
        findClassList: [],
        getTeacherList: []
      }
    });
  }

  /**
   * 上传文件后回调
   * @param file
   * @returns {*|boolean}
   */
  beforeUpload = (file) => {
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


  //直接跳转到微云地址下载学生批量导入模板
  downTemplate = () => {
    window.open("https://reseval.gg66.cn/teacher-template.xlsx")
  };


  //列表分页、排序、筛选变化时触发
  handleTableChange = (page) => {
    const { dispatch, location } = this.props;
    const { search } = location;
    let query = queryString.parse(search);
    this.setState({
      userName: query.userName || '',
      userAccount: query.userAccount || '',
  })
    query = { ...query, p: page.current };
    replaceSearch(dispatch, location, query);
  };


  /**
   * 切换班级以及查看待分配或者全部教师
   * @param selectedClassCode
   * @param page
   */
  selectedClassCodeChange = (selectedClassCode, page) => {
    const { dispatch, location } = this.props;
    const { search } = location;
    let query = queryString.parse(search);
    query.classId = selectedClassCode;
    replaceSearch(dispatch, location, query);
  };

  /**
   * 加载学校数据
   * @param selectedOptions
   */
  loadCascaderData = (selectedOptions) => {
    const { dispatch, location } = this.props;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    dispatch({// 通过区域id获取学校列表
      type: Public + '/getSchoolListByAreaId',
      payload: {
        areaId: targetOption.id,
      },
      callback: (result) => {
        targetOption.loading = false;
        targetOption.areas = []
        if (result && result.length > 0) {
          targetOption.areas = result;
        }
        this.setState({
          cascaderOptions: [...this.state.cascaderOptions],
        });
      }
    });
  };

  /**
   * 将子组件配置教师的dom挂载到父组件上
   * @param ref
   */
  onRefForActionTeacher = (ref) => {
    this.actionTeacher = ref;
  };

  /**
   * 将子组件添加教师的dom挂载到父组件上
   * @param ref
   */
  onRefAddTeacher = (ref) => {
    this.addTeacher = ref;
  };

  /**
   * 将子组件添加班主任的dom挂载到父组件上
   * @param ref
   */
  onRefAddHeadTeacher = (ref) => {
    this.addHeadTeacher = ref;
  };

  /**
   * 打开教师配置抽屉
   * @param t
   * @param record
   */
  openTeacherDrawer = (t, record) => {
    this.actionTeacher.controllerPermission(t, record)
  };

  /**
   * 打开添加教师modal
   * @param t
   * @param record
   */
  openAddTeacher = (t, record) => {
    this.addTeacher.controller(t, record)
  };

  /**
   * 打开配置班主任抽屉
   */
  handleAddHeadTeacher = () => {
    this.addHeadTeacher.closeAndOpenHeadTeacher(1)
  };


  /**
   * 切换年级或学级
   * @param e
   * @param str
   */
  handleGradeSpoceId = (e, str) => {
    const { dispatch, location } = this.props;
    const { search } = location;
    let query = queryString.parse(search);
    query[str] = e;
    query.p = undefined;
    replaceSearch(dispatch, location, query);
  };


   /**
  * 输入框值变化
  * @param e ：事件对象
  */
   handleValueOnChange = (e) => {
    this.setState({
        userName: e.target.value,
    });
}

/**
* 输入框值变化
* @param e ：事件对象
*/
handleAccountOnChange = (e) => {
    this.setState({
      userAccount: e.target.value,
    });
}


/**
* 搜索
*/
onSearch = () => {
  const { dispatch, location } = this.props;
  const { search, pathname } = location;
  let query = queryString.parse(search);
  query.userName =this.state.userName;
  query.userAccount = this.state.userAccount;
  query = { ...query };
  dispatch({
    type: namespace + '/findTeacherList',
    payload: {
      spoceId: query.spoceId || doHandleYear(),
      gradeId: query.gradeId || 15,
      schoolId: this.state.schoolId|| undefined,
      classId: query.classId && parseInt(query.classId, 10) || undefined,
      userName: query.userName || '',
      userAccount: query.userAccount || '',
      page: query.p || 1,
      size: 10
    }
  });

}



  render() {
    const { location, dispatch, loading, getTeacherList, getGradeList = [], findClassList = [], subjectList = [], getClassLeader = {} } = this.props;
    const { gradeCode,userName,userAccount,schoolId,classId } = this.state
    const { search = '', pathname = '' } = location;
    const token = accessTokenCache() && accessTokenCache();
    const query = queryString.parse(search) ? queryString.parse(search) : {};
    const classList = findClassList.length ? findClassList.filter(re => [-1, 0].indexOf(re.id) === -1) : [];
    const userInfo = userInfoCache()
    const roleName = 'SPURS';
    const title = '教师管理-组织机构';
    const breadcrumb = [title];
    const header = (
      <Page.Header breadcrumb={breadcrumb} title={title} />
    );
    /**
     * 改变loading状态
     * @param bool
     */
    const changeLoading = (bool) => {
      dispatch({
        type: namespace + '/set',
        payload: {
          loading: bool
        }
      })
    };

    /**
     * 批量导入上传配置
     * @type {{headers: {Authorization: *}, data: {schoolId: number}, onChange(*): void, name: string, multiple: boolean, action: string, accept: string}}
     */
    const props = {
      name: 'file',
      action: '/auth/web/v1/teacher/batchImportTeacher',
      multiple: false,
      data: {
        schoolId: userInfo.schoolId
      },
      headers: { Authorization: token },
      accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",//指定选择文件框默认文件类型
      onChange(info) {
        const { code = '', msg = '' } = info.file.response ? info.file.response : {};
        //正在上传
        if (info.file.status === 'uploading') {
          changeLoading(true);
        }
        if (info.file.status === 'done') {
          if (code === 200) {
            message.success('上传成功');
            setTimeout(() => {
              dispatch({
                type: namespace + '/findTeacherList',
                payload: {
                  classId: query.classId || undefined,
                  schoolId: userInfo.schoolId
                }
              });
              query.classId = 0;//批量导入成功后切换到全部教师
            }, 500)
          } else {
            changeLoading(false);
            message.error(msg)
          }
        } else if (info.file.status === 'error') {
          changeLoading(false);
          message.error(`${info.file.name} 上传出错`);
        }
      }
    };

    const columns = [
      { title: '姓名', dataIndex: 'userName', key: 'userName' },
      { title: '帐号', dataIndex: 'account', key: 'account' },
      {
        title: '状态', dataIndex: 'status', key: 'status',
        render: (text) => {
          const statusName = ['待分配', '已分配'];
          return (
            <span>{statusName[text]}</span>
          )
        }
      },
      {
        title: '操作', dataIndex: '', key: 'x', width: 300, align: 'center',
        render: (text, record) => (
          <div className={styles['options']}>
            <a onClick={() => this.openAddTeacher(1, record)}>修改</a>
            <a style={{ marginLeft: '20px' }} onClick={() => this.openTeacherDrawer(1, record)}><SettingOutlined />&nbsp;配置</a>
          </div>
        )
      },
    ];

    return (
      <Page header={header} loading={!!loading}>
        <div id={styles['teacherManage']}>
          <div className={styles['top-search']}>
            <div className={styles['menuInput']}>
              <div className={`${styles['grade']} ${styles['box']}`}>
                <label>年级：</label>
                <Select value={query.gradeId ? Number(query.gradeId) : gradeCode} style={{ width: 120 }}
                  onChange={(e) => this.handleGradeSpoceId(e, 'gradeId')}>
                  {
                    getGradeList && getGradeList.map((item) => {
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
                  {/* {
                    getGradeList.length && getGradeList.map(re => <Option key={re.id} value={re.id}>{re.name}</Option>)
                  } */}
                </Select>
              </div>
              <div className={`${styles['spoce']} ${styles['box']}`}>
                <label>学级：</label>
                <Select defaultValue={query.spoceId ? query.spoceId : doHandleYear()} style={{ width: 120 }}
                  onChange={(e) => this.handleGradeSpoceId(e, 'spoceId')}>
                  {
                    particularYear.map(re => <Option key={re.code} value={re.code}>{re.code}</Option>)
                  }
                </Select>
              </div>
            </div>
            {
              <div id="teacherUpload" className={styles["downTable"]}>
                <a onClick={this.downTemplate}>下载批量导入模板</a>
                <Upload {...props} beforeUpload={this.beforeUpload}>
                  <a>批量导入</a>
                </Upload>
              </div>}
          </div>
          <div className={styles['top-search-userName']}>
          <div>
                                    <label>姓名：</label>
                                    <Input
                                        placeholder="请输入姓名"
                                        style={{ width: '160px' }}
                                        value={userName}
                                        onChange={this.handleValueOnChange}
                                        allowClear
                                    />
                                </div>

                                <div>
                                    <label>账号：</label>
                                    <Input
                                        placeholder="请输入账号"
                                        style={{ width: '160px' }}
                                        value={userAccount}
                                        onChange={this.handleAccountOnChange}
                                        allowClear
                                    />
                                </div>

                                {
                                    window.$PowerUtils.judgeButtonAuth(pathname, '搜索') ? <Button
                                        icon={<SearchOutlined />}
                                        style={{ marginTop: '10px' }}
                                        onClick={() => { this.onSearch() }}
                                    >搜索</Button> : null
                                }
          </div>
          <div className={styles["TableBtn"]}>
            <Button
              className={styles["buildWorker"]}
              type="dashed"
              ghost
              onClick={() => this.openAddTeacher(1)}>
              <PlusOutlined />
              创建教职工帐号
            </Button>
            <div className={styles['listAndTable']}>
              <div className={styles['classListBox']}>
                <ClassList
                  isPaging={false}
                  location={location}
                  classList={findClassList}
                  selectedClassCodeChange={this.selectedClassCodeChange}
                  defaultSelectedClass={query.classId}
                  boxHeight={'68vh'}
                />
              </div>
              <div className={styles['list']}>
                {[undefined, '-1', '0'].indexOf(query.classId) === -1 && <div className={styles['headTeacherManage']}>
                  <div className={styles['headTeacherLittle']}>
                    <div>班主任</div>
                    <div onClick={this.handleAddHeadTeacher} className={styles['settingIconBox']}>
                      <SettingOutlined />
                    </div>
                  </div>

                  <div className={styles['teacherName']}>
                    {
                      getClassLeader && Object.keys(getClassLeader).length ?
                        <div>{getClassLeader.name}</div>
                        :
                        <div className={styles['noData']}>暂无班主任信息，请前往配置</div>
                    }
                  </div>
                </div>}
                {
                  getTeacherList && getTeacherList.data && getTeacherList.data.length > 0 ?
                    <Table
                      className={styles['user-table']}
                      columns={columns}
                      bordered
                      onChange={this.handleTableChange}
                      dataSource={getTeacherList.data}
                      pagination={paginationConfig(query, getTeacherList.total || 0)}
                      rowKey="id"
                    />
                    : <div style={{ marginTop: "0", height: "300px" }} className="no-data">
                      <ExclamationCircleOutlined />
                      暂无数据，请选择机构
                    </div>
                }
              </div>
            </div>
          </div>
          <ActionTeacher
            query={query}
            classList={classList}
            subjectList={subjectList}
            onRef={this.onRefForActionTeacher} />
          <AddTeacherModal location={location} onRef={this.onRefAddTeacher} />
          <AddHeadTeacher query={query} classDatas={findClassList} onRef={this.onRefAddHeadTeacher} />
        </div>
      </Page>
    )
  }
}
