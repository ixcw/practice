/**
 * 组题中心-题组分析
 * @author:熊伟
 * @date:2020年8月27日
 * @version:v1.0.0
 * */
import React from 'react';
import styles from './paperAnalyze.less';
import { connect } from 'dva';
// import { Pie } from '@ant-design/charts';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import { Pagination  } from 'antd';
import PieOne from './pieOne.js'
import BarOne from './barOne.js'
import BarTwo from './barTwo.js'
  @connect(state => ({
    }))
export default class PaperAnalyze extends React.Component{
    constructor(props){
        super(props);
        this.state={
        }
    }
    
    render (){
        return (
            <div className={styles['paperAnalyze']}>
                <div className={styles['paperAnalyze-content']}>
                    <h1>题组分析</h1>
                    <div className={styles['paperAnalyze-main']}>
                        <div className={styles['paperAnalyze-main-left']}>
                            <div style={{padding:'10px'}}>
                              <PieOne/>
                            </div>
                        </div>
                        <div className={styles['paperAnalyze-main-right']}>
                            <div className={styles['paperAnalyze-main-right-top']}>
                                <BarOne/>
                            </div>
                            <div className={styles['paperAnalyze-main-right-bottom']}>
                                <BarTwo />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}