/**
* 首页
* @author:张江
* @date:2020年08月14日
* @version:v1.0.0
* */

// eslint-disable-next-line
import React from 'react';
import { connect } from "dva";
import classNames from 'classnames';
// import {
//     Carousel,
// } from 'antd';
// import queryString from 'query-string';
// import { routerRedux } from 'dva/router';
import Page from '@/components/Pages/page';
// import FooterMenu from '@/components/FooterMenu/FooterMenu';
import BackBtns from "@/components/BackBtns/BackBtns";
import { HomeIndex as namespace, Public } from '@/utils/namespace';
import userInfoCache from '@/caches/userInfo';
import accessTokenCache from '@/caches/accessToken';

import KQList from "./components/KQList";//知识点及题目列表组件
import PopularMicro from "./components/PopularMicro";// 热门微课
import NewReport from "./components/NewReport";//最新报告
import LearningTask from "./components/LearningTask";//学习任务
import StudentsTask from "./components/StudentsTask";//学生任务
import LiveList from "./components/LiveList";// 直播列表

// import { getIcon, dealQuestionRender, dealQuestionEdit, dealFieldName } from '@/utils/utils';
import styles from './index.less';

import BannerAnim, { Element } from 'rc-banner-anim';
import 'rc-banner-anim/assets/index.css';
const BgElement = Element.BgElement;

// const IconFont = getIcon();
@connect(state => ({
    studyList: state[Public].studyList,//学段
    loading: state[namespace].loading,//加载中
}))

export default class Home extends React.Component {
    constructor(props) {
        super(...arguments);
        this.state = {

        };
    };

    // UNSAFE_componentWillMount() {
    //     const { dispatch, location } = this.props;
    //     const { search } = location;
    //     const query = queryString.parse(search);
    // }

    // UNSAFE_componentWillReceiveProps(nextProps) {

    // }

    /**
* 页面组件即将卸载时：清空数据
*/
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }

    render() {
        const {
            location,
            dispatch,
            loading,
        } = this.props;
        const title = '首页';
        const breadcrumb = [title];
        const header = (
            <Page.Header breadcrumb={breadcrumb} title={title} />
        );
        const loginUserInfo = userInfoCache() || {};//登录用户信息
        const accessToken = accessTokenCache();//判断是否登录 或token是否过期

        const classString = classNames(styles['home-content'], 'gougou-content');
        const carouselImgs = [
            { name: 1, url: 'https://reseval.gg66.cn/pz-banner1.png' },
            { name: 1, url: 'https://reseval.gg66.cn/pz-banner2.png' },
            { name: 1, url: 'https://reseval.gg66.cn/pz-banner3.png' },
        ];

        return (
            <Page header={header} loading={false}>
                <div className={classString}>
                    {
                        carouselImgs ?
                            <div className='banner-content-container'>
                                <BannerAnim autoPlay>
                                    {
                                        carouselImgs ?
                                            carouselImgs.map((img) =>
                                                <Element prefixCls={styles.bannerBox} key={img.name}>
                                                    <BgElement key="bg" className="banner-bg"
                                                        style={{
                                                            backgroundImage: 'url(' + img.url + ')',
                                                            backgroundSize: 'auto auto',
                                                            backgroundRepeat: 'no-repeat',
                                                            backgroundPosition: 'center center'
                                                        }} />
                                                </Element>
                                            )
                                            :
                                            null
                                    }
                                </BannerAnim>
                                {/* <Carousel autoplay >
                                    {
                                        carouselImgs.map((img) => {
                                            return (<div key={img.name}>
                                                <div className="banner-bg"
                                                    style={{ backgroundImage: 'url(' + img.url + ')', backgroundSize: 'cover', }}></div>
                                            </div>)
                                        }
                                        )
                                    }
                                </Carousel> */}
                            </div> :
                            null
                    }
                    {/* 内容区域 */}
                    <div className={styles['main-content']}>
                        {/* 知识点+题目-所有 */}
                        <KQList location={location} loginUserInfo={loginUserInfo} accessToken={accessToken} />
                        {/* 直播列表-带开播/直播中 */}
                        <LiveList location={location} />
                        {/* 热门微课-所有 */}
                        <PopularMicro location={location} />
                        {/* 最新报告-教师 */}
                        {
                            accessToken && loginUserInfo && loginUserInfo.code == "TEACHER" ?
                                <NewReport location={location} /> : null
                        }
                        {/* 学习任务-学生 */}
                        {
                            accessToken && loginUserInfo && loginUserInfo.code == "STUDENT" ? <LearningTask location={location} />
                                : null
                        }
                        {/* 学生任务-家长 */}
                        {
                            accessToken && loginUserInfo && loginUserInfo.code == "PARENT" ?
                                <StudentsTask location={location} /> : null
                        }
                    </div>
                    {/* 底部菜单 */}
                    {/* <FooterMenu location={location} /> */}
                </div>
                <BackBtns tipText={"返回"} isBack={false} />
            </Page>
        );
    }
}

