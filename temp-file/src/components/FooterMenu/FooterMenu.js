/**
 * 底部菜单
 * @author:张江
 * @date:2020年08月20日
 * @version:v1.0.0
 * */

// eslint-disable-next-line
import React from 'react';
import { connect } from "dva";
import { routerRedux } from 'dva/router';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import styles from './FooterMenu.less';
// import { Auth as namespace } from "@/utils/namespace";
import { getIcon } from "@/utils/utils";
const IconFont = getIcon();

@connect(state => ({

}))

export default class FooterMenu extends React.Component {
  static propTypes = {
    // title: PropTypes.object.isRequired,//标题
  };


  constructor() {
    super(...arguments);
    this.state = {

    };
  }

  clickToLink = (pathname) => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname,
    }));
  }

  render() {
    const {
      location,
      dispatch
    } = this.props;
    //底部菜单数据
    const bottomMenus = [
      // {
      //   url: '/looking-forward',
      //   name: '联系我们',
      //   icon: <IconFont type={'icon-lianxi'} className={styles['menu-iconfont']} />
      // },
      // {
      //   url: '/looking-forward',
      //   name: '关于我们',
      //   icon: <IconFont type={'icon-guanyuwomen'} className={styles['menu-iconfont']} />
      // },
      // {
      //   url: '/looking-forward',
      //   name: '新闻动态',
      //   icon: <IconFont type={'icon-xinwen'} className={styles['menu-iconfont']} />
      // },
      // {
      //   url: '/looking-forward',
      //   name: '合作商',
      //   icon: <IconFont type={'icon-hezuo'} className={styles['menu-iconfont']} />
      // },
    ];

    return (
      <div className={styles['footer-menu']}>
        {
          bottomMenus.map(item => <span
            key={item.name}
            onClick={() => { this.clickToLink(item.url) }}
          >
            {item.icon ? item.icon : ''}
            {item.name}
          </span>)
        }
      </div>
    )
  }
}

