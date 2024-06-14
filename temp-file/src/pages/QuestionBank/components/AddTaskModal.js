/**
 * 题库管理任务参数修改弹框
 * @author:张江
 * @date:2019年11月23日
 * @version:v1.0.0
 * */

// eslint-disable-next-line
import React from 'react';
import { connect } from "dva";
import {
    Form,
    Modal,
    Select,
    Col,
    Row,
    notification,
    Input,
    Spin,
    Alert,
    Radio,
    Upload,
    // Icon,
    message,
    Button,
    Switch
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import queryString from 'query-string';
import { particularYear, difficultyType, questionType, paperQuestionFlag } from "@/utils/const";
import { QuestionBank as namespace } from '@/utils/namespace';
import questionBankParamCache from '@/caches/questionBankParam';
import classNames from 'classnames';

import styles from './../index.less';

const Option = Select.Option;
const FormItem = Form.Item;
const { Dragger } = Upload;

@connect(state => ({
    loading: state[namespace].loading,
    subjectAddList: state[namespace].subjectAddList,
    gradeList: state[namespace].gradeList,
    highestKnowledgeAddList: state[namespace].highestKnowledgeAddList,// 一级知识点
    highestKnowledgeList: state[namespace].highestKnowledgeList,// 一级知识点
    categoryList: state[namespace].categoryList,// 题型列表
}))

export default class AddTaskModal extends React.Component {

    formRef = React.createRef();

    constructor() {
        super(...arguments);
        this.state = {
            file: {},
            gradeCode: '',
            isGradeChange: false,

            isSelectCategoryCode: true,
        };
    }

    // UNSAFE_componentWillMount() {
    // const { dispatch, location } = this.props;
    // const { search } = location;
    // const query = queryString.parse(search);
    // if (query && query.gradeId) {
    //     this.setState({
    //         gradeCode: query.gradeId
    //     })
    //     this.getSubject(query.gradeId)
    // }
    // }

    componentDidMount() {
        const { dispatch, isEdit, item = {}, location } = this.props;
        const { search } = location;
        const query = queryString.parse(search) || {};
        const questionBankParam = questionBankParamCache() || {};

        dispatch({
            type: namespace + '/saveState',
            payload: {
                highestKnowledgeAddList: [],
                subjectAddList: [],
                categoryList: []
            },
        })
        if ((query && query.gradeId) || (item && item.gradeId) || (questionBankParam && questionBankParam.gradeId)) {
            let gradeId = query.gradeId || questionBankParam.gradeId;
            if (item && item.gradeId) {
                gradeId = item.gradeId;
            }

            this.setState({
                gradeCode: gradeId
            })
            this.getSubject(gradeId, 1)
        }
        if (this.formRef && this.formRef.current) {
            this.formRef.current.setFieldsValue({
                // subjectId: isEdit ? (item && item.subjectId ? Number(item.subjectId) : undefined) : (query && query.subjectId ? Number(query.subjectId) : undefined),
                // gradeId: isEdit ? (item && item.gradeId ? Number(item.gradeId) : undefined) : (questionBankParam && questionBankParam.gradeId ? Number(questionBankParam.gradeId) : undefined),
                subjectId: isEdit ? (item && item.subjectId ? Number(item.subjectId) : undefined) : (questionBankParam && questionBankParam.subjectId ? Number(questionBankParam.subjectId) : undefined),
                knowId: isEdit ? (item && item.knowId ? Number(item.knowId) : undefined) : (query && query.knowId ? Number(query.knowId) : undefined),
                categoryCode: isEdit ? (item && item.category ? Number(item.category) : undefined) : undefined
            });
        }
    }

    //接收file对象
    handleReturn = (file) => {
        if (JSON.stringify(file) === "{}") {
            notification.warn({
                message: '警告信息',
                description: '请先上传文件！',
            })
            return
        }
        const fileSize = file.size / 1024 / 1024 < 20;
        if (!fileSize) {
            notification.warn({
                message: '警告信息',
                description: `${file.name}文件大小超出20M，请修改后重新上传`,
            })
            return;
        }
        if (JSON.stringify(file) !== "{}" && file.name) {
            const fileSuffixA = file.name.split('.');
            const fileSuffix = fileSuffixA[fileSuffixA.length - 1];
            if (fileSuffix === 'docx') {
                this.setState({ file })
            } else {
                notification.warn({
                    message: '警告信息',
                    description: '请上传文件扩展名必须为：docx！',
                })
            }
        }
    };
    /**
    * 根据年级id 获取科目列表
    * @param gradeId  ：年级id
    * @param type  ：1是第一次
    */
    getSubject = (gradeId, type) => {
        const { dispatch, item } = this.props;
        let tempItem = item ? item : {}
        const questionBankParam = questionBankParamCache() || {};
        dispatch({
            type: namespace + '/getSubjectListAdd',
            payload: {
                gradeId,
            },
            callback: (result) => {
                // if (type == 1) {//第一次进来不调用
                //     return;
                // }
                if (result && result.length > 0) {
                    if (type == 1) {//第一次进来不调用
                        tempItem.subjectId = tempItem.subjectId || questionBankParam.subjectId || result[0].id;
                    } else {
                        tempItem.subjectId = result[0].id;
                    }
                    // if (!tempItem.subjectId) {
                    // tempItem.subjectId = result[0].id;
                    // }
                    this.getKnowledge(tempItem.subjectId)
                } else {//如果没有科目数据 全部置空
                    tempItem.subjectId = undefined;
                    tempItem.category = undefined;
                    tempItem.knowId = undefined;
                    dispatch({
                        type: namespace + '/saveState',
                        payload: {
                            highestKnowledgeAddList: [],
                        },
                    })
                }
                this.setState({
                    changeItem: tempItem,
                    isGradeChange: false
                }, () => {
                    this.formRef.current.setFieldsValue({
                        subjectId: tempItem.subjectId,
                    });
                })
            }
        });
    }

    /**
    * 根据 科目id 年级id 获取大知识点列表
    * @param subjectId  ：科目id
    */
    getKnowledge = (subjectId) => {
        const { dispatch, gradeList, location, item } = this.props;
        const { gradeCode } = this.state;
        const { search } = location;
        const query = queryString.parse(search);
        let gradeId = gradeCode;
        let changeItem = item ? item : {};
        if (!gradeCode) {
            gradeId = query.gradeId;
            this.setState({
                gradeCode: gradeId,
            })
        }
        let parentId = '';
        dispatch({// 获取题型列表
            type: namespace + '/getCategoryList',
            payload: {
                subjectId,
            },
            // callback: (result) => {
            //     if (result && result.length > 0) {
            //         changeItem.category = result[0].id;
            //     } else {
            //         changeItem.category = undefined;
            //     }
            //     this.setState({
            //         changeItem
            //     })
            // }
        });
        for (let item of gradeList) {
            if (item.id == gradeId) {
                parentId = item.parentId;
                break
            }
        }
        let payloadData = {
            subjectId,
            studyId: parentId
        }
        dispatch({
            type: namespace + '/getHighestKnowledgeAdd',
            payload: payloadData,
            // callback: (result) => {
            //     if (result && result.length > 0) {
            //         changeItem.knowId = result[0].id;
            //     } else {
            //         changeItem.knowId = undefined;
            //     }
            //     this.setState({
            //         changeItem
            //     })

            // }
        });
    }

    /**
    * 选择年级
    * @param gradeCode  ：年级id
    */
    handleGradeChange = (gradeCode) => {
        this.setState({
            gradeCode,
            isGradeChange: true,//切换年级 刷新科目
        })
        this.formRef.current.setFieldsValue({
            knowId: undefined,
            categoryCode: undefined,
            gradeId: gradeCode
        });
        this.getSubject(gradeCode);
    }

    /**
    * 选择科目
    * @param subjectCode  ：科目id
    */
    handleSubjectChange = (subjectCode) => {
        this.formRef.current.setFieldsValue({
            knowId: undefined,
            categoryCode: undefined,
            subjectId: subjectCode
        });
        this.getKnowledge(subjectCode);
    }

    /**
* 获取当前年份
*/
    doHandleYear = () => {
        let myDate = new Date();
        let tYear = myDate.getFullYear();
        return tYear;
    }

    render() {
        const _that = this;
        const {
            dispatch, location,
            visible, onOk, onCancel, loading, item, subject, gradeList, subjectAddList, highestKnowledgeAddList, highestKnowledgeList, categoryList, isEdit,
        } = this.props;
        let tempHighestKnowledgeList = highestKnowledgeAddList ? highestKnowledgeAddList : highestKnowledgeList
        let { file, changeItem, isGradeChange, isSelectCategoryCode } = _that.state;
        const { search } = location;
        const query = queryString.parse(search);
        const questionBankParam = questionBankParamCache() || {};
        const paperQuestionFlags = paperQuestionFlag.filter(it => it.importTypes.includes(1))
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        const uploadProps = {
            beforeUpload: this.handleReturn,
            multiple: false,
            showUploadList: false,
        };
        const onSubmitFinish = payload => {
            console.log('Received values of form: ', payload);
            Object.keys(payload).forEach(key => {
                if (typeof payload[key] === 'undefined') {
                    delete payload[key]
                }
            });
            if (isEdit) {

            } else {
                if (JSON.stringify(file) === "{}") {
                    message.warning('请先上传文件！');
                    return;
                } else if (JSON.stringify(file) !== "{}") {
                    payload.file = file;
                }
            }
            if (item && item.id) {
                payload.jobId = item.id;
            }
            if (!isSelectCategoryCode) {
                payload.categoryCode = 0;
            }
            payload.importType = query.questionBankType;
            questionBankParamCache({
                gradeId: payload.gradeId,
                subjectId: payload.subjectId
            })
            onOk(payload)
        };

        const selecttypeChange = (e) => {
            this.setState({
                isSelectCategoryCode: !!e,
            })
        }
        return (
            <Modal width="850px" title={isEdit ? "修改任务参数" : '导入试题文档'}
                visible={visible}
                onCancel={onCancel}
                maskClosable={false}
                // onOk={handleSubmit}
                // okText={'保存'}
                // cancelText="取消"
                confirmLoading={!!loading}
                footer={null}
            >
                <Spin spinning={!!loading} tip={'正在执行中...'}>
                    <Form onFinish={onSubmitFinish} ref={this.formRef}>
                        <Row>
                            <Col xs={24} sm={10} className={styles['task-modal-col']}>
                                <FormItem
                                    label="年级"
                                    name="gradeId"
                                    {...formItemLayout}
                                    initialValue={isEdit ? (item && item.gradeId ? Number(item.gradeId) : undefined) : (questionBankParam && questionBankParam.gradeId ? Number(questionBankParam.gradeId) : undefined)}
                                    rules={[{
                                        required: true,
                                        message: "请选择年级."
                                    }]}>
                                    <Select placeholder="请选择年级" style={{ width: '90%' }} onChange={this.handleGradeChange}>
                                        {gradeList && gradeList.map(it =>
                                            <Option key={it.id} value={it.id}>{it.name}</Option>
                                        )}
                                    </Select>
                                </FormItem>
                            </Col>
                            {
                                !isGradeChange ?
                                    <Col xs={24} sm={10} className={styles['task-modal-col']}>
                                        <FormItem
                                            label="科目"
                                            {...formItemLayout}
                                            name="subjectId"
                                            //  initialValue={isEdit ? (item && item.subjectId ? Number(item.subjectId) : undefined) : (query && query.subjectId ? Number(query.subjectId) : undefined)}
                                            rules={[{
                                                required: true,
                                                message: "请选择科目."
                                            }]}
                                        >
                                            <Select placeholder="请选择科目" style={{ width: '90%' }} onChange={this.handleSubjectChange}>
                                                {subjectAddList && subjectAddList.map(it =>
                                                    <Option key={it.id} value={it.id}>{it.name}</Option>
                                                )}
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    : null
                            }


                            {/* {
                                !loading ? */}
                            <Col xs={24} sm={10} className={styles['task-modal-col']}>
                                <FormItem
                                    label="大类知识点"
                                    {...formItemLayout}
                                    name="knowId"
                                    initialValue={isEdit ? (item && item.knowId ? Number(item.knowId) : undefined) : (query && query.knowId ? Number(query.knowId) : undefined)}
                                    rules={[{
                                        required: true,
                                        message: "请选择大类知识点"
                                    }]}
                                >
                                    <Select placeholder="请选择大类知识点" style={{ width: '90%' }}>
                                        {tempHighestKnowledgeList && tempHighestKnowledgeList.map(it =>
                                            <Option key={it.id} value={it.id}>{it.name}</Option>
                                        )}
                                    </Select>
                                </FormItem>
                            </Col>
                            {/* : null
                            } */}



                            <Col xs={24} sm={10} className={styles['task-modal-col']}>
                                <FormItem
                                    label="难度"
                                    {...formItemLayout}
                                    name="difficulty"
                                    initialValue={isEdit ? (item && item.difficulty ? item.difficulty : undefined) : difficultyType[0].name}
                                    rules={[{
                                        required: true,
                                        message: "请选难度."
                                    }]}
                                >
                                    <Select placeholder="请选难度" style={{ width: '90%' }}>
                                        {difficultyType.map(it =>
                                            <Option key={it.code} value={it.name}>{it.name}</Option>
                                        )}
                                    </Select>
                                </FormItem>
                            </Col>

                            {/* {
                                !loading ? */}
                            {/* <Col xs={24} sm={10} className={styles['task-modal-col']}>
                                <FormItem
                                    label="题型"
                                    {...formItemLayout}
                                    name="categoryCode"
                                    initialValue={isEdit ? (item && item.category ? Number(item.category) : undefined) : undefined}
                                    // value={changeItem && changeItem.category ? Number(changeItem.category) : undefined}
                                    rules={[{
                                        required: true,
                                        message: "请选择题型"
                                    }]}
                                >
                                    <Select placeholder="请选择题型" style={{ width: '90%' }}>
                                        {categoryList && categoryList.map(it =>
                                            <Option key={it.id} value={it.id}>{it.name}</Option>
                                        )}
                                    </Select>

                                </FormItem>
                            </Col> */}
                            {/* : null
                            } */}
                            {
                                isEdit && item && !item.category ?
                                    null :

                                    <Col xs={24} sm={10} className={classNames(styles['task-modal-col'], isEdit ? '' : 'select-switch')}>
                                        {
                                            isSelectCategoryCode ?
                                                <FormItem label="题型" {...formItemLayout} name='categoryCode' rules={[{
                                                            required: true,
                                                            message: "请选择题型.",
                                                        }]}>
                                                        <Select placeholder="请选择题型" style={{ width: '90%' }} allowClear>
                                                            {categoryList && categoryList.map(it =>
                                                                <Option key={it.id} value={it.id}>{it.name}</Option>
                                                            )}
                                                        </Select>
                                                     </FormItem> :
                                                <FormItem label="题型" {...formItemLayout} name="selecttype" value={0}
                                                >
                                                        <Select placeholder="题型自动获取" value={0} disabled style={{ width: '90%' }}>
                                                            {[{ id: 0, name: '题型自动获取' }].map(it =>
                                                                <Option key={it.id} value={it.id}>{it.name}</Option>
                                                            )}
                                                        </Select>
                                                </FormItem>
                                        }
                                        {
                                            isEdit ? null :
                                                <Switch
                                                    checkedChildren="开"
                                                    unCheckedChildren="关"
                                                    defaultChecked
                                                    onChange={selecttypeChange}
                                                />
                                        }

                                    </Col>


                            }

                            <Col xs={24} sm={10} className={styles['task-modal-col']}>
                                <FormItem
                                    label="年份"
                                    {...formItemLayout}
                                    name="yearId"
                                    initialValue={isEdit ? (item && item.yearId ? Number(item.yearId) : this.doHandleYear()) : this.doHandleYear()}
                                    rules={[{
                                        required: true,
                                        message: "请选择年份"
                                    }]}
                                >
                                    <Select placeholder="请选择年份" style={{ width: '90%' }}>
                                        {particularYear.map(it =>
                                            <Option key={it.code} value={it.code}>{it.name}</Option>
                                        )}
                                    </Select>

                                </FormItem>
                            </Col>
                        </Row>

                        {/* <Row>
                            <Col xs={24} sm={12} style={{
                                position: 'relative',
                                left: '-22px'
                            }}>
                                <FormItem
                                    label="类型"
                                    {...formItemLayout}
                                    name="paperFlag"
                                    initialValue={isEdit ? (item && item.paperFlag ? Number(item.paperFlag) : undefined) : questionType[questionType.length - 1].code}
                                    rules={[{
                                        required: true,
                                        message: "请选择类型"
                                    }]}
                                >
                                    <Radio.Group>
                                        {questionType.map(it =>
                                            < Radio key={it.code} value={it.code} > {it.name}</Radio>
                                        )}
                                    </Radio.Group>
                                </FormItem>
                            </Col>
                        </Row> */}
                        <Row>
                            {paperQuestionFlags.length > 0 ?
                                <Col xs={24} sm={12} style={{
                                    position: 'relative',
                                    left: '-22px'
                                }} className={styles['task-modal-col']}>
                                    <FormItem 
                                        name="paperFlag"
                                    label="试卷/题目标识" {...formItemLayout}
                                        initialValue={isEdit ? (item && item.paperFlag ? Number(item.paperFlag) : undefined) : paperQuestionFlags[paperQuestionFlags.length - 1].code}
                                        rules={[{
                                            required: true,
                                            message: '试卷/题目标识不能为空',
                                        }]}
                                    >
                                        <Radio.Group>
                                            {paperQuestionFlags.map(it =>
                                                < Radio key={it.code} value={it.code} > {it.name}</Radio>
                                            )}
                                        </Radio.Group>
                                    </FormItem>
                                </Col> : null}

                            {/* <Col xs={24} sm={12} style={{
                                position: 'relative',
                                left: '-60px'
                            }} className={styles['task-modal-col']}>
                                <FormItem label="分层层级" {...formItemLayout}>
                                    {getFieldDecorator('evalLevel', {
                                        initialValue: isEdit ? (item && item.evalLevel ? Number(item.evalLevel) : undefined) : hierarchicalLevelList[hierarchicalLevelList.length - 1].code,
                                        rules: [{
                                            required: true,
                                            message: '分层层级',
                                        }],
                                    })(
                                        <Radio.Group>
                                            {hierarchicalLevelList.map(it =>
                                                < Radio key={it.code} value={it.code} > {it.name}</Radio>
                                            )}
                                        </Radio.Group>
                                    )}
                                </FormItem>
                            </Col> */}

                        </Row>
                        {
                            isEdit ? null : <div style={{ marginTop: 8 }}>
                                <Alert
                                    message="注意事项"
                                    description="上传文件的大小不能超过20M,且文件扩展名必须是：.docx,文件内容请按相应的规则书写。"
                                    type="info"
                                    showIcon
                                    style={{ marginBottom: '8PX' }}
                                />
                                <Dragger {...uploadProps}>
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined />
                                    </p>
                                    <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
                                    <p className="ant-upload-hint" style={{ color: JSON.stringify(file) !== "{}" ? '#5cb85c' : '' }}>
                                        {
                                            JSON.stringify(file) !== "{}" ? `已选择文件:${file.name}` : '文件扩展名： docx'
                                        }
                                    </p>
                                </Dragger>
                            </div>
                        }

                        <div className='task-form-oper'>
                            <Button key={1} loading={!!loading} onClick={onCancel}>
                                取消
                            </Button>
                            <FormItem key="submit"> <Button type="primary" htmlType="submit" loading={!!loading}>
                                保存
                            </Button>
                            </FormItem>
                        </div>

                    </Form>
                </Spin>

            </Modal>
        )
    }
}

