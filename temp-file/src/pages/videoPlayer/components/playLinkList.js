/**
 * 视频播放链接列表
 * @author:熊伟
 * @date:2020年9月1日
 * @version:v1.0.0
 * */
import React, { Component } from 'react';
import styles from './playLinkList.less';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Spin } from 'antd';
import { VideoPlayer as namespace } from '@/utils/namespace';
import { getIcon, dealVideoNum, timeTransformation } from "@/utils/utils";
import { RightSquareOutlined, LoadingOutlined } from '@ant-design/icons';
const IconFont = getIcon();
@connect(state => ({
    loading: state[namespace].Videolistloading,
}))
export default class PlayLinkList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onOff: true//是否可以下拉刷新
        }
    }
    onScroll = (e) => {
        const { videoHeight, videoList, location, dispatch, pathname, loading } = this.props;
        let onOff = !loading;

        const { search } = location;
        const query = queryString.parse(search);

        const { data = [] } = videoList
        let s = data.length
        //每个盒子高125底部显示高为17.778
        const heights = data.length * 125 - videoHeight + 17.778
        const scrollTop = document.getElementById("playLinkListonScrollHight").scrollTop;
        if (data.length == videoList.total) {
            onOff = false
            this.setState({
                onOff: false
            })
        }
        if (Math.abs(heights - scrollTop) < 15) {

            if (onOff) {
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
                            size: s + 2
                        },
                    })
                } else {
                    dispatch({
                        type: namespace + '/findQuestionVideoByQuestionId',
                        payload: {
                            videoId: query.videoId,
                            page: query.p || 1,
                            size: s + 2
                        },
                    })
                }
            }

        }
    }
    render() {
        const { loading, videoList = {}, setStateUrl, videoPlayingId, dispatch, location, pathname } = this.props;
        const { onOff } = this.state;
        const { search } = location;
        const query = queryString.parse(search);
        //点击播放
        const clickPlay = (id) => {
            setStateUrl(id);
            dispatch(routerRedux.push({
                pathname,
                search: queryString.stringify({ ...query, videoId: id, })
            }));
        }
        return (

            <div className={styles['playLinkList']} onScroll={this.onScroll} id='playLinkListonScrollHight'>
                {/* <Spin spinning={!!loading} className={styles['Spin']}></Spin> */}
                {
                    videoList.data && videoList.data.map(({ id, name, teacherName, cover, pngUrl, videoTime, keyword, describe, openTime, num }, index) => {
                        const bg = pngUrl || cover
                        // const bg=pngUrl||cover
                        return (
                            <div
                                className={styles['playLinkList-item']}

                                key={index}
                            >
                                <div
                                    className={styles['playLinkList-item-img']}
                                    onClick={() => { clickPlay(id) }}
                                    style={{ backgroundImage: 'url(' + bg + ')' }}
                                    title='点击播放'
                                >
                                    <p className={styles['playList-content-item-bottom']}>
                                        {timeTransformation(videoTime)}
                                    </p>
                                </div>
                                <div
                                    className={styles['playLinkList-item-info']}
                                >
                                    <div className={styles['h1']} title={describe || name}>{describe || name}</div>
                                    <div
                                        className={styles['playLinkList-item-label']}
                                    >
                                        {
                                            keyword ? keyword.split(';').map((item, index) => {
                                                return <div key={index}>{item}</div>

                                            }) : ''
                                        }
                                    </div>

                                    <div className={styles['playLinkList-item-name']}>
                                        <div className={styles['left']}>
                                            {/* <div className={styles['HeadPortrait']}></div> */}
                                            <p>{teacherName ? teacherName : <span><RightSquareOutlined />{dealVideoNum(num)}</span>}</p>
                                        </div>
                                        <p>{openTime && openTime.substring(0, 10)}</p>
                                    </div>
                                </div>
                            </div>
                            // <div className={styles['playLinkList-item']} key={index} onClick={() => { clickPlay(id) }}>
                            //     <p title={name}>{name}</p>
                            //     <p style={{ color: '#898989' }} title={'播放次数：' + dealVideoNum(num)}>
                            //         {/* {videoPlayingId === id ? <LoadingOutlined /> : <RightSquareOutlined />} */}
                            //         <RightSquareOutlined />
                            //         {dealVideoNum(num)}
                            //         </p>
                            // </div>
                        )
                    })
                }

                {videoList.total >= 5 && <span style={{ fontSize: '10px' }}>{onOff ? <Spin /> : '没有更多了...'}</span>}
            </div>

        )
    }
}