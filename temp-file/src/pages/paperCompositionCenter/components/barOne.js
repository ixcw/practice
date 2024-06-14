/**
 * 组题中心-题组分析-柱形
 * @author:熊伟
 * @date:2020年8月27日
 * @version:v1.0.0
 * */
import React from 'react';
import styles from './barOne.less';
import { connect } from 'dva';
// import { Pie } from '@ant-design/charts';
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/title';
import 'echarts/lib/component/dataZoom';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import { Pagination } from 'antd';
@connect(state => ({
}))
export default class BarOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
        var myChart = echarts.init(document.getElementById('barOne'));
        // 绘制图表
        myChart.setOption({
            color:  ['#5793f3', '#d14a61'],
            title: {
                text: '知识点分值占比',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['集合s', '数组', '平方',' 集合', '平方', '集合', '集合','集合','集合','集合','集合','集合','集合'],
                    axisTick: {
                        alignWithLabel: true
                    },
                    
                    axisLabel: {
                        interval: 0,
                        rotate: -30,
                        textStyle: {
                            color: '#000',
                            fontSize: 8
                        },
                    },
                }
            ],
            legend: {
                data: ['分数', '占比']
            },
            yAxis: [
                {
                    name: '分数',
                    type: 'value', 
                },
                {
                    name: '占比',
                    type: 'value',
                },
            ],
            series: [
                {
                    name: '分数',
                    type: 'bar',
                    barWidth: '60%',
                    data: [10, 20, 5, 1, 30, 6, 7,8,9,10,11,15,5],
                    itemStyle: {
                        normal: {
                            // 随机显示
                            color:function(d){
                                let colors=Math.random();
                                if(colors>0.999999){//防止为白色 看不见
                                    return '#C33531'
                                }else{
                                    return "#"+Math.floor(colors*(256*256*256-1)).toString(16);
                                }
                            }
                          
                            // 定制显示（按顺序）
                            // color: function(params) { 
                            //     var colorList = ['#C33531','#EFE42A','#64BD3D','#EE9201','#29AAE3', '#B74AE5','#0AAF9F','#E89589','#16A085','#4A235A','#C39BD3 ','#F9E79F','#BA4A00','#ECF0F1','#616A6B','#EAF2F8','#4A235A','#3498DB' ]; 
                            //     return colorList[params.dataIndex] 
                            // }
                        },
                    },
                },
                {
                    name: '占比',
                    type: 'line',
                    yAxisIndex: 1,
                    data: [10, 20, 10, 5, 30, 5, 5,10,1,2,3,2,2]
                },
            ]
                });
    }
    render() {
        return (
            <div className={styles['barOne']}>
                <div id='barOne' style={{ width: 800, height: 260 }}>

                </div>
            </div>
        )
    }
}