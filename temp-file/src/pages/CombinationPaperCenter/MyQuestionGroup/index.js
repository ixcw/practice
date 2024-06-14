/**
 * 我的题组-上传,试卷与答题卡导出
 * @author:张江
 * @date:2020年08月29日
 * @version:v1.0.0
 * */

import react, { Component } from 'react'
import {
  Radio,
  Table,
  Pagination,
  Popconfirm,
  Button,
  message,
  Menu,
  Dropdown,
  Input
} from 'antd'
import { connect } from 'dva';
import classNames from 'classnames';
import { routerRedux } from 'dva/router'
import queryString from 'qs'
import moment from 'moment'
import { saveFileToLink } from 'web-downloadfile'

import Page from "@/components/Pages/page";
import styles from './index.less'
import { getPageQuery, replaceSearch, openNotificationWithIcon } from "@/utils/utils";
import { MyQuestionGroup as namespace, PaperBoard, Auth } from '@/utils/namespace';
import { pumaNodeTypeList, spreadCodeTypeList } from "@/utils/const";
import UploadPdfModal from "../components/upload/UploadPdfModal";
import ExportingModal from "@/components/ExportingModal/ExportingModal";
import AddTask from "@/pages/assignTask/components/addTask";//布置任务

const { Search } = Input;



@connect((state) => ({
  paperData: state[namespace].paperData,//组卷记录的试卷列表
  loading: state[namespace].loading,
  authButtonList: state[Auth].authButtonList,//按钮权限数据
}))
export default class MyQuestionGroup extends Component {
  constructor(props) {
    super();
    let query = getPageQuery()
    this.state = {
      paperBoardHaveTopic: false,//试题板是否有题
      paperType: query.paperType || "1",
      page: query.page || 1,
      size: query.size || 10,
      isUploadPdfModal: false,
      paperInfo: {},

      visibleModal: false,
      visibleModalMsg: ''
    }
  }

  componentDidMount() {
    const { dispatch, location } = this.props
    let query = getPageQuery()
    //如果参数缺少，添加默认参数
    if (!query.paperType || !query.page || !query.size || query.keyword == undefined) {
      if (!query.paperType) query.paperType = this.state.paperType
      if (!query.page) query.page = 1
      if (!query.size) query.size = 10
      if (!query.keyword) query.keyword = ''
      replaceSearch(dispatch, location, query)
    }
    dispatch({
      type: `${PaperBoard}/getGroupCenterPaperBoard`,
      callback: (topics) => {
        if (topics && topics.length > 0) {
          for (let i = 0; i < topics.length; i++) {
            let topicType = topics[i]
            if (topicType.questionList && topicType.questionList.length > 0) {
              this.setState({ paperBoardHaveTopic: true })
              break
            }
          }
        } else {
          this.setState({ paperBoardHaveTopic: false })
        }
      }
    })
  }

  /**
   * 翻页操作
   * @param page：页码
   */
  togglePage = (page) => {
    const { dispatch, location } = this.props
    this.setState({ page }, () => {
      let query = getPageQuery()
      query.page = page
      replaceSearch(dispatch, location, query)
    })
  }

  /**
   * 切换试卷类型
   * @param e：触发事件的对象
   */
  togglePaperType = (e) => {
    let paperType = e.target.value
    this.setState({ paperType }, () => {
      const { dispatch, location } = this.props
      let query = getPageQuery()
      query.paperType = paperType
      query.page = 1
      replaceSearch(dispatch, location, query)
    })
  }
  /**
   * 切换页码条数
   * @param currentPage
   * @param size
   */
  toggleSize = (currentPage, size) => {
    this.setState({ size }, () => {
      const { dispatch, location } = this.props
      let query = getPageQuery()
      query.size = size
      query.page = 1
      replaceSearch(dispatch, location, query)
    })
  }

  /**
   * 发送请求，并且跳转到实体版页面
   * @param text
   * @param record :当前记录
   */
  onEdit = (text, record) => {
    const { paperBoardHaveTopic } = this.state
    const { dispatch, location } = this.props;
    const query = getPageQuery();//获取地址栏参数-2021年01月05日-张江
    dispatch({
      type: `${namespace}/editPaper`,
      payload: {
        paperId: record.id,
        isCleanCache: paperBoardHaveTopic ? 1 : 0,
      },
      callback: (data) => {
        dispatch(routerRedux.push({
          pathname: PaperBoard,
          search: queryString.stringify({ paperName: record.name, paperType: record.paperType || query.paperType })
        }))
      }
    })
  }


  /**
 * 预览导出
 * @param record :当前数据
 */
  onPreviewExport = (pathname, record) => {
    const { dispatch, location } = this.props
    dispatch(routerRedux.push({
      pathname: pathname,
      search: queryString.stringify({ id: record.id, paperName: record.name })
    }))
  }

  /**
* 显示pdf上传弹窗弹框
*/
  showUploadPdfModalVisible = (paperInfo) => {
    this.setState({
      isUploadPdfModal: true,
      paperInfo,
    })
  }

  /**
* 隐藏题目上传弹窗
*/
  hideUploadPdfModalVisible = () => {
    this.setState({
      isUploadPdfModal: false,
      paperInfo: {}
    })
  }

  /**
* 上传pdf
* @param payload  ：传参
*/
  saveUploadPdf = (payload, callback) => {
    const {
      dispatch,
      location,
    } = this.props;
    let query = getPageQuery()
    let formData = new FormData();
    Object.keys(payload).forEach(key => {
      if (typeof payload[key] === 'undefined') {
        delete payload[key]
      } else {
        formData.append(key, payload[key]);
      }
    });
    dispatch({//修改题目图片
      type: namespace + '/importPdfFile',
      payload: {
        formData: formData,
      },
      callback: (result) => {
        callback();
        message.success('pdf上传成功');
        replaceSearch(dispatch, location, query)
      }
    });
  }

  /**
* 获取子组件
* @param ref:子组件this
*/
  onRef = (ref) => {
    this.exportingModal = ref;
  }

  /**
  * 导出pdf
  * @param url  ：文件地址
  * @param record  ：组卷参数
  */
  exportPdf = (url, record) => {
    const _self = this;
    window.open(url);
    // this.setState({ visibleModal: true, })
    // const exportIng = (e) => {
    //   _self.setState({
    //     visibleModalMsg: '正在导出PDF,请稍候...'
    //   })
    //   _self.exportingModal.showLoadingTip();
    //   if (e && e.loaded == e.total) {
    //     _self.setState({
    //       visibleModal: false,
    //     })
    //     message.success('PDF导出成功,正在下载,请稍候...');
    //   }
    // }
    // saveFileToLink(url, record.name, 'pdf', exportIng);
  }

  /**
   * 获取addTask的ref
   * @param ref
   */
  getAddTaskRef = (ref) => {
    this.addRef = ref
  }

  /**
  * 打开布置任务
  * @param record
  */
  openAddTask = (record) => {
    record.callback = () => {
      this.replaceSearch({})
    }
    this.addRef.onOff(true, record)
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
* 点击检索
*/
  onSearch = (keyword) => {
    this.setState({
      keyword,
    })
    this.replaceSearch({ keyword, page: 1 })
  }

  /**
* 页面组件即将卸载时：清空数据
*/
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: namespace + '/set',
      payload: {
        paperData: undefined,
      },
    });
    this.setState = (state, callback) => {
      return;
    };
  }

  /**
 * 通知后台开始铺码
 * @param pdfType  ：pdf类型，1:试卷，2答题卡，3:链接卡，4:通用答题卡
 * @param latticeType  ：节点类型，1南方，深圳节点，2北方北京节点
 * @param paperId  ：试卷id
 */
  spreadCode = (pdfType, latticeType, paperId) => {
    const { dispatch } = this.props;
    const _self = this;
    dispatch({
      type: namespace + '/newLatticeMake',
      payload: {
        latticeType,
        pdfType,//
        printType: 0,//打印类型，0:600dpi，1:1200DPI,，2:工业印刷，默认0
        targetId: paperId,//源文件ID，或者试卷ID，或者班级ID
        targetType: 1,//targetId 类型,0:源pdf文件ID，1：试卷ID
      },
      callback: () => {
        // this.replaceSearch({})
        openNotificationWithIcon('success', '铺码提示', '', '已成功提交铺码，请稍候刷新下载对应的铺码文件', 5)
      }
    });
  };
  render() {
    const {
      loading,
      paperData,
      location,
      authButtonList,//按钮权限数据
    } = this.props
    const { PopconfirmDisabled, needCheck, isUploadPdfModal, paperInfo, visibleModal,
      visibleModalMsg } = this.state
    const { pathname = '' } = location;
    const { total = 0, } = paperData || {}
    const papers = paperData && paperData.data || []//从数据中取出试卷列表
    let query = getPageQuery() || {};
    /**
     * 是否有按钮权限
     * */
    const isClick = (name) => {
      return window.$PowerUtils.judgeButtonAuth(authButtonList, name)
    }
    const column = [
      {
        title: '题组名称',
        dataIndex: 'name',
        key: 'name',
        render: text => (
          <div dangerouslySetInnerHTML={{ __html: query.keyword ? text.replace(query.keyword, `<span style="color: #ff4843">${query.keyword}</span>`) : text }}></div>
        ),
      },
      {
        title: '创建日期',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text) => {
          return moment(text).format('YYYY-MM-DD  HH:mm:ss')
        }
      },
      {
        title: '操作',
        dataIndex: 'opts',
        key: 'opts',
        render: (text, record) => {
          return (
            <div>

              {
                isClick('编辑') ? (
                  this.state.paperBoardHaveTopic
                    ?
                    record.status
                      ?
                      <Button disabled>编辑</Button>
                      :
                      <Popconfirm
                        disabled={PopconfirmDisabled}
                        placement="bottomRight"
                        title={
                          <div className={'editWaring'}>
                            <div>当前试题板存在还未完成的题组，是否清空试题板并进入编辑？</div>
                            <div className={'hotTip'}>（注意：确认清空，试题板中的题组将会丟失）</div>
                          </div>
                        }
                        onConfirm={() => this.onEdit(text, record)}
                        okText="清空并开始编辑"
                        cancelText="取消"
                      >
                        <Button>编辑</Button>
                      </Popconfirm>
                    :
                    <Button disabled={record.status} onClick={record.status === 0 ? () => this.onEdit(text, record) : () => {
                    }}>编辑</Button>
                ) : null}
              {
                <Button
                  style={{ marginLeft: '20px' }}
                  onClick={() => { this.onPreviewExport('/my-question-group/preview-export', record) }}
                >试题预览</Button>
              }
              {
                isClick('布置任务') ?
                  <Button
                    style={{ marginLeft: '20px' }}
                    onClick={() => this.openAddTask(record)}
                    type={'primary'}
                  >布置任务</Button>
                  : null
              }
              {
                isClick('导出') ?
                  <Dropdown overlay={<Menu>
                    <Menu.Item>
                      <span onClick={() => { record.paperPdfUrl ? this.exportPdf(record.paperPdfUrl, record) : this.onPreviewExport('/my-question-group/preview-export', record) }}>{record.paperPdfUrl ? '试卷导出' : '试卷预览导出'}</span>
                    </Menu.Item>
                    <Menu.Item>
                      <span onClick={() => { record.answerPdfUrl ? this.exportPdf(record.answerPdfUrl, record) : this.onPreviewExport('/my-question-group/preview-export-sheet', record) }}>{record.answerPdfUrl ? '答题卡导出' : '答题卡预览导出'} </span>
                    </Menu.Item>
                    <Menu.Item>
                      <span onClick={() => { this.onPreviewExport('/my-question-group/answer-analysis', record) }}>导出答案解析 </span>
                    </Menu.Item>
                  </Menu>} placement="bottomLeft">
                    {/* type='primary' */}
                    <Button style={{ marginLeft: '20px' }} >导出</Button>
                  </Dropdown> : null
              }

              {
                isClick('下载/铺码') && record.latticeFileInfoVos ?
                  <Dropdown overlay={<Menu>
                    {
                      record.latticeFileInfoVos.map((dItem, index) => {
                        const dName = `${dItem.url ? "<span class='group-download-tip'>下载</span>" : "铺码"}-${spreadCodeTypeList[Number(dItem.type) - 1]?.name}-${pumaNodeTypeList[Number(dItem.latticeType) - 1]?.name}`;
                        return (<Menu.Item key={index}>
                          <span dangerouslySetInnerHTML={{ __html: dName }}
                          onClick={() => { dItem.url ? window.open(dItem.url) : this.spreadCode(dItem.type, dItem.latticeType, record.id) }}>
                             {/* {dName}  */}
                             </span>
                        </Menu.Item>)
                      })
                    }
                    <Menu.Item>
                      <span onClick={() => { this.onPreviewExport('/my-question-group/preview-export', record) }}><span className='group-download-tip'>下载</span>-试卷-普通</span>
                    </Menu.Item>
                    <Menu.Item>
                      <span onClick={() => { this.onPreviewExport('/my-question-group/preview-export-sheet', record) }}><span className='group-download-tip'>下载</span>-答题卡-普通</span>
                    </Menu.Item>
                    <Menu.Item>
                      <span onClick={() => { this.onPreviewExport('/my-question-group/answer-analysis', record) }}><span className='group-download-tip'>下载</span>答案解析 </span>
                    </Menu.Item>
                  </Menu>} placement="bottomLeft">
                    <Button style={{ marginLeft: '20px' }}>下载/铺码</Button>
                  </Dropdown> : null
              }

              {/* <Button style={{ marginLeft: '20px' }} onClick={() => { record.paperPdfUrl ? this.exportPdf(record.paperPdfUrl, record) : this.onPreviewExport(record) }}>{record.paperPdfUrl ? '试卷导出' : '预览导出'}</Button>
              <Button style={{ marginLeft: '20px' }} onClick={() => { record.paperPdfUrl ? this.exportPdf(record.paperPdfUrl, record) : this.onPreviewExport(record) }}>{record.paperPdfUrl ? '答题卡导出' : '预览导出'}</Button> */}
              {
                isClick('上传') && !(record.paperPdfUrl && record.answerPdfUrl) ? <Button style={{ marginLeft: '20px' }} onClick={() => this.showUploadPdfModalVisible(record)}>上传</Button>
                  : null
              }

              {/* {
                isClick('铺码') ?
                  <Dropdown overlay={<Menu>
                    {
                      pumaNodeTypeList.map((dItem)=>{
                        return (<Menu.Item key={'t-' + dItem.key}>
                          <span onClick={() => { this.spreadCode(1, dItem.key, record.id) }}>{`试卷铺码-${dItem.name}`}</span>
                        </Menu.Item>)
                      })
                    }
                    {
                      pumaNodeTypeList.map((dItem) => {
                        return (<Menu.Item key={'a-' + dItem.key}>
                          <span onClick={() => { this.spreadCode(2, dItem.key, record.id) }}>{`答题卡铺码-${dItem.name}`}</span>
                        </Menu.Item>)
                      })
                    }
                  </Menu>} placement="bottomLeft">
                    <Button style={{ marginLeft: '20px' }} type='primary'>铺码</Button>
                  </Dropdown> : null
              } */}
              {
                isClick('相似题匹配') ?
                  <Button
                    style={{ marginLeft: '20px' }}
                    onClick={() => { this.onPreviewExport('/my-question-group/matching', record) }}
                    // type={'primary'}
                  >相似题匹配</Button>
                  : null
              }
            </div>
          )
        }
      },
    ]
    const title = '我的题组';
    const breadcrumb = [title];
    const header = (
      <Page.Header breadcrumb={breadcrumb} title={title} />
    );
    const classString = classNames(styles['group-content'], 'gougou-content');
    return (
      <Page header={header} loading={!!loading}>
        <ExportingModal
          onRef={this.onRef}
          visibleModal={visibleModal}
          visibleModalMsg={visibleModalMsg}
        />
        {
          isUploadPdfModal ? <UploadPdfModal
            location={location}
            paperInfo={paperInfo}
            isUploadPdfModal={isUploadPdfModal}
            hideUploadPdfModalVisible={this.hideUploadPdfModalVisible}
            saveUploadPdf={this.saveUploadPdf}
          /> : null
        }
        <div className={classString}>
          <div className={styles.tabBar}>
            <span>选择类型 </span>
            <Radio.Group style={{ width: '60%' }}
              value={this.state.paperType}
              onChange={this.togglePaperType}>
              {isClick('作业') ? <Radio value="1">作业</Radio> : null}
              {isClick('测验') ? <Radio value="2">测验</Radio> : null}
              {isClick('试卷') ? <Radio value="3">试卷</Radio> : null}
            </Radio.Group>
            <Search
              defaultValue={query.keyword}
              style={{ width: '32%' }}
              placeholder="请输入名称关键字"
              enterButton="搜索"
              size="large"
              onSearch={value => this.onSearch(value)}
            />
          </div>
          <div className={styles.main}>
            <div className={styles.table}>
              <Table columns={column} dataSource={papers} pagination={false} rowKey={"id"} />
            </div>
            <div className={styles.paginationBar}>
              <Pagination {...{
                current: parseInt(query.page || 1, 10) || 1,
                defaultCurrent: 1,
                total,
                // showQuickJumper: true,
                // showSizeChanger: true,
                pageSize: parseInt(query.size, 10) || 10,
                onChange: this.togglePage,
                // onShowSizeChange: this.toggleSize
              }} />
            </div>
          </div>
          <AddTask location={location} onRef={this.getAddTaskRef} />
        </div>
      </Page>
    )
  }
}
