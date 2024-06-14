/**
 * 顶部导航
 * @author:张江
 * @date:2020年08月12日
 * @version:v1.0.0
 * */
import React from 'react';
import {
  Menu,
  Avatar,
  Dropdown,
  Modal,
  notification,
  Image,
  Tag,
  message
} from 'antd';
import { Link } from 'dva/router';
import { routerRedux } from 'dva/router';
import { connect } from "dva";
import userInfoCache from '@/caches/userInfo';
import accessTokenCache from '@/caches/accessToken';
import { Auth as namespace, TopicPanel, HomeIndex } from "@/utils/namespace";
import { existArr, getIcon, urlToList } from "@/utils/utils";
import { appDownloadUrlCodeImg } from "@/utils/const";
import menuListCache from "@/caches/menuList";

import { BellFilled, UserOutlined, LogoutOutlined } from "@ant-design/icons";
//引入样式
import './App.less';
import styles from './TopHeader.less';
import isToDesktopCache from "@/caches/isToDesktop";//是否是桌面端记录缓存
import KSelectedParamCache from "@/caches/KSelectedParam";

const IconFont = getIcon();
const { confirm } = Modal;

@connect(state => ({
	listRoles: state[namespace].listRoles //角色列表
}))
export default class TopHeader extends React.Component {
	constructor() {
		super(...arguments)
		this.state = {
			isLogout: false
		}
	}

	UNSAFE_componentWillMount() {}

	/**
	 * 渲染菜单
	 * @param menus ：菜单数组
	 */
	dealMenus = menus => {
		return (
			menus &&
			menus.map(item => {
				if (item.url) {
					return (
						<div key={item.name}>
							<Link to={item.url} className={styles['link-a']}>
								{item.icon ? item.icon : ''}
								<span className={item.isHighlight ? styles['highlight-text'] : ''}>{item.name}</span>
							</Link>
						</div>
					)
				} else {
					if (item.type == 'dropdown') {
						return (
							<div key={item.name} className={styles['public-info']}>
								<Dropdown
									placement='bottomCenter'
									arrow
									overlay={
										<div className={'download-app-img-box'}>
											<Image
												src={appDownloadUrlCodeImg}
												preview={{
													src: appDownloadUrlCodeImg
												}}
											/>
											<p>扫码下载手机学生端</p>
										</div>
									}>
									<span>
										{' '}
										{item.icon ? item.icon : ''}
										<span>{item.name}</span>
									</span>
								</Dropdown>
							</div>
						)
					}
					return (
						<div key={item.name} className={styles['public-info']}>
							<span>{item.name}</span>
						</div>
					)
				}
			})
		)
	}

	/**
	 * 确认弹框
	 */
	showConfirmModal = () => {
		const { dispatch } = this.props
		const _self = this
		confirm({
			title: '确认退出登录吗？',
			content: '退出之后登录的相关信息将被清除,是否确认退出登录？',
			onOk() {
				notification.success({ message: '退出成功', description: '' })
				_self.setState({
					isLogout: true
				})
				const timer = setTimeout(() => {
					clearTimeout(timer)
					dispatch({
						type: namespace + '/logout'
					})
				}, 500)
			},
			onCancel() {}
		})
	}

	/**
	 *切换角色
	 * @param role  ：角色信息
	 * @param userRoleId  ：当前角色ID
	 */
	handleSwitchRole = (role, userRoleId) => {
		const { dispatch, listRoles } = this.props
		const pathname = urlToList(window.location.hash)
		const matchedRoleName = listRoles.find(obj => obj.id === userRoleId).name
		confirm({
			width: 520,
			title: '角色切换确认',
			content: (
				<div>
					您当前的角色是 <b>{matchedRoleName}</b> ，您是否要切换到 <b>{role.name}</b> 角色？
				</div>
			),
			onOk() {
				const messageConfig = {
					//加载切换班级提示加载配置
					key: 'isNew',
					content: `正在切换当前角色至 ${role.name} ,请稍候...`,
					duration: 10,
					style: {
						marginTop: '20vh'
					}
				}
				message.loading(messageConfig)
				// 切换角色
				dispatch({
					type: namespace + '/switchRole',
					payload: {
						roleCode: role.code
					},
					callback: result => {
						//只有学生与老师可以调用
						if (result && (result.code === 'TEACHER' || result.code === 'STUDENT')) {
							dispatch({
								type: HomeIndex + '/getMyClassInfoList',
								payload: {}
							})
						}
						KSelectedParamCache.clear()
						userInfoCache.clear()
						menuListCache.clear()
						userInfoCache(result)
						let timerOut = setTimeout(() => {
							clearTimeout(timerOut)
							message.destroy()
							if (pathname === '/' || pathname === '/home') {
								window.location.reload()
							} else {
								dispatch(routerRedux.replace('/')) //其他页面 切换班级之后跳转首页
							}
						}, 1000)
					}
				})
			}
		})
	}

	render() {
		const { dispatch, userInfo, listRoles } = this.props
		const { isLogout } = this.state
		const loginUserInfo = userInfoCache() || {}
		const accessToken = accessTokenCache()
		const isStudent = loginUserInfo.code == 'STUDENT' || !loginUserInfo.code
		const isToDesktop = isToDesktopCache()
		//右边菜单数据
		const rightMenus = isStudent
			? [
					{
						url: '/looking-forward',
						name: '开通校园服务'
					},
					{
						url: '/pay-center',
						name: loginUserInfo.member ? '会员中心' : '开通会员',
						isHighlight: true
					},
					{
						url: '/looking-forward',
						name: '操作手册'
					},
					{
						name: '联系电话：400-822-6255‬'
					}
			  ]
			: [
					{
						url: '/looking-forward',
						name: '开通校园服务'
					},
					// {
					//   url: '/pay-center',
					//   name: '开通会员',
					//   isHighlight: true,
					// },
					{
						url: '/looking-forward',
						name: '操作手册'
					},
					{
						name: '联系电话：400-822-6255‬'
					}
			  ]
		const downladApp = {
			// url: '',
			// name: '下载APP',
			// icon: <IconFont type={'icon-shouji'} style={{ marginRight: 2, fontSize: '16px' }} />,
			// type: 'dropdown'
		}
		// 左边菜单数据 && loginUserInfo.account
		const leftMenus =
			!isLogout && accessToken && loginUserInfo
				? [
						downladApp,
						{
							url: '/looking-forward',
							name: '通知',
							icon: <BellFilled style={{ marginRight: 4 }} />
						}
						// {
						//   url: '/home',
						//   name: '个人中心',
						//   icon: <UserOutlined style={{ marginRight: 4 }} />,
						// },
				  ]
				: [
						downladApp,
						// {
						//   url: '/register',
						//   name: '注册',
						//   icon: '',
						// },
						{
							url: '/login',
							name: '登录',
							icon: ''
						}
				  ]
		return (
			//外部（顶部）包含块
			<div className={styles.headerWrap}>
				<div className={styles.headerRight}>{/* {this.dealMenus(rightMenus)} */}</div>
				<div className={styles.headerLeft}>
					{this.dealMenus(leftMenus)}

					{
						//&& loginUserInfo.account
						!isLogout && accessToken && loginUserInfo ? (
							<Dropdown
								className={styles.userHead}
								overlay={
									<div className='switch-role-list'>
										{existArr(listRoles) ? (
											<div key='switch-role-child' className='switch-role-child'>
												<div className='switch-role' style={{ backgroundColor: '#F4F3F3' }}>
													<a>
														<IconFont type={'icon-jiantou_zuoyouqiehuan'} style={{ marginRight: 4, fontSize: '16px' }} /> 切换角色
													</a>
												</div>
												{listRoles.map(role => {
													const isCurrentRole = role.code == loginUserInfo.code
													return (
														<div
															className='role-item'
															key={role.code}
															style={{ backgroundColor: isCurrentRole ? 'rgba(244, 243, 243, 0.6)' : '' }}
															onClick={() => {
																if (isCurrentRole) return
																this.handleSwitchRole(role, loginUserInfo.roleId)
															}}>
															<a style={{ color: isCurrentRole ? '#1890ff' : '' }}>{role.name}</a>
															{isCurrentRole ? <span>当前角色</span> : null}
														</div>
													)
												})}
											</div>
										) : null}
										<Menu className='nav-my-list' selectedKeys={['sub2']}>
											{isStudent ? (
												<Menu.Item key='pay'>
													<a
														onClick={() => {
															dispatch(routerRedux.push('/pay-center'))
														}}
														style={{ color: '#F2A61F' }}>
														<IconFont type={'icon-VIP1'} style={{ marginRight: 4, fontSize: '16px' }} /> {loginUserInfo.member ? '会员中心' : '开通会员'}
													</a>
												</Menu.Item>
											) : null}
											<Menu.Item key='test'>
												<a
													onClick={() => {
														dispatch(routerRedux.push('/personalCenter'))
													}}>
													<UserOutlined style={{ marginRight: 4 }} /> 个人中心
												</a>
											</Menu.Item>
											{isToDesktop ? null : (
												<Menu.Item>
													<a
														onClick={() => {
															this.showConfirmModal()
														}}>
														<LogoutOutlined style={{ marginRight: 4 }} /> 退出
													</a>
												</Menu.Item>
											)}
										</Menu>
									</div>
								}>
								<div style={{ maxWidth: 250, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
									<Avatar size={'small'} src={loginUserInfo && loginUserInfo.imgHead ? loginUserInfo.imgHead : 'https://resformalqb.gg66.cn/defaultavater.png'} />
									<span
										className='user-name'
										style={{ color: loginUserInfo.member ? '#F2A61F' : '' }}
										titile={loginUserInfo && loginUserInfo.userName ? '您好,' + loginUserInfo.userName : '您好,游客'}>
										{loginUserInfo && loginUserInfo.userName ? '您好,' + loginUserInfo.userName : '您好,游客'}
										{loginUserInfo.member ? <IconFont type={'icon-VIP1'} className='vip-tag' /> : null}
									</span>
									{existArr(listRoles) && (
										<Tag style={{ marginLeft: '10px' }} color='processing'>
											{listRoles.find(role => role.code == loginUserInfo.code).name}
										</Tag>
									)}
									<IconFont type={'icon-column'} />
								</div>
							</Dropdown>
						) : null
					}
				</div>
			</div>
		)
	}
}
