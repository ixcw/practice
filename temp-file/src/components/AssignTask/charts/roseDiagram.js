/**
 *@Author:ChaiLong
 *@Description:玫瑰图
 *@Date:Created in  2019/12/20
 *@Modified By:
 */
import React from 'react'
import styles from './roseDiagram.module.less'
import eCharts from 'echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import { TopicManage as namespace } from "@/utils/namespace";
import { connect } from 'dva';


@connect(state => ({ findClassReportTotalScoreRate: state[namespace].findClassReportTotalScoreRate }))
export default class RoseDiagram extends React.Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      offsetWidth: 376,
      myChart: {},
      img: ''
    }
  }
  //   UNSAFE_componentWillReceiveProps(){
  //     const offsetWidth2=document.getElementById("RoseDiagrammain1").offsetWidth;
  //     this.setState({
  //       offsetWidth:offsetWidth2
  //     })
  // }
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
    const { findClassReportTotalScoreRate={} } = this.props;
    if (Object.keys(findClassReportTotalScoreRate).length !== 0) {
      const { aNum = 0, bNum = 0, cNum = 0, dNum = 0 } = findClassReportTotalScoreRate;
      const countNum = aNum + bNum + cNum + dNum;
      // 基于准备好的dom，初始化echarts实例
      let myChart = eCharts.init(document.getElementById('ClassReportmyChartmain1'));
      let myChart1 = eCharts.init(document.getElementById('ClassReportmyChartmain1-1'));
      let nData = [
        { value: (aNum / countNum).toFixed(2) * 100, name: 'A' },
        { value: (bNum / countNum).toFixed(2) * 100, name: 'B' },
        { value: (cNum / countNum).toFixed(2) * 100, name: 'C' },
        { value: (dNum / countNum).toFixed(2) * 100, name: 'D' }
      ];


      //设置图形数据的最小值
      let minVal = 10;
      let showData = nData.map(si => {
        return {
          value: minVal + si.value / 10,
          name: si.name
        }
      });
      //判断图列组件中的显示样式
      let judge = [
        { name: "A", text: 'A等 得分率>=80%' },
        { name: "B", text: 'B等 得分率>=60%<80%' },
        { name: "C", text: 'C等 得分率>=40%<60%' },
        { name: "D", text: 'D等 得分率<40%' }];

      // 绘制图表
      let option = {
        //设置整体参考颜色
        color: ['#3C87FA', '#6FDEFA', '#7F65F9', '#E95990'],
        tooltip: {
          trigger: 'item',
          //设置点击图片提示信息的显示数据
          formatter: function (obj) {
            return `${obj.seriesName}</br>${obj.name}\n${((obj.value - minVal) * 10).toFixed(1)}%`
          }
        },
        series: [
          {
            name: '总分得分率',
            type: 'pie',
            radius: [50, 100],
            center: ['30%', '50%'],
            roseType: 'radius',
            label: {
              position: 'inside',
              //设置图上默认显示数据
              formatter: (obj) => {
                return `${obj.name}\n${((obj.value - minVal) * 10).toFixed(1)}%`
              }
            },
            data: showData
          }
        ],
        //参考色所代表的含义的相关设置
        legend: {
          orient: 'vertical',
          top: '30%',
          left: '57%',
          itemGap: 30,
          //字体设置
          textStyle: {
            color: '#646464',
            fontSize: 12,
            fontWeight: 600
          },
          formatter: function (name) {
            let newText = '';
            //根据判断设置图右侧的参考色所代表的含义
            judge.map(re => {
              if (re.name === name) {
                newText = re.text;
              }
            });
            return newText
          },
          //设置提示颜色图标为圆形
          icon: 'circle',
          //绑定数据
          data: ['A', 'B', 'C', 'D'],
          selectedMode: false
        },
      };
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
      let offsetWidth2 = document.getElementById("ClassReportmyChartmain1Box") && document.getElementById("ClassReportmyChartmain1Box").offsetWidth;
      this.setState({
        offsetWidth: offsetWidth2,
        myChart: myChart
      }, () => { myChart.resize(); })
      myChart.setOption(option);
      window.addEventListener('resize', () => {
        let offsetWidth1 = document.getElementById("ClassReportmyChartmain1Box") && document.getElementById("ClassReportmyChartmain1Box").offsetWidth;
        if (offsetWidth > 355) {
          this.setState({
            offsetWidth: offsetWidth1
          })
        }
        myChart.resize();
      })
    }
  }
  render() {
    const { offsetWidth, myChart, img } = this.state;
    return (
      <div className={styles['RoseDiagram']} id="ClassReportmyChartmain1Box">
        <img src={img} alt='玫瑰图' className='ClassReportimg' />
        <div id="ClassReportmyChartmain1-1" style={{ width: 500, height: 400, display: 'none' }}></div>
        <div id="ClassReportmyChartmain1" style={{ width: offsetWidth, height: 400 }}></div>
      </div>
    )
  }
}
