/**
 * 直播管理添加或编辑
* @author: 张江 
* @date: 2022年04月25日
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
  Cascader,
  DatePicker,
  Progress,
  Switch,
  InputNumber,
  Radio
} from 'antd';
import queryString from 'query-string';
import TcVod from 'vod-js-sdk-v6';
import moment from 'moment';
import { openTypeList, dateFormat, phoneReg, hierarchicalLevelList, editorStartValue, editorEndValue } from "@/utils/const";
import { LiveManage as namespace, QuestionBank, Resource, Public, ClassAndTeacherManage } from '@/utils/namespace';
import { existArr, doHandleYear, objectIsNull } from "@/utils/utils";
import styles from './../index.less';
import userInfoCache from '@/caches/userInfo';
import { InboxOutlined, SearchOutlined } from '@ant-design/icons';
import Editor from '@/components/Editor'



const Option = Select.Option;
const FormItem = Form.Item;
const { Dragger } = Upload;
const { TextArea } = Input;
const describeKeywordNumber = 100;
const videoFileLimitSize = 5120;

@connect(state => ({
  loading: state[namespace].loading,
  subjectAddList: state[QuestionBank].subjectAddList,
  gradeList: state[QuestionBank].gradeList,
  listCurrentGoods: state[namespace].listCurrentGoods,

  findClassInfoBys: state[ClassAndTeacherManage].findClassInfoBys,//班级列表
}))

export default class AddOrEditLiveModal extends React.Component {
  formRef = React.createRef();

  constructor() {
    super(...arguments);
    this.state = {
      videoFile: {},

      fileId: null,
      coverUrl: null,
      videoUploadToken: {},
      uploadToken: {},
      videoUploadProgress: 0,
      isVideoUploadCancel: false,
      gradeCode: '',
      isGradeChange: false,
      describeKeyword: '',
      isCharge: false,
      courseVideoType: 2,
      subjectCode: '',


      posterUrl: '',
      imageFile: {},
      posterImageFile: {},
      cascaderOptions: [],//学校级联数据
    };
  }


  componentDidMount() {
    const { isEdit, item, location, form, gradeList, dispatch } = this.props;
    const { search } = location;
    const query = queryString.parse(search);
    const loginUserInfo = userInfoCache() || {};
    let gradeId = item?.gradeId || loginUserInfo?.gradeId || '';
    console.log(item?.isAddClassViewer)
    if (item?.isAddClassViewer) {
      this.getClassInfoBys(gradeId, loginUserInfo?.schoolId);
      return;
    }
    if (existArr(gradeList) && !gradeId) {
      gradeId = gradeList[gradeList.length - 1].id
    }
    const isCharge = item?.isFree === 0 || item?.isFree === '0' ? true : false;
    this.setState({
      gradeCode: gradeId,
      describeKeyword: item && item?.describe ? item?.describe : '',
      isCharge,
      coverUrl: item?.coverUrl,
      posterUrl: item?.posterUrl,
      // courseVideoType: item && item?.courseVideoType ? item?.courseVideoType : 2,
    })
    this.getSubject(gradeId, 1)

    if (this.formRef && this.formRef.current) {
      this.formRef.current.setFieldsValue({
        subjectId: isEdit ? (item && item.subjectId ? Number(item.subjectId) : undefined) : (query && query.subjectId ? Number(query.subjectId) : undefined),
        gradeId: isEdit ? (item && item.gradeId ? Number(item.gradeId) : undefined) : (gradeId ? Number(gradeId) : undefined),
        describe: isEdit ? (item && item.describe ? item.describe : undefined) : undefined,
        goodsId: isEdit ? (item && item.goodsId && !!isCharge ? Number(item.goodsId) : undefined) : undefined,
      });
    }
    this.getUploadToken();
    //请求区域
    dispatch({
      type: Public + '/getAreaInfoList',
      payload: {},
      callback: (result) => {
        if (result && result.length > 0) {
          this.setState({
            cascaderOptions: result,
          })
        }
      }
    });
    if (!item || !item.id) return;
    dispatch({
      type: namespace + '/getMangeLiveDetail',
      payload: {
        id: item?.id,
      },
      callback: (result) => {
        this.detailRef.setState({
          editorContent: result && result?.describe ? result?.describe.replace(editorStartValue, '').replace(editorEndValue, '') : ''
        })
      }
    });
  }

  isTokenValid = (token) => {
    const currentTime = new Date().getTime();
    if ((token && token.expireAt) && token.expireAt > currentTime) {
      return true
    }
    return false;
  }

  /**
   * 获取文件上传token
   * @returns {*}
   */
  getUploadToken = () => {
    const { dispatch } = this.props;
    dispatch({
      type: Resource + '/getUploadToken',
      payload: {
        bucket: 1,
      },
      callback: (result) => {
        if (result && result.token) {
          this.setState({ uploadToken: result })
        }
      }
    });
    // 获取商品选择
    dispatch({
      type: namespace + '/getListCurrentGoods',
      payload: {
        type: 7
      }
    });
  }

  beforeImageUpload = (file, isPoster) => {
    this.getUploadToken();
    let isValid = this.isCoverImageValid(file);
    if (isValid) {
      this.setState(isPoster ? { imageFile: file } : { imageFile: file })
    }
    return isValid;
  }

  handleImageUploadChange = ({ file }, isPoster) => {
    const { uploadToken } = this.state
    if (file.status === 'done' && file.response) {
      file.status = 'done';
      const imageUrl = uploadToken.domain + file.response.key;
      this.setState(isPoster ? { posterUrl: imageUrl } : { coverUrl: imageUrl })
    }
  };
  /**
   * 检查封面文件是否合法
   */
  isCoverImageValid = (file) => {
    if (!file || !file.name || file.name === '') {
      notification.warn({
        message: '警告信息',
        description: '请上传文件扩展名必须为：jpg,png,jpeg,gif！',
      })
      return false;
    }
    const fileSize = file.size / 1024 / 1024 < 20;
    if (!fileSize) {
      notification.warn({
        message: '警告信息',
        description: `${file.name}文件大小超出20M，请修改后重新上传`,
      })
      return false;
    }
    const fileSuffixA = file.name.split('.');
    const fileSuffix = fileSuffixA[fileSuffixA.length - 1];
    if (!/(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(fileSuffix)) {
      notification.warn({
        message: '警告信息',
        description: '请上传文件扩展名必须为：jpg,png,jpeg,gif！',
      })
      return false;
    }
    return true
  }

  /**
   * 根据年级id 获取科目列表
   * @param gradeId  ：年级id
   * @param type  ：1是第一次
   */
  getSubject = (gradeId, type) => {
    const { dispatch, item, location, form } = this.props;
    const { search } = location;
    const query = queryString.parse(search);
    let tempItem = item ? item : {}
    dispatch({
      type: QuestionBank + '/getSubjectListAdd',
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
          this.setState({
            subjectCode: tempItem.subjectId
          })
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
        }, () => {
          this.formRef.current.setFieldsValue({
            subjectId: tempItem.subjectId,
          });
        })
      }
    });
  }

  /**
   * 选择年级
   * @param gradeCode  ：年级id
   */
  handleGradeChange = (gradeCode) => {
    const { form } = this.props;
    this.formRef.current.setFieldsValue({
      knowIds: undefined,
      versionId: undefined,
    });
    this.setState({
      gradeCode,
      isGradeChange: true,//切换年级 刷新科目
    })
    this.getSubject(gradeCode);
  }

  /**
 * 选择类型
 * @param openType  ：课程类型code
 */
  handleOpenTypeChange = (openType) => {
    const { form } = this.props;
    const { subjectCode } = this.state
    this.formRef.current.setFieldsValue({
      knowIds: undefined,
      versionId: undefined,
    });
    this.setState({
      openType,
    })
  }


  /**
   * 选择科目
   * @param subjectCode  ：科目id
   */
  handleSubjectChange = (subjectCode) => {
    const { dispatch, form, item } = this.props;
    const { courseVideoType } = this.state
    this.formRef.current.setFieldsValue({
      knowIds: undefined,
      versionId: undefined,
    });
    this.setState({
      subjectCode,
    })
    dispatch({
      type: QuestionBank + '/saveState',
      payload: {
        isSubjectChange: true,
      },
    })
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
 * 是否收费
 */
  handleIsCharge = (checked) => {
    const { form } = this.props;
    this.setState({
      isCharge: !!checked,
    })
    if (!checked) {
      this.formRef.current.setFieldsValue({
        goodsId: undefined,
        freeDuration: undefined,
      });
    }
  }

  /**
 * 加载学校数据
 * @param selectedOptions
 */
  loadCascaderData = (selectedOptions) => {
    const { dispatch } = this.props;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    dispatch({// 通过区域id获取学校列表
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

  /**
 * 机构或者学校级联选择
 * @param value ：选择的值
 */
  onCascaderChange = (value, selectedOptions) => {
    const { dispatch, location } = this.props;
    const { search } = location;
    let query = queryString.parse(search);
    query.schoolId = value[value.length - 1];
  };

  /**
 * 获取班级列表
 */
  getClassInfoBys = (gradeId, schoolId) => {
    const { dispatch } = this.props;
    dispatch({
      type: ClassAndTeacherManage + '/findClassInfoBys',
      payload: {
        page: 1,
        size: 1000,
        studyYear: 2020,
        gradeId: 15,
        schoolId: schoolId || 1
      }
    });
  };

  /**
* 获取detailRef
* @param ref
*/
  getDetailRef = (ref) => {
    this.detailRef = ref;
  }


  render() {
    const _that = this;
    const {
      dispatch, location,
      visible, onOk, onCancel, loading, item, subject, gradeList, subjectAddList, isEdit,
      listCurrentGoods,
      findClassInfoBys = {},
    } = this.props;
    let {
      coverUrl,
      changeItem,
      isGradeChange,
      describeKeyword,
      isCharge,

      openType,
      posterUrl,
      imageFile,
      posterImageFile,
      uploadToken,
      cascaderOptions,
    } = _that.state;
    const { search } = location;
    const query = queryString.parse(search);
    const loginUserInfo = userInfoCache() || {};
    const isTeacher = loginUserInfo.code === 'TEACHER';
    const isSchoolAdmin = loginUserInfo.code === 'SCHOOL_ADMIN'
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 },
      },
    };
    const isAddClassViewer = !item?.isAddClassViewer;
    const handleSubmit = (e) => {
      e.preventDefault();
      this.formRef.current.validateFields().then(payload => {
        console.log(payload)
        Object.keys(payload).forEach(key => {
          if (typeof payload[key] === 'undefined') {
            delete payload[key]
          }
        });
        const { editorContent } = this.detailRef.state;
        payload.describe = `${editorStartValue}${editorContent}${editorEndValue}`;
        if (isAddClassViewer) {
          if (payload.name) {
            let name = String(payload.name);
            if (name && name.length > 20) {
              message.warning('名称不能超过20个字符！');
              return;
            }
          }
          if (payload.keyword) {
            const keywordArray = payload.keyword.includes(";") ? payload.keyword.split(';') : payload.keyword.split('；');
            let tempKeywordArray = [];
            let isReturn = false;
            for (let kItem of keywordArray) {
              if (kItem.length > 10) {
                message.warning('单个关键字不能超过10个字符！');
                isReturn = true;
                break;
              } else if (kItem) {
                tempKeywordArray.push(kItem)
              }
            }
            if (tempKeywordArray && tempKeywordArray.length > 3) {
              message.warning('关键词最多不超过3个！');
              return;
            }
            payload.keyword = tempKeywordArray.join(";")
            if (isReturn) {
              return;
            }
          }
          // if (payload.describe) {
          //   let describe = String(payload.describe);
          //   if (describe && describe.length > describeKeywordNumber) {
          //     message.warning(`描述不能超过${describeKeywordNumber}个字符！`);
          //     return;
          //   }
          // }
          if (payload.startTime) {
            payload.startTime = moment(payload.startTime).format(dateFormat)
          }

          // 是否收费
          if (payload.isFree) {//1时免费，0时不免费（收费）
            payload.isFree = 0;
          } else {
            payload.isFree = 1;
            payload.goodsId = '';
          }
          payload.recordFlag = payload.recordFlag ? 1 : 0;
          payload.coverUrl = coverUrl;
          payload.posterUrl = posterUrl;
          // if (!coverUrl && !isEdit) {
          //   message.warning('请先上传封面！');
          //   return;
          // } else if (coverUrl) {
          //   payload.coverUrl = coverUrl;
          // }

          // if (!posterUrl && !isEdit) {
          //   message.warning('请先上传海报！');
          //   return;
          // } else if (posterUrl) {
          //   payload.posterUrl = posterUrl;
          // }

          if (item?.id) {
            payload.id = item.id;
          }
          // if (existArr(payload.schoolId)) {
          //   // payload.schoolId = payload.schoolId.join(',')
          //   payload.schoolId = payload.schoolId[payload.schoolId.length - 1]
          // }
          payload.schoolId = loginUserInfo?.schoolId;
          if (isTeacher) {
            payload.gradeId = item?.gradeId ||loginUserInfo?.gradeId;
            payload.subjectId = item?.subjectId ||loginUserInfo?.subjectId;
            payload.openType = item?.openType||1;
            payload.teacherName = item?.teacherName ||loginUserInfo?.userName;
            payload.teacherPhone = item?.teacherPhone ||loginUserInfo?.phone;
          }
          // openType直播开放类型 1: 全部用户开放，2: 对特定班级开放 ，3：对全部用户和特定班级开放
          if (isSchoolAdmin) {//学校管理员
            payload.openType = item?.openType || 2;
          }
          // payload.describe = describeKeyword;
          dispatch({
            type: namespace + (item?.id ? '/updateLive' : '/saveLive'),
            payload: {
              ...payload,
            },
            callback: (result) => {
              const returnJudge = window.$HandleAbnormalStateConfig(result);
              if (returnJudge && !returnJudge.isContinue) {
                return;
              }
              ;//如果异常 直接返回
              message.success(`直播${isEdit ? '编辑' : "添加"}成功`);
              this.formRef.current.resetFields()
              _that.detailRef.editor.txt.clear()
              onOk(payload)
            }
          });

        } else {
          if (item?.id) {
            payload.liveId = item.id;
          }
          if (existArr(payload.classIds)) {
            payload.classIds = payload.classIds.join(',')
          }
          dispatch({
            type: namespace + '/addClassViewer',
            payload: {
              ...payload,
            },
            callback: (result) => {
              const returnJudge = window.$HandleAbnormalStateConfig(result);
              if (returnJudge && !returnJudge.isContinue) {
                return;
              };//如果异常 直接返回
              message.success(`添加成功`);
              this.formRef.current.resetFields()
              payload.isAddClassViewer = !isAddClassViewer;
              _that.detailRef.editor.txt.clear()
              onOk(payload)
            }
          });
        }
      })

    };

    const uploadImageProps = {
      beforeUpload: (file) => { this.beforeImageUpload(file, false) },
      multiple: false,
      showUploadList: false,
      accept: "image/*",
      onChange: (e) => { this.handleImageUploadChange(e, false) },
      data: { token: uploadToken?.token },
      action: uploadToken?.endPoint
    };

    const uploadPosterImageProps = {
      ...uploadImageProps,
      beforeUpload: (file) => { this.beforeImageUpload(file, true) },
      onChange: (e) => { this.handleImageUploadChange(e, true) },
    }

    // 限制日期
    const disabledDate = (current) => {
      let currentTime = new Date(current);
      currentTime.setDate(currentTime.getDate() + 1);
      return currentTime && currentTime < moment().endOf('day');
    }
    const operLoading = !!loading;
    const imageSize = { width: '100%', height: '240px' };
    return (
      <Modal width="850px" title={isAddClassViewer ? (isEdit ? "编辑直播" : '添加直播') : '添加班级观众'}
        visible={visible}
        onCancel={onCancel}
        closable={!operLoading}

        footer={[
          <Button key='cancel' onClick={onCancel} loading={operLoading}>取消</Button>,
          <Button key='ok' type="primary" onClick={handleSubmit} loading={operLoading}>保存</Button>
        ]}
        confirmLoading={operLoading}
        maskClosable={false}
        keyboard={false}
      >
        <Spin spinning={operLoading} tip={'正在执行中...'}>
          <Form ref={this.formRef}>
            {
              isAddClassViewer ?
                [
                  <Row key={1}>
                    {/* {
                      isEdit ? null :
                        <Col xs={24} sm={12} className={styles['task-modal-col']}>
                          <FormItem label="机构"
                            {...formItemLayout}
                            name={'schoolId'}
                            rules={[{
                              required: true,
                              message: "请选择机构",
                            }]}>
                            <Cascader
                              fieldNames={{ label: 'name', value: 'id', children: 'areas' }}
                              options={cascaderOptions}
                              loadData={this.loadCascaderData}
                              onChange={this.onCascaderChange}
                              placeholder="请选择机构"
                              style={{ width: '100%' }} />
                          </FormItem>
                        </Col>
                    } */}

                    {
                      isTeacher ? null :
                        <Col xs={24} sm={12} className={styles['task-modal-col']}>
                          <FormItem
                            label="年级"
                            {...formItemLayout}
                            name={'gradeId'}
                            rules={[{
                              required: true,
                              message: "请选择年级",
                            }]}
                          >
                            <Select placeholder="请选择年级" style={{ width: '100%' }} onChange={this.handleGradeChange}>
                              {gradeList && gradeList.map(it =>
                                <Option key={it.id} value={it.id}>{it.name}</Option>
                              )}
                            </Select>
                          </FormItem>
                        </Col>
                    }

                    {
                      !isGradeChange && !isTeacher ? <Col xs={24} sm={12} className={styles['task-modal-col']}>
                        <FormItem
                          label="科目"
                          {...formItemLayout}
                          name={'subjectId'}
                          rules={[{
                            required: true,
                            message: "请选择科目",
                          }]}
                        >
                          <Select placeholder="请选择科目" style={{ width: '100%' }} onChange={this.handleSubjectChange}>
                            {subjectAddList && subjectAddList.map(it =>
                              <Option key={it.id} value={Number(it.id)}>{it.name}</Option>
                            )}
                          </Select>
                        </FormItem>
                      </Col> : null
                    }

                    {
                      isTeacher ? null :
                        [<Col key={1} xs={24} sm={12} className={styles['task-modal-col']}>
                          <FormItem label="教师姓名"
                            {...formItemLayout}
                            initialValue={isEdit ? (item && item.teacherName ? item.teacherName : undefined) : undefined}
                            name={'teacherName'}
                            rules={[{
                              required: true,
                              message: "请输入教师姓名",
                            }]}
                          >
                            <Input placeholder="请输入教师姓名" style={{ width: '100%' }} />
                          </FormItem>
                        </Col>,
                        <Col key={2} xs={24} sm={12} className={styles['task-modal-col']}>
                          <FormItem label="教师号码" {...formItemLayout}
                            initialValue={isEdit ? (item && item.teacherPhone ? item.teacherPhone : undefined) : undefined}
                            name={'teacherPhone'}
                            rules={[{
                              required: true,
                              message: "请输入教师手机号",
                            },
                            { pattern: phoneReg, message: '请输入正确的手机号' }
                            ]}
                          >
                            <Input placeholder="请输入教师手机号" style={{ width: '100%' }} />
                          </FormItem>
                        </Col>]
                    }

                    {/* {
                                isEdit ?  */}
                    <Col xs={24} sm={12} className={styles['task-modal-col']}>
                      <FormItem label="直播名称" {...formItemLayout}
                        initialValue={isEdit ? (item && item.name ? item.name : undefined) : undefined}
                        name={'name'}
                        rules={[{
                          required: true,
                          message: "请输入直播名称",
                        }]}
                      >
                        <Input placeholder="请输入直播名称,20个字以内" style={{ width: '100%' }} />
                      </FormItem>
                    </Col>
                    {/* : null
                            } */}

                    {/* <Col xs={24} sm={12} className={styles['task-modal-col']}>
                      <FormItem label="开放类型" {...formItemLayout}
                        initialValue={isEdit ? (item && item.openType ? Number(item.openType) : Number(openTypeList[0].code)) : Number(openTypeList[0].code)}
                        name={'openType'}
                        rules={[{
                          required: true,
                          message: "请选择开放类型",
                        }]}
                      >
                        <Select placeholder="请选择开放类型" style={{ width: '100%' }} onChange={this.handleOpenTypeChange}>
                          {openTypeList.map(it =>
                            <Option key={it.code} value={Number(it.code)}>{it.name}</Option>
                          )}
                        </Select>
                      </FormItem>
                    </Col> */}

                    {/* {
                      isSchoolAdmin ? <Col xs={24} sm={12} className={styles['task-modal-col']}>
                        <FormItem label="直播间ID" {...formItemLayout}
                          initialValue={isEdit ? (item && item.roomId ? item.roomId : undefined) : undefined}
                          name={'roomId'}
                          rules={[{
                            required: true,
                            message: "请输入直播间ID",
                          }]}>
                          <Input placeholder="请输入直播间ID" style={{ width: '100%' }} />
                        </FormItem>
                      </Col> : null
                    } */}

                    {/* <Col xs={24} sm={12} className={styles['task-modal-col']}>
                      <FormItem label="录制回放" {...formItemLayout}
                        initialValue={isEdit ?(item?.recordFlag == 1 ? true : false):true}
                        name={'recordFlag'}
                        rules={[{
                          required: true,
                          message: "是否录制回放",
                        }]}
                      >
                        <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked={isEdit ? (item?.recordFlag == 1 ? true : false) : true} />
                      </FormItem>
                    </Col> */}

                    <Col xs={24} sm={12} className={styles['task-modal-col']}>
                      <FormItem label="开播时间" {...formItemLayout}
                        initialValue={isEdit ? (item && item.startTime ? moment(item.startTime, dateFormat) : undefined) : undefined}
                        name={'startTime'}
                        rules={[{
                          required: true,
                          message: "请选择开播时间",
                        }]}
                      >
                        <DatePicker
                          disabledDate={disabledDate}
                          showTime
                          placeholder="请选择开播时间"
                          style={{ width: '100%' }}
                          format={dateFormat} />

                      </FormItem>
                    </Col>

                    {/* <Col xs={24} sm={12} className={styles['task-modal-col']}>
                      <FormItem label="是否收费" {...formItemLayout}
                        initialValue={isEdit ? (item && item.isFree == 0 ? true : false) : false}
                        name={'isFree'}
                        rules={[{
                          required: true,
                          message: "是否收费",
                        }]}
                      >
                        <Switch checkedChildren="收费" unCheckedChildren="免费" onClick={this.handleIsCharge} defaultChecked={isEdit ? (item?.isFree == 0 ? true : false) : false} />
                      </FormItem>
                    </Col> */}

                    {/* <Col xs={24} sm={12} className={styles['task-modal-col']}>
                      <FormItem label="商品价格" {...formItemLayout}
                        name={'goodsId'}
                        rules={[{
                          required: !!isCharge,
                          message: '请输入商品价格',
                        }]}
                      >
                        < Select placeholder="请选择商品价格" style={{ width: '100%' }} disabled={!isCharge}>
                          {existArr(listCurrentGoods) && listCurrentGoods.map(it =>
                            <Option key={Number(it.id)} value={Number(it.id)}>{it.name}</Option>
                          )}
                        </Select>
                      </FormItem>
                    </Col> */}

                    <Col xs={24} sm={12} className={styles['task-modal-col']}>
                      <FormItem label="直播时长(m)" {...formItemLayout}
                        initialValue={isEdit ? item?.duration : undefined}
                        name={'duration'}
                        rules={[{
                          required: true,
                          message: "请输入直播时长",
                        }]}
                      >
                        <InputNumber placeholder="请输入直播时长,单位分钟(m)" style={{ width: '100%' }} />
                      </FormItem>
                    </Col>
                  </Row>,
                  <Row key={'2'}>
                    <Col xs={24} sm={24}>
                      <FormItem label="关键词"
                        labelCol={{
                          xs: { span: 10 },
                          sm: { span: 3 },
                        }}
                        wrapperCol={{
                          xs: { span: 24 },
                          sm: { span: 20 },
                        }}
                        initialValue={isEdit ? (item && item.keyword ? item.keyword : undefined) : undefined}
                        name={'keyword'}
                        rules={[{
                          required: false,
                          message: "请输入关键词",
                        }]}
                      >
                        <Input placeholder="请输入关键词 多个使用;分割 单个字数不得超多10个字，最多3个关键词；" style={{ width: '100%' }} />
                      </FormItem>
                    </Col>
                  </Row>,
                  <Row key={3}>
                    <Col xs={24} sm={24}>
                      <FormItem label="描述"
                        labelCol={{
                          xs: { span: 10 },
                          sm: { span: 3 },
                        }}
                        wrapperCol={{
                          xs: { span: 24 },
                          sm: { span: 20 },
                        }}
                        name={'describe'}
                        rules={[{
                          required: false,
                          message: "请输入描述",
                        }]}
                      >
                        {/* <TextArea
                          rows="4"
                          maxLength={describeKeywordNumber}
                          placeholder={`请输入描述，字数${describeKeywordNumber}字以内`}
                          style={{ maxWidth: '100%' }}
                          defaultValue={isEdit ? (item && item.describe ? item.describe : undefined) : undefined}
                          onChange={(e) => {
                            this.setState({
                              describeKeyword: e.target.value,
                            })
                          }}
                        />
                        <div className="describe-num-box"><span>{describeKeyword.length}</span> / {describeKeywordNumber}
                        </div> */}
                        <Editor onRef={this.getDetailRef} />
                      </FormItem>
                    </Col>
                  </Row>,
                  <Row key={4}>
                    <Col xs={24} sm={12}>
                      <div className={styles['task-modal-col-micro']}>
                        <label>封面</label>
                        <Dragger {...uploadImageProps}>
                          {
                            coverUrl ? <img alt="example" style={imageSize} src={coverUrl} /> : [
                              <p className="ant-upload-drag-icon" key={1}>
                                <InboxOutlined />
                              </p>,
                              <p className="ant-upload-text" key={2}>点击或将文件拖拽到这里上传</p>,
                              <p className="ant-upload-hint"
                                key={3}
                                style={{ color: imageFile && JSON.stringify(imageFile) !== "{}" ? '#5cb85c' : '' }}>
                                {
                                  JSON.stringify(imageFile) !== "{}" ? `${coverUrl ? '已上传' : '已选择'}文件:${imageFile.name}` : '封面图片大小20M以内，文件扩展名： jpg,png,jpeg,gif'
                                }
                              </p>
                            ]
                          }
                        </Dragger>
                      </div>
                    </Col>

                    <Col xs={24} sm={12}>
                      <div className={styles['task-modal-col-micro']}>
                        <label>海报</label>
                        <Dragger {...uploadPosterImageProps}>
                          {/* <p className="ant-upload-drag-icon">
                      <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
                    <p className="ant-upload-hint"
                      style={{ color: posterImageFile && JSON.stringify(posterImageFile) !== "{}" ? '#5cb85c' : '' }}>
                      {
                        JSON.stringify(posterImageFile) !== "{}" ? `${posterUrl ? '已上传' : '已选择'}文件:${posterImageFile.name}` : '海报图片大小20M以内，文件扩展名： jpg,png,jpeg,gif'
                      }
                    </p> */}
                          {
                            posterUrl ? <img alt="example" style={imageSize} src={posterUrl} /> : [
                              <p className="ant-upload-drag-icon" key={1}>
                                <InboxOutlined />
                              </p>,
                              <p className="ant-upload-text" key={2}>点击或将文件拖拽到这里上传</p>,
                              <p className="ant-upload-hint"
                                key={3}
                                style={{ color: posterImageFile && JSON.stringify(posterImageFile) !== "{}" ? '#5cb85c' : '' }}>
                                {
                                  JSON.stringify(posterImageFile) !== "{}" ? `${posterUrl ? '已上传' : '已选择'}文件:${posterImageFile.name}` : '封面图片大小20M以内，文件扩展名： jpg,png,jpeg,gif'
                                }
                              </p>
                            ]
                          }
                        </Dragger>
                      </div>
                    </Col>
                  </Row>
                ] :
                <Row >
                  <Col xs={24} sm={8} className={styles['task-modal-col']}>
                    <FormItem label="机构-年级" {...formItemLayout}
                      name={'school-gradeId'}

                    >
                      <span>{item.schoolName || ''}{item.gradeName}</span>
                    </FormItem>
                  </Col>
                  <Col xs={24} sm={16} className={styles['task-modal-col']}>
                    <FormItem label="班级观众" {...formItemLayout}
                      name={'classIds'}
                      rules={[{
                        required: true,
                        message: "请选择班级",
                      }]}>
                      <Select placeholder="请选择班级" style={{ width: '100%' }} mode="multiple" maxTagCount='4'>
                        {objectIsNull(findClassInfoBys) && existArr(findClassInfoBys.data) && findClassInfoBys.data.map(it =>
                          <Option key={it.id} value={it.id}>{it.fullName}</Option>
                        )}
                      </Select>
                    </FormItem>
                  </Col>
                </Row>
            }
          </Form>
        </Spin>

      </Modal>
    )
  }
}

