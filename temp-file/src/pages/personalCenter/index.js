/**
 * 个人中心
 * @author:熊伟
 * @date:2020年8月22日
 * @version:v1.0.0
 * */
import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import { Spin, Affix } from 'antd';
import Page from "@/components/Pages/page";
import { PersonalCenter as namespace } from '@/utils/namespace';
// import { phoneReg } from '@/utils/const';
import getUseInfo from '@/caches/userInfo'
import MenuItem from './components/menuItem';
import MyInfo from './components/myInfo';
import MyClass from './components/myClass';
import MyCollect from './components/myCollect';
import MyRelevance from './components/myRelevance';
import SmallClass from './components/myCollect/smallClass';
import ChangePassword from './components/changePassword';
import DMonthlyReport from './components/DMonthlyReport';
@connect(state => ({
    loading: state[namespace].loading,
    myCollectLoading: state[namespace].myCollectLoading,
    myInfoLoading: state[namespace].myInfoLoading,
    myClassLoading: state[namespace].myClassLoading,
}))
export default class PersonalCenter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: undefined,//用户信息
        }
    }
    //点击item
    setCheckInfo = (value) => {
        console.log('value', value)
        this.setState({
            checkInfo: value
        })
    }
    componentDidMount() {
        const userInfo = getUseInfo();
        // console.log('userInfo',userInfo)
        const { dispatch, location, pathname, loading } = this.props;
        const { search } = location;
        const query = queryString.parse(search);
        //设置默认查看item
        !query.personalCenterItem && dispatch(routerRedux.push({ pathname, search: queryString.stringify({ personalCenterItem: 1, myCollect: 1 }) }));
        this.setState({
            userInfo
        })
    }
    render() {
        const userInfo = getUseInfo() || {};
        const { location, loading, myInfoLoading, myClassLoading, myCollectLoading } = this.props;
        const { search } = location;
        const query = queryString.parse(search);
        const checkInfo = query.personalCenterItem ? query.personalCenterItem : 1;
        const title = '个人中心';
        const breadcrumb = [title];
        const header = (
            <Page.Header breadcrumb={breadcrumb} title={title} />
        );
        return (
            <Page header={header}>
                <div className={styles['personalCenter']}>
                    <div className={styles['personalCenter-left']}>
                        <Affix offsetTop={20}>
                            <div>
                                <p style={{ marginBottom: '35px' }}>个人中心</p>
                                <MenuItem userInfo={userInfo} location={location} />
                            </div>
                        </Affix>
                    </div>
                    <div className={styles['personalCenter-right']}>
                        {
                            checkInfo == 1 ?
                                // '我的信息'
                                <div>
                                    <MyInfo userInfo={userInfo} />
                                </div> :
                                checkInfo == 2 ?
                                    // '我的班级'
                                    <div>
                                        <Spin spinning={!!myClassLoading}>
                                            <MyClass userInfo={userInfo} />
                                        </Spin>
                                    </div> :
                                    checkInfo == 3 ?
                                        <div className={styles['personalCenter-right-MyCollect']}>
                                            <MyCollect userInfo={userInfo} location={location} />
                                        </div> :
                                        checkInfo == 4 ?
                                            // '我的关联'
                                            <div>
                                                <MyRelevance userInfo={userInfo} />
                                            </div> :
                                            checkInfo == 5 ?
                                                // '我的微课'
                                                <div>
                                                    <Spin spinning={!myCollectLoading}>
                                                        <SmallClass type={1} userInfo={userInfo} location={location} />
                                                    </Spin>
                                                </div> :
                                                checkInfo == 6 ?
                                                    // '分销月报'
                                                    <div>
                                                        <DMonthlyReport userInfo={userInfo} location={location} />
                                                    </div> :
                                                    checkInfo == 9 ?
                                                        // '修改密码'
                                                        <div>
                                                            <ChangePassword userInfo={userInfo} />
                                                        </div> : null
                        }
                    </div>
                </div>
            </Page>
        )
    }
}