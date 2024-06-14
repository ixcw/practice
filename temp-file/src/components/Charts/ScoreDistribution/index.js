/**
 *@Author:xiongwei
 *@Description:年级报告得分率分布
 *@Date:Created in  2021/4/30
 *@Modified By:
 */
import React from 'react'
import styles from './index.less'
import eCharts from 'echarts';
import { existArr } from '@/utils/utils';
import 'echarts/lib/chart/bar';
// import { connect } from 'dva';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
// import { TopicManage as namespace } from "@/utils/namespace";

// @connect(state => ({ findClassReportTreeScore: state[namespace].findClassReportTreeScore }))
export default class ScoreDistribution extends React.Component {
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
    const { data = [], id = 'ScoreDistribution' } = this.props;
    if (data.length !== 0) {
    // 基于准备好的dom，初始化echarts实例
    let myChart = eCharts.init(document.getElementById(id + '2'));
    let myChart1 = eCharts.init(document.getElementById(id + '1'));
    let yData=[];
    let aData=[];
    let bData=[];
    let cData=[];
    let dData=[];
    existArr(data)&&data.map(({className,data3,data2,data1,data0})=>{
      yData.push(className);
      aData.push(data0);
      bData.push(data1);
      cData.push(data2);
      dData.push(data3);
    });
    
    let option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // Use axis to trigger tooltip
          type: 'shadow',      // 'shadow' as default; can also be 'line' or 'shadow'

        },
        formatter: (c) => {
          if (c.length > 0) {
            let str = `${c[0].name}<br/>`;
            c.map(({ marker, seriesName, value }) => {
              str = str + `${marker}${seriesName}:${Math.abs(value)}%<br/>`
            })
            return str
          } else {
            return ''
          }
        }
      },
      legend: {
        data: ['A等(得分率>=80%)', 'B等(得分率>=60%<80%)', 'C等(得分率>=40%<60%)', 'D等(得分率<40%)']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        max: 100,
        // min: -100,
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
      yAxis: {
        // name: '班级',
        type: 'category',
        data: yData,
        axisTick: { //y轴刻度线
          show: false
        },
        // axisLine: { //y轴
        //   show: false
        // },
        splitLine: { show: true },
      },
      // dataZoom: [
      //   {
      //     type: 'slider',
      //     show: true,//---------------------------------------------------------------
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
          name: 'A等(得分率>=80%)',
          type: 'bar',
          stack: 'total',
          label: {
            show: false,
            formatter: (c) => Math.abs(c.data) + '%'
          },
          emphasis: {
            focus: 'series'
          },
          itemStyle: {
            normal: {
              color: '#28EFC2',
            },
          },
          barWidth: 30,//柱图宽度
          data: aData
        },
        {
          name: 'B等(得分率>=60%<80%)',
          type: 'bar',
          stack: 'total',
          label: {
            show: false,
            formatter: (c) => Math.abs(c.data) + '%'
          },
          emphasis: {
            focus: 'series'
          },
          itemStyle: {
            normal: {
              color: '#4FABFF',

            },
          },
          barWidth: 30,//柱图宽度
          data: bData
        },
        {
          name: 'C等(得分率>=40%<60%)',
          type: 'bar',
          stack: 'total',
          label: {
            show: false,
            formatter: (c) => Math.abs(c.data) + '%',
          },
          emphasis: {
            focus: 'series'
          },
          itemStyle: {
            normal: {
              color: '#FFD52D',
            },
            barWidth: 30,//柱图宽度
          },
          data: cData
        },
        {
          name: 'D等(得分率<40%)',
          type: 'bar',
          stack: 'total',
          label: {
            show: false,
            formatter: (c) => Math.abs(c.data) + '%',
          },
          emphasis: {
            focus: 'series'
          },
          itemStyle: {
            normal: {
              color: '#FF5524',
            },
            barWidth: 30,//柱图宽度
          },
          data: dData
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
    const { id = 'ScoreDistribution' } = this.props;
    return (
      <div className={styles['ScoreDistribution']} id={id}>
        <img src={img} alt='得分率分布' className='ClassReportimg' />
        <div id={id + '1'} style={{ width: 1000, height: 600, display: 'none' }} />
        <div id={id + '2'} style={{ width: offsetWidth, height: offsetHeight>400?offsetHeight:400 }} className={'no-print'} />
      </div>
    )
  }
}