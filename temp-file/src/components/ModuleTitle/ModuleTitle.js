/**
 * 首页每个模块的标题组件
 * @author:张江
 * @date:2020年08月20日
 * @version:v1.0.0
 * */

// eslint-disable-next-line
import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { connect } from "dva";
import { routerRedux } from 'dva/router';
import styles from './ModuleTitle.less';


@connect(state => ({

}))

export default class ModuleTitle extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,//标题
    seeMoreUrl: PropTypes.string,//详情路径
  };


  constructor() {
    super(...arguments);
    this.state = {

    };
  }


  clickToLink = () => {
    const { dispatch, seeMoreUrl } = this.props;
    dispatch(routerRedux.push({
      pathname: seeMoreUrl || '/home',
    }));
  }

  render() {
    const {
      location,
      title,
      seeMoreUrl,
    } = this.props;

    return (
      <div className={styles['header-title']}>
        <h2>{title}</h2>
        {
          seeMoreUrl ? <span onClick={() => { this.clickToLink() }}>查看更多</span>:null
        }
      </div>
    )
  }
}

