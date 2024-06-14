/**
 *@Author:xiongwei
 *@Description:总分得分分布图
 *@Date:Created in  2020/9/28
 *@Modified By:
 */
import React from 'react'
import styles from './goalDistribute.module.less'
import eCharts from 'echarts';
import 'echarts/lib/chart/bar';
import { getIcon, existArr } from "@/utils/utils";
// import ReactEcharts from 'echarts-for-react'

import * as echarts from 'echarts'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import { TopicManage as namespace } from "@/utils/namespace";


const IconFont = getIcon();

export default class GoalDistribute extends React.Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      offsetWidth: 500,
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
    const { findClassReportTotalScoreDistribution = {}, id = '' } = this.props;
    let myChart = eCharts.init(document.getElementById(id + '2'));
    let myChart1 = eCharts.init(document.getElementById(id + '1'));
    let { xData, yData, yDataRate,yDataName } = findClassReportTotalScoreDistribution;
    if (existArr(yData) && existArr(xData) && existArr(yDataRate)) {
      // var yMax = 500;
      // var dataShadow = [];
      yDataRate.map((item, index) => {
        yDataRate[index] = Number(item).toFixed(0)
      })
      // for (var i = 0; i < yDataRate.length; i++) {
      //   dataShadow.push(yMax);
      // }
      let magnification = 15;
      var option = {
        // color: "#188df0",
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow',       // 默认为直线，可选为：'line' | 'shadow'

          },
          formatter: function (params) {
            if(existArr(yDataName)){
              let str=`${params[0].name}分数段占比：${ params[0].data}%(${yData[params[0].dataIndex]}人)`;
              let nameArr=yDataName[params[0].dataIndex].split(",");
              existArr(nameArr)&&nameArr.map((item,index)=>{
                str+=`<br/>${index+1}--${item}`
              })
              return str
          }else{
            return params[0].name + '分数段占比：' + params[0].data + "%(" + yData[params[0].dataIndex] + '人)'
          }
          }
        },
        //设置显示不完，可拖动
        dataZoom: [
          {
            type: 'slider',
            show: xData.length > 10,
            xAxisIndex: [0],
            start: 0,                               //数据窗口范围的起始百分比,表示30%
            end: xData.length > 15 ? (1 - (xData.length - 10) / xData.length) * 100 : 100,
          },
          //设置x轴方向上，鼠标支持滚轮
          {
            type: 'inside',
            xAxisIndex: [0],
          },
        ],
        xAxis: {
          type: 'category',
          data: xData,
          axisLabel: {
            // inside: true,
            interval: Math.floor(xData.length / 15),
            rotate: 25,
            textStyle: {
              //  color: '#c3dbff',  //更改坐标轴文字颜色
              fontSize: 12      //更改坐标轴文字大小
            }
          },
          axisTick: {
            interval: 0,
            alignWithLabel: true,
            // show: false
          },
          axisLine: {
            show: false
          },
          z: 10,
          // silent: false,
          // splitLine: {
          //       show: false
          //   },
          //   splitArea: {
          //       show: false
          //   }
        },
        yAxis: {
          //   splitArea: {
          //     show: false
          // },
          //y刻度
          // minInterval: 0.01,
          // interval:1,
          axisLine: {
            // show: false
          },
          axisTick: {
            // show: false
          },
          axisLabel: {
            textStyle: {
              color: '#999'
            },
            formatter: '{value}%'
          }
        },
        // dataZoom: [
        //   {
        //     type: 'inside'
        //   }
        // ],
        series: [
          {
            type: 'bar',
            // large:true,
            itemStyle: {
              //柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
              emphasis: {
                barBorderRadius: [10, 10, 10, 10]
              },

              normal: {
                barBorderRadius: [10, 10, 10, 10],
                label: {
                  formatter: (c) => {
                    if (c.data == 0) {
                      return ''
                    } else {
                      return c.data + "%(" + yData[c.dataIndex] + '人)'
                    }
                  },
                  show: true,
                  color: '#188df0',
                  position: "top",
                  textStyle: {
                    fontWeight: "bolder",
                    fontSize: "12",
                    color: "#188df0"
                  }
                },
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#83bff6' },
                    { offset: 0.5, color: '#188df0' },
                    { offset: 1, color: '#188df0' }
                  ]
                ),
              }
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#2378f7' },
                    { offset: 0.7, color: '#2378f7' },
                    { offset: 1, color: '#83bff6' }
                  ]
                )
              }
            },
            barWidth: '10%',
            // xData && xData.length > magnification?'':30,//柱图宽度
            data: yDataRate,
          }
        ]
      };

      // Enable data zoom when user click bar.
      // var zoomSize = 6;
      // myChart.on('click', function (params) {
      //   // console.log(xData[Math.max(params.dataIndex - zoomSize / 2, 0)]);
      //   myChart.dispatchAction({
      //     type: 'dataZoom',
      //     startValue: xData[Math.max(params.dataIndex - zoomSize / 2, 0)],
      //     endValue: xData[Math.min(params.dataIndex + zoomSize / 2, yData.length - 1)]
      //   });
      // });
      let offsetWidth2 = document.getElementById("ClassReportmyChartmain3Box") && document.getElementById(id).offsetWidth;
      this.setState({
        offsetWidth: offsetWidth2,
        myChart: myChart
      }, () => { myChart.resize(); })
      myChart.setOption(option);
      window.addEventListener('resize', () => {
        let offsetWidth1 = document.getElementById("ClassReportmyChartmain3Box") && document.getElementById(id).offsetWidth;
        if (offsetWidth > 258) {
          this.setState({
            offsetWidth: offsetWidth1
          })
        }
        myChart.resize();
      })
      // let options=JSON.parse(JSON.stringify(option));
      // options.dataZoom=[];
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
    const { id } = this.props;
    // let {minScore,avgScore,passRate,maxScore} = findClassReportTotalScoreDistribution;
    // let nmbs = Object.keys(findClassReportTotalScoreDistribution).length>0?findClassReportTotalScoreDistribution:{};
    // let array = [
    //   {level: '最高分', nmb: nmbs.maxScore, icon: 'icon-zuidazhi', color: '#0c94f9'},
    //   {level: '最低分', nmb: nmbs.minScore, icon: 'icon-zuixiaozhi', color: '#f10b0b'},
    //   {level: '平均分', nmb: nmbs.avgScore, icon: 'icon-pingjunzhi'},
    //   {level: '及格率', nmb: `${(nmbs.passRate)*100}%`, icon: 'icon-zhengque'}];

    return (
      <div className={styles['goalDiagram']} id={id}>
        <img src={img} alt='总分分布' className='ClassReportimg' />
        <div id={id + "1"} style={{ width: 900, height: 550, display: 'none' }} key='1'></div>
        <div id={id + "2"} style={{ width: offsetWidth, height: 550 }} key='2' className={'no-print'}></div>
      </div>
    )
  }
}
