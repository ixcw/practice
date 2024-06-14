/**
 *@Author:xiongwei
 *@Description:总得分分布
 *@Date:Created in  2021/3/8
 *@Modified By:
 */
import React from 'react'
import styles from './TotalScoreDistribution.less'
import eCharts from 'echarts';
import 'echarts/lib/chart/bar';
// import { connect } from 'dva';
// 引入提示框和标题组件
import { getIcon, getLocationObj } from "@/utils/utils";
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
const IconFont = getIcon();
export default class TotalScoreDistribution extends React.Component {
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
    const { findStudentReportTotalScoreDistribution = {}, location } = this.props;
    
    // 基于准备好的dom，初始化echarts实例
    let myChart = eCharts.init(document.getElementById('ClassReportmyChartmainTotalScoreDistribution2'));
    let myChart1 = eCharts.init(document.getElementById('ClassReportmyChartmainTotalScoreDistribution1'));
    let option = {
      legend: {
        data: ['班级得分率'],
        // left: 'right',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: (e) => {
          return `${e[0].name}<br/>分段占比：${e[0].value}%`
        }
      },
      xAxis: {
        type: 'category',
        data: findStudentReportTotalScoreDistribution.xData
      },
      yAxis: {
        type: 'value',
        max: 100,
        name: '占比(%)',
        axisLabel: {
          formatter: `{value}%`
        }
      },
      dataZoom: [
        {
          type: 'slider',
          show: findStudentReportTotalScoreDistribution.xData.length > 15,
          xAxisIndex: [0],
          start: 0,                               //数据窗口范围的起始百分比,表示30%
          end: findStudentReportTotalScoreDistribution.xData.length > 15 ? (1 - (findStudentReportTotalScoreDistribution.xData.length - 15) / findStudentReportTotalScoreDistribution.xData.length) * 100 : 100,
        },
        //设置x轴方向上，鼠标支持滚轮
        {
          type: 'inside',
          xAxisIndex: [0],
        },
      ],
      series: [
        {
          data: findStudentReportTotalScoreDistribution.y2Data,
          type: 'bar',
          barWidth: '30%',
          itemStyle: {
            //通常情况下：
            normal: {
              //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
              color: '#5999F7',
              label: {
                show: true,		//开启显示
                position: 'top',	//在上方显示
                textStyle: {	    //数值样式
                  color: 'black',
                  fontSize: 16
                },
                formatter: (formatter) => findStudentReportTotalScoreDistribution.y1Data[formatter.dataIndex] ? findStudentReportTotalScoreDistribution.y1Data[formatter.dataIndex] + '人' : ""
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
    let offsetWidth2 = document.getElementById("ClassReportmyChartmainTotalScoreDistribution") && document.getElementById("ClassReportmyChartmainTotalScoreDistribution").offsetWidth;
    this.setState({
      offsetWidth: offsetWidth2,
      myChart: myChart
    }, () => { myChart.resize(); })
    myChart.setOption(option);
    window.addEventListener('resize', () => {
      let offsetWidth1 = document.getElementById("ClassReportmyChartmainTotalScoreDistribution") && document.getElementById("ClassReportmyChartmainTotalScoreDistribution").offsetWidth;
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
  render() {
    const { offsetWidth, myChart, img } = this.state;
    const { findStudentReportTotalScoreDistribution = {},location } = this.props;
    const _location = getLocationObj(location);
    const { query } = _location || {};
    return (
      <div className={styles['TotalScoreDistribution']} id='ClassReportmyChartmainTotalScoreDistribution'>
        {query.jobType != 1 && <div className={styles['title']} >
          <div><IconFont type='icon-1' />
          &nbsp;&nbsp;我的得分:
          {findStudentReportTotalScoreDistribution.TreeScoreCompare && findStudentReportTotalScoreDistribution.TreeScoreCompare.myScore}
          </div>
          <div><IconFont type='icon-2' />
          &nbsp;&nbsp;最高分:
          {findStudentReportTotalScoreDistribution.TreeScoreCompare && findStudentReportTotalScoreDistribution.TreeScoreCompare.classMaxScore}
          </div>
          <div><IconFont type='icon-3' />
          &nbsp;&nbsp;最低分:
          {findStudentReportTotalScoreDistribution.TreeScoreCompare && findStudentReportTotalScoreDistribution.TreeScoreCompare.classMinScore}
          </div>
          <div><IconFont type='icon-4' />
          &nbsp;&nbsp;平均分:
          {findStudentReportTotalScoreDistribution.TreeScoreCompare && findStudentReportTotalScoreDistribution.TreeScoreCompare.classAvgScore}
          </div>
        </div>}
        <img src={img} alt='总得分分布' className='ClassReportimg' />
        <div id="ClassReportmyChartmainTotalScoreDistribution1" style={{ width: 1200, height: 600, display: 'none' }} />
        <div id="ClassReportmyChartmainTotalScoreDistribution2" style={{ width: offsetWidth, height: 500 }} />
      </div>
    )
  }
}