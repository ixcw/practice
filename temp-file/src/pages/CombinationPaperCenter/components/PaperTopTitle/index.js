/**
* 预览导出-答题卡以及试卷顶部标题
* @author:张江
* @date:2020年08月31日
* @version:v1.0.0
* */

// eslint-disable-next-line
import React from 'react';
import PropTypes from 'prop-types';
import { ExclamationCircleFilled } from '@ant-design/icons';
// import { uppercaseNum } from '@/utils/utils';
import classNames from 'classnames';
import styles from './index.less';

export default class BigTopicInfo extends React.Component {
  static propTypes = {
    paperName: PropTypes.string.isRequired,//信息
    subTitle: PropTypes.string,//信息
    isEdit: PropTypes.bool,//是否可编辑
  };


  constructor() {
    super(...arguments);
    this.state = {};
  }

  render() {
    const {
      paperName,
      subTitle,
      isEdit=false,
    } = this.props;

    return (
      <div className={styles['paper-header-box']}>
        <h2 className='paper-title'>
          {/* contentEditable="true" suppressContentEditableWarning="true" */}
          {
            isEdit ? <span >
              {paperName || ''}
            </span> : <span>
                {paperName || ''}
              </span>
          }
          {
            subTitle ? <span>
              {subTitle}
            </span> : null
          }
          {
            isEdit ? <div className={classNames(styles['tip-info'], 'no-print')}>
              <ExclamationCircleFilled />  点击标题可编辑
                                </div>:null
          }
         
        </h2>
      </div>
    )
  }
}

