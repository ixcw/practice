/**
 * 个人中心-我的班级
 * @author:熊伟
 * @date:2020年8月22日
 * @version:v1.0.0
 * */
import React from 'react';
import { connect } from "dva";
import styles from './index.less';
import { PersonalCenter as namespace, Public } from "@/utils/namespace";
import { Button, Modal, Input, Form, Select, message,Empty } from 'antd';
import { getSubjectInfo } from '@/services/topicManage';
const { Option } = Select;
@connect(state => ({
    loading: state[namespace].loading,
    classInfo: state[namespace].classInfo,
    selectSubjectList: state[Public].selectSubjectList,
}))
export default class MyClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            code: ''
        }
    }
    componentDidMount() {
        const { dispatch, userInfo = {} } = this.props;
        //获取班级列表
        dispatch({
            type: namespace + '/saveState',
            payload: {
                myClassLoading: true,
            },
        });
        dispatch({
            type: namespace + '/findMyClassInfo',
            payload: {},
        })
    }
    render() {
        const { visible, code } = this.state;
        const { userInfo = {}, classInfo, selectSubjectList, dispatch } = this.props; console.log(selectSubjectList)
        const onFinish = (payload) => {
            //加入班级
            dispatch({
                type: namespace + '/userAddClassInfo',
                payload: {
                    code: payload.code,
                    subjectId: payload.subjectId ? payload.subjectId : null,
                },
                callback: (result) => {
                    console.log('result', result)
                    if (result === '操作成功') {
                        message.success('操作成功');
                        this.setState({
                            visible: false
                        })
                        dispatch({
                            type: namespace + '/findMyClassInfo',
                            payload: {},
                        })
                    } else {
                        message.warning(result.alert)
                    }

                }
            })
        }
        const clickGetSubjectInfo = () => {
            if (code) {
                dispatch({
                    type: Public + '/getSubjectByClassCode',
                    payload: {
                        classCode: code,
                    }
                })
            } else {
                message.warning('请先输入班级口令')
            }

        }
        return (
            <div className={styles['myClass']}>
                <div className={styles['myClass-head']}>
                    <p>我的班级</p>
                    <Button type="primary" className={styles['myClass-head-btn']} onClick={() => { this.setState({ visible: true }) }}>加入班级</Button>
                </div>
                <div className={styles['myClass-content']}>
                    {
                        classInfo? classInfo.map(({ schoolName, name, id, isHeadTeacher, subjectName }, index) => {
                            return (
                                <div className={styles['myClass-content-main']} key={index}>
                                    {
                                        userInfo.code === 'STUDENT' ?
                                            <h1>{userInfo.classId == id ? '当前班级' : '历史班级'}</h1> :
                                            userInfo.code === 'TEACHER' ?
                                                <h1>{isHeadTeacher ? '班主任('+ subjectName + ')': subjectName + '老师'}</h1> : null
                                    }
                                    <div className={styles['myClass-content-p']}>
                                        <p>{schoolName}</p>
                                        <p className={styles['myClass-content-p1']} title={name}>{name}</p>
                                    </div>
                                </div>
                            )
                        })
                        :
                        <Empty 
                            description={
                                <span>
                                    您未加入班级<a onClick={() => { this.setState({ visible: true }) }}>点击加入</a>
                                </span>
                            }
                        />
                    }
                    <Modal
                        title='加入班级'
                        footer={null}
                        centered
                        destroyOnClose={true}
                        onCancel={() => { this.setState({ visible: false }) }}
                        width='350px'
                        visible={visible}
                    >
                        <Form
                            onFinish={onFinish}
                        >
                            <p className={styles['myClass-content-modal-p']}>输入班级口令</p>
                            <Form.Item
                                name='code'
                                rules={[{ required: true, message: '请输入班级口令!' }]}
                            >
                                <Input placeholder='请输入班级口令' onChange={(e) => { this.setState({ code: e.target.value }) }}  onBlur={clickGetSubjectInfo} ></Input>
                            </Form.Item>
                            <p style={{ color: '#999999' }}>注：请联系班主任或者管理员拿班级唯一口令</p>
                            {
                                userInfo.code && userInfo.code === "TEACHER" &&
                                <div>
                                    <p className={styles['myClass-content-modal-p']}>选择任教科目（输入班级口令后获取）</p>
                                    <Form.Item
                                        name='subjectId'
                                        rules={[{ required: true, message: '请选择任教科目!' }]}
                                    >
                                        <Select
                                            placeholder='请选择任教科目'
                                        >
                                            {
                                                selectSubjectList && selectSubjectList.map(({ id, name }, index) => {
                                                    return (
                                                        <Option value={id} key={index}>{name}</Option>
                                                    )
                                                })

                                            }
                                        </Select>
                                    </Form.Item>
                                </div>
                            }
                            <Button type='primary' htmlType="submit" style={{ width: '100%' }}>加入班级</Button>
                        </Form>
                    </Modal>
                </div>
            </div>
        )
    }
}