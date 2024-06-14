/**
 * 套题设参列表
 * @author:张江
 * @date:2021年02月03日
 * @version:v1.0.0
 * */

// eslint-disable-next-line
import React from 'react';
import { connect } from "dva";
import classNames from 'classnames';
import {
    Alert,
    Table,
    Divider,
    Tag,
    Button,
    message,
    // Select,
    Input,
    // DatePicker,
    Dropdown,
    Menu,
    Modal,
    Radio,
    Spin
} from 'antd';
import { SearchOutlined, DownOutlined, UploadOutlined } from '@ant-design/icons';
// import moment from 'moment';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import Page from '@/components/Pages/page';
import paginationConfig from '@/utils/pagination';
import { SetQuestionSetParam as namespace, QuestionBank, Auth } from '@/utils/namespace';
import { stdColumns } from '@/utils/utils';
import { setParamTypes } from '@/utils/const';

// import singleTaskInfoCache from '@/caches/singleTaskInfo';
import pageRecord from '@/caches/pageRecord';
import userInfoCache from '@/caches/userInfo';

import styles from './index.less';
const { confirm } = Modal;
const { Search } = Input;

@connect(state => ({
    loading: state[namespace].loading,
    examPaperLoading: state[namespace].examPaperLoading,
    examPaperList: state[namespace].examPaperList,
    authButtonList: state[Auth].authButtonList,//按钮权限数据
}))

export default class SetQuestionList extends React.Component {
    constructor(props) {
        super(...arguments);
        this.state = {
            keyword: '',
        };
    };

    componentDidMount() {
        this.mounted = true;
        const { dispatch, location } = this.props;
        const { search } = location;
        // const query = queryString.parse(search);

        dispatch({// 获取年级列表
            type: namespace + '/getGradeList',
            payload: {},
        });

    }

    /**
 * 页面组件即将卸载时：清空数据
 */
    componentWillUnmount() {
        this.mounted = false;
        this.setState = (state, callback) => {
            return;
        };

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
        if (obj.p) {
            pageRecord(obj.p);
        }
        //修改地址栏最新的请求参数
        dispatch(routerRedux.replace({
            pathname,
            search: queryString.stringify(query),
        }));
    };

    /**
   * 根据传入的对象，打开新页面
   * @param obj  ：参数对象
   * @param item  ：任务对象
   */
    replaceNewPage = (obj, item, pathname) => {
        const { dispatch, location } = this.props;
        const { search } = location;
        let query = queryString.parse(search);
        pageRecord(query && query.p ? query.p : 1)
        // const pathname = '/question';
        const newQuery = { ...obj };
        //修改地址栏最新的请求参数
        dispatch(routerRedux.push({
            pathname,
            search: queryString.stringify(newQuery),
        }));
    };


    /**
    * 点击检索
    */
    onSearch = (keyword) => {
        this.setState({
            keyword,
        })
        this.replaceSearch({ keyword, p: 1 })
    }

    /**
    * 状态筛选
    */
    handleStatusChange = (e) => {
        this.replaceSearch({ isParam: e.target.value, p: 1 })
    }

    /**
   * 确认弹框
   * @param payload  ：任务参数
   */
    showConfirmModal = (record) => {
        const {
            dispatch,
        } = this.props;
        let _self = this;
        confirm({
            title: '确认定版之前,请先确保所有的题目无误并且已经设参完成;否则定版之后将不可更改',
            content: '',
            onOk() {
                dispatch({// 定版
                    type: namespace + '/fixedEdition',
                    payload: {
                        jobId: record.id
                    },
                    callback: (result) => {
                        message.success(result);
                        _self.replaceSearch({})
                    }
                });
            },
            onCancel() { },
        });
    }

    /**
    * 渲染表格输入框
    * @param dataIndex ：key值
    * @param keyword ：关键字
    */
    getColumnSearchProps = (dataIndex, keyword) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8, textAlign: 'right' }}>
                {
                    keyword ? <Input
                        ref={node => {
                            this.searchInput = node;
                        }}
                        allowClear
                        placeholder='请输入试卷名称'
                        defaultValue={keyword ? keyword : ''}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                        style={{ width: 188, marginBottom: 8, }}
                    /> :
                        <Input
                            ref={node => {
                                this.searchInput = node;
                            }}
                            allowClear
                            placeholder='请输入试卷名称'
                            value={selectedKeys[0]}
                            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                            onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                            style={{ width: 188, marginBottom: 8 }}
                        />
                }

                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm)}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90, marginRight: 8, display: 'block' }}
                >
                    搜索
        </Button>
            </div>
        ),
        filterIcon: filtered => (
            < SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        render: text => (
            <div dangerouslySetInnerHTML={{ __html: keyword ? text.replace(keyword, `<span style="color: #ff4843">${keyword}</span>`) : text }}></div>
        ),
    });

    /**
    * 输入文档名称赋值并检索
    * @param selectedKeys  ：关键字
    */
    handleSearch = (selectedKeys, confirm) => {
        this.setState({
            keyword: selectedKeys[0],
        })
        this.replaceSearch({ keyword: selectedKeys[0], p: 1 })
    };

    render() {
        const {
            location,
            dispatch,
            loading,
            examPaperLoading,
            examPaperList,
            authButtonList,//按钮权限数据
        } = this.props;
        const {
            keyword,
        } = this.state
        const { pathname, search } = location;
        const query = queryString.parse(search);
        const title = '套题设参';
        const breadcrumb = [title];
        const header = (
            <Page.Header breadcrumb={breadcrumb} title={title} />
        );
        const examPaperListData = examPaperList && examPaperList.data ? examPaperList.data : null;
        const total = examPaperList && examPaperList.total ? examPaperList.total : 0;

        const userInfo = userInfoCache() || {};// 获取缓存中的用户信息
        /**
   * 权限判断处理
   * */
        const powerDeal = (name) => {
            return window.$PowerUtils.judgeButtonAuth(authButtonList, name)
        }

        const handleTableChange = (pagination, filters, sorter) => {
            let _query = { ...query };
            // eslint-disable-next-line
            filters && Object.keys(filters).map(key => {
                if (filters[key] && filters[key].length) {
                    _query[key] = filters[key].join(',');
                } else {
                    delete _query[key];
                }
            });
            // pageRecord(pagination.current)
            dispatch(routerRedux.replace({
                pathname,
                search: queryString.stringify({
                    ...query,
                    p: pagination.current,
                    s: pagination.pageSize,
                    isParam: _query.isParam ? _query.isParam : undefined,
                })
            }))
        };
        const columns = [
            {
                title: '编号',
                dataIndex: 'id',
                key: 'id',
                width: 36
            },
            {
                title: '套题名称',
                dataIndex: 'name',
                key: 'name',
                width: '40%',
                ...this.getColumnSearchProps('name', query.keyword || ''),
                // render: text => <a>{text}</a>,
            },
            {
                title: '题目数',
                dataIndex: 'number',
                key: 'number',
                width: 36,
                render: (text, record) => (
                    <span>{text}道</span>
                ),
            },
            // {
            //     title: '设参数',
            //     dataIndex: 'knowName',
            //     key: 'knowName',
            // },
            // {
            //     title: '生成时间',
            //     dataIndex: 'createTime',
            //     key: 'createTime',
            //     width: 60
            // },
            {
                title: '操作',
                key: 'action',
                width: 36,
                render: (text, record) => (// 1：未设参，2：已设参
                    <div>
                        {
                            record.isParam == 1 ? <a onClick={() => {
                                this.replaceNewPage({
                                    p: 1,
                                    isParam: 1,
                                    s: 10,
                                    paperId: record.id,
                                    name: record.name
                                }, record, '/set-question-list/set-param')
                            }}>
                                设参
                    </a> : <span 
                    // onClick={() => {
                    //                 this.replaceNewPage({
                    //                     p: 1,
                    //                     isParam: 2,
                    //                     s: 10,
                    //                     paperId: record.id,
                    //                     name: record.name
                    //                 }, record, '/set-question-list/set-param')
                    //             }} style={{ cursor: 'pointer' }}
                                >已设参</span>
                        }
                        {
                            powerDeal('相似题匹配') ?
                                <Button
                                    style={{ marginLeft: '20px' }}
                                    onClick={() => {
                                        this.replaceNewPage({
                                            id: record.id,
                                            paperName: record.name
                                        }, record, '/my-question-group/matching') }}
                                    type={'primary'}
                                >相似题匹配</Button>
                                : null
                        }
                    </div>

                ),
            },
        ];

        const classString = classNames(styles['SetQuestionList-content'], 'gougou-content');
        return (
            <Page header={header}>
                <div className={classString}>
                    <div className={styles['header-option']}>
                        <div className={styles['left']}>
                            <div>
                                <label>{userInfo.studyName}{userInfo.subjectName} </label>
                                <Radio.Group
                                    defaultValue={Number(query.isParam) || setParamTypes[0].id}
                                    allowClear
                                    onChange={this.handleStatusChange}>
                                    {
                                        setParamTypes && setParamTypes.map((item) => {
                                            return (<Radio key={item.id} value={item.id}>{item.name}</Radio>)
                                        })
                                    }
                                </Radio.Group>
                            </div>
                        </div>
                        <div className={styles['right']}>
                            <div>
                                <Search
                                    defaultValue={query.keyword}
                                    placeholder="请输入套题名称检索"
                                    enterButton="搜索"
                                    size="large"
                                    onSearch={value => this.onSearch(value)}
                                />
                            </div>

                        </div>
                    </div>
                    <div style={{ marginTop: 30 }}>
                        <Spin spinning={!examPaperLoading} tip="加载中...">
                            <Table
                                // bordered
                                pagination={paginationConfig(query, total, undefined, true)}
                                onChange={handleTableChange}
                                rowKey='id'
                                columns={stdColumns(columns)}
                                dataSource={examPaperListData}
                            />
                        </Spin>
                    </div>
                </div>
            </Page>
        );
    }
}

