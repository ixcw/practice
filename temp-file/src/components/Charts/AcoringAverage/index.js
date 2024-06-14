/**
 *@Author:xiongwei
 *@Description:认知层次得分率
 *@Date:Created in  2021/3/4
 *@Modified By:
 */
import React from 'react';
import styles from './index.less';
import eCharts from 'echarts';
import 'echarts/lib/chart/bar';
import { connect } from 'dva';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import { existArr } from '@/utils/utils';
import { TopicManage as namespace } from "@/utils/namespace";

@connect(state => ({ findClassReportTreeScore: state[namespace].findClassReportTreeScore }))
export default class AcoringAverage extends React.Component {
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
    const { yData, xData, yDatai, id, name } = this.props;
    let myChart = eCharts.init(document.getElementById(id + '2'));
    let myChart1 = eCharts.init(document.getElementById(id + '1'));
    let option = {
      legend: {
        data: existArr(yDatai) && yDatai[0] != undefined ? ['全班', '个人'] : ['全班'],
        left: 'right',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: (e) => {
          if (e[1]) {
            return `${e[0].name}<br/>班级得分率：${e[0].value}%<br/>个人得分率：${e[1].value}%`
          } else {
            return `${e[0].name}<br/>班级得分率：${e[0].value}%`
          }
        }
      },
      grid: {
        top: '60px',
        left: '30px',
        right: '10%',
        bottom: '30px',
        containLabel: true
      },
      xAxis: [
        {
          name: name,
          type: 'category',
          // ---------------------------------------------------------------------------------
          data: xData,
          axisLabel: {
            show: true,
            textStyle: {
              //  color: '#c3dbff',  //更改坐标轴文字颜色
              fontSize: 14      //更改坐标轴文字大小
            }
          },
          axisTick: {
            alignWithLabel: true
          }
        },
      ],
      yAxis: [
        {
          name: '得分率',
          type: 'value',
          max: 100,
          axisLabel: {
            formatter: `{value}%`
          }
        }
      ],
      dataZoom: [
        {
          type: 'slider',
          show: yData.length > 10,
          xAxisIndex: [0],
          start: 0,                               //数据窗口范围的起始百分比,表示30%
          end: yData.length > 10 ? (1 - (yData.length - 10) / yData.length) * 100 : 100,
        },
        //设置x轴方向上，鼠标支持滚轮
        {
          type: 'inside',
          xAxisIndex: [0],
        },
      ],
      series: [
        {
          name: '全班',
          type: 'bar',
          barWidth: '15%',
          data: yData,
          itemStyle: {
            //通常情况下：
            normal: {
              label: {
                formatter: (c) => c.data + '%',
                show: true,
                position: "top",
                textStyle: {
                  fontWeight: "bolder",
                  fontSize: "12",
                }
              },
              //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
              color: '#5999F7'
            },

            //鼠标悬停时：
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
        }
      ]
    };
    if (existArr(yDatai)) {
      option.series.push(
        {
          name: '个人',
          type: 'bar',
          barWidth: '15%',
          data: yDatai,
          itemStyle: {
            //通常情况下：
            normal: {
              label: {
                formatter: (c) => c.data + '%',
                show: true,
                position: "top",
                textStyle: {
                  fontWeight: "bolder",
                  fontSize: "12",
                }
              },
              //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
              color: '#EF7023'
            },

            //鼠标悬停时：
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
        }
      )
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
    // }
  }
  render() {
    const { offsetWidth, myChart, img } = this.state;
    const { id } = this.props;
    return (
      <div className={styles['AcoringAverage']} id={id}>
        <img src={img} alt='认知层次' className='ClassReportimg' />
        <div id={id + "1"} style={{ width: 1200, height: 500, display: 'none' }} />
        <div id={id + "2"} style={{ width: offsetWidth, height: 400 }} className={'no-print'} />
      </div>
    )
  }
}