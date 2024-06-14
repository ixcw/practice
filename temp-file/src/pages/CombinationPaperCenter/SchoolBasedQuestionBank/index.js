/**
 * 校本题库
 * @author:张江
 * @date:2021年04月30日
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
  Input,
  Image,
  Empty,
  Select
} from 'antd'
import { connect } from 'dva';
import classNames from 'classnames';
import { routerRedux } from 'dva/router'
import queryString from 'qs'
// import moment from 'moment'
// import { saveFileToLink } from 'web-downloadfile'

import Page from "@/components/Pages/page";
import styles from './index.less'
import {
  getPageQuery, replaceSearch,
  existArr,
  openNotificationWithIcon,
} from "@/utils/utils";
import { MyQuestionGroup as namespace, PaperBoard, Auth, Public } from '@/utils/namespace';
import { pumaNodeTypeList, spreadCodeTypeList } from "@/utils/const";

import UploadPdfModal from "../components/upload/UploadPdfModal";
import ExportingModal from "@/components/ExportingModal/ExportingModal";
import AddTask from "@/pages/assignTask/components/addTask";//布置任务
import TopicGroupAnalysis from "../components/TopicGroupAnalysis";//题组分析弹窗
import userInfoCache from '@/caches/userInfo';//登录用户的信息

const { Search } = Input;
const { Option } = Select;



@connect((state) => ({
  sbqbPaperList: state[namespace].sbqbPaperList,//组卷记录的试卷列表
  loading: state[namespace].loading,
  authButtonList: state[Auth].authButtonList,//按钮权限数据
  analysisData: state[PaperBoard].analysisData,//组题分析数据
  topicList: state[PaperBoard].topicList,
  gradeList: state[Public].gradeInfos,//年级列表
}))
export default class SchoolBasedQuestionBank extends Component {
  constructor(props) {
    super();
    let query = getPageQuery()
    const userInfo = userInfoCache() || {};
    this.state = {
      paperBoardHaveTopic: false,//试题板是否有题
      paperType: query.paperType || "1",
      SBQBtype: query.SBQBtype || "2",//校本题库可见类型
      gradeCode: query.gradeCode || userInfo.gradeId,//年级
      page: query.page || 1,
      size: query.size || 10,
      isUploadPdfModal: false,
      paperInfo: {},

      visibleModal: false,
      visibleModalMsg: '',


      combinationAnalysisModalIsShow: false,//组题分析弹框显示状态
      topics: [],
    }
  }

  componentDidMount() {
    const { dispatch, location } = this.props
    const { SBQBtype, paperType } = this.state
    let query = getPageQuery()
    const userInfo = userInfoCache()||{};
    //如果参数缺少，添加默认参数
    if (!query.paperType || !query.page || !query.size || !query.SBQBtype || !query.gradeCode || query.keyword == undefined) {
      if (!query.paperType) query.paperType = paperType
      if (!query.SBQBtype) query.SBQBtype = SBQBtype
      if (!query.page) query.page = 1
      if (!query.size) query.size = 10
      if (!query.keyword) query.keyword = ''
      if (!query.gradeCode) query.gradeCode = userInfo.gradeId
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

    dispatch({
      type: PaperBoard + '/getGroupCenterPaperBoard',
    })

    // this.getGradeList(userInfo);
  }

  /**
 * 获取年级列表
 */
  getGradeList = (userInfo) => {
    const { dispatch } = this.props
    dispatch({
      type: Public + '/getGradeInfos',
      payload: {
        studyId: userInfo.studyId || 1
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
 * 选择年级
 * @param e：触发事件的对象
 */
  selectGradeCode = (value) => {
    let gradeCode = value
    this.setState({ gradeCode }, () => {
      const { dispatch, location } = this.props
      let query = getPageQuery()
      query.gradeCode = gradeCode
      query.page = 1
      replaceSearch(dispatch, location, query)
    })
  }

  /**
 * 切换校本题库可见类型
 * @param e：触发事件的对象
 */
  toggleSBQBtype = (e) => {
    let SBQBtype = e.target.value
    this.setState({ SBQBtype }, () => {
      const { dispatch, location } = this.props
      let query = getPageQuery()
      query.SBQBtype = SBQBtype
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
    const _self = this;
    record.callback = () => {
      _self.replaceSearch({})
    }
    this.addRef.onOff(true, record)
  }

  /**
* 根据传入的对象，往地址栏添加对应的参数
* @param obj  ：参数对象
*/
  replaceSearch = (obj) => {
    const { dispatch, location } = this.props;
    let query = getPageQuery();
    query = { ...query, ...obj };
    replaceSearch(dispatch, location, query)
    //修改地址栏最新的请求参数
    // dispatch(routerRedux.replace({
    //   pathname,
    //   search: queryString.stringify(query),
    // }));
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

  getSinglePaperData = (item) => {
    const { dispatch } = this.props
    dispatch({// 通过题组id获取题目列表
      type: namespace + '/getQuetionInfoByPaperId',
      payload: {
        paperId: item.id
      },
      callback: (result) => {
        this.setState({
          topics: result
        }, () => {
          this.toggleAnalysisModalState(true, item)
        })
      }
    });
  }
  /**
  * 打开/关闭  查看组题分析的弹框
  * @param isShow ：显示状态
  *
  */
  toggleAnalysisModalState = (isShow, singleItem) => {
    const { topics } = this.state
    const { dispatch } = this.props
    //如果是打开弹窗，发送请求
    if (isShow && singleItem) {
      //使用延时器，将内部的代码放到事件队列中执行，解决设置最后一道题分数后直接点击预览报告导致最后一道题分数没有设置的问题
      setTimeout(_ => {
        let noScoreTopics = []//定义数组，存放所有没有设置分数的题目序号
        //遍历数据，封装参数
        let topicList = []
        topics && topics.forEach(topicType => {
          topicType && topicType.questionList && topicType.questionList.forEach(topic => {
            if (existArr(topic.materialQuestionList)) {//获取材料下子题的id 并处理分数
              topic.materialQuestionList.map((item) => {
                if (item.id !== null && item.id !== undefined && item.id !== '' && item.score !== null && item.score !== undefined && item.score !== '' && item.score != 0) {
                  topicList.push({
                    id: item.id,
                    score: parseFloat(item.score),
                    code: item.serialNumber
                  })
                } else {
                  noScoreTopics.push(item.serialNumber)
                }
              })
            } else {
              if (topic.id !== null && topic.id !== undefined && topic.id !== '' && topic.score !== null && topic.score !== undefined && topic.score !== '' && topic.score != 0) {
                topicList.push({
                  id: topic.id,
                  score: parseFloat(topic.score),
                  code: topic.serialNumber
                })
              } else {
                noScoreTopics.push(topic.serialNumber)
              }
            }
          })
        })
        if (noScoreTopics.length === 0) {
          this.setState({ combinationAnalysisModalIsShow: isShow })
          dispatch({
            type: `${PaperBoard}/previewAnalysis`,
            payload: {
              question: topicList,
              type: 2,//1 表示还没有组成试卷之前（在试题板看到的题组分析），2：表示组成任务之后其他地方需要看这个任务的组题分析
              paperId: singleItem.id,
            }
          })
        }
      }, 0)
    } else {
      this.setState({ combinationAnalysisModalIsShow: isShow })
    }
  }

  /**
 * 页面组件即将卸载时：清空数据
 */
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: namespace + '/set',
      payload: {
        sbqbPaperList: undefined,
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
      sbqbPaperList,
      location,
      authButtonList,//按钮权限数据

      analysisData,
      topicList,
      gradeList
    } = this.props
    const { PopconfirmDisabled, needCheck, isUploadPdfModal, paperInfo, visibleModal,
      visibleModalMsg, SBQBtype, combinationAnalysisModalIsShow, gradeCode } = this.state
    const { pathname = '' } = location;
    const { total = 0, } = sbqbPaperList || {}
    const papers = sbqbPaperList && sbqbPaperList.data || []//从数据中取出试卷列表
    let query = getPageQuery() || {};
    /**
     * 是否有按钮权限
     * */
    const isClick = (name) => {
      return window.$PowerUtils.judgeButtonAuth(authButtonList, name)
    }
    const title = '校本题库';
    const breadcrumb = [title];
    const header = (
      <Page.Header breadcrumb={breadcrumb} title={title} />
    );
    const classString = classNames(styles['school-content'], 'gougou-content');
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
          <div className={styles.topSelectBox}>
            <div>
              <Radio.Group
                defaultValue="2"
                value={SBQBtype}
                buttonStyle="solid"
                onChange={this.toggleSBQBtype}
              >
                <Radio.Button value="2">校本题库</Radio.Button>
                {isClick('全部题库') ? <Radio.Button value="3">全部题库</Radio.Button> : null}
              </Radio.Group>
            </div>
            <div className={styles.tabBar}>

              {
                gradeList ? [<span key="label">选择年级：</span>, <Select key="value"
                  // allowClear
                  defaultValue={String(gradeCode)}
                  style={{ marginRight: '20px', width: 120 }}
                  onChange={this.selectGradeCode}
                  placeholder={`请选择年级`}
                >
                  {
                    gradeList && gradeList.map((item) => {
                      return (<Option key={item.id} value={String(item.id)}>{item.name}</Option>)
                    })
                  }
                </Select>] : null
              }

              <span>选择类型：</span>
              <Radio.Group
                value={this.state.paperType}
                onChange={this.togglePaperType}>
                {isClick('作业') ? <Radio value="1">作业</Radio> : null}
                {isClick('测验') ? <Radio value="2">测验</Radio> : null}
                {isClick('试卷') ? <Radio value="3">试卷</Radio> : null}
              </Radio.Group>
              <Search
                defaultValue={query.keyword}
                style={{ width: '20vw' }}
                placeholder="请输入名称关键字"
                enterButton="搜索"
                size="large"
                onSearch={value => this.onSearch(value)}
              />
            </div>

          </div>
          {
            papers && papers.length > 0 ?
              <div className={styles.main}>
                <div className={styles.questionBankList}>
                  {
                    papers && papers.map((item) => {
                      return (
                        <div
                          className={styles.questionBankItem}
                          key={item.id}
                        >
                          <div className={styles.imageLogo}>
                            <Image
                              preview={false}
                              width={48}
                              src="https://resformalqb.gg66.cn/logo.png"
                            />
                          </div>
                          <div className={styles.contentBox}>
                            <h3
                              className={styles.title}
                              dangerouslySetInnerHTML={{ __html: query.keyword ? item.name.replace(query.keyword, `<span style="color: #ff4843">${query.keyword}</span>`) : item.name }}
                            ></h3>
                            <div className={styles.otherContentBox}>
                              <span>使用次数：<label>{item.examNumber || 0}</label> 次</span>
                              <span>题量：{item.number || 0}题</span>
                              {
                                item.gradeName ? <span>年级：{item.gradeName}</span> : null
                              }
                              <span>科目：{item.subjectName}</span>
                              {/* <span>类型：{item.paperType == 1 ? '作业' : item.paperType == 2 ? '测验' : '考试'}</span> */}
                              <span>来源：
                                {item.schoolName || ''}
                                {/* <Tooltip placement="top" title={item.schoolName}>
                                  <span className={styles.orgName}> {item.schoolName || ''}</span>
                                </Tooltip> */}
                                -{item.creatorName ? item.creatorName + '（老师）' : ''}</span>
                            </div>
                          </div>
                          <div className={styles.operBox}>

                            {
                              isClick('布置任务') ?
                                <Button
                                  style={{ marginLeft: '20px' }}
                                  onClick={() => this.openAddTask(item)}
                                  type={'primary'}
                                >布置任务</Button>
                                : null
                            }
                            {
                              isClick('分析') ? <Button style={{ marginLeft: '20px' }} onClick={() => this.getSinglePaperData(item)}>分析</Button>
                                : null
                            }
                            {
                              isClick('导出') ?
                                <Dropdown overlay={<Menu>
                                  <Menu.Item>
                                    <span onClick={() => { item.paperPdfUrl ? this.exportPdf(item.paperPdfUrl, item) : this.onPreviewExport('/my-question-group/preview-export', item) }}>{item.paperPdfUrl ? '试卷导出' : '试卷预览导出'}</span>
                                  </Menu.Item>
                                  <Menu.Item>
                                    <span onClick={() => { item.answerPdfUrl ? this.exportPdf(item.answerPdfUrl, item) : this.onPreviewExport('/my-question-group/preview-export-sheet', item) }}>{item.answerPdfUrl ? '答题卡导出' : '答题卡预览导出'} </span>
                                  </Menu.Item>
                                  <Menu.Item>
                                    <span onClick={() => { this.onPreviewExport('/my-question-group/answer-analysis', item) }}>导出答案解析 </span>
                                  </Menu.Item>
                                </Menu>} placement="bottomLeft">
                                  <Button style={{ marginLeft: '20px' }} >导出</Button>
                                </Dropdown> : null
                            }

                            {
                              isClick('下载/铺码') && item?.latticeFileInfoVos ?
                                <Dropdown overlay={<Menu>
                                  {
                                    item.latticeFileInfoVos.map((dItem, index) => {
                                      const dName = `${dItem.url ? "<span class='group-download-tip'>下载</span>" : "铺码"}-${spreadCodeTypeList[Number(dItem.type) - 1]?.name}-${pumaNodeTypeList[Number(dItem.latticeType) - 1]?.name}`;
                                      return (<Menu.Item key={index}>
                                        <span 
                                          dangerouslySetInnerHTML={{ __html: dName }}
                                        onClick={() => { dItem.url ? window.open(dItem.url) : this.spreadCode(dItem.type, dItem.latticeType, item.id) }}>
                                           {/* {dName}  */}
                                           </span>
                                      </Menu.Item>)
                                    })
                                  }
                                  <Menu.Item>
                                    <span onClick={() => { this.onPreviewExport('/my-question-group/preview-export', item) }}><span className='group-download-tip'>下载</span>-试卷-普通</span>
                                  </Menu.Item>
                                  <Menu.Item>
                                    <span onClick={() => { this.onPreviewExport('/my-question-group/preview-export-sheet', item) }}><span className='group-download-tip'>下载</span>-答题卡-普通 </span>
                                  </Menu.Item>
                                  <Menu.Item>
                                    <span onClick={() => { this.onPreviewExport('/my-question-group/answer-analysis', item) }}><span className='group-download-tip'>下载</span>答案解析 </span>
                                  </Menu.Item>
                                </Menu>} placement="bottomLeft">
                                  {/* type='primary' */}
                                  <Button style={{ marginLeft: '20px' }} >下载/铺码</Button>
                                </Dropdown> : null
                            }

                            {
                              isClick('上传') && !(item.paperPdfUrl && item.answerPdfUrl) ? <Button style={{ marginLeft: '20px' }} onClick={() => this.showUploadPdfModalVisible(item)}>上传</Button>
                                : null
                            }
                            {/* {
                              isClick('铺码') ?
                                <Dropdown overlay={<Menu>
                                  {
                                    pumaNodeTypeList.map((dItem) => {
                                      return (<Menu.Item key={'t-' + dItem.key}>
                                        <span onClick={() => { this.spreadCode(1, dItem.key, item.id) }}>{`试卷铺码-${dItem.name}`}</span>
                                      </Menu.Item>)
                                    })
                                  }
                                  {
                                    pumaNodeTypeList.map((dItem) => {
                                      return (<Menu.Item key={'a-' + dItem.key}>
                                        <span onClick={() => { this.spreadCode(2, dItem.key, item.id) }}>{`答题卡铺码-${dItem.name}`}</span>
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
                                  onClick={() => { this.onPreviewExport('/my-question-group/matching', item) }}
                                // type={'primary'}
                                >相似题匹配</Button>
                                : null
                            }
                          </div>
                        </div>

                      )
                    })
                  }
                </div>
                <div className={styles.paginationBar}>
                  <Pagination {...{
                    current: parseInt(query.page || 1, 10) || 1,
                    defaultCurrent: 1,
                    total,
                    showQuickJumper: true,
                    // showSizeChanger: true,
                    pageSize: parseInt(query.size, 10) || 10,
                    onChange: this.togglePage,
                    // onShowSizeChange: this.toggleSize
                  }} />
                </div>
              </div>
              : <div className={styles.emptyContent}>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={window.$emptyDescInfo} />
              </div>
          }
          <AddTask location={location} onRef={this.getAddTaskRef} />
          {/*  组题分析弹框*/}
          {
            combinationAnalysisModalIsShow ?
              <TopicGroupAnalysis
                analysisData={analysisData}
                combinationAnalysisModalIsShow={combinationAnalysisModalIsShow}
                toggleAnalysisModalState={this.toggleAnalysisModalState}
                topicList={topicList}
              /> : null
          }
        </div>
      </Page>
    )
  }
}
