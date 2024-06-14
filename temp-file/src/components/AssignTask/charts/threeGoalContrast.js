/**
 *@Author:ChaiLong
 *@Description:三分比较
 *@Date:Created in  2019/12/20
 *@Modified By:
 */
import React from 'react'
import styles from './threeGoalContrast.module.less'
import eCharts from 'echarts';
import 'echarts/lib/chart/pie';
import { connect } from 'dva';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import { TopicManage as namespace } from "@/utils/namespace";

@connect(state => ({ findClassReportTreeScore: state[namespace].findClassReportTreeScore }))
export default class ThreeGoalContrast extends React.Component {
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
    const { findClassReportTreeScore={} } = this.props;
    if (Object.keys(findClassReportTreeScore).length !== 0) {
      const { xData, yData } = findClassReportTreeScore;
      // 基于准备好的dom，初始化echarts实例
      let myChart = eCharts.init(document.getElementById('ClassReportmyChartmain2'));
      let myChart1 = eCharts.init(document.getElementById('ClassReportmyChartmain2-1'));
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: (c) => c[0].name + ':' + c[0].value
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
            type: 'category',
            data: xData,
            axisLabel: {
              show: true,
               textStyle: {
                //  color: '#c3dbff',  //更改坐标轴文字颜色
                 fontSize : 18      //更改坐标轴文字大小
               }
            },
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '总分三分比较',
            type: 'bar',
            barWidth: '40%',
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
                color: function (params) {
                  var colorList = ['#88EFFC', '#F1BA6A', '#E85233'];
                  return colorList[params.dataIndex];
                }
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
      let offsetWidth2 = document.getElementById("ClassReportmyChartmain2Box") && document.getElementById("ClassReportmyChartmain2Box").offsetWidth;
      this.setState({
        offsetWidth: offsetWidth2,
        myChart: myChart
      }, () => { myChart.resize(); })
      myChart.setOption(option);
      window.addEventListener('resize', () => {
        let offsetWidth1 = document.getElementById("ClassReportmyChartmain2Box") && document.getElementById("ClassReportmyChartmain2Box").offsetWidth;
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
      <div className={styles['threeGoalContrast']} id='ClassReportmyChartmain2Box'>
        <img src={img} alt='完成率' className='ClassReportimg' />
        <div id="ClassReportmyChartmain2-1" style={{ width: 400, height: 400, display: 'none' }} />
        <div id="ClassReportmyChartmain2" style={{ width: offsetWidth, height: 400 }} />
      </div>
    )
  }
}
