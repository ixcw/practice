/**
 * 个人中心-个人信息
 * @author:熊伟
 * @date:2020年8月22日
 * @version:v1.0.0
 * */
import React from 'react';
import styles from './changeBinding.less';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import userInfoCache from '@/caches/userInfo';
import { Modal, Button, Form, Input, message } from 'antd';
import { PersonalCenter as namespace, Auth } from '@/utils/namespace';
import { phoneReg, emailReg } from '@/utils/const';
import YpRiddlerRender from '@/components/YpRiddlerRender/index.js'
import { string } from 'prop-types';
import auth from '@/models/auth';
@connect(state => ({
}))
export default class ChangeBinding extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            account: undefined,
            getCodeTime: 120,//秒后再发送验证码
            getCodeBtn: false,
            changeType: 0,//0关闭1手机换绑2邮箱换绑
        }
    }
    componentDidMount() {
        const { getChildenThis } = this.props;
        getChildenThis(this)
    }
    /**
* 页面组件即将卸载时：清空数据
*/
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }
    //修改隐藏显示
    onChangeType = (type) => {
        this.setState({
            changeType: type,
            getCodeTime: 120,//10秒后再发送验证码
            getCodeBtn: false,
        })
        clearInterval(this.setInterval1);
    }
    //点击发送验证码
    clickSendCode = (object = {}, isShow) => {//--------------------------------------------------------------------------------
        const { changeType, account } = this.state;
        const { dispatch } = this.props;
        // if (next && typeof next == 'function') {
        //     if (phoneReg.test(account)) {
        //         next();
        //     } else {
        //         message.warning('请输入正确的账号/用户名!')
        //     }
        // }
        // if (object && object.type == 'beforeStart') {
        //     return;
        // }
            if (isShow) {
                if (!phoneReg.test(account)) {
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
            }
        // clearInterval(setInterval1);
        if (account) {
            let codeTime = this.state.getCodeTime;
            if (changeType == 1) {
                dispatch({
                    type: Auth + '/getVerificationCode',
                    payload: {
                        token: object.token,
                        authenticate: object.authenticate,
                        phoneNumber: account,
                        type: 1
                    },
                    callback: (result) => {
                        if (result === null) {
                            message.success('验证码发送成功，请注意查收')
                        } else { 
                            message.warning(result.msg)
                        }
                    }
                })

            }
            if (changeType == 2) {
                dispatch({
                    type: namespace + '/getSendEmail',
                    payload: {
                        email: account,
                        type: 1
                    },
                    callback: (result) => {
                        if (result == '验证码发送成功') {
                            message.success('验证码发送成功，请注意查收');
                        } else {
                            message.warning(result.msg);
                        }
                    }
                })
            }
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
        } else {
            message.warning('请输入手机账号或邮箱账号！！！！')
        }
    }
    //账号改变
    currentChange = (e) => {
        clearInterval(this.setInterval1);
        this.setState({
            getCodeTime: 120,//秒后再发送验证码
            getCodeBtn: false,
            account: e.currentTarget.value
        })
    }
    render() {
        const { changeType, getCodeTime, getCodeBtn } = this.state;
        const { dispatch, userInfo = {} } = this.props;
        const onFinish = (payload) => {
            if (changeType == 1) {
                dispatch({
                    type: Auth + '/verificationCode',
                    payload: {
                        phoneNumber: payload.phone,
                        validateCode: payload.code
                    },
                    callback: (result) => {
                        dispatch({
                            type: namespace + '/updateUserAccount',
                            payload: {
                                phoneNumber: payload.phone,
                                validateCode: payload.code
                            },
                            callback: (result) => {
                                if (!result) {
                                    message.success('绑定成功,请重新登录');
                                    this.setState({ changeType: 0 })
                                    userInfoCache.clear();
                                    dispatch(routerRedux.replace({ pathname: '/login' }))
                                } else {
                                    message.warning(result.msg);
                                }
                            }
                        })
                    }
                })

            }
            if (changeType == 2) {
                // dispatch({
                //     type: namespace + '/saveState',
                //     payload: {
                //         myInfoLoading: true,
                //     },
                // });
                dispatch({
                    type: namespace + '/userBindEmail',
                    payload: {
                        email: payload.email,
                        checkCode: payload.code
                    },
                    callback: (result) => {
                        if (result == '绑定成功') {
                            this.setState({ changeType: 0 })
                            message.success('绑定成功');
                            userInfo.eEmail = payload.email;
                            userInfoCache(userInfo);
                            this.setState({
                                changeType: 0
                            })
                            dispatch({
                                type: namespace + '/saveState',
                                payload: {
                                    myInfoLoading: false,
                                },
                            });
                            userInfoCache.clear();
                            dispatch({
                                type: Auth + '/getSwitchUserInfo',
                                payload: {
                                }
                            })
                        } else {
                            message.warning(result.msg);
                        }
                    }
                })
            }
            //----------------------------------------------修改过后关闭--------------------------------
        }
        return (
            <div className={styles['changeBinding']}>
                <Modal
                    title={changeType == 1 ? "换绑手机号" : changeType == 2 && '换绑邮箱帐号'}
                    visible={changeType == 0 ? false : true}
                    footer={null}
                    // onOk={this.handleOk}
                    destroyOnClose={true}
                    onCancel={() => { this.onChangeType(0) }}
                    centered
                >
                    <Form
                        onFinish={onFinish}
                        style={{ position: 'relative' }}
                    >
                        {
                            changeType == 1 ?
                                <Form.Item
                                    label="换绑手机号"
                                    name='phone'
                                    rules={[{ required: true, message: '请输入您的手机号!' }, { pattern: phoneReg, message: '请输入正确的手机号' }]}
                                >
                                    <Input placeholder="输入手机号" className={styles['changeBinding-input']} onChange={this.currentChange} />
                                </Form.Item> :
                                changeType == 2 &&
                                <Form.Item
                                    label="换绑邮箱号"
                                    name='email'
                                    rules={[{ required: true, message: '请输入您的邮箱账号!' }, { pattern: emailReg, message: '请输入正确的邮箱账号' }]}
                                >
                                    <Input placeholder="输入邮箱账号" className={styles['changeBinding-input']} onChange={this.currentChange} />
                                </Form.Item>
                        }
                        {/* <YpRiddlerRender idString='ypridder-myinfo-changeBinding' sendCheckCode={this.clickSendCode} /> */}
                        <YpRiddlerRender onRef={(ref) => { this.YpRiddlerRenderRef = ref }} sendCheckCode={this.clickSendCode} />
                        <Button type="primary" id='ypridder-myinfo-changeBinding' disabled={getCodeBtn} className={styles['changeBinding-code']} onClick={() => { this.clickSendCode({},1)}}>发送验证码{getCodeBtn ? `(${getCodeTime}s)` : ''}</Button>
                        <Form.Item
                            label="验&ensp;&ensp;证&ensp;&ensp;码"
                            name='code'
                            rules={[{ required: true, message: '请输入验证码!' }]}
                        >
                            <Input placeholder="请输入验证码" className={styles['changeBinding-input']} />
                        </Form.Item>
                        <Form.Item>
                            <div className={styles['changeBinding-btns']}>
                                <Button type="primary" className={styles['changeBinding-btn1']} onClick={() => { this.onChangeType(0) }}>取消</Button>
                                <Button type="primary" htmlType="submit">确定</Button>
                            </div>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}