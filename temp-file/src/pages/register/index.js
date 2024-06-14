/**
 * 注册
 * @author:熊伟
 * @date:2020年8月22日
 * @version:v1.0.0
 * */
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './index.less';
import BackBtns from '@/components/BackBtns/BackBtns'
import { Form, Input, Button, Radio, Select, Upload, message, Progress, Spin } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import queryString from 'query-string';
import YpRiddlerRender from '@/components/YpRiddlerRender/index.js'
import { Auth as namespace, Public } from '@/utils/namespace';
import { phoneReg, passwordReg } from '@/utils/const';
// function getBase64(img, callback) {
//     const reader = new FileReader();
//     reader.addEventListener('load', () => callback(reader.result));
//     reader.readAsDataURL(img);
//   }

// function beforeUpload(file) {
// const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
// if (!isJpgOrPng) {
//     message.error('You can only upload JPG/PNG file!');
// }
// const isLt2M = file.size / 1024 / 1024 < 2;
// if (!isLt2M) {
//     message.error('Image must smaller than 2MB!');
// }
// return isJpgOrPng && isLt2M;
// }
const { Option } = Select;
@connect(state => ({
    loading: state[Public].loading,
    gradeInfos: state[Public].gradeInfos,
    studyList: state[Public].studyList,
    subjectIdList: state[Public].subjectIdList,
    roleList: state[Public].roleList,
    schoolList: state[Public].schoolList,
}))
export default class SetPassword extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            registerSuccess: false,
            registerType: undefined,//注册类型
            //   IdImgFrontloading: false,
            userName: undefined,
            provinceList: [],//省列表
            cityList: [],//市列表
            countyList: [],//县列表
            villageList: [],//xiang列表
            goHomeTime: 50,
            getCodeTime: 0,//验证码获取初始化
        };
    };
    // handleChangeIdImg = info => {console.log(info)
    // if (info.file.status === 'uploading') {
    //     this.setState({ IdImgFrontloading: true });
    //     return;
    // }
    // if (info.file.status === 'done') {
    //     // Get this url from response in real world.
    //     getBase64(info.file.originFileObj, imageUrl =>
    //     this.setState({
    //         imageUrl,
    //         IdImgFrontloading: false,
    //     }),
    //     );
    // }
    // };
    /**
* 用户名输入框改变时：设置Value值+设置获取验证码Button状态
*/
    handleUsername = (e) => {
        this.setState({
            userName: e.currentTarget.value,
            getCodeTime: 0,
        });
        clearInterval(this.setTime);
    }
    /**
 * 页面组件即将卸载时：清空数据
 */
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };

    }
    componentDidMount() {
        const { dispatch } = this.props;
        //获取角色
        dispatch({
            type: Public + '/getRoleInfoByPlatformId',
            payload: {
                platformId: 3
            }
        })
        //获取学段
        dispatch({
            type: Public + '/getStudyList',
            payload: {}
        })
        //获取省
        dispatch({
            type: Public + '/findAreaInfosOpen',
            payload: {
                id: 0
            },
            callback: (result) => {
                result && this.setState({
                    provinceList: result,
                    cityList: [],//市列表
                    countyList: [],//县列表
                    villageList: [],//xiang列表
                })
            }
        })
    }
    render() {
        const { loading, dispatch, studyList, subjectIdList, roleList, location, schoolList, gradeInfos } = this.props;
        const { userName, registerType, imageUrl, registerSuccess, goHomeTime, provinceList, cityList, countyList, villageList, getCodeTime } = this.state;
        const bg = 'https://reseval.gg66.cn/new-loginorregister-bg.png';
        const bg1 = 'https://reseval.gg66.cn/jiazai1.gif';
        const bg2 = 'https://reseval.gg66.cn/new-loginorregister-logobg.png';
        const formLayout = {
            labelCol: {
                xs: { span: 2 },
                sm: { span: 5 },
            },
            // wrapperCol: {
            //     xs: { span: 24 },
            //     sm: { span: 50 },
            // },
        };
        const formItemLayout = {
            // labelCol: {
            //     xs: { span: 2 },
            //     sm: { span: 3 },
            // },
            // wrapperCol: {
            //     xs: { span: 24 },
            //     sm: { span: 12 },
            // },
        };
        //学段改变
        const studySectionChange = (value, options) => {
            this.formRef.current.setFieldsValue({
                subjectId: undefined,
            });
            dispatch({
                type: Public + '/findStudyOrVersion',
                payload: {
                    queryType: 1,
                    studyId: value
                }
            })
            dispatch({
                type: Public + '/getGradeInfos',
                payload: {
                    studyId: value
                }
            })
        }
        //科目
        const subjectSelect = [
            { label: '数学', value: '1' },
            { label: '语文', value: '2' },
            { label: '英语', value: '3' }
        ]
        const onFinish = (payload) => {
            const roleIdandCode = payload.roleId && JSON.parse(payload.roleId)
            dispatch({
                type: namespace + '/saveRegisterUserInfo',
                payload: {
                    phoneNumber: payload.username,
                    roleId: roleIdandCode.id,
                    inviteCode: payload.inviteCode,
                    validateCode: payload.validateCode,
                    password: payload.confirmPassword,
                    code: roleIdandCode.code,
                    studyId: payload.studyId,
                    subjectId: payload.subjectId,
                    gradeId: payload.gradeId,
                    classUniqueCode: payload.classUniqueCode,
                    name: payload.name,
                    jobNumber: payload.jobNumber,
                    studentPhone: payload.studentPhone,
                    schoolId: payload.schoolId,
                },
                callback: (result) => {
                    message.success('注册成功')
                    this.setState({
                        registerSuccess: true
                    }, () => {
                        setTimeout(() => {
                            this.setState({
                                goHomeTime: 100
                            }, () => {
                                setTimeout(() => {
                                    dispatch({
                                        type: namespace + '/login',
                                        payload: {
                                            grant_type: 'password',
                                            username: payload.username,
                                            password: payload.confirmPassword
                                        }
                                    })
                                }, 1000)
                            })
                        }, 1000);
                    })
                }
            })
        }
        //切换注册类型
        const changeRegisterTypes = (value) => {
            this.formRef.current.setFieldsValue({
                subjectId: undefined,
                studyId: undefined,
                classUniqueCode: undefined,
                name: undefined,
                jobNumber: undefined,
                studentPhone: undefined,
                schoolId: undefined,
                gradeId: undefined,
            });
            const registerTypes = JSON.parse(value.target.value);
            this.setState({
                registerType: registerTypes.code,
            })
            dispatch({
                type: Public + '/saveState',
                payload: {
                    gradeInfos: null,
                    subjectIdList: null,
                    schoolList: null,
                }
            })
        }
        // const getCode = (object = {}, next) => {
        //     //--获取验证码
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
            if (userName) {
                dispatch({
                    type: namespace + '/getVerificationCode',
                    payload: {
                        token: object.token,
                        authenticate: object.authenticate,
                        phoneNumber: userName,
                        type: 1
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
        //省份变化
        const provinceChange = (value, option) => {
            //根据省拉市------
            dispatch({
                type: Public + '/findAreaInfosOpen',
                payload: {
                    id: value
                },
                callback: (result) => {
                    result && this.setState({
                        cityList: result,
                        countyList: [],//县列表
                        villageList: [],//xiang列表
                    })
                }
            })
        }
        //市变化
        const cityChange = (value, option) => {
            //根据市拉县-----
            dispatch({
                type: Public + '/findAreaInfosOpen',
                payload: {
                    id: value
                },
                callback: (result) => {
                    result && this.setState({
                        countyList: result,
                        villageList: [],//xiang列表
                    })
                }
            })
        }
        //县变化village
        const countyChange = (value, option) => {
            this.formRef.current.setFieldsValue({
                area: 1,
            });
            //根据县拉乡------------
            dispatch({
                type: Public + '/findAreaInfosOpen',
                payload: {
                    id: value
                },
                callback: (result) => {
                    result && this.setState({
                        villageList: result
                    })
                }
            })
            dispatch({
                type: Public + '/findSchoolByAreaIdsOpen',
                payload: {
                    areaId: value
                }
            })
        }
        const villageChange = (value, option) => {

            //根据县拉乡----------------------------------------------------------------------------------------------------------------
        }
        // const uploadButton = (
        //     <div>
        //       {this.state.IdImgFrontloading ? <LoadingOutlined /> : <PlusOutlined />}
        //       <div className="ant-upload-text"></div>
        //     </div>
        //   );
        return (
            <div className={styles['regisiter']}>

                <div className={styles['regisiter-container']}>
                    <div className={styles['regisiterbg1']} style={{ backgroundImage: 'url(' + bg2 + ' )' }}>

                    </div>
                    {!registerSuccess ?
                        <div className={styles['flex']}>
                            <div className={styles['regisiter-container-main']} >
                                {/* <h1 onClick={() => { dispatch(routerRedux.replace({ pathname: '/' })) }}>{window.$systemTitleName}</h1> */}
                                <p style={{fontSize:'24px',marginTop:'30px'}}>注册</p>
                                <Form
                                    onFinish={onFinish}
                                    {...formLayout}
                                    className={styles['regisiter-container-form']}
                                    id='scroll'
                                    ref={this.formRef}
                                >
                                    <div className={styles['verification']}>
                                    <Form.Item
                                        label="手机号码"
                                        name="username"
                                        className={styles['verificationCode']}
                                        rules={[{ required: true, message: '请输入您的用户名!' }, { pattern: phoneReg, message: '请输入正确的手机号' }]}
                                    >
                                        <Input placeholder="输入用户名" onChange={this.handleUsername} />
                                    </Form.Item>
                                    
                                    {/* <YpRiddlerRender idString='ypridder-register' sendCheckCode={getCode} /> */}
                                        <YpRiddlerRender onRef={(ref) => { this.YpRiddlerRenderRef = ref }} sendCheckCode={getCode} />
                                    <Button
                                        id='ypridder-register'
                                        type="primary"
                                        disabled={getCodeTime == 0 ? false : true}
                                        loading={!!loading}
                                        className={styles['verificationCodebtn']}
                                    // onClick={getCode}
                                            onClick={() => {
                                                getCode({}, 1)
                                            }}
                                    >
                                        获取验证码{getCodeTime !== 0 ? `(${getCodeTime}s)` : ''}
                                    </Button>
                                    {/* {
                                        getCodeTime == 0 ?
                                            <Button className={styles['regisiter-container-form-right']} onClick={getCode} id='ypridder-register'>获取验证码</Button> :
                                            <Button className={styles['regisiter-container-form-right']} style={{ color: 'rgb(51, 51, 51)' }}>获取验证码{getCodeTime !== 0 ? `(${getCodeTime}s)` : ''}</Button>
                                    } */}
                                    </div>
                                    <Form.Item
                                        label="验证码"
                                        name="validateCode"
                                        rules={[{ required: true, message: '请输入验证码!' }]}
                                    >
                                        <Input placeholder="输入验证码" />
                                    </Form.Item>
                                    <Form.Item
                                        label="输入密码"
                                        name='password'
                                        rules={[{ required: true, message: '请输入您的密码!' }, { pattern: passwordReg, message: '请输入6到16位的密码数字字母组合' }]}
                                    >
                                        <Input.Password placeholder="输入密码" />
                                    </Form.Item>
                                    <Form.Item
                                        label="确认密码"
                                        name='confirmPassword'
                                        dependencies={['password']}
                                        rules={[{ required: true, message: '请再输入一次密码!' }, ({ getFieldValue }) => ({
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
                                    <Form.Item
                                        label="邀请码"
                                        name="inviteCode"
                                    // rules={[{ required: true, message: '请输入邀请码!' }]}
                                    >
                                        <Input placeholder="输入邀请码" />
                                    </Form.Item>
                                    {<Form.Item
                                        label="选择角色"
                                        name='roleId'
                                        {...formItemLayout}
                                        rules={[{ required: true, message: '请选择角色!' }]}
                                    >
                                        {roleList ?
                                            <Radio.Group onChange={changeRegisterTypes}>
                                                {roleList.map(({ name, id, code }, index) => { const values = { id, code }; return (<Radio value={JSON.stringify(values)} key={id}>{name}</Radio>) })}
                                            </Radio.Group> :
                                            <Spin />
                                        }
                                    </Form.Item>}
                                    {
                                        registerType === 'TEACHER' || registerType === 'CLASS_HEAD' || registerType === 'GG_GUIDETOPICMEMBER' || registerType === 'GG_QUESTIONBANKADMIN' ?
                                            <div>
                                                <Form.Item
                                                    label="选择学段"
                                                    name="studyId"
                                                    rules={[{ required: true, message: '请选择学段!' }]}
                                                >
                                                    <Select placeholder="请选择学段" onChange={studySectionChange} getPopupContainer={() => document.getElementById('scroll')}>
                                                        {studyList && studyList.map(({ name, id }, index) => { return (<Option value={id} key={id}>{name}</Option>) })}
                                                    </Select>

                                                </Form.Item>
                                                <Form.Item
                                                    label="所教科目"
                                                    name="subjectId"
                                                    rules={[{ required: true, message: '请选择所教科目!' }]}
                                                >
                                                    <Select
                                                        placeholder="请选择科目"
                                                        getPopupContainer={() => document.getElementById('scroll')}
                                                        dropdownRender={(originNode) => subjectIdList ? originNode : <span>请先选择学段</span>}
                                                    >
                                                        {subjectIdList && subjectIdList.map(({ name, id }, index) => { return (<Option value={id} key={id}>{name}</Option>) })}
                                                    </Select>
                                                </Form.Item>
                                            </div> : null
                                    }
                                    {
                                        registerType === 'TEACHER' || registerType === 'CLASS_HEAD' ?
                                            <div>
                                                <Form.Item
                                                    label="加入班级"
                                                    name="classUniqueCode"
                                                >
                                                    <div>
                                                        <Input placeholder="输入班级口令" />
                                                        <p style={{ fontSize: '12px', }}>注：请联系班主任或者管理员拿班级唯一口令</p>
                                                    </div>
                                                </Form.Item>

                                                <Form.Item
                                                    label="姓名"
                                                    name="name"
                                                // rules={[{ required: true, message: '请输入姓名!' }]}
                                                >
                                                    <Input placeholder="输入姓名" />
                                                </Form.Item>
                                                <Form.Item
                                                    label="工号"
                                                    name="jobNumber"
                                                >
                                                    <Input placeholder="输入工号" />
                                                </Form.Item>
                                            </div> :
                                            registerType === 'STUDENT' ?
                                                <div>
                                                    <Form.Item
                                                        label="加入班级"
                                                        name="classUniqueCode"
                                                    >
                                                        <div>
                                                            <Input placeholder="输入班级口令" />
                                                            <p style={{ fontSize: '12px', }}>注：请联系班主任或者管理员拿班级唯一口令</p>
                                                        </div>
                                                    </Form.Item>
                                                    <Form.Item
                                                        label="姓名"
                                                        name="name"
                                                    // rules={[{ required: true, message: '请输入姓名!' }]}
                                                    >
                                                        <Input placeholder="输入姓名" />
                                                    </Form.Item>
                                                </div> :
                                                registerType === 'PARENT' ?
                                                    <div>
                                                        <Form.Item
                                                            label="关联学生账号"
                                                            name="studentPhone"
                                                        >
                                                            <div>
                                                                <Input placeholder="输入关联学生账号/手机号" />
                                                                {/* <p style={{ fontSize: '12px', }}>注：请联系班主任或者管理员拿班级唯一口令</p> */}
                                                            </div>
                                                        </Form.Item>
                                                        <Form.Item
                                                            label="姓名"
                                                            name="name"
                                                        >
                                                            <Input placeholder="输入姓名" />
                                                        </Form.Item>
                                                    </div> :
                                                    registerType === 'SCHOOL_ADMIN' ?
                                                        <div style={{ width: '100%' }}>
                                                            <Form.Item
                                                                label="所在地区"
                                                                {...formItemLayout}
                                                                name="area"
                                                                rules={[{ required: true, message: '请选择完整地区!' }]}
                                                            >
                                                                <div style={{ width: '100%', display: 'flex' }}>
                                                                    <Select
                                                                        defaultValue={'省'}
                                                                        // options={provinceList}
                                                                        onChange={provinceChange}
                                                                        getPopupContainer={() => document.getElementById('scroll')}
                                                                    >
                                                                        {provinceList && provinceList.map(({ name, id }, index) => { return (<Option value={id} key={index}>{name}</Option>) })}
                                                                    </Select>
                                                                    <Select
                                                                        defaultValue={cityList ? '市' : '请先选择省'}
                                                                        // options={cityOptions}cityList
                                                                        onChange={cityChange}
                                                                        getPopupContainer={() => document.getElementById('scroll')}
                                                                    >
                                                                        {cityList && cityList.map(({ name, id }, index) => { return (<Option value={id} key={index}>{name}</Option>) })}
                                                                    </Select>
                                                                    <Select
                                                                        defaultValue={countyList ? '县' : '请先选择市'}
                                                                        // options={countyOptions}
                                                                        onChange={countyChange}
                                                                        getPopupContainer={() => document.getElementById('scroll')}
                                                                    >
                                                                        {countyList && countyList.map(({ name, id }, index) => { return (<Option value={id} key={index}>{name}</Option>) })}
                                                                    </Select>
                                                                    {/* <Select
                                                                        defaultValue={villageList ? '乡/镇' : '请先选择县'}
                                                                        // options={villageOptions}villageList
                                                                        onChange={villageChange}
                                                                    >
                                                                        {villageList && villageList.map(({ name, id }, index) => { return (<Option value={id} key={index}>{name}</Option>) })}
                                                                    </Select> */}
                                                                </div>
                                                            </Form.Item>
                                                            <Form.Item
                                                                label="选择学校"
                                                                name="schoolId"
                                                                rules={[{ required: true, message: '请选择学校!' }]}
                                                            >
                                                                <Select
                                                                    placeholder="选择学校"
                                                                    getPopupContainer={() => document.getElementById('scroll')}
                                                                    dropdownRender={(originNode) => schoolList ? originNode : <span>请先选择地区</span>}
                                                                >
                                                                    {schoolList && schoolList.map(({ name, id }, index) => { return (<Option value={id} key={id}>{name}</Option>) })}
                                                                </Select>
                                                            </Form.Item>
                                                            <Form.Item
                                                                label="姓名"
                                                                name="name"
                                                            >
                                                                <Input placeholder="输入姓名" />
                                                            </Form.Item>
                                                            <Form.Item
                                                                label="工号"
                                                                name="jobNumber"
                                                            >
                                                                <div>
                                                                    <Input placeholder="输入工号" />
                                                                    <p style={{ fontSize: '12px', }}>提示：提交成功后，可以浏览部分功能，后台需要审核，才可以使用学校管理员的相关权限。</p>
                                                                </div>
                                                            </Form.Item>
                                                        </div> :
                                                        registerType === 'GG_GUIDETOPICMEMBER' || registerType === 'GG_QUESTIONBANKADMIN' ?
                                                            <div>
                                                                <Form.Item
                                                                    label="选择年级"
                                                                    name="gradeId"
                                                                // rules={[{ required: true, message: '请选择年级!' }]}
                                                                >
                                                                    <Select
                                                                        placeholder="选择年级"
                                                                        getPopupContainer={() => document.getElementById('scroll')}
                                                                        dropdownRender={(originNode) => gradeInfos ? originNode : <span>请先选择学段</span>}
                                                                    >
                                                                        {gradeInfos && gradeInfos.map(({ name, id }, index) => { return (<Option value={id} key={id}>{name}</Option>) })}
                                                                    </Select>
                                                                </Form.Item>
                                                            </div> : null
                                    }
                                    {
                                        registerType &&
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit" style={{ position: 'absolute',width:'200px', left: '50%',marginLeft:'-100px' }}>下一步</Button>
                                        </Form.Item>
                                    }
                                </Form>
                            </div>
                        </div> :
                        <div className={styles['flex']}>
                            <div className={styles['regisiter-container-success']} style={{ backgroundImage: 'url(' + bg1 + ')' }}>

                                <Progress percent={goHomeTime} showInfo={false} className={styles['progress']} />
                                <div className={styles['regisiter-container-success-p']}>
                                    <p>注册成功，正在跳转首页...</p>
                                    <Spin />
                                </div>
                            </div>
                        </div>

                    }
                    <BackBtns
                        isBack={true}
                        styles={{ bottom: '100px', right: '300px' }}
                    />
                    <div className={styles['regisiter-bg']} style={{ backgroundImage: 'url(' + bg + ')' }} />
                </div>
            </div>
        )
    }
}
