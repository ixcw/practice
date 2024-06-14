/**
 * 会员服务协议
 * @author:张江
 * date:2021年01月11日
 * */
import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Table } from 'antd';
import styles from './MSAgreement.less';

export default function MSAgreement({ hideModal, visible, closeModal, buttonVisible = true }) {

  return (<Modal width="950px" wrapClassName={styles.agreement}
    style={{ top: 50 }}
    visible={visible}
    onCancel={closeModal}
    maskClosable={false}
    title="会员服务协议"
    footer={null}>
    <div>
      <h3>一、服务条款的确认和接受</h3>
      <p style={{ fontWeight: 'bold' }}>以下包含的支付类型：VIP会员付费；</p>
      <p>1.1 VIP会员付费：用户通过在线购买{window.$systemTitleName}VIP会员前，请阅读本协议并点选"请先阅读并同意《会员服务协议》"选框，即表示用户与贵州树精英教育科技有限责任公司已达成一致意见，自愿接受本协议的所有内容。
        <span>如果用户不同意接受本协议的约束，请不要点选该选框以及进行下一步操作。</span>
      </p>
      <h3>二、购买服务内容</h3>
      <p>2.1 购买一旦确认成功，购买VIP服务不得无理由退换。<br />
          2.2 会员付费制分学段：小学、初中、高中、专升本（一次购买付费只能购买一个学段，若想开通其他学段会员，需切换学段之后自行付费购买该学段；）<br />
      </p>
      <h3>三、权利义务</h3>
      <p>3.1 您同意并授我方为履行本协议之目的收集您的用户信息，这些信息包括您在实名注册系统中注册的信息、您账号下的数据以及其他您在使用服务的过程中向我方提供或我方基于安全、用户体验优化等考虑而需收集的信息，我方对您的用户信息的收集将遵循本协议及相关法律的规定。<br />
           3.2 购买成功后仅在“{window.$systemTitleName}”平台享受相应的服务。<br />
          3.3 用户充值时，须仔细确认自己的帐号及信息，若因用户自身输入帐号错误、操作不当、不了解或未充分了解计费方式等因素而损害自身权益，不得因此要求{window.$systemTitleName}作任何补偿或赔偿。<br />
          3.4 用户在购买时使用其他第三方支付企业提供的服务的，应当遵守与该第三方的各项协议及其服务规则；在使用第三方支付服务过程中用户应当妥善保管个人信息，包括但不限于银<br />
          3.5 因{window.$systemTitleName}系统故障造成用户购买服务出错，在{window.$systemTitleName}平台恢复、存有有效数据和用户提供合法有效凭证的情况下，{window.$systemTitleName}将根据用户购买情况作出如下变动及补救措施：<br />
            &nbsp; &nbsp; &nbsp; &nbsp;3.5.1 因{window.$systemTitleName}系统故障造成系统购买额小于用户实际购买额的，{window.$systemTitleName}予以补其差额；<br />
             &nbsp; &nbsp; &nbsp; &nbsp;3.5.2 因{window.$systemTitleName}系统故障造成系统购买额大于用户实际购买额的，{window.$systemTitleName}有权追回差额。<br />

      </p>
      <h3>四、特别说明</h3>
      <p> 4.1 VIP服务时长特别说明：会员资格以月为单位计算（每月按30天计算），用户应通过一次性支付的方式购买会员服务。一个月按30天计算，例如：用户A于2021年1月1日购买了VIP一个月套餐，则VIP使用的有效期为：2021.1.1-2021.1.30。<br />
      </p>
      <h3>五、注意事项</h3>
      <p>5.1 鉴于{window.$systemTitleName}VIP会员服务的特殊性质，本协议中购买的服务属于<span>不宜退货的商品，不适用无理由退货规定；</span><br />
          5.2 用户在购买VIP服务前请确认知道并同意上述条款后，再行购买VIP会员服务；<br />
          5.3 {window.$systemTitleName}拥有本协议条款最终解释权。<br />
      </p>

    </div>
    {
      buttonVisible ? <Button type="primary" size="large" onClick={hideModal}>已阅读</Button>
        : <Button type="primary" size="large" onClick={() => { closeModal(1) }}>已阅读并同意付款协议</Button>
    }

  </Modal>);
}

MSAgreement.propTypes = {
  hideModal: PropTypes.func,
  closeModal: PropTypes.func,
  visible: PropTypes.bool,
};
