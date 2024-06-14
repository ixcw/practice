/**
 *@Author:xiongwei
 *@Description:年级报告成绩竞争力
 *@Date:Created in  2021/4/30
 *@Modified By:
 */
import React from 'react'
import styles from './index.less'
import eCharts from 'echarts';
import 'echarts/lib/chart/bar';
// import { connect } from 'dva';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
// import { TopicManage as namespace } from "@/utils/namespace";

// @connect(state => ({ findClassReportTreeScore: state[namespace].findClassReportTreeScore }))
export default class PerformanceCompetitivenessCharts extends React.Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      offsetWidth: 1,
      offsetHeight:1,
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
    const { GradeReportTreeScoreList = [], id = 'PerformanceCompetitivenessCharts' } = this.props;
    if (GradeReportTreeScoreList.length !== 0) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = eCharts.init(document.getElementById(id + '2'));
      let myChart1 = eCharts.init(document.getElementById(id + '1'));
      let x, y, yMax = [], xMax = []
      const seriesData = GradeReportTreeScoreList.map(({ id, className, classAvgScore, standardDeviation }, index) => {
        let randomColor = 'rgb(' + Math.floor(Math.random() * 240) + ',' + Math.floor(Math.random() * 200) + ',' + Math.floor(Math.random() * 200)  + ')'
        if (id == -1) {
          x = classAvgScore;
          y = standardDeviation;
        }
        xMax.push(classAvgScore)
        yMax.push(standardDeviation)
        return {
          name: className,
          value: [classAvgScore, standardDeviation],
          itemStyle: {
            color: id==-1?'rgb(255,0,0)':randomColor
          }
        }
      })
      let option = {
        // title: [
        //   {
        //     text: '差',//fromInterface=='TS-cd'?'总成绩竞争力分布图':'成绩竞争力分布图',
        //     x: '0',
        //     y: '25%',
        //     textStyle: {
        //       fontWeight: '500',
        //       fontSize: 20,
        //       color: '#15F9F1'
        //     }
        //   },
        //   {
        //     text: '中',//fromInterface=='TS-cd'?'总成绩竞争力分布图':'成绩竞争力分布图',
        //     x: '0',
        //     y: '75%',
        //     textStyle: {
        //       fontWeight: '500',
        //       fontSize: 20,
        //       color: '#15F9F1'
        //     }
        //   },
        //   {
        //     text: '优',//fromInterface=='TS-cd'?'总成绩竞争力分布图':'成绩竞争力分布图',
        //     right: '0',
        //     y: '75%',
        //     textStyle: {
        //       fontWeight: '500',
        //       fontSize: 20,
        //       color: '#15F9F1'
        //     }
        //   },
        //   {
        //     text: '良',//fromInterface=='TS-cd'?'总成绩竞争力分布图':'成绩竞争力分布图',
        //     right: '0',
        //     y: '25%',
        //     textStyle: {
        //       fontWeight: '500',
        //       fontSize: 20,
        //       color: '#15F9F1'
        //     }
        //   },
        // ],
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            if (params.componentType == "markLine") {
              return params.name + "：" + params.value
            } else if(params.value){
              return params.name + "<br/> 平均分：" + params.value[0] + '分 <br/>标准差：' + params.value[1];
            }
          }
        },
        grid: {
          top: 70,
          right: '8%',
          left: 60
        },
        dataZoom: [
          {
            type: 'slider',
            show: false,
            // xAxisIndex: [0],
            start: 0,                               
            end:  100,
          },
          //设置x轴方向上，鼠标支持滚轮
          {
            type: 'inside',
            xAxisIndex: [0],
          },
          {
            type: 'inside',
            yAxisIndex: [0],
          },
        ],
        xAxis: {
          type: 'value',
          max: 2 * x,
          // scale: true,
          axisLabel: {
            formatter: '{value}分'
          },
          axisTick: {
            show: false
          },
          axisPointer: {
            show: false,
          },
          axisLine: {
            show: false
          },
        },
        yAxis: {
          type: 'value',
          max: 2 * y,
          // scale: true,
          // axisLabel: {
          //     show: false
          // },
          axisTick: {
            show: false
          },
          axisPointer: {
            show: false,
          },
          axisLine: {
            show: false
          },
        },
        series: [{
          type: 'scatter',
          data: seriesData,
          symbolSize: 12,
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: function (params) {
                return params.name
              }
            },
            emphasis: {
              show: true,
              position: 'top',
            }
          },
          // 各象限区域
          markArea: {
            silent: true,
            data: [
              // 第一象限
              [{
                name: '良',
                xAxis: x, // x 轴开始位置
                yAxis: 2 * y, // y 轴结束位置(直接取最大值)
                itemStyle: {
                  color: 'rgba(255,255,255, .1)'
                },
                label: {
                  position: 'inside',
                  color: 'rgba(0, 0, 0, .3)',
                  fontSize: 22
                }
              }, {
                yAxis: y // y轴开始位置
              }],
              // 第二象限
              [{
                name: '差',
                yAxis: 2 * y, // y 轴结束位置(直接取最大值)
                itemStyle: {
                  color: 'rgba(255,255,255, .1)'
                },
                label: {
                  position: 'inside',
                  color: 'rgba(0, 0, 0, .3)',
                  fontSize: 22
                }
              }, {
                xAxis: x, // x 轴结束位置
                yAxis: y // y轴开始位置
              }],
              // 第三象限
              [{
                name: '中',
                yAxis: y, // y 轴结束位置
                itemStyle: {
                  color: 'rgba(255,255,255, .1)'
                },
                label: {
                  position: 'inside',
                  color: 'rgba(0, 0, 0, .3)',
                  fontSize: 22
                }
              }, {
                xAxis: x, // x 轴结束位置
                yAxis: 0 // y轴开始位置
              }],
              // 第四象限
              [{
                name: '优',
                xAxis: x, // x 轴开始位置
                yAxis: y, // y 轴结束位置
                itemStyle: {
                  color: 'rgba(255,255,255, .1)'
                },
                label: {
                  position: 'inside',
                  color: 'rgba(0, 0, 0, .3)',
                  fontSize: 22
                }
              }, {
                yAxis: 0// y轴开始位置
              }]
            ]
          },
          // 中心点交集象限轴
          // markLine: {
          //   silent: true, // 是否不响应鼠标事件
          //   precision: 2, // 精度
          //   lineStyle: {
          //     type: 'solid',
          //     color: '#848587'
          //   },
          //   label: {
          //     color: '#000',
          //     position: 'end',
          //     formatter: '{b}'
          //   },
          //   data: [
          //     {
          //       name: '', 
          //       xAxis: x,
          //     },
          //     {
          //       name: '', yAxis: y
          //     }
          //   ]
          // },
          markLine: {
            label: {
              normal: {
                formatter: function (params) {
                  return params.name
                },
                color: "#666666",
                position: 'end',
              },
            },
            lineStyle: {
              normal: {
                color: "#C4C4C4",
                type: 'solid',
                width: 2,
              },
            },
            //---------坐标轴
            data: [{
              xAxis: x,
              name: '平均分'
            }, {
              yAxis: y,
              name: '标\n准\n差'
            }]
          },
        }]
      }
      let offsetWidth2 = document.getElementById(id) && document.getElementById(id).offsetWidth;
      let offsetHeight = document.getElementById(id) && document.getElementById(id).offsetHeight;
      this.setState({
        offsetWidth: offsetWidth2,
        myChart: myChart,
        offsetHeight:offsetHeight
      }, () => { myChart.resize(); })
      myChart.setOption(option);
      window.addEventListener('resize', () => {
        let offsetWidth1 = document.getElementById(id) && document.getElementById(id).offsetWidth;
        if (offsetWidth > 0) {
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
    const { offsetWidth, myChart, img,offsetHeight } = this.state;
    const { id = 'PerformanceCompetitivenessCharts' } = this.props;
    return (
      <div className={styles['PerformanceCompetitivenessCharts']} id={id}>
        <img src={img} alt='成绩竞争力' className='ClassReportimg' />
        <div id={id + '1'} style={{ width: 1000, height: offsetHeight>400?offsetHeight:400, display: 'none' }} />
        <div id={id + '2'} style={{ width: offsetWidth, height: offsetHeight>400?offsetHeight:400 }} className={'no-print'} />
      </div>
    )
  }
}