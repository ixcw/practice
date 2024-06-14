/**
 *@Author:ChaiLong
 *@Description:知识结构图
 *@Date:Created in  2021/3/8
 *@Modified By:
 */
import React from 'react';
import eCharts from "echarts";
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import PropTypes from 'prop-types'
import {existArr, existObj} from "@/utils/utils";

export default class KnowledgeStructure extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.echartRef = React.createRef()
  }

  static propTypes = {
    knowList: PropTypes.array,//题目分析
  };


  componentDidMount() {
    const {findStudentTreeScoreCompare = {}} = this.props;
    this.renderTreeCompare(findStudentTreeScoreCompare)
  }


  // 获取Echart图宽高
  getEchartWidth = () => {
    if (this.echartRef && this.echartRef.current && this.echartRef.current.style) {
      this.echartRef.current.style.width = this.echartRef.current.offsetWidth
      this.echartRef.current.style.height = this.echartRef.current.offsetHeight
      this.resized()
    }
  }


  resized = () => {
    const {myChart} = this.state
    myChart.resize()
  }


  renderTreeCompare = (findStudentTreeScoreCompare) => {
    const {knowList = []} = this.props;
    // 基于准备好的dom，初始化echarts实例
    let myChart = eCharts.init(document.getElementById('knowledgeStructure'));
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: '{b}：{c}%'
      },
      grid: {
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        name: '知识点',
        axisLabel: {
          formatter: (value) => {
            const str = value ? value.substr(0, 10) : '';
            return str.length > 10 ? str + '...' : str
          },
          interval: 0,
          rotate: 30
        },
        data: existArr(knowList) ? knowList.map(re => re.knowName) : [],
        nameTextStyle: {
          color: "rgb(196,196,196)",
          fontSize: 16
        }
      },
      yAxis: {
        type: 'value',
        name: '错误率',
        axisLabel: {
          formatter: '{value}%'
        },
        splitLine: {
          show: false
        },
        nameTextStyle: {
          color: "rgb(196,196,196)",
          fontSize: 16
        }
      },
      dataZoom: [{
        id: 'dataZoomX',
        type: 'inside',
        startValue: 0,
        endValue: 15
      }, {
        startValue: 0,
        endValue: 30
      }],
      series: [{
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%'
        },
        data: existArr(knowList) ? knowList.map(re => re.percNum) : [],
        itemStyle: {
          color: new eCharts.graphic.LinearGradient(
            0, 0, 0, 1,
            [
              {offset: 0, color: '#b3dbff'},
              {offset: 0.5, color: '#48a6f6'},
              {offset: 1, color: '#188df0'}
            ]
          ),
        },
        type: 'bar',
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        }
      }]
    };
    this.setState({myChart})
    myChart.setOption(option);
  }


  render() {
    const {location} = this.props;
    const {pathname = ''} = location;
    //自适应窗口改变重新渲染图形
    window.onresize = () => {
      if (pathname === '/mistakeTopicReport') {
        this.getEchartWidth()
      }
    }
    return (
      <div ref={this.echartRef} style={{height: 380}} id='knowledgeStructure'/>
    )
  }
}
