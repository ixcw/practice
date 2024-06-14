/**
 * 微信扫码付款弹窗组件
 * @author:张江
 * date:2021年01月11日
 * */
// eslint-disable-next-line
import React from 'react';
import {
  Modal,
} from 'antd';
import styles from './WeixinPayModal.less';
import PropTypes from 'prop-types';
import { generateQRCode } from '@/utils/utils'

export default class WeixinPayModal extends React.Component {

  static propTypes = {
    weixinPayVisible: PropTypes.bool.isRequired,//是否显示微信支付
    hideWeixinPayVisible: PropTypes.func.isRequired,//隐藏弹窗
    PayInfo: PropTypes.object.isRequired,//支付信息
  };

  constructor(props) {
    super(...arguments);
    this.state = {};
  };

  componentDidMount() {
    const { PayInfo = {} } = this.props;
    generateQRCode("weixinPayQrcode", PayInfo.weixinQr);//生成支付二维码
  }
  render() {
    const { weixinPayVisible, hideWeixinPayVisible = () => { }, PayInfo = {} } = this.props;

    return (<Modal
      wrapClassName={styles['weixin-pay-modal']}
      title={PayInfo.title}
      style={{ top: '25%' }}
      visible={weixinPayVisible}
      onCancel={() => {
        hideWeixinPayVisible();
      }}
      maskClosable={false}
      footer={null}
      destroyOnClose
    >
      <div className='weixin-content'>
        <div className='weixin-pay-info'>
          {/* <div>2021年01月31日到期</div> */}
          <span>￥{PayInfo.price}</span>
        </div>
        <div className='weixin-qr'>
          {/* <img src={PayInfo.weixinQr} alt=''/> */}
          <div id='weixinPayQrcode'></div>
          <p>{PayInfo.payTitle || '微信'}扫码支付</p>
        </div>
      </div>
    </Modal>);
  }
}
