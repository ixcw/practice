/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2021/5/13
 *@Modified By:
 */

// eslint-disable-next-line
import React from 'react';
import {connect} from "dva";
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
  Icon,
  message,
  Cascader
} from 'antd';
import queryString from 'query-string';
import {particularYear, difficultyType, testPaperType, paperMangeTypeList, jurisdiction} from "@/utils/const";
import {QuestionBank as namespace, Public} from '@/utils/namespace';
import {InboxOutlined} from '@ant-design/icons';
import styles from "../dataEmbody.less";
import {existArr} from "@/utils/utils";

const Option = Select.Option;
const FormItem = Form.Item;
const {Dragger} = Upload;

@connect(state => ({
  loading: state[namespace].loading,
  subjectAddList: state[namespace].subjectAddList,
  gradeList: state[Public].gradeList,//获取年级
  highestKnowledgeAddList: state[namespace].highestKnowledgeAddList,// 一级知识点
  highestKnowledgeList: state[namespace].highestKnowledgeList,// 一级知识点
  categoryList: state[namespace].categoryList,// 题型列表
  getAreaInfoList: state[Public].getAreaInfoList,//学校
  addBookVersionList: state[namespace].addBookVersionList,// 版本列表
  isSubjectChange: state[namespace].isSubjectChange,
  isKnowledgeChange: state[namespace].isKnowledgeChange,
  allProvinceList: state[Public].allProvinceList,// 所有省份列表
}))

export default class ImportExamText extends React.Component {
  formRef = React.createRef();

  constructor() {
    super(...arguments);
    this.state = {
      file: {},
      gradeCode: '',
      isGradeChange: false,
      cascaderOptions: [],//学校级联数据
      paperTypeCode: 0,
    };
  }

  // UNSAFE_componentWillMount() {
  //   const {dispatch, location} = this.props;
  //   const {search} = location;
  //   const query = queryString.parse(search);
  //   if (query && query.gradeId) {
  //     this.setState({
  //       gradeCode: query.gradeId
  //     })
  //     this.getSubject(query.gradeId, 1)
  //   }
  // }

  static getDerivedStateFromProps(prevProps, prevState) {
    const {getAreaInfoList} = prevProps;
    const {cascaderOptions: cascaderOptionsState} = prevState;
    if (JSON.stringify(getAreaInfoList) !== JSON.stringify(cascaderOptionsState)) {
      return {cascaderOptions: getAreaInfoList}
    }
    return null
  }

  componentDidMount() {
    const {isEdit, item, location} = this.props;
    const form = this.formRef;
    const {search} = location;
    const query = queryString.parse(search);
    if (form) {
      this.setState({
        paperTypeCode: item && item.paperTypeCode,
      })
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
        this.setState({file})
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
    const {dispatch, item, location} = this.props;
    const form = this.formRef;
    const {search} = location;
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
          if (tempItem.subjectId && type == 1) {
          } else {
            if (query.gradeId == gradeId) {
              tempItem.subjectId = Number(query.subjectId) || result[0].id;
            } else {
              tempItem.subjectId = result[0].id;
            }
          }
          this.getTextbookVersionList(tempItem.subjectId)
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
    const {dispatch, gradeList, location, item} = this.props;
    const {gradeCode} = this.state;
    const {search} = location;
    const query = queryString.parse(search);
    let changeItem = item ? item : {}
    let payloadData = {
      subjectId,
      // studyId: parentId,
      // gradeId: gradeCode
    }

    dispatch({
      type: Public + '/getAllProvinceList'
    })
    dispatch({
      type: namespace + '/getTextbookVersionAdd',
      payload: payloadData,
      callback: (result) => {
        if (result && result.length > 0) {
          let versionArray = changeItem && changeItem.version_id ? changeItem.version_id.split(',').map(it => Number(it)) : [];
          if (versionArray.length > 0) {
          } else {
            let tempResult = result[0]
            versionArray.push(tempResult.id);
            if (tempResult && tempResult.childList && tempResult.childList.length > 0) {
              versionArray.push(tempResult.childList[0].id);
            }
          }
          changeItem.versionId = versionArray;
          // this.getKnowledge(versionArray[versionArray.length - 1]);
        } else {
          changeItem.versionId = [];
          changeItem.version_id = '';
          changeItem.know_id = '';
          // dispatch({
          //     type: namespace + '/saveState',
          //     payload: {
          //         addVersionKnowledgePointsList: [],
          //     },
          // })

        }
      }
    });
  }


  /**
   * 选择年级
   * @param gradeCode  ：年级id
   */
  handleGradeChange = (gradeCode) => {
    const form = this.formRef.current;
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
    const {dispatch} = this.props;
    const form = this.formRef.current;
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
    const {dispatch} = this.props;
    const form = this.formRef.current;
    // this.getKnowledge(versionId[versionId.length - 1]);
  }
  /**
   * 获取当前年份
   */
  doHandleYear = () => {
    let myDate = new Date();
    let tYear = myDate.getFullYear();
    return tYear;
  }

  /**
   * 选择试卷类型 2021年01月20日
   * @param paperTypeCode  ：试卷类型code
   */
  handlePaperTypeChange = (paperTypeCode) => {
    this.setState({
      paperTypeCode,
    })
  }


  render() {
    const _that = this;
    const {
      dispatch, location,
      visible, onOk, onCancel, loading, item, subject, gradeList, subjectAddList, highestKnowledgeAddList, highestKnowledgeList, categoryList, isEdit,

      // addVersionKnowledgePointsList = [],
      addBookVersionList = [],
      // bookVersionList = [],
      isSubjectChange,
      isKnowledgeChange,
      allProvinceList = []
    } = this.props;
    let tempAddBookVersionList = addBookVersionList && addBookVersionList.length > 0 ? addBookVersionList : []
    let {file, changeItem, isGradeChange, paperTypeCode, cascaderOptions} = _that.state;
    const unitTypeCode = 2;
    const {search} = location;
    const query = queryString.parse(search);
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
    };
    const _subjectAddList = existArr(subjectAddList);//是否存在年级

    const handleSubmit = (e) => {
      e.preventDefault();
      this.formRef.current.validateFields().then(payload => {
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

        if (Array.isArray(payload.schoolId) && payload.schoolId.length > 0) {
          payload.schoolId = payload.schoolId[payload.schoolId.length - 1]
        }
        if (payload.paperType == 2) {//单元试卷
          payload.type = 5;
        }
        if (!payload.provinceId) {
          message.warning('请选择省份');
          return;
        }
        onOk(payload)
      })
    };
    const uploadProps = {
      beforeUpload: this.handleReturn,
      multiple: false,
      showUploadList: false,
    };

    /**
     * 加载学校数据
     * @param selectedOptions
     */
    const loadCascaderData = (selectedOptions) => {
      const targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true;
      // 通过区域id获取学校列表
      dispatch({
        type: Public + '/getSchoolListByAreaId',
        payload: {
          areaId: targetOption.id,
        },
        callback: (result) => {
          targetOption.loading = false;
          targetOption.areas = []
          if (result && result.length > 0) {
            targetOption.areas = result;
          }
          this.setState({
            cascaderOptions: [...this.state.cascaderOptions],
          });
        }
      });
    };
    return (
      <Modal width="850px" title={isEdit ? "修改任务参数" : '导入试卷文档'}
             visible={visible}
             onCancel={onCancel}
             onOk={handleSubmit}
             okText={'保存'}
             cancelText="取消"
             confirmLoading={!!loading}
             maskClosable={false}
      >
        <Spin spinning={!!loading} tip={'正在执行中...'}>
          <Form ref={this.formRef}>
            <Row>
              <Col xs={24} sm={10} style={{height: '65px'}}>
                <FormItem label="学校"
                          name='schoolId'
                          {...formItemLayout}
                          rules={[{
                            required: true,
                            message: "请选择学校.",
                          }]}
                >
                  <Cascader
                    fieldNames={{label: 'name', value: 'id', children: 'areas'}}
                    options={cascaderOptions}
                    loadData={loadCascaderData}
                    placeholder="请选择学校"
                    style={{width: '90%'}}/>
                </FormItem>

              </Col>

              <Col xs={24} sm={10} style={{height: '65px'}}>
                <FormItem label="年级"
                          name='gradeId'
                          {...formItemLayout}
                          rules={[{
                            required: true,
                            message: "请选择年级.",
                          }]}
                >
                  <Select placeholder="请选择年级" style={{width: '90%'}} onChange={this.handleGradeChange}>
                    {gradeList && gradeList.map(it =>
                      <Option key={it.id} value={it.id}>{it.name}</Option>
                    )}
                  </Select>
                </FormItem>
              </Col>

              {
                !isGradeChange ? <Col xs={24} sm={10} style={{height: '65px'}}>
                  <FormItem label="科目" {...formItemLayout}
                            name='subjectId'
                            rules={[{
                              required: true,
                              message: '请选择科目',
                            }]}
                  >
                    <Select disabled={!_subjectAddList} placeholder="请选择科目" style={{width: '90%'}}
                            onChange={this.handleSubjectChange}>
                      {subjectAddList && subjectAddList.map(it =>
                        <Option key={it.id} value={Number(it.id)}>{it.name}</Option>
                      )}
                    </Select>
                  </FormItem>
                </Col> : null
              }

              <Col xs={24} sm={10} style={{height: '65px'}}>
                <FormItem
                  name='provinceId'
                  label="省份" {...formItemLayout}
                  rules={[{
                    required: true,
                    message: '请选择省份',
                  }]}
                >

                  <Select disabled={!_subjectAddList} placeholder="请选择省份" style={{width: '90%'}}>
                    {allProvinceList.map(it =>
                      <Option key={it.id} value={it.id}>{it.name}</Option>
                    )}
                  </Select>
                </FormItem>
              </Col>

              {/* {
                                !isSubjectChange ? */}
              <Col xs={24} sm={10} style={{height: '65px'}}>
                <FormItem
                  name='versionId'
                  label="版本" {...formItemLayout}
                  rules={[{
                    required: true,
                    message: '请选择版本',
                  }]}
                >
                  <Cascader
                    disabled={!_subjectAddList}
                    onChange={this.handleVersionChange}
                    style={{width: '90%'}}
                    fieldNames={{label: 'name', value: 'id', children: 'childList'}}
                    options={tempAddBookVersionList}
                    placeholder="请选择版本"
                  />
                </FormItem>
              </Col>

              <Col xs={24} sm={10} style={{height: '65px'}}>
                <FormItem name='yearId' label="年份" {...formItemLayout}
                          rules={[{
                            required: true,
                            message: '请选择年份',
                          }]}
                          initialValue={isEdit ? (item && item.yearId ? Number(item.yearId) : this.doHandleYear()) : this.doHandleYear()}
                >
                  <Select placeholder="请选择年份" style={{width: '90%'}}>
                    {particularYear.map(it =>
                      <Option key={it.code} value={it.code}>{it.name}</Option>
                    )}
                  </Select>
                </FormItem>
              </Col>

              {/* 2021年01月20日添加试卷类型选择 */}
              {
                isEdit ? null :
                  <Col xs={24} sm={10} style={{height: '65px'}}>
                    <FormItem name='type' label="试卷类型" {...formItemLayout}
                              rules={[{
                                required: true,
                                message: '请选择试卷类型',
                              }]}
                              initialValue={isEdit ? (item && item.paperTypeCode ? Number(item.paperTypeCode) : paperMangeTypeList[0].code) : paperMangeTypeList[0].code}
                    >
                      <Select placeholder="请选择试卷类型" style={{width: '90%'}} onChange={this.handlePaperTypeChange}>
                        {paperMangeTypeList.map(it =>
                          <Option key={it.code} value={it.code}>{it.name}</Option>
                        )}
                      </Select>
                    </FormItem>
                  </Col>

              }
            </Row>

            <Row>
              {/* 2021年01月20日添加单元名称输入框判断选择样式 */}
              <Col xs={24} sm={10} style={{height: '65px'}}>
                <FormItem
                  rules={[{
                    required: true,
                    message: '类型',
                  }]}
                  initialValue={isEdit ? (item && item.type ? Number(item.type) : undefined) : testPaperType[0].code}
                  name='flag' label="类型" {...formItemLayout}>
                  <Radio.Group>
                    {testPaperType.map(it =>
                      < Radio key={it.code} value={it.code}> {it.name}</Radio>
                    )}
                  </Radio.Group>
                </FormItem>
              </Col>
              <Col xs={24} sm={10} style={{height: '65px'}}>
                <FormItem
                  rules={[{
                    required: true,
                    message: '权限'
                  }]}
                  initialValue={3}
                  name='isPrivate' label="权限" {...formItemLayout}>
                  <Radio.Group>
                    {jurisdiction.map(it =>
                      < Radio key={it.code} value={it.code}> {it.name}</Radio>
                    )}
                  </Radio.Group>
                </FormItem>
              </Col>

            </Row>
            {
              isEdit ? null : <Row>
                <Col xs={24} sm={24}>
                  <Alert
                    message="注意事项"
                    description="上传文件的大小不能超过20M,且文件扩展名必须是：.docx,文件内容请按相应的规则书写。"
                    type="info"
                    showIcon
                    style={{marginBottom: '8PX'}}
                  />
                  <div>
                    <Dragger {...uploadProps}>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined/>
                      </p>
                      <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
                      <p className="ant-upload-hint" style={{color: JSON.stringify(file) !== "{}" ? '#5cb85c' : ''}}>
                        {
                          JSON.stringify(file) !== "{}" ? `已选择文件:${file.name}` : '文件扩展名： docx'
                        }
                      </p>
                    </Dragger>

                  </div>
                </Col>
              </Row>
            }

          </Form>
        </Spin>

      </Modal>
    )
  }
}
