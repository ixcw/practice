/**
 *@Author:ChaiLong
 *@Description: 卷面分析
 *@Date:Created in  2020/9/30
 *@Modified By:
 */
import React from 'react'
import styles from './testPaperAnalyse.less'
import eCharts from "echarts";
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import {existArr, existObj} from "@/utils/utils";
import PropTypes from "prop-types";
import ExpertsConcluded from "./expertsConcluded";


export default class TestPaperAnalyse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
      myChartImg: ''
    }
    this.echartRef = React.createRef()
  }

  static propTypes = {
    paperAnalysisDetails: PropTypes.array,//卷面分析
    location: PropTypes.object
  };

  componentDidMount() {
    const {paperAnalysisDetails = []} = this.props;
    this.renderPaperAnalyseChart(paperAnalysisDetails)
  }

  componentWillUnmount() {
    const {myChart} = this.state;
    //移除此函数，原因是可能在卸载当前组件时setState还可以调用
    myChart.off()
  }


  renderPaperAnalyseChart = (dataArr) => {
    const myChart = eCharts.init(document.getElementById('testPaperAnalyseChart'));
    let dataNameArr = [];//对比的对象
    let myScore = [];//我的每题得分
    let schoolScore = [];//学校平均得分
    let classScore = [];//全班平均得分
    let codeDifficulty = [];//题目和难度
    if (existArr(dataArr)) {
      dataArr.map((re, i) => {
        if (i === 0) {
          re.schoolScoreRate !== null && dataNameArr.push("全校")
          re.classScoreRate !== null && dataNameArr.push("全班")
          re.scoreRate !== null && dataNameArr.push("我")
        }
        //插入各对象的得分率
        dataNameArr.includes('我') && myScore.push(re.scoreRate)
        dataNameArr.includes('全校') && schoolScore.push(re.schoolScoreRate)
        dataNameArr.includes('全班') && classScore.push(re.classScoreRate)
        codeDifficulty.push(`${re.difficulty}\n${re.code}`)
      })
    }
    const opt = {
      tooltip: {
        trigger: 'axis',
        formatter: (a) => {
          let list = []
          let listItem = ''
          a.map(re => {
            list.push(`<i style="display: inline-block;width: 10px;height: 10px;background:
                       ${re.color};margin-right: 5px;border-radius: 50%;}"></i>&nbsp&nbsp${re.value}%`)
          })
          listItem = list.join('<br>')
          return `<div class="showBox">
                  题号：${a[0].axisValue.split('\n')[1]}<br>
                  难度：${a[0].axisValue.split('\n')[0]}<br>
                  ${listItem}
                  </div>`
        }
      },
      legend: {
        data: dataNameArr,
        right: 100,
        animation: false
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '17%'
      },
      toolbox: {
        show: true,
      },
      //设置显示不完，可拖动
      dataZoom: [
        {
          type: 'slider',
          show: codeDifficulty.length>15,
          xAxisIndex: [0],
          start: 0,                               //数据窗口范围的起始百分比,表示30%
          end: codeDifficulty.length>15?(1-(codeDifficulty.length-15)/codeDifficulty.length)*100:100,
        },
        //设置x轴方向上，鼠标支持滚轮
        {
          type: 'inside',
          xAxisIndex: [0],
        },
      ],
      xAxis: {
        name: '(难度\n/题目)',
        nameTextStyle: {
          fontSize: 15,
          color: '#c1c1c1'
        },
        type: 'category',
        boundaryGap: false,
        data: codeDifficulty,
      },
      yAxis: {
        name: '(得分率)',
        nameTextStyle: {
          fontSize: 15,
          color: '#c1c1c1'
        },
        type: 'value',
        min: 0,
        max: 100,
        axisLabel: {
          formatter: `{value}%`
        }
      },
      color: ['#FF7978', '#7ab2e0', '#2BBB70'],
      series: [
        {
          name: '全校',
          type: 'line',
          smooth: false,//是否平滑
          color: '#6fbc49',
          areaStyle: {
            color: new eCharts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: '#7dbf60'
            }, {
              offset: 1,
              color: 'white'
            }])
          },
          data: schoolScore
        },
        {
          name: '全班',
          type: 'line',
          smooth: false,//是否平滑
          color: '#7ab2e0',
          areaStyle: {
            color: new eCharts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: '#a4bff6'
            }, {
              offset: 1,
              color: 'white'
            }])
          },
          data: classScore
        },
        {
          color: '#e57673',
          name: '我',
          type: 'line',
          smooth: false,//是否平滑
          data: myScore,
          areaStyle: {
            color: new eCharts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: '#de8a9a'
            }, {
              offset: 1,
              color: 'white'
            }])
          }
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
    myChart.setOption(opt);
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

  render() {
    const {myChartImg = ''} = this.state
    const {location: {pathname}} = this.props;
    const TestPaperSum = {
      title: '专家总结',
      textArr: [{
        subTitle: '学科韧性分析',
        depict: '专家总结：学科韧性分析学科韧性好的学生在遇见困难时可以综合调动知识、能力给出优秀的回答。具体表现为：随着题目难度的增加，学生仍然能保持较高的正确率。学科韧性分析图的横轴表示题目难度，从左到右，由低到高排列；纵轴表示题目得分率，并将个人与全班比较，各点连线形成的折现体现了学科韧性，帮助老师制定教学方案'
      }]
    }
    //自适应窗口改变重新渲染图形
    window.onresize = () => {
      if (pathname === '/studentPersonReport') {
        this.getEchartWidth()
      }
    }
    return (
      <div className={styles['testPaperAnalyse']}>
        <div ref={this.echartRef} style={{height: 450}} id='testPaperAnalyseChart'/>
        <img alt={''} className={`${styles['testPaperAnalyseImg']} testPaperAnalyseImg`} src={myChartImg}/>
        <ExpertsConcluded isVisible={false} textData={TestPaperSum} style={{margin: '15px 55px'}}/>
      </div>
    )
  }
}
