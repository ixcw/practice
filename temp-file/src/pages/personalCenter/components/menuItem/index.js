/**
 * 个人中心-item
 * @author:熊伟
 * @date:2020年8月22日
 * @version:v1.0.0
 * */
import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import { getIcon, getMenueList } from "@/utils/utils";
const IconFont = getIcon();
@connect(state => ({
    // loading: state[namespace].loading
}))
export default class MenuItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    handleMenuItem = (value) => {
        const { dispatch, location, pathname } = this.props;
        // const { search } = location;
        // const query = queryString.parse(search);
        dispatch(routerRedux.push({ pathname, search: queryString.stringify({ personalCenterItem: value, myCollect: 1 }) }));
    }
    componentDidMount() {


    }
    render() {
        // const {menuItemItemActivate}=this.state;
        const { userInfo = {}, location } = this.props;
        const { search = {} } = location;
        const query = queryString.parse(search);
        const menuItemItemActivate = query.personalCenterItem ? query.personalCenterItem : 1;
        // const menuItem=[
        //     {value:1,table:'个人信息',icon:'wodexinxi2'},
        //     {value:2,table:'我的班级',icon:'wodebanji2'},
        //     {value:3,table:'我的收藏',icon:'shoucang2'},
        //     {value:4,table:'关联家长',icon:'guanlian2'},
        //     {value:5,table:'我的微课',icon:'weike2'},
        //     {value:6,table:'修改密码',icon:'mima2'},
        // ];
        let menuItem = getMenueList(userInfo.code);
        return (
            <div className={styles['menuItem']}>
                {
                    menuItem && menuItem.map(({ value, table, icon }, index) => {
                        return (
                            <div
                                className={styles[value == menuItemItemActivate ? 'menuItem-item-activate' : 'menuItem-item']}
                                key={index}
                                onClick={() => { this.handleMenuItem(value) }}
                            >
                                <div className={styles['menuItem-icon']}>
                                    <IconFont type={'icon-' + icon} />
                                </div>
                                <p>{table}</p>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}