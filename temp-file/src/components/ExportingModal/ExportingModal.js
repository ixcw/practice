/**
 * 正在导出提示弹框组件
 * @author:张江
 * date:2020年08月29日 
 * */
// eslint-disable-next-line
import React from 'react';
import { Modal } from 'antd';
import styles from './ExportingModal.less';
import PropTypes from 'prop-types'
import lottieWeb from 'lottie-web';

export default class ExportingModal extends React.Component {

  static propTypes = {
    visibleModal: PropTypes.bool.isRequired,//是否显示弹框
    visibleModalMsg: PropTypes.string,//文字提示信息
  };
  constructor(props) {
    super(...arguments);
    this.state = {

    };
  };

  componentDidMount() {
    this.props.onRef(this);
  }

  // 展示提示信息加载
  showLoadingTip = () => {
    if (!this.timeoutTimer) {
      this.timeoutTimer = setTimeout(() => {
        lottieWeb.loadAnimation({//动画效果
          container: document.getElementById('lottie-animation'),
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: '//reseval.gg66.cn/line.json'
        })
      }, 500)
    }
  }

  render() {
    const { visibleModal, visibleModalMsg } = this.props
    return (
      <Modal
        closable={false}
        className={styles['ant-modal-box']}
        visible={visibleModal}
        footer={null}
        width='320px'
        style={{ top: 240 }}
      >
        <div className={styles['create-print-report-modal']}>
          <div id="lottie-animation"> </div>
          <p>{visibleModalMsg}</p>
        </div>
      </Modal>
    );
  }
}
