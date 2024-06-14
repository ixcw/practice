/**
 * 消息通知
 * @author:熊伟
 * @date:2022年4月26日
 * @version:v1.0.0
 * */
import React from 'react';
import { connect } from 'dva';
import { SchoolNoticeHistory as namespace } from '@/utils/namespace';
import { dealTimestamp } from '@/utils/utils';
import { notification, Table, Space, Button, Modal } from 'antd'
import paginationConfig from '@/utils/pagination';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import styles from './index.less';
const { confirm } = Modal;
@connect(state => ({
    loading: state[namespace].tableLoading,
    schoolMessage: state[namespace].schoolMessage,//通知列表
    checkSchoolMessage: state[namespace].checkSchoolMessage,
}))
export default class SchoolNoticeHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            visible: false
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
        // this.uploadUserExcelModalCancel();
        //修改地址栏最新的请求参数
        dispatch(routerRedux.replace({
            pathname,
            search: queryString.stringify(query),
        }));
    };
    // 跳转
    routerJump = (id) => {
        const { dispatch, location } = this.props;
        const { search } = location;
        // const query = queryString.parse(search);
        dispatch(routerRedux.push({
            pathname: '/schoolNoticeNew',
            search: queryString.stringify({ id }),
        }));
    };
    //查看内容
    checkContent = (id) => {
        const { dispatch, location } = this.props;
        dispatch({
            type: namespace + '/checkSchoolMessage',
            payload: {
                id
            },
            callback: (result) => {
                const __html = `${result.content ? result.content : ''}${result.annex ? `<p>附件:<p>${result.annex}` : ''}`
                let win = window.open('', '', 'width=900');  //打开新的空白窗口
                win.width = 210
                win.document.write(__html);  //在新窗口中输出提示信息
                win.focus();  //让原窗口获取焦点
            }
        })
    }
    //发送通知
    sendMessage = (id) => {
        const { dispatch, location } = this.props;
        const { search } = location;
        const query = queryString.parse(search) || {};
        confirm({
            title: '确认发送通知？',
            content: '确认发送之后信息无法修改并发送到接收端。',
            onOk() {
                dispatch({
                    type: namespace + '/sendSchoolMessage',
                    payload: {
                        id
                    },
                    callback: (result) => {
                        notification.success({ message: '发送成功', description: '' });
                        dispatch({
                            type: namespace + '/saveState',
                            payload: {
                                tableLoading: true,
                            },
                        })
                        dispatch({
                            type: namespace + '/schoolMessage',
                            payload: {
                                size: query.s || 10,
                                page: query.p || 1,
                            },
                        })
                    }
                })
            },
            onCancel() { },
        });
    }
    //删除通知
    deleteMessage = (id) => {
        const { dispatch, location } = this.props;
        const { search } = location;
        const query = queryString.parse(search) || {};
        dispatch({
            type: namespace + '/deleteMessage',
            payload: {
                id
            },
            callback: (result) => {
                notification.success({ message: '删除送成功', description: '' });
                dispatch({
                    type: namespace + '/saveState',
                    payload: {
                        tableLoading: true,
                    },
                })
                dispatch({
                    type: namespace + '/schoolMessage',
                    payload: {
                        size: query.s || 10,
                        page: query.p || 1,
                    },
                })
            }
        })
    }
    render() {
        const { file, visible } = this.state;
        const { schoolMessage, dispatch, location, loading } = this.props;
        const { search } = location;
        const query = queryString.parse(search);
        const uploadProps = {
            beforeUpload: this.handleReturn,
            multiple: false,
            showUploadList: false,
        };
        const columns = [
            {
                title: '序号',
                key: 'index',
                align: 'center',
                render: (text, record, index) => index + 1
            },
            {
                title: '标题',
                // width: '70%',
                dataIndex: 'title',
                key: 'title',
                align: 'center',
            },
            {
                title: '时间',
                // width: '70%',
                dataIndex: 'createTime',
                key: 'createTime',
                align: 'center',
                render: (record) => (<span>{dealTimestamp(record, 'YYYY-MM-DD HH:mm:ss')}</span>)
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                align: 'center',
                render: (text) => {
                    if (text == 1) {
                        return <span style={{ color: 'rgb(255,0,0)' }}>待发送</span>
                    } else if (text == 2) {
                        return <span style={{ color: '#007ACC' }}>已发送</span>
                    } else {
                        return "--"
                    }
                }
            },
            {
                title: '操作',
                dataIndex: 'agentAreaName',
                key: 'agentAreaName',
                align: 'center',
                render: (text, record) => {
                    if (record.status == 1) {
                        return (<Space size="middle">
                            <Button onClick={() => { this.checkContent(record.id) }}>查看</Button>
                            <Button onClick={() => { this.routerJump(record.id) }}>编辑</Button>
                            <Button onClick={() => { this.deleteMessage(record.id) }}>删除</Button>
                            <Button onClick={() => { this.sendMessage(record.id) }}>发送</Button>
                        </Space>)
                    } else if (record.status == 2) {
                        return (<Space size="middle">
                            <Button onClick={() => { this.checkContent(record.id) }}>查看</Button>
                            <Button onClick={() => { this.deleteMessage(record.id) }}>删除</Button>
                        </Space>)
                    } else {
                        return (<Space size="middle">
                            <span>---</span>
                        </Space>)
                    }

                }
            }
        ]
        const handleTableChange = (pagination) => {
            this.replaceSearch({
                p: pagination.current,
                s: pagination.pageSize,
            })
        };
        return (
            <div className={styles['schoolNotice']}>
                <div>
                    <div className={styles['head']}>通知列表：</div>
                    <Table
                        bordered
                        rowKey='id'
                        loading={!!loading}
                        columns={columns}
                        dataSource={schoolMessage && schoolMessage.data}
                        onChange={handleTableChange}
                        pagination={paginationConfig(query, schoolMessage && schoolMessage.data ? schoolMessage.total : 0, true, true)}
                    />
                </div>

            </div>
        )
    }
}