/**
* 直播列表
* @author:张江
* @date:2022年04月28日
* @version:v1.0.0
* */

// eslint-disable-next-line
import React from 'react';
import { connect } from "dva";
// import PropTypes from 'prop-types';
import getUserInfo from "@/caches/userInfo";
import { LiveManage as namespace } from '@/utils/namespace';
import styles from './PopularMicro.less';
import ModuleTitle from "@/components/ModuleTitle/ModuleTitle";
import MicroItemVideo from "@/components/MicroItemVideo/MicroItem";
import { existArr } from '@/utils/utils';

// const IconFont = getIcon();

@connect(state => ({
    livePageList: state[namespace].livePageList,//直播列表
    loading: state[namespace].loading,//加载中
}))
export default class LiveList extends React.Component {
    constructor(props) {
        super(...arguments);
        this.state = {

        };
    };

    static propTypes = {

    };

    // UNSAFE_componentWillMount() {}

    componentDidMount() {
        this.getPageListByUser();
    }

    /**
* 直播列表
*/
    getPageListByUser() {
        const { dispatch } = this.props;
        const UserInfo = getUserInfo() || {};
        UserInfo && dispatch({
            type: namespace + '/getPageListByUser',
            payload: {
                // liveStatus: '0,1',
                subjectId: UserInfo?.subjectId || '',
                page: 1,
                size: 8
            },
        });
    }

    render() {
        const {
            location,
            livePageList = {}
        } = this.props;

        if (existArr(livePageList?.data)) {//没有热门视频时 则不展示
            return (
                <div className={styles['popular-micro']}>
                    {/* seeMoreUrl={'/smallClassList'} */}
                    <ModuleTitle title={'直播'} seeMoreUrl='' />
                    <div className={styles['micro-list']}>
                        {
                            livePageList?.data.map(item => {
                                item.cover = item.coverUrl;
                                item.describe = item.name;
                                item.isFromLive = true;
                                return (
                                    <MicroItemVideo key={item.liveId} stylesClassName={'item-4'} location={location} mItem={item} />
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

