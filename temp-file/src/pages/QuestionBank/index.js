/**
 * 题库管理任务列表
 * @author:张江
 * @date:2019年11月22日
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
import { QuestionBank as namespace, Auth } from '@/utils/namespace';
import { stdColumns } from '@/utils/utils';
import { qTaskStatus } from '@/utils/const';

import singleTaskInfoCache from '@/caches/singleTaskInfo';
import pageRecord from '@/caches/pageRecord';
import userInfoCache from '@/caches/userInfo';

import styles from './index.less';
import AddTaskModal from './components/AddTaskModal';
// const { RangePicker, MonthPicker } = DatePicker;
// const { Option } = Select;
const { confirm } = Modal;
const { Search } = Input;

@connect(state => ({
    loading: state[namespace].loading,
    taskLoading: state[namespace].taskLoading,
    taskList: state[namespace].taskList,
    subjectList: state[namespace].subjectList,
    gradeList: state[namespace].gradeList,
    highestKnowledgeList: state[namespace].highestKnowledgeList,// 一级知识点
    categoryList: state[namespace].categoryList,// 题型列表
    authButtonList: state[Auth].authButtonList,//按钮权限数据
}))

export default class QuestionBankList extends React.Component {
    constructor(props) {
        super(...arguments);
        this.state = {
            TaskUploadVisible: false,
            subjectCode: '',
            gradeCode: '',
            jobName: '',
            accoutName: '',
            isEdit: false,
            singleData: null,
            startDate: undefined,
            endDate: undefined,
        };
    };

    componentDidMount() {
        this.mounted = true;
        const { dispatch, location } = this.props;
        const { search } = location;
        const query = queryString.parse(search);
        this.replaceSearch({ accoutName: undefined, jobName: undefined, statusIds: undefined, p: 1, questionBankType: 1 });
        //     this.setState({
        //         startDate: query.f,
        //         endDate: query.t
        //     });
        //     if (query && query.gradeId) {
        //         this.setState({
        //             jobName: query.jobName ? query.jobName : '',
        //             accoutName: query.accoutName ? query.accoutName : ''
        //         })
        //     }

        dispatch({// 获取年级列表
            type: namespace + '/getGradeList',
            payload: {},
            // callback: (result) => {
            //     if (result && result.length > 0) {
            //         let gradeCode = query && query.gradeId ? Number(query.gradeId) : result[result.length - 1].id;
            //         this.setState({
            //             gradeCode
            //         })
            //         this.getSubject(gradeCode);
            //     }
            // }
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

    // UNSAFE_componentWillReceiveProps(nextProps) {
    //     const { location } = nextProps;
    //     const { search } = location;
    //     const query = queryString.parse(search);
    //     this.setState({
    //         startDate: query.f,
    //         endDate: query.t
    //     });
    // }

    /**
    * 根据年级id 获取科目列表
    * @param gradeId  ：年级id
    */
    // getSubject = (gradeId) => {
    //     const { dispatch, location } = this.props;
    //     const { search } = location;
    //     const query = queryString.parse(search);
    //     dispatch({
    //         type: namespace + '/getSubjectList',
    //         payload: {
    //             gradeId,
    //         },
    //         callback: (result) => {
    //             if (result && result.length > 0) {
    //                 // let subjectCode = query && query.subjectId ? Number(query.subjectId) : result[0].id;
    //                 let subjectCode = query && query.subjectId && Number(query.gradeId) == gradeId ? Number(query.subjectId) : result[0].id;
    //                 this.setState({
    //                     subjectCode
    //                 })
    //                 this.getKnowledge(subjectCode);
    //                 if (this.mounted) {
    //                     this.replaceSearch({
    //                         p: pageRecord(),
    //                         subjectId: subjectCode,
    //                         gradeId,
    //                     });
    //                 }
    //             }
    //         }
    //     });
    // }

    /**
    * 根据 科目id 年级id 获取大知识点列表
    * @param subjectId  ：科目id
    */
    // getKnowledge = (subjectId) => {
    //     const { dispatch, gradeList } = this.props;
    //     const { gradeCode } = this.state;
    //     dispatch({// 获取题型列表
    //         type: namespace + '/getCategoryList',
    //         payload: {
    //             subjectId,
    //         },
    //     });
    //     let parentId = ''
    //     for (let item of gradeList) {
    //         if (item.id == gradeCode) {
    //             parentId = item.parentId;
    //             break
    //         }
    //     }
    //     let payloadData = {
    //         subjectId,
    //         studyId: parentId,
    //         gradeId: gradeCode
    //     }
    //     dispatch({
    //         type: namespace + '/getHighestKnowledge',
    //         payload: payloadData,
    //         // callback: (result) => {
    //         //     if (result && result.length > 0) {
    //         //         let knowId = result[0].id;
    //         //         payloadData.knowId = knowId;
    //         //     }
    //         //     delete payloadData.studyId;
    //         //      this.replaceSearch(payloadData);
    //         // }
    //     });
    // }

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
        item.isSee = obj.isSee
        singleTaskInfoCache(item);
        const { dispatch, location } = this.props;
        const { search } = location;
        let query = queryString.parse(search);
        pageRecord(query && query.p ? query.p : 1)
        // const pathname = '/question';
        const newQuery = { ...obj };
        if (item && item.isHaveRole != 1 && pathname === '/question-audit-list') {// 判断是否有权限进这个页面
            message.warn('无权限访问');
            return;
        }
        //修改地址栏最新的请求参数
        dispatch(routerRedux.push({
            pathname,
            search: queryString.stringify(newQuery),
        }));
    };

    /**
    * 选择年级
    * @param gradeCode  ：年级id
    */
    // handleGradeChange = (gradeCode) => {
    //     this.setState({
    //         gradeCode,
    //     })
    //     this.getSubject(gradeCode);
    // }

    /**
    * 选择科目
    * @param subjectCode  ：科目id
    */
    // handleSubjectChange = (subjectCode) => {
    //     this.setState({
    //         subjectCode,
    //     })
    //     this.replaceSearch({ subjectId: subjectCode, knowId: '', p: 1 })
    //     this.getKnowledge(subjectCode);
    // }

    /**
    * 选择大类知识点
    * @param knowId  ：知识点id
    */
    // handleKnowledgeChange = (knowId) => {
    //     this.replaceSearch({ knowId, p: 1 })
    // }

    /**
    * 输入账号/姓名并赋值
    * @param e  ：事件对象
    */
    // handleAccountoOrNameChange = (e) => {
    //     this.setState({
    //         accoutName: e.target.value,
    //     })
    // }

    /**
    * 获取时间区间
    * @param dates  ：事件对象
    * @param dateStrings  ：显示的时间字符串数组
    */
    // onChange = (dates, dateStrings) => {
    //     const { location } = this.props
    //     const { search, pathname } = location;
    //     const query = queryString.parse(search);
    //     this.setState({
    //         startDate: dateStrings[0],
    //         endDate: dateStrings[1],
    //     })
    //     this.replaceSearch({
    //         f: dateStrings[0],
    //         t: dateStrings[1],
    //         p: 1
    //     })
    // }

    /**
    * 点击检索
    */
    // onSearch = () => {
    //     const { accoutName } = this.state;
    //     this.replaceSearch({ accoutName, p: 1 })
    // }


    /**
    * 点击检索
    */
    onSearch = (jobName) => {
        this.setState({
            jobName,
        })
        this.replaceSearch({ jobName, p: 1 })
    }

    /**
    * 状态筛选
    */
    handleStatusChange = (e) => {
        this.replaceSearch({ statusIds: e.target.value, p: 1 })
    }

    /**
  * 修改或添加(导入文档)任务
  * @param payload  ：参数对象
  */
    editOrAddTasks = (payload) => {
        const {
            dispatch,
        } = this.props;
        const {
            isEdit,
        } = this.state
        let formData = new FormData();
   //-------------------------2022/7/12--xiongwei----------------------------------
   payload.importType = 3;
    //-------------------------2022/7/12--xiongwei----------------------------------
        Object.keys(payload).forEach(key => {
            if (typeof payload[key] === 'undefined') {
                delete payload[key]
            } else if (!isEdit) {
                formData.append(key, payload[key]);
            }
        });
        if (isEdit) {
            dispatch({//修改导入任务参数
                type: namespace + '/updateWorkParam',
                payload,
                callback: (result) => {
                    this.setState({ TaskUploadVisible: false, singleData: null });
                    this.replaceSearch({})
                    message.success(result);
                }
            });
        } else {// 导入word 解析题目信息
            dispatch({
                type: namespace + '/importQuestionBank',
                payload: {
                    formData: formData,
                },
                callback: (result) => {
                    this.setState({ TaskUploadVisible: false, singleData: null });
                    this.replaceSearch({})
                    message.success('导入成功');
                }
            });
        }
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
            jobName: selectedKeys[0],
        })
        this.replaceSearch({ jobName: selectedKeys[0], p: 1 })
    };

    render() {
        const {
            location,
            dispatch,
            loading,
            taskLoading,
            taskList,
            subjectList,
            gradeList,
            highestKnowledgeList,
            categoryList,
            authButtonList,//按钮权限数据
        } = this.props;
        const {
            subjectCode,
            gradeCode,
            jobName,
            accoutName,
            TaskUploadVisible,
            isEdit,
            singleData,
            startDate,
            endDate,
        } = this.state
        const { pathname, search } = location;
        const query = queryString.parse(search);
        const title = '任务列表-题库管理';
        const breadcrumb = [title];
        const header = (
            <Page.Header breadcrumb={breadcrumb} title={title} />
        );
        const knowId = query && query.knowId ? query.knowId : '';//知识点id
        const taskListData = taskList && taskList.data ? taskList.data : null;
        const total = taskList && taskList.total ? taskList.total : 0;

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
            pageRecord(pagination.current)
            dispatch(routerRedux.replace({
                pathname,
                search: queryString.stringify({
                    ...query,
                    p: pagination.current,
                    s: pagination.pageSize,
                    statusIds: _query.status ? _query.status : undefined,
                })
            }))
        };
        const columns = [
            // {
            //     title: '编号',
            //     dataIndex: 'id',
            //     key: 'id',
            //     width: 36
            // },
            {
                title: '文档名称',
                dataIndex: 'name',
                key: 'name',
                width: '40%',
                ...this.getColumnSearchProps('name', jobName),
                // render: text => <a>{text}</a>,
            },
            {
                title: '科目',
                dataIndex: 'subjetName',
                key: 'subjetName',
                width: 36
            },
            // {
            //     title: '大知识点',
            //     dataIndex: 'knowName',
            //     key: 'knowName',
            // },
            // {
            //     title: '难度',
            //     dataIndex: 'difficulty',
            //     key: 'difficulty',
            //     width: 36
            // },
            // {
            //     title: '题型',
            //     dataIndex: 'categoryName',
            //     key: 'categoryName',
            //     width: 36
            // },
            // {
            //     title: '账号',
            //     dataIndex: 'account',
            //     key: 'account',
            // },
            // {
            //     title: '姓名',
            //     dataIndex: 'userName',
            //     key: 'userName',
            // },
            // {
            //     title: '年份',
            //     dataIndex: 'yearId',
            //     key: 'yearId',
            //     width: '36px'
            // },
            {
                title: '导入时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 60
            },
            // {
            //     title: '完成时间',
            //     dataIndex: 'completeTime',
            //     key: 'completeTime',
            //     width: 60
            // },
            {
                title: '状态',
                key: 'status',
                dataIndex: 'status',
                // filters: qTaskStatus,
                // specify the condition of filtering result
                // here is that finding the name started with `value`
                // filteredValue: query && query.statusIds ? query.statusIds.split(',') : [],
                // onFilter: (value, record) => String(record.status).indexOf(value) === 0,
                width: 36,
                render: (text, record) => (//1：未开始，2：完成,3:驳回，4修驳完成，5再次驳回，6定版
                    <span>
                        {
                            qTaskStatus.map((item) => {
                                if (item.value == text) {
                                    return (<Tag color={item.color} key={item.value}>{item.text}</Tag>)
                                }

                            })
                        }
                    </span>
                ),
            },
            {
                title: '操作',
                key: 'action',
                width: 36,
                render: (text, record) => (// 1：未开始，2：完成,3:驳回，4修驳完成，5再次驳回，6定版
                    <Dropdown overlay={
                        <Menu>

                            {
                                powerDeal('预览') ?
                                    <Menu.Item>
                                        <a onClick={() => {
                                            this.replaceNewPage({
                                                isSee: 1,
                                                jobId: record.id,
                                            }, record, '/question-list')
                                        }}>预览</a>
                                    </Menu.Item> : null
                            }

                            {//只能修改自己导的
                                (!record.status || record.status == 1) && (userInfo.account == record.account) && powerDeal('修改') &&
                                <Menu.Item>
                                    <a onClick={() => {
                                        this.setState({
                                            isEdit: true,
                                            TaskUploadVisible: true,
                                            singleData: record
                                        })
                                    }}>修改</a>
                                </Menu.Item>
                            }
                            {//只能设参自己导的
                                (!record.status || record.status == 1) && (userInfo.account == record.account) && powerDeal('设参') &&
                                <Menu.Item>
                                    <a onClick={() => {
                                        this.replaceNewPage({
                                            isSee: -1,
                                            jobId: record.id,
                                            knowId: record.knowId,
                                        }, record, '/question-list')
                                    }}>设参</a>
                                </Menu.Item>
                            }
                            {
                                (record.status != 1 && record.status != 6) && record.isHaveRole == 1 && powerDeal('审核') &&
                                <Menu.Item>
                                    <a onClick={() => {
                                        this.replaceNewPage({
                                            isSee: 3,
                                            jobId: record.id,
                                            knowId: record.knowId,
                                        }, record, '/question-audit-list')
                                    }}>审核</a>
                                </Menu.Item>
                            }
                            {
                                record.status == 4 && (record.status != 1 && record.status != 6) && record.isHaveRole == 1 && powerDeal('审核修驳') &&
                                <Menu.Item>
                                    <a onClick={() => {
                                        this.replaceNewPage({
                                            isSee: 4,
                                            jobId: record.id,
                                            knowId: record.knowId,
                                        }, record, '/question-audit-list')
                                    }}>审核修驳</a>
                                </Menu.Item>
                            }
                            {//只能修改驳回自己导的
                                (record.status == 3 || record.status == 5) && (userInfo.account == record.account) && powerDeal('修改驳回') &&
                                <Menu.Item>
                                    <a onClick={() => {
                                        this.replaceNewPage({
                                            isSee: 2,
                                            jobId: record.id,
                                            knowId: record.knowId,
                                        }, record, '/question-list')
                                    }}>修改驳回</a>
                                </Menu.Item>
                            }
                            {
                                (record.status == 2 || record.status == 4) && record.isHaveRole == 1 && powerDeal('定版') &&
                                <Menu.Item>
                                    <a onClick={() => {
                                        this.showConfirmModal(record);
                                    }}>定版</a>
                                </Menu.Item>
                            }
                        </Menu>}>
                        <a className="ant-dropdown-link">
                            操作 <DownOutlined />
                        </a>
                    </Dropdown>
                ),
            },
        ];

        const classString = classNames(styles['QBL-content'], 'gougou-content');
        return (
            <Page header={header}>
                <div className={classString}>
                    <div className={styles['header-option']}>
                        <div className={styles['left']}>
                            {/* <div>
                                <label>年级：</label>
                                <Select
                                    value={gradeCode}
                                    style={{ width: 120 }}
                                    onChange={this.handleGradeChange}>
                                    {
                                        gradeList && gradeList.map((item) => {
                                            return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                                        })
                                    }
                                </Select>
                            </div>
                            <div>
                                <label>科目：</label>
                                <Select
                                    value={subjectCode}
                                    style={{ width: 100 }}
                                    onChange={this.handleSubjectChange}>
                                    {
                                        subjectList && subjectList.map((item) => {
                                            return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                                        })
                                    }
                                </Select>
                            </div>
                            <div>
                                <label>大知识点：</label>
                                <Select
                                    value={knowId ? Number(knowId) : undefined}
                                    allowClear
                                    placeholder="请选择知识点"
                                    style={{ width: 160 }}
                                    onChange={this.handleKnowledgeChange}>
                                    {
                                        highestKnowledgeList && highestKnowledgeList.map((item) => {
                                            return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                                        })
                                    }
                                </Select>
                            </div>
                             */}
                            {/* <div>
                                <label>账号/姓名：</label>
                                <Input
                                    placeholder="请输入任务人账号/姓名"
                                    style={{ width: '200px' }}
                                    value={accoutName}
                                    onChange={this.handleAccountoOrNameChange}
                                    allowClear
                                />
                            </div> */}
                            {/* <div>
                                <label>日期：</label>
                                <RangePicker
                                    defaultValue={query.f && query.t ?
                                        [moment(query.f, 'YYYY-MM-DD'), moment(query.t, 'YYYY-MM-DD')] : []}
                                    ranges={{
                                        '今天': [moment(), moment()],
                                        '本周': [moment().startOf('week'), moment().endOf('week')],
                                        '本月': [moment().startOf('month'), moment().endOf('month')
                                        ]
                                    }}
                                    onChange={this.onChange} />
                            </div> */}
                            {/* {
                                 powerDeal('搜索') ?
                                    <Button
                                        icon={<SearchOutlined />}
                                        style={{ marginTop: '10px' }}
                                        onClick={() => { this.onSearch() }}
                                    >搜索</Button> : null
                            } */}

                            <div>
                                <label>状态：</label>
                                <Radio.Group
                                    defaultValue={0}
                                    allowClear
                                    onChange={this.handleStatusChange}>
                                    {
                                        qTaskStatus && qTaskStatus.map((item) => {
                                            return (<Radio key={item.value} value={item.value}>{item.text}</Radio>)
                                        })
                                    }
                                </Radio.Group>
                            </div>
                        </div>
                        <div className={styles['right']}>
                            <div>
                                <Search
                                    defaultValue={jobName}
                                    placeholder="请输入文档关键字"
                                    enterButton="搜索"
                                    size="large"
                                    onSearch={value => this.onSearch(value)}
                                />
                            </div>
                            {
                                powerDeal('导入') ? <Button size="large"
                                    type="primary"
                                    icon={<UploadOutlined />}
                                    onClick={() => {
                                        this.setState({ TaskUploadVisible: true, isEdit: false, })
                                    }}
                                >导入题目</Button> : null
                            }

                        </div>
                    </div>
                    <div style={{ marginTop: 30 }}>
                        {
                            TaskUploadVisible ? <AddTaskModal
                                visible={TaskUploadVisible}
                                item={singleData}
                                isEdit={isEdit}
                                location={location}
                                onCancel={() => this.setState({ TaskUploadVisible: false, item: null })}
                                onOk={(payload) => {
                                    this.editOrAddTasks(payload);//修改或添加(导入文档)任务
                                }}
                            /> : null
                        }
                        <Spin spinning={!taskLoading} tip="加载中...">
                            <Table
                                // bordered
                                pagination={paginationConfig(query, total, undefined, true)}
                                onChange={handleTableChange}
                                rowKey='id'
                                columns={stdColumns(columns)}
                                dataSource={taskListData}
                            />
                        </Spin>

                    </div>
                </div>
            </Page>
        );
    }
}

