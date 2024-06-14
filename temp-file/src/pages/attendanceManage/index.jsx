/**
 * 考勤管理
 * @author 韦靠谱
 * @date 2023/9/27
 * @since 1.0.0
 * @Modified
 */
import React, { useState } from 'react'
import AttendanceAdd from './components/attendanceAdd/attendanceAdd'
import AttendanceSwitch from './components/attendanceSwitch/attendanceSwitch'
import AttendancePerson from './components/attendancePerson'
import Page from '@/components/Pages/page'
import styles from './index.less'
const title = '考勤管理'
const breadcrumb = [title]
const header = <Page.Header breadcrumb={breadcrumb} title={title} />

const AttendanceManage = () => {
	const [showComponent, setShowComponent] = useState({
		add: false,
		switch: true
	})

	return (
		<Page header={header}>
			<div id={styles['attendanceManage']}>
				{showComponent.add ? (
					//新增考勤
					<AttendanceAdd showComponent={showComponent} setShowComponent={setShowComponent} />
				) : showComponent.switch ? (
					//按人次查询
					<AttendancePerson showComponent={showComponent} setShowComponent={setShowComponent} />
				) : (
					// 按节次查询
					<AttendanceSwitch showComponent={showComponent} setShowComponent={setShowComponent} />
				)}
			</div>
		</Page>
	)
}

export default AttendanceManage
