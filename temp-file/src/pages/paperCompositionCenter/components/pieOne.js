/**
 * 组题中心-题组分析-球形
 * @author:熊伟
 * @date:2020年8月27日
 * @version:v1.0.0
 * */
import React from 'react';
import styles from './pieOne.less';
import { connect } from 'dva';
// import { Pie } from '@ant-design/charts';
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/title';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import { Pagination } from 'antd';
@connect(state => ({
}))
export default class PieOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('pieOne'));
        // 绘制图表
        myChart.setOption({
            title: {
                text: '题型占比统计',
                subtext: '',
                left: 'left'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: '10%',
                top: 'bottom',
                data: ['选择题', '填空题', '解答题', '综合题']
            },
            toolbox: {
                show: true,
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    magicType: {
                        show: true,
                        type: ['pie', 'funnel']
                    },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            series: [
                {
                    name: '题型占比',
                    type: 'pie',
                    radius: [20, 110],
                    center: ['50%', '50%'],
                    roseType: 'radius',
                    label: {
                        show: false
                    },
                    emphasis: {
                        label: {
                            show: true
                        }
                    },
                    data: [
                        { value: 30, name: '选择题' },
                        { value: 20, name: '填空题' },
                        { value: 25, name: '解答题' },
                        { value: 25, name: '综合题' },
                    ]
                }
            ]
        });
    }
    render() {
        return (
            <div className={styles['pieOne']}>
                <div id='pieOne' style={{ width: 400, height: 500 }}>
                </div>
                <div className={styles['pieOne-item']}>
                    <p>50%</p>
                    <p>50%</p>
                    <p>50%</p>
                    <p>50%</p>
                </div>
            </div>
        )
    }
}