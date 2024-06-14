/**
 * 返回前一页面，以及返回到顶部
 * @author:张江
 * @date:2020年08月22日
 * @version:v1.0.0
 * */
import React, { Component } from 'react';
import { Tooltip, BackTop, Icon } from 'antd';
import PropTypes from 'prop-types';
import { RollbackOutlined } from '@ant-design/icons';

import backBtns from './BackBtns.less';

export default class BackBtns extends Component {

  static propTypes = {
    tipText: PropTypes.string || "返回",//提示文字【默认“返回”】
    isBack: PropTypes.bool,//是否显示返回
    styles:PropTypes.object//样式
  };

  render() {
    const { tipText, isBack=true,styles={} } = this.props;
    return (
      <div className={backBtns.backWrap} style={styles}>
        <Tooltip placement="top" title={"回到顶部"}>
          <BackTop />
        </Tooltip>
        {
          isBack ? <Tooltip placement="topLeft" title={tipText}>
            <div className={backBtns.backAnalysis} onClick={() => {
              //路由回退
              window.history.go(-1);
            }}><RollbackOutlined /></div>
          </Tooltip>:null
        }
       
      </div>
    )
  }
}
