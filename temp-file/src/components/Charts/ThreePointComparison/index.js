/**
 *@Author:xiongwei
 *@Description:年级报告三分比较
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
export default class ThreePointComparison extends React.Component {
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
    const { GradeReportTreeScoreList = [], id = 'ThreePointComparison' } = this.props;
    if (GradeReportTreeScoreList.length !== 0) {
    // 基于准备好的dom，初始化echarts实例
    let myChart = eCharts.init(document.getElementById(id + '2'));
    let myChart1 = eCharts.init(document.getElementById(id + '1'));
    let yData=GradeReportTreeScoreList.map(({className})=>className)
    let AvgScore=GradeReportTreeScoreList.map(({classAvgScore})=>classAvgScore)
    let MaxScore=GradeReportTreeScoreList.map(({classMaxScore})=>classMaxScore)
    let MinScore=GradeReportTreeScoreList.map(({classMinScore})=>classMinScore)
    let xMax=GradeReportTreeScoreList.map(()=>150)
    let option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // Use axis to trigger tooltip
          type: 'shadow'        // 'shadow' as default; can also be 'line' or 'shadow'
        }
      },
      legend: {
        data: ['最低分', '平均分', '最高分']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        axisTick: { //y轴刻度线
          show: false
        },
        axisLine: { //y轴
          show: false
        },
        splitLine: {
          show: false,
          //  interval:(index, value) =>index==1?true:false
        },
        axisLabel: {
          show: false,
          // formatter: (c) => Math.abs(c),
        }
      },
      yAxis:
        [
          {
            name: '班级',
            type: 'category',
            data: yData
          },
          // {
          //   name: '满分',
          //   type: 'category',
          //   axisTick: { //y轴刻度线
          //     show: false
          //   },
          //   axisLine: { //y轴
          //     show: false
          //   },
          //   splitLine: {
          //     show: false,
          //     //  interval:(index, value) =>index==1?true:false
          //   },
          //   // data: xMax
          // },
        ]
      ,
      // dataZoom: [
      //   {
      //     type: 'slider',
      //     show: GradeReportTreeScoreList.length>10,
      //     yAxisIndex: [0],
      //     start: 0,                               //数据窗口范围的起始百分比
      //     end: 50,
      //   },
      //   //设置x轴方向上，鼠标支持滚轮
      //   {
      //     type: 'inside',
      //     yAxisIndex: [0],
      //   },
      // ],
      series: [
        {
          name: '最低分',
          type: 'bar',
          stack: 'total',
          label: {
            show: true
          },
          emphasis: {
            focus: 'series'
          },
          itemStyle: {
            normal: {
              color: '#7FCBFF',
            },
          },
          barWidth: 30,//柱图宽度
          data: MinScore
        },
        {
          name: '平均分',
          type: 'bar',
          stack: 'total',
          label: {
            show: true
          },
          emphasis: {
            focus: 'series'
          },
          itemStyle: {
            normal: {
              color: '#57AFF9',

            },
          },
          barWidth: 30,//柱图宽度
          data: AvgScore
        },
        {
          name: '最高分',
          type: 'bar',
          stack: 'total',
          label: {
            show: true
          },
          emphasis: {
            focus: 'series'
          },
          itemStyle: {
            normal: {
              color: '#3685EA',
              barBorderRadius: [0, 50, 50, 0],

            },
            emphasis: {
              barBorderRadius: [0, 50, 50, 0],
            },
            barWidth: 30,//柱图宽度
          },
          data: MaxScore
        },
      ]
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
      if (offsetWidth >0) {
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
    const { id = 'ThreePointComparison' } = this.props;
    return (
      <div className={styles['ThreePointComparison']} id={id}>
        <img src={img} alt='三分比较' className='ClassReportimg' />
        <div id={id + '1'} style={{ width: 1000, height: 600, display: 'none' }} />
        <div id={id + '2'} style={{ width: offsetWidth, height: offsetHeight>400?offsetHeight:400 }} className={'no-print'} />
      </div>
    )
  }
}