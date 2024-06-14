/**
 * 视频播放器
 * @author:熊伟
 * @date:2020年9月1日
 * @version:v1.0.0
 * */
import React, { Component } from 'react';
import styles from './index.less';
import queryString from 'query-string';
import { connect } from 'dva';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { VideoPlayer as namespace } from '@/utils/namespace';
import { dealVideoNum } from '@/utils/utils';
import renderAnswerAnalysis from "@/components/RenderAnswerAnalysis/index";//渲染题目答案与解析部分
import BackBtns from '@/components/BackBtns/BackBtns'
import TopicContent from "@/components/TopicContent/TopicContent";
import { ReadOutlined } from '@ant-design/icons';
import Page from "@/components/Pages/page";
import PlayList from './components/playList';
import PlayLinkList from './components/playLinkList';
import Video from './components/Video';
@connect(state => ({
  Videoloading: state[namespace].Videoloading,
  Videolistloading: state[namespace].Videolistloading,
  loading: state[namespace].loading,
  videoParticulars: state[namespace].videoParticulars,
  findVideoById: state[namespace].findVideoById,
  videoList: state[namespace].videoList,
}))
export default class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoPlayingId: undefined,
      videoHeight: 0
    }
  }
  componentDidMount() {
    const { dispatch, location } = this.props;console.log(dispatch)
    const { search, pathname } = location;
    const query = queryString.parse(search);
    let offsetWidth1 = document.getElementById("videoPlayervideoWidth") && document.getElementById("videoPlayervideoWidth").offsetWidth;
    this.setState({
      videoHeight: offsetWidth1 * 0.56249
    })
    window.addEventListener('resize', () => {
      let offsetWidth = document.getElementById("videoPlayervideoWidth") && document.getElementById("videoPlayervideoWidth").offsetWidth;
      this.setState({
        videoHeight: offsetWidth * 0.56249
      })
    })
    dispatch({
      type: namespace + '/saveState',
      payload: {
        Videolistloading: true
      },
    })
    if (query.videoType == 2) {
      dispatch({
        type: namespace + '/findRelatedCourseById',
        payload: {
          videoId: query.videoId,
          page: query.p || 1,
          size: 6
        },
      })
    } else {
      dispatch({
        type: namespace + '/findQuestionVideoByQuestionId',
        payload: {
          videoId: query.videoId,
          page: query.p || 1,
          size: 6
        },
      })
    }
  }
  componentWillUnmount() {
    const { dispatch, location } = this.props;
    dispatch({
      type: namespace + '/saveState',
      payload: {
        videoList: undefined,
        findVideoById: undefined,
      },
    })
  }
  setStateUrl = (id) => {
    this.setState({ videoPlayingId: id })
  }
  render() {
    const { findVideoById = {}, videoList, loading, location, Videoloading, Videolistloading, videoParticulars = {} } = this.props;
    const isBuy = videoParticulars.isBuy || videoParticulars.isView
    const url = videoParticulars.video || videoParticulars.url
    const videoBg = videoParticulars.cover || videoParticulars.pngUrl
    const videoName = videoParticulars.name || videoParticulars.name
    const { search } = location;
    const query = queryString.parse(search);
    const { videoPlayingId, videoHeight } = this.state;
    const title = '视频中心';
    const breadcrumb = [title];
    const header = (
      <Page.Header breadcrumb={breadcrumb} title={title} />
    );
    return (
      <Page header={header} spinning={loading}>
        <div className={styles['videoPlayerLayout']}>
          <div className={styles['videoPlayerLayout-content']}>
            {/* {videoList && */}
            {/* <div className={styles['videoPlayerLayout-heade']}> */}
            {/* <Spin spinning={Videolistloading}> */}
            {/* <PlayList videoList={videoList} setStateUrl={this.setStateUrl} videoPlayingId={videoPlayingId} location={location} /> */}
            {/* </Spin> */}
            {/* </div> */}
            {/* } */}
            <div className={styles['videoPlayerLayout-main']}>
              <div className={styles['videoPlayerLayout-videoPlayer']} id='videoPlayervideoWidth'>
                {
                  !Videoloading ?
                    <Video
                      videoUrl={url}
                      isBuy={isBuy}
                      videoHeight={videoHeight}
                      videoBg={videoBg}
                      videoName={videoName}
                      location={location}
                    />
                    :
                    <div className={styles['videoPlayerLayout-videoNoPlayer']} style={{ height: videoHeight }}>
                      <LoadingOutlined style={{ color: '#fff' }} />
                    </div>
                }
              </div>
              {videoList &&
                <div className={styles['videoPlayerLayout-link']} style={{ height: videoHeight }}>
                  <PlayLinkList videoList={videoList} setStateUrl={this.setStateUrl} videoPlayingId={videoPlayingId} location={location} videoHeight={videoHeight} />
                </div>
              }
            </div>
            <div className={styles['videoPlayerLayout-p']}>
              <span className={styles['videoPlayerLayout-p-span1']} title={'视频名称：' + videoParticulars.name}>视频名称：{videoParticulars.name}</span>
              <span title={'播放量：' + dealVideoNum(videoParticulars.num)}>播放量：{dealVideoNum(videoParticulars.num)||0}</span>
            </div>
            {
              query.videoType != 2 ?
                <div className={styles['videoPlayerLayout-topic']}>
                  <TopicContent
                    topicContent={videoParticulars.question}
                    contentFiledName={'content'}
                    optionsFiledName={"optionList"}
                    optionIdFiledName={"code"} />
                  <div>
                    <p style={{ fontSize: '16px' }}>
                      <ReadOutlined style={{ color: 'rgba(99, 161, 234, 1)', fontSize: '21px' }} />
                      <span>&nbsp;&nbsp;知识点：</span>
                      <span style={{ fontSize: '12px' }}>{videoParticulars.question && videoParticulars.question.knowName}</span>
                    </p>
                    {renderAnswerAnalysis(videoParticulars.question || {}, 1)}
                  </div>
                </div> : ''
            }
          </div>
          <BackBtns
            isBack={true}
            styles={{ bottom: '100px', right: '120px' }}
          />
        </div>
      </Page>
    )
  }
}



