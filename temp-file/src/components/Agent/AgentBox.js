/**
 *@Author:xiongwei
 *@Description:代理--盒子
 *@Date:Created in  2021/7/8
 *@Modified By:
 */
import React from 'react';
import styles from './AgentBox.less';
export default class AgentBox extends React.Component {
  constructor(props) {
    super(...arguments);
    this.state = {
    }
  }
  render() {
      const {title,subTitle=0}=this.props;
    return (
          <div className={styles['wrap']}>
              <h1>{title}</h1>
              <h2>{subTitle}</h2>
          </div>
    )
  }
}