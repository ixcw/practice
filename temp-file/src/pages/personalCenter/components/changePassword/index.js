/**
 * 修改密码
 * @author:熊伟
 * @date:2020年8月22日
 * @version:v1.0.0
 * */
import React from 'react';
import styles from './index.less';
import { routerRedux } from 'dva/router';
import userInfoCache from '@/caches/userInfo';
import { connect } from 'dva';
import { PersonalCenter as namespace, Auth } from '@/utils/namespace';
import { Steps, Input, Button, Form, message } from 'antd';
import YpRiddlerRender from '@/components/YpRiddlerRender/index.js'
import { phoneReg, emailReg, passwordReg } from '@/utils/const';
@connect(state => ({
    loading: state[Auth].loading
}))
export default class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            getCodeTime: 120,//10秒后再发送验证码
            getCodeBtn: false,
            verification: 1,//验证方法 1手机 2Email
            userNumber: undefined
        }
    }
    handleUserNumber = (e) => {
        clearInterval(this.setInterval1);
        this.setState({
            getCodeTime: 120,
            getCodeBtn: false,
            userNumber: e.currentTarget.value
        });
    }
    /**
* 切换修改方法：设置Value值+设置获取验证码Button状态
* method 1手机验证 2邮箱验证---切换验证状态时重置获取验证码状态
*/
    changeMethod = (method) => {
        clearInterval(this.setInterval1);
        this.setState({
            verification: method,
            getCodeTime: 120,
            getCodeBtn: false
        });
    }

    render() {
        const { verification, userNumber, getCodeTime, getCodeBtn } = this.state;
        const { dispatch } = this.props;
        //提交表单
        const onFinish = (payload) => {
            console.log(payload)
            if (verification == 1) {
                dispatch({
                    type: Auth + '/setNewPassword',
                    payload: {
                        phoneNumber: payload.username,
                        password: payload.confirmPassword,
                        validateCode: payload.validateCode
                    },
                    callback: (result) => {
                        // if(result.msg==='success'){
                        message.success('密码设置成功，请重新登录')
                        dispatch(routerRedux.replace({ pathname: '/login' }))
                        // }else{
                        //     message.warning(result.alert)
                        // }
                    }
                })
            }
            if (verification == 2) {
                dispatch({
                    type: namespace + '/userCheckEmailUpdatePwd',
                    payload: {
                        email: payload.username1,
                        password: payload.confirmPassword1,
                        checkCode: payload.validateCode1
                    },
                    callback: (result) => {
                        if (result.code === 200) {
                            userInfoCache.clear();
                            message.success('密码设置成功，请重新登录')
                            dispatch(routerRedux.replace({ pathname: '/login' }))
                        } else {
                            message.error(result.msg)
                        }
                    }
                })

            }
        }
        //点击获取验证码
        const clickGetCode = (object = {}, isShow) => {
            const { userNumber } = this.state;
            if (isShow){
                if (!phoneReg.test(userNumber)) {
                    message.warning('请输入正确的手机号!');
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
            }
            //('手机验证');
            let codeTime = getCodeTime;
            clearInterval(this.setInterval1);
            if (userNumber) {
                if (verification == 1) {
                    dispatch({
                        type: Auth + '/getVerificationCode',
                        payload: {
                            token: object.token,
                            authenticate: object.authenticate,
                            phoneNumber: userNumber,
                            type: 3
                        },
                        callback: (result) => {
                            result == "SUCCESS" && message.success('验证码发送成功，请注意查收')
                            //------------------设置发送验证码倒计时

                            this.setInterval1 = setInterval(() => {
                                codeTime--;
                                if (codeTime == 0) {
                                    clearInterval(this.setInterval1);
                                    this.setState({
                                        getCodeTime: 120,
                                        getCodeBtn: false
                                    })
                                } else {
                                    this.setState({
                                        getCodeTime: codeTime,
                                        getCodeBtn: true
                                    })
                                }
                            }, 1000);
                        }
                    })
                }
                //('邮箱验证');
                if (verification == 2) {
                    dispatch({
                        type: namespace + '/getSendEmail',
                        payload: {
                            email: userNumber,
                            type: 2
                        },
                        callback: (result) => {
                            result == "验证码发送成功" && message.success('验证码发送成功，请注意查收')
                            //------------------设置发送验证码倒计时

                            this.setInterval1 = setInterval(() => {
                                codeTime--;
                                if (codeTime == 0) {
                                    clearInterval(this.setInterval1);
                                    this.setState({
                                        getCodeTime: 120,
                                        getCodeBtn: false
                                    })
                                } else {
                                    this.setState({
                                        getCodeTime: codeTime,
                                        getCodeBtn: true
                                    })
                                }
                            }, 1000);
                        }
                    })
                }

            } else {
                message.warning('请先输入手机账号或邮箱账号！！！！')
            }
        }
        return (
            <div className={styles['changePassword']}>
                <div className={styles['changePassword-content']}>
                    <div className={styles['changePassword-content-btns']}>
                        <Button type={verification == 1 ? "primary" : 'dashed'} onClick={() => { this.changeMethod(1) }}>手机验证修改</Button>
                        <Button type={verification == 2 ? "primary" : 'dashed'} onClick={() => { this.changeMethod(2) }}>邮箱验证修改</Button>
                    </div>
                    <Form
                        onFinish={onFinish}
                        // {...formLayout}
                        style={{ width: '450px' }}
                    >
                        {verification == 1 ?
                            <div>
                                <Form.Item
                                    label="手机号码"
                                    name="username"
                                    rules={[{ required: true, message: '请输入您的用户名!' }, { pattern: phoneReg, message: '请输入正确的手机号' }]}
                                >
                                    <Input placeholder="输入用户名" onChange={this.handleUserNumber} />
                                </Form.Item>
                                <div className={styles['changePassword-content-code1']}>
                                    <Form.Item
                                        label="&ensp;&ensp;验证码"
                                        name="validateCode"
                                        rules={[{ required: true, message: '请输入验证码!' }]}
                                    >
                                        <Input placeholder="输入验证码" />
                                    </Form.Item>
                                    {/* <YpRiddlerRender idString='ypridder-myinfo-setpassword' sendCheckCode={clickGetCode} /> */}
                                    <YpRiddlerRender onRef={(ref) => { this.YpRiddlerRenderRef = ref }} sendCheckCode={clickGetCode} />
                                    <Button type={"primary"} id='ypridder-myinfo-setpassword' disabled={getCodeBtn} onClick={() => { clickGetCode({},1)}} className={styles['changePassword-content-code']}>获取验证码{getCodeBtn ? `(${getCodeTime}s)` : ''}</Button>
                                </div>
                                <Form.Item
                                    label="&ensp;&ensp;新密码"
                                    name='password'
                                    rules={[{ required: true, message: '请输入您要设置的密码!' }, { pattern: passwordReg, message: '请输入6到16位的密码数字字母组合' }]}
                                >
                                    <Input.Password placeholder="输入新密码" />
                                </Form.Item>
                                <Form.Item
                                    label="确认密码"
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
                                    <Input.Password placeholder="确认密码" />
                                </Form.Item>
                            </div>
                            :
                            verification == 2 &&
                            <div>
                                <Form.Item
                                    label="邮箱账号"
                                    name="username1"
                                    rules={[{ required: true, message: '请输入您的邮箱账号!' }, { pattern: emailReg, message: '请输入正确的邮箱账号' }]}
                                >
                                    <Input placeholder="输入邮箱账号" onChange={this.handleUserNumber} />
                                </Form.Item>
                                <div className={styles['changePassword-content-code1']}>
                                    <Form.Item
                                        label="&ensp;&ensp;验证码"
                                        name="validateCode1"
                                        rules={[{ required: true, message: '请输入验证码!' }]}
                                    >
                                        <Input placeholder="输入验证码" />
                                    </Form.Item>
                                    <Button type={"primary"} disabled={getCodeBtn} onClick={clickGetCode} className={styles['changePassword-content-code']}>获取验证码{getCodeBtn ? `(${getCodeTime}s)` : ''}</Button>
                                </div>
                                <Form.Item
                                    label="&ensp;&ensp;新密码"
                                    name='password1'
                                    rules={[{ required: true, message: '请输入您要设置的密码!' }, { pattern: passwordReg, message: '请输入6到16位的密码数字字母组合' }]}
                                >
                                    <Input.Password placeholder="输入新密码" />
                                </Form.Item>
                                <Form.Item
                                    label="确认密码"
                                    name='confirmPassword1'
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
                                    <Input.Password placeholder="确认密码" />
                                </Form.Item>
                            </div>
                        }
                        {/* <a className={styles['regisiter-container-form-right']} onClick={getCode}>获取验证码</a> */}
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className={styles['changePassword-container-confim']}>确认修改</Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }
}