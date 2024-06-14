/**
 * 我的题组-匹配相似题
 * @author:张江
 * @date:2021年02月22日
 * @version:v1.0.0
 * */

// eslint-disable-next-line
import React, { Component } from 'react';
import { connect } from "dva";
import classNames from 'classnames';
import queryString from 'query-string';
import { Affix } from 'antd';
import Page from '@/components/Pages/page';
import { MyQuestionGroup as namespace, Auth } from '@/utils/namespace'

import styles from '@/pages/QuestionBank/Question.less';
import TopicContent from "@/components/TopicContent/TopicContent";
import RenderMaterialAndQuestion from "@/components/RenderMaterialAndQuestion/index";//渲染题目材料以及题目或者题目
import ParametersArea from '@/components/QuestionBank/ParametersArea';//
import BackBtns from "@/components/BackBtns/BackBtns";
import indexStyles from '../PreviewExport/index.less';

import BigTopicInfo from "../components/BigTopicInfo";//大题标题
import PaperTopTitle from "../components/PaperTopTitle";//试卷标题及说明
// import TopSetPrint from "../components/TopSetPrint";//top设置导出模式
import WrongQuestionMatchModal from "../components/WrongQuestionMatchModal/index";//相似题匹配
import EvalTargetModal from "../components/EvalTargetModal/index";//添加测评目标弹窗
import ErrorCorrectionModal from "@/components/QuestionBank/ErrorCorrectionModal";
import {
    getIcon,
    pushNewPage
} from "@/utils/utils";
const IconFont = getIcon();

@connect(state => ({
    exportQuestionList: state[namespace].exportQuestionList,
    loading: state[namespace].loading,
    authButtonList: state[Auth].authButtonList,//按钮权限数据
}))

export default class Matching extends Component {
    constructor(props) {
        super(...arguments);
        this.state = {
            questionInfo: null,//
            isWrongQuestionMatchModal: false,//
        };
    };

    UNSAFE_componentWillMount() {
        const {
            dispatch,
            location,
        } = this.props;
        const { search } = location;
        const query = queryString.parse(search);
        dispatch({// 通过题组id获取题目列表
            type: namespace + '/getQuetionInfoByPaperId',
            payload: {
                paperId: query && query.id ? query.id : ''
            },
        });

    }

    /**
* 显示相似题匹配弹窗
*@isShow :是否显示弹窗
*@item :题目信息
*/
    handleWrongQuestionMatchModal = (isShow, item) => {
        const {
            location,
        } = this.props;
        const { search } = location;
        const query = queryString.parse(search);
        item.paperId = query.id;
        this.setState({
            isWrongQuestionMatchModal: isShow,
            questionInfo: item,
        })
    }

    /**
 * 获取题目纠错modal的ref
 **/
    getErrorCorrectionModal = (ref) => {
        this.errorCorrectionRef = ref;
    }

    /**
     * 打开布置任务
     */
    openErrorCorrection = (questionId) => {
        this.errorCorrectionRef.onOff(true, questionId)
    }

    /**
* 页面组件即将卸载时：清空数据
*/
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }

    render() {
        const {
            location,
            dispatch,
            loading,
            exportQuestionList,
            authButtonList,
        } = this.props;
        const {
            isWrongQuestionMatchModal,
            questionInfo
        } = this.state
        const { pathname, search } = location;
        const query = queryString.parse(search);
        const title = (query.paperName || '') + '-相似题匹配';
        const breadcrumb = [title];
        const urls = ['/combinationTopic/history'];//上一级路由
        const header = (
            <Page.Header breadcrumb={breadcrumb} urls={urls} title={title} />
        );
        /**
         * 是否有按钮权限
         * */
        const isClick = (name) => {
            return window.$PowerUtils.judgeButtonAuth(authButtonList, name)
        }
        const classString = classNames(styles['Q-content'], 'gougou-content', indexStyles['PE-content']);

        let questionListData = exportQuestionList && Array.isArray(exportQuestionList) && exportQuestionList.length > 0 ? exportQuestionList : [];
        const isEmpty = questionListData.length < 1;

        return (
            <Page header={header} loading={!!loading}
            >
                <div className={classString} id='watermark'>
                    <Affix offsetTop={110}>
                        <div className={indexStyles['location_title']}>
                            <span>
                                位置:套题--{query.paperName || ''}>相似题匹配 </span>
                        </div>
                    </Affix>
                    <div
                        className={isEmpty ? styles['question-list-empty'] : 'pre-question-list-box'}
                    >
                        <PaperTopTitle
                            paperName={query.paperName || ''}
                            isEdit={false}
                        />
                        {

                            Array.isArray(questionListData) && questionListData.map((tItem, tIndex) => {
                                if (Array.isArray(tItem.questionList) && tItem.questionList.length > 0) {
                                    return (
                                        <div key={tItem.category || (tIndex + 100)}>
                                            <BigTopicInfo
                                                tItem={tItem}
                                                tIndex={tIndex}
                                                isEdit={false}
                                            />
                                            {
                                                tItem.rule == 1 ?
                                                    <div className={indexStyles['q-list']}>
                                                        {/*题干区域*/}
                                                        {
                                                            Array.isArray(tItem.questionList) && tItem.questionList.map((item, index) => {
                                                                item.category = tItem.category;
                                                                item.categoryName = tItem.categoryName;
                                                                return (
                                                                    <div className={classNames('pre-question-item', indexStyles['subjective'], indexStyles['matching'])} key={index}>
                                                                        {
                                                                            RenderMaterialAndQuestion(item, false, (RAQItem) => {
                                                                                return (<div className={indexStyles['dry-system']} key={RAQItem.serialNumber}>
                                                                                    <TopicContent
                                                                                        topicContent={RAQItem}
                                                                                        childrenFiledName={'children'}
                                                                                        contentFiledName={'content'}
                                                                                        optionIdFiledName={'code'}
                                                                                        optionsFiledName={"optionList"}
                                                                                        currentPage={1}
                                                                                        currentTopicIndex={(RAQItem.serialNumber || RAQItem.serialCode || Number(RAQItem.questionNum)) - 1}
                                                                                        pageSize={10}
                                                                                    />
                                                                                </div>)
                                                                            },
                                                                                (RAQItem) => {
                                                                                    return <ParametersArea QContent={RAQItem} comePage={''} />;
                                                                                },
                                                                            )
                                                                        }
                                                                        <div className={indexStyles.interactive}>
                                                                            {//相似题匹配
                                                                                isClick('相似题匹配') ? <div onClick={_ => {
                                                                                    this.handleWrongQuestionMatchModal(true, item)
                                                                                }}><IconFont type="icon-icon_hailiangmingdanpipei" /> 相似题匹配</div>
                                                                                    : null}

                                                                            {//上传微课
                                                                                isClick('上传微课') ? <div onClick={_ => {
                                                                                    pushNewPage({ questionId: item.id, dataId: item.dataId, }, '/question-detail', dispatch)
                                                                                }}><IconFont type="icon-shangchuanweike" />上传微课</div>
                                                                                    : null}

                                                                            {//2021年05月07日加-张江-试题板纠错
                                                                                isClick('纠错') ?
                                                                                    <div onClick={() => this.openErrorCorrection(item.id)}>
                                                                                        <IconFont type={'icon-jiucuo'} />
                                    纠错
                                  </div>
                                                                                    :
                                                                                    null
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div> :
                                                    <div className={indexStyles['q-list']}>
                                                        {/*题干区域*/}
                                                        {
                                                            Array.isArray(tItem.questionList) && tItem.questionList.map((item, index) => {
                                                                item.category = tItem.category;
                                                                item.categoryName = tItem.categoryName;
                                                                return (
                                                                    <div className={classNames('pre-question-item', 'objective', indexStyles['matching'])} key={index}>
                                                                        {
                                                                            RenderMaterialAndQuestion(item, false, (RAQItem) => {
                                                                                return (<TopicContent
                                                                                    key={RAQItem.serialNumber}
                                                                                    topicContent={RAQItem}
                                                                                    childrenFiledName={'children'}
                                                                                    contentFiledName={'content'}
                                                                                    optionIdFiledName={'code'}
                                                                                    optionsFiledName={"optionList"}
                                                                                    currentPage={1}
                                                                                    currentTopicIndex={(RAQItem.serialNumber || RAQItem.serialCode || Number(RAQItem.questionNum)) - 1}
                                                                                    pageSize={10}
                                                                                />)
                                                                            },
                                                                                (RAQItem) => {
                                                                                    return <ParametersArea QContent={RAQItem} comePage={''} />;
                                                                                },
                                                                            )
                                                                        }
                                                                        <div className={indexStyles.interactive}>

                                                                            {//-2021年03月10日加-张江-试题板添加测评目标
                                                                                isClick('测评目标') ? <div onClick={() => { this.evalTargetRef.handleOnOrOff(true, item) }}>
                                                                                    <IconFont type="icon-cepingmubiao" /> 测评目标</div>
                                                                                    : null}

                                                                            {//相似题匹配
                                                                                isClick('相似题匹配') ? <div onClick={_ => {
                                                                                    this.handleWrongQuestionMatchModal(true, item)
                                                                                }}><IconFont type="icon-icon_hailiangmingdanpipei" /> 相似题匹配</div>
                                                                                    : null}

                                                                            {//上传微课
                                                                                isClick('上传微课') ? <div onClick={_ => {
                                                                                    pushNewPage({ questionId: item.id, dataId: item.dataId, }, '/question-detail', dispatch)
                                                                                }}><IconFont type="icon-shangchuanweike" />上传微课</div>
                                                                                    : null}
                                                                                    
                                                                            {//2021年05月07日加-张江-试题板纠错
                                                                                isClick('纠错') ?
                                                                                    <div onClick={() => this.openErrorCorrection(item.id)}>
                                                                                        <IconFont type={'icon-jiucuo'} />
                                    纠错
                                  </div>
                                                                                    :
                                                                                    null
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                            }

                                        </div>)

                                } else {
                                    return null;
                                }
                            })
                        }
                    </div>

                </div>
                {
                    isWrongQuestionMatchModal ? <WrongQuestionMatchModal
                        isWrongQuestionMatchModal={isWrongQuestionMatchModal}
                        questionInfo={questionInfo}
                        hideWrongQuestionMatchVisible={(questionInfo) => {
                            this.handleWrongQuestionMatchModal(false, questionInfo)
                        }}
                    /> : null
                }
                {/* 测评目标-2021年03月10日加-张江 */}
                <EvalTargetModal getRef={(ref) => { this.evalTargetRef = ref }} />
                {/* 题目纠错-2021年05月10日加-张江 */}
                <ErrorCorrectionModal onRef={this.getErrorCorrectionModal} />
                <div className='no-print'>
                    <BackBtns tipText={"返回"} />
                </div>
            </Page>
        );
    }
}


