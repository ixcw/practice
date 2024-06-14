/**
* 知识点题目切换组件
* @author:张江
* @date:2020年08月20日
* @version:v1.0.0
* */

// eslint-disable-next-line
import React from 'react';
import { connect } from "dva";
// import PropTypes from 'prop-types';
import getUserInfo from "@/caches/userInfo";
import { HomeIndex as namespace } from '@/utils/namespace';
import styles from './PopularMicro.less';
import ModuleTitle from "@/components/ModuleTitle/ModuleTitle";
import MicroItemVideo from "@/components/MicroItemVideo/MicroItem";

// const IconFont = getIcon();

@connect(state => ({
    findRelatedCourseList: state[namespace].findRelatedCourseList,//热门微课列表
    loading: state[namespace].loading,//加载中
}))
export default class PopularMicro extends React.Component {
    constructor(props) {
        super(...arguments);
        this.state = {

        };
    };

    static propTypes = {

    };

    // UNSAFE_componentWillMount() {}

    componentDidMount() {
        this.getHotVideoList();
    }

    /**
* 热门微课列表
*/
    getHotVideoList() {
        const { dispatch } = this.props;
        const UserInfo=getUserInfo()?getUserInfo():{};
        UserInfo && UserInfo.studyId && dispatch({
            type: namespace + '/findRelatedCourseList',
            payload: {
                subjectId: UserInfo.subjectId || '',
                page: 1,
                size: 8
            },
        });
    }

    render() {
        const {
            location,
            findRelatedCourseList = []
        } = this.props;

        if (findRelatedCourseList && findRelatedCourseList.length > 0) {//没有热门视频时 则不展示
            return (
                <div className={styles['popular-micro']}>
                    <ModuleTitle title={'热门微课'} seeMoreUrl={'/smallClassList'} />
                    <div className={styles['micro-list']}>
                        {
                            findRelatedCourseList.map(item => {
                                return (
                                    <MicroItemVideo key={item.id} stylesClassName={'item-4'} location={location} mItem={item} />
                                )
                            })
                        }
                    </div>
                </div>
            );
        } else {
            return null;
        }

    }
}

