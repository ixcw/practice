/*
Author:ShiHaiGui
Description:资助管理可视化图表
Date:2023/8/14
Modified By:
*/
import React, { useState,useEffect } from 'react';
import { Row, Col, Card } from 'antd'
import { connect } from 'dva'
import moment from 'moment'
import { Subsidizelist as namespace } from "@/utils/namespace";
//引入echarts
import * as echarts from 'echarts'
import styles from './index.less'
const fundingManagement = (props) => {
	const {dispatch,} = props;

	const [StatisticalData, setStatistical] = useState([]);

	useEffect(() => {
		dispatch({
			type: namespace + "/statisticsSupportMesApi",
      payload: {},
      callback: (res) => {
				if (res?.result.code===200) {
					console.log(res);
          setStatistical(res?.result?.data);
        }
      },
    });

  }, []);

//修改
console.log(StatisticalData?.statisticsSupportType?.length > 0 ? StatisticalData.statisticsSupportType?.map(item=>item.nationalScholarshipNum) : []);
console.log(typeof StatisticalData?.statisticsPoorType === 'object' ?Object.values(StatisticalData?.statisticsPoorType) : []);
console.log(typeof StatisticalData?.statisticsSupportType === 'object' ?Object.values(StatisticalData?.statisticsSupportType) : []);
console.log(StatisticalData?.statisticsSupportType?.length > 0 ? StatisticalData.statisticsSupportType?.map(item=>item.nationalGrantsNum) : []);


	useEffect(() => {
		//各年级受资助学生对比
		const chartDom = document.getElementById('main')
		const myChart = echarts.init(chartDom)
		//资助学生男女对比
		const chartDomone = document.getElementById('mainone')
		const myChartone = echarts.init(chartDomone)
		//贫困类型人数统计
		const chartDomTo = document.getElementById('mainTo')
		const myChartTo = echarts.init(chartDomTo)
		// 资助类型及金额统计
		const chartDomThree = document.getElementById('mainThree')
		const myChartThree = echarts.init(chartDomThree)

		// 各年级受助资助学生对比数据

		const option = {
			xAxis: {data: StatisticalData?.statisticsGradeMesList?.length > 0 ? StatisticalData.statisticsGradeMesList?.map(item=>item.gradeName) : []},
			yAxis: {
				type: 'value'
			},
			series: [
				{
					name: '',
					type: 'bar',
					showBackground: true,
					backgroundStyle: {
						color: 'rgba(180, 180, 180, 0.2)'
					},
					barWidth: '30',
					data: StatisticalData?.statisticsGradeMesList?.length > 0 ? StatisticalData.statisticsGradeMesList?.map(item=>item.supportPeopleNum) : [],
					itemStyle: {
						color: '#386CEF'
					},
					label: {
						show: true,
						position: 'top',
						formatter: '{c} 人'
					}
				}
			]
		}

		myChart.setOption(option)

		// 资助学生男女比例数据
		const optionone = {
			tooltip: {
				trigger: 'item'
			},
			legend: {
				left: 'center', // 图例水平居中
				bottom: 5, // 图例距离底部的间距
				formatter: function (name) {
					return name + '             ' // 使用 kong空格 和实现注解之间的间距
				}
			},
			series: [
				{
					name: '男女生比例',
					type: 'pie',
					radius: '50%',
					data: [
						// { value: StatisticalData?.statisticsMenAndWomen?.menNum, name: '男生',itemStyle: { color: '#386CEF' } },
						{
							value: StatisticalData?.statisticsMenAndWomen?.menNum,
							name: '男生',
							itemStyle: { color: '#386CEF' },
							label: {
								position: 'outside', // 标签位置
								offset: [0, -15],  // 偏移量，向下偏移 10px
								formatter: '{b}: {d}%' // 标签内容格式
							}
						},
						{
							value: StatisticalData?.statisticsMenAndWomen?.womenNum,
							name: '女生',
							itemStyle: { color: '#AF7BE4' },
							label: {
								position: 'outside', // 标签位置
								offset: [0, 15],  // 偏移量，向下偏移 10px
								formatter: '{b}: {d}%' // 标签内容格式
							}
						},
					],


					label: {
						formatter: function (params) {
							const name = params.name
							const percent = params.percent + '%'
							return '{name|' + name + '}\n{percent|' + percent + '}'
						},
						rich: {
							name: {
								lineHeight: 40
							},
							percent: {
								lineHeight: 40
							}
						}
					},
					emphasis: {
						itemStyle: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
				}
			]
		}
		myChartone.setOption(optionone)



		// 贫困类型人数统计
		const optionTo = {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				}
			},
			legend: {
				right: '-5'
			},
			// 拉动显示数据条
			// dataZoom: [
			//   {
			//     show: true,
			//     type: 'slider',
			//     handleSize: 32, // 两边的按钮大小
			//     startValue: 0,  // 重点在这   -- 开始的值
			//     endValue: StatisticalData.length - 1   // 重点在这   -- 结束的值
			//   },
			//   {
			//     zoomLock: true, // 这个开启之后只能通过鼠标左右拉动，不能滚动显示
			//     type: 'inside'
			//   }
			// ],
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: {
				type: 'value'
			},
			yAxis: {
				type: 'category',
				data: typeof StatisticalData?.statisticsPoorType === 'object' ?
				Object.keys(StatisticalData?.statisticsPoorType).map(key => {
					switch (key) {
						case 'deformityStudentNum':
							return '孤残学生'
						case 'especiallyDiffNum':
							return '特困职工家庭子女'
						case 'heroNum':
							return '革命烈士或因公牺牲军人、警察子女'
						case 'lowIncomeFamilyNum':
							return '农村低收入纯农户家庭子女'
						case 'minimumGuaranteeNum':
							return '城镇和农村最低保障家庭子女'
						case 'minorityGroupDiffNum':
							return '少数民族家庭经济困难学生'
						case 'suddennessAccidentNum':
							return '家庭遭遇突发性、不可抗力变故，造成人身或财产的重大损失的困难学生'
						default:
							return ''
					}
				}).filter(name => name !== ''): []
			},
			series: [
				{
					// name: '男生',
					type: 'bar',
					stack: 'total',
					data: typeof StatisticalData?.statisticsPoorType === 'object' ?Object.values(StatisticalData?.statisticsPoorType) : [],
					emphasis: {
						focus: 'series'
					},
					itemStyle: { color: '#386CEF' }
				},

			]
		}

		myChartTo.setOption(optionTo)


		// 贫困类型及金额统计
		const optionThree = {
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				 data: StatisticalData?.statisticsSupportType?.length > 0 ? StatisticalData.statisticsSupportType?.map(item=>item.supportYear+'') : [],
				formatter: function (value) {
					return value + '年'
				}
			},

			// 拉动显示数据条
			// dataZoom: [
			//   {
			//     show: true,
			//     type: 'slider',
			//     handleSize: 32, // 两边的按钮大小
			//     startValue: 0,  // 重点在这   -- 开始的值
			//     // endValue: Educationdata.length - 1   // 重点在这   -- 结束的值
			//   },
			//   {
			//     // zoomLock: true, // 这个开启之后只能通过鼠标左右拉动，不能滚动显示
			//     type: 'inside'
			//   }
			// ],
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: ['国家助学金', '国家奖学金', '学费补偿', '贷款补偿', '校内助学奖金', '勤工俭学', '困难补贴', '伙食补贴', '学费减免', '绿色通道']
			},
			yAxis: {
				type: 'value'
			},
			series: StatisticalData?.statisticsSupportType?.length > 0 ? StatisticalData.statisticsSupportType?.map(item=>{
				return {
					name: item.supportYear,
					type: 'line',
					stack: 'Total',
					data:[
							item.nationalGrantsNum,
							item.nationalScholarshipNum,
							item.tuitionCompensationNum,
							item.loanCompensationNum,
							item.ocasNum,
							item.workStudyProgramNum,
							item.difficultSubsidiesNum,
							item.mealAllowanceNum,
							item.tuitionWaiverNum,
							item.greenChannelNum
					]
				}
			}) : [],
		}
		myChartThree.setOption(optionThree)
	})

	return (
		<>
			<div className={styles["centertop"]}>
				<Row gutter={[24, 0]}>
					<Col span={9}>
						<Card
							// title="各年级受资助学生对比"
							bordered={false}
							headStyle={{ color: '#2F78FF', fontSize: '15px' }}
						>
							<Row>
								<Col span={10} className={styles['cardtitle']}>
									<h1 style={{ fontWeight: '700', fontSize: '15px', color: '#2F78FF', marginLeft: '10px' }}>各年级受资助学生对比</h1>
								</Col>
							</Row>
							<Col>
								<div id='main' style={{ height: '350px', width: '100%' }}></div>
							</Col>
						</Card>
					</Col>

					<Col span={15}>
						<Card bordered={false} headStyle={{ color: '#2F78FF', fontSize: '15px' }}>
							<Row>
								<Col span={6} className={styles['cardtitle']}>
									<h1 style={{ fontWeight: '700', fontSize: '15px', color: '#2F78FF', marginLeft: '10px' }}>资助学生男女比例</h1>
								</Col>
								<Col span={6} offset={5} className={styles['cardtitle']}>
									<h1 style={{ fontWeight: '700', fontSize: '15px', color: '#2F78FF', marginLeft: '10px' }}>贫困类型人数统计</h1>
								</Col>
							</Row>
							<Row>
								<Col span={8}>
									<div id='mainone' style={{ height: '350px', width: '100%' }}></div>
								</Col>
								<Col span={14}>
									<div id='mainTo' style={{ height: '350px', width: '100%' }}></div>
								</Col>
							</Row>
						</Card>
					</Col>
				</Row>
				<Row style={{ marginTop: '24px' }} gutter={[24, 0]}>
					<Col span={24}>
						<Card bordered={false} headStyle={{ color: '#2F78FF', fontSize: '15px' }}>
							<Row>
								<Col className={styles['cardtitle']}>
									<h1 style={{ fontWeight: '700', fontSize: '15px', color: '#2F78FF', marginLeft: '10px' }}>资助类型及金额统计</h1>
								</Col>
							</Row>
							<Row>
								<Col span={20}>
									<div id='mainThree' style={{ height: '350px', width: '100%' }}></div>
								</Col>
							</Row>
						</Card>
					</Col>
				</Row>
			</div>
		</>
	)
}
const mapStateToProps = (state) => {
  return {

  };
};

export default connect(mapStateToProps)(fundingManagement);
