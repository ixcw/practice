/**
 *@Author:ChaiLong
 *@Description: 金字塔
 *@Date:Created in  2020/9/29
 *@Modified By:
 */

import React from 'react'
import eCharts from "echarts";
import 'echarts/lib/chart/funnel';


export default class Pyramid extends React.Component {

  componentDidMount() {
    this.renderPyramidCharts()
  }

  renderPyramidCharts = () => {
    const colorObj = [
      '#37a2da',
      '#67e0e3',
      '#ffdb5c',
      '#ff9f7f'];
    const lineTextSize=17;
    let option = {
      color: colorObj,
      series: [
        {
          name: '等级划分',
          type: 'funnel',
          width: '60%',
          height: '82%',
          x: -40,
          y: 15,
          min: 0,
          max: 100,
          minSize: '0%',
          maxSize: '100%',
          sort: 'ascending',
          label: {
            position: 'inside',
            fontSize: 18,
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 12
          },
          data: [
            {
              value: 25, name: '优分',
              label: {
                height:99,
                formatter: ['{a|{b}}'].join('\n'),
                rich: {a: {fontSize: 18,lineHeight: 130, color: "white"}}
              }
            },
            {value: 45, name: '及格'},
            {value: 65, name: '不及格'},
            {value: 85, name: '低分'},
          ],
          markLine: {
            symbol: "none",
            lineStyle: {type: 'solid'},
            silent: true,
            data: [
              [
                {
                  name: '优分等级对应得分率820%以上',
                  x: '30%',
                  y: "15%"
                },
                {
                  x: "45%",
                  y: "15%",
                  lineStyle: {color: colorObj[0]},
                  label:{
                    fontSize:lineTextSize
                  }
                }
              ],
              [
                {
                  name: '及格等级对应得分率80%-60%之间',
                  color: colorObj[1],
                  x: '35%',
                  y: "32%"
                },
                {
                  x: "50%",
                  y: "32%",
                  lineStyle: {color: colorObj[1]},
                  label:{
                    fontSize:lineTextSize
                  }
                }
              ],
              [
                {
                  name: '不及格等级对应得分率60%-40%之间',
                  color: colorObj[1],
                  x: '42%',
                  y: "53%"
                },
                {
                  x: "57%",
                  y: "53%",
                  lineStyle: {color: colorObj[2]},
                  label:{
                    fontSize:lineTextSize
                  }
                }
              ],
              [
                {
                  name: '低分等级对应得分率40%以下',
                  color: colorObj[1],
                  x: '47%',
                  y: "74%"
                },
                {
                  x: "62%",
                  y: "74%",
                  lineStyle: {color: colorObj[3]},
                  label:{
                    fontSize:lineTextSize
                  }
                }
              ]
            ]
          }
        }
      ],
    };
    let myChart = eCharts.init(document.getElementById('pyramid'));
    myChart.setOption(option)
  }


  render() {
    return (
      <div style={{width: 600, height: 300}} id="pyramid">
      </div>
    )
  }
}
