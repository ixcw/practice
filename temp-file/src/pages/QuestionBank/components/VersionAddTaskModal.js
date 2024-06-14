/**
 * 题库管理任务参数修改弹框-版本题库
 * @author:张江
 * @date:2020年08月06日
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
    Button,
    Upload,
    message,
    Cascader
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import queryString from 'query-string';
import { particularYear, difficultyType, questionType } from "@/utils/const";
import { QuestionBank as namespace } from '@/utils/namespace';
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

    addBookVersionList: state[namespace].addBookVersionList,// 版本列表
    bookVersionList: state[namespace].bookVersionList,// 一级知识点
    addVersionKnowledgePointsList: state[namespace].addVersionKnowledgePointsList,// 版本章节知识点列表
    isSubjectChange: state[namespace].isSubjectChange,
    isKnowledgeChange: state[namespace].isKnowledgeChange,
}))

export default class AddTaskModal extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            file: {},
            gradeCode: '',
            isGradeChange: false,
        };
    }

    UNSAFE_componentWillMount() {
        const { dispatch, location } = this.props;
        const { search } = location;
        const query = queryString.parse(search);
        if (query && query.gradeId) {
            this.setState({
                gradeCode: query.gradeId
            })
            this.getSubject(query.gradeId, 1)
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
        const { dispatch, item, location } = this.props;
        const { search } = location;
        const query = queryString.parse(search);
        let tempItem = item ? item : {}
        dispatch({
            type: namespace + '/getSubjectListAdd',
            payload: {
                gradeId,
            },
            callback: (result) => {
                // if (type == 1) {//第一次进来不调用
                //     this.getTextbookVersionList(tempItem.subjectId)
                //     return;
                // }
                if (result && result.length > 0) {
                    if (tempItem.subjectId && type == 1) { } else {
                        if (query.gradeId == gradeId) {
                            tempItem.subjectId = query.subjectId || result[0].id;
                        } else {
                            tempItem.subjectId = result[0].id;
                        }
                    }
                } else {//如果没有科目数据 全部置空
                    tempItem.subjectId = undefined;
                    tempItem.know_id = undefined;
                    dispatch({
                        type: namespace + '/saveState',
                        payload: {
                            addBookVersionList: [],
                        },
                    })
                }
                this.setState({
                    changeItem: tempItem,
                    isGradeChange: false
                })
            }
        });
    }

    /**
* 根据 科目id 获取版本列表
* @param subjectId  ：科目id
*/
    getTextbookVersionList = (subjectId) => {
        const { dispatch, gradeList, location, item } = this.props;
        const { gradeCode } = this.state;
        const { search } = location;
        const query = queryString.parse(search);
        let changeItem = item ? item : {}
        let payloadData = {
            subjectId,
            // studyId: parentId,
            // gradeId: gradeCode
        }
        dispatch({
            type: namespace + '/getTextbookVersionAdd',
            payload: payloadData,
            callback: (result) => {
                if (result && result.length > 0) {
                    let versionArray = changeItem && changeItem.version_id ? changeItem.version_id.split(',').map(it => Number(it)) : [];
                    if (versionArray.length > 0) { } else {
                        let tempResult = result[0]
                        versionArray.push(tempResult.id);
                        if (tempResult && tempResult.childList && tempResult.childList.length > 0) {
                            versionArray.push(tempResult.childList[0].id);
                        }
                    }
                    changeItem.versionId = versionArray;
                    this.getKnowledge(versionArray[versionArray.length - 1]);
                } else {
                    changeItem.versionId = [];
                    changeItem.version_id = '';
                    changeItem.know_id = '';
                    dispatch({
                        type: namespace + '/saveState',
                        payload: {
                            addVersionKnowledgePointsList: [],
                        },
                    })
                }
            }
        });
    }

    /**
* 根据 版本id 获取大知识点列表
* @param versionId  ：科目id
*/
    getKnowledge = (version) => {
        const { dispatch, gradeList, item } = this.props;
        const { gradeCode } = this.state;
        let tempItem = item ? item : {}
        dispatch({
            type: namespace + '/saveState',
            payload: {
                isKnowledgeChange: true,
            },
        })
        let payloadData = {
            version,
        }
        dispatch({
            type: namespace + '/getVersionKnowledgePointsAdd',
            payload: payloadData,
            callback: (result) => {
                if (result && result.length > 0) {
                } else {
                    tempItem.know_id = '';
                    dispatch({
                        type: namespace + '/saveState',
                        payload: {
                            addVersionKnowledgePointsList: [],
                        },
                    })

                }
                this.setState({
                    changeItem: tempItem,
                })
            }
        });
    }
    /**
    * 根据 科目id 年级id 获取大知识点列表
    * @param subjectId  ：科目id
    */
    // getKnowledge = (subjectId) => {
    //     const { dispatch, gradeList, location, item } = this.props;
    //     const { gradeCode } = this.state;
    //     const { search } = location;
    //     const query = queryString.parse(search);
    //     let gradeId = gradeCode;
    //     let changeItem = item ? item:{};
    //     if (!gradeCode) {
    //         gradeId = query.gradeId;
    //         this.setState({
    //             gradeCode: gradeId,
    //         })
    //     }
    //     let parentId = '';
    //     dispatch({// 获取题型列表
    //         type: namespace + '/getCategoryList',
    //         payload: {
    //             subjectId,
    //         },
    //         callback: (result) => {
    //             if (result && result.length > 0) {
    //                 changeItem.category = result[0].id;
    //             } else {
    //                 changeItem.category = undefined;
    //             }
    //             this.setState({
    //                 changeItem
    //             })
    //         }
    //     });
    //     for (let item of gradeList) {
    //         if (item.id == gradeId) {
    //             parentId = item.parentId;
    //             break
    //         }
    //     }
    //     let payloadData = {
    //         subjectId,
    //         studyId: parentId
    //     }
    //     dispatch({
    //         type: namespace + '/getHighestKnowledgeAdd',
    //         payload: payloadData,
    //         callback: (result) => {
    //             if (result && result.length > 0) {
    //                 changeItem.knowId = result[0].id;
    //             } else {
    //                 changeItem.knowId = undefined;
    //             }
    //             this.setState({
    //                 changeItem
    //             })

    //         }
    //     });
    // }

    /**
    * 选择年级
    * @param gradeCode  ：年级id
    */
    handleGradeChange = (gradeCode) => {
        this.setState({
            gradeCode,
            isGradeChange: true,//切换年级 刷新科目
        })
        this.getSubject(gradeCode);
    }

    /**
    * 选择科目
    * @param subjectCode  ：科目id
    */
    handleSubjectChange = (subjectCode) => {
        const { dispatch } = this.props;
        dispatch({
            type: namespace + '/saveState',
            payload: {
                isSubjectChange: true,
            },
        })
        this.getTextbookVersionList(subjectCode);
    }

    /**
* 选择版本
* @param versionId  ：版本id
*/
    handleVersionChange = (versionId) => {
        this.getKnowledge(versionId[versionId.length - 1]);
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

            addVersionKnowledgePointsList = [],
            addBookVersionList = [],
            bookVersionList = [],
            isSubjectChange,
            isKnowledgeChange
        } = this.props;
        let tempAddBookVersionList = addBookVersionList && addBookVersionList.length > 0 ? addBookVersionList : bookVersionList
        let { file, changeItem, isGradeChange } = _that.state;
        const { search } = location;
        const query = queryString.parse(search);
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
            // payload.type=4;
            payload.categoryCode = 0;
            if (Array.isArray(payload.versionId) && payload.versionId.length > 0) {
                payload.versionId = payload.versionId[payload.versionId.length - 1]
            }
            if (Array.isArray(payload.knowId) && payload.knowId.length > 0) {
                payload.knowId = payload.knowId[payload.knowId.length - 1]
            } else {
                message.warning('请选择章节知识点');
                return;
            }
            onOk(payload)
        };
        return (
            <Modal width="850px" title={isEdit ? "修改任务参数" : '导入试题文档'}
                visible={visible}
                onCancel={onCancel}
                confirmLoading={!!loading}
                footer={null}
            >
                <Spin spinning={!!loading} tip={'正在执行中...'}>
                    <Form onFinish={onSubmitFinish}>
                        <Row>
                            <Col xs={24} sm={10} className={styles['task-modal-col']}>
                                <FormItem
                                    label="年级"
                                    {...formItemLayout}
                                    name="gradeId"
                                    initialValue={isEdit ? (item && item.gradeId ? Number(item.gradeId) : undefined) : (query && query.gradeId ? Number(query.gradeId) : undefined)}
                                    rules={[{
                                        required: true,
                                        message: "请选择年级"
                                    }]}
                                >
                                    <Select placeholder="请选择年级" style={{ width: '90%' }} onChange={this.handleGradeChange}>
                                        {gradeList && gradeList.map(it =>
                                            <Option key={it.id} value={it.id}>{it.name}</Option>
                                        )}
                                    </Select>
                                </FormItem>
                            </Col>
                            {
                                !isGradeChange ? <Col xs={24} sm={10} className={styles['task-modal-col']}>
                                    <FormItem
                                        label="科目"
                                        {...formItemLayout}
                                        name="subjectId"
                                        initialValue={isEdit ? (item && item.subjectId ? Number(item.subjectId) : undefined) : (query && query.subjectId ? Number(query.subjectId) : undefined)}
                                        value={changeItem && changeItem.subjectId ? Number(changeItem.subjectId) : undefined}
                                        rules={[{
                                            required: true,
                                            message: "请选择科目"
                                        }]}
                                    >
                                        <Select placeholder="请选择科目" style={{ width: '90%' }} onChange={this.handleSubjectChange}>
                                            {subjectAddList && subjectAddList.map(it =>
                                                <Option key={it.id} value={it.id}>{it.name}</Option>
                                            )}
                                        </Select>
                                    </FormItem>
                                </Col> : null
                            }


                            {
                                !isSubjectChange ?
                                    <Col xs={24} sm={10} className={styles['task-modal-col']}>
                                        <FormItem
                                            label="版本"
                                            {...formItemLayout}
                                            name="versionId"
                                            initialValue={isEdit ? (item && item.version_id ? item.version_id.split(',').map(it => Number(it)) : []) : []}
                                            value={changeItem && changeItem.version_id ? item.version_id.split(',') : []}
                                            rules={[{
                                                required: true,
                                                message: "请选择版本"
                                            }]}
                                        >

                                            <Cascader
                                                onChange={this.handleVersionChange}
                                                style={{ width: '90%' }}
                                                fieldNames={{ label: 'name', value: 'id', children: 'childList' }}
                                                options={tempAddBookVersionList}
                                                placeholder="请选择版本"
                                            />
                                        </FormItem>
                                    </Col> : null
                            }
                            {
                                !isKnowledgeChange ?
                                    <Col xs={24} sm={10} className={styles['task-modal-col']}>
                                        <FormItem
                                            label="章节知识"
                                            {...formItemLayout}
                                            name="knowId"
                                            initialValue={isEdit ? (item && item.know_id ? item.know_id.split(',').map(it => Number(it)) : []) : []}
                                            value={changeItem && changeItem.know_id ? item.know_id.split(',') : []}
                                            rules={[{
                                                required: true,
                                                message: "请选择章节知识"
                                            }]}
                                        >

                                            <Cascader
                                                style={{ width: '90%' }}
                                                fieldNames={{ label: 'name', value: 'id', children: 'childList' }}
                                                options={addVersionKnowledgePointsList}
                                                placeholder="请选择章节知识点"
                                            />
                                        </FormItem>
                                    </Col> : null
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

                        {
                            isEdit ? null : <div>

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

