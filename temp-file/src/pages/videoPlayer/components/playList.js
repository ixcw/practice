/**
 * 视频播放列表
 * @author:熊伟
 * @date:2020年9月1日
 * @version:v1.0.0
 * */
import React, { Component } from 'react';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { VideoPlayer as namespace } from '@/utils/namespace';
import styles from './playList.less';
import { getIcon, formatSecondsToHMS, dealVideoNum } from "@/utils/utils";
import { RightOutlined, LeftOutlined, PlayCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
const IconFont = getIcon();
@connect(state => ({
}))
export default class PlayList extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        const { videoList = {}, setStateUrl, videoPlayingId, dispatch, location, pathname } = this.props;
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
        //改变页码
        const changePage = (page) => {
            let p = query.p ? query.p : 1;
            p = Number(p)
            if (page === '+') {
                if (p < Math.ceil(videoList.total / 5)) {
                    p = p + 1
                }
            }
            if (page === '-') {
                if (p > 1) {
                    p = p - 1
                }
            }
            dispatch(routerRedux.push({
                pathname,
                search: queryString.stringify({ ...query, p, })
            }));
        }
        return (
            <div className={styles['playList']}>
                <div className={styles['playList-left-right']} onClick={() => { changePage('-') }} title='上一页'>
                    <LeftOutlined />
                </div>
                {
                    videoList ?
                        <div className={styles['playList-content']}>
                            {
                                videoList.data && videoList.data.map(({ id, videoTime, num, name, pngUrl }, index) => {
                                    return (
                                        <div
                                            className={styles[videoList.data.length && videoList.data.length < 6 ? 'playList-content-item-i' : 'playList-content-item']}
                                            key={index}
                                            onClick={() => { clickPlay(id) }}
                                            style={{ backgroundImage: 'url(' + pngUrl + ')' }}
                                            title='点击播放'
                                        >
                                            <div className={styles['playList-content-item-play']}>
                                                {/* {videoPlayingId === id ? <LoadingOutlined style={{ color: '#fff' }} /> : <PlayCircleOutlined style={{ color: '#fff' }} />} */}
                                                <PlayCircleOutlined style={{ color: '#fff' }} />
                                            </div>
                                            <div className={styles['playList-content-item-bottom']}>
                                                <p title={'播放次数：' + dealVideoNum(num)}><PlayCircleOutlined />{dealVideoNum(num)}</p>
                                                <p title={'视频时长：' + formatSecondsToHMS(videoTime)}>{formatSecondsToHMS(videoTime)}</p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div> :
                        <Spin />
                }
                <div className={styles['playList-left-right']} onClick={() => { changePage('+') }} title='下一页'>
                    <RightOutlined />
                </div>
            </div>
        )
    }
}