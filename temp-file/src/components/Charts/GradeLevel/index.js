/**
 *@Author:xiongwei
 *@Description:年级能力水平图
 *@Date:Created in  2021/3/4
 *@Modified By:
 */
import React from 'react'
import styles from './index.less'
import eCharts from 'echarts';
import 'echarts/lib/chart/line';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

export default class GradeLevel extends React.Component {
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
    const { GradeReporteClassAbilityList = [], id } = this.props;
    if (GradeReporteClassAbilityList.length !== 0) {
      let GradeData = 0
      let xData2 = []
      let yData = GradeReporteClassAbilityList.map(({ ability, id }) => {
        if (id == -1) {
          GradeData = ability
        }
        return ability
      });
      let xData = GradeReporteClassAbilityList.map(({ className }) => {
        xData2.push(GradeData)
        return className
      });
      // 基于准备好的dom，初始化echarts实例
      let myChart = eCharts.init(document.getElementById(id + '2'));
      let myChart1 = eCharts.init(document.getElementById(id + '1'));
      let option = {
        legend: {
          data: ['能力水平', '本校'],
          left: 'right',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: (e) => `能力水平<br/>${e[0].marker}${e[0].name}:${e[0].value}<br/>${e[1].marker}${e[1].seriesName}:${e[1].value}`
        },
        grid: {
          top: '60px',
          left: '30px',
          right: '4%',
          bottom: '30px',
          containLabel: true
        },
        xAxis: [
          {
            name: '班级',
            type: 'category',
            // ---------------------------------------------------------------------------------
            data: xData,
            axisLabel: {
              show: true,
              textStyle: {
                //  color: '#c3dbff',  //更改坐标轴文字颜色
                fontSize: 18      //更改坐标轴文字大小
              }
            },
            axisTick: {
              alignWithLabel: true
            }
          },
        ],
        yAxis: [
          {
            name: '能力水平',
            type: 'value',
            max: '1',
          }
        ],
        series: [
          {
            name: '能力水平',
            type: 'bar',
            barWidth: '10%',
            data: yData,
            itemStyle: {
              //通常情况下：
              normal: {
                label: {
                  formatter: (c) => c.data,
                  show: true,
                  position: "top",
                  textStyle: {
                    fontWeight: "bolder",
                    fontSize: "12",
                  }
                },
                //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                color: '#589AF1',
              },

              //鼠标悬停时：
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
          },
          //横线
          {
            name: '本校',
            data: xData2,
            type: 'line',
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ],
              symbol: ['none', 'none'],
              label: {
                // position:'start',
                show: true,
                formatter: `本校(${GradeData})`
              },
              itemStyle: {
                //通常情况下：
                normal: {
                  // borderWidth: 500,
                  lineStyle: {
                    // borderWidth: 500,
                    width:3,
                    type: 'solid',
                    color: '#EE0A0A',
                  }
                },
              }
            },
            itemStyle: {
              //通常情况下：
              normal: {
                lineStyle: {
                  type: 'solid',
                  color: '#EE0A0A',
                }
              },
            }
          }
        ]
      };
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
      <div className={styles['AbilityLevel']} id={id}>
        <img src={img} alt='能力水平' className='ClassReportimg' />
        <div id={id + '1'} style={{ width: 1200, height: 600, display: 'none' }} />
        <div id={id + '2'} style={{ width: offsetWidth, height: 400 }} className={'no-print'} />
      </div>
    )
  }
}