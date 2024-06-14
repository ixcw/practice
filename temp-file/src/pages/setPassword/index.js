/**
 * 设置密码
 * @author:熊伟
 * @date:2020年8月22日
 * @version:v1.0.0
 * */
import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import BackBtns from '@/components/BackBtns/BackBtns'
import userInfoCache from '@/caches/userInfo'
import { Steps, Input, Button, Form, message } from 'antd';
import { Auth as namespace } from '@/utils/namespace';
import { UserOutlined, BarcodeOutlined, LockOutlined, CheckCircleTwoTone } from '@ant-design/icons';
import YpRiddlerRender from '@/components/YpRiddlerRender/index.js'
import { phoneReg, passwordReg } from '@/utils/const'
const { Step } = Steps;
@connect(state => ({
    loading: state[namespace].loading
}))
export default class SetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            getCodeTime: 0,//验证码获取初始化
            goLoginTime: 0,//跳转初始化
            current: 0,//步骤条
            userName: undefined,
            code: undefined
        }
    }
    /**
* 输入框改变时：设置Value值+设置获取验证码Button状态
*/
    handleUsername = (e) => {
        this.setState({
            userName: e.currentTarget.value,
            getCodeTime: 0,
        })
        clearInterval(this.setTime);
    }
    /**
* 输入框改变时：设置Value值+设置获取验证码Button状态
*/
    handleCode = (e) => {
        this.setState({
            code: e.currentTarget.value
        })
    }
    render() {
        const bg = 'https://reseval.gg66.cn/register-bg.png';
        const { loading, dispatch } = this.props;
        const { current, getCodeTime, userName, code, goLoginTime } = this.state;
        //点击下一步提交表单
        const onFinish = (payload) => {
            //----判断current步骤--判断current=0发送请求--成功跳转--设置current==1--判断current=1发送请求--成功跳转--设置current==2---
            current == 0 && dispatch({
                type: namespace + '/verificationCode',
                payload: {
                    phoneNumber: payload.username,
                    validateCode: payload.code,
                },
                callback: () => {
                    message.success('验证通过，请设置新密码')
                    this.setState({ current: 1 })
                }
            })
            current == 1 && dispatch({
                type: namespace + '/setNewPassword',
                payload: {
                    phoneNumber: userName,
                    password: payload.confirmPassword,
                    validateCode: code
                },
                callback: (result) => {
                    this.setState({ current: 2 })
                    this.setState({
                        current: 2,
                        goLoginTime: 5,
                    }, () => {
                        let codeTime = 5;
                        const setTime = setInterval(() => {
                            codeTime--;
                            if (codeTime !== -1) {
                                this.setState({
                                    goLoginTime: codeTime
                                })
                            } else {
                                clearInterval(setTime);
                                userInfoCache.clear();
                                dispatch(routerRedux.replace({ pathname: '/login' }))
                            }
                        }, 1000);
                    })
                }
            })
            // console.log(payload)
        }
        //获取验证码
        // const getCode = (object = {}, next) => {
        //     const { userName } = this.state;
        //     if (next && typeof next == 'function') {
        //         if (phoneReg.test(userName)) {
        //             next();
        //         } else {
        //             message.warning('请输入正确的账号/用户名!')
        //         }
        //     }
        //     if (object && object.type == 'beforeStart') {
        //         return;
        //     }
        const getCode = (object = {}, isShow = false) => {
            const { userName } = this.state;
            if (!phoneReg.test(userName)) {
                message.warning('请输入正确的账号/用户名!');
                return;
            }
            if (isShow == 1) {
                this.YpRiddlerRenderRef.showIsSlideShow();//展示验证弹窗
                return;
            }
            if (isShow == 2 && (!object.token || !object.authenticate)) {
                message.warning('参数有误,请稍后重试!');
                return;
            }
            // getCodeTime==0?
            //---------获取验证码--------------
            if (userName) {
                dispatch({
                    type: namespace + '/getVerificationCode',
                    payload: {
                        token: object.token,
                        authenticate: object.authenticate,
                        phoneNumber: userName,
                        type: 3
                    },
                    callback: (result) => {
                        result == "SUCCESS" && message.success('验证码发送成功，请注意查收');
                        this.setState({
                            getCodeTime: 120,
                        }, () => {
                            let codeTime = 120;
                            this.setTime = setInterval(() => {
                                codeTime--;
                                codeTime !== -1 ?
                                    this.setState({
                                        getCodeTime: codeTime
                                    }) : clearInterval(this.setTime)
                            }, 1000);
                        })
                    }
                })
            } else {
                message.warning('请先输入手机账号！！！！')
            }
        }
        //点击去登录
        const onClickGoLogin = () => {
            dispatch(routerRedux.replace({ pathname: '/login' }))
        }
        return (
            <div className={styles['setPassword']}>
                <div className={styles['setPassword-container']}>
                    <div className={styles['flex']}>
                        <div className={styles['setPassword-container-main']}>
                            {/* <h1>{window.$systemTitleName}</h1> */}
                            <p>重置密码</p>
                            <Steps current={current} onChange={this.onChange}>
                                <Step title="第一步" description="填写登录账号" />
                                <Step title="第二步" description="重置密码" />
                                <Step title="第三步" description="成功找回" />
                            </Steps>
                            {
                                current == 0 ?
                                    <div>
                                        <Form
                                            onFinish={onFinish}
                                        >
                                            <div className={styles['setPassword-container-form']}>
                                                <Form.Item
                                                    name='username'
                                                    rules={[{ required: true, message: '请输入您的手机号!' }, { pattern: phoneReg, message: '请输入正确的手机号' }]}
                                                >
                                                    <Input placeholder="输入手机号" onChange={this.handleUsername} prefix={<UserOutlined />} />
                                                </Form.Item>
                                                <div className={styles['setPassword-container-code']}>
                                                    <Form.Item
                                                        name='code'
                                                        rules={[{ required: true, message: '请输入验证码!' }]}
                                                    >
                                                        <Input
                                                            placeholder="验证码"
                                                            prefix={<BarcodeOutlined />}
                                                            onChange={this.handleCode}
                                                            className={styles['setPassword-container-code1']}
                                                        />
                                                    </Form.Item>
                                                    {/* <YpRiddlerRender idString='ypridder-setpassword' sendCheckCode={getCode} /> */}
                                                    <YpRiddlerRender onRef={(ref) => { this.YpRiddlerRenderRef = ref }} sendCheckCode={getCode} />
                                                    <Button
                                                        id='ypridder-setpassword'
                                                        type="primary"
                                                        disabled={getCodeTime == 0 ? false : true}
                                                        // onClick={getCode}
                                                        onClick={() => {
                                                            getCode({}, 1)
                                                        }}
                                                        loading={!!loading}
                                                        className={styles['setPassword-container-code1']}
                                                    >
                                                        获取验证码{getCodeTime !== 0 ? `(${getCodeTime}s)` : ''}
                                                    </Button>
                                                </div>
                                            </div>
                                            <Form.Item>
                                                <Button type="primary" htmlType="submit" loading={!!loading} className={styles['setPassword-container-next']}>下一步</Button>
                                            </Form.Item>
                                        </Form>
                                    </div> :
                                    current == 1 ?
                                        <div>
                                            <Form
                                                onFinish={onFinish}
                                            >
                                                <div className={styles['setPassword-container-form']}>
                                                    <Form.Item
                                                        name='password'
                                                        rules={[{ required: true, message: '请输入您要设置的密码!' }, { pattern: passwordReg, message: '请输入6到16位的密码数字字母组合' }]}
                                                    >
                                                        <Input.Password placeholder="输入密码" prefix={<LockOutlined />} />
                                                    </Form.Item>
                                                    <Form.Item
                                                        name='confirmPassword'
                                                        dependencies={['password']}
                                                        rules={[{ required: true, message: '请输入您要设置的密码!' }, ({ getFieldValue }) => ({
                                                            validator(rule, value) {
                                                                if (!value || getFieldValue('password') === value) {
                                                                    return Promise.resolve();
                                                                }
                                                                return Promise.reject('两次密码必须一致!');
                                                            },
                                                        }),]}
                                                    >
                                                        <Input.Password placeholder="确认密码" prefix={<LockOutlined />} />
                                                    </Form.Item>
                                                </div>
                                                <Form.Item>
                                                    <Button type="primary" htmlType="submit" className={styles['setPassword-container-next']}>下一步</Button>
                                                </Form.Item>
                                            </Form>
                                        </div> :
                                        current == 2 &&
                                        <div>
                                            <div className={styles['setPassword-container-form']} style={{ textAlign: 'center', fontSize: '16px', lineHeight: '50px' }}>
                                                <CheckCircleTwoTone style={{ fontSize: '30px' }} />设置成功，请牢记新的登录密码！<a onClick={onClickGoLogin}>立即登录{goLoginTime}s</a>
                                            </div>
                                        </div>
                            }
                        </div>
                        <BackBtns
                            isBack={true}
                            styles={{ bottom: '200px', right: '300px' }}
                        />
                    </div>
                    <div className={styles['setPassword-bg']} style={{ backgroundImage: 'url(' + bg + ')' }} />
                </div>
            </div>
        )
    }
}