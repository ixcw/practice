/**
 * 视频
 * @author:熊伟
 * @date:2020年9月1日
 * @version:v1.0.0
 * */
import React, { Component } from 'react';
import Hls from 'hls.js';
import {
  openNotificationWithIcon,
} from "@/utils/utils";
export default class HLSSource extends Component {
  constructor(props, context) {
    super(props, context);
    this.hls = new Hls();
  }

  componentDidMount() {
    // `src` is the property get from this component
    // `video` is the property insert from `Video` component
    // `video` is the html5 video element
    const { src, video, videoEndedCallback, updateVideoNumById, videoBg } = this.props;
    // load hls video source base on hls.js
    if (Hls.isSupported()) {
      this.hls.loadSource(src);
      this.hls.attachMedia(video);
      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // video.play();
        video.poster = videoBg
      });
      video.addEventListener('play', function () {//开始播放
        console.log('播放');
        //播放次数上传
        updateVideoNumById()
      });
      video.addEventListener('ended', function () { //监听播放是否结束
        if (videoEndedCallback && typeof videoEndedCallback == 'function') {
          videoEndedCallback();
        }
      }, false);
    } else {
      openNotificationWithIcon('warning', '视频播放失败！', 'rgba(0,0,0,.85)', '当前浏览器不支持视频解析播放或者浏览器版本不支持视频解析播放，请下载最新谷歌浏览器或更新浏览器版本后再试！', 6)
    }
  }

  componentWillUnmount() {
    // destroy hls video source
    if (this.hls) {
      this.hls.destroy();
    }
  }

  render() {
    return (
      <source

        src={this.props.src}
        type={this.props.type || 'application/x-mpegURL'}
      />
    );
  }
}
