/**
 * 微课列表组件 - 添加直播
 * @author:熊伟
 * @date:2021年11月11日
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
import { LiveManage as namespace } from "@/utils/namespace";
import { getIcon, formatSecondsToHMS, pushNewPage, timeTransformation, existArr, openingThirdPartyApp } from '@/utils/utils';

const IconFont = getIcon();

@connect(state => ({

}))
export default class MicroItemVideo extends React.Component {
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

  /**
* 计数-直播播放计数
* @param id  ：id
*/
  playToCount = (id) => {
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: namespace + '/playToCount',
      payload: {
        id: id,
      }
    });
  }

  render() {
    const {
      location,
      dispatch,
      mItem = {},
      stylesClassName = 'item-3',
      onClickToSee = () => { },
    } = this.props;
    const keywords = mItem.keyword ? mItem.keyword.split(';') : []
    return (
      <div className={classNames(styles['micro-item'], styles[stylesClassName])} onClick={() => {
        if (mItem?.isFromLive) {
          this.playToCount(mItem?.liveId)
          // if (mItem.openType == 2) {
          //   if (mItem.liveUrl) openingThirdPartyApp(mItem.liveUrl);
          // } else {
            pushNewPage({ id: mItem.liveId }, '/watch-live', dispatch)
          // }
        } else {
          pushNewPage({ videoId: mItem.id, videoType: 2 }, '/video', dispatch)
        }
      }}>
        <div
          className={styles['image-box']}
        //  style={{backgroundImage: 'url(' + mItem.cover + ' )'}}
        >
          <img src={mItem.cover} alt={mItem.cover || ''} />
          <div className={styles['time']}>{mItem.videoTime ? timeTransformation(mItem.videoTime) : mItem.duration ? mItem.duration + '分钟' : ''}</div>
        </div>
        <div className={styles['micro-course-info']}>
          {
            mItem.describe ? <h1 title={mItem.describe}>
              <span>{mItem.describe}</span>
              
              {
                mItem?.isFromLive && mItem?.liveStatus != 1 ? <span className={styles['launched']}>待开播</span>:null
              }
              </h1> : null
          }
          {
            existArr(keywords) ? <div className={styles['micro-course-info-keywords']}>
              {
                keywords.map((item, index) => {
                  return item && <div key={index} title={item}>{item}</div>
                })
              }
            </div> : null
          }
          <div className={styles['micro-course-info-details']}>
            <div className={styles['name']}>
              {mItem.subjectName ? <div>{mItem.subjectName}</div> : null}
              <span title={mItem.teacherName}>{mItem.teacherName}</span>
            </div>
            {
              mItem?.startTime ? <p title={mItem?.startTime} style={{maxWidth:'128px'}}>{mItem?.liveStatus == 1 ? '直播中' : mItem?.startTime}</p> :
                <p title={mItem.createTime.substring(0, 10)}>{mItem.createTime.substring(0, 10)}</p>
            }
          </div>
        </div>
      </div>
    )
  }
}

