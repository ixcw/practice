/**
 * 个人中心-分销月报
 * @author:熊伟
 * @date:2020年9月10日
 * @version:v1.0.0
 * */
import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { PersonalCenter as namespace } from '@/utils/namespace';
import PersonalMonthlyReport from './personalMonthlyReport'
@connect(state => ({
    myInfoLoading: state[namespace].myInfoLoading
}))
export default class DMonthlyReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount(){
    }
    render() {
        const {location,userInfo={}}=this.props;
        return (
            <div className={styles['DMonthlyReport']}>
                {/* {
                    userInfo.isAgent>0? */}
                    {/* <MonthlyReport location={location} userInfo={userInfo}/>
                    : */}
                    <PersonalMonthlyReport location={location} userInfo={userInfo}/>
                {/* } */}
            </div>
        )
    }
}