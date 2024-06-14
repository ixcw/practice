/**
 *@Author:ChaiLong
 *@Description:题型得分情况分析
 *@Date:Created in  2020/10/14
 *@Modified By:
 */
import React from 'react'
import styles from './testScoresAnalyse.less'
import PropTypes from 'prop-types'
import {Progress} from "antd";
import eCharts from "echarts";
import {existObj} from "@/utils/utils";

export default class TestScoresAnalyse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colorArr: ['#7352cf', '#5aab09',
        '#e54e6c', '#f9d44b', '#e57673',
        '#7ab2e0', '#f9e44b', '#cb3d88',
        '#c2ec47', '#ff7300', '#f74a4f',
        '#e6f54a', '#2e9991', '#93ca76',
        '#fde8d0', '#028760', '#59b9c6'],
      myChart: null,
    }
    this.testScoresAnalyseCharts = React.createRef()
  }

  componentDidMount() {
    const {questionTypeScore} = this.props;
    this.renderTreeCompare(questionTypeScore)
  }

  componentWillUnmount() {
    const {myChart} = this.state;
    myChart && myChart.off()
  }

  static propTypes = {
    questionTypeScore: PropTypes.array,//题型得分情况
    location: PropTypes.object
  }
  /**
   * 柱形图配置渲染
   * @param questionTypeScore
   */
  renderTreeCompare = (questionTypeScore) => {
    const {colorArr} = this.state;
    const testScoresAnalyseCharts = document.getElementById('testScoresAnalyseCharts') ? document.getElementById('testScoresAnalyseCharts') : undefined;
    if (testScoresAnalyseCharts) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = eCharts.init(testScoresAnalyseCharts);
      let xData = questionTypeScore.map(re => re.category);
      let yData = questionTypeScore.map((re, index) => ({
        name: re.category,
        itemStyle: {color: colorArr[index]},
        value: re.scoringRate||0
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
            axisLabel: {
              textStyle: {
                fontSize: 16
              },
              interval: 0,
              formatter: xData.length >= 7 ? function (value) {
                return value.split("").join("\n");
              } : undefined
            },
            type: 'category',
            data: xData,
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
      this.setState({myChart})
      if (existObj(myChart) && !this.state.myChartImg) {
        myChart.on('finished', () => {
          let img = myChart.getDataURL();
          this.setState({myChartImg: img})
        })
      }
      myChart.setOption(option);
    }
  }

  // 获取Echart图宽高
  getEchartWidth = () => {
    if (this.testScoresAnalyseCharts && this.testScoresAnalyseCharts.current && this.testScoresAnalyseCharts.current.style) {
      this.testScoresAnalyseCharts.current.style.width = this.testScoresAnalyseCharts.current.offsetWidth
      this.testScoresAnalyseCharts.current.style.height = this.testScoresAnalyseCharts.current.offsetHeight
      this.resized()
    }
  }

  resized = () => {
    const {myChart} = this.state
    myChart.resize()
  }

  render() {
    const {questionTypeScore = [], location: {pathname}} = this.props;
    const {colorArr, myChartImg = ''} = this.state;
    //自适应窗口改变重新渲染图形
    window.onresize = () => {
      if (pathname === '/studentPersonReport') {
        this.getEchartWidth()
      }
    }
    return (
      <div className={styles['testScoresAnalyse']}>
        {questionTypeScore.length < 4 ?
          <div className={styles['progressBox']}>
            {
              questionTypeScore.map((re, index) => <Progress
                key={index}
                strokeColor={colorArr[index]}
                className='gradeProgress'
                strokeWidth={8}
                width={200}
                type="circle"
                percent={re.scoringRate||0}
                format={percent => (
                  <div className='gradeBox'>
                    <div>{re.category}</div>
                    <div>
                      <span>{re.scoringRate||0}%</span>
                    </div>
                  </div>
                )}/>)
            }
          </div>
          :
          <div className={styles['testScoresAnalyseCharts']}>
            <img alt={''} className={`${styles['testPaperAnalyseImg']} testPaperAnalyseImg`} src={myChartImg}/>
            <div ref={this.testScoresAnalyseCharts} style={{height: 310}} id={'testScoresAnalyseCharts'}/>
          </div>
        }
      </div>
    )
  }
}
