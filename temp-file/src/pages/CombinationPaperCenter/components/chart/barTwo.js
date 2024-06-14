/**
 * 组题中心-题组分析-柱形
 * @author:熊伟
 * @date:2020年8月27日
 * @version:v1.0.0
 * */
import React from 'react';
import styles from './barTwo.less';
import { connect } from 'dva';
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
        const {
            idString = 'barTwo',
            chartData = []
        } = this.props;
        let leftData = [];
        let rightData = [];
        let seriesData = [];
        let seriesLineData=[];
        let allTotal=0;
        chartData.map((item) => {
            leftData.push(item.name);
            rightData.push(item.num||0+'道');
            seriesData.push(item.num||0);
            allTotal += Number(item.num||0)
        })
        chartData.map((item) => {
            let lineNum = (Number(item.num||0) / allTotal)*100
            seriesLineData.push(lineNum.toFixed(2));
        })
        
        var myChart = echarts.init(document.getElementById(idString));
        // 绘制图表
        myChart.setOption({
            color: ['#5793f3', '#29CB97'],
            // title: {
            //     text: '题目难度统计',
            // },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: '{b0}<br /> {a1}：{c1}道<br />{a0}：{c0}%'
            },
            legend: {
                data: ['占比', '题量']
            },
            grid: {
                left: '3%',
                right: '5%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    name:'占比',
                    type: 'value',
                },
                {
                    name:'题量',
                    type: 'value',
                }
            ],
            yAxis:[
                {
                    type: 'category',
                    data: leftData
                },
                {
                    // name: '难度',
                    data: rightData,
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
                    data: seriesLineData,
                },
                {
                    name: '题量',
                    type: 'bar',
                    xAxisIndex: 1,
                    data: seriesData,

                    barWidth : 30,//柱图宽度
                    label: {
                        show: true,
                        position: 'right'
                    },
                    itemStyle: {
                        normal: {
                            // // 随机显示
                            // color:function(d){
                            //     let colors=Math.random();
                            //     if(colors>0.999999){//防止为白色 看不见
                            //         return '#C33531'
                            //     }else{
                            //         return "#"+Math.floor(colors*(256*256*256-1)).toString(16);
                            //     }
                            // }
                          
                            // 定制显示（按顺序）
                            color: function(params) { 
                                var colorList = ['#B558F6', '#29CB97', '#FEC400','#4072EE','#29AAE3', '#B74AE5','#0AAF9F','#E89589','#16A085','#4A235A','#C39BD3 ','#F9E79F','#BA4A00','#ECF0F1','#616A6B','#EAF2F8','#4A235A','#3498DB' ]; 
                                return colorList[params.dataIndex] 
                            }
                        },
                    },
                }
            ]
                });
    }
    render() {
        const {
            idString = 'barTwo',
            styleObject = { width: 400, height: 500 }
        } = this.props
        return (
            <div className={styles['barTwo']}>
                <div id={idString} style={styleObject}>

                </div>
            </div>
        )
    }
}