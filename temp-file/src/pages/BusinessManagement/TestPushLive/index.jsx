/**
* 调试推流直播页面
* @author:张江
* @date:2022年04月28日
* @version:v1.0.0
* */

// eslint-disable-next-line
import React from 'react';
import { connect } from "dva";
import classNames from 'classnames';
import {
    Input,
    message,
    Modal,
    Alert,
    Select,
    Button,
} from 'antd';
import queryString from 'query-string';
// import { routerRedux } from 'dva/router';
import Page from '@/components/Pages/page';
import BackBtns from "@/components/BackBtns/BackBtns";
import { LiveManage as namespace } from '@/utils/namespace';

import { getIcon, existArr, openNotificationWithIcon } from '@/utils/utils';
import { liveTypeList } from '@/utils/const';
import LivePusherUtils from "@/utils/LivePusherUtils";//直播推流工具类
import styles from './index.less';

const { confirm } = Modal;
const IconFont = getIcon();
const { Option } = Select;

@connect(state => ({
    loading: state[namespace].loading,
}))

export default class TestPushLive extends React.Component {
    constructor(props) {
        super(...arguments);
        LivePusherUtils.createTXLivePusher();//首先创建实例
        this.state = {
            liveDetailInfo: null,
            testLiveInfo: null,
            // devicesList: [
            //     {
            //         type: 'video',
            //         deviceId: '1',
            //         deviceName: '视频设备'
            //     },
            //     {
            //         type: 'audio',
            //         deviceId: '2',
            //         deviceName: '音频设备'
            //     }
            // ],
            videoDevicesList: [],
            audioDevicesList: [],
            cameraDeviceId: '',
            microDeviceId: '',
            isCanStartLive: false,
            isCanOperTest: false,
            captureType: 1,
        };
    };

    componentDidMount() {
        const { dispatch, location } = this.props;
        const { search } = location;
        const query = queryString.parse(search);
        this.getLiveDetailInfo(query, 1)
    }

    /**
* 获取直播详情信息
* @param query  ：地址栏参数
*/
    getLiveDetailInfo = (query, operType) => {
        const {
            dispatch,
        } = this.props;
        const _self = this;
        dispatch({
            type: namespace + '/getMangeLiveDetail',
            payload: {
                id: query?.id,
            },
            callback: (result) => {
                _self.setState({
                    liveDetailInfo: result,
                    isCanStartLive: false,
                })
                if (operType == 1) {
                    LivePusherUtils.getDevicesList((devicesList) => {//获取设备列表
                        if (existArr(devicesList)) {
                            const videoDevicesList = devicesList.filter((item) => item.type == 'video');
                            const audioDevicesList = devicesList.filter((item) => item.type == 'audio')
                            _self.setState({
                                videoDevicesList,
                                audioDevicesList,
                                cameraDeviceId: videoDevicesList[0]?.deviceId,
                                microDeviceId: audioDevicesList[0]?.deviceId
                            })
                            _self.testLiveDetailInfo(query?.id)
                        }
                    })
                }
            }
        });
    }

    /**
* 调试直播信息
* @param query  ：地址栏参数
*/
    testLiveDetailInfo = (id) => {
        const {
            dispatch,
        } = this.props;
        const { cameraDeviceId, microDeviceId, captureType } = this.state;
        const _self = this;
        dispatch({//测试直播
            type: namespace + '/testLive',
            payload: {
                id: id
            },
            callback: (result) => {
                _self.setState({
                    testLiveInfo: result,
                })
                LivePusherUtils.testLiveDevice(captureType);//开启调试直播平台设备
                LivePusherUtils.switchLiveDevice(cameraDeviceId, microDeviceId);
                LivePusherUtils.setVideoRenderView('show_local_mylive');//设置直播播放器容器
            }
        });
    }

    /**
* 结束或开始
* @param operType  ：操作类型
*/
    enableOrDisableDelReplace = (operType) => {
        const {
            dispatch,
            location
        } = this.props;
        const { search } = location;
        const query = queryString.parse(search);
        const { liveDetailInfo, testLiveInfo, isCanStartLive, cameraDeviceId, microDeviceId, captureType } = this.state;
        const _self = this;
        //开始或结束直播
        const liveStatus = liveDetailInfo?.liveStatus;//0待开播，1直播中，2直播结束，-1直播取消
        const openType = liveDetailInfo?.openType;
        if (!testLiveInfo?.pushStreamUrl) {
            openNotificationWithIcon('warning', '提示', '', '当前不能开始直播，请确认信息是否正确？');
            return;
        }
        if (operType == 1) {
            LivePusherUtils.stopLivePush();
            testLiveInfo.cameraDeviceId = cameraDeviceId;
            testLiveInfo.microDeviceId = microDeviceId;
            //开始直播推流
            LivePusherUtils.startLivePush(testLiveInfo, () => {
                // LivePusherUtils.switchLiveDevice(cameraDeviceId, microDeviceId);
                _self.setState({
                    isCanStartLive: liveStatus == 0 ? true : false,
                    isCanOperTest: true,
                })
            }, captureType)
            return;
        }
        if (operType != 2 && !isCanStartLive) {
            openNotificationWithIcon('warning', '提示', '', '请先开始推流，才能开始直播！');
            return;
        }
        confirm({
            title: `确认${liveStatus == 1 ? '结束' : '开始'}当前直播吗？`,
            content: '',
            onOk() {
                const operLive = () => {
                    dispatch({//开始或结束直播
                        type: namespace + (liveStatus == 1 ? '/stopLive' : '/startLive'),
                        payload: {
                            id: liveDetailInfo.liveId || liveDetailInfo.id
                        },
                        callback: (result) => {
                            message.success("操作成功");
                            if (liveStatus == 1) {
                                //结束直播后 路由回退
                                window.history.go(-1);
                            } else {
                                _self.getLiveDetailInfo(query)
                            }
                        }
                    });
                }
                // if (openType == 1 || openType == 3) {//1:全部用户开放，2:对特定班级开放，3：对全部用户和特定班级开放
                if (liveStatus == 1) {
                    LivePusherUtils.stopLivePush();//结束直播
                    operLive();
                } else {
                    operLive();
                }
                // } else {
                //     operLive();
                // }

            },
            onCancel() { },
        });

    }

    /**
    * 页面组件即将卸载时：清空数据
    */
    componentWillUnmount() {
        const { dispatch } = this.props;
        LivePusherUtils.stopLivePush();//结束直播
        LivePusherUtils.stopLiveToDestroy();
        this.setState = (state, callback) => {
            return;
        };
    }

    render() {
        const {
            location,
            dispatch,
            loading,
        } = this.props;
        const {
            cameraDeviceId,
            microDeviceId,
            liveDetailInfo,
            videoDevicesList,
            audioDevicesList,
            isCanStartLive,
            isCanOperTest,
            captureType
        } = this.state
        const title = `调试开始直播`;
        const breadcrumb = [title];
        const header = (
            <Page.Header breadcrumb={breadcrumb} title={title} />
        );
        const classString = classNames(styles['my_live_content'], 'gougou-content');
        const teacherOnline = liveDetailInfo?.teacherOnline;
        const liveStatus = liveDetailInfo?.liveStatus
        return (
            <Page header={header} loading={!!loading}>
                <div className={classString}>
                    <div className={styles['test_content_box']}>
                        <div>
                            <label>直播名称：</label>
                            <span>{liveDetailInfo?.name}</span>
                        </div>
                        <div>
                            <label>开播时间：</label>
                            <span>{liveDetailInfo?.startTime}</span>
                        </div>
                        <div>
                            <label>直播时长：</label>
                            <span>{liveDetailInfo?.duration + '分钟'}</span>
                        </div>

                        <div className={styles['form_content']}>
                            <label>直播类型：</label>
                            <Select
                                value={captureType}
                                placeholder="请先选择直播类型"
                                style={{ width: 240 }}
                                onChange={(captureType) => {
                                    this.setState({ captureType });
                                }}>
                                {
                                    liveTypeList && liveTypeList.map((item) => {
                                        return (<Option key={item.code} value={item.code}>{item.name}</Option>)
                                    })
                                }
                            </Select>
                        </div>
                        {
                            captureType == 1 ? <div className={styles['form_content']}>
                                <label>摄&nbsp; 像&nbsp; 头：</label>
                                <Select
                                    placeholder="请选择摄像头"
                                    value={cameraDeviceId}
                                    style={{ width: 240 }}
                                    onChange={(cameraDeviceId) => {
                                        this.setState({
                                            cameraDeviceId
                                        });
                                    }}>
                                    {
                                        videoDevicesList && videoDevicesList.map((item) => {
                                            return (<Option key={item.deviceId} value={item.deviceId}>{item.deviceName}</Option>)
                                        })
                                    }
                                </Select>
                            </div> : null
                        }
                        <div className={styles['form_content']}>
                            <label>麦&nbsp; 克&nbsp; 风：</label>
                            <Select
                                value={microDeviceId}
                                placeholder="请先选择麦克风"
                                style={{ width: 240 }}
                                onChange={(microDeviceId) => {
                                    this.setState({ microDeviceId });
                                }}>
                                {
                                    audioDevicesList && audioDevicesList.map((item) => {
                                        return (<Option key={item.deviceId} value={item.deviceId}>{item.deviceName}</Option>)
                                    })
                                }
                            </Select>
                        </div>
                        <div className={styles['form_content']}>
                            <Button
                                disabled={isCanOperTest}
                                type="primary" style={{ width: '100%' }} onClick={() => {
                                    if (captureType==2){//录制屏幕
                                        LivePusherUtils.stopLivePush();//结束直播
                                        LivePusherUtils.testLiveDevice(captureType);//开启调试直播平台设备
                                    }
                                    LivePusherUtils.switchLiveDevice(cameraDeviceId, microDeviceId);//切换直播平台设备
                                }}>
                                切换设备调试预览
                            </Button>
                        </div>
                    </div>
                    <div className={styles['live_content_box']}>
                        <Alert
                            message="提示"
                            description="开始直播推流后，请勿刷新当前页面或离开本页面，否则直播推流将会中断，请慎重操作！"
                            type="warning"
                            showIcon
                        // closable
                        />
                        <div id="show_local_mylive"></div>
                        <div className={styles['oper_push_live']}>
                            {
                                isCanStartLive ? <Button
                                    type={"primary"}
                                    style={{ width: '100%' }}
                                    disabled={!cameraDeviceId || !microDeviceId}
                                    onClick={this.enableOrDisableDelReplace}
                                >
                                    {
                                        '开始直播'
                                    }
                                </Button> : teacherOnline == 0 ? <Button
                                    type={"primary"}
                                    style={{ width: '100%' }}
                                        disabled={!cameraDeviceId || !microDeviceId || isCanOperTest}
                                    onClick={() => {
                                        this.enableOrDisableDelReplace(1)
                                    }}
                                >
                                    {
                                        isCanOperTest?'正在推流.....':(liveStatus == 1 ? '继续推流' : '开始推流')
                                    }
                                </Button> : null
                            }
                            {
                                liveStatus == 1 ?
                                    <Button
                                        type={'danger'}
                                        style={{ width: '100%', marginLeft: teacherOnline == 0 ? '10px' : '' }}
                                        disabled={!cameraDeviceId || !microDeviceId}
                                        onClick={() => { this.enableOrDisableDelReplace(2) }}
                                    >
                                        {
                                            '结束直播'
                                        }
                                    </Button> : null
                            }

                        </div>
                    </div>
                </div>
                <BackBtns tipText={"返回"} />
            </Page>
        );
    }
}

