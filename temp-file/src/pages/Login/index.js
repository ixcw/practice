/**
 * 登录
 * @author:熊伟
 * @date:2020年8月22日
 * @version:v1.0.0
 * */
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, Button, Checkbox, message, Spin } from 'antd'
import { Auth as namespace } from '@/utils/namespace';
import styles from './Login.less';
import loginRememberCache from '@/caches/loginRemember';
import { phoneReg } from '@/utils/const'
import YpRiddlerRender from '@/components/YpRiddlerRender/index.js'
@connect(state => ({
	loading: state[namespace].loading
}))
class Login extends React.Component {
	formRef = React.createRef()
	constructor(props) {
		super(props)
		this.state = {
			getCodeTime: 0, //验证码获取时间间隔
			loginmethod: false, //登录方法falsem密码登录
			userName: undefined,
			password: undefined
		}
	}
	componentDidMount() {
		/*
		 * 适配单点登录
		 */
		const { dispatch } = this.props
		const searchParams = new URLSearchParams(this.props.location.search)
		const access_token = searchParams.get('access_token')
		if (access_token) {
			dispatch({
				type: namespace + '/login',
				payload: {
					grant_type: 'platformToken',
					token: access_token
				}
			})
		}
	}

	UNSAFE_componentWillMount() {
		/*
		 * 获取记住的数据 七天过期
		 */
		let loginData = loginRememberCache()
		this.setState({
			userName: !!loginData ? loginData.username : undefined,
			password: !!loginData ? loginData.password : undefined
		})
	}
	/**
	 * 页面组件即将卸载时：清空数据
	 */
	componentWillUnmount() {
		this.setState = (state, callback) => {
			return
		}
	}
	/**
	 * 输入框改变时：设置Value值+设置获取验证码Button状态
	 */
	handleUsername = e => {
		this.setState({
			getCodeTime: 0,
			userName: e.currentTarget.value
		})
		clearInterval(this.setTime)
	}
	handlePassword = e => {
		this.setState({
			password: e.currentTarget.value
		})
	}
	/**
	 * 切换登录方法：设置Value值+设置获取验证码Button状态
	 * method 0密码登录 1验证码登录---切换登录状态时重置获取验证码状态
	 */
	changeLoginMethod = method => {
		if (method) {
			this.setState({ loginmethod: true })
		} else {
			this.setState({
				loginmethod: false,
				getCodeTime: 0
			})
			clearInterval(this.setTime)
		}
	}

	render() {
		const { loading, dispatch } = this.props
		// const { search, pathname } = location;
		// const bg = 'https://reseval.gg66.cn/l-r-bg.png';
		const bg = 'https://reseval.gg66.cn/new-loginorregister-bg.png'
		const bg1 = 'https://reseval.gg66.cn/new-loginorregister-logobg.png'
    const { userName, password, loginmethod, getCodeTime } = this.state
    const searchParams = new URLSearchParams(this.props.location.search)
		const access_token = searchParams.get('access_token')
		const onClickRegister = () => {
			//前往注册页面
			dispatch(routerRedux.push({ pathname: '/register' }))
		}
		// const loginVerify = (object = {}, next) => {
		//   const { userName, password } = this.state;
		//   if (next && typeof next == 'function') {
		//     if (password && phoneReg.test(userName)) {
		//       next();
		//     } else {
		//       message.warning('请输入正确的账号密码!')
		//     }
		//   }
		//   if (object && object.type == 'beforeStart') {
		//     return;
		//   }
		//   dispatch({
		//     type: namespace + '/login',
		//     payload: {
		//       grant_type: 'password',
		//       token: object.token,
		//       authenticate: object.authenticate,
		//       username: userName,
		//       password: password
		//     }
		//   })
		// }
		const onFinish = payload => {
			if (!!payload.remember) {
				//记住密码
				loginRememberCache({ username: payload.username, password: payload.password })
			}
			payload.password &&
				dispatch({
					type: namespace + '/login',
					payload: {
						grant_type: 'password',
						username: userName,
						password: password
					}
				})
			payload.verificationCode &&
				dispatch({
					type: namespace + '/login',
					payload: {
						grant_type: 'smsCode',
						username: payload.username,
						password: payload.verificationCode
					}
				})
		}
		//获取验证码--成功后设置Btn状态
		// const getCode = (object = {}, next) => {
		//   const { userName } = this.state;
		//   if (next && typeof next == 'function') {
		//     if (phoneReg.test(userName)) {
		//       next();
		//     }
		//     else {
		//       message.warning('请输入正确的手机号!')
		//     }
		//   }
		//   if (object && object.type == 'beforeStart') {
		//     return;
		//   }
		//   // payload.token = object.token;
		//   //   payload.authenticate = object.authenticate;
		//   dispatch({
		//     type: namespace + '/getVerificationCode',
		//     payload: {
		//       token: object.token,
		//       authenticate: object.authenticate,
		//       phoneNumber: userName,
		//       type: 2
		//     },
		//     callback: (result) => {
		//       result == "SUCCESS" && message.success('验证码发送成功，请注意查收');
		//       this.setState({
		//         getCodeTime: 120,
		//       }, () => {
		//         let codeTime = 120;
		//         this.setTime = setInterval(() => {
		//           codeTime--;
		//           codeTime !== -1 ?
		//             this.setState({
		//               getCodeTime: codeTime
		//             }) : clearInterval(this.setTime)
		//         }, 1000);
		//       })
		//     }
		//   })
		// }
		const getCode = (object = {}, isShow = false) => {
			const { userName } = this.state
			if (!phoneReg.test(userName)) {
				message.warning('请输入正确的手机号!')
				return
			}
			if (isShow == 1) {
				this.YpRiddlerRenderRef.showIsSlideShow() //展示验证弹窗
				return
			}
			if (isShow == 2 && (!object.token || !object.authenticate)) {
				message.warning('参数有误,请稍后重试!')
				return
			}
			dispatch({
				type: namespace + '/getVerificationCode',
				payload: {
					token: object.token,
					authenticate: object.authenticate,
					phoneNumber: userName,
					type: 2
				},
				callback: result => {
					message.success('验证码发送成功，请注意查收')
					this.setState(
						{
							getCodeTime: 120
						},
						() => {
							let codeTime = 120
							this.setTime = setInterval(() => {
								codeTime--
								codeTime !== -1
									? this.setState({
											getCodeTime: codeTime
									  })
									: clearInterval(this.setTime)
							}, 1000)
						}
					)
				}
			})
		}
		const onClickSetPassword = () => {
			dispatch(routerRedux.push({ pathname: '/setPassword' }))
		}
		return (
			<div className={styles['login']}>
        <div className={styles['login-container']}>
          {access_token && <Spin />}
          {!access_token && (
            <div className={styles['mian']}>
              <h1 style={{ position: 'absolute', margin: '-60px 0 0 10px', color: 'white' }}>盘州市教育大数据平台——校平台</h1>
              <div className={styles['bg']} style={{ backgroundImage: 'url(' + bg1 + ' )' }}></div>
              <div className={styles['container']}>
                {/* <h1 className={styles['login-container-main-title']} onClick={() => { dispatch(routerRedux.replace({ pathname: '/' })) }}>{window.$systemTitleName}登录</h1> */}
                {/* <h2 className={styles['login-container-main-title-login']}>登&nbsp;录</h2> */}
                <h2 className={styles['login-container-main-title']}>登&nbsp;录</h2>
                <div className={styles['login-container-main-register']}>
                  <p>
                    <span
                      className={styles[!loginmethod ? 'activate' : '']}
                      onClick={() => {
                        this.changeLoginMethod(0)
                      }}>
                      账号密码登录
                    </span>
                    <span
                      className={styles[loginmethod ? 'activate' : '']}
                      onClick={() => {
                        this.changeLoginMethod(1)
                      }}>
                      验证码登录
                    </span>
                  </p>
                </div>
                <Form onFinish={onFinish}>
                  <Form.Item
                    // label="Username"
                    initialValue={userName}
                    name='username'
                    rules={[
                      { required: true, message: '请输入您的用户名!' },
                      { pattern: loginmethod ? phoneReg : '', message: '请输入正确的手机号' }
                    ]}>
                    <Input placeholder='输入用户名' onChange={this.handleUsername} className={styles['login-container-main-input']} />
                  </Form.Item>
                  {!loginmethod ? (
                    <Form.Item
                      // label="Password"
                      initialValue={password}
                      name='password'
                      rules={[{ required: true, message: '请输入您的密码!' }]}>
                      <Input.Password placeholder='输入密码' onChange={this.handlePassword} className={styles['login-container-main-input']} />
                    </Form.Item>
                  ) : (
                    <Form.Item
                    // name="verificationCode"
                    // rules={[{ required: true, message: '请输入验证码!' }]}
                    >
                      <div className={styles['login-container-main-verification']}>
                        <Form.Item name='verificationCode' rules={[{ required: true, message: '请输入验证码!' }]} className={styles['login-container-main-verificationCode']}>
                          <Input placeholder='输入验证码' />
                        </Form.Item>
                        {/* <YpRiddlerRender idString='ypridder-login' sendCheckCode={getCode} />
											 */}
                        <YpRiddlerRender
                          onRef={ref => {
                            this.YpRiddlerRenderRef = ref
                          }}
                          sendCheckCode={getCode}
                        />
                        <Button
                          // id='ypridder-login'
                          type='primary'
                          disabled={getCodeTime == 0 ? false : true}
                          loading={!!loading}
                          className={styles['login-container-main-verificationCodebtn']}
                          onClick={() => {
                            getCode({}, 1)
                          }}>
                          获取验证码{getCodeTime !== 0 ? `(${getCodeTime}s)` : ''}
                        </Button>
                      </div>
                    </Form.Item>
                  )}
                  {!loginmethod ? (
                    <Form.Item>
                      <div className={styles['login-container-main-loginmethod']}>
                        <Form.Item name='remember' valuePropName='checked'>
                          <Checkbox>记住密码</Checkbox>
                        </Form.Item>
                        <p onClick={onClickSetPassword} style={{ cursor: 'pointer' }}>
                          忘记密码＞
                        </p>
                      </div>
                    </Form.Item>
                  ) : null}
                  <Form.Item>
                    {/* {
                    !loginmethod ? */}
                    {/* <div> */}
                    {/* <YpRiddlerRender idString='ypridder-login-denglu' sendCheckCode={loginVerify} /> */}
                    <Button id='ypridder-login-denglu' type='primary' htmlType='submit' className={styles['login-container-main-loginbtn']} loading={!!loading}>
                      登录
                    </Button>
                    {/* </div> */}
                    {/* //     :
                  //     <Button type="primary" htmlType="submit" className={styles['login-container-main-loginbtn']} loading={!!loading}>登录</Button>
                  // // } */}
                  </Form.Item>
                </Form>
                <p className={styles['login-container-main-forgerpassword']}>
                  <span
                    onClick={() => {
                      dispatch(routerRedux.replace({ pathname: '/' }))
                    }}>
                    <a>返回首页</a>
                  </span>
                  {/* &nbsp;|&nbsp;没有账号? */}
                  {/* <span onClick={onClickRegister}><a>免费注册</a></span> */}
                </p>
              </div>
            </div>
          )}
				</div>
				<div className={styles['login-bg']} style={{ backgroundImage: 'url(' + bg + ' )' }}></div>
			</div>
		)
	}
}
export default Login;
