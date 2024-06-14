/**
 *@Author:xiongwei
 *@Description:题型得分分布
 *@Date:Created in  2020/11/10
 *@Modified By:
 */
import React from 'react'
import styles from './questionTypeScore.less'
import eCharts from 'echarts';
import 'echarts/lib/chart/bar';
import { getIcon } from "@/utils/utils";
import { connect } from 'dva';
// import ReactEcharts from 'echarts-for-react'

import * as echarts from 'echarts'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import { TopicManage as namespace } from "@/utils/namespace";


const IconFont = getIcon();
@connect(state => ({
  questionCategoryScore: state[namespace].questionCategoryScore
}))
export default class QuestionTypeScore extends React.Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      offsetWidth: 500,
      img: '',
      colorArr: ['#7352cf', '#5aab09',
        '#e54e6c', '#f9d44b', '#e57673',
        '#7ab2e0', '#f9e44b', '#cb3d88',
        '#c2ec47', '#ff7300', '#f74a4f',
        '#e6f54a', '#2e9991', '#93ca76',
        '#fde8d0', '#028760', '#59b9c6'],
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
    const { offsetWidth, colorArr } = this.state;
    const { questionCategoryScore } = this.props;
    if (questionCategoryScore) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = eCharts.init(document.getElementById('ClassReportmyChartmain5'));
      let myChart1 = eCharts.init(document.getElementById('ClassReportmyChartmain5-1'));
      let xData = questionCategoryScore.map(re => re.category);
      let yData = questionCategoryScore.map((re, index) => ({
        name: re.category,
        itemStyle: { color: colorArr[index] },
        value: re.scoringRate
      }));
      let option = {
        tooltip: {
          trigger: 'axis',
          formatter: '{b}:{c}%',
          axisPointer: {
            type: 'shadow'
          }
        },
        title: {
          left: 'center',
          textStyle: {
            fontSize: 30,
            color: '#7f7f7f'
          }
        },
        grid: {
          top: '10%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            name: '(题型)',
            nameTextStyle: {
              fontSize: 15,
              color: '#c1c1c1'
            },
            type: 'category',
            data: xData,
            axisLabel: {
              show: true,
               textStyle: {
                //  color: '#c3dbff',  //更改坐标轴文字颜色
                 fontSize : 16      //更改坐标轴文字大小
               },
               interval: 0,
               formatter: xData.length >= 7 ? function (value) {
                return value.split("").join("\n");
              } : undefined
            },
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            name: '(得分率)',
            axisLabel: {
              formatter: '{value}%'
            },
            nameTextStyle: {
              fontSize: 15,
              color: '#c1c1c1'
            },
            type: 'value'
          }
        ],
        legend: {
          data: xData
        },
        series: [
          {
            label: {
              show: true,
              position: 'top',
              formatter: '{c}%'
            },
            type: 'bar',
            barWidth: '60%',
            data: yData
          }
        ]
      };
      // });
      let offsetWidth2 = document.getElementById("ClassReportmyChartmain5Box") && document.getElementById("ClassReportmyChartmain5Box").offsetWidth;
      this.setState({
        offsetWidth: offsetWidth2,
        myChart: myChart
      }, () => { myChart.resize(); })
      myChart.setOption(option);
      window.addEventListener('resize', () => {
        let offsetWidth1 = document.getElementById("ClassReportmyChartmain5Box") && document.getElementById("ClassReportmyChartmain5Box").offsetWidth;
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
    const { offsetWidth, img } = this.state;
    return (
      <div className={styles['goalDiagram']} id='ClassReportmyChartmain5Box'>
        <img src={img} alt='总分分布' className='ClassReportimg' />
        <div id="ClassReportmyChartmain5-1" style={{ width: 1300, height: 450, display: 'none' }}></div>
        <div id="ClassReportmyChartmain5" style={{ width: offsetWidth, height: 450 }}></div>
      </div>
    )
  }
}