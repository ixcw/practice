/**
 *@Author:韦靠谱
 *@Description: 配置班主任
 *@Date:Created in  2023/9/1
 *@Modified By:
 */
import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Modal, message, Form, Select } from 'antd';
import { connect } from 'dva';
import userInfoCaches from '@/caches/userInfo'
import { TeacherData as namespace } from '@/utils/namespace';

const AddHeadTeacher = (props) => {
    const { dispatch, handleClassGradeChange } = props;
    const userInfo = userInfoCaches();
    const [form] = Form.useForm();
    const [isAddHeadTeacherOpen, setIsAddHeadTeacherOpen] = useState(false);
    const [ClassGrade, setClassGrade] = useState({});
    const [InstructorList, setInstructorList] = useState([]);

    useEffect(() => {
        if (!isAddHeadTeacherOpen) return
        dispatch({
            type: namespace + '/getClassLeaderListApi',
            payload: {
                schoolId: userInfo.schoolId
            },
            callback: (res) => {
                setInstructorList(res.result?.map(item => {
                    return {
                        value: item.id - 0,
                        label: item.userName,
                        account: item.account,
                    }
                }) || [])
            }
        });
    }, [isAddHeadTeacherOpen])

    // 对下拉框选项进行模糊搜索
    const TitleFilterOption = (input, option) => {
        return (option?.label ? option?.label : '').toLowerCase().includes(input.toLowerCase())
    }

    // 配置弹窗---start---
    useImperativeHandle(props.innerRef, () => ({
        showAddHeadTeacher
    }));
    const showAddHeadTeacher = (params) => {
        setClassGrade(params)
        setIsAddHeadTeacherOpen(true)
    };
    const handleOk = () => {
        form.validateFields().then((values) => {
            dispatch({
                type: namespace + '/configClassLeaderApi',
                payload: {
                    classId: ClassGrade.key,
                    teacherId: values.teacherId
                },
                callback: (res) => {
                    if (res.result === null) {
                        message.success('配置班主任信息成功！')
                    }
                    handleClassGradeChange(ClassGrade)
                    handleCancel()
                    form.resetFields();
                }
            })
        }
        )
    };
    const handleCancel = () => {
        setIsAddHeadTeacherOpen(false);
    };
    // 配置弹窗---end---

    return (
        <>
            <Modal title='配置班主任信息' visible={isAddHeadTeacherOpen} onOk={handleOk} onCancel={handleCancel}>
                <div style={{ margin: '20px 0' }}>班级：{ClassGrade.label}</div>
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{ modifier: 'public' }}
                >
                    <Form.Item name="teacherId" label="班主任" rules={[{ required: true }]} >
                        <Select placeholder='请选择班主任' showSearch optionFilterProp="label" filterOption={TitleFilterOption} options={InstructorList} style={{ width: '100%' }} allowClear />
                    </Form.Item>
                </Form>

            </Modal>

        </>
    );
};
const mapStateToProps = (state) => {
    return {

    }
}
export default connect(mapStateToProps)(AddHeadTeacher)