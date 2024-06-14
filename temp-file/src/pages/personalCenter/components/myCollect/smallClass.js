/**
 * 个人中心-我的收藏-微课
 * @author:熊伟
 * @date:2020年8月22日
 * @version:v1.0.0
 * */
import React from 'react';
import queryString from 'query-string';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './smallClass.less';
import { getIcon, dealVideoNum } from "@/utils/utils";
import { PersonalCenter as namespace } from '@/utils/namespace';
import { Pagination, Empty, message } from 'antd';
import { collectionType } from '@/utils/const';
const IconFont = getIcon();
@connect(state => ({
    videoCollect: state[namespace].videoCollect,
    myCollectLoading: state[namespace].myCollectLoading,
}))
export default class SmallClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    //点击切换页码
    pageChange = (page, pageSize) => {
        const { dispatch, location, pathname } = this.props;
        const { search } = location;
        const query = queryString.parse(search);
        dispatch(routerRedux.push({
            pathname,
            search: queryString.stringify({ ...query, p: page, s: pageSize })
        }));
    }
    render() {
        const { type, dispatch, videoCollect } = this.props;
        //点击取消收藏
        const clickCancleCollece = (id, subjectId, e) => {
            e.nativeEvent.stopImmediatePropagation();
            e.stopPropagation();
            const { dispatch, location } = this.props;
            const { search } = location;
            const query = queryString.parse(search);
            dispatch({
                type: namespace + '/removeCollection',
                payload: {
                    itemId: id,
                    type: collectionType.QUESTION_VIDEO.type
                },
                callback: (result) => {
                    message.success('取消收藏成功！');
                    dispatch({
                        type: namespace + '/saveState',
                        payload: {
                            myCollectLoading: false
                        }
                    })
                    dispatch({
                        type: namespace + '/pageListQuestionVideo',
                        payload: {
                            page: query.p || 1,
                            size: query.s || 8,
                            subjectId: query.subjectId || null,
                        }
                    })
                }
            })

        }
        //点击播放
        const clickPlay = (id) => {
            dispatch(routerRedux.push({ pathname: '/video', search: queryString.stringify({ videoId: id }) }));
        }
        //点击详情及从新上传
        const toUpLoad = (dataId, questionId) => {
            dispatch(routerRedux.push({ pathname: '/question-detail', search: queryString.stringify({ dataId: dataId, questionId: questionId }) }));
        }
        return (
            <div className={styles['smallClass']}>
                {
                    videoCollect && videoCollect.data && videoCollect.data.map(({ id, videoTime, num, name, pngUrl, subjectId, questionId, dataId,status }, index) => {
                        return (
                            <div className={styles['smallClass-content']} key={index}>
                                {
                                    type == 1 &&
                                    <div className={styles['smallClass-label']} style={{borderBottomColor:status==1? '#1AFA29':status==2?'#F0891F':status==3?'#D81E06':''}}>
                                        {status==1? '审核通过':status==2?'审核中':status==3?'审核失败':''}
                                        </div>
                                }
                                <div className={styles['smallClass-content-top']} onClick={() => { clickPlay(id) }} style={{ backgroundImage: 'url(' + pngUrl + ')' }} >
                                    {
                                        type == 2 &&
                                        <div className={styles['smallClass-content-btn']}><a onClick={(e) => { clickCancleCollece(id, subjectId, e) }}>取消收藏</a></div>
                                    }
                                    <div className={styles['smallClass-content-play']}><IconFont type={'icon-bofanganniu1'} /></div>
                                    <div className={styles['smallClass-content-top-bottom']}>
                                        <p><span><IconFont type={'icon-shichang'} title={'视频时长：' + videoTime} /></span><span>{videoTime}</span></p>
                                        <p><span><IconFont type={'icon-EyeIcon'} title={'观看人数：' + dealVideoNum(num)} /></span><span>{dealVideoNum(num)}</span></p>
                                    </div>

                                </div>
                                <div className={styles['smallClass-content-bottom']}>
                                    <span title={name}>{name}</span>
                                    {
                                        type == 1 &&
                                        <div className={styles['smallClass-content-bottom-btn']}><a onClick={() => { toUpLoad(dataId, questionId) }}>重新上传</a></div>
                                    }
                                </div>
                            </div>
                        )
                    })
                }
                {
                    videoCollect && videoCollect.total == 0 ?
                        <div className={styles['empty']}>
                            <Empty description={"暂无微课请添加"} />
                        </div> : null
                }
                <div className={styles['content-pagination']}>
                    <Pagination defaultCurrent={1} total={videoCollect && videoCollect.total} onChange={this.pageChange} pageSize={10} style={{ marginTop: '20px' }} />
                </div>
            </div>
        )
    }
}
