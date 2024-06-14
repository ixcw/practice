/**
 * 专员设参与上传微课
 * @author:张江
 * @date:2020年11月25日
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
    Empty,
    Radio,
    Input,
    Affix
} from 'antd';
import queryString from 'query-string';
import crypto from 'crypto';
import { routerRedux } from 'dva/router';
import Page from '@/components/Pages/page';
import paginationConfig from '@/utils/pagination';
import { CommissionerSetParam as namespace, Auth, QuestionBank } from '@/utils/namespace';
import styles from '../index.less';
import QuestionItem from "@/components/QuestionBank/QuestionItem";
import BackBtns from "@/components/BackBtns/BackBtns";
import KnowledgeList from "@/components/KnowledgeList/KnowledgeList";
import { queryParamIsChange, existArr } from "@/utils/utils";
import { setParamScreeningType } from "@/utils/const"

import userInfoCache from '@/caches/userInfo';
// const { confirm } = Modal;
const { Search } = Input;

@connect(state => ({
    saveLoading: state[QuestionBank].saveLoading,
    questionLoading: state[namespace].questionLoading,//显示加载中
    questionList: state[namespace].questionList,//题库列表
    knowledgeList: state[QuestionBank].knowledgeList,
    keyAbilityList: state[QuestionBank].keyAbilityList,//关键能力
    coreLiteracyList: state[QuestionBank].coreLiteracyList,//核心素养
    cognitiveLevelList: state[QuestionBank].cognitiveLevelList,//认知层次
    authButtonList: state[Auth].authButtonList,//按钮权限数据

    statisticalParam: state[namespace].statisticalParam,//设参量统计
    statisticalVideo: state[namespace].statisticalVideo,//微课上传量统计
    statisticsLoading: state[namespace].statisticsLoading,//统计加载中
    jobKnowList: state[namespace].jobKnowList,//左侧知识点列表

    knowledgeDimensionList: state[QuestionBank].knowledgeDimensionList,//知识维度
}))

export default class CommissionerSetParam extends React.Component {
    constructor(props) {
        super(...arguments);
        this.state = {
            editContent: '',
            contentChange: false,

            questionType: 1,
            knowIds: '',
        };
    };

    UNSAFE_componentWillMount() {
        const { knowIds } = this.state;
        const { jobKnowList } = this.props;
        if (knowIds || !jobKnowList) return;
        this.setState({
            knowIds: this.dealKnowledgeIds(jobKnowList),
        })
    }

    /**
    * 获取四要素列表
    */
    getFourElementsList = (subjectId) => {
        const {
            location,
            dispatch,
            keyAbilityList
        } = this.props;
        const { pathname, search } = location;
        const query = queryString.parse(search);
        if (query) {
            this.setState({
                questionType: query.questionType
            })
            if (query.knowledgeId && existArr(keyAbilityList)) {
                return;
            }
            /** ********************************************************* 四要素设参 核心素养 关键能力 认知层次 start author:张江 date:2020年11月27日 *************************************************************************/
            //根据科目筛选关键能力
            dispatch({
                type: QuestionBank + '/getQuestionAbilityList',
                payload: {
                    subjectId: subjectId,
                },
            });
            //根据科目筛选核心素养
            dispatch({
                type: QuestionBank + '/getQuestionCompetenceList',
                payload: {
                    subjectId: subjectId,
                },
            });
            //根据科目筛选认知层次
            dispatch({
                type: QuestionBank + '/getCognitionLevelList',
                payload: {
                    subjectId: subjectId,
                },
            });
            /** ********************************************************* 四要素设参 核心素养 关键能力 认知层次 end author:张江 date:2020年11月27日 *************************************************************************/
            
            /** ********************************************************* 题库管理 知识维度查询 start author:张江 date:2022年05月20日 *************************************************************************/
            //知识维度查询
                dispatch({
                    type: QuestionBank + '/getKnowledgeDimension',
                    payload: {},
                });
           /** ********************************************************* 题库管理 知识维度查询 end author:张江 date:2022年05月10日 *************************************************************************/

        }
    }

    /**
* 获取统计信息
*/
    getStatistics = (subjectId, knowIds) => {
        const {
            dispatch,
        } = this.props;
        dispatch({// 显示加载数据中
            type: namespace + '/saveState',
            payload: { statisticsLoading: false }
        });
        this.setState({
            knowIds
        })
        //统计设参总量
        dispatch({
            type: namespace + '/countUserKnowJob',
            payload: {
                subjectId: subjectId,
                knowIds,
            },
        });
        //统计微课上传量
        dispatch({
            type: namespace + '/countUserKnowJobVideo',
            payload: {
                subjectId: subjectId,
                knowIds,
            },
        });
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
    // showConfirmModal = () => {
    //     const {
    //         location,
    //         dispatch,
    //     } = this.props;
    //     const { pathname, search } = location;
    //     const query = queryString.parse(search);
    //     confirm({
    //         title: '确认完成设参提醒',
    //         content: '本次确认设参完成将不得再进行修改，请先确保所填参数及题目无误，确认之后将流转到下一步:审核中',
    //         onOk() {
    //             dispatch({//// 完成任务
    //                 type: namespace + '/completeJob',
    //                 payload: {
    //                     jobId: query.jobId
    //                 },
    //                 callback: (result) => {
    //                     message.success('完成设参成功')
    //                     // dispatch(routerRedux.replace({
    //                     //     pathname: '/question-bank',
    //                     // }));
    //                     //路由回退
    //                     window.history.go(-1);
    //                 }
    //             });
    //         },
    //         onCancel() { },
    //     });
    // }

    /**
  * 下一步确认弹框
  */
    // showNextConfirmModal = () => {
    //     const {
    //         location,
    //         dispatch,
    //     } = this.props;
    //     const { pathname, search } = location;
    //     const query = queryString.parse(search);
    //     confirm({
    //         title: '流转提醒',
    //         content: '确认已经根据错误类型及驳回说明完成驳回修改,确认是否流转到下一步:审核修驳',
    //         onOk() {
    //             dispatch({ // 完成任务
    //                 type: namespace + '/updateErrorQuestionStatus',
    //                 payload: {
    //                     jobId: query.jobId
    //                 },
    //                 callback: (result) => {
    //                     message.success('已成功流转到下一步:审核修驳')
    //                     // dispatch(routerRedux.replace({
    //                     //     pathname: '/question-bank',
    //                     // }));
    //                     //路由回退
    //                     window.history.go(-1);
    //                 }
    //             });
    //         },
    //         onCancel() { },
    //     });
    // }

    /**
    * makdown编辑
    * @param content  ：编辑的内容
    * @param record  ：其他参数
    */
    // doEditor = (newContent, content, record) => {
    //     const { dispatch } = this.props;
    //     const secret = 'md5';
    //     // const { contentChange, editContent } = this.state
    //     const changeContent = newContent;
    //     const hash1 = crypto.createHmac('sha256', secret).update(content).digest('hex');
    //     const hash2 = crypto.createHmac('sha256', secret).update(changeContent).digest('hex');
    //     const wordOption = singleTaskInfoCache();
    //     if (hash1 !== hash2 && changeContent) {
    //         dispatch({// 显示保存
    //             type: QuestionBank + '/saveState',
    //             payload: { saveLoading: true }
    //         });
    //         dispatch({// 修改题干信息接口 包括选项 答案 解析等 不包含图片的修改
    //             type: QuestionBank + '/updateQuestionInfo',
    //             payload: {
    //                 questionId: record.id,
    //                 gradeId: wordOption.gradeId || '',
    //                 optionIdStr: dealDataJoinByField(record && record.optionList ? record.optionList : null, 'id'),
    //                 optionCodeStr: dealDataJoinByField(record && record.optionList ? record.optionList : null, 'code'),
    //                 questionStr: changeContent,
    //                 dataId: record && record.dataId ? record.dataId : (record && record.questionData && record.questionData.id ? record.questionData.id : undefined)
    //             },
    //             callback: (result = {}) => {
    //                 if (result && result.code == 200) {
    //                     message.success('更新成功');
    //                     // this.setState({ editContent: '', contentChange: false });
    //                     this.replaceSearch({});
    //                 } else {
    //                     Modal.warning({
    //                         title: '提示信息',
    //                         content: result.message || result.msg || '错误编码：' + result.code,
    //                     });
    //                 }
    //             }
    //         });
    //     }
    // };

    /**
* 根据传入的对象，往地址栏添加对应的参数
* @param obj  ：参数对象
*/
    replaceSearch = (obj) => {
        const { dispatch, location } = this.props;
        const { search, pathname } = location;
        const query = queryString.parse(search) || {};
        if (!query.s) {
            obj.s = 10;
        }
        const newQuery = { ...query, ...obj };
        if (queryParamIsChange(query, newQuery, ["questionType", "p", "s", 'knowledgeId', 'keyword'])) {
            dispatch({// 设置加载中
                type: namespace + '/saveState',
                payload: { questionLoading: false, questionList: undefined, }
            });
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })
            //修改地址栏最新的请求参数
            dispatch(routerRedux.replace({
                pathname,
                search: queryString.stringify(newQuery),
            }));
        }
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
            location,
        } = this.props;
        const { search, pathname } = location;
        const query = queryString.parse(search) || {};
        const { knowIds } = this.state
        Object.keys(payload).forEach(key => {
            if (typeof payload[key] === 'undefined') {
                delete payload[key]
            }
        });

        dispatch({// 显示保存
            type: QuestionBank + '/saveState',
            payload: { saveLoading: true }
        });
        // if (QContent.Sdifficulty != payload.difficulty) {
        //     dispatch({//修改题目难度 有改动就调用
        //         type: namespace + '/updateQuestionDifficulty',
        //         payload,
        //         callback: (result) => {
        //             message.success('难度值保存成功');
        //         }
        //     });
        // }
        // if (QContent.SknowIds != payload.knowIds) {
        payload.subjectId = QContent.subjectId;
        dispatch({// 修改参数 多个 四要素
            type: QuestionBank + '/updateQuestionKnowle',
            payload: payload,
            callback: (result) => {
                // dispatch({// 显示加载
                //     type: namespace + '/saveState',
                //     payload: { questionLoading: false }
                // });
                // dispatch({//获取题目列表
                //     type: namespace + '/getUserKnowJobQuestionList',
                //     payload: {
                //         subjectId: query.subjectId,
                //         page: query.p || 1,
                //         size: query.s || 10,
                //         questionIds: query.keyword,
                //         knowIds: query.knowledgeId,
                //         isSetParam: query.questionType
                //     }
                // });
                this.getStatistics(QContent.subjectId, knowIds);
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
    // updateQuestionImage = (payload, callback) => {
    //     const {
    //         dispatch,
    //     } = this.props;
    //     dispatch({//修改题目图片
    //         type: QuestionBank + '/updateQuestionAllImgById',
    //         payload: payload,
    //         callback: (result) => {
    //             const returnJudge = window.$HandleAbnormalStateConfig(result);
    //             if (returnJudge && !returnJudge.isContinue) { return; };//如果异常 直接返回
    //             callback();
    //             message.success('图片修改保存成功');
    //             this.replaceSearch({})
    //         }
    //     });

    // }

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
    }


    /**
* 获取选择的参数
* @param  selectInfo ：选择参数对象
*/
    getSelectedParam = (selectInfo) => {
        const {
            location,
            dispatch,
        } = this.props;
        const { pathname, search } = location;
        const query = queryString.parse(search) || {};
        const questionType = query.questionType || 1;
        if (selectInfo && existArr(selectInfo.knowledgeList)) {
            this.getStatistics(selectInfo.subjectId, this.dealKnowledgeIds(selectInfo.knowledgeList));
            this.getFourElementsList(selectInfo.subjectId)
        } else {
            dispatch({
                type: namespace + '/saveState',
                payload: { statisticsLoading: true }
            });
        }
        if (!selectInfo.knowledgeId || selectInfo.knowledgeId == query.knowledgeId) {
            return;
        }
        this.setState({ questionType }, () => {
            if (selectInfo.subjectId) {
                this.replaceSearch({ knowledgeId: selectInfo.knowledgeId, questionType, subjectId: selectInfo.subjectId, keyword: query.keyword || '', p: '1' })
            } else {
                this.replaceSearch({ knowledgeId: selectInfo.knowledgeId, questionType, keyword: query.keyword || '', p: '1' })
            }
        })
    }

    /**
    * 处理知识点id
    * @param knowledgeList：知识点列表
    * @return String;
    */
    dealKnowledgeIds = (knowledgeList = []) => {
        let knowledgeIds = []
        if (existArr(knowledgeList)) {
            knowledgeIds = knowledgeList.map((item) => {
                return item.id;
            })
        }
        return knowledgeIds.join(',')
    }

    /**
 * 切换类型
 * @param e：触发事件的对象
 */
    toggleType = (e) => {
        let questionType = e.target.value;
        this.setState({ questionType }, () => {
            this.replaceSearch({ questionType, p: '1' })
        })
    }

    /**
* 点击检索
*/
    onSearch = (keyword) => {
        this.setState({
            keyword,
        })
        this.replaceSearch({ keyword, p: '1' })
    }


    /**
* 页面组件即将卸载时：清空数据
*/
    componentWillUnmount() {
        // const { dispatch } = this.props;
        // dispatch({
        //     type: namespace + '/saveState',
        //     payload: {
        //         questionList: undefined,
        //         questionLoading: false,
        //     },
        // });
        this.setState = (state, callback) => {
            return;
        };
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
            authButtonList,

            statisticalParam = {},
            statisticalVideo = {},
            statisticsLoading
        } = this.props;
        const { knowIds } = this.state
        const { pathname, search } = location;
        const query = queryString.parse(search) || {};
        const title = '四要素设参';
        const breadcrumb = [title];
        const header = (
            <Page.Header breadcrumb={breadcrumb} title={title} />
        );

        const classString = classNames(styles['Q-content'], 'gougou-content');
        const handleTableChange = (page, pageSize) => {
            this.questionLoadingTip();
            this.replaceSearch({ p: String(page), s: pageSize })
        };
        let questionListData = questionList && questionList.data ? questionList.data : [];
        const total = questionList && questionList.total ? questionList.total : 0;
        const isEmpty = !questionListData || (Array.isArray(questionListData) && !(questionListData.length > 0));


        /**
  * 是否有按钮权限
  * */
        const isClick = (name) => {
            return window.$PowerUtils.judgeButtonAuth(authButtonList, name)
        }

        /**
    * 渲染顶部统计item
    * */
        const renderStatistical = (item) => {
            return (<div key={item.name} className={item.isTotal ? styles['total'] : ''}>
                <h4>{item.name}</h4>
                <Spin tip="加载中..." spinning={!statisticsLoading}>
                    <span>{item.number + item.unit}</span>
                </Spin>
            </div>)
        }

        return (
            <Page header={header} loading={!questionLoading}>
                <div className={classString}>

                    <div className={styles['setParam-top-statistical']}>
                        <div>
                            {[
                                { isTotal: true, name: '总设参题数', number: statisticalParam.paramTotal || 0, unit: '道' },
                                { isTotal: false, name: '已设参题数', number: statisticalParam.haveParam || 0, unit: '道' },
                                { isTotal: false, name: '未设参题数', number: statisticalParam.notSetParam || 0, unit: '道' }
                            ].map((item) => {
                                return renderStatistical(item);
                            })}
                        </div>
                        <div>
                            {[
                                { isTotal: true, name: '总微课上传题数', number: statisticalVideo.total || 0, unit: '道' },
                                { isTotal: false, name: '已上传微课数', number: statisticalVideo.setNum || 0, unit: '个' },
                                // { isTotal: false, name: '未上传题数', number: statisticalVideo.notNum || 0, unit: '道' }
                            ].map((item) => {
                                return renderStatistical(item);
                            })}
                        </div>
                    </div>

                    <div className={styles['setParam-box']}>
                        <Affix offsetTop={120}>
                            <KnowledgeList
                                location={location}
                                getSelectedParam={this.getSelectedParam}
                                comePage={'setParam'}
                                heightObject={{
                                    warpHeight: (document.body.clientHeight - 520) + 'px',
                                    listHeight: (document.body.clientHeight - 340) + 'px'
                                }}
                            />
                        </Affix>
                        <div className={styles['setParam-question-list']}>
                            {
                                knowIds ? <Affix offsetTop={116}>
                                    <div className={styles.tabBar}>
                                        <Radio.Group style={{ width: '60%' }}
                                            value={String(query.questionType)}
                                            onChange={this.toggleType}>
                                            {
                                                setParamScreeningType.map((item) => {
                                                    return (<Radio key={item.code} value={String(item.code)}>{item.name}</Radio>)
                                                })
                                            }
                                        </Radio.Group>
                                        <Search
                                            defaultValue={query.keyword}
                                            style={{ width: '32%' }}
                                            placeholder="请输入题号检索"
                                            enterButton="搜索"
                                            size="large"
                                            onSearch={value => this.onSearch(value)}
                                        />
                                    </div>
                                </Affix> : null
                            }
                            <div
                                className={isEmpty ? styles['question-list-empty'] : styles['question-list-box']}
                            >
                                {
                                    Array.isArray(questionListData) && questionListData.map((item, index) => {
                                        item.serialCode = index + 1;
                                        return (
                                            <Spin tip="正在保存,请稍候..." key={item.id} spinning={!!saveLoading}>
                                                <QuestionItem
                                                    key={item.id}
                                                    location={location}
                                                    QContent={item}
                                                    // doEditor={this.doEditor}
                                                    knowledgeList={knowledgeList || []}
                                                    updateQuestionParameter={this.updateQuestionParameter}
                                                    // updateQuestionImage={this.updateQuestionImage}
                                                    keyAbilityList={keyAbilityList}//关键能力
                                                    coreLiteracyList={coreLiteracyList}//核心素养
                                                    cognitiveLevelList={cognitiveLevelList}//认知层次
                                                    knowledgeDimensionList={knowledgeDimensionList}//知识维度
                                                    dispatch={dispatch}
                                                    comePage={'setParam'}
                                                    buttonAuth={{
                                                        isUpload: isClick('上传微课'),
                                                        isSaveParam: isClick('保存参数')
                                                    }}
                                                />
                                            </Spin>)
                                    })
                                }
                                {
                                    isEmpty ? <Empty description={'暂无题目数据'} /> : null
                                }
                            </div>
                            {
                                isEmpty ? null : <div className={styles['pagination']}>
                                    <Pagination
                                        {...paginationConfig(query, total, true, true)}
                                        onChange={handleTableChange}
                                        onShowSizeChange={this.onShowSizeChange}
                                        pageSizeOptions={['10', '30', '50']}
                                    />
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <BackBtns tipText={"返回"} isBack={false} />
            </Page>
        );
    }
}


