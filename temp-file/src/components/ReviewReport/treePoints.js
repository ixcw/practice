/**
 *@Author:ChaiLong
 *@Description:三分比较
 *@Date:Created in  2020/02/03
 *@Modified By:
 */
import React from 'react'
import eCharts from 'echarts';
import 'echarts/lib/chart/pie';
import {connect} from 'dva';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import {TopicManage as namespace} from "@/utils/namespace";

@connect(state => ({findClassReportTreeScore: state[namespace].findClassReportTreeScore}))
export default class TreePoints extends React.Component {



  componentDidMount() {
    const {findStudentTreeScoreCompare={}}=this.props;
    if (findStudentTreeScoreCompare&&Object.keys(findStudentTreeScoreCompare).length !== 0) {
      const  {xData, yData} = findStudentTreeScoreCompare;
      // 基于准备好的dom，初始化echarts实例
      let myChart = eCharts.init(document.getElementById('mainS'));
      let chartsData = [
        {name: '我', itemStyle: {color: '#4f81bd'}},
        {name: '班级最高分', itemStyle: {color: '#c0504d'}},
        {name: '班级最低分', itemStyle: {color: '#9bbb59'}},
        {name: '班级平均分', itemStyle: {color: '#8064a2'}}];
      Object.keys(findStudentTreeScoreCompare).length !== 0 && chartsData.map((re, index) => re.value = (findStudentTreeScoreCompare.yData[index]));
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        title: {
          left: 'center',
          text: '全班三分比较',
          textStyle: {
            fontSize: 30,
            color: '#7f7f7f'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
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
            name: '三分比较',
            type: 'bar',
            barWidth: '60%',
            data: chartsData
          }
        ]
      };
      myChart.setOption(option);
    }

  }




  render() {
    return (
          <div id="mainS" style={{width: 750, height: 360}}/>
    )
  }
}
