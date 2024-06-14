/**
 * 个人中心-个人信息
 * @author:熊伟
 * @date:2020年8月22日
 * @version:v1.0.0
 * */
import React from 'react';
import styles from './index.less';
import userInfoCache from '@/caches/userInfo';
import { connect } from 'dva';
import { Form, Input, Button, Radio, Select, message, Spin } from 'antd';
import ChangeBinding from './changeBinding.js'
import { PersonalCenter as namespace, Public, Auth } from '@/utils/namespace';
const { Option } = Select;
@connect(state => ({
    myInfoLoading: state[namespace].myInfoLoading
}))
export default class MyInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userRole: 1,//角色控制
            provinceList: [],//省列表
            cityList: [],//市列表
            countyList: [],//县列表
            villageList: [],//xiang列表
            arrAddress: [],//区域数组
            changArr: false,
            areaId: undefined,
            setSex: -1
        }
    }
    componentDidMount() {
        const { dispatch, userInfo } = this.props;
        dispatch({
            type: Public + '/findAreaInfosOpen',
            payload: {
                id: 0
            },
            callback: (result) => {
                result && this.setState({
                    provinceList: result,
                })
            }
        })
        if (userInfo.detailId) {
            let arr = userInfo.detailId.split(",")
            arr.map((item, index) => {
                arr[index] = Number(item);
            })
            arr[0] && this.provinceChange(arr[0], 1);
            arr[1] && this.cityChange(arr[1], 1);
            arr[2] && this.countyChange(arr[2], 1);
            this.setState({
                arrAddress: arr
            })
        }
    }
    UNSAFE_componentWillMount() {
        const { dispatch, userInfo } = this.props;
        if (userInfo.detailId) {
            let arrAddress = userInfo.detailId.split(",");
            arrAddress.map((item, index) => {
                arrAddress[index] = Number(item);
            })
            this.setState({
                arrAddress,
            })
        }
    }
    /**
* 页面组件即将卸载时：清空数据
*/
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };

    }
    getChildenThis = (childenThis) => {
        this.setState({
            childenThis
        })
    }
    //去修改
    goChange = (type) => {
        this.state.childenThis.onChangeType(type)
    }

    /**
     * value 区域id
     * m 掉用的地方：1 挂载前调 
      * //省份变化
      */
    provinceChange = (value, m) => {
        const { dispatch } = this.props;
        //根据省拉市------
        this.setState({
            areaId: value,
            arrAddress: [value]
        })
        if (m != 1) {
            this.setState({
                arrAddress: [value]
            })
        }
        dispatch({
            type: Public + '/findAreaInfosOpen',
            payload: {
                id: value
            },
            callback: (result) => {
                result && this.setState({
                    cityList: result,

                })
            }
        })
    }
    //市变化
    cityChange = (value, m) => {
        const { dispatch } = this.props;
        //根据市拉县-----
        this.setState({
            areaId: value,
        })
        if (m != 1) {
            this.setState({
                arrAddress: [this.state.arrAddress[0], value]
            })
        }
        dispatch({
            type: Public + '/findAreaInfosOpen',
            payload: {
                id: value
            },
            callback: (result) => {
                result && this.setState({
                    countyList: result,
                })
            }
        })
    }
    //县变化village
    countyChange = (value, m) => {
        const { dispatch } = this.props;
        //根据县拉乡------------
        this.setState({
            areaId: value,
        })
        if (m != 1) {
            this.setState({
                arrAddress: [this.state.arrAddress[0], this.state.arrAddress[1], value]
            })
        }
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
    villageChange = (value, option) => {

        //根据县拉乡----------------------------------------------------------------------------------------------------------------
    }
    render() {
        const { provinceList, cityList, countyList, villageList, areaId, arrAddress, setSex } = this.state;
        const { dispatch, myInfoLoading } = this.props;
        const userInfo = userInfoCache() || {};
        const onFinish = (payload) => {
            dispatch({
                type: namespace + '/saveState',
                payload: {
                    myInfoLoading: true,
                },
            });
            dispatch({
                type: namespace + '/updateUserInfo',
                payload: {
                    sex: setSex > -1 ? setSex : null,
                    userName: payload.userName ? payload.userName : null,
                    address: payload.address ? payload.address : null,
                    areaId: areaId ? areaId : null,
                    majorName: payload.majorName ? payload.majorName : null,
                    targetSchool: payload.targetSchool ? payload.targetSchool : null,
                },
                callback: (result) => {
                    !result && message.success('修改成功');
                    // userInfo.sex = payload.sex ? payload.sex : userInfo.sex;
                    // userInfo.userName = payload.userName ? payload.userName : userInfo.userName;
                    // userInfo.address = payload.address ? payload.address : userInfo.address;
                    // userInfo.areaId = payload.areaId ? payload.areaId : userInfo.areaId;
                    userInfoCache.clear();
                    dispatch({
                        type: Auth + '/getSwitchUserInfo',
                        payload: {
                        }
                    })
                }
            })
        }
        return (
            <div className={styles['myInfo']}>
                <Spin spinning={!!myInfoLoading}>
                    <h1>基本信息</h1>
                    <div className={styles['myInfo-form']}>
                        {/* 家长没有学校班级--------------------------------------------------------------------------------------------------- */}
                        <Form
                            onFinish={onFinish}
                        >
                            <Form.Item
                                label="姓&ensp;&ensp;&ensp;&ensp;名"
                                name="userName"
                            >
                                <Input
                                    placeholder={userInfo.userName ? userInfo.userName : '请输入姓名'}
                                    // disabled={userInfo.userName}
                                    className={styles['myInfo-form-input']}
                                    style={{ width: '100px' }}
                                />
                            </Form.Item>
                            <Form.Item
                                label="账&ensp;&ensp;&ensp;&ensp;号"
                            >
                                <p>{userInfo.account}</p>
                            </Form.Item>
                            <Form.Item
                                label="学&ensp;&ensp;&ensp;&ensp;校"
                            >
                                <p>{userInfo.schoolName ? userInfo.schoolName : '无'}</p>
                            </Form.Item>
                            <Form.Item
                                label="班&ensp;&ensp;&ensp;&ensp;级"
                            >
                                <p>{userInfo.className ? userInfo.className : '无'}</p>
                            </Form.Item>
                            {userInfo.studyId == 16 &&userInfo.code=="STUDENT"&&
                                <div>
                                    <Form.Item
                                        label="报考专业"
                                        name="ApplyingDepartment"
                                    >
                                        <Input
                                            placeholder={userInfo.majorName ? userInfo.majorName : '请输入报考专业'}
                                            // disabled={userInfo.userName}
                                            className={styles['myInfo-form-input']}
                                            style={{ width: '100px' }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="报考学校"
                                        name="targetedSchool"
                                    >
                                        <Input
                                            placeholder={userInfo.targetSchool ? userInfo.targetSchool : '请输入报考学校'}
                                            // disabled={userInfo.userName}
                                            className={styles['myInfo-form-input']}
                                            style={{ width: '100px' }}
                                        />
                                    </Form.Item>
                                </div>
                            }
                            {
                                userInfo.sex > -1 ?
                                    <Form.Item
                                        label="性&ensp;&ensp;&ensp;&ensp;别"
                                    >
                                        <Radio.Group
                                            // disabled
                                            name='sex'
                                            defaultValue={userInfo.sex}
                                            onChange={(e) => { this.setState({ setSex: e.target.value }) }}
                                        >
                                            <Radio value={0}>男</Radio>
                                            <Radio value={1}>女</Radio>
                                        </Radio.Group>
                                    </Form.Item> :
                                    <Form.Item
                                        label="性&ensp;&ensp;&ensp;&ensp;别"
                                        name='sex'
                                        onChange={(e) => { this.setState({ setSex: e.target.value }) }}
                                    >
                                        <Radio.Group>
                                            <Radio value={0}>男</Radio>
                                            <Radio value={1}>女</Radio>
                                        </Radio.Group>
                                    </Form.Item>

                            }
                            <Form.Item
                                label="手机号码"
                            >
                                <p>{userInfo.phone}<a onClick={() => { this.goChange(1) }}>&ensp;&ensp;&ensp;&ensp;去修改</a></p>
                            </Form.Item>
                            <Form.Item
                                label="邮&ensp;&ensp;&ensp;&ensp;箱"
                            >
                                <p>{userInfo.eEmail ? userInfo.eEmail : '无'}<a onClick={() => { this.goChange(2) }}>&ensp;&ensp;&ensp;&ensp;去修改</a></p>
                            </Form.Item>
                            {/* <Form.Item
                                label="邀&ensp;请&ensp;码"
                            >
                                <p>{userInfo.ownInviteCode ? userInfo.ownInviteCode : '无'}</p>
                            </Form.Item> */}
                            <Form.Item
                                label="所在城市"
                            >
                                <div className={styles['myInfo-form-Select']}>
                                    <Select
                                        value={arrAddress[0] ? arrAddress[0] : '省'}
                                        // options={provinceList}
                                        onChange={this.provinceChange}
                                    >
                                        {provinceList && provinceList.map(({ name, id }, index) => { return (<Option value={id} key={index}>{name}</Option>) })}
                                    </Select>
                                    <Select
                                        value={arrAddress[1] ? arrAddress[1] : cityList ? '市' : '请先选择省'}
                                        // options={cityList}
                                        onChange={this.cityChange}
                                    >
                                        {cityList && cityList.map(({ name, id }, index) => { return (<Option value={id} key={index}>{name}</Option>) })}
                                    </Select>
                                    <Select
                                        value={arrAddress[2] ? arrAddress[2] : countyList ? '县' : '请先选择市'}
                                        // options={countyList}
                                        onChange={this.countyChange}
                                    >
                                        {countyList && countyList.map(({ name, id }, index) => { return (<Option value={id} key={index}>{name}</Option>) })}
                                    </Select>
                                    {/* <Select
                                        value={arrAddress[3] ? arrAddress[3] : villageList ? '乡/镇' : '请先选择县'}
                                        // options={villageList}
                                        onChange={this.villageChange}
                                    >
                                        {villageList && villageList.map(({ name, id }, index) => { return (<Option value={id} key={index}>{name}</Option>) })}
                                    </Select> */}
                                </div>
                            </Form.Item>
                            <Form.Item
                                label="详细地址"
                                name='address'
                            >
                                <Input
                                    placeholder={userInfo.address ? userInfo.address : '请输入详细地址'}
                                    // disabled={userInfo.address}
                                    className={styles['myInfo-form-input']}
                                    style={{ width: '500px' }}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" style={{ width: '300px' }}>保存</Button>
                            </Form.Item>
                        </Form>
                        <ChangeBinding getChildenThis={(childenThis) => { this.getChildenThis(childenThis) }} userInfo={userInfo} />
                    </div>
                </Spin>
            </div>
        )
    }
}