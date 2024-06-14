/**
* 正在开发中,敬请期待页面
* @author:张江
* @date:2020年09月15日
* @version:v1.0.0
* */
import React, { createElement } from 'react';
import classNames from 'classnames';
import { Button } from 'antd';
import styles from './index.less';

class LookingForward extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      currentSeconds: 5,
    };
  }


  componentDidMount() {
    const { currentSeconds } = this.state
    this.setTimeoutTimer = setTimeout(() => {//定时器返回
      clearTimeout(this.setTimeoutTimer)
      window.history.go(-1);
    }, Number(currentSeconds) * 1000)
    //  计算秒数的值
    let tempCurrentSeconds = currentSeconds;
    this.setIntervalTimer = setInterval(() => {
      tempCurrentSeconds = tempCurrentSeconds - 1;
      this.setState({
        currentSeconds: tempCurrentSeconds,
      })
      if (tempCurrentSeconds == 0 || tempCurrentSeconds < 0) {
        clearInterval(this.setIntervalTimer)
      }
    }, 1000)
  }

  /**
* 页面组件即将卸载时：清空数据
*/
  componentWillUnmount() {
    clearInterval(this.setIntervalTimer)
    clearTimeout(this.setTimeoutTimer)
    this.setState = (state, callback) => {
      return;
    };

  }
  render() {
    const {
      className,
      backText = '返回首页',
      linkElement = 'a',
      actions,
      redirect = '/#/'
    } = this.props;
    const { currentSeconds } = this.state
    const clsString = classNames(styles.exception, className);
    return (
      <div className={clsString} >
        <div className={styles.imgBlock}>
          <div
            className={styles.imgEle}
            style={{ backgroundImage: `url(https://reseval.gg66.cn/looking-forward.png)` }}
          />
        </div>
        <div className={styles.content}>
          <h1>正在开发中,敬请期待...</h1>
          <div className={styles.desc}><span className={styles.seconds}>{currentSeconds}s</span>后将返回前一页面</div>
          <div className={styles.actions}>
            {actions ||
              createElement(
                linkElement,
                {
                  to: redirect,
                  href: redirect,
                },
                <Button type="primary">{backText}</Button>
              )}
          </div>
        </div>
      </div>
    );
  }
}

export default LookingForward;
