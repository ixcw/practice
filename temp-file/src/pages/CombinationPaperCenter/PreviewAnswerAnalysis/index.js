/**
 * 我的题组-导出答案解析预览
 * @author:张江
 * @date:2021年02月25日
 * @version:v1.0.0
 * */

// eslint-disable-next-line
import React, { Component } from 'react';
import { connect } from "dva";
import classNames from 'classnames';
import queryString from 'query-string';
import Page from '@/components/Pages/page';
import { MyQuestionGroup as namespace } from '@/utils/namespace'

import styles from '@/pages/QuestionBank/Question.less';
// import TopicContent from "@/components/TopicContent/TopicContent";
import RenderMaterialAndQuestion from "@/components/RenderMaterialAndQuestion/index";//渲染题目材料以及题目或者题目
import BackBtns from "@/components/BackBtns/BackBtns";
import indexStyles from './index.less';

// import BigTopicInfo from "../components/BigTopicInfo";//大题标题
import PaperTopTitle from "../components/PaperTopTitle";//试卷标题及说明
import TopSetPrint from "../components/TopSetPrint";//top设置导出模式
import { uppercaseNum } from '@/utils/utils';

@connect(state => ({
    exportQuestionList: state[namespace].exportQuestionList,
    loading: state[namespace].loading,
}))

export default class PreviewAnswerAnalysis extends Component {
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
                paperId: query && query.id ? query.id : ''
            },
        });

    }

    /**
* 页面组件即将卸载时：清空数据
*/
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }

    /**
    * 计算解答题分数
    */
    // calScore = (list) => {
    //     let totlaScroe = 0;
    //     list && list.map((item) => {
    //         totlaScroe += item.score;
    //     })
    //     return totlaScroe;
    // }

    render() {
        const {
            location,
            dispatch,
            loading,
            exportQuestionList
        } = this.props;
        const { pathname, search } = location;
        const query = queryString.parse(search);
        const title = (query.paperName + '-答案解析' || '') + '-我的题组';
        const breadcrumb = [title];
        const urls = ['/combinationTopic/history'];//上一级路由
        const header = (
            <Page.Header breadcrumb={breadcrumb} urls={urls} title={title} />
        );

        const classString = classNames(styles['Q-content'], 'gougou-content', indexStyles['AnswerAnalysis-content']);

        let questionListData = exportQuestionList && Array.isArray(exportQuestionList) && exportQuestionList.length > 0 ? exportQuestionList : [];
        const isEmpty = questionListData.length < 1;

        return (
            <Page header={header} loading={!!loading}
            >
                <div className={classString} id='watermark'>
                    <TopSetPrint
                        isShowWatermark={true}
                        dispatch={dispatch}
                        pdfType={3}
                        location={location}
                    />
                    <div
                        className={isEmpty ? styles['question-list-empty'] : 'pre-question-list-box'}
                    >
                        <PaperTopTitle
                            paperName={query.paperName || ''}
                            subTitle={'-答案解析'}
                        />
                        {

                            Array.isArray(questionListData) && questionListData.map((tItem, tIndex) => {
                                if (Array.isArray(tItem.questionList) && tItem.questionList.length > 0) {
                                    return (
                                        <div key={tItem.category || (tIndex + 100)}>
                                            <div>
                                                {
                                                    tItem.rule == 4 ?//解答题的情况
                                                        <div className={'question-type'}>
                                                            {
                                                                tItem.categoryName
                                                                    ? `${uppercaseNum(tIndex + 1)}、${tItem.categoryName}`
                                                                    : "未知题型"}
                                                        </div> : <div className={'question-type'}>
                                                            {
                                                                tItem.categoryName
                                                                    ? `${uppercaseNum(tIndex + 1)}、${tItem.categoryName}`
                                                                    : "未知题型"}
                                                        </div>
                                                }
                                            </div>

                                            {/* <BigTopicInfo
                                                tItem={tItem}
                                                tIndex={tIndex}
                                            /> */}
                                            {
                                                tItem.rule == 1 ?
                                                    <div className={indexStyles['q-list']}>
                                                        {/*题干区域*/}
                                                        {
                                                            Array.isArray(tItem.questionList) && tItem.questionList.map((item, index) => {
                                                                return (
                                                                    <div className={classNames('pre-question-item', indexStyles['objective'])} key={index}>
                                                                        {
                                                                            RenderMaterialAndQuestion(item, true, (RAQItem) => {
                                                                                return <div className={'answer-box'}><span>{RAQItem.serialCode}、</span></div>;
                                                                            },
                                                                                (RAQItem) => {
                                                                                    return null;
                                                                                },
                                                                            )
                                                                        }

                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div> :
                                                    <div className={indexStyles['q-list']}>
                                                        {/*题干区域*/}
                                                        {
                                                            Array.isArray(tItem.questionList) && tItem.questionList.map((item, index) => {
                                                                return (
                                                                    <div className={classNames('pre-question-item', 'objective')} key={index}>
                                                                        {
                                                                            RenderMaterialAndQuestion(item, true, (RAQItem) => {
                                                                                return <div className={'answer-box'}><span>{RAQItem.serialCode}、</span></div>;
                                                                            },
                                                                                (RAQItem) => {
                                                                                    return null;
                                                                                },
                                                                            )
                                                                        }

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
                <div className='no-print'>
                    <BackBtns tipText={"返回"} />
                </div>
            </Page>
        );
    }
}


