/**
* vip支付中心页面
* @author:张江
* @date:2021年01月07日
* @version:v1.0.0
* */

// eslint-disable-next-line
import React from 'react';
import { connect } from "dva";
import classNames from 'classnames';
import {
    message,
    Modal,
    Spin,
    Checkbox,
    Alert,
    Menu,
    Popover,
    Radio 
} from 'antd';
import queryString from 'query-string';
// import { routerRedux } from 'dva/router';
import Page from '@/components/Pages/page';
import BackBtns from "@/components/BackBtns/BackBtns";
import PartingLine from "@/components/PayCenter/PartingLine";//分割线
import WeixinPayModal from "@/components/PayCenter/WeixinPayModal";//微信支付弹窗
import MSAgreement from "@/components/PayCenter/MSAgreement";//会员服务协议
import MRAgreement from "@/components/PayCenter/MRAgreement";//自动续费服务协议
import { PayCenter as namespace, Auth } from '@/utils/namespace';
import userCache from "@/caches/userInfo";

import { getIcon, existArr, processDataRetainDigit, openNotificationWithIcon } from '@/utils/utils';
import styles from './index.less';

const { confirm } = Modal;
const IconFont = getIcon();

@connect(state => ({
    goodsLoading: state[namespace].goodsLoading,//加载中
    studyList: state[namespace].studyList,//学段列表
    goodsList: state[namespace].goodsList,//商品列表
    // startPayLoading: state[namespace].startPayLoading,//启动支付加载中
    memberUserInfo: state[Auth].userInfo,//用户信息
}))

export default class PayCenter extends React.Component {
    constructor(props) {
        super(...arguments);
        this.state = {
            radioSelected: true,
            goodsInfo: {
                // id: 36,
                // name: '连续包月',
                // price: '12',
                // desc: '次月15元/月'
            },//商品信息
            paymentMenthod: 1,//默认微信支付
            isClickPay: false,

            weixinPayVisible: false,
            weixinQr: '',
            orderNum: '',
            vipType:1,//VIP

        };
    };

    UNSAFE_componentWillMount() {
        const { dispatch, location } = this.props;
        // const { search } = location;
        const userInfo = userCache() || {};
        // const query = queryString.parse(search);
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
        this.setState({
            seletedStudyInfo: {
                studyId: userInfo.studyId,
                studyName: userInfo.studyName
            }
        }, () => {
            this.getGoodsList(userInfo.studyId);
        })
        //获取学段
        dispatch({
            type: namespace + '/getStudyListInGoods',
            payload: {}
        })
        this.geUserInfo();
    }

    /**
    * 获取商品列表
    * @param studyId  学段id
    */
    getGoodsList = (studyId) => {
        const { dispatch, location } = this.props;
        const { vipType } =this.state
        //显示加载中
        dispatch({
            type: namespace + '/saveState',
            payload: {
                goodsLoading: false,
                goodsList: []
            },
        })
        this.setState({
            goodsInfo: {}
        })
        //获取商品列表
        dispatch({
            type: namespace + '/getGoodsList',
            payload: {
                studyId,
                goodsType: 1,
                vipType
            },
            callback: (result) => {
                if (existArr(result)) {
                    this.setState({
                        goodsInfo: result[0]
                    })
                }
            }
        })
    }

    /**
* 更新获取用户信息
 * @param paymentMenthod  支付方式回调
*/
    geUserInfo = (paymentMenthod) => {
        const { dispatch, location } = this.props;
        userCache.clear();
        dispatch({
            type: Auth + '/getSwitchUserInfo',
            payload: {},
            callback: (result) => {
                if (paymentMenthod) {
                    if (result && result.member) {
                        openNotificationWithIcon('success', '已是会员!', '', '', 3);
                        window.location.reload();//开通会员后本地刷新 标识会员
                    } else {
                        openNotificationWithIcon('warning', `开通会员失败,请重试!`, 'rgba(0,0,0,.85)', '', 3)
                    }
                }
            }
        })
    }


    /**
    * 选择商品
    * @param item  商品信息
    */
    handleSelectGoods = (item) => {
        this.setState({
            goodsInfo: item,
        })
    }

    /**
    * 选择支付方式
    * @param key  支付方式key值
    */
    handleSelectPatMethod = (key) => {
        this.setState({
            paymentMenthod: key,
        })
    }

    /**
    * 付款
    */
    handlePayment = () => {
        const { dispatch, location } = this.props;
        const { paymentMenthod, goodsInfo, seletedStudyInfo, radioSelected } = this.state;
        const isAutoRenewal = goodsInfo && goodsInfo.autoRenewal;
        const _that = this;
        if (!radioSelected) {
            this.setState({
                isClickPay: true
            })
            message.warning(`请先阅读并同意《会员服务协议》${isAutoRenewal ? '和《自动续费服务协议》' : ''}`);
            return;
        }
        // dispatch({
        //     type: namespace + '/saveState',
        //     payload: {
        //         startPayLoading: true,
        //     },
        // })
        const hidePayloading = message.loading('正在启动支付,请稍候...', 10);
        const payloadParm = {
            goodsId: goodsInfo ? goodsInfo.id : null,
            code: seletedStudyInfo.studyId,
            goodsType: 1,//商品类型(1:数据费用，2：代理费用，3：微课费，4：实品, 5: 报告)
        }
        // 微信支付
        if (paymentMenthod == 1) {
            dispatch({
                type: namespace + '/weixinPaySign',
                payload: payloadParm,
                callback: (result) => {
                    hidePayloading();
                    const returnJudge = window.$HandleAbnormalStateConfig(result);
                    if (returnJudge && !returnJudge.isContinue) { return; };//如果异常 直接返回
                    const { out_trade_no, url } = result;
                    this.setState({
                        weixinPayVisible: true,
                        orderNum: out_trade_no,
                        weixinQr: url
                    }, () => { })
                }
            })
        } else {//支付宝支付
            dispatch({
                type: namespace + '/aliPaySign',
                payload: payloadParm,
                callback: (result) => {
                    hidePayloading();
                    const returnJudge = window.$HandleAbnormalStateConfig(result);
                    if (returnJudge && !returnJudge.isContinue) { return; };//如果异常 直接返回
                    // console.log(result)
                    confirm({
                        style: { marginTop: '16%' },
                        className: 'alipay-confirm-modal',
                        title: '支付宝付款是否已支付成功？',
                        content: '',
                        okText: '支付成功',
                        cancelText: '支付失败',
                        onOk() {
                            _that.geUserInfo(paymentMenthod);
                        },
                        onCancel() { },
                    });
                }
            })
        }

    }

    /**
    *获取订单状态
    */
    getOrderInfoStatus = () => {
        const { dispatch, location } = this.props;
        const { orderNum, paymentMenthod } = this.state;
        if (orderNum) {
            dispatch({
                type: namespace + '/getOrderInfoStatus',
                payload: {
                    outTradeNo: orderNum,
                },
                callback: (result) => {
                    // console.log('result===', result);
                    if (result && result.trade_state == 'SUCCESS') {//预下单支付成功的情况下
                        this.setState({
                            weixinPayVisible: false,
                            orderNum: '',
                            weixinQr: ''
                        }, () => {
                            message.success('微信扫码付款成功')
                            this.geUserInfo(paymentMenthod);
                            //  @ts-ignore
                            if (window._czc) {
                                //  @ts-ignore
                                window._czc.push(['_trackEvent', `${window.$systemTitleName}-微信扫码支付-会员`, '支付']);
                            }
                        })
                    }
                }
            })
        }

    }

    /**
    * 隐藏清除微信付款弹窗
    */
    hideWeixinPayVisible = () => {
        this.setState({
            weixinPayVisible: false,
            weixinQr: ''
        })
    }

    /**
 * 切换学段
 */
    handleSelectStudy = (item) => {
        this.getGoodsList(item.id)
        this.setState({
            seletedStudyInfo: {
                studyId: item.id,
                studyName: item.name,
            },
            popoverVisible: false
        })

    }

    /**
    * 选择学段
    * @param visible 
    */
    handleVisibleChange = visible => {
        this.setState({ popoverVisible: visible });
    };

/**
* vip类型选择
* @param e事件对象
*/
    onVipTypeChange=(e)=>{
        const { seletedStudyInfo } = this.state;
        this.setState({
            vipType: e.target.value,
        },()=>{
                this.getGoodsList(seletedStudyInfo.studyId)
        })
    }

    /**
* 页面组件即将卸载时：清空数据
*/
    componentWillUnmount() {
        const { dispatch } = this.props;
        clearInterval(window.weixinPayTimer);//清除微信支付定时器
        dispatch({
            type: namespace + '/saveState',
            payload: {
                goodsList: [],
            },
        });
        this.setState = (state, callback) => {
            return;
        };
    }

    render() {
        const {
            location,
            dispatch,
            loading,
            studyList = [],
            goodsList = [],
            goodsLoading,
            // startPayLoading,
            memberUserInfo = {}
        } = this.props;
        const {
            goodsInfo,
            radioSelected,
            paymentMenthod,
            isClickPay,
            weixinQr,
            weixinPayVisible,
            seletedStudyInfo,
            popoverVisible,
            vipType
        } = this.state;
        const title = memberUserInfo && memberUserInfo.member ? '会员中心' : '开通会员';
        const breadcrumb = [title];
        const header = (
            <Page.Header breadcrumb={breadcrumb} title={title} />
        );
        const isAutoRenewal = goodsInfo && goodsInfo.autoRenewal;
        const menu = (
            <div className={styles['study-list-box']}>
                {
                    existArr(studyList) && studyList.map((item) => {
                        return (
                            <div key={item.id} onClick={() => this.handleSelectStudy(item)}>
                                <span>{item.name}</span>
                            </div>
                        )
                    })
                }
            </div>
        );
        const classString = classNames(styles['paycenter-info-content'], 'gougou-content');
        // 检验微信的支付状态
        clearInterval(window.weixinPayTimer);//清除微信支付定时器
        if (weixinPayVisible) {
            window.weixinPayTimer = setInterval(this.getOrderInfoStatus, 3000);
        } 
        // else {
        //     clearInterval(window.weixinPayTimer)
        // }
        return (
            <Page header={header} loading={false}>
                {/* <Spin spinning={!!startPayLoading} tip='正在启动支付,请稍候...'> */}
                <Spin spinning={!goodsLoading} tip='商品正在加载中...'>
                    <div>
                        <div className={styles['paycenter-warp-box']}>
                            <div className={classString}>

                                {/* 会员充值 */}
                                <div className={styles['member-recharge']}>
                                    <PartingLine
                                        title='会员充值'
                                        description={memberUserInfo && memberUserInfo.memberStudyNameAndEndDate ? `您的会员到期时间: ${memberUserInfo.memberStudyNameAndEndDate}` : ''}
                                    />
                                    {/* <div className={styles['divider-box']}>
                                    <Divider className={styles['member-divider']}>会员充值</Divider> */}
                                    {/* <p className={styles['divider-description']}>您的{window.$systemTitleName}会员,将于2021年01月31日到期</p> */}
                                    {/* <p className={styles['divider-description']}>您已开通{window.$systemTitleName}自动续费,将于2021年01月31日自动扣费</p>
                                </div> */}
                                    <div className={styles['recharge-info']}>
                                        <div>当前学段：<span>{seletedStudyInfo.studyName || '请选择学段'}</span></div>
                                        {/* <div>
                                            <Radio.Group defaultValue={String(vipType)} buttonStyle="solid" onChange={this.onVipTypeChange}>
                                                <Radio.Button value="1">VIP</Radio.Button>
                                                <Radio.Button value="2">SVIP</Radio.Button>
                                            </Radio.Group>
                                        </div> */}
                                        <Popover
                                            placement="leftTop"
                                            content={menu}
                                            visible={popoverVisible}
                                            onVisibleChange={this.handleVisibleChange}
                                        >
                                            <div>切换学段</div>
                                        </Popover>
                                    </div>
                                    {/* 商品列表 */}
                                    <div className={styles['goods-list']}>
                                        {
                                            // [
                                            //     {
                                            //         id: 36,
                                            //         name: '连续包月',
                                            //         price: '12',
                                            //         desc: '次月15元/月',
                                            //         recommended: true
                                            //     },
                                            //     {
                                            //         id: 2,
                                            //         name: '1个月',
                                            //         price: '15',
                                            //         desc: null
                                            //     }
                                            // ]
                                            existArr(goodsList) && goodsList.map((item) => {
                                                return (
                                                    <div
                                                        className={styles[goodsInfo.id === item.id ? 'goods-active' : 'goods-item']}
                                                        key={item.id}
                                                        onClick={() => { this.handleSelectGoods(item) }}
                                                    >
                                                        {
                                                            item && item.name.includes('3') ? <span className={styles['recommended']}>推荐</span>
                                                                : null
                                                        }
                                                        <div>
                                                            {item.name}
                                                            {/* <div className={styles['vip-desc']}>{vipType == 2 ? '基础功能 + 微课' :'基础功能'}</div> */}
                                                        </div>
                                                        <div>
                                                            <div className={styles['goods-price']}>¥<span>{item.price}</span></div>
                                                            {
                                                                item.desc ? <p>{item.desc}</p> : null
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>


                                    {/* 说明 */}
                                    <div className={styles['instructions']}>
                                        <h4>说明</h4>
                                        <div>
                                            1.会员付费制按学段区分（小学、初中、高中、专升本），一次付费只能购买一个学段；<br />
                                        2.想要购买其他学段的会员，切换相应学段进行购买吧! <br />
                                            {/* 3.想要购买其他学段的会员，切换相应学段进行购买吧! 购买成功后，需要切换到相应学段下班级才能使用哦！<br /> */}
                                        </div>
                                    </div>
                                </div>

                                {/* 支付方式 */}
                                <div className={styles['payment-method']}>
                                    <PartingLine
                                        title='支付方式'
                                        description=''
                                    />
                                    <div className={styles['method-list']}>
                                        {
                                            [
                                                {
                                                    methodKey: 1,
                                                    name: '微信支付',
                                                    icon: 'icon-weixin'
                                                },
                                                {
                                                    methodKey: 2,
                                                    name: '支付宝支付',
                                                    icon: 'icon-zhifubao'
                                                },
                                            ].map((item) => {
                                                return (
                                                    <div
                                                        className={styles[paymentMenthod === item.methodKey ? 'method-active' : 'method-item']}
                                                        key={item.methodKey}
                                                        onClick={() => { this.handleSelectPatMethod(item.methodKey) }}
                                                    >
                                                        <IconFont type={item.icon} style={{ fontSize: '28px' }} />
                                                        <span>{item.name}</span>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>

                                {/* 同意协议并立即支付 */}
                                <div className={styles['agreement-pay-box']}>
                                    <Checkbox
                                        checked={radioSelected}
                                        onChange={(e) => { this.setState({ radioSelected: e.target.checked }) }}
                                    >请先阅读并同意</Checkbox >
                                    <span className={styles['agreement-title']}
                                        onClick={() => {
                                            this.setState({ agreementVisible: true })
                                        }}
                                    >《会员服务协议》</span>
                                    {
                                        isAutoRenewal ? ['和', <span key={'2'} className={styles['agreement-title']}
                                            onClick={() => {
                                                this.setState({ MRagreementVisible: true })
                                            }}
                                        >《自动续费服务协议》</span>] : null
                                    }


                                    {
                                        isClickPay && !radioSelected ? <Alert
                                            style={{ marginTop: '6px' }}
                                            message={`    请先阅读并同意《会员服务协议》${isAutoRenewal ? '和《自动续费服务协议》' : ''}`}
                                            type="warning"
                                            closable
                                            showIcon
                                        /> : null
                                    }
                                    <div className={styles['immediate-payment-box']}>
                                        <div>
                                            应付金额：
                                        <span>{goodsInfo.price}元</span>
                                            {/* {
                                                existArr(goodsList) ? <div
                                                    className={styles['average']}
                                                >平均每天{processDataRetainDigit(Number(goodsInfo.price) / 30)}元
                                        </div>:null
                                        } */}
                                        </div>
                                        <div onClick={this.handlePayment}>{memberUserInfo && memberUserInfo.member ? '立即续费' : '立即付款'}</div>
                                    </div>
                                </div>

                                {/* 会员权益 */}
                                <div className={styles['member-interests']}>
                                    <img src="https://reseval.gg66.cn/interests-top-right.png" className={styles['interests-top-right']} alt="" />
                                    <img src="https://reseval.gg66.cn/interests-bottom-left.png" className={styles['interests-bottom-left']} alt="" />
                                    <PartingLine
                                        title='会员专享权益'
                                        description='开通会员适用于电脑/手机/ipad'
                                    />
                                    <div className={styles['interests-list']}>
                                        {
                                            [
                                                {
                                                    iconfont: 'icon-xueqingbaogao',
                                                    title: '学情报告',
                                                    desc: '百万题库资源，自由练习<br />还可出测评报告哦！'
                                                },
                                                {
                                                    iconfont: 'icon-cuotizhuanlian',
                                                    title: '错题专练',
                                                    desc: '根据产生的错题进行错题专享<br />训练，还可打印哦！'
                                                },
                                                {
                                                    iconfont: 'icon-tishengxunlian',
                                                    title: '提升训练',
                                                    desc: '百万题库资源，自由练习<br />还可出测评报告哦！'
                                                },
                                            ].map((item) => {
                                                return (<div className={styles['interests-item']} key={item.iconfont}>
                                                    <IconFont type={item.iconfont} style={{ fontSize: '80px' }} />
                                                    <h3>{item.title}</h3>
                                                    <p dangerouslySetInnerHTML={{ __html: item.desc }}></p>
                                                </div>)
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Spin>
                {/* </Spin> */}
                {/* 微信扫码支付弹窗 */}
                {
                    weixinPayVisible ?
                        <WeixinPayModal
                            weixinPayVisible={weixinPayVisible}
                            hideWeixinPayVisible={this.hideWeixinPayVisible}
                            PayInfo={{
                                title: `${goodsInfo && goodsInfo.name || ''}`,
                                price: goodsInfo && goodsInfo.price,
                                weixinQr,
                                payTitle: paymentMenthod == 1 ? '微信' : '支付宝'
                            }}
                        />
                        : null
                }

                {/* 会员服务协议 */}
                <MSAgreement
                    hideModal={() => {
                        this.setState({
                            agreementVisible: false
                        })
                    }}
                    visible={this.state.agreementVisible}
                    closeModal={(isSelected) => {
                        this.setState({
                            agreementVisible: !!0,
                            radioSelected: isSelected
                        })
                    }}
                    buttonVisible={radioSelected}
                />
                {/* 自动续费服务协议 */}

                <MRAgreement
                    hideModal={() => {
                        this.setState({
                            MRagreementVisible: false
                        })
                    }}
                    visible={this.state.MRagreementVisible}
                    closeModal={(isSelected) => {
                        this.setState({
                            MRagreementVisible: !!0,
                            radioSelected: isSelected
                        })
                    }}
                    buttonVisible={radioSelected}
                />

                <BackBtns tipText={"返回"} />
            </Page>
        );
    }
}

