/**
 * 视频播放器
 * @author:熊伟
 * @date:2020年9月1日
 * @version:v1.0.0
 * */
import React, { Component } from 'react';
import styles from './Video.less';
import { Player } from 'video-react'
import queryString from 'query-string';
import { connect } from 'dva';
import Hls from 'hls.js';
import { VideoPlayer as namespace } from '@/utils/namespace';
import { LoadingOutlined, LeftOutlined } from '@ant-design/icons';
import VideoPay from '@/components/VideoPay';
import 'video-react/dist/video-react.css';
import HLSSource from './HLSSource.js';
import VideoNotHlsPlayer from './VideoNotHlsPlayer.jsx';
// import PlayList from './components/playList';
@connect(state => ({
}))
export default class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoUrl: '',
      isBuy: undefined
    }
  }
  updateVideoNumById(){
    const { location,dispatch } = this.props;
    const { search } = location;
    const query = queryString.parse(search);
    dispatch({
      type: namespace + '/updateVideoNumById',
      payload: {
        videoId: query.videoId,
        videoType: query.videoType,
      },
    })
  }

  componentDidMount() {
    const { videoUrl, isBuy } = this.props;
    this.setState({ videoUrl: '', isBuy: undefined }, () => { this.setState({ videoUrl, isBuy }) })
  }
  render() {
    const { videoEndedCallback, videoHeight, location, isBuy, videoBg, videoName } = this.props;
    const { videoUrl } = this.state;
    const isSupportedHls = Hls?.isSupported();
    return (
      <div className={styles['video']}>
        {
          videoUrl && isBuy == 1 ?
            <div>
              {
                isSupportedHls ? <Player className={styles['videoPlayer']} height={'650px'} width={'100%'}>
                  <HLSSource
                    isVideoChild
                    videoEndedCallback={videoEndedCallback}
                    src={videoUrl}
                    videoBg={videoBg}
                    // updateVideoNumById={()=>{this.updateVideoNumById()}}
                  />
                </Player> :
                  <VideoNotHlsPlayer
                    videoEndedCallback={videoEndedCallback}
                    src={videoUrl}
                    videoBg={videoBg}
                    // updateVideoNumById={()=>{this.updateVideoNumById()}}
                  />
              }
            </div>
            :
            <div className={styles['videoNoPlayer']} style={{ height: videoHeight, backgroundImage: 'url(' + videoBg + ')' }}>
              {/* <div className={styles['back']} onClick={() => { window.history.go(-1) }}>&nbsp;<LeftOutlined />&nbsp;&nbsp;{videoName}</div> */}
              <div className={styles['mask']}>
                <VideoPay location={location} />
              </div>
            </div>
        }
        <div className={styles['back']} onClick={()=>{window.history.go(-1)}}><LeftOutlined />{videoName}</div>
      </div>
    )
  }
}
