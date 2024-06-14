/**
* 参数显示区域组件
* @author:张江
* @date:2020年12月02日
* @version:v1.0.0
* */

// eslint-disable-next-line
import React from 'react';
import PropTypes from 'prop-types';
import styles from './ParametersArea.less';

export default class ParametersArea extends React.Component {
  static propTypes = {
    QContent: PropTypes.object.isRequired,//题目信息
    comePage: PropTypes.string,//来自哪个页面
    styleObject: PropTypes.object,//重置样式
  };


  constructor() {
    super(...arguments);
    this.state = {};
  }

  render() {
    const {
      QContent={},
      comePage,
      styleObject
    } = this.props;
    return (
      <div className={styles['parameters-area']}>
        <div className={styles['show']} style={styleObject}>
          <div>
                  <label>题号：</label>
                  <span>{QContent.id}</span>
            </div>
          {
            comePage == 'setParam' ? null : <div>
              <label>难度：</label>
              <span>{QContent.difficulty||'--'}</span>
            </div>
          }

          <div>
            <label>知识点：</label>
            {
              QContent.knowName ? <span>{QContent.knowName}</span>
                : <span style={{ color: '#faad14' }}>暂无(待设置)</span>
            }
          </div>
          <div>
            <label>关键能力：</label>
            {
              QContent.abilityName ? <span>{QContent.abilityName}</span>
                : <span style={{ color: '#faad14' }}>暂无(待设置)</span>
            }
          </div>
          <div>
            <label>核心素养：</label>
            {
              QContent.compName ? <span>{QContent.compName}</span>
                : <span style={{ color: '#faad14' }}>暂无(待设置)</span>
            }
          </div>
          <div>
            <label>认知层次：</label>
            {
              QContent.cognName ? <span>{QContent.cognName}</span>
                : <span style={{ color: '#faad14' }}>暂无(待设置)</span>
            }
          </div>
          <div>
            <label>知识维度：</label>
            {
              QContent.dimeName ? <span>{QContent.dimeName}</span>
                : <span style={{ color: '#faad14' }}>暂无(待设置)</span>
            }
          </div>
        </div>
      </div>
    )
  }
}

