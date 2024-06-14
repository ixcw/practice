/**
 * 视频播放-解决部分浏览器或低版本不兼容Hls问题
 * @author:张江
 * @date:2021年10月22日
 * @version:v1.0.0
 * */
import React, { Component } from 'react';
import videojs from 'video.js'
import "video.js/dist/video-js.css";

export default class VideoNotHlsPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {}
    this.player = null
  }

  componentDidMount() {
    const { src, videoEndedCallback,updateVideoNumById } = this.props;
    if (src) {
      this.player = videojs("myVideoPlayer", {
        controls: true,
        loop: false,
        autoplay: false,
      }, function onPlayerReady() {
        // this.play();
        // How about an event listener?
        this.on('ended', function () {
          if (videoEndedCallback && typeof videoEndedCallback == 'function') {
            videoEndedCallback();
          }
        });
        this.on('play', function () {//开始播放
          console.log('播放');
          //播放次数上传
          updateVideoNumById()
        });
      });
      // this.player.controls(true)
      this.player.src(src)
    }
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();//从播放器中删除所有事件侦听器。删除播放器的DOM元素
    }
  }

  render() {
    return (
      <video id="myVideoPlayer" className="video-js vjs-default-skin video" style={{ width: '100%', height: '650px' }}></video>
    );
  }
}
