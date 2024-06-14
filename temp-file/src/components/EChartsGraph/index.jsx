import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import PropTypes from 'prop-types'
const EChartsGraph = ({ data }) => {
	const chartRef = useRef(null)

	useEffect(() => {
		const chart = echarts.init(chartRef.current)
		const option = data.option
		chart.on('click', params => {
			if (params.componentType === 'series') {
				console.log('点击了柱状图', params.dataIndex)
				// 在这里处理您的点击事件逻辑
			}
		})

		chart.setOption(option)

		return () => {
			chart.dispose()
		}
	}, [])

	return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
}

EChartsGraph.propTypes = {
	data: PropTypes.object
}

export default EChartsGraph
