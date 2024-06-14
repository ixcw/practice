/**
 *@Author:ChaiLong
 *@Description: 配置教师
 *@Date:Created in  2020/6/24
 *@Modified By:
 */
import React from 'react'
import {connect} from "dva";
import {Drawer, Button, Form, Select, Popconfirm, message} from 'antd';
import styles from './actionTeacher.less';
import {ClassAndTeacherManage as namespace, QuestionBank} from "@/utils/namespace";
import userInfoCaches from '@/caches/userInfo'
import {PlusOutlined,CloseCircleOutlined} from '@ant-design/icons'

const {Option} = Select;
const FormItem = Form.Item;
@connect(state => ({
  findTeacherSubjectInfo: state[namespace].findTeacherSubjectInfo,//当前教师的科目
}))
export default class ActionTeacher extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(...arguments);
    this.state = {
      modalData: {},
      drawerVisible: false,
      childrenDrawer: false
    }
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  /**
   * 配置开关
   * @param state 0:关 1:开
   * @returns {function(...[*]=)}
   */
  controllerPermission = (state, record) => {
    const {dispatch, query} = this.props;
    const  userInfo=userInfoCaches();
    //关闭modal重置form
    if (!state) {
      this.setState({drawerVisible: false, fileList: [], modalData: {}, dataArr: []});
      return null
    }
    this.setState({drawerVisible: true, modalData: record || {}});
    dispatch({
      type: namespace + '/findTeacherSubjectInfo',
      payload: {
        schoolId: userInfo.schoolId,
        teacherId: record.id
      },
      callback: (re) => {
        this.setState({dataArr: re})
      }
    });
  };

  /**
   * 保存教师科目
   * @param e
   */
  saveClassAndSbj = (e) => {
    const {dispatch, query} = this.props;
    const {modalData} = this.state;
    const  userInfo=userInfoCaches();
    e.preventDefault();
    this.formRef.current.validateFields().then(values=>{
        dispatch({
          type: namespace + '/configTeacher',
          payload: {
            schoolId: userInfo.schoolId,
            classId: values.classId,
            teacherId: modalData.id,
            subjectId: values.subjectId
          },
          callback: () => {
            dispatch({
              type: namespace + '/findTeacherSubjectInfo',
              payload: {
                schoolId: userInfo.schoolId,
                teacherId: modalData.id
              },
              callback: (re) => {
                this.setState({dataArr: re})
              }
            });
            this.addClassAndSbj(0)
          }
        })
    })
  };

  /**
   * 为任课教师添加科目和班级
   * @param t 0：关 1：开
   */
  addClassAndSbj = (t) => {
    const {dispatch, query} = this.props;
    t ?
      (this.setState({
        childrenDrawer: true,
      }, () => {
        dispatch({
          type: QuestionBank + '/getSubjectList',
          payload: {
            gradeId: query.gradeId || 15
          }
        })
      }))
      :
      this.setState({
        childrenDrawer: false,
      },()=>{
        //重置表单
        this.formRef.current.resetFields()
      });
  };

  /**
   * 删除当前科目
   * @param index
   * @returns {Function}
   */
  deleteSbj = (re) => () => {
    const {dispatch, query} = this.props;
    const {modalData} = this.state;
    const  userInfo=userInfoCaches();
    dispatch({
      type: namespace + '/deleteTeacherSubject',
      payload: {id: re.id},
      callback: () => {
        message.success('删除成功');
        dispatch({
          type: namespace + '/findTeacherSubjectInfo',
          payload: {
            schoolId: userInfo.schoolId,
            teacherId: modalData.id
          },
          callback: (re) => {
            this.setState({dataArr: re})
          }
        });
      }
    })
  };


  render() {
    const {classList = [], subjectList = [], findTeacherSubjectInfo = []} = this.props;
    const {modalData, drawerVisible, childrenDrawer} = this.state;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    };
    const PropertyList = (props = {}) => {
      const {sbjArr = []} = props;
      return (
        <>
          {
            sbjArr.length ? sbjArr.map((re, index) => (
              <div key={re.id} className={styles['propertyList']}>
                <div className={styles['property']}>
                  <div className={styles['class']}>
                    {re.className}
                  </div>
                  <div className={styles['sbj']}>
                    {re.subjectName}
                  </div>
                </div>
                <Popconfirm
                  placement="top"
                  title={'确认删除当前科目？'}
                  onConfirm={this.deleteSbj(re)}
                  okText="是"
                  cancelText="否"
                >
                  <CloseCircleOutlined className={styles['delete']}/>
                </Popconfirm>
              </div>
            )) : ''
          }
        </>
      )
    };
    return (
      <div id={styles['actionTeacher']}>
        <Drawer
          id={styles['teacherInfoDrawerFather']}
          title={
            <div className={styles['titleTag']}>
              <span className={styles['titleSpan']}>{`任课老师：${modalData.userName}`}</span>
              <Button style={{width:'auto'}} onClick={() => this.addClassAndSbj(1)} className={styles['btnF']}>
                <PlusOutlined style={{color: '#a6a6a6'}} />
                添加班级&nbsp;科目
              </Button>
            </div>
          }
          width={600}
          closable={false}
          onClose={() => this.controllerPermission(0)}
          visible={drawerVisible}
        >
          <div className={styles['propertys']}>
            <PropertyList sbjArr={findTeacherSubjectInfo}/>
          </div>


          <Drawer
            title="选择班级与科目"
            className={styles['drawerChildren']}
            width={320}
            closable={false}
            onClose={() => this.addClassAndSbj(0)}
            visible={childrenDrawer}
          >
            <Form ref={this.formRef}>
              <FormItem
                name={'classId'}
                rules={[
                  {
                    required: true,
                    message: '请选择班级',
                  },
                ]}
                {...formItemLayout}
                label="班级">
                <Select placeholder='请选择班级'>
                  {
                    classList.length && classList.map(re => <Option value={re.id} key={re.id}>{re.name}</Option>)
                  }
                </Select>
              </FormItem>
              <FormItem
                name={'subjectId'}
                {...formItemLayout}
                label="科目"
                rules={[
                  {
                    required: true,
                    message: '请选择科目',
                  },
                ]}
              >
                <Select placeholder='请选择科目'>
                  {
                    subjectList.length && subjectList.map(re => <Option value={re.id} key={re.id}>{re.name}</Option>)
                  }
                </Select>
              </FormItem>
            </Form>
            <div
              className={styles['fBtn']}
              style={{
                width: '100%',
                borderTop: '1px solid #e8e8e8',
                padding: '10px 16px',
                textAlign: 'right',
                background: '#fff',
                borderRadius: '0 0 4px 4px',
              }}
            >
              <Button
                style={{
                  marginRight: 8,
                }}
                onClick={() => this.addClassAndSbj(0)}
              >
                取消
              </Button>
              <Button onClick={this.saveClassAndSbj} type="primary">
                保存
              </Button>
            </div>

          </Drawer>
          <div
            className={styles['fBtn']}
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e8e8e8',
              padding: '10px 16px',
              textAlign: 'right',
              left: 0,
              background: '#fff',
              borderRadius: '0 0 4px 4px',
            }}
          >
            <Button
              style={{
                marginRight: 8,
              }}
              type="primary"
              onClick={() => this.controllerPermission(0)}
            >
              确定
            </Button>
          </div>
        </Drawer>
      </div>
    )
  }
}
