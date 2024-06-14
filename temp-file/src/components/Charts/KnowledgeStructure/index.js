/**
 *@Author:xiongwei
 *@Description:知识结构图
 *@Date:Created in  2021/3/4
 *@Modified By:
 */
import React from 'react'
import styles from './index.less'
import eCharts from 'echarts';
import 'echarts/lib/chart/line';
import { connect } from 'dva';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import { existArr } from '@/utils/utils';
import { TopicManage as namespace } from "@/utils/namespace";

@connect(state => ({ findClassReportTreeScore: state[namespace].findClassReportTreeScore }))
export default class KnowledgeStructure extends React.Component {
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
    const { findExemQuestionKnowStructure = [], id } = this.props;
    if (Object.keys(findExemQuestionKnowStructure).length !== 0) {
      let xData = [];
      let yData = [];
      let yDatatow = [];
      findExemQuestionKnowStructure && findExemQuestionKnowStructure.map(({ name, scoreRate, classScoreRate }) => {
        xData.push(name);
        if (classScoreRate == 0) {
          yData.push(0);
        } else {
          yData.push(classScoreRate);
        }
        if (scoreRate == 0) {
          yDatatow.push(0);
        } else {
          classScoreRate && yDatatow.push(scoreRate);
        }
      })
      // 基于准备好的dom，初始化echarts实例
      let myChart = eCharts.init(document.getElementById(id + '2'));
      let myChart1 = eCharts.init(document.getElementById(id + '1'));
      let option = {
        legend: {
          data: existArr(yDatatow)&&yDatatow[0]!=undefined ? ['班级得分率', '个人得分率'] : ['班级得分率'],
          left: 'right',
        },
        tooltip: {
          trigger: 'axis',
          formatter: (e) => {
            if (e[1]) {
              return `${e[0].name}<br/>班级得分率：${e[0].value}%<br/>个人得分率：${e[1].value}%`
            } else {
              return `${e[0].name}<br/>班级得分率：${e[0].value}%`
            }
          }
        },
        xAxis: {
          type: 'category',
          data: xData,
          axisLabel: {
            interval: 0,
            rotate: 15,
            formatter: (value) => {
              if (value.length > 10) {
                return `${value.slice(0, 10)}...`;
              }
              return value;
            }
          }
        },
        yAxis: {
          type: 'value',
          name: '得分率',
          max: '100',
          axisLabel: {
            formatter: `{value}%`
          }
        },
        dataZoom: [
          {
            type: 'slider',
            show: xData.length > 10,
            xAxisIndex: [0],
            start: 0,                               //数据窗口范围的起始百分比,表示30%
            end:xData.length>10?(1-(xData.length-10)/xData.length)*100:100,
          },
          //设置x轴方向上，鼠标支持滚轮
          {
            type: 'inside',
            xAxisIndex: [0],
          },
        ],
        series: [
          {
            name: '班级得分率',
            data: yData,
            type: 'line',
            lineStyle: {
              width: 3// 0.1的线条是非常细的了 
            },
            symbol: 'circle',//拐点样式
            symbolSize: 8,//拐点大小
            itemStyle: {
              //通常情况下：
              normal: {
                //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                color: '#5999F7',
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
      if (yDatatow) {
        option.series.push(
          {
            name: '个人得分率',
            data: yDatatow,
            type: 'line',
            lineStyle: {
              width: 3// 0.1的线条是非常细的了 
            },
            symbol: 'circle',//拐点样式
            symbolSize: 8,//拐点大小
            itemStyle: {
              //通常情况下：
              normal: {
                //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                color: '#F51D1E',
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
    }
  }
  render() {
    const { offsetWidth, myChart, img } = this.state;
    const { id } = this.props;
    return (
      <div className={styles['KnowledgeStructure']} id={id}>
        <img src={img} alt='知识结构' className='ClassReportimg' />
        <div id={id + "1"} style={{ width: 1000, height: 400, display: 'none' }} />
        <div id={id + "2"} style={{ width: offsetWidth, height: 400 }} className={'no-print'} />
      </div>
    )
  }
}