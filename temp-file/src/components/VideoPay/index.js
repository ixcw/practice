/**
 *@Author:xiongwei
 *@Description:
 *@Date:Created in  2021/10/12
 *@Modified By:
 * @updateAuthor:张江
 * @updateVersion:v1.0.1
 * @updateDate:2022年02月15日
 * @description 更新描述:根据需求改版视频微课可单个付费
 * @updateAuthor:张江
 * @updateVersion:v1.0.2
 * @updateDate:2022年05月09日
 * @description 更新描述:添加直播支付的判断 goodsType==7
 */
import React from 'react'
import styles from './index.less'
import { Button, message, Modal } from 'antd'
import { replaceSearch, getLocationObj, pushNewPage, getIcon, generateQRCode, existArr, existObj } from '@/utils/utils'
import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { PayCenter as namespace, VideoPlayer } from '@/utils/namespace'
import { connect } from 'dva';
import PropTypes from 'prop-types';

const { confirm } = Modal;
const IconFont = getIcon();
@connect(state => ({
  // goodsList: state[namespace].goodsList,//报告价格
  videoParticulars: state[VideoPlayer].videoParticulars,
}))
export default class VideoPay extends React.Component {

  static propTypes = {
    payInfoItem: PropTypes.object,//数据对象
    paySuccessCallback: PropTypes.func,//点击查看视频
  };

  constructor(props) {
    super(props);
    this.state = {
      levelState: false,//一元支付窗口开关
      orderNum: '',//二维码编号
      payWay: undefined,//支付方式
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer)
    /**
* 页面组件即将卸载时：清空数据
*/
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    const { levelState, payWay } = this.state;
    const { dispatch, location, payInfoItem, videoParticulars = {}, paySuccessCallback } = this.props;
    const { query } = getLocationObj(location) || {};
    const tempPayInfoItem = existObj(payInfoItem) ? payInfoItem : videoParticulars;
    // const price = existArr(goodsList) && goodsList[0] ? goodsList[0].price : ''
    const price = tempPayInfoItem.price ? tempPayInfoItem.price : '';
    const goodsType = tempPayInfoItem.goodsType;//7 直播
    const messageLoadingText = '正在启动支付,请稍候...';

    /**
     *获取订单状态
     */
    const getOrderInfoStatus = (orderNum) => {
      const { dispatch } = this.props;
      const _self = this;
      if (orderNum) {
        let _query = { ...query };
        const videoType = query.videoType || 1;// 1 单题微课  2 课程微课
        if (goodsType == 7) {//直播支付
          dispatch({
            type: namespace + '/getOrderStatus',
            payload: {
              tradeNo: orderNum,
            },
            callback: (result) => {
              // 返回：{ status: 1 未支付，2已支付 }
              if (result?.status == 2) {//预下单支付成功的情况下
                clearInterval(_self.timer)
                if (paySuccessCallback && typeof paySuccessCallback == 'function') {
                  paySuccessCallback(_query);
                }
                message.success('微信支付成功')
              } else { }
            }
          })
          return;
        }
        dispatch({
          type: VideoPlayer + (videoType == 2 ? '/findVideoById' : '/findQuestionVideoById'),
          payload: {
            videoId: query.videoId,
            videoType,
          },
          callback: (result) => {
            if (result && result.isBuy == 1) {//预下单支付成功的情况下
              dispatch({
                type: VideoPlayer + '/saveState',
                payload: {
                  Videoloading: true
                },
              })
              dispatch({
                type: VideoPlayer + '/saveState',
                payload: {
                  Videoloading: false
                },
              })
              // query.isBuy = 1
              replaceSearch(dispatch, location, _query)
              message.success('微信支付成功')
            }
          }
        })
      }
    }


    /**
     * 点击进入一元支付或者返回
     * bool=true
     */
    const handleLevelState = (bool) => {
      //清除定时器
      if (this.timer) {
        clearInterval(this.timer)
      }
      if (levelState) {
        const hidePayloading = message.loading(messageLoadingText, 10);
        dispatch({
          type: namespace + '/weixinPaySign',
          payload: {
            goodsId: tempPayInfoItem.goodsId,//商品id
            goodsType: tempPayInfoItem.goodsType || 3,//商品类型(1:数据费用，2：代理费用，3：微课费，4：实品, 5: 报告)
            code: tempPayInfoItem.id || tempPayInfoItem.liveId,//根据商品类型，报告传任务id,微课传微课id,学段ID
            videoType: query.videoType || 1,//商品类型为3 微课费时传入 : 1 单题微课  2 课程微课
          },
          callback: (result) => {
            hidePayloading();
            const returnJudge = window.$HandleAbnormalStateConfig(result);
            if (returnJudge && !returnJudge.isContinue) {
              return;
            }
            ;//如果异常 直接返回
            const { out_trade_no, url } = result || {};
            // this.setState({ levelState: !levelState })
            generateQRCode("weixinPayQrcodeReport", url);//生成支付二维码
            this.setState({ orderNum: out_trade_no },
              () => {
                this.timer = setInterval(() => getOrderInfoStatus(out_trade_no), 3000);
              })
          }
        })
      } else {
        this.setState({ levelState: !levelState })
      }
    }

    /**
     * 跳转到会员支付
     */
    const gotoPayCenter = () => {
      pushNewPage({}, '/pay-center', dispatch)
      clearInterval(this.timer)
    }

    /**
     * 支付宝支付
     * @param index
     */
    const aliPay = (index) => {
      //清除定时器
      if (this.timer) {
        clearInterval(this.timer)
      }
      if (index === 1) {
        const hidePayloading = message.loading(messageLoadingText, 10);
        dispatch({
          type: namespace + '/aliPaySign',
          payload: {
            goodsId: tempPayInfoItem.goodsId,
            goodsType: tempPayInfoItem.goodsType || 3,//商品类型(1:数据费用，2：代理费用，3：微课费，4：实品, 5: 报告)
            code: tempPayInfoItem.id || tempPayInfoItem.liveId,//根据商品类型，报告传任务id,微课传微课id,学段ID
            videoType: query.videoType || 1, //商品类型为3 微课费时传入: 1 单题微课  2 课程微课
          },
          callback: (result) => {
            hidePayloading();
            const returnJudge = window.$HandleAbnormalStateConfig(result);
            if (returnJudge && !returnJudge.isContinue) {
              return;
            }
            ;//如果异常 直接返回
            confirm({
              style: { marginTop: '16%' },
              className: 'alipay-confirm-modal',
              title: '支付宝付款是否已支付成功？',
              content: '',
              okText: '支付成功',
              cancelText: '支付失败',
              onOk() {
                let _query = { ...query };
                if (paySuccessCallback && typeof paySuccessCallback == 'function') {//直播支付成功之后回调
                  _query.isPaySuccess = 1
                  paySuccessCallback(_query);
                  return;
                }
                dispatch({
                  type: VideoPlayer + '/findQuestionVideoById',
                  payload: {
                    videoId: query.videoId,
                  },
                  callback: (response) => {
                    // if (response) {
                    //   let _query = {...query};
                    //   _query.equities = 1;
                    //   replaceSearch(dispatch, location, _query)
                    //   message.success('支付宝支付成功')
                    // } else {
                    //   message.success('支付宝支付失败，请重试')
                    // }
                    if (response && response.isBuy == 1) {
                      dispatch({
                        type: VideoPlayer + '/saveState',
                        payload: {
                          Videoloading: true
                        },
                      })
                      dispatch({
                        type: VideoPlayer + '/saveState',
                        payload: {
                          Videoloading: false
                        },
                      })
                      // query.isBuy = 1
                      replaceSearch(dispatch, location, _query)
                      message.success('支付宝支付成功')
                    } else {
                      message.success('支付宝支付失败，请重试')
                    }
                  }
                })
              },
              onCancel() {
              },
            });
          }
        })
      } else {
        this.setState({ payWay: 'weixin' });
        handleLevelState()
      }
    }
    //关闭支付窗口
    const ShutDownPayment = () => {
      clearInterval(this.timer)
      this.setState({
        levelState: !levelState,
        payWay: undefined,
      })
    }
    return (
      <div id={styles['reportPay']}>
        {
          levelState ?
            <div className={styles['payBoxPlan']}>
              <div className={styles['back']}>
                <p>{payWay != 'weixin' ? '选择支付方式' : '微信支付'}</p>
                <CloseOutlined onClick={ShutDownPayment} style={{ fontSize: '30px', color: '#888888', cursor: 'pointer' }} />

              </div>
              <div className={styles['prompt']}>
                <div className={styles['prompt-flex']}>
                  <ExclamationCircleOutlined style={{ fontSize: '30px', color: '#FFD65A', }} />
                  <p>本商品属于数据内容服务，一经购买成功，不可退款！</p>
                </div>
              </div>
              <div className={styles['thirdPartyBoard']}>
                {payWay != 'weixin' ? <div className={styles['BoardBox']}>
                  {
                    ['icon-weixinzhifu2', 'icon-zhifubao1-copy'].map((item, index) => {
                      return (
                        <div key={index} onClick={() => aliPay(index)} className={styles['boardFont']}>
                          <IconFont type={item} style={{ fontSize: '50px' }} />
                          <span>{index ? '支付宝支付' : '微信支付'}</span>
                        </div>
                      )
                    })
                  }
                </div> :
                  <div className={styles['weCharQR']}>
                    <div id='weixinPayQrcodeReport' />
                    <span style={{ color: '#77C6FF', fontSize: '15px', marginTop: '10px' }}>微信扫描支付</span>
                  </div>}
              </div>
            </div>
            :
            <div className={styles['payBox']}>
              <div style={{ display: 'flex' }}>
                <div className={styles['videoNoPlayer-box']} onClick={handleLevelState}>¥{price}元解锁</div>
                <div className={styles['videoNoPlayer-box']} onClick={gotoPayCenter}>会员解锁</div>
              </div>
              {/* <div className={styles['videoNoPlayer-box']} onClick={gotoPayCenter}>开通会员</div> */}
              <p>会员专享功能，开通会员免费观看！</p>
              {/* <div className={styles['videoNoPlayer-box']} onClick={handleLevelState}>¥{price}元&nbsp;&nbsp;解锁观看</div> */}
              {/* <p>微课解析更全面哦，快来解锁试试吧！</p> */}
              {/* <div className={styles['videoNoPlayer-box']}>
                <div className={styles['box-top']}>
                  <p className={styles['p-1']}>{price}元/个</p>
                  <p>微课解析更全面哦，快来解锁试试吧！</p>
                </div>
                <div className={styles['box-bottom']}>
                  <div className={styles['box-button1']} >取消</div>
                  <div className={styles['box-button2']} onClick={handleLevelState}>解锁</div>
                </div>
              </div> */}
              {/* <div>提示</div>
              <div>会员专享，学情报告可单个收费</div>
              <div>
                <Button onClick={handleLevelState}>{price}元解锁</Button>
                <Button onClick={gotoPayCenter}>开通会员</Button>
              </div> */}
            </div>
        }
      </div>
    )
  }
}
