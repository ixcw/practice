/**
* 直播播放页面
* @author:张江
* @date:2022年04月26日
* @version:v1.0.0
* */

// eslint-disable-next-line
import React from 'react';
import { connect } from "dva";
import classNames from 'classnames';
import {
    Input,
    message,
    // Modal,
    Spin
} from 'antd';
import queryString from 'query-string';
// import { routerRedux } from 'dva/router';
import Page from '@/components/Pages/page';
import BackBtns from "@/components/BackBtns/BackBtns";
import { LiveManage as namespace } from '@/utils/namespace';

import { getIcon, existArr, watchLiveBroadcast } from '@/utils/utils';
import styles from './index.less';
import VideoPay from '@/components/VideoPay';

// const { confirm } = Modal;
const IconFont = getIcon();

@connect(state => ({
    loading: state[namespace].loading,
}))

export default class WatchLive extends React.Component {
    constructor(props) {
        super(...arguments);
        this.state = {
            liveDetailInfo: null,
        };
    };

    componentDidMount() {
        const { dispatch, location } = this.props;
        const { search } = location;
        const query = queryString.parse(search);
        this.getLiveDetailInfo(query)
    }

    /**
* 获取直播详情信息
* @param query  ：地址栏参数
*/
    getLiveDetailInfo = (query) => {
        const {
            dispatch,
        } = this.props;
        dispatch({
            type: namespace + '/getLiveDetail',
            payload: {
                id: query?.id,
            },
            callback: (result) => {
                if (query.isPaySuccess == 1) {
                    if (result?.hasPermission == 1) {
                        message.success('支付成功')
                    } else {
                        message.warn('支付失败，请重试')
                    }
                }
                this.setState({
                    liveDetailInfo: result
                })
                if (result?.hasPermission == 1) {
                    watchLiveBroadcast('my_live_id_video_box', result)
                }
            }
        });
    }

    /**
* 获取直播详情信息
* @param query  ：地址栏参数
*/
    makeAppointmentLive = (query) => {
        const {
            dispatch,
        } = this.props;
        const _self = this;
        dispatch({
            type: namespace + '/liveFreeJoin',
            payload: {
                id: query?.id,
            },
            callback: (result) => {
                const returnJudge = window.$HandleAbnormalStateConfig(result);
                if (returnJudge && !returnJudge.isContinue) { return; };//如果异常 直接返回
                _self.getLiveDetailInfo(query)
            }
        });
    }

    /**
* 页面组件即将卸载时：清空数据
*/
    componentWillUnmount() {
        const { dispatch } = this.props;
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
        const { search } = location;
        const query = queryString.parse(search);
        const { liveDetailInfo } = this.state
        const title = `观看直播`;
        const breadcrumb = [title];
        const header = (
            <Page.Header breadcrumb={breadcrumb} title={title} />
        );
        const classString = classNames(styles['my_live_content'], 'gougou-content');
        return (
            <Page header={header} loading={!!loading}>
                <div className={classString}>
                    <div id="my_live_id_video_box"></div>
                    {
                        !liveDetailInfo?.liveUrl ?
                            <div className={styles['videoNoPlayer']} style={{ backgroundImage: 'url(' + liveDetailInfo?.coverUrl + ')' }}>
                                {
                                    liveDetailInfo?.hasPermission == 0 && liveDetailInfo?.isFree == 0 ? <div className={styles['mask']}>
                                        <VideoPay location={location} payInfoItem={liveDetailInfo} paySuccessCallback={this.getLiveDetailInfo} />
                                    </div> : liveDetailInfo?.joinStatus == 0 && liveDetailInfo?.hasPermission == 0 && liveDetailInfo?.isFree == 1 ? <div className={styles['mask_content']} >
                                        <div className={styles['makeAppointmentLive_box']}>
                                            <div className={styles['makeAppointmentLive_button']} onClick={() => { this.makeAppointmentLive(query) }}>免费预约</div>
                                            <p>免费预约直播，开播之后即可直接观看！</p>
                                        </div>
                                    </div> :
                                        <div className={styles['mask_content']}>
                                            {
                                                    liveDetailInfo?.joinStatus == 1 && liveDetailInfo?.isFree == 1 ?
                                                    <span>{'您已预约'}</span> : null
                                            }
                                            目前还未开播，敬请期待（开播时间：{liveDetailInfo?.startTime}）
                                        </div>
                                }
                            </div> : null
                    }
                </div>
                <BackBtns tipText={"返回"} />
            </Page>
        );
    }
}

