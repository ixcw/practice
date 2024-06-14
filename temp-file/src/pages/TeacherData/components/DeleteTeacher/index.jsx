/**
 * 教师数据单条删除/批量删除
 * @author 韦靠谱
 * @date 2023/10/10
 * @since 1.0.0
 * @Modified
 */
import React, { useState, useRef, useImperativeHandle } from 'react'
import { Modal, message, Row, Col, Input, Button } from 'antd'
import { connect } from 'dva'
import userInfoCache from '@/caches/userInfo'
import { TeacherData as namespace } from '@/utils/namespace'
import { phoneReg } from '@/utils/const'
import YpRiddlerRender from '@/components/YpRiddlerRender/index.js' //滑块验证

const DeleteTeacher = props => {
	const { dispatch, setSelectedRows, StatTeacherStatisticsApi, ListDataCurrentPage, getTeacherList, ListDataPageSize, AllScreening } = props
	const loginUserInfo = userInfoCache() || {}
	const YpRiddlerRenderRef = useRef(null)
	const [isDeleteTeacherOpen, setIsDeleteTeacherOpen] = useState(false)
	const [isDisabled, setIsDisabled] = useState(false)
	const [countdown, setCountdown] = useState(0)
	const [inputCode, setInputCode] = useState(null)
	const [TeacherInfo, setTeacherInfo] = useState(null)

	// 向父组件传递方法
	useImperativeHandle(props.innerRef, () => ({
		showDeleteTeacher
	}))
	/**
	 * 打开删除弹窗
	 * @param	params object	教师详情
	 */
	const showDeleteTeacher = params => {
		if (Array.isArray(params)) {
			// 批量删除
			setTeacherInfo(params.map(item => item.identityCard).join(','))
		} else {
			// 单条删除
			setTeacherInfo(params.identityCard)
		}
		setIsDeleteTeacherOpen(true)
	}
	/**
	 * 验证码输入框
	 * @param	e	事件对象 用于获取输入框的值
	 */
	const onInputChange = e => {
		setInputCode(e.target.value)
	}
	/**
	 * 获取验证码 打开滑块验证  倒计时60s
	 * @param	object	滑块验证通过参数
	 * @param	isShow	滑块验证状态
	 */
	const getCode = (object = {}, isShow = false) => {
		if (isDisabled) return

		if (!phoneReg.test(loginUserInfo.phone)) {
			message.warning('手机号有误，请前往个人中心重新设置!')
			return
		}
		if (isShow == 1) {
			YpRiddlerRenderRef.current.showIsSlideShow() //展示验证弹窗
			return
		}
		if (isShow == 2 && (!object.token || !object.authenticate)) {
			message.warning('参数有误,请稍后重试!')
			return
		}
		dispatch({
			type: namespace + '/getVerificationCodeApi',
			payload: {
				token: object.token, //行为验证token
				authenticate: object.authenticate, //行为验证许可authenticate
				phoneNumber: loginUserInfo.phone, //管理员手机号
				type: 6 //删除标识符
			},
			callback: res => {
				if (res.result?.code === 200) {
					message.success('验证码发送成功，请注意查收')
					setIsDisabled(true)
					setCountdown(60)
					const timer = setInterval(() => {
						setCountdown(prevCountdown => prevCountdown - 1)
					}, 1000)
					setTimeout(() => {
						clearInterval(timer)
						setIsDisabled(false)
					}, 60000)
				}
			}
		})
	}
	/**
	 * 确认删除
	 */
	const handleOk = () => {
		// 效验验证码
		dispatch({
			type: namespace + '/verificationCodeApi',
			payload: { phoneNumber: loginUserInfo.phone, validateCode: inputCode },
			callback: res => {
				if (res.result?.code === 200) {
					// 删除教师账号
					dispatch({
						type: namespace + '/bathDeleteByIdCardsApi',
						payload: { idCards: TeacherInfo },
						callback: res => {
							if (res.result?.code === 200) {
								Modal.success({
									title: '删除成功！',
									onOk() {
										setIsDeleteTeacherOpen(false)
										setInputCode(null)
										getTeacherList(ListDataCurrentPage, ListDataPageSize, AllScreening)
										StatTeacherStatisticsApi()
										setSelectedRows([])
									}
								})
							}
						}
					})
				} else {
					message.error('验证码错误请重新输入！')
				}
			}
		})
	}
	/**
	 * 取消删除
	 */
	const handleCancel = () => {
		setIsDeleteTeacherOpen(false)
		setInputCode(null)
	}

	return (
		<>
			<Modal title='身份验证' visible={isDeleteTeacherOpen} onOk={handleOk} onCancel={handleCancel}>
				<div style={{ margin: '20px 0' }}>请输入 {`${loginUserInfo.phone?.substr(0, 3)}****${loginUserInfo.phone?.substr(-4)}`} 接收到的验证码</div>
				<Row gutter={[12, 0]}>
					<Col span={12}>
						<Input value={inputCode} onChange={onInputChange} placeholder='请输入验证码' />
					</Col>
					<Col span={12}>
						<Button type='primary' disabled={isDisabled} onClick={() => getCode({}, 1)}>
							{isDisabled ? `${countdown}秒后再次获取` : '获取验证码'}
						</Button>
					</Col>
				</Row>
				<YpRiddlerRender onRef={ref => (YpRiddlerRenderRef.current = ref)} sendCheckCode={getCode} />
			</Modal>
		</>
	)
}
const mapStateToProps = state => {
	return {}
}
export default connect(mapStateToProps)(DeleteTeacher)
