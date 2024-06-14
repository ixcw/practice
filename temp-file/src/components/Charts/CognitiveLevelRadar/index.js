/**
 *@Author:xiongwei
 *@Description:认知层次雷达图
 *@Date:Created in  2021/3/4
 *@Modified By:
 */
import React from 'react'
import styles from './index.less'
import eCharts from 'echarts';
import 'echarts/lib/chart/radar';
import { connect } from 'dva';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import { TopicManage as namespace } from "@/utils/namespace";

@connect(state => ({ findClassReportTreeScore: state[namespace].findClassReportTreeScore }))
export default class CognitiveLevelRadar extends React.Component {
    constructor(props) {
        super(...arguments);
        this.state = {
            offsetWidth: 272,
            myChart: {},
            img: ''
        }
    }


    /**
  * 页面组件即将卸载时：清空数据
  */
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }
    componentDidMount() {
        const { offsetWidth } = this.state;
        const { xData = [], yData = [], id,name } = this.props;
        if (xData.length > 0) {
            // 基于准备好的dom，初始化echarts实例
            let myChart = eCharts.init(document.getElementById(id + '2'));
            let myChart1 = eCharts.init(document.getElementById(id + '1'));
            let option = {
                tooltip: {
                    formatter: (c) => {
                        let str=`${c.seriesName}<br/>`
                        c.value.map((item,index)=>{
                            str=str+`${xData[index].name}:${item}%<br/>`
                        })
                        return str
                    }
                },
                // grid: {
                //     top: '60px',
                //     left: '20%',
                //     right: '50%',
                //     bottom: '30px',
                //     containLabel: true
                //   },
                radar: {
                    // shape: 'circle',
                    radius:'60%',
                    splitArea: {
                        areaStyle: {
                            color: ['#F7F7F7',
                                '#EEEEEE', '#F7F7F7',
                                '#EEEEEE', '#F7F7F7',]
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#cde6f5'
                        },
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#EEEEEE' //网格的颜色
                        },
                    },

                    name: {
                        textStyle: {
                            color: '#000',
                            // backgroundColor: '#48474F',
                            // fontWeight: 600,
                            fontSize: 14,
                            borderRadius: 3,
                            padding: [3, 5]
                        }
                    },
                    indicator: xData
                    // [
                    //     { name: '评价', max: 100 },
                    //     { name: '分析', max: 100 },
                    //     { name: '应用', max: 100 },
                    //     { name: '理解', max: 100 },
                    //     { name: '记忆', max: 100 }
                    // ]
                },
                series: [{
                    name: name,
                    type: 'radar',
                    // areaStyle: {normal: {}},
                    itemStyle: {     //此属性的颜色和下面areaStyle属性的颜色都设置成相同色即可实现
                        color: '#EEC6B9',
                        borderColor: '#EEC6B9',
                    },
                    areaStyle: {
                        color: '#EEC6B9',
                    },
                    label: {
                        color: '#5999F7',
                        normal: {
                            show: true,
                        }
                    },
                   
                    lineStyle: {
                        normal: {
                            color: "#fff",
                            width: 3,
                        }
                    },
                    data: [
                        {
                            value: yData,
                            // [50,20,30,20,50,],
                            areaStyle: {
                                normal: {
                                    opacity: 0.5,
                                }
                            },
                            label: {
                                normal: {
                                    show: true,
                                    formatter: function (params) {
                                        if (params.value >= 80) {
                                            return '优秀';
                                        }
                                        if (params.value < 80 && params.value >= 60) {
                                            return '及格';
                                        }
                                        if (params.value < 60 && params.value >= 31) {
                                            return '不及格';
                                        }
                                        if (params.value < 31) {
                                            return '低分';
                                        }
                                    },
                                    textStyle: {
                                        color: '#fff',
                                        backgroundColor: '#5B9EF5',
                                        borderRadius: 5,
                                        padding: [5, 5, 3, 5]
                                    },

                                },
                             
                            },
                               
                        }
                    ],
                }]
            }

            let offsetWidth2 = document.getElementById(id) && document.getElementById(id).offsetWidth;
            this.setState({
                offsetWidth: offsetWidth2,
                myChart: myChart
            }, () => { myChart.resize(); })
            myChart.setOption(option);
            window.addEventListener('resize', () => {
                let offsetWidth1 = document.getElementById(id) && document.getElementById(id).offsetWidth;
                if (offsetWidth > 258) {
                    this.setState({
                        offsetWidth: offsetWidth1
                    })
                }
                myChart.resize();
            })
            myChart1.setOption(option);
            myChart1.on('finished', () => {
                let img = myChart1.getDataURL();
                if (this.state.img) {
                    return
                }
                this.setState({
                    img
                })
            })
        }
    }
    render() {
        const { offsetWidth, myChart, img } = this.state;
        const { id } = this.props;
        return (
            <div className={styles['CognitiveLevelRadar']} id={id}>
                <img src={img} alt='认知层次' className='ClassReportimg' />
                <div id={id + "1"} style={{ width: 600, height: 600, display: 'none' }} />
                <div id={id + "2"} style={{ width: offsetWidth, height: 400 }} className={'no-print'} />
            </div>
        )
    }
}