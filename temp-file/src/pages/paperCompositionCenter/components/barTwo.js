/**
 * 组题中心-题组分析-柱形
 * @author:熊伟
 * @date:2020年8月27日
 * @version:v1.0.0
 * */
import React from 'react';
import styles from './barTwo.less';
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
@connect(state => ({
}))
export default class BarTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
        var myChart = echarts.init(document.getElementById('barTwo'));
        // 绘制图表
        myChart.setOption({
            color:  ['#5793f3', '#d14a61'],
            title: {
                text: '题目难度统计',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['占比', '题量']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    name:'比',
                    type: 'value',
                },
                {
                    name:'量',
                    type: 'value',
                }
            ],
            yAxis:[
                {
                    type: 'category',
                    data: ['难', '较难', '一般', '简单']
                },
                {
                    // name: '难度',
                    data: ['19道', '23道', '3道', '12道'],
                    axisLabel: {
                        inside: true,
                        textStyle: {
                            color: '#000'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    z: 10
                }
            ],
            series: [
                {
                    name: '占比',
                    type: 'line',
                    data: [10, 20, 30, 10],
                },
                {
                    name: '题量',
                    type: 'bar',
                    xAxisIndex: 1,
                    data: [19, 23, 3, 12],
                    barWidth : 10,//柱图宽度
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
                }
            ]
                });
    }
    render() {
        return (
            <div className={styles['barTwo']}>
                <div id='barTwo' style={{ width: 780, height: 320 }}>

                </div>
            </div>
        )
    }
}