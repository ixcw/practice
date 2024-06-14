/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2021/1/25
 *@Modified By:
 */
import React from 'react'
import styles from './reportPay.less'
import {Button, message, Modal} from 'antd'
import {replaceSearch, getLocationObj, pushNewPage, getIcon, generateQRCode, existArr} from '@/utils/utils'
import {RollbackOutlined} from '@ant-design/icons';
import {PayCenter as namespace} from '@/utils/namespace'
import {connect} from 'dva'

const {confirm} = Modal;
const IconFont = getIcon();
@connect(state => ({
  goodsList: state[namespace].goodsList,//报告价格
}))
export default class ReportPay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      levelState: false,//一元支付窗口开关
      orderNum: '',//二维码编号
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    const {levelState} = this.state;
    const {dispatch, location, goodsList = ''} = this.props;
    const {query} = getLocationObj(location) || {}
    const hidePayloading = () => message.loading('正在启动支付,请稍候...', 10);
    const price = existArr(goodsList)&&goodsList[0] ? goodsList[0].price : ''


    /**
     *获取订单状态
     */
    const getOrderInfoStatus = (orderNum) => {
      const {dispatch} = this.props;
      if (orderNum) {
        dispatch({
          type: namespace + '/getOrderInfoStatus',
          payload: {
            outTradeNo: orderNum,
          },
          callback: (result) => {
            if (result && result.trade_state == 'SUCCESS') {//预下单支付成功的情况下
              let _query = {...query};
              _query.equities = 1;
              replaceSearch(dispatch, location, _query)
              message.success('微信支付成功')
            }
          }
        })
      }
    }


    /**
     * 点击进入一元支付或者返回
     */
    const handleLevelState = () => {
      //清除定时器
      if (this.timer) {
        clearInterval(this.timer)
      }
      if (!levelState) {
        dispatch({
          type: namespace + '/weixinPaySign',
          payload: {
            goodsType: 5,
            code: query.jobId,
          },
          callback: (result) => {
            const returnJudge = window.$HandleAbnormalStateConfig(result);
            if (returnJudge && !returnJudge.isContinue) {
              return;
            }
            ;//如果异常 直接返回
            const {out_trade_no, url} = result || {};
            this.setState({levelState: !levelState})
            generateQRCode("weixinPayQrcodeReport", url);//生成支付二维码
            this.setState({orderNum: out_trade_no},
              () => {
                this.timer = setInterval(() => getOrderInfoStatus(out_trade_no), 3000);
              })
          }
        })
      } else {
        this.setState({levelState: !levelState})
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
      if (index === 1) {
        dispatch({
          type: namespace + '/aliPaySign',
          payload: {
            goodsType: 5,
            code: query.jobId,
          },
          callback: (result) => {
            hidePayloading();
            const returnJudge = window.$HandleAbnormalStateConfig(result);
            if (returnJudge && !returnJudge.isContinue) {
              return;
            }
            ;//如果异常 直接返回
            confirm({
              style: {marginTop: '16%'},
              className: 'alipay-confirm-modal',
              title: '支付宝付款是否已支付成功？',
              content: '',
              okText: '支付成功',
              cancelText: '支付失败',
              onOk() {
                dispatch({
                  type: namespace + '/isBuyGoods',
                  payload: {
                    code: query.jobId,
                    goodsType: 5
                  },
                  callback: (response) => {
                    if (response) {
                      let _query = {...query};
                      _query.equities = 1;
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
      }
    }
    return (
      <div id={styles['reportPay']}>
        {
          levelState ?
            <div className={styles['payBoxPlan']}>
              <div className={styles['back']} onClick={handleLevelState}><RollbackOutlined
                style={{fontSize: '30px', color: '#888888'}}/></div>
              <div className={styles['thirdPartyBoard']}>
                <div className={styles['BoardBox']}>
                  {
                    ['icon-weixinzhifu2', 'icon-zhifubao1-copy'].map((item, index) => {
                      return (
                        <div key={index} onClick={() => aliPay(index)} className={styles['boardFont']}>
                          <IconFont type={item} style={{fontSize: '50px'}}/>
                        </div>
                      )
                    })
                  }
                </div>
                <div className={styles['weCharQR']}>
                  <div id='weixinPayQrcodeReport'/>
                  <span style={{color: '#92e950', fontSize: '15px', marginTop: '10px'}}>微信扫描支付</span>
                </div>
              </div>
            </div>
            :
            <div className={styles['payBox']}>
              <div>提示</div>
              <div>会员专享，学情报告可单个收费</div>
              <div>
                <Button onClick={handleLevelState}>{price}元解锁</Button>
                <Button onClick={gotoPayCenter}>开通会员</Button>
              </div>
            </div>
        }
      </div>
    )
  }
}
