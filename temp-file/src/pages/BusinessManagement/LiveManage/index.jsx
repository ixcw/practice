/**
* 直播管理
* @author:张江
* @date:2022年04月23日
* @version:v1.0.0
* */
import React from 'react'
import { connect } from 'dva';
import styles from './index.less'
import Page from "@/components/Pages/page";
import {
  Tabs,
  Table,
  Modal,
  Radio,
  message,
  Spin,
  Popconfirm,
  Button,
  Input,
  Select,
  Tag,
  Tooltip
} from 'antd';
import classNames from 'classnames';
import queryString from 'query-string'
import { LiveManage as namespace, QuestionBank } from "@/utils/namespace";
import { replaceSearch, objectIsNull, dealTimestamp, getLocationObj, pushNewPage, formatSeconds, openingThirdPartyApp } from "@/utils/utils";
import paginationConfig from "@/utils/pagination";
import { liveStatusList, openTypeList } from "@/utils/const";
import AddOrEditLiveModal from '../components/AddOrEditLiveModal';
import PreOrAddViewerModal from '../components/PreOrAddViewerModal';
import LivePusherUtils from "@/utils/LivePusherUtils";//直播推流工具类
import userInfoCache from '@/caches/userInfo';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';


const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;
@connect(state => ({
  liveMangeList: state[namespace].liveMangeList,//请求数据列表
  loading: state[namespace].loading,
  liveViewerList: state[namespace].liveViewerList,//分页获取直播观众列表

  gradeList: state[QuestionBank].gradeList,
  subjectList: state[QuestionBank].subjectList,
}))
export default class LiveManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gradeCode: '',
      subjectCode: '',
      microNameKeyword: '',
      isPreviewLiveVisible: false,
      singleLiveData: null,
      isEdit: false,
      addOrEditLiveVisible: false,
      teacherName: '',
      openTypeCode: '',
    }
  }

  UNSAFE_componentWillMount() {
    const {
      dispatch,
      location,
    } = this.props;
    const { search } = location;
    const query = queryString.parse(search);
    dispatch({// 获取年级列表
      type: QuestionBank + '/getGradeList',
      payload: {},
      callback: (result) => {
        if (result && result.length > 0) {
          let gradeCode = query && query.gradeId ? Number(query.gradeId) : '';
          this.setState({
            gradeCode,
            subjectCode: '',
            microNameKeyword: query && query.name ? query.name : '',
            teacherName: query && query.teacherName ? query.teacherName : ''
          })
          if (query && query.gradeId) {
            this.changeQuery({ gradeId: gradeCode }, 1)
          }
          this.getSubject(gradeCode);
        }
      }
    });
  }

  /**
* 根据年级id 获取科目列表
* @param gradeId  ：年级id
*/
  getSubject = (gradeId) => {
    const { dispatch, location } = this.props;
    const { search } = location;
    const query = queryString.parse(search);
    dispatch({
      type: QuestionBank + '/getSubjectList',
      payload: {
        gradeId,
      },
      callback: (result) => {
        if (result && result.length > 0) {
          // let subjectCode = query && query.subjectId ? Number(query.subjectId) : result[0].id;
          let subjectCode = query && query.subjectId && Number(query.gradeId) == gradeId ? Number(query.subjectId) : '';
          this.setState({
            subjectCode,
          })
        }
      }
    });
  }

  /**
  * 选择年级
  * @param gradeCode  ：年级id
  */
  handleGradeChange = (gradeCode) => {
    this.setState({
      gradeCode,
      subjectCode: '',
    })
    // this.replaceSearch({ gradeId: gradeCode, subjectId: '', category: '', p: 1 })
    this.getSubject(gradeCode);
  }

  /**
  * 选择科目
  * @param subjectCode  ：科目id
  */
  handleSubjectChange = (subjectCode) => {
    this.setState({
      subjectCode,
    })
    this.changeQuery({ subjectId: subjectCode, p: 1 }, 1)
  }

  /**
* 选择开发类型
* @param openTypeCode  ：类型code
*/
  handleOpenTypeCodeChange = (openTypeCode) => {
    this.setState({
      openTypeCode,
    })
    this.changeQuery({ openType: openTypeCode, p: 1 }, 1)
  }




  /**
   * 改变query参数
   * @param searchObj 应该改变的query值
   * @param type 1:添加和改变，2:清空再添加
   */
  changeQuery = (searchObj, type = 1) => {
    const { location, dispatch } = this.props;
    const { search } = location;
    const query = (type === 1) ? queryString.parse(search) : {};
    replaceSearch(dispatch, location, { ...query, ...searchObj }, type)
  };

  /**
   * 切换微课类型
   * @param t 微课类型1:知识点微课，2:其他微课
   */
  cutType = (t) => {
    this.setState({
      microNameKeyword: '',
      teacherName: '',
      gradeCode: '',
      subjectCode: '',
    })
    this.changeQuery({ microType: t, p: 1 }, 2)
  };

  /**
   * table切换分页
   * @param pageObj 分页器参数
   */
  handleTableChange = (pageObj) => {
    this.changeQuery({ p: pageObj.current }, 1)
  };

  /**
  * 输入微课名称并赋值
  * @param e  ：事件对象
  */
  handleMicroNameKeywordChange = (e) => {
    this.setState({
      microNameKeyword: e.target.value,
    })
  }

  /**
* 输入教师姓名并赋值
* @param e  ：事件对象
*/
  handleTeacherNameChange = (e) => {
    this.setState({
      teacherName: e.target.value,
    })
  }

  /**
* 点击检索
*/
  onSearch = () => {
    const {
      dispatch,
      location,
    } = this.props;
    const { gradeCode, subjectCode, microNameKeyword, teacherName } = this.state
    replaceSearch(dispatch, location, { teacherName: teacherName, name: microNameKeyword, gradeId: gradeCode, subjectId: subjectCode, p: 1 })
  }

  /**
* 重置弹窗表单
*/
  resetMicroForm = () => {
    this.setState({ addOrEditLiveVisible: false, singleLiveData: null, isEdit: false, isPreviewLiveVisible: false, })
  }


  /**
* 删除或结束或开始
* @param OperType  ：操作类型
* @param item  ：数据对象
*/
  enableOrDisableDelReplace = (OperType, item) => {
    const {
      dispatch,
    } = this.props;
    const _self = this;
    if (OperType == 1) {//删除
      confirm({
        title: '确认删除当前直播吗？',
        content: '',
        onOk() {
          dispatch({//删除
            type: namespace + '/deleteLive',
            payload: {
              id: item.id
            },
            callback: (result) => {
              _self.changeQuery({ p: 1 }, 1)
              message.success("删除成功");
            }
          });
        },
        onCancel() { },
      });

    } else {//开始或结束直播
      const liveStatus = item?.liveStatus;//0待开播，1直播中，2直播结束，-1直播取消
      const openType = item?.openType;
      const judgeTestLive = () => {
        dispatch({//测试直播
          type: namespace + '/testLive',
          payload: {
            id: item?.id
          },
          callback: (result) => {
            pushNewPage({ id: item?.id }, '/test-push-live', dispatch);
          }
        });
      }
      // openType == 1 && 
      if (item?.teacherOnline == 0) {
        judgeTestLive();
        return;
      }
      confirm({
        title: `确认${liveStatus == 1 ? '结束' : '开始'}当前直播吗？`,
        content: '',
        onOk() {
          const operLive = () => {
            dispatch({//开始或结束直播
              type: namespace + (liveStatus == 1 ? '/stopLive' : '/startLive'),
              payload: {
                id: item.id
              },
              callback: (result) => {
                _self.changeQuery({}, 1)
                message.success("操作成功");
              }
            });
          }
          // if (openType == 1 || openType == 3) {//1:全部用户开放，2:对特定班级开放，3：对全部用户和特定班级开放
          if (liveStatus == 1) {
            LivePusherUtils.stopLivePush()
            operLive();
          } else {
            judgeTestLive()
          }
          // } else {
          //   operLive();
          // }

        },
        onCancel() { },
      });
    }

  }




  render() {
    const title = '直播管理-业务管理';
    const breadcrumb = [title];
    const header = (
      <Page.Header breadcrumb={breadcrumb} title={title} />
    );
    const {
      location,
      dispatch,
      liveMangeList = {},
      loading,
      gradeList,
      subjectList,
      liveViewerList = {},
    } = this.props;
    const {
      gradeCode,
      subjectCode,
      microNameKeyword,
      isPreviewLiveVisible,
      singleLiveData,
      isEdit,
      addOrEditLiveVisible,
      teacherName,
      openTypeCode,
      recordPage,
      isShow_local_mylive
    } = this.state;
    const _location = getLocationObj(location);
    const { query, pathname } = _location || {};
    const loginUserInfo = userInfoCache() || {};
    const isTeacher = loginUserInfo.code === 'TEACHER';
    const isCreateLivePermission = loginUserInfo.createLivePermission == 1;//是否有添加/编辑直播的权限
    const keyword = query.name;
    // 判断是否有按钮权限
    const isHaveButtonAuth = (buttonName) => {
      return window.$PowerUtils.judgeButtonAuth(pathname, buttonName)
    }
    /**
     * 列表配置项
     * @type {*[]}
     */
    let columns = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
      },
      {
        title: '直播名称',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => {
          return (
            <div dangerouslySetInnerHTML={{ __html: keyword ? String(text).replace(keyword, `<span style="color: #ff4843">${keyword}</span>`) : text }}></div>
          )
        },
      },
      // {
      //   title: '描述',
      //   dataIndex: 'describe',
      //   key: 'describe',
      //   width: '120px',
      //   render: (text) => {
      //     return (
      //       <Tooltip placement="top" title={text}>
      //         <div className="nowrap-overflow-ellipsis">{text || '-'}</div>
      //       </Tooltip>
      //     )
      //   }
      // },

      {
        title: '关键词',
        dataIndex: 'keyword',
        key: 'keyword',
        render: (text) => {
          const textArray = text ? String(text).split(';') : []
          return (
            <div>
              {
                textArray.map((item, index) => {
                  return item ? (<Tag key={index} color="#409eff" style={{ marginTop: 2 }}>{item}</Tag>) : ""
                })
              }
            </div>
          )
        }
      },
      {
        title: '时长',
        dataIndex: 'duration',
        key: 'duration',
        render: (text, record) => (
          <span>{text || '-'}分钟</span>
        ),
      },
      // {
      //   title: '开放类型',
      //   dataIndex: 'openType',
      //   key: 'openType',
      //   render: (text, record) => {
      //     const openTypeName = openTypeList.map((item) => { return item.code == text ? item.name : '' });
      //     return (<span>{openTypeName}</span>)
      //   },
      // },

      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        // render: (text) => (<span>{text || '-'}</span>)
        render: (record) => (<span>{record ? dealTimestamp(record, 'YYYY-MM-DD HH:mm:ss') : '-'}</span>)
      },
      {
        title: '开播时间',
        dataIndex: 'startTime',
        key: 'startTime',
        // render: (record) => (<span>{dealTimestamp(record, 'YYYY-MM-DD HH:mm:ss')}</span>)
      },
      // {
      //   title: '商品价格',
      //   dataIndex: 'price',
      //   key: 'price',
      //   render: (text, record) => (
      //     <span>{record.isFree ? '免费' : `￥${processDataRetainDigit(text, 2, '')}`} </span>
      //   ),
      // },
      {
        title: '观众数量',
        dataIndex: 'viewerCount',
        key: 'viewerCount',
        render: text => (
          text || text == 0 ? text + '人' : '-'
        ),
      },
      {
        title: '观看数量',
        dataIndex: 'viewCount',
        key: 'viewCount',
        render: text => (
          text || text == 0 ? text : '-'
        ),
      },
      // {
      //   title: '状态',
      //   dataIndex: 'status',
      //   key: 'status',
      //   render: (text, record) => (
      //     <span>{text == 0 ? <Tag color="#67c23a">正常</Tag> : text == -1 ? <Tag color="#e6a23c">已下架</Tag> : <Tag>待开播</Tag>}</span>
      //   ),
      // },
      {
        title: '直播状态',
        dataIndex: 'liveStatus',
        key: 'liveStatus',
        render: (text, record) => {
          const liveStatusName = liveStatusList.map((item) => { return item.code == text ? item.name : '' });
          return (<span style={{ color: text == -1 ? 'rgb(234, 14, 14)' : text == 1 ? 'green' : null }}>{liveStatusName}</span>)
        },
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        render: (record, text) => {
          const isAddClassViewer = !!((record.openType == 3 || record.openType == 2) && (record.liveStatus == 0 || record.liveStatus == 1));
          return (
            <div className={'live-manage-oper'}>
              {
                isHaveButtonAuth('结束/开始直播') && (record.liveStatus == 0 || record.liveStatus == 1) ?
                  <Button
                    onClick={() => { this.enableOrDisableDelReplace(0, record) }}
                    type={record.teacherOnline == 1 || ((record?.openType == 2 || record?.openType == 1) && record.liveStatus == 1) ? 'danger' : 'primary'}
                  >{record?.openType == 1 || record?.openType == 2 ? (record.teacherOnline == 0 ? (record.liveStatus == 1 ? '继续直播' : '开始直播') : '结束直播') : (record.liveStatus == 1 ? '结束直播' : '开始直播')}</Button>
                  : null
              }
              {
                isHaveButtonAuth('观看直播') && record.liveStatus == 1 && record.liveUrl && !isShow_local_mylive ?
                  <Button
                    style={{ marginLeft: '12px' }}
                    onClick={() => {
                      // if (record.openType == 2) {
                      //   openingThirdPartyApp(record.liveUrl)
                      // } else {
                      pushNewPage({ id: record.id }, '/watch-live', dispatch)
                      // }
                    }}
                    type={'primary'}
                  >{'观看直播'}</Button>
                  : null
              }
              {
                isHaveButtonAuth('查看/添加观众') ?
                  <Button type="primary" style={{ marginLeft: '12px' }} onClick={() => {
                    record.isAddClassViewer = isAddClassViewer;
                    this.setState({
                      singleLiveData: record,
                      isPreviewLiveVisible: true,
                    })
                  }}>{isAddClassViewer ? '查看/添加观众' : '查看观众'}</Button>
                  : null}
              {
                isHaveButtonAuth('编辑') && record.liveStatus != 1 && isCreateLivePermission ?
                  <Button style={{ marginLeft: '12px' }} onClick={() => {
                    delete record.isAddClassViewer;
                    this.setState({ addOrEditLiveVisible: true, singleLiveData: record, isEdit: true })
                  }}>编辑</Button>
                  : null}
              {
                isHaveButtonAuth('删除') && record.liveStatus != 1 ?
                  <Button type="danger" style={{ marginLeft: '12px' }} onClick={() => {
                    this.enableOrDisableDelReplace(1, record)
                  }}>删除</Button>
                  : null}
            </div>
          )
        }
      }
    ];
    if (!isTeacher) {
      columns.splice(5, 0, {
        title: '年级',
        dataIndex: 'gradeName',
        key: 'gradeName',
      });
      columns.splice(6, 0,
        {
          title: '科目',
          dataIndex: 'subjectName',
          key: 'subjectName',
        });
      columns.splice(7, 0,
        {
          title: '直播教师',
          dataIndex: 'teacherName',
          key: 'teacherName',
          render: text => (
            <div dangerouslySetInnerHTML={{ __html: query.teacherName ? String(text).replace(query.teacherName, `<span style="color: #ff4843">${query.teacherName}</span>`) : text }}></div>
          ),
        });

    }
    const classString = classNames(styles['live-manage'], 'gougou-content');
    return (
      <Page header={header} loading={loading}>
        <div className={classString}>
          {/* <Tabs tabBarExtraContent={operations} defaultActiveKey={microType}
            onChange={this.cutType}>
            {microTypeList.map(re => (
              <TabPane tab={re.name} key={re.key} disabled={!notDisabledRule.test(re.key)}> */}
          <div className={styles['tableBox']}>
            <div className={styles['header-option']}>
              <div className={styles['left']}>
                {
                  isTeacher ? null : [
                    <div key={1}>
                      <label>年级：</label>
                      <Select
                        value={gradeCode}
                        style={{ width: 120 }}
                        onChange={this.handleGradeChange}>
                        <Option key={0} value={''}>全部</Option>
                        {
                          gradeList && gradeList.map((item) => {
                            return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                          })
                        }
                      </Select>
                    </div>,

                    <div key={2}>
                      <label>科目：</label>
                      <Select
                        value={subjectCode}
                        style={{ width: 120 }}
                        onChange={this.handleSubjectChange}>
                        <Option key={0} value={''}>全部</Option>
                        {
                          subjectList && subjectList.map((item) => {
                            return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                          })
                        }
                      </Select>
                    </div>
                  ]
                }

                <div>
                  <label>开放类型：</label>
                  <Select
                    value={openTypeCode}
                    style={{ width: 200 }}
                    onChange={this.handleOpenTypeCodeChange}>
                    <Option key={0} value={''}>全部</Option>
                    {
                      openTypeList && openTypeList.map((item) => {
                        return (<Option key={item.code} value={item.code}>{item.name}</Option>)
                      })
                    }
                  </Select>
                </div>
                <div>
                  <label>直播名称：</label>
                  <Input
                    placeholder="请输入直播名称"
                    style={{ width: '200px' }}
                    value={microNameKeyword}
                    onChange={this.handleMicroNameKeywordChange}
                    allowClear
                  />
                </div>

                {
                  isTeacher ? null :
                    <div>
                      <label>直播教师：</label>
                      <Input
                        placeholder="请输入直播教师姓名"
                        style={{ width: '200px' }}
                        value={teacherName}
                        onChange={this.handleTeacherNameChange}
                        allowClear
                      />
                    </div>
                }

                {/* {
                      window.$PowerUtils.judgeButtonAuth(pathname, '搜索') ? */}
                <Button
                  icon={<SearchOutlined />}
                  style={{ marginTop: '10px' }}
                  onClick={() => { this.onSearch() }}
                >搜索</Button>
              </div>
              <div className={styles['right']}>
                {
                  isHaveButtonAuth('添加') && isCreateLivePermission ? <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      this.setState({ addOrEditLiveVisible: true, })
                    }}
                  >添加</Button> : null
                }

              </div>
            </div>

            <Table
              rowKey='id'
              bordered
              onChange={this.handleTableChange}
              pagination={paginationConfig(query, objectIsNull(liveMangeList) && liveMangeList.total ? liveMangeList.total : 0, undefined, undefined, 'bottomCenter', true)}
              dataSource={objectIsNull(liveMangeList) ? liveMangeList.data : []} columns={columns} />
          </div>
          {/* </TabPane>
            ))}
          </Tabs> */}
          {
            addOrEditLiveVisible ? <AddOrEditLiveModal
              visible={addOrEditLiveVisible}
              item={singleLiveData}
              isEdit={isEdit}
              location={location}
              onCancel={this.resetMicroForm}
              onOk={(payload) => {
                this.resetMicroForm();
                this.changeQuery(payload.isAddClassViewer ? {} : { p: 1 }, 1)
              }}
            /> : null
          }
          {
            isPreviewLiveVisible ? <PreOrAddViewerModal
              visible={isPreviewLiveVisible}
              item={singleLiveData}
              isEdit={isEdit}
              location={location}
              onCancel={this.resetMicroForm}
              onOk={(payload) => {
                this.resetMicroForm();
                this.changeQuery({}, 1)
              }}
            /> : null
          }
        </div>
      </Page>
    )
  }
};
