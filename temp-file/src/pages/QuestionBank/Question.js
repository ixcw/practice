/**
 * 题库管理题目预览
 * @author:张江
 * @date:2019年11月22日
 * @version:v1.0.0
 * */

// eslint-disable-next-line
import React from 'react';
import { connect } from "dva";
import classNames from 'classnames';
import {
    Button,
    Spin,
    Pagination,
    message,
    Modal,
    Empty
} from 'antd';
import queryString from 'query-string';
import crypto from 'crypto';
import { routerRedux } from 'dva/router';
import Page from '@/components/Pages/page';
import paginationConfig from '@/utils/pagination';
import { QuestionBank as namespace } from '@/utils/namespace';
import styles from './Question.less';
import QuestionHeaderOption from "@/components/QuestionBank/QuestionHeaderOption";
import QuestionItem from "@/components/QuestionBank/QuestionItem";
import BackBtns from "@/components/BackBtns/BackBtns";
import { dealDataJoinByField } from "@/utils/utils";

import singleTaskInfoCache from '@/caches/singleTaskInfo';
const { confirm } = Modal;

@connect(state => ({
    saveLoading: state[namespace].saveLoading,
    questionLoading: state[namespace].questionLoading,
    questionList: state[namespace].questionList,
    knowledgeList: state[namespace].knowledgeList,
    keyAbilityList: state[namespace].keyAbilityList,//关键能力
    coreLiteracyList: state[namespace].coreLiteracyList,//核心素养
    cognitiveLevelList: state[namespace].cognitiveLevelList,//认知层次
    knowledgeDimensionList: state[namespace].knowledgeDimensionList,//知识维度
}))

export default class Question extends React.Component {
    constructor(props) {
        super(...arguments);
        this.state = {
            editContent: '',
            contentChange: false
        };
    };

    UNSAFE_componentWillMount() {
        this.getKnowledgeList();

    }

    /**
    * 获取知识点列表
    */
    getKnowledgeList = () => {
        const {
            location,
            dispatch,
        } = this.props;
        const { pathname, search } = location;
        const query = queryString.parse(search);
        const wordOption = singleTaskInfoCache();
        if (wordOption && (wordOption.isSee == -1 || wordOption.isSee == 2)) {

            // 2020年08月11日 版本题库新加 start
            let version_id = 0
            if (wordOption.version_id) {
                const version = wordOption.version_id.split(',');
                version_id = version[version.length - 1]
            }
            // 2020年08月11日 版本题库新加 end 
            dispatch({
                type: namespace + '/getKnowledgeDetailsByPid',
                payload: {
                    gradeId: wordOption.gradeId,
                    subjectId: wordOption.subjectId,
                    version: version_id,// 2020年08月11日 版本题库新加
                },
            });

            const isComePage = wordOption.paperId && wordOption.comePage == 'uploadData';
            if (isComePage) {//2021年05月24日 来至数据入库界面 直接返回 不查询其他三要素
                return;
            }
            /** ********************************************************* 题库管理 核心素养 关键能力 认知层次 start author:张江 date:2020年09月05日 *************************************************************************/
            //根据科目筛选关键能力
            dispatch({
                type: namespace + '/getQuestionAbilityList',
                payload: {
                    subjectId: wordOption.subjectId,
                },
            });
            //根据科目筛选核心素养
            dispatch({
                type: namespace + '/getQuestionCompetenceList',
                payload: {
                    subjectId: wordOption.subjectId,
                },
            });
            //根据科目筛选认知层次
            dispatch({
                type: namespace + '/getCognitionLevelList',
                payload: {
                    subjectId: wordOption.subjectId,
                },
            });
            /** ********************************************************* 题库管理 核心素养 关键能力 认知层次 end author:张江 date:2020年09月05日 *************************************************************************/
            /** ********************************************************* 题库管理 知识维度查询 start author:张江 date:2022年05月20日 *************************************************************************/
            //知识维度查询
            dispatch({
                type: namespace + '/getKnowledgeDimension',
                payload: {},
            });
           /** ********************************************************* 题库管理 知识维度查询 end author:张江 date:2022年05月10日 *************************************************************************/

        }
    }

    /**
    * 监听页码变化
    * @param current  ：当前页
    * @param pageSize  ：一页显示多少条数据
    */
    onShowSizeChange = (current, pageSize) => {
        const {
            location,
            dispatch,
        } = this.props;
        const { pathname, search } = location;
        const query = queryString.parse(search);
        this.questionLoadingTip();
        dispatch(routerRedux.replace({
            pathname,
            search: queryString.stringify({ ...query, p: 1, s: pageSize })
        }))
    }

    /**
    * 确认弹框
    */
    showConfirmModal = () => {
        const {
            location,
            dispatch,
        } = this.props;
        const { pathname, search } = location;
        const query = queryString.parse(search);
        confirm({
            title: '确认完成设参提醒',
            content: '本次确认设参完成将不得再进行修改，请先确保所填参数及题目无误，确认之后将流转到下一步:审核中',
            onOk() {
                dispatch({//// 完成任务
                    type: namespace + '/completeJob',
                    payload: {
                        jobId: query.jobId
                    },
                    callback: (result) => {
                        message.success('完成设参成功')
                        // dispatch(routerRedux.replace({
                        //     pathname: '/question-bank',
                        // }));
                        //路由回退
                        window.history.go(-1);
                    }
                });
            },
            onCancel() { },
        });
    }

    /**
  * 下一步确认弹框
  */
    showNextConfirmModal = () => {
        const {
            location,
            dispatch,
        } = this.props;
        const { pathname, search } = location;
        const query = queryString.parse(search);
        confirm({
            title: '流转提醒',
            content: '确认已经根据错误类型及驳回说明完成驳回修改,确认是否流转到下一步:审核修驳',
            onOk() {
                dispatch({ // 完成任务
                    type: namespace + '/updateErrorQuestionStatus',
                    payload: {
                        jobId: query.jobId
                    },
                    callback: (result) => {
                        message.success('已成功流转到下一步:审核修驳')
                        // dispatch(routerRedux.replace({
                        //     pathname: '/question-bank',
                        // }));
                        //路由回退
                        window.history.go(-1);
                    }
                });
            },
            onCancel() { },
        });
    }

    /**
    * makdown编辑
    * @param content  ：编辑的内容
    * @param record  ：其他参数
    */
    doEditor = (newContent, content, record) => {
        // const { dispatch } = this.props;
        // const secret = 'md5';
        // // const { contentChange, editContent } = this.state
        // const changeContent = newContent;
        // const hash1 = crypto.createHmac('sha256', secret).update(content).digest('hex');
        // const hash2 = crypto.createHmac('sha256', secret).update(changeContent).digest('hex');
        // const wordOption = singleTaskInfoCache();
        // if (hash1 !== hash2 && changeContent) {
        //     dispatch({// 显示保存
        //         type: namespace + '/saveState',
        //         payload: { saveLoading: true }
        //     });
        //     dispatch({// 修改题干信息接口 包括选项 答案 解析等 不包含图片的修改
        //         type: namespace + '/updateQuestionInfo',
        //         payload: {
        //             questionId: record.id,
        //             gradeId: wordOption.gradeId || '',
        //             optionIdStr: dealDataJoinByField(record && record.optionList ? record.optionList : null, 'id'),
        //             optionCodeStr: dealDataJoinByField(record && record.optionList ? record.optionList : null, 'code'),
        //             questionStr: changeContent,
        //             dataId: record && record.dataId ? record.dataId : (record && record.questionData && record.questionData.id ? record.questionData.id : undefined)
        //         },
        //         callback: (result = {}) => {
        //             if (result && result.code == 200) {
        //                 message.success('更新成功');
        //                 // this.setState({ editContent: '', contentChange: false });
        //                 this.replaceSearch({});
        //             } else {
        //                 Modal.warning({
        //                     title: '提示信息',
        //                     content: result.message || result.msg || '错误编码：' + result.code,
        //                 });
        //             }
        //         }
        //     });
        // }
        this.replaceSearch({});
    };

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
 * 更新题目参数
 * @param payload  ：传参
 * @param  QContent ：单个题目信息
 */
    updateQuestionParameter = (payload, QContent) => {
        // if (QContent.Sdifficulty == payload.difficulty && QContent.SknowIds == payload.knowIds) {
        //     message.success('已成功保存');
        //     return;
        // }
        const {
            dispatch,
        } = this.props;
        const wordOption = singleTaskInfoCache();
        Object.keys(payload).forEach(key => {
            if (typeof payload[key] === 'undefined') {
                delete payload[key]
            }
        });

        dispatch({// 显示保存
            type: namespace + '/saveState',
            payload: { saveLoading: true }
        });
        if (QContent.Sdifficulty != payload.difficulty) {
            dispatch({//修改题目难度 有改动就调用
                type: namespace + '/updateQuestionDifficulty',
                payload,
                callback: (result) => {
                    message.success('难度值保存成功');
                }
            });
        }

        // 2021年05月06日 数据入库新加 start
        // 分数保存-数据入库模块
        if (QContent.SquestionScore != payload.questionScore && QContent.paperId) {
            dispatch({//修改题目分数 有改动就调用
                type: namespace + '/updateQuestionScore',
                payload: {
                    questionScore: payload.questionScore,
                    questionId: payload.questionId,
                    paperId: QContent.paperId
                },
                callback: (result) => {
                    message.success('分数保存成功');
                }
            });
        }
        // 2021年05月06日 数据入库新加 end

        // if (QContent.SknowIds != payload.knowIds) {
        payload.subjectId = wordOption.subjectId;
        dispatch({// 修改参数 多个 四要素
            type: namespace + '/updateQuestionKnowle',
            payload: payload,
            callback: (result) => {
                // this.replaceSearch({})
                message.success('参数设置成功');
            }
        });
        // }
    }


    //     /**
    // * 修改题目图片
    // * @param payload  ：传参
    // */
    //     updateQuestionImage = (payload, callback) => {
    //         const {
    //             dispatch,
    //         } = this.props;
    //         let formData = new FormData();
    //         Object.keys(payload).forEach(key => {
    //             if (typeof payload[key] === 'undefined') {
    //                 delete payload[key]
    //             } else {
    //                 formData.append(key, payload[key]);
    //             }
    //         });
    //         dispatch({//修改题目图片
    //             type: namespace + '/updateQuestionImg',
    //             payload: {
    //                 formData: formData,
    //             },
    //             callback: (result) => {
    //                 callback();
    //                 message.success('图片修改保存成功');
    //                 this.replaceSearch({})
    //             }
    //         });

    //     }



    /**
* 根据id修改题目图片，包括（题材、题干、选项/小题、答案、解析） 2020年11月10日加改
* @param payload  ：传参
*/
    updateQuestionImage = (payload, callback) => {
        // const {
        //     dispatch,
        // } = this.props;
        // dispatch({//修改题目图片
        //     type: namespace + '/updateQuestionAllImgById',
        //     payload: payload,
        //     callback: (result) => {
        //         const returnJudge = window.$HandleAbnormalStateConfig(result);
        //         if (returnJudge && !returnJudge.isContinue) { return; };//如果异常 直接返回
        //         callback();
        //         message.success('图片修改保存成功');
        this.replaceSearch({})
        //     }
        // });

    }

    /**
    * 加载提示
    */
    questionLoadingTip = () => {
        const {
            dispatch,
        } = this.props;
        dispatch({// 显示加载数据中
            type: namespace + '/saveState',
            payload: { questionLoading: false }
        });
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }

    render() {
        const {
            location,
            dispatch,
            saveLoading,
            questionLoading,
            questionList,
            knowledgeList,
            keyAbilityList,//关键能力
            coreLiteracyList,//核心素养
            cognitiveLevelList,//认知层次
            knowledgeDimensionList,//知识维度
        } = this.props;
        const { pathname, search } = location;
        const query = queryString.parse(search);
        const wordOption = singleTaskInfoCache();
        const isComePage = wordOption.paperId && wordOption.comePage;
        const title = (wordOption.isSee == 2 ? '修改驳回-' : wordOption.isSee == -1 ? '设参-' : '预览-') + (isComePage ? '数据入库' : '题库管理');
        const breadcrumb = [title];
        const urls = ['/question-bank'];//上一级路由
        const header = (
            <Page.Header breadcrumb={breadcrumb} urls={urls} title={title} />
        );

        const classString = classNames(styles['Q-content'], 'gougou-content');
        const handleTableChange = (page, pageSize) => {
            this.questionLoadingTip();
            this.replaceSearch({ p: page, s: pageSize })
        };
        let questionListData = questionList && questionList.data ? questionList.data : [];
        if (wordOption.isSee == 2) {
            questionListData = questionList;
        }
        const total = questionList && questionList.total ? questionList.total : 0;
        const isEmpty = !questionListData || (Array.isArray(questionListData) && questionListData.length < 0);

        return (
            <Page header={header} loading={!questionLoading}>
                <Spin tip="正在保存,请稍候..." spinning={!!saveLoading}>
                    <div className={classString}>
                        <QuestionHeaderOption wordOption={wordOption} query={query} />

                        <div
                            className={isEmpty ? styles['question-list-empty'] : styles['question-list-box']}
                        // style={{ height: wordOption.isSee == -1 ? 'calc(100vh - 354px)' : 'calc(100vh - 305px)' }}
                        >
                            {
                                Array.isArray(questionListData) && questionListData.map((item) => {
                                    return (<QuestionItem
                                        key={item.id}
                                        location={location}
                                        QContent={item}
                                        doEditor={this.doEditor}
                                        knowledgeList={knowledgeList}
                                        updateQuestionParameter={this.updateQuestionParameter}
                                        updateQuestionImage={this.updateQuestionImage}
                                        keyAbilityList={keyAbilityList}//关键能力
                                        coreLiteracyList={coreLiteracyList}//核心素养
                                        cognitiveLevelList={cognitiveLevelList}//认知层次
                                        knowledgeDimensionList={knowledgeDimensionList}//知识维度
                                        dispatch={dispatch}
                                        comePage={isComePage ? 'uploadData' : undefined}//数据导入界面 2021年05月06日
                                    />)
                                })
                            }
                            {
                                isEmpty ? <Empty description={wordOption.isSee == 2 ? '暂无题目驳回' : '暂无数据'} /> : null
                            }
                        </div>
                        {
                            wordOption.isSee != 2 ? <div className={styles['pagination']}>
                                <Pagination
                                    {...paginationConfig(query, total, true, true)}
                                    onChange={handleTableChange}
                                    onShowSizeChange={this.onShowSizeChange}
                                    pageSizeOptions={['10', '30', '50', '100', '200']}
                                />
                            </div> : null
                        }
                        {
                            wordOption.isSee == -1 ? <div className={styles['confirm-spc']}>
                                <Button
                                    onClick={() => {
                                        this.showConfirmModal();
                                    }}
                                    style={{ marginRight: '8px' }}
                                    type="primary"
                                >确认设参完成</Button>
                            </div> : null
                        }
                        {
                            wordOption.isSee == 2 ? <div className={styles['confirm-spc']}>
                                <Button
                                    onClick={() => {
                                        this.showNextConfirmModal();
                                    }}
                                    style={{ marginRight: '8px' }}
                                    type="primary"
                                >下一步</Button>
                            </div> : null
                        }
                    </div>
                </Spin>
                {/* {
                    wordOption.isSee == -1 || wordOption.isSee == 2 ? null : <BackBtns tipText={"返回任务列表"} />
                } */}
                <BackBtns tipText={"返回任务列表"} />
            </Page>
        );
    }
}


