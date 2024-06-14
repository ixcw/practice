/**
 * 我的题组-导出预览
 * @author:张江
 * @date:2020年08月29日
 * @version:v1.0.0
 * */

// eslint-disable-next-line
import React, { Component } from 'react';
import { connect } from "dva";
import classNames from 'classnames';
import queryString from 'query-string';
import ResizeObserver from "resize-observer-polyfill";
import Page from '@/components/Pages/page';
import { MyQuestionGroup as namespace, PreviewExport as namespace2 } from '@/utils/namespace'

import styles from '@/pages/QuestionBank/Question.less';
import TopicContent from "@/components/TopicContent/TopicContent";
import RenderMaterialAndQuestion from "@/components/RenderMaterialAndQuestion/index";//渲染题目材料以及题目或者题目
import BackBtns from "@/components/BackBtns/BackBtns";
import indexStyles from './index.less';

import BigTopicInfo from "../components/BigTopicInfo";//大题标题
import PaperTopTitle from "../components/PaperTopTitle";//试卷标题及说明
import TopSetPrint from "../components/TopSetPrint";//top设置导出模式

@connect(state => ({
    exportQuestionList: state[namespace].exportQuestionList,
    loading: state[namespace].loading,
    previewExportData: state[namespace2]
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
                paperId: query && query.id ? query.id : ''
            },
        });
        dispatch({// 通过题组id获取题目批阅
            type: namespace2 + '/updateInstructionPaperPreviewApi',
            payload: {
                paperId: query && query.id ? query.id : ''
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
            exportQuestionList,
            previewExportData
        } = this.props;
        const { pathname, search } = location;
        const query = queryString.parse(search);
        const title = (query.paperName || '') + '-我的题组';
        const breadcrumb = [title];
        const urls = ['/combinationTopic/history'];//上一级路由
        const header = (
            <Page.Header breadcrumb={breadcrumb} urls={urls} title={title} />
        );

        const classString = classNames(styles['Q-content'], 'gougou-content', indexStyles['PE-content']);

        // const handlePrint = () => {
        //     watermark({ "watermark_txt": "" });
        //     window.print();
        //     watermark({ "watermark_txt": " " }, true);
        // };
        // const options = [
        //     { label: '是', value: '1' },
        //     { label: '否', value: '2' },
        // ];

        let questionListData = exportQuestionList && Array.isArray(exportQuestionList) && exportQuestionList.length > 0 ? exportQuestionList : [];
        const isEmpty = questionListData.length < 1;
        const { questionInfoList } = previewExportData
        questionListData.map(qItem => {
          if (Array.isArray(qItem.questionList) && qItem.questionList.length > 0) {
            qItem.questionList = qItem.questionList.map(item => {
              questionInfoList.map(qInfoItem => {
                if(qInfoItem.questionId == item.id) {
                  item = { ...item, ...qInfoItem}
                }
              })
              return item
            })
          }
          return qItem
        })
        console.log('PreviewExport  questionListData:', questionListData)

        return (
            <Page header={header} loading={!!loading}
            >
                <div className={classString} id='watermark'>
                    {/* <div className={classNames(indexStyles['header-info-box'], 'no-print')}>
                        <div className={indexStyles['info-box']}>
                            <div>
                                <label>是否显示水印：</label>
                                <Radio.Group options={options} onChange={this.onRadioChange} value={this.state.radioValue} />
                            </div>
                            <Button
                                icon='export'
                                type="primary"
                                onClick={() => { handlePrint() }}
                            >导出</Button>
                        </div>
                    </div> */}
                    <TopSetPrint
                        isShowWatermark={true}
                        dispatch={dispatch}
                        pdfType={1}
                        location={location}
                    />
                    <div
                        className={isEmpty ? styles['question-list-empty'] : 'pre-question-list-box'}
                    >
                        {/* <div className={indexStyles['paper-header-box']}>
                            <h2>
                                <span contenteditable="true">
                                    {query.paperName || ''}
                                </span>
                                <span className={classNames(indexStyles['tip-info'], 'no-print')}>
                                    (名称可编辑,但不做保存,只做导出文档使用)
                                </span>
                            </h2>
                        </div> */}
                        <PaperTopTitle
                            paperName={query.paperName || ''}
                        />
                        {

                            Array.isArray(questionListData) && questionListData.map((tItem, tIndex) => {
                                if (Array.isArray(tItem.questionList) && tItem.questionList.length > 0) {
                                    return (
                                        <div key={tItem.category || (tIndex+100)}>
                                            {/* <div>
                                            {
                                                tItem.rule == 4 ?//解答题的情况
                                                    <div className={indexStyles['question-type']}>
                                                        {
                                                            tItem.categoryName
                                                                ? `${uppercaseNum(tIndex + 1)}、${tItem.categoryName}`
                                                                : "未知题型"}
                        （
                        本大题共{tItem.questionList && tItem.questionList.length}小题,
                         共{this.calScore(tItem.questionList)}分）;
                          请把答案填在指定的区域,否则视为无效
                      </div> : <div className={indexStyles['question-type']}>
                                                        {
                                                            tItem.categoryName
                                                                ? `${uppercaseNum(tIndex + 1)}、${tItem.categoryName}`
                                                                : "未知题型"}
                        （
                        本大题共{tItem.questionList && tItem.questionList.length}小题,
                        每题{tItem.questionList[0].score}分,
                        共{tItem.questionList[0].score * tItem.questionList.length}分）;
                         请把答案填在指定的区域,否则视为无效
                      </div>
                                            }
                                            </div> */}
                                            <BigTopicInfo
                                                tItem={tItem}
                                                tIndex={tIndex}
                                            />
                                            {
                                                tItem.rule == 1 ?
                                                    <div className={indexStyles['q-list']}>
                                                        {/*题干区域*/}
                                                        {
                                                            Array.isArray(tItem.questionList) && tItem.questionList.map((item, index) => {
                                                                return (
                                                                    <div className={classNames('pre-question-item', indexStyles['subjective'])} key={index}>
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
                                                                                    return (<div className={classNames(indexStyles['answer-system'], 'answer-box')} key={RAQItem.serialNumber + 100}>
                                                                                        <span>
                                                                                            {RAQItem.serialNumber || RAQItem.serialCode || Number(RAQItem.questionNum)}、
                                                                                         </span>
                                                                                        <textarea id={RAQItem.questionId || RAQItem.id} questionid={RAQItem.questionId || RAQItem.id} ref={(el) => {
                                                                                            if (el && this.resizeObserver) { this.resizeObserver.observe(el) }
                                                                                        }} style={{ height: RAQItem.height + 'px' }} className='answer-area' disabled placeholder='对'></textarea>
                                                                                        <textarea id={RAQItem.questionId || RAQItem.id} questionid={RAQItem.questionId || RAQItem.id} ref={(el) => {
                                                                                            if (el && this.resizeObserver) { this.resizeObserver.observe(el) }
                                                                                        }} style={{ height: RAQItem.height + 'px' }} className='answer-area' disabled placeholder='错'></textarea>
                                                                                    </div>)
                                                                                },
                                                                            )
                                                                        }
                                                                        {/* <div className={indexStyles['dry-system']}>
                                                                            {
                                                                                RenderMaterial(item)
                                                                            }
                                                                            <TopicContent
                                                                                topicContent={item}
                                                                                childrenFiledName={'children'}
                                                                                contentFiledName={'content'}
                                                                                optionIdFiledName={'code'}
                                                                                optionsFiledName={"optionList"}
                                                                                currentPage={1}
                                                                                currentTopicIndex={item.serialNumber - 1}
                                                                                pageSize={10}
                                                                            />
                                                                        </div>
                                                                        <div className={classNames(indexStyles['answer-system'], 'answer-box')}>
                                                                            <span>
                                                                                {item.serialNumber}、
                                                                         </span>
                                                                            <textarea className='answer-area' disabled placeholder='作 答 区 域'></textarea>
                                                                        </div> */}
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div> :
                                                    tItem.rule == 4 ? 
                                                    <div className={indexStyles['q-list']}>
                                                        {/*题干区域*/}
                                                        {
                                                            Array.isArray(tItem.questionList) && tItem.questionList.map((item, index) => {
                                                                return (
                                                                    <div className={classNames('pre-question-item', 'objective')} key={index}>
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
                                                                                    return (<div className='answer-box' key={RAQItem.serialNumber + 1001}>
                                                                                        <textarea id={RAQItem.questionId || RAQItem.id} questionid={RAQItem.questionId || RAQItem.id} ref={(el) => {
                                                                                            if (el && this.resizeObserver) { this.resizeObserver.observe(el) }
                                                                                        }} style={{ height: RAQItem.height + 'px', marginRight: 20 }} className='answer-area' placeholder='作 答 区 域' disabled></textarea>
                                                                                    </div>)
                                                                                },
                                                                            )
                                                                        }
                                                                        <table className='table-score'>
                                                                          <tr>    
                                                                            <td rowSpan={3} className='back-gray'>得分</td>
                                                                            <td>十位</td>
                                                                            <td>1</td>
                                                                            <td>2</td>
                                                                            <td>3</td>
                                                                            <td>4</td>
                                                                            <td>5</td>
                                                                            <td>6</td>
                                                                            <td>7</td>
                                                                            <td>8</td>
                                                                            <td>9</td>
                                                                            <td>0</td>
                                                                          </tr>
                                                                          <tr className='back-gray'>    
                                                                            <td>个位</td>
                                                                            <td>1</td>
                                                                            <td>2</td>
                                                                            <td>3</td>
                                                                            <td>4</td>
                                                                            <td>5</td>
                                                                            <td>6</td>
                                                                            <td>7</td>
                                                                            <td>8</td>
                                                                            <td>9</td>
                                                                            <td>0</td>
                                                                          </tr>
                                                                          <tr>    
                                                                            <td>小数位</td>
                                                                            <td>1</td>
                                                                            <td>2</td>
                                                                            <td>3</td>
                                                                            <td>4</td>
                                                                            <td>5</td>
                                                                            <td>6</td>
                                                                            <td>7</td>
                                                                            <td>8</td>
                                                                            <td>9</td>
                                                                            <td>0</td>
                                                                          </tr>
                                                                      </table>
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
                                                                                    return (<div className='answer-box' key={RAQItem.serialNumber + 1001}>
                                                                                        <textarea id={RAQItem.questionId || RAQItem.id} questionid={RAQItem.questionId || RAQItem.id} ref={(el) => {
                                                                                            if (el && this.resizeObserver) { this.resizeObserver.observe(el) }
                                                                                        }} style={{ height: RAQItem.height + 'px', marginRight: 20 }} className='answer-area' placeholder='作 答 区 域' disabled></textarea>
                                                                                        <div className={classNames(indexStyles['answer-system'], 'answer-box')} key={RAQItem.serialNumber + 100}>
                                                                                          <textarea id={RAQItem.questionId || RAQItem.id} questionid={RAQItem.questionId || RAQItem.id} ref={(el) => {
                                                                                              if (el && this.resizeObserver) { this.resizeObserver.observe(el) }
                                                                                          }} style={{ height: RAQItem.height + 'px' }} className='answer-area' placeholder='对' disabled></textarea>
                                                                                          <textarea id={RAQItem.questionId || RAQItem.id} questionid={RAQItem.questionId || RAQItem.id} ref={(el) => {
                                                                                              if (el && this.resizeObserver) { this.resizeObserver.observe(el) }
                                                                                          }} style={{ height: RAQItem.height + 'px' }} className='answer-area' placeholder='错' disabled></textarea>
                                                                                        </div>
                                                                                    </div>)
                                                                                },
                                                                            )
                                                                        }
                                                                        {/* 材料部分 */}
                                                                        {/* {
                                                                            RenderMaterial(item)
                                                                        } */}
                                                                        {/* <TopicContent
                                                                            topicContent={item}
                                                                            childrenFiledName={'children'}
                                                                            contentFiledName={'content'}
                                                                            optionIdFiledName={'code'}
                                                                            optionsFiledName={"optionList"}
                                                                            currentPage={1}
                                                                            currentTopicIndex={item.serialNumber - 1}
                                                                            pageSize={10}
                                                                        />
                                                                        <div className='answer-box'>
                                                                            <textarea className='answer-area' disabled></textarea>
                                                                        </div> */}
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


