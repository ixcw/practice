/**
* 题组item组件
* @author:张江
* @date:2022年01月24日
* @version:v1.0.0
* */

// eslint-disable-next-line
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux } from 'dva/router'
import {
    Menu,
    Dropdown,
    Button,
    Image,
    Empty,
    Modal
} from 'antd';
import queryString from 'qs';
import { MyQuestionGroup as namespace, PaperBoard, Auth, PersonalCenter } from '@/utils/namespace';
import { getPageQuery, replaceSearch,existArr, dealTimestamp, openNotificationWithIcon } from "@/utils/utils";
import { pumaNodeTypeList, spreadCodeTypeList, collectionType } from "@/utils/const";
import AddTask from "@/pages/assignTask/components/addTask";//布置任务
import TopicGroupAnalysis from "@/pages/CombinationPaperCenter/components/TopicGroupAnalysis";//题组分析弹窗
import userInfoCache from '@/caches/userInfo';//登录用户的信息
import JoinQuestionGroupModal from "./JoinQuestionGroupModal";
import styles from './QuestionGroupItem.less';

const { confirm } = Modal;

@connect((state) => ({
    analysisData: state[PaperBoard].analysisData,//组题分析数据
    topicList: state[PaperBoard].topicList,
}))
export default class QuestionGroupItem extends React.Component {
    constructor(props) {
        super(...arguments);
        this.state = {
            combinationAnalysisModalIsShow: false,//组题分析弹框显示状态
        };
    };

    static propTypes = {
        questionGroupInfo: PropTypes.any,//数据
        source: PropTypes.any,//来源 1 我的收藏
    };

    // UNSAFE_componentWillMount() {}

    // componentDidMount() {}

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
  };

    /**
   * 获取addTask的ref
   * @param ref
   */
    getAddTaskRef = (ref) => {
        this.addRef = ref
    }

    /**
* 获取JoinQuestionGroupModal的ref
* @param ref
*/
    getJoinQuestionGroupRef = (ref) => {
        this.JoinQuestionGroupModal = ref
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
        dispatch({ type: PaperBoard + '/getGroupCenterPaperBoard' })
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
                }else{
                    openNotificationWithIcon('warn', '提示', '', '分数未全部设置或参数不全', 3);
                }
            }, 0)
        } else {
            this.setState({ combinationAnalysisModalIsShow: isShow })
        }
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

    /**
* 加入我的题组及提示
* @param groupAddStatus :当前数据
*/
    JoinQuestionGroupModalOff(groupAddStatus, questionGroupInfo) {
        if (groupAddStatus == 1) {
            openNotificationWithIcon('warn', '提示', '', '已加入我的题组', 3);
            return;
        }
        this.JoinQuestionGroupModal.onOff(true, questionGroupInfo)
    }

    /**
* 加入我的题组
* @param payload :参数
* @param callback :回调函数
*/
    joinMyQuestionGroup = (payload, callback) => {
        const { dispatch } = this.props;
        const _self = this;
        dispatch({
            type: namespace + '/addPaperToQuestionGroup',
            payload: {
                ...payload
            },
            callback: () => {
                callback();
                openNotificationWithIcon('success', '提示', '', '已成功加入我的题组！', 5)
            }
        });
    }

    /**
* 收藏或取消
* @param questionGroupInfo :参数
*/
    addOrDelUserCollection = (questionGroupInfo, collectStatus) => {
        const { dispatch,source } = this.props;
        const _self = this;
        if (collectStatus == 1) {//已收藏时 取消收藏
            if (source==1){
                confirm({
                    title: '提示',
                    content: `确定取消收藏《${questionGroupInfo.name}》？ 取消之后将从我的收藏列表中移除！`,
                    onOk() {
                        dispatch({
                            type: PersonalCenter + '/removeCollection',
                            payload: {
                                itemId: questionGroupInfo.id,//对于的题目或者试卷或者题目微课的ID
                                type: collectionType.PAPER.type,//type 收藏类型：1题目，2试卷，3题目微课
                            },
                            callback: () => {
                                openNotificationWithIcon('success', '提示', '', '已成功取消收藏！', 3)
                                questionGroupInfo.collectStatus = 0;
                                 _self.replaceSearch({})
                                _self.forceUpdate();
                            }
                        });
                    },
                    onCancel() { },
                });
            }
            return;
        }
        // 收藏
        dispatch({
            type: PersonalCenter + '/addCollection',
            payload: {
                itemId: questionGroupInfo.id,//对于的题目或者试卷或者题目微课的ID
                type: collectionType.PAPER.type,//type 收藏类型：1题目，2试卷，3题目微课
            },
            callback: () => {
                openNotificationWithIcon('success', '提示', '', '已成功收藏！', 3)
                questionGroupInfo.collectStatus = 1;
                _self.forceUpdate();
            }
        });
    }

    render() {
        const {
            location,
            questionGroupInfo = {},
            dispatch,
            analysisData,
            topicList,
            source
        } = this.props;
        const { combinationAnalysisModalIsShow } = this.state;
        const userInfo = userInfoCache() || {};
        const isTEACHER = userInfo.code == "TEACHER";//老师
        const groupAddStatus = questionGroupInfo.groupAddStatus;
        const collectStatus = questionGroupInfo.collectStatus;
        const buttonModestStyle = { backgroundColor: 'transparent', color: '#1890ff' };

        return (
            <div
                className={styles.questionBankItem}
                key={questionGroupInfo.id}
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
                    >{questionGroupInfo.name}</h3>
                    <div className={styles.otherContentBox}>
                        <span>使用次数：<label>{questionGroupInfo.examNumber || 0}</label> 次</span>
                        <span>题量：{questionGroupInfo.number || 0}题</span>
                    </div>
                </div>
                <div className={styles.operBox}>
                    {
                        isTEACHER ? <Button
                            style={{ marginLeft: '10px' }}
                            onClick={() => this.openAddTask(questionGroupInfo)}
                            type={'primary'}
                        >布置任务</Button> : null
                    }
                    {
                        isTEACHER ?
                            <Button
                                style={groupAddStatus == 1 ? { marginLeft: '10px', ...buttonModestStyle,width:'116px' } : { marginLeft: '10px' }}
                                onClick={() => { this.JoinQuestionGroupModalOff(groupAddStatus, questionGroupInfo) }}
                                type={groupAddStatus == 1 ? 'primary' : ''}
                            >{groupAddStatus == 1 ? '已加入' : '加入我的题组'}</Button>
                            : null
                    }
                    <Button style={{ marginLeft: '10px' }} onClick={() => this.getSinglePaperData(questionGroupInfo)}>分析</Button>
                    <Dropdown overlay={<Menu>
                        {
                            isTEACHER && questionGroupInfo?.latticeFileInfoVos && questionGroupInfo.latticeFileInfoVos.map((dItem, index) => {
                                const dName = `${dItem.url ? "<span class='group-download-tip'>下载</span>" : "铺码"}-${spreadCodeTypeList[Number(dItem.type) - 1]?.name}-${pumaNodeTypeList[Number(dItem.latticeType) - 1]?.name}`;
                                return (<Menu.Item key={index}>
                                    <span
                                        dangerouslySetInnerHTML={{ __html: dName }}
                                        onClick={() => { dItem.url ? window.open(dItem.url) : this.spreadCode(dItem.type, dItem.latticeType, questionGroupInfo.id) }}>
                                        {/* {dName}  */}
                                    </span>
                                </Menu.Item>)
                            })
                        }
                        <Menu.Item key={'export'}>
                            <span onClick={() => { this.onPreviewExport('/my-question-group/preview-export', questionGroupInfo) }}><span className='group-download-tip'>下载</span>-试卷-普通</span>
                        </Menu.Item>
                        <Menu.Item key={'sheet'}>
                            <span onClick={() => { this.onPreviewExport('/my-question-group/preview-export-sheet', questionGroupInfo) }}><span className='group-download-tip'>下载</span>-答题卡-普通 </span>
                        </Menu.Item>
                        <Menu.Item key={'answer'}>
                            <span onClick={() => { this.onPreviewExport('/my-question-group/answer-analysis', questionGroupInfo) }}><span className='group-download-tip'>下载</span>答案解析 </span>
                        </Menu.Item>
                    </Menu>} placement="bottomLeft">
                        {/* type='primary' */}
                        <Button style={{ marginLeft: '10px' }} >{isTEACHER ? '下载/铺码' : '下载'}</Button>
                    </Dropdown>

                    {/* <Button
                        style={{ marginLeft: '10px' }}
                        onClick={() => this.openAddTask(questionGroupInfo)}
                    // type={'primary'}
                    >收藏</Button> */}
                    <Button
                        style={collectStatus == 1 ? { marginLeft: '10px', ...buttonModestStyle } : { marginLeft: '10px',width:'74px' }}
                        onClick={() => { this.addOrDelUserCollection(questionGroupInfo, collectStatus) }}
                        type={collectStatus == 1 ? 'primary' : ''}
                    >{collectStatus == 1 ? source==1?'取消收藏':'已收藏' : '收藏'}</Button>
                </div>

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
                <JoinQuestionGroupModal location={location} onRef={this.getJoinQuestionGroupRef} joinMyQuestionGroup={(payload, callback) => {
                    const tempCallback = ()=>{
                        questionGroupInfo.groupAddStatus = 1;
                        callback();
                        this.forceUpdate();
                    }
                    this.joinMyQuestionGroup(payload, tempCallback);
                }} />
            </div>
        )
    }
}

