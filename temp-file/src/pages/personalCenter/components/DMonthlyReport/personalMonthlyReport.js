/**
 * 个人中心-个人月报
 * @author:熊伟
 * @date:2020年9月10日
 * @version:v1.0.0
 * */
import React from 'react';
import styles from './personalMonthlyReport.less';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import queryString from 'query-string';
import { Table, Button, DatePicker, message, Spin, Image } from 'antd';
import { PersonalCenter as namespace } from '@/utils/namespace';
import paginationConfig from '@/utils/pagination';
import { copyText, dealTimestamp } from '@/utils/utils';
import { RedEnvelopeOutlined, AccountBookTwoTone, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
@connect(state => ({
    tableLoading: state[namespace].tableLoading,
    loading: state[namespace].pageLoading,
    getRevenues: state[namespace].getRevenues,
    getOrderByInviteCode: state[namespace].getOrderByInviteCode,//个人分销月报表
    genInvitePoster: state[namespace].genInvitePoster,
}))
export default class PersonalMonthlyReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,//
            imgVisible: false
        }
    }
    render() {
        const { visible, imgVisible } = this.state;
        const { location, userInfo, getRevenues = {}, getOrderByInviteCode = {}, loading, tableLoading, dispatch, genInvitePoster = '' } = this.props;
        const { search, pathname } = location;
        let query = queryString.parse(search);
        const bg = 'https://reseval.gg66.cn/share-bg.png';
        const { ownInvitePng } = userInfo
        const bg1 = 'https://reseval.gg66.cn/money-come.gif';
        const columns = [
            {
                title: '消费账号',
                dataIndex: 'account',
                key: 'account',
                align: 'center'
            },
            {
                title: '资金类型',
                dataIndex: 'goodsType',
                key: 'goodsType',
                align: 'center'
            },
            {
                title: '消费时间',
                dataIndex: 'payTime',
                key: 'payTime',
                align: 'center',
                render: (text) => text?dealTimestamp(text,'YYYY-MM-DD HH:mm:ss'):'--'
            },
            {
                title: '我的分成',
                dataIndex: 'userRevenue',
                key: 'userRevenue',
                align: 'center',
                render: (text, record, index) => {
                    if (record.goodsType == '提现') {
                        return <span style={{ color: 'red' }}>-¥{text}</span>
                    } else {
                        return <span>+¥{text}</span>
                    }

                },
            },
        ];
        //日期变化
        const datePickerChange = (date, dateString) => {
            query = { ...query, startTime: dateString[0], endTime: dateString[1] };
            //修改地址栏最新的请求参数
            dispatch(routerRedux.replace({
                pathname,
                search: queryString.stringify(query),
            }));
        }
        //表格变化
        const tableChange = (pagination) => {
            query = { ...query, p: pagination.current, s: pagination.pageSize, };
            //修改地址栏最新的请求参数
            dispatch(routerRedux.replace({
                pathname,
                search: queryString.stringify(query),
            }));
        }
        const onClickShareMoney = () => {
            this.setState({ visible: true })
            dispatch({
                type: namespace + '/genInvitePoster',
            });
        }
        const setVisible = (bol) => {
            this.setState({
                imgVisible: bol
            })
        }
        return (
            <Spin spinning={!!loading}>
                <div className={styles['PersonalMonthlyReport']}>
                    <div className={styles['header']}>
                        <p>
                            <RedEnvelopeOutlined /> &nbsp;&nbsp;我的收益&nbsp;&nbsp;¥&nbsp;&nbsp;<span style={{ fontSize: '40px' }}>
                                {getRevenues.userEarnings && getRevenues.userEarnings.toFixed(2)}
                            </span>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <a onClick={() => { onClickShareMoney() }}>邀请好友，分享赚钱</a>
                        </p>
                        <p className={styles['header-p']}>我邀请的好友:{getRevenues.inviteUserNumber}人</p>
                        <Button className={styles['header-btn']} onClick={() => { message.warning('功能暂未开通，敬请期待...') }}>提现</Button>
                    </div>
                    <div className={styles['content']}>
                        <div className={styles['content-header']}>
                            <p>
                                <span style={{ fontSize: '20px' }}><AccountBookTwoTone />&nbsp;&nbsp;资金明细</span>
                                <span>&nbsp;&nbsp;&nbsp;&nbsp;总收益：<span style={{ fontSize: '20px' }}>&nbsp;&nbsp;¥&nbsp;&nbsp;{getRevenues.totalRevenue && getRevenues.totalRevenue.toFixed(2)}</span></span>
                                {/* <span>&nbsp;&nbsp;&nbsp;&nbsp;总分润：<span style={{ fontSize: '20px' }}>&nbsp;&nbsp;¥&nbsp;&nbsp;0.00</span></span> */}
                            </p>
                            <RangePicker
                                // defaultValue={query.ym ? moment(query.ym, "YYYYMM") : moment(getTimestamp('/'), 'YYYY/MM')}
                                // defaultValue={moment(getTimestampDay('/'), dateFormat)}
                                // format={dateFormat}
                                // className={styles['content-header-data']}
                                onChange={datePickerChange}
                            />
                        </div>
                        <Table
                            columns={columns}
                            dataSource={getOrderByInviteCode.data}
                            onChange={tableChange}
                            rowKey='payTime'
                            loading={tableLoading}
                            pagination={paginationConfig(query, getOrderByInviteCode && getOrderByInviteCode.data ? getOrderByInviteCode.total : 0, true, true)}
                        />
                    </div>
                    {
                        visible ?
                            <div className={styles['modal']}>
                                <div className={styles['modal-content']} style={{ backgroundImage: 'url(' + bg + ')' }}>
                                    <div className={styles['modal-content-rain']} style={{ backgroundImage: 'url(' + bg1 + ')' }}></div>
                                    <div className={styles['modal-content-cancel']} onClick={() => { this.setState({ visible: false }) }}>
                                        <CloseCircleOutlined />
                                    </div>
                                    <div className={styles['modal-content-code']} >
                                        <Image
                                            className={styles['modal-content-code-img']}
                                            src={ownInvitePng}
                                            preview={{
                                                src: genInvitePoster,
                                            }}
                                        />
                                        {/* <>
                                            <Image
                                                className={styles['modal-content-code-img']}
                                                preview={{ visible: false, }}
                                                // width={200}
                                                src={ownInvitePng}
                                                onClick={() => setVisible(true)}
                                            />
                                            <div style={{ display: 'none' }}>
                                                <Image.PreviewGroup preview={{ visible: imgVisible, onVisibleChange: vis => setVisible(vis), current: 1 }}>
                                                    <Image src={genInvitePoster} />
                                                    <Image src={ownInvitePng} />
                                                </Image.PreviewGroup>
                                            </div>
                                        </> */}
                                        <p>邀请码：{userInfo.ownInviteCode}</p>
                                    </div>
                                    <div className={styles['modal-content-bottom']}>
                                        <span className={styles['modal-content-bottom-span']}>复制下载链接发送给好友即可</span>
                                        <Button className={styles['modal-content-bottom-btn']} onClick={() => { copyText(userInfo.link) }}>分享链接</Button>
                                    </div>
                                </div>
                            </div> : null
                    }
                </div>
            </Spin>
        )
    }
}