/**
 * 套题下 题目列表设参
 * @author:张江
 * @date:2021年02月04日
 * @version:v1.0.1
 * @updateTime :2022年05月20日
 * @updateDescription :添加添加知识维度
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
import { SetQuestionSetParam as namespace, Auth, QuestionBank } from '@/utils/namespace';
import styles from '../index.less';
import QuestionItem from "@/components/QuestionBank/QuestionItem";
import BackBtns from "@/components/BackBtns/BackBtns";
import KnowledgeList from "@/components/KnowledgeList/KnowledgeList";
import { queryParamIsChange, existArr } from "@/utils/utils";
import { setParamTypes } from "@/utils/const"

import userInfoCache from '@/caches/userInfo';
const { confirm } = Modal;
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

    // statisticalParam: state[namespace].statisticalParam,//设参量统计
    // statisticalVideo: state[namespace].statisticalVideo,//微课上传量统计
    // statisticsLoading: state[namespace].statisticsLoading,//统计加载中
    // jobKnowList: state[namespace].jobKnowList,//左侧知识点列表
    determineLoading: state[namespace].determineLoading,//完成设参加载中
    knowledgeDimensionList: state[QuestionBank].knowledgeDimensionList,//知识维度

}))

export default class CommissionerSetParam extends React.Component {
    constructor(props) {
        super(...arguments);
        this.state = {
            editContent: '',
            contentChange: false,

            isParam: 1,
            knowIds: '',
        };
    };

    UNSAFE_componentWillMount() {
        const userInfo = userInfoCache() || {};
        if (userInfo && userInfo.subjectId) {
            this.getFourElementsList(userInfo.subjectId)
        }
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
                isParam: query.isParam
            })
            /** ********************************************************* 四要素设参 核心素养 关键能力 认知层次 start author:张江 date:2021年02月05日 *************************************************************************/
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
            /** ********************************************************* 四要素设参 核心素养 关键能力 认知层次 end author:张江 date:2021年02月05日 *************************************************************************/
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
            content: '本次确认设参完成将不得进行修改，请确保所填参数无误！！！',
            onOk() {
                
                dispatch({// 显示保存
                    type: namespace + '/saveState',
                    payload: { determineLoading: true }
                });
                dispatch({//// 完成任务
                    type: namespace + '/determineExamPaperQuestion',
                    payload: {
                        id: query.paperId
                    },
                    callback: (result) => {
                        const returnJudge = window.$HandleAbnormalStateConfig(result);
                        if (returnJudge && !returnJudge.isContinue) { return; };//如果异常 直接返回
                        message.success('完成设参成功')
                        //路由回退
                        window.history.go(-1);
                    }
                });
            },
            onCancel() { },
        });
    }


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
        if (queryParamIsChange(query, newQuery, ["isParam", "p", "s", 'paperId'])) {
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
        // const { knowIds } = this.state
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
                message.success('参数设置成功');
            }
        });
        // }
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
    }


    /**
* 获取选择的参数
* @param  selectInfo ：选择参数对象
*/
    // getSelectedParam = (selectInfo) => {
    //     const {
    //         location,
    //         dispatch,
    //     } = this.props;
    //     const { pathname, search } = location;
    //     const query = queryString.parse(search) || {};
    //     const questionType = query.questionType || 1;
    //     if (selectInfo && existArr(selectInfo.knowledgeList)) {
    //         // this.getStatistics(selectInfo.subjectId, this.dealKnowledgeIds(selectInfo.knowledgeList));
    //         this.getFourElementsList(selectInfo.subjectId)
    //     } else {
    //         dispatch({
    //             type: namespace + '/saveState',
    //             payload: { statisticsLoading: true }
    //         });
    //     }
    //     if (!selectInfo.knowledgeId || selectInfo.knowledgeId == query.knowledgeId) {
    //         return;
    //     }
    //     this.setState({ questionType }, () => {
    //         if (selectInfo.subjectId) {
    //             this.replaceSearch({ knowledgeId: selectInfo.knowledgeId, questionType, subjectId: selectInfo.subjectId, keyword: query.keyword || '', p: '1' })
    //         } else {
    //             this.replaceSearch({ knowledgeId: selectInfo.knowledgeId, questionType, keyword: query.keyword || '', p: '1' })
    //         }
    //     })
    // }

    /**
    * 处理知识点id
    * @param knowledgeList：知识点列表
    * @return String;
    */
    // dealKnowledgeIds = (knowledgeList = []) => {
    //     let knowledgeIds = []
    //     if (existArr(knowledgeList)) {
    //         knowledgeIds = knowledgeList.map((item) => {
    //             return item.id;
    //         })
    //     }
    //     return knowledgeIds.join(',')
    // }

    /**
 * 切换类型
 * @param e：触发事件的对象
 */
    toggleType = (e) => {
        let isParam = e.target.value;
        this.setState({ isParam }, () => {
            this.replaceSearch({ isParam, p: '1' })
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
        //         questionList: [],
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
            determineLoading
        } = this.props;
        const { pathname, search } = location;
        const query = queryString.parse(search) || {};
        const title = '套题:' + (query.name || '') + '设参';
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

        return (
            <Page header={header} loading={!questionLoading}>
                <Spin spinning={!!determineLoading} tip="正在确认中,请稍候...">
                <div className={classString}>
                    <div className={styles['setParam-box']}>
                        <div className={styles['setParam-question-list']} style={{ padding: '0px' }}>
                            <Affix offsetTop={116}>
                                {
                                    query.name ? <div className={styles['setquestion-title']}>{query.name || ''}</div> : null
                                }

                                <div className={styles.tabBar} style={{ paddingTop: '10px' }}>
                                    <Radio.Group style={{ width: '60%' }}
                                        value={String(query.isParam)}
                                        onChange={this.toggleType}>
                                        {
                                            setParamTypes && setParamTypes.map((item) => {
                                                return (<Radio key={item.id} value={String(item.id)}>{item.name}</Radio>)
                                            })
                                        }
                                    </Radio.Group>
                                    {/* <Search
                                        defaultValue={query.keyword}
                                        style={{ width: '32%' }}
                                        placeholder="请输入题号检索"
                                        enterButton="搜索"
                                        size="large"
                                        onSearch={value => this.onSearch(value)}
                                    /> */}
                                </div>
                            </Affix>
                            <div
                                className={isEmpty ? styles['question-list-empty'] : styles['question-list-box']}
                                style={{ padding: '0px' }}
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
                                                        isSaveParam: isClick('保存参数'),// && (!item.abilityIds)
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
                            <div className={styles['confirm-spc']}>
                                <Button
                                    onClick={() => {
                                        this.showConfirmModal();
                                    }}
                                    style={{ marginRight: '8px' }}
                                    type="primary"
                                >确认设参完成</Button>
                            </div>
                        </div>
                    </div>
                </div>
                </Spin>
                <BackBtns tipText={"返回"} />
            </Page>
        );
    }
}


