/**
 * 教师导入导出
 * @author 韦靠谱
 * @date 2023/10/10
 * @since 1.0.0
 * @Modified
 */
import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { Button, Space, Modal, Dropdown, Menu, message, Upload } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { excelType } from '@/utils/const'
import accessTokenCache from '@/caches/accessToken'

const { confirm } = Modal

const ImportAndExport = props => {
	const token = accessTokenCache() && accessTokenCache()
	const { location, getTeacherList, AllScreening, NewColumns, setLoading, StatTeacherStatisticsApi } = props
	const [ButtonLoading, setButtonLoading] = useState({ perfect: false, Download: false, DownloadExport: false })

	// 自定义ajax请求 修改接收格式responseType='blob'
	const customRequest = option => {
		const getError = (option, xhr) => {
			var msg = 'cannot '.concat(option.method, ' ').concat(option.action, ' ').concat(xhr.status, "'")
			var err = new Error(msg)
			err.status = xhr.status
			err.method = option.method
			err.url = option.action
			return err
		}

		const getBody = xhr => {
			if (xhr.responseType && xhr.responseType !== 'text') {
				return xhr.response
			}
			var text = xhr.responseText || xhr.response

			if (!text) {
				return text
			}

			try {
				return JSON.parse(text)
			} catch (e) {
				return text
			}
		}

		// eslint-disable-next-line no-undef
		var xhr = new XMLHttpRequest()
		xhr.responseType = 'blob'

		if (option.onProgress && xhr.upload) {
			xhr.upload.onprogress = function progress(e) {
				if (e.total > 0) {
					e.percent = (e.loaded / e.total) * 100
				}

				option.onProgress(e)
			}
		} // eslint-disable-next-line no-undef

		var formData = new FormData()

		if (option.data) {
			Object.keys(option.data).forEach(function (key) {
				var value = option.data[key] // support key-value array data

				if (Array.isArray(value)) {
					value.forEach(function (item) {
						// { list: [ 11, 22 ] }
						// formData.append('list[]', 11);
						formData.append(''.concat(key, '[]'), item)
					})
					return
				}

				formData.append(key, option.data[key])
			})
		} // eslint-disable-next-line no-undef

		if (option.file instanceof Blob) {
			formData.append(option.filename, option.file, option.file.name)
		} else {
			formData.append(option.filename, option.file)
		}

		xhr.onerror = function error(e) {
			option.onError(e)
		}

		xhr.onload = function onload() {
			// allow success when 2xx status
			// see https://github.com/react-component/upload/issues/34
			if (xhr.status < 200 || xhr.status >= 300) {
				return option.onError(getError(option, xhr), getBody(xhr))
			}

			return option.onSuccess(getBody(xhr), xhr)
		}

		xhr.open(option.method, option.action, true) // Has to be after `.open()`. See https://github.com/enyo/dropzone/issues/179

		if (option.withCredentials && 'withCredentials' in xhr) {
			xhr.withCredentials = true
		}

		var headers = option.headers || {}

		// 添加默认请求头 Authorization
		if (option.authorization) {
			headers.Authorization = token
		}

		if (headers['X-Requested-With'] !== null) {
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
		}

		Object.keys(headers).forEach(function (h) {
			if (headers[h] !== null) {
				xhr.setRequestHeader(h, headers[h])
			}
		})
		xhr.send(formData)
		return {
			abort: function abort() {
				xhr.abort()
			}
		}
	}
	// 批量导入前的文件效验
	const beforeUpload = file => {
		let vaild
		const acceptType = () => {
			if (excelType.indexOf && typeof excelType.indexOf === 'function') {
				const index = excelType.indexOf(file.type)
				if (index >= 0) {
					return true
				} else if (index < 0 && (!file.type || file.type === '') && file.name) {
					const regex = new RegExp('(\\.xls$)|(\\.xlsx$)')
					return regex.test(file.name)
				}
			}
			return false
		}
		vaild = acceptType()
		if (!vaild) {
			message.error('请上传正确格式的excel!')
		}

		const isLt10M = file.size / 1024 / 1024 < 10
		if (!isLt10M) {
			message.error('上传文件必须小于10m!')
		}
		return vaild && isLt10M
	}
	//   上传组件配置信息（完整版）
	const UploadProps = {
		name: 'file',
		action: '/auth/web/v1/datacenter/teacher/batchImport',
		headers: { Authorization: token },
		accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel ', //指定选择文件框默认文件类型(.xls/.xlsx)
		onChange(info) {
			//正在上传
			if (info.file.status === 'uploading') {
				setLoading(true)
			}
			if (info.file.status === 'done') {
				if (info.file.response.type == 'application/json') {
					const reader = new FileReader()
					reader.readAsText(info.file.response)
					reader.onload = function (event) {
						const jsonData = JSON.parse(event.target.result)
						if (jsonData.code == 200) {
							message.success('教师数据导入成功！')
							getTeacherList()
							StatTeacherStatisticsApi()
							setLoading(false)
						} else {
							message.error('教师数据导入失败！')
							setLoading(false)
						}
					}
				} else {
					const blob = new Blob([info.file.response], { type: 'application/vnd.ms-excel;charset=UTF-8' })
					const a = document.createElement('a') // 转换完成，创建一个a标签用于下载
					a.download = '教师数据导入反馈.xls'
					a.href = window.URL.createObjectURL(blob)
					a.click()
					a.remove()
					getTeacherList()
					setLoading(false)
					Modal.warning({
						title: '导入失败',
						content: '教师数据导入失败原因已下载,请打开Excel查看具体原因！'
					})
				}
			} else if (info.file.status === 'error') {
				setLoading(false)
				message.error(`${info.file.name} 上传出错`)
			}
		}
	}
	//   上传组件配置信息（精简版）
	const UploadPropsEasy = {
		name: 'file',
		action: '/auth/web/v1/datacenter/teacher/simplifyBatchImport',
		headers: { Authorization: token },
		accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel ', //指定选择文件框默认文件类型(.xls/.xlsx)
		onChange(info) {
			//正在上传
			if (info.file.status === 'uploading') {
				setLoading(true)
			}
			if (info.file.status === 'done') {
				if (info.file.response.type == 'application/json') {
					const reader = new FileReader()
					reader.readAsText(info.file.response)
					reader.onload = function (event) {
						const jsonData = JSON.parse(event.target.result)
						if (jsonData.code == 200) {
							message.success('教师数据导入成功！')
							getTeacherList()
							StatTeacherStatisticsApi()
							setLoading(false)
						} else {
							message.error('教师数据导入失败！')
							setLoading(false)
						}
					}
				} else {
					const blob = new Blob([info.file.response], { type: 'application/vnd.ms-excel;charset=UTF-8' })
					const a = document.createElement('a') // 转换完成，创建一个a标签用于下载
					a.download = '教师数据导入反馈.xls'
					a.href = window.URL.createObjectURL(blob)
					a.click()
					a.remove()
					getTeacherList()
					setLoading(false)
					Modal.warning({
						title: '导入失败',
						content: '教师数据导入失败原因已下载,请打开Excel查看具体原因！'
					})
				}
			} else if (info.file.status === 'error') {
				setLoading(false)
				message.error(`${info.file.name} 上传出错`)
			}
		}
	}

	// 批量导出
	const onBatchDerive = () => {
		confirm({
			title: '导出提示',
			icon: <ExclamationCircleOutlined />,
			content: '您即将导出的教师数据为表格字段中所选中的字段!',
			onOk() {
				setButtonLoading({ ...ButtonLoading, DownloadExport: true })
				setLoading(true)
				function request() {
					const xhr = new XMLHttpRequest()
					xhr.open('POST', '/auth/web/v1/datacenter/teacher/export', true)
					xhr.responseType = 'blob' // 包装返回数据格式, 打印出来是 Blob 格式的数据，不是乱码的文本
					xhr.setRequestHeader('Content-Type', 'application/json')
					xhr.setRequestHeader('Authorization', token)
					xhr.onload = function () {
						download(xhr.response)
						setLoading(false)
						setButtonLoading({ ...ButtonLoading, DownloadExport: false })
					}
					xhr.send(
						JSON.stringify({
							...AllScreening,
							columns: NewColumns.map(item => {
								return { name: item.title, key: item.key }
							}).filter(item => item.key !== 'action' && item.key !== 'index')
						})
					)
				}

				function download(blobUrl) {
					const xlsx = 'application/vnd.ms-excel;charset=UTF-8'
					const blob = new Blob([blobUrl], { type: xlsx })
					const a = document.createElement('a') // 转换完成，创建一个a标签用于下载
					a.download = '教师批量导出数据.xlsx'
					a.href = window.URL.createObjectURL(blob)
					a.click()
					a.remove()
					message.success('教师批量导出数据已下载！')
				}
				request()
			},
			onCancel() {}
		})
	}

	// 下载教师导入模板（完整版）
	const onDownloadTeacherTemple = () => {
		setButtonLoading({ ...ButtonLoading, Download: true })
		function request() {
			const xhr = new XMLHttpRequest()
			xhr.open('GET', '/auth/web/v1/datacenter/teacher/downloadTeacherTemple', true)
			xhr.responseType = 'blob' // 包装返回数据格式, 打印出来是 Blob 格式的数据，不是乱码的文本
			xhr.setRequestHeader('Content-Type', 'application/json')
			xhr.setRequestHeader('Authorization', token)
			xhr.onload = function () {
				download(xhr.response)
			}
			xhr.send()
		}
		function download(blobUrl) {
			const xlsx = 'application/vnd.ms-excel;charset=UTF-8'
			const blob = new Blob([blobUrl], { type: xlsx })
			const a = document.createElement('a') // 转换完成，创建一个a标签用于下载
			a.download = '完整版教师导入模板.xlsx'
			a.href = window.URL.createObjectURL(blob)
			a.click()
			a.remove()
			message.success('完整版教师导入模板 已下载！')
			setButtonLoading({ ...ButtonLoading, Download: false })
		}
		request()
	}

	// 下载模板菜单
	const DropdownTemplateMenu = (
		<Menu>
			<Menu.Item key='1'>
				<Button type='text' href='https://reseval.gg66.cn/%E7%B2%BE%E7%AE%80%E7%89%88%E6%95%99%E5%B8%88%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xls'>
					精简模板
				</Button>
			</Menu.Item>
			<Menu.Item key='2'>
				<Button type='text' onClick={onDownloadTeacherTemple}>
					完整模板
				</Button>
			</Menu.Item>
		</Menu>
	)
	const DropdownChannelMenu = (
		<Menu>
			<Menu.Item key='1'>
				<Upload {...UploadPropsEasy} beforeUpload={beforeUpload} customRequest={customRequest} showUploadList={false}>
					<Button type='text'>精简导入</Button>
				</Upload>
			</Menu.Item>
			<Menu.Item key='2'>
				<Upload {...UploadProps} beforeUpload={beforeUpload} customRequest={customRequest} showUploadList={false}>
					<Button type='text'>完整导入</Button>
				</Upload>
			</Menu.Item>
		</Menu>
	)

	return (
		<Space>
			<Dropdown overlay={DropdownTemplateMenu} arrow={true} trigger={['click']}>
				<Button type='link' loading={ButtonLoading.Download}>
					下载批量导入模板
				</Button>
			</Dropdown>
			{window.$PowerUtils.judgeButtonAuth(location, '导入') && (
				<Dropdown overlay={DropdownChannelMenu} arrow={true} trigger={['click']}>
					<Button type='link' style={{ margin: '0 15px' }}>
						批量导入
					</Button>
				</Dropdown>
			)}
			{window.$PowerUtils.judgeButtonAuth(location, '导出') && (
				<Button type='link' onClick={onBatchDerive} loading={ButtonLoading.DownloadExport}>
					批量导出
				</Button>
			)}
		</Space>
	)
}

export default withRouter(ImportAndExport)
