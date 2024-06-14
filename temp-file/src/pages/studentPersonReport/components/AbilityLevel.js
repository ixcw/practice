/**
 *@Author:xiongwei
 *@Description:能力水平
 *@Date:Created in  2021/3/8
 *@Modified By:
 */
import React from 'react'
import styles from './AbilityLevel.less'
import eCharts from 'echarts';
import 'echarts/lib/chart/bar';
// import { connect } from 'dva';
// 引入提示框和标题组件
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
export default class AbilityLevel extends React.Component {
    constructor(props) {
        super(...arguments);
        this.state = {
            offsetWidth: 272,
            myChart: {},
            img: '',
            unfoldObjectiveTable: false,//表格是否展开
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
    getArrByKey = (data, k) => {
        let key = k || "value";
        let res = [];
        if (data) {
            data.forEach(function (t) {
                res.push(t[key]);
            });
        }
        return res;
    };
    componentDidMount() {
        const { offsetWidth } = this.state;
        const { findStudentAbilityLevel = [] } = this.props;
        let data1 = [];
        let data2 = [];
        let data3 = [];
        findStudentAbilityLevel && findStudentAbilityLevel.map(({ serialCode, difficulty, classAvgAbility, abilityNeed, ability }) => {
            data1.push({
                name: difficulty + '/' + serialCode,
                value: classAvgAbility.toFixed(1),
                sum: 1,
            });
            data2.push({
                name: difficulty + '/' + serialCode,
                value: abilityNeed.toFixed(2),
                sum: 1,
            });
            data3.push({
                name: difficulty + '/' + serialCode,
                value: ability.toFixed(2) ,
                sum: 1,
            })
        })
        // [起始最深颜色,结束的浅颜色]
        if (findStudentAbilityLevel.length > 0) {
            // 基于准备好的dom，初始化echarts实例
            let myChart = eCharts.init(document.getElementById('ClassReportmyChartmainAbilityLevel2'));
            let myChart1 = eCharts.init(document.getElementById('ClassReportmyChartmainAbilityLevel1'));

            let option = {
                legend: {
                    show: false,
                    orient: 'vertical',
                    x: 'right',      //可设定图例在左、右、居中
                    y: 'top',     //可设定图例在上、下、居中
                    padding: [0, 50, 0, 0],   //可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
                    // top : '5%',
                    // right : '10%',
                    // itemWidth : 50,
                    // itemHeight : 22,
                    // itemGap: 40,
                    // orient: 'horizontal',
                    // // icon : 'circle',
                    // textStyle : {
                    //     color : '#000',
                    //     fontSize : 20,
                    // },
                    // data: ['能力要求', '能力水平']
                },
                grid: [{
                    show: false,
                    left: '14%',
                    top: '0%',
                    bottom: '36',
                    width: '33%',

                }, {
                    show: false,
                    left: '50%',
                    top: '0%',
                    bottom: '36',
                    width: '0%',

                }, {
                    show: false,
                    right: '14%',
                    top: '0%',
                    bottom: '36',
                    width: '33%',
                }],
                tooltip: {
                    show: true,
                    // 设置  是否百分比
                    formatter: (e) =>  e.seriesName + ':' + e.value
                },
                xAxis: [{
                    max:1,
                    type: 'value',
                    inverse: true,
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    position: 'bottom',
                    axisLabel: {
                        show: false,
                    },
                    splitLine: {
                        show: false
                    }
                }, {
                    gridIndex: 1,
                    show: false,
                },
                {
                    max:1,
                    gridIndex: 2,
                    show: true,
                    type: 'value',
                    inverse: false,
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    position: 'bottom',
                    axisLabel: {
                        show: false,
                        // textStyle: {
                        //     color: '#fff'
                        // }
                    },
                    splitLine: {
                        show: false
                    }
                }
                ],
                yAxis: [{
                    gridIndex: 0,
                    triggerEvent: true,
                    show: true,
                    inverse: true,
                    data: this.getArrByKey(data1, 'name'),
                    axisLine: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    }
                },
                {
                    gridIndex: 1,
                    type: 'category',
                    inverse: true,
                    position: 'left',
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: true,
                        interval: 0,
                        align: 'auto',
                        verticalAlign: 'middle',
                        textStyle: {
                            color: '#000',
                            fontSize: 16,
                            align: 'center',

                        },

                    },
                    data: this.getArrByKey(data1, 'name'),
                },
                {
                    gridIndex: 2,
                    triggerEvent: true,
                    show: true,
                    inverse: true,
                    data: this.getArrByKey(data2, 'name'),
                    axisLine: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false,
                    }
                }
                ],
                series: [

                    {
                        name: '个人能力要求',
                        type: 'bar',
                        gridIndex: 0,
                        showBackground: true,
                        backgroundStyle: {
                            barBorderRadius: 30,
                        },
                        xAxisIndex: 0,
                        yAxisIndex: 0,
                        data: data2,
                        barWidth: 15,
                        // barCategoryGap: '40%',
                        itemStyle: {
                            normal: {
                                show: true,
                                // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，分别表示右,下,左,上。例如（0，0，0，1）表示从正上开始向下渐变；如果是（1，0，0，0），则是从正右开始向左渐变。
                                // 相当于在图形包围盒中的百分比，如果最后一个参数传 true，则该四个值是绝对的像素位置
                                // color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                //     offset: 0,
                                //     color: '#00B0E2' //指0%处的颜色
                                // }, {
                                //     offset: 1,
                                //     color: '#00B0E2' //指100%处的颜色
                                // }], false),
                                color: '#DB4648',
                                barBorderRadius: [10, 0, 0, 10],

                            },
                        },

                        label: {
                            normal: {
                                show: true,
                                position: 'left',
                                textStyle: {
                                    color: '#000',
                                    fontSize: '12'
                                }
                            }
                        }
                    },
                    {
                        name: '个人能力水平',
                        type: 'bar',
                        gridIndex: 0,
                        showBackground: true,
                        backgroundStyle: {
                            barBorderRadius: 30,
                        },
                        xAxisIndex: 0,
                        yAxisIndex: 0,
                        data: data3,
                        barWidth: 15,
                        // barCategoryGap: '40%',
                        itemStyle: {
                            normal: {
                                show: true,
                                // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，分别表示右,下,左,上。例如（0，0，0，1）表示从正上开始向下渐变；如果是（1，0，0，0），则是从正右开始向左渐变。
                                // 相当于在图形包围盒中的百分比，如果最后一个参数传 true，则该四个值是绝对的像素位置
                                // color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                //     offset: 0,
                                //     color: '#00B0E2' //指0%处的颜色
                                // }, {
                                //     offset: 1,
                                //     color: '#00B0E2' //指100%处的颜色
                                // }], false),
                                color: '#6898DC',
                                barBorderRadius: [10, 0, 0, 10],

                            },
                        },

                        label: {
                            normal: {
                                show: true,
                                position: 'left',
                                textStyle: {
                                    color: '#000',
                                    fontSize: '12'
                                }
                            }
                        }
                    },
                    {
                        name: '班级能力要求',
                        type: 'bar',
                        xAxisIndex: 2,
                        yAxisIndex: 2,
                        gridIndex: 2,
                        showBackground: true,
                        backgroundStyle: {
                            barBorderRadius: 30,
                        },
                        data: data2,
                        barWidth: 15,
                        // barCategoryGap: '40%',
                        itemStyle: {
                            normal: {
                                show: true,
                                // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，分别表示右,下,左,上。例如（0，0，0，1）表示从正上开始向下渐变；如果是（1，0，0，0），则是从正右开始向左渐变。
                                // 相当于在图形包围盒中的百分比，如果最后一个参数传 true，则该四个值是绝对的像素位置
                                // color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                //     offset: 0,
                                //     color: '#6BC616' //指0%处的颜色
                                // }, {
                                //     offset: 1,
                                //     color: '#6898DC' //指100%处的颜色
                                // }], false),
                                color: '#DB4648',
                                barBorderRadius: [0, 10, 10, 0],

                            },
                        },
                        label: {
                            normal: {
                                show: true,
                                position: 'right',
                                textStyle: {
                                    color: '#000',
                                    fontSize: '12'
                                }
                            }
                        }
                    },
                    {
                        name: '班级能力水平',
                        type: 'bar',
                        xAxisIndex: 2,
                        yAxisIndex: 2,
                        gridIndex: 2,
                        showBackground: true,
                        backgroundStyle: {
                            barBorderRadius: 30,
                        },
                        data: data1,
                        barWidth: 15,
                        // barCategoryGap: '40%',
                        itemStyle: {
                            normal: {
                                show: true,
                                // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，分别表示右,下,左,上。例如（0，0，0，1）表示从正上开始向下渐变；如果是（1，0，0，0），则是从正右开始向左渐变。
                                // 相当于在图形包围盒中的百分比，如果最后一个参数传 true，则该四个值是绝对的像素位置
                                // color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                //     offset: 0,
                                //     color: '#6BC616' //指0%处的颜色
                                // }, {
                                //     offset: 1,
                                //     color: '#6898DC' //指100%处的颜色
                                // }], false),
                                color: '#6898DC',
                                barBorderRadius: [0, 10, 10, 0],

                            },
                        },
                        label: {
                            normal: {
                                show: true,
                                position: 'right',
                                textStyle: {
                                    color: '#000',
                                    fontSize: '12'
                                }
                            }
                        }
                    }
                ]
            };
            let offsetWidth2 = document.getElementById("ClassReportmyChartmainAbilityLevel") && document.getElementById("ClassReportmyChartmainAbilityLevel").offsetWidth;
            this.setState({
                offsetWidth: offsetWidth2,
                myChart: myChart
            }, () => { myChart.resize(); })
            myChart.setOption(option);
            window.addEventListener('resize', () => {
                let offsetWidth1 = document.getElementById("ClassReportmyChartmainAbilityLevel") && document.getElementById("ClassReportmyChartmainAbilityLevel").offsetWidth;
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
        const { offsetWidth, myChart, img, unfoldObjectiveTable } = this.state;
        const { findStudentAbilityLevel } = this.props
        return (
            <div>
                <div className={classNames(styles['AbilityLevel'], 'classReport-sprin-open')} id='ClassReportmyChartmainAbilityLevel' style={{ maxHeight: unfoldObjectiveTable ? '' : '680px' }}>
                    <div className={styles['tag']} >
                        <span><span className={styles['point']} style={{backgroundColor:'#9F9F9F'}}></span>能力值满分：<span style={{color:'#DB4648'}}>1 </span></span>
                        <span><span className={styles['point']} style={{backgroundColor:'#6898DC'}}></span>能力水平</span>
                        <span><span className={styles['point']} style={{backgroundColor:'#DB4648'}}></span>能力要求</span>
                    </div>
                    <div className={styles['title']} >
                        <div className={styles['title-i']} style={{ marginLeft: '200px' }}>我</div>
                        <div>难度/题号</div>
                        <div className={styles['title-i']} style={{ marginRight: '200px' }}>班级</div>
                    </div>
                    <img src={img} alt='能力水平' className='ClassReportimg' />
                    <div id="ClassReportmyChartmainAbilityLevel1" style={{ width: 1200, height: findStudentAbilityLevel.length * 65, display: 'none' }} />
                    <div id="ClassReportmyChartmainAbilityLevel2" style={{ width: offsetWidth, height: findStudentAbilityLevel.length * 65 }} />

                </div>
                {
                    findStudentAbilityLevel && findStudentAbilityLevel.length > 10 ?
                        <div className={classNames(styles['Table-down'], 'no-print')} >
                            <a onClick={() => { this.setState({ unfoldObjectiveTable: !unfoldObjectiveTable }) }}>{!unfoldObjectiveTable ? <span>展开<DownOutlined /></span> : <span>收起<UpOutlined /></span>}</a>
                        </div>
                        : null
                }
            </div>
        )
    }
}