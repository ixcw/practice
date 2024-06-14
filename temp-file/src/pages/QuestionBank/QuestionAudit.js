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
    // Button,
    Spin,
    Pagination,
    message,
    // Modal,
    Empty
} from 'antd';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import { Select } from 'antd';
import Page from '@/components/Pages/page';
import paginationConfig from '@/utils/pagination';
import { QuestionBank as namespace } from '@/utils/namespace';
import styles from './Question.less';
import QuestionHeaderOption from "@/components/QuestionBank/QuestionHeaderOption";
import QuestionItem from "@/components/QuestionBank/QuestionItem";
import BackBtns from "@/components/BackBtns/BackBtns";
import singleTaskInfoCache from '@/caches/singleTaskInfo';
// const { confirm } = Modal;

@connect(state => ({
    saveLoading: state[namespace].saveLoading,
    questionLoading: state[namespace].questionLoading,
    questionList: state[namespace].questionList,
    knowledgeList: state[namespace].knowledgeList,
    QEMessageList: state[namespace].QEMessageList,
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
        const {
            dispatch,
        } = this.props;
        const wordOption = singleTaskInfoCache();
        if (wordOption && wordOption.isHaveRole != 1) {// 判断是否有权限进这个页面
            message.warn('无权限访问');
            dispatch(routerRedux.replace({
                pathname: '/question-bank',
            }));
            return;
        }
        this.getQuestionErrorMessage();

    }

    /**
    * 获取知识点列表
    */
    getQuestionErrorMessage = () => {
        const {
            dispatch,
        } = this.props;
        dispatch({
            type: namespace + '/getQuestionErrorMessage',
            payload: {},
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
* 驳回标记
* @param payload  ：传参
* @param  fn ：回调函数
*/
    doRejectedFlag = (payload, fn) => {
        const {
            dispatch,
            location,
        } = this.props;
        const { pathname, search } = location;
        const query = queryString.parse(search);
        const wordOption = singleTaskInfoCache();
        payload.subjectId = wordOption.subjectId;
        payload.jobId = wordOption.id;
        if (wordOption.isSee == 4) {// 再次驳回
            dispatch({
                type: namespace + '/noPassQuestion',
                payload,
                callback: (result) => {
                    message.success('已成功再次驳回');
                    fn();
                }
            });
        } else {
            dispatch({
                type: namespace + '/addErrorQuestion',
                payload,
                callback: (result) => {
                    message.success('已成功标记驳回');
                    fn();
                }
            });
        }

    }

    /**
* 取消标记
* @param payload  ：传参
* @param  fn ：回调函数
*/
    cancelRejectedFlag = (payload, fn) => {
        const {
            dispatch,
        } = this.props;
        const wordOption = singleTaskInfoCache();
        payload.jobId = wordOption.id;
        dispatch({
            type: namespace + '/cancelQuestionErro',
            payload,
            callback: (result) => {
                message.success('已成功取消标记驳回');
                fn();
            }
        });
    }

    /**
* 标记通过
* @param payload  ：传参
* @param  fn ：回调函数
*/
    passQuestion = (payload, fn) => {
        const {
            dispatch,
        } = this.props;
        const wordOption = singleTaskInfoCache();
        payload.jobId = wordOption.id;
        dispatch({
            type: namespace + '/passQuestion',
            payload,
            callback: (result) => {
                message.success('已成功标记通过');
                fn();
            }
        });
    }
    /**
* 下拉筛选
* @param value  ：4只有被标记，5默认查询全部（混合））
*/
    handleSelectScreen = (value) => {
        this.replaceSearch({ queryType: value, p: 1 })
    }
    render() {
        const {
            location,
            dispatch,
            saveLoading,
            questionLoading,
            questionList,
            QEMessageList,
        } = this.props;
        const { pathname, search } = location;
        const query = queryString.parse(search);
        const wordOption = singleTaskInfoCache() || {};
        const title = (wordOption.isSee == 3 ? '审核-' : wordOption.isSee == 4 ? '审核修驳-' : '') + '题库管理';
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
        const total = questionList && questionList.total ? questionList.total : 0;
        if (wordOption.isSee == 4) {
            questionListData = questionList;
        }
        const isEmpty = questionListData && questionListData.length > 0 ? false : true;
        const { Option } = Select;
        return (
            <Page header={header} loading={!questionLoading}>
                <Spin tip="正在保存,请稍候..." spinning={!!saveLoading}>
                    <div className={classString}>
                        <QuestionHeaderOption wordOption={wordOption} query={query}/>
                        <Select defaultValue="5" style={{ width: '100%' }} onChange={this.handleSelectScreen}>
                            <Option value="5">全部</Option>
                            <Option value="4">已标记</Option>
                        </Select>
                        <div
                            className={isEmpty ? styles['question-list-empty'] : styles['question-list-box']}
                        // style={{ height: wordOption.isSee == 4 ? 'calc(100vh - 254px)' : undefined }}
                        >
                            {
                                Array.isArray(questionListData) && questionListData.map((item) => {
                                    return (<QuestionItem
                                        key={item.id}
                                        location={location}
                                        QContent={item}
                                        // doEditor={this.doEditor}
                                        QEMessageList={QEMessageList}
                                        doRejectedFlag={this.doRejectedFlag}
                                        cancelRejectedFlag={this.cancelRejectedFlag}
                                        passQuestion={this.passQuestion}
                                    // updateQuestionParameter={this.updateQuestionParameter}
                                    />)
                                })
                            }
                            {
                                isEmpty ? <Empty description={wordOption.isSee == 4 ? '审核修驳暂无数据' : '暂无数据'} /> : null
                            }
                        </div>
                        {
                            wordOption.isSee != 4 ?
                                <div className={styles['pagination']}>
                                    <Pagination
                                        {...paginationConfig(query, total, true, true)}
                                        onChange={handleTableChange}
                                        onShowSizeChange={this.onShowSizeChange}
                                        pageSizeOptions={['10', '30', '50', '100', '200']}
                                    />
                                </div> : null
                        }
                    </div>
                </Spin>
                <BackBtns tipText={"返回任务列表"} />
            </Page>
        );
    }
}


