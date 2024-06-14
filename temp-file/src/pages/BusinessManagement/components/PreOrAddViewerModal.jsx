/**
 * 观众人数查看与添加班级观众
* @author: 张江 
* @date: 2022年04月24日
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
  Spin,
  Button,
  message,
  Table,
  Tag
} from 'antd';
import queryString from 'query-string';
import { openTypeList, dateFormat, phoneReg, hierarchicalLevelList } from "@/utils/const";
import { LiveManage as namespace, QuestionBank, Resource, Public, ClassAndTeacherManage } from '@/utils/namespace';
import { existArr, doHandleYear, objectIsNull, dealTimestamp } from "@/utils/utils";
import paginationConfig from "@/utils/pagination";
import styles from './../index.less';
import userInfoCache from '@/caches/userInfo';



const Option = Select.Option;
const FormItem = Form.Item;

@connect(state => ({
  loading: state[namespace].loading,
  findClassInfoBys: state[ClassAndTeacherManage].findClassInfoBys,//班级列表
  liveViewerList: state[namespace].liveViewerList,//分页获取直播观众列表
}))

export default class PreOrAddViewerModal extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      recordPage: 1,
    };
  }


  componentDidMount() {
    const { isEdit, item, location, form, dispatch } = this.props;
    const { search } = location;
    const loginUserInfo = userInfoCache() || {};
    let gradeId = item?.gradeId || loginUserInfo?.gradeId || '';
    //  && loginUserInfo.code == "SCHOOL_ADMIN"
    if (item?.isAddClassViewer) {
      this.getClassInfoBys(gradeId, loginUserInfo?.schoolId);
    }
    this.getPageListViewer(item, 1)

  }

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
        // studyYear: 2020,//doHandleYear()
        gradeId: gradeId,//
        schoolId: schoolId,
      }
    });
  };

  /**
 * 获取观众人数列表
 * @param record 数据信息
 * @param page 页码
 */
  getPageListViewer = (record, page) => {
    const {
      dispatch,
    } = this.props;
    const _self = this;
    _self.setState({
      recordPage: page,
    })
    dispatch({// 
      type: namespace + '/getPageListViewer',
      payload: {
        liveId: record.id,
        page,
        size: 10,
      },
      callback: () => {
      }

    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch({
      type: namespace + '/set',
      payload: {
        liveViewerList: undefined,
      }
    })
    dispatch({
      type: ClassAndTeacherManage + '/set',
      payload: {
        findClassInfoBys: undefined,
      }
    })
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    const _self = this;
    const {
      dispatch, location,
      visible, onOk, onCancel, loading, item, isEdit,
      findClassInfoBys={},
      liveViewerList = {},
    } = this.props;

    let {
      recordPage,
    } = _self.state;
    const { search } = location;
    const query = queryString.parse(search);
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
    const isAddClassViewer = item?.isAddClassViewer;
    const selectedClassInfoArray = objectIsNull(liveViewerList) && existArr(liveViewerList.data) && liveViewerList.data.map(item => String(item.viewerId));
    const handleSubmit = payload => {
      Object.keys(payload).forEach(key => {
        if (typeof payload[key] === 'undefined') {
          delete payload[key]
        }
      });
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
          _self.getPageListViewer(item, 1)
          // payload.isAddClassViewer = isAddClassViewer;
          // onOk(payload)
        }
      });
    };

    const operLoading = !!loading;
    const viewerColumns = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
      },
      {
        title: '观众姓名',
        dataIndex: 'viewerName',
        key: 'viewerName',
      },
      {
        title: '观众类型',
        dataIndex: 'viewerType',
        key: 'viewerType',
        render: (text, record) => (
          <span>{text == 1 ? <Tag color="#67c23a">互动观众</Tag> : <Tag>普通观众</Tag>}</span>
        ),
      },
      {
        title: '观众分类',
        dataIndex: 'viewerCategory',
        key: 'viewerCategory',
        render: (text, record) => (
          <span>{text == 1 ? '个人' : '班级'}</span>
        ),
      },
      {
        title: '参与类型',
        dataIndex: 'joinType',
        key: 'joinType',
        render: (text, record) => (
          <span>{text == 1 ? <Tag color="#67c23a">购买</Tag> : <Tag>赠送</Tag>}</span>
        ),
      },
      {
        title: '观看时间',
        dataIndex: 'viewAtTime',
        key: 'viewAtTime',
        // render: (text) => (<span>{text || '-'}</span>)
        render: (record) => (<span>{record ? dealTimestamp(record, 'YYYY-MM-DD HH:mm:ss') : '-'}</span>)
      },
    ];

    return (
      <Modal width="80vw" title={`${isAddClassViewer ? '查看/添加班级观众' : '查看观众'} - ${item?.name || ''}-${item?.schoolName || ''}-${item?.gradeName}`}
        visible={visible}
        onCancel={onCancel}
        closable={!operLoading}
        footer={null}
        confirmLoading={operLoading}
        maskClosable={false}
        keyboard={false}
      >
        <Spin spinning={operLoading} tip={'正在执行中...'}>
          {
            isAddClassViewer ?
              <Form onFinish={handleSubmit}>
                <Row >
                  {
                    findClassInfoBys.data && liveViewerList.data ? <Col xs={24} sm={18} className={styles['task-modal-col']}>
                      <FormItem label="班级观众" {...formItemLayout}
                        initialValue={existArr(selectedClassInfoArray) ? selectedClassInfoArray : undefined}
                        name={'classIds'}
                        rules={[{
                          required: true,
                          message: "请选择班级",
                        }]}
                      >
                        <Select placeholder="请选择班级" style={{ width: '100%' }} mode="multiple" maxTagCount={3}>
                          {objectIsNull(findClassInfoBys) && existArr(findClassInfoBys.data) && findClassInfoBys.data.map(it =>
                            <Option key={String(it.id)} value={String(it.id)}>{it.fullName}</Option>
                          )}
                        </Select>
                      </FormItem>
                    </Col> : null
                  }

                  <Col xs={24} sm={6} className={styles['task-modal-col']}>
                    <FormItem>
                      {
                        [
                          <Button key='cancel' style={{ marginTop: '4px' }} onClick={onCancel} loading={operLoading}>取消</Button>,
                          <Button key='ok' style={{ marginTop: '4px', marginLeft: '10px' }} type="primary" htmlType="submit" loading={operLoading}>保存</Button>
                        ]
                      }
                    </FormItem>
                  </Col>

                </Row>
              </Form> : null
          }
          <Table
            rowKey='id'
            bordered
            onChange={(pageObj) => { this.getPageListViewer(item, pageObj.current) }}
            pagination={paginationConfig({ s: 10, p: recordPage || 1 }, objectIsNull(liveViewerList) && liveViewerList.total ? liveViewerList.total : 0, undefined, undefined, 'bottomCenter', true)}
            dataSource={objectIsNull(liveViewerList) ? liveViewerList.data : []} columns={viewerColumns} />
        </Spin>

      </Modal>
    )
  }
}

