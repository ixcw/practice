/**
 *@Author:xiongwei
 *@Description:完成率
 *@Date:Created in  2020/9/28
 *@Modified By:
 */
import React from 'react'
import styles from './finishingPercent.module.less'
import eCharts from 'echarts';
import 'echarts/lib/chart/bar';
import { getIcon } from "@/utils/utils";
import { connect } from 'dva';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import { TopicManage as namespace } from "@/utils/namespace";


const IconFont = getIcon();
@connect(state => ({
    Situation: state[namespace].jobCompleteSituation,//完成情况
    NotCompleteStudentInfoList: state[namespace].getNotCompleteStudentInfo,//完成情况
}))
export default class FinishingPercent extends React.Component {
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
        const { Situation, NotCompleteStudentInfoList = [] } = this.props;
        let myChart = eCharts.init(document.getElementById('ClassReportmyChartmain4'));
        let myChart1 = eCharts.init(document.getElementById('ClassReportmyChartmain4-1'));
        let datax = ['已完成', '未完成',];
        let datay = [
            { value: Number(Situation.compeleteSum), name: '已完成' },
            { value: Number(Situation.notCompeleteSum), name: '未完成' },
        ]
        if (datay) {
            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: (params) => {
                        let str = `${params.name} :${params.value}(${params.percent}%)`;
                        if (params.name == '未完成') {
                            if (NotCompleteStudentInfoList.length > 0) {
                                str = str + `<br/>序号--姓名`
                                NotCompleteStudentInfoList.map((item, index) => {
                                    str = str + `<br/>${index + 1}--${item}`
                                })
                            }
                            return str

                        }
                        if (params.name == '已完成') {
                            return params.name + ':' + params.value + '(' + params.percent + '%)'
                        }
                    },
                },

                visualMap: {
                    show: false,
                    min: 80,
                    max: 600,
                    inRange: {
                        // colorLightness: [0, 1]
                    }
                },
                legend: {
                    // orient: 'vertical',
                    left: 'center',
                    top: '50px',
                    data: datax,
                    icon: 'circle',

                    textStyle: {
                        borderRadius: 50
                    }
                },
                series: [
                    {
                        name: '完成率',
                        type: 'pie',
                        radius: '50%',
                        center: ['50%', '60%'],
                        data: datay,
                        // .sort(function (a, b) { return a.value - b.value; }),
                        // roseType: 'radius',
                        itemStyle: {
                            normal: {
                                color: function (params) {
                                    let colorList = [
                                        '#0d92f1', '#85bae0'
                                    ];
                                    return colorList[params.dataIndex]
                                },
                                borderColor: "#FFFFFF", borderWidth: 1,
                            },
                            // shadowBlur: 200,
                            // shadowColor: 'rgba(0, 0, 0, 0.5)'
                        },
                        label: {
                            normal: {
                                formatter: function (params) {
                                    return params.name + ':' + params.value
                                },

                            },
                        },
                        animationType: 'scale',
                        animationEasing: 'elasticOut',
                        animationDelay: function (idx) {
                            return Math.random() * 200;
                        }
                    }
                ]
            };
            let offsetWidth2 = document.getElementById("ClassReportmyChartmain4Box") && document.getElementById("ClassReportmyChartmain4Box").offsetWidth;
            this.setState({
                offsetWidth: offsetWidth2,
                myChart: myChart
            }, () => { myChart.resize(); })
            myChart.setOption(option);
            window.addEventListener('resize', () => {
                let offsetWidth1 = document.getElementById("ClassReportmyChartmain4Box") && document.getElementById("ClassReportmyChartmain4Box").offsetWidth;
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
        return (
            <div className={styles['goalDiagram']} id='ClassReportmyChartmain4Box'>
                <img src={img} alt='完成率' className='ClassReportimg' />
                <div id="ClassReportmyChartmain4-1" style={{ width: 400, height: 400, display: 'none' }}></div>
                <div id="ClassReportmyChartmain4" className={styles['ClassReportmain4']} style={{ width: offsetWidth, height: 400 }}></div>
            </div>
        )
    }
}