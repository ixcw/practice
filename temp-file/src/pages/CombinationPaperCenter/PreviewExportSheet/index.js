/**
 * 我的题组-答题卡导出预览
 * @author:张江
 * @date:2020年08月29日
 * @version:v1.0.0
 * */

// eslint-disable-next-line
import React, { Component } from 'react';
import { connect } from "dva";
import classNames from 'classnames';
// import {
//     Button,
// } from 'antd';
import queryString from 'query-string';
import ResizeObserver from "resize-observer-polyfill";
import Page from '@/components/Pages/page';
import { MyQuestionGroup as namespace } from '@/utils/namespace'
import BackBtns from "@/components/BackBtns/BackBtns";
import RenderMaterialAndQuestion from "@/components/RenderMaterialAndQuestion/index";//渲染题目材料以及题目或者题目

import styles from '@/pages/QuestionBank/Question.less';
import indexStyles from './index.less';

import BigTopicInfo from "../components/BigTopicInfo";//大题标题
import PaperTopTitle from "../components/PaperTopTitle";//试卷标题及说明
import TopSetPrint from "../components/TopSetPrint";//top设置导出模式

@connect(state => ({
    exportQuestionList: state[namespace].exportQuestionList,
    loading: state[namespace].loading,
}))

export default class PreviewExport extends Component {
    constructor(props) {
        super(...arguments);
        this.state = {};
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
                paperId: query && query.id ? query.id : '',
                // answerPaperType: 2,//1是试卷  2是答题卡 默认试卷
            },
        });
        this.resizeObserver = new ResizeObserver((entries, observer) => {
            // 监测到高度变化后需要处理的逻辑
            const questionId = entries[0].target.getAttribute('questionid')
            const height = entries[0].target.offsetHeight;
            clearTimeout(this.resizeObserverTimer);//避免高度变化实时调用接口
            this.resizeObserverTimer = setTimeout(() => {
                if (questionId && height) {
                    this.saveSingleDataAreaParams(questionId, height)
                }
            }, 500);
        });
    }

    /**
* 页面组件即将卸载时：清空数据
*/
    componentWillUnmount() {
        if (this.resizeObserver) this.resizeObserver.disconnect();
        clearTimeout(this.resizeObserverTimer)
        this.setState = (state, callback) => {
            return;
        };
    }

    /**
* 保存单个区域参数
* @questionId :题目id
* @height :高度
*/
    saveSingleDataAreaParams = (questionId, height) => {
        const {
            dispatch,
            location,
        } = this.props;
        const { search } = location;
        const query = queryString.parse(search) || {};
        dispatch({
            type: namespace + '/saveSingleDataAreaParams',
            payload: {
                baseDataId: query.id,//试卷ID
                dataId: questionId,//题目ID
                // dataType: undefined,//区域类型，1作答，2打分，可忽略
                height,
                type: 1,//1，试卷2，答题卡
            },
        });
    }


    render() {
        const {
            location,
            dispatch,
            loading,
            exportQuestionList
        } = this.props;
        const { pathname, search } = location;
        const query = queryString.parse(search);
        const title = (query.paperName + '+答题卡' || '') + '-我的题组';
        const breadcrumb = [title];
        const urls = ['/combinationTopic/history'];//上一级路由
        const header = (
            <Page.Header breadcrumb={breadcrumb} urls={urls} title={title} />
        );
        const classString = classNames(styles['Q-content'], 'gougou-content', indexStyles['PES-content']);

        let questionListData = exportQuestionList && Array.isArray(exportQuestionList) && exportQuestionList.length > 0 ? exportQuestionList : [];
        const isEmpty = questionListData.length < 1;

        return (
            <Page header={header} loading={!!loading}
            >
                <div className={classString} id='watermark'>
                    <TopSetPrint
                        isShowWatermark={true}
                        dispatch={dispatch}
                        pdfType={2}
                        location={location}
                    />
                    <div
                        className={isEmpty ? styles['question-list-empty'] : 'pre-question-list-box'}
                    >
                        <PaperTopTitle
                            paperName={query.paperName || ''}
                            subTitle={' -答题卡'}
                        />
                        {
                            Array.isArray(questionListData) && questionListData.map((tItem, tIndex) => {
                                if (Array.isArray(tItem.questionList) && tItem.questionList.length > 0) {
                                    return (
                                        <div key={tItem.category || (tIndex + 100)}>
                                            <BigTopicInfo
                                                tItem={tItem}
                                                tIndex={tIndex}
                                            />
                                            {
                                                tItem.rule == 1 ?
                                                    <div className={classNames(indexStyles['q-list'], indexStyles['subjective-flex'])}>
                                                        {/*答题区域*/}
                                                        {
                                                            Array.isArray(tItem.questionList) && tItem.questionList.map((item, index) => {
                                                                const isHaveMaterialQuestionList = ((item && item.questionData && item.questionData.id && item.questionData.id > 0) || (item && item.dataId && item.dataId > 0));
                                                                return (
                                                                    <div className={classNames(indexStyles['pre-question-item'], indexStyles['subjective'])} key={index} style={{ width: isHaveMaterialQuestionList ? '100%' : '33.3%' }}>
                                                                        {
                                                                            RenderMaterialAndQuestion(item, false, (RAQItem) => {
                                                                                return null;
                                                                            },
                                                                                (RAQItem) => {
                                                                                    return ([
                                                                                        <span key='serialNumber' className='question-serialNumber'>
                                                                                            {RAQItem.serialNumber || RAQItem.serialCode || Number(RAQItem.questionNum)}、
                                                                                       </span>,
                                                                                        <div className={indexStyles['answer-system']} key='textarea'>
                                                                                            <textarea id={RAQItem.questionId || RAQItem.id} questionid={RAQItem.questionId || RAQItem.id} ref={(el) => {
                                                                                                if (el && this.resizeObserver) { this.resizeObserver.observe(el) }
                                                                                            }} style={{ height: RAQItem.height + 'px' }} className='answer-area' disabled></textarea>
                                                                                        </div>]
                                                                                    )
                                                                                },
                                                                                false,
                                                                            )
                                                                        }

                                                                    </div>
                                                                    // <div className={classNames(indexStyles['pre-question-item'], indexStyles['subjective'])} key={index}>
                                                                    //             <span>
                                                                    //                 {item.serialNumber}、
                                                                    //            </span>
                                                                    //             <div className={indexStyles['answer-system']}>
                                                                    //                 <textarea className='answer-area' disabled></textarea>
                                                                    //             </div>
                                                                    //         </div>                                                               
                                                                )
                                                            })
                                                        }
                                                    </div> :
                                                    <div className={indexStyles['q-list']}>
                                                        {/*答题区域*/}
                                                        {
                                                            Array.isArray(tItem.questionList) && tItem.questionList.map((item, index) => {
                                                                return (
                                                                    RenderMaterialAndQuestion(item, false, (RAQItem) => {
                                                                        return null;
                                                                    },
                                                                        (RAQItem) => {
                                                                            return (<div className={indexStyles['pre-question-item']} key={RAQItem.serialNumber+100}>
                                                                                <span className='question-serialNumber'>
                                                                                    {RAQItem.serialNumber || RAQItem.serialCode || Number(RAQItem.questionNum)}、
                                                                         </span>
                                                                                <textarea id={RAQItem.questionId || RAQItem.id} questionid={RAQItem.questionId || RAQItem.id} ref={(el) => {
                                                                                    if (el && this.resizeObserver) { this.resizeObserver.observe(el) }
                                                                                }} style={{ height: RAQItem.height + 'px' }} className='answer-area' placeholder='作 答 区 域' disabled></textarea>
                                                                                <textarea id={RAQItem.questionId || RAQItem.id} questionid={RAQItem.questionId || RAQItem.id} ref={(el) => {
                                                                                    if (el && this.resizeObserver) { this.resizeObserver.observe(el) }
                                                                                }} style={{ height: RAQItem.height + 'px' }} className='answer-area score-area' placeholder='打 分 区 域' disabled></textarea>
                                                                        </div>)
                                                                        },
                                                                        false,
                                                                    )
                                                                    //          <div className={indexStyles['pre-question-item']} key={index}>
                                                                    //     <span>
                                                                    //         {item.serialNumber}、
                                                                    //      </span>
                                                                    //     <textarea className='answer-area' disabled></textarea>
                                                                    // </div>

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
                <div className='no-print'>
                    <BackBtns tipText={"返回"} />
                </div>
            </Page>
        );
    }
}


