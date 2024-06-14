/**
 *@Author:ChaiLong
 *@Description: 添加班主任
 *@Date:Created in  2020/6/28
 *@Modified By:
 */
import React from 'react'
import {connect} from "dva";
import {Drawer, Button, Form, Select} from 'antd';
import styles from './actionTeacher.less';
import {ClassAndTeacherManage as namespace} from "@/utils/namespace";
import userInfoCaches from '@/caches/userInfo'

const {Option} = Select;
const FormItem = Form.Item;
// @Form.create({
//   mapPropsToFields: state => Form.createFormField(state)
// })
@connect(state => ({
  getClassLeader: state[namespace].getClassLeader,//当前班级班主任
}))
export default class AddHeadTeacher extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(...arguments);
    this.state = {
      classData: {},
      drawerVisible: false,
      headTeachers: []
    }
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  /**
   * 保存班主任
   * @param e
   */
  saveHeadTeacher = (e) => {
    const {dispatch, query} = this.props;
    e.preventDefault();
    this.formRef.current.validateFields().then(values=>{
      dispatch({
        type: namespace + '/configClassLeader',
        payload: {
          classId: query.classId,
          teacherId: values.teacherId
        },
        callback: () => {
          dispatch({
            type: namespace + '/getClassLeader',
            payload: {
              classId: query.classId
            },
            callback: (re) => {
              this.closeAndOpenHeadTeacher(0)
            }
          });

        }
      })
    })
  };

  /**
   * 配置班主任抽屉开关
   * @param t 0：关 1：开
   */
  closeAndOpenHeadTeacher = (t) => {
    const {query, classDatas = [], dispatch} = this.props;
    const userInfo = userInfoCaches()
    t ?
      (
        this.setState({drawerVisible: true},
          () => {
            dispatch({
              type: namespace + '/getClassLeaderList',
              payload: {
                schoolId: userInfo.schoolId
              },
              callback: (d) => {
                //通过地址栏的班级id获取当前班级信息，存放到state
                this.setState({
                  classData: classDatas.length ? classDatas.filter(re => re.id === parseInt(query.classId, 10))[0] : {},
                  headTeachers: d
                })
              }
            });
          })
      )
      :
      this.setState({drawerVisible: false});
  };


  render() {
    const {headTeachers, drawerVisible, classData} = this.state;
    const {getClassLeader = {}} = this.props;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    };

    return (
      <div id={styles['actionTeacher']}>
        <Drawer
          id={styles['teacherInfoDrawerFather']}
          title={'配置班主任信息'}
          width={300}
          closable={false}
          onClose={() => this.closeAndOpenHeadTeacher(0)}
          visible={drawerVisible}
        >
          <Form  ref={this.formRef}>
            <FormItem {...formItemLayout} label="班级">
              <div>{classData && Object.keys(classData).length ? classData.name : ''}</div>
            </FormItem>
            <FormItem
              {...formItemLayout}
              name="teacherId"
              label="班主任"
              initialValue={getClassLeader ? getClassLeader.headTeacherId : undefined}
              rules={[{
                required: true,
                message: '请选择班主任',
              }]}
            >
              <Select placeholder='请选择班主任'>
                {
                  headTeachers.length && headTeachers.map(re => <Option value={re.id}
                                                                        key={re.id}>{re.userName}</Option>)
                }
              </Select>
            </FormItem>
          </Form>
          <div
            className={styles['fBtn']}
            style={{
              position: 'absolute',
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
              onClick={() => this.closeAndOpenHeadTeacher(0)}
            >
              取消
            </Button>
            <Button onClick={this.saveHeadTeacher} type="primary">
              保存
            </Button>
          </div>
        </Drawer>
      </div>
    )
  }
}
