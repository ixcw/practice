/**
 *@Author:ChaiLong
 *@Description: 学生个人报告三分比较
 *@Date:Created in  2020/9/29
 *@Modified By:
 */
import React from 'react'
import styles from './treeCompare.less'
import eCharts from "echarts";
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import PropTypes from "prop-types";
import {existArr, existObj} from "@/utils/utils";


export default class TreeCompare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  static propTypes = {
    findStudentTreeScoreCompare: PropTypes.object,//三分比较数据
  };

  componentDidMount() {
    const {findStudentTreeScoreCompare} = this.props;
    this.renderTreeCompare(findStudentTreeScoreCompare)
  }

  /**
   * 柱形图配置渲染
   * @param findStudentTreeScoreCompare
   */
  renderTreeCompare = (findStudentTreeScoreCompare) => {
    // 基于准备好的dom，初始化echarts实例
    let myChart = eCharts.init(document.getElementById('treeCompareCharts'));
    let chartsData = [
      {name: '我', itemStyle: {color: '#3e89fc'}},
      {name: '班级最高分', itemStyle: {color: '#e44a6e'}},
      {name: '班级最低分', itemStyle: {color: '#ac66fd'}},
      {name: '班级平均分', itemStyle: {color: '#6dbc49'}}];
    existObj(findStudentTreeScoreCompare) && chartsData.map((re, index) => re.value = (findStudentTreeScoreCompare.yData[index]));
    let option = {
      tooltip: {
        trigger: 'axis',
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
        top: '8%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          axisLabel: {
            textStyle: {
              fontSize: 16
            }
          },
          data: findStudentTreeScoreCompare && findStudentTreeScoreCompare.xData,
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      legend: {
        data: ['我', '班级最高分', '班级最低分', '班级平均分']
      },
      series: [
        {
          label: {
            show: true,
            position: 'top'
          },
          type: 'bar',
          barWidth: '60%',
          data: chartsData
        }
      ]
    };
    this.setState({myChart})
    myChart.setOption(option);
  }

  render() {
    const {findStudentTreeScoreCompare: scoreArr = {}} = this.props;
    const _xData = scoreArr.xData;
    //通过分数的差值计算并返回该显示的文本
    const differenceScore = () => {
      let arr = [];//我和班级各分数差，班级最高分，班级最低分，班级平均分
      let difPrint = [..._xData];
      /**
       * 通过差值返回span标签并且文字显示不同颜色
       * @param p 差值
       * @param text 文案
       * @returns {JSX.Element|string} span标签
       */
      const difText = (p, text) => {
        if (p == 0) {
          return <span>与{text}<span style={{color: '#1e7af3'}}>相等</span></span>
        }
        if (p > 0) {
          return <span>比{text}<span style={{color: '#f40808'}}>低</span>：{Math.round(Math.abs(p) * 100) / 100}分</span>
        }
        if (p < 0) {
          return <span>比{text}<span style={{color: '#49f31c'}}>高</span>：{Math.round(Math.abs(p) * 100) / 100}分</span>
        }
        return ''
      }
      existObj(scoreArr) && existArr(scoreArr.yData) && scoreArr.yData.map((re, i, record) => {
        if (i > 0) {
          arr[i] = difText(re - record[0], difPrint[i])
        } else {
          arr[i] = `${difPrint[i]}：${re}分`
        }
      })
      return arr
    };
    const difScoreArr = differenceScore();
    return (
      <div className={styles['treeCompare']}>
        <div style={{width: 730, height: 310}} id='treeCompareCharts'/>
        <div className={styles['scoreGap']}>
          <div className={styles['scoreBox']}>
            {difScoreArr.map((re, i) => <div key={i} className={styles['scoreGapList']}><span
              className={styles['disc']}/>{re}</div>)}
          </div>
        </div>
      </div>
    )
  }
}
