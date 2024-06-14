/**
 * 个人中心-我的收藏-试卷
 * @author:熊伟
 * @date:2020年8月22日
 * @version:v1.0.0
 * */
import React from 'react';
import { connect } from 'dva';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import styles from './questionList.less';
import { Pagination, Spin, Empty, Button, message } from 'antd';
import RenderMaterialAndQuestion from "@/components/RenderMaterialAndQuestion/index";//渲染题目材料以及题目或者题目
import { PersonalCenter as namespace } from '@/utils/namespace';
import { collectionType } from '@/utils/const';
import TopicContent from "@/components/TopicContent/TopicContent";
@connect(state => ({
    questionCollect: state[namespace].questionCollect,
    myCollectLoading: state[namespace].myCollectLoading,
}))
export default class QuestionList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkId: undefined,//查看ID
            umfoldId: undefined,//展开ID
            umfold: false,//是否展开
            isShowAnswerAnalysis: false,//是否显示答案
        }
    }
    clickCancelCollect = (id, subjectId) => {
        const { dispatch, location } = this.props;
        const { search } = location;
        const query = queryString.parse(search);
        dispatch({
            type: namespace + '/removeCollection',
            payload: {
                type: collectionType.QUESTION.type,
                subjectId,
                itemId: id
            },
            callback: (result) => {
                message.success('取消收藏成功！');
                dispatch({
                    type: namespace + '/saveState',
                    payload: {
                        myCollectLoading: false
                    }
                })
                dispatch({
                    type: namespace + '/pageListQuestion',
                    payload: {
                        queryType: 0,
                        page: query.p || 1,
                        size: query.s || 10,
                        subjectId: query.subjectId || null,
                    }
                })
            }
        })
    }
    clickAddPaper = (id, category, subjectId) => {
        const { dispatch } = this.props;
        dispatch({
            type: namespace + '/saveOptionQuestion',
            payload: {
                questionId: id,
                questionCategory: category,
                subjectId
            },
            callback: (result) => {
                if (!result) {
                    message.success('加入成功')
                }
            }
        })
    }
    //隐藏和显示答案
    showOrHiddenAnswer = (id, isShowAnswerAnalysis) => {
        if (id == this.state.checkId) {
            this.setState({
                isShowAnswerAnalysis: !isShowAnswerAnalysis,
                umfold: !isShowAnswerAnalysis,
                checkId: id,
            })
        } else {
            this.setState({
                checkId: id,
                isShowAnswerAnalysis: true,
                umfold: true,
            })
        }
    }
    //展开
    clickCheckAll = (id) => {
        if (id == this.state.checkId) {
            this.setState({
                checkId: id,
                umfold: !this.state.umfold
            })
        } else {
            this.setState({
                checkId: id,
                umfold: true
            })
        }

    }
    //点击切换页码
    pageChange = (page, pageSize) => {
        const { dispatch, location, pathname } = this.props;
        const { search } = location;
        const query = queryString.parse(search);
        dispatch(routerRedux.push({
            pathname,
            search: queryString.stringify({ ...query, p: page, s: pageSize })
        }));
    }
    componentDidMount() {

    }
    render() {
        const { checkId, umfold, isShowAnswerAnalysis } = this.state;
        const { questionCollect, myCollectLoading, userInfo = {}, dispatch, location } = this.props;
        const { search } = location;
        const query = queryString.parse(search);
        return (
            <div className={styles['topic']}>
                <Spin spinning={!myCollectLoading}>
                    {
                      questionCollect && questionCollect.data && questionCollect.data.map((item, index) => {
                            return (
                                <div className={styles['topic-main']} key={item.id}>
                                    <div className={styles['topic-head']}>
                                        <div className={styles['topic-head-left']}>
                                            <p>难度：{item.difficulty}</p>
                                            <p>知识点：{item.knowName}</p>
                                        </div>
                                        <div className={styles['topic-head-right']}>
                                            <p><a onClick={() => { this.clickCancelCollect(item.questionId, item.subjectId) }}>取消收藏</a></p>
                                            {
                                                userInfo.code === 'TEACHER' && userInfo.subjectId == item.subjectId ?
                                                    <p><a onClick={() => { this.clickAddPaper(item.questionId, item.category, item.subjectId) }}>加入试题板</a></p>
                                                    : null
                                            }
                                        </div>
                                    </div>
                                    <div className={styles['topic-content']} style={{ height: checkId != item.id ? '85px' : umfold ? '' : '85px' }}>
                                        {/* {content} */}
                                        {
                                            RenderMaterialAndQuestion(item, checkId != item.id ? false : isShowAnswerAnalysis ? true : false, (RAQItem) => {
                                                return (
                                                    <TopicContent topicContent={RAQItem} contentFiledName={'content'}
                                                        optionsFiledName={"optionList"} optionIdFiledName={"code"} />
                                                )
                                            })
                                        }
                                        {/* {checkId != item.id ? null : isShowAnswerAnalysis ? renderAnswerAnalysis(item, 1) : null} */}
                                    </div>
                                    <div className={styles['topic-bottom']}>
                                        <p>
                                            <a onClick={() => { this.showOrHiddenAnswer(item.id, isShowAnswerAnalysis) }}>
                                                {checkId != item.id ? '答案和解析' : isShowAnswerAnalysis ? '隐藏答案和解析' : '答案和解析'}
                                            </a>
                                        </p>
                                        <p><a onClick={() => { this.clickCheckAll(item.id) }}>{checkId != item.id ? '展开' : umfold ? '收起' : '展开'}</a></p>
                                    </div>
                                </div>
                            )
                        })
                    }
                    {
                      questionCollect && !questionCollect.data ?
                            <Empty description={"您还没有收藏题目，请添加收藏"} /> : null
                    }
                    <div className={styles['content-pagination']}>
                        <Pagination
                            defaultCurrent={query.p ? query.p : 1}
                            total={questionCollect && questionCollect.total}
                            pageSize={query.s ? query.s : 10}
                            onChange={this.pageChange}
                            style={{ marginTop: '20px' }}
                        />
                    </div>
                </Spin>
            </div>
        )
    }
}
