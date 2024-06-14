/**
 * 微课列表组件
 * @author:张江
 * @date:2020年08月20日
 * @version:v1.0.0
 * */

// eslint-disable-next-line
import React from 'react';
import {
  Tooltip,
} from 'antd';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import { connect } from "dva";
import classNames from 'classnames';
import styles from './MicroItem.less';
import { getIcon, formatSecondsToHMS, pushNewPage, dealVideoNum} from '@/utils/utils';

const IconFont = getIcon();

@connect(state => ({

}))
export default class MicroItem extends React.Component {
  static propTypes = {
    stylesClassName: PropTypes.string,//类名
    mItem: PropTypes.object.isRequired,//数据对象
    onClickToSee: PropTypes.func,//点击查看视频
  };


  constructor() {
    super(...arguments);
    this.state = {

    };
  }

  render() {
    const {
      location,
      dispatch,
      mItem = {},
      stylesClassName = 'item-3',
      onClickToSee = () => { },
    } = this.props;

    return (
      <div className={classNames(styles['micro-item'], styles[stylesClassName])} onClick={() => { pushNewPage({ videoId: mItem.id }, '/video', dispatch) }}>
        <div className={styles['image-box']}>
          <img src={mItem.pngUrl} alt={mItem.name || ''} />
          <IconFont type={'icon-bofanganniu1'} className={styles['play']} />
        </div>
        <div className={styles['micro-course-info']}>
          <div className={styles['info-box']}>
            <span> <IconFont type={'icon-shichang1'} style={{ fontSize: 12 }} /> {formatSecondsToHMS(mItem.videoTime)}</span>
            <span><IconFont type={'icon-EyeIcon1'} style={{ fontSize: 12 }} /> {dealVideoNum(mItem.num)}</span>
          </div>
          <Tooltip placement="top" title={mItem.name}>
            <h3>{mItem.name || '暂无标题'}</h3>
          </Tooltip>
        </div>
      </div>
    )
  }
}
