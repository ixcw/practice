/**
 * 组题中心
 * @date:2020年8月27日
 * @version:v1.0.0
 * */
import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import {  Button } from 'antd';
// import queryString from 'query-string';
// import { routerRedux } from 'dva/router';
// import { Pagination  } from 'antd';
import PaperAnalyze from './components/paperAnalyze'
@connect(state => ({
  }))
export default class PaperCompositionCenter extends React.Component{
    constructor(props){
        super(props);
        this.state={
        }
    }
    render (){
        return (
            <div className={styles['paperComposition']}>
                
                <PaperAnalyze/>
                {/* 下一步  下一步*/}
                <div className={styles['paperComposition-btns']}>
                    <Button type='primary'  className={styles['paperComposition-btn']}>下一步：题组分析</Button>
                    <Button type='primary'  className={styles['paperComposition-btn']}>下一步：题组分析</Button>
                </div>
            </div>
        )
    }
}