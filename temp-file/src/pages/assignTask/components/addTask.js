/**
 *@Author:ChaiLong
 *@Description: 布置作业弹框
 *@Date:Created in  2020/8/20
 //----------------------------------------2012-09-28任务可按组布置（xiongwei）---------------------------------
 *@Modified By:
 */
import React from 'react'
import { Modal, message, Radio, DatePicker, Row, Col, Pagination, Collapse, Empty, Select, Button, Spin, TimePicker } from 'antd'
import styles from './addTask.less'
import { existObj, existArr, deepFlatten, dealTimestamp } from '@/utils/utils'
import { AssignTask as namespace } from "@/utils/namespace";
import { connect } from 'dva'
import queryString from 'query-string'
import moment from 'moment';
import CheckTopicList from "./checkTopicList";
import userInfoCache from '@/caches/userInfo'

const { Option } = Select;
const { Panel } = Collapse;
const fTimeFormat = 'HH:mm';


@connect(state => ({
  getPaperLists: state[namespace].getPaperLists,//获取试卷列表
  getStudentLists: state[namespace].getStudentLists,//获取学生
  loading: state[namespace].loading
}))
export default class AddTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //----------------------------------------2012-09-28任务可按组布置（xiongwei）-START--------------------------------
      studentGroupList: [],//学生分组情况
      //----------------------------------------2012-09-28任务可按组布置（xiongwei）-end--------------------------------
      visible: false,//modal状态
      optionsObj: {
        taskType: 1,//任务类型
        finishDate: '',//完成时间
        topicSource: 1,//题目来源
        topicFilter: 1,//题组筛选
        checkType: 1,//批改类型
        topicSet: '',//题目集
        students: [],//指定被批改的学生对象
        homework: [],
        checkStudent:
          [
            { name: [] }
          ],//批改和被批改的学生,name对象为占位
      },//选项操作
      activeKey: undefined,//手风琴开关
      checkStudentList: [0],//用于遍历学生批改条数
      testPage: 1,//试卷分页

      choiceGroup: null
    };
  }

  componentDidMount() {
    //将ref暴露给父级
    this.props.onRef(this)
  }

  componentWillUnmount() {
    this.resetOptionsObj()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { optionsObj: { students } } = this.state
    const { optionsObj: { students: _students } } = prevState
    if (JSON.stringify(students) !== JSON.stringify(_students)) {
      const _optionsObj = { ...this.state.optionsObj }
      _optionsObj.checkStudent = [{ name: [] }];
      this.setState({ optionsObj: _optionsObj })
    }
  }

  resetOptionsObj = () => {
    this.setState({
      optionsObj: {
        taskType: 1,//任务类型
        finishDate: '',//完成时间
        finishTime: '',//完成时间 时分
        topicSource: 1,//题目来源
        topicFilter: 1,//题组筛选
        checkType: 1,//批改类型
        topicSet: '',//题目集
        students: [],//指定被批改的学生对象
        homework: [],
        checkStudent:
          [
            { name: [] }
          ],//批改和被批改的学生,name对象为占位
      },//选项操作
      activeKey: undefined,//手风琴开关
      checkStudentList: [0],//用于遍历学生批改条数
      testPage: 1,//试卷分页
    })
  }

  //----------------------------------------2012-09-28任务可按组布置（xiongwei）-START--------------------------------
  /**
   * 学生分组
   * @param res :分组数据
   * type 是否返回单纯idLIST
   */
  studentGrouping = (res, type) => {
    let Group = [];//有多少组列表
    let _studentGroupList = [];//组下 学生列表

    res.map((item) => {
      if (item.groupId && Group.indexOf(item.groupId) <= -1) {
        Group.push(item.groupId)
      }
    })

    Group.sort(function (a, b) { return a - b })

    Group.map((item, index) => {
      _studentGroupList[index] = {
        groupId: item,
        studentIds: []
      }
    })

    _studentGroupList.push({ groupId: null, studentIds: [] })

    _studentGroupList.map((item) => {
      let studentListarr = [];
      res.map(({ id, groupId, groupName, userName }) => {
        if (item.groupId == groupId) {
          if (type) {
            studentListarr.push(id)
          } else {
            studentListarr.push({ id: Number(id), userName })
          }
          item.groupName = groupName
        }
      })
      item.studentIds = studentListarr
    })
    return _studentGroupList
  }
  //----------------------------------------2012-09-28任务可按组布置（xiongwei）-START--------------------------------


  /**
   * 开关
   * @param state
   * @param record :我的题组布置任务传入的参数
   */
  onOff = (state, record) => {
    const { dispatch } = this.props;
    const { optionsObj } = this.state
    //开启操作
    const on = (bool) => {
      dispatch({
        type: namespace + '/getPaperLists',
        payload: {
          paperType: '1',
          page: 1,
          size: 10
        }
      })
      if (!record) {
      } else {
        optionsObj.topicSource = 3;//来至我的题组 已选择
        this.setState({ optionsObj: optionsObj, choiceGroup: record })
      }
      dispatch({
        type: namespace + '/getStudentLists',
        callback: (res) => {
          //----------------------------------------2012-09-28任务可按组布置（xiongwei）-START--------------------------------
          if (existArr(res)) {
            const _studentGroupList = this.studentGrouping(res)
            this.setState({
              studentGroupList: _studentGroupList
            })
          }

          //----------------------------------------2012-09-28任务可按组布置（xiongwei）-END--------------------------------
        }
      })
      this.setState({ visible: bool })
    }
    //关闭操作
    const off = (bool) => {
      this.resetOptionsObj()
      this.setState({ visible: bool, choiceGroup: null })
    }
    //控制开关
    switch (state) {
      case true:
        on(state)
        break;
      case false:
        off(state)
        break;
      default:
    }
  }

  getCheckTopicListRef = (ref) => {
    this.checkTopicLisRef = ref
  }


  render() {
    const { location, getPaperLists, dispatch, loading, getStudentLists } = this.props;
    const { visible, optionsObj = {}, activeKey, testPage, choiceGroup, studentGroupList } = this.state;
    const query = existObj(location) ? queryString.parse(location.search) : ''
    const _optionsObj = { ...optionsObj }//表单对象的浅拷贝
    const students = optionsObj.students;
    const checkStudent = optionsObj.checkStudent;
    const selectedCheckStudentKey = checkStudent.map(re => Object.keys(re)[0]);//获取到所有被选中的批改学生
    const userInfo = userInfoCache();
    //重新遍历学生列表只取出id和name
    const _getStudentLists = existArr(getStudentLists) ? getStudentLists.map(re => ({
      name: re.userName,
      id: re.id,
      groupId: re.groupId,
      groupName: re.groupName
    })) : []//学生列表
    const selectStudentArr = existArr(students) ? _getStudentLists.filter(re => students.includes(re.id)) : _getStudentLists;
    const { data: _getPaperLists, total } = existObj(getPaperLists) ? getPaperLists : []//获取试卷并判空
    //获取到除了当前批改学生组所有被选中的被批改学生
    const selectedCheckedStudentKey = (i) => {
      let arr = []
      arr = selectedCheckStudentKey.map((re, index) => {
        if (index < i) {
          return checkStudent.map(b => b[re])
        }
      })
      return deepFlatten(arr).filter(re => re);//去重和去除空值
    }
    //获取到除了当前批改学生组所有被选中的被批改学生
    const selectCheckedStudentKey = (i) => {
      let arr = []
      arr = selectedCheckStudentKey.map((re, index) => {
        if (index < i) {
          return re
        }
      })
      return deepFlatten(arr).filter(re => re);//去重和去除空值
    }
    const getCheckedStudentArr = (i, data) => data.filter(re => ![selectedCheckStudentKey[i], ...selectedCheckedStudentKey(i)].includes(re.id));//获取被批改学生列表（从所有学生获取，或者从选择的学生获取）
    const getCheckStudentArr = (i, data) => data.filter(re => !selectCheckedStudentKey(i).includes(re.id));//获取所有批改学生列表（从所有学生获取）
    const colSpan =
    {
      l: 4,
      r: 20,
      align: 'middle'
    }

    /**
     * 提交表单
     */
    const handleOk = e => {
      const { taskType, topicSet, finishDate, students, checkStudent, topicSource, checkType } = _optionsObj;
      const lengthEq = _getStudentLists.length === students.length || !existArr(students)
      let _checkArr = []//课后练习题参数
      //----------------------------------------2012-09-28任务可按组布置（xiongwei）-start--------------------------------
      let studentListInstudents = [];
      //处理students 
      existArr(students) && students.map((item) => {
        _getStudentLists.map((res) => {
          if (item == res.id) {
            studentListInstudents.push(res)
          }
        })
      })
      const getstudentListInstudents = this.studentGrouping(studentListInstudents, 'type');
      //----------------------------------------2012-09-28任务可按组布置（xiongwei）-END--------------------------------
      //判断数组对象的值中是否存在name,并且对象中的数组是否为空
      if (topicSource === 1 && !topicSet) {
        return message.error('请选择题组')
      }
      if (topicSource === 2 && !existArr(this.checkTopicLisRef.state.checkArr)) {
        return message.error('请选择课后练习题目')
      }
      if (!finishDate) {
        return message.error('请选择完成时间')
      }
      if (checkType === 2 && existArr(checkStudent) && isCheckStudent()) {
        return message.error('请完善批改组')
      }
      if (!existArr(_getStudentLists)) {
        return message.error('没有学生，目前无法布置任务')
      }
      if ((topicSource !== 1 && topicSource !== 3) && existArr(this.checkTopicLisRef.state.checkArr)) {
        this.checkTopicLisRef.state.checkArr.map((re, index) => {
          re.code = (index + 1)
          _checkArr.push({ ...re })
        })
      }
      dispatch({
        type: namespace + '/addNewWork',
        payload: {
          type: topicSource == 3 ? 1 : topicSource,
          name: topicSource == 1 || topicSource == 3 ? undefined : this.checkTopicLisRef.state.checkName,
          examPaperDetails: topicSource == 1 || topicSource == 3 ? undefined : _checkArr,
          paperType: taskType,
          endTime: finishDate,
          paperId: topicSource == 1 ? topicSet : topicSource == 3 && choiceGroup ? choiceGroup.id : null,
          correctType: checkType,
          isPrivate: lengthEq ? 1 : 2,
          groupStudentIds: existArr(students) ? getstudentListInstudents : undefined,
          correctings: checkType == 1 ? undefined : checkStudent
        },
        callback: () => {
          message.success('布置任务成功')
          dispatch({
            type: namespace + '/getWorkLists',
            payload: {
              paperTypeIds: '',
              page: query.p || 1,
              size: 10
            }
          })
          if (choiceGroup && choiceGroup.callback && typeof choiceGroup.callback == 'function') {//如果已传入回调方法 则执行回调
            choiceGroup.callback();//
          }
          this.resetOptionsObj()
          this.setState({
            visible: false,
          })
          //  @ts-ignore
          if (window._czc) {
            //  @ts-ignore
            window._czc.push(['_trackEvent', `${window.$systemTitleName}-布置任务`, '操作']);
          }
        }
      })
    };

    /**
     * 获取日期
     */
    const onChangeDate = (date, dateString) => {
      _optionsObj['finishDate'] = dealTimestamp(date, 'YYYY-MM-DD') + (_optionsObj['finishTime'] ? ' ' + _optionsObj['finishTime'] : " 23:59");
      this.setState({
        optionsObj: _optionsObj
      })
    }

    /**
    * 获取时间
    */
    const onChangeTime = (date, dateString) => {
      const tempFinishTime = dealTimestamp(date, fTimeFormat);
      _optionsObj['finishTime'] = tempFinishTime;
      if (_optionsObj['finishDate']) {
        _optionsObj['finishDate'] = _optionsObj['finishDate'].split(' ')[0] + ' ' + tempFinishTime;
      } else {
        return message.error('请先选择日期')
      }
      this.setState({
        optionsObj: _optionsObj
      })
    }

    /**
     * 获取任务类型和题组筛选
     * @param e event
     * @param type 改变类型
     */
    const onChangeRadio = (e, type) => {
      _optionsObj[type] = e.target.value;
      //选择题组时清空题组
      const topicSource = () => {
        this.setState({ topicSet: '', testPage: 1 })
        dispatch({
          type: namespace + '/set',
          payload: {
            findQuestionByKnowId: []
          }
        })
      }
      //筛选题组
      const topicFilter = () => {
        dispatch({
          type: namespace + '/getPaperLists',
          payload: {
            paperType: e.target.value,
            page: 1,
            size: 10
          },
          callback: () => {
            this.setState({ topicSet: '', testPage: 1 })
          }
        })
      }

      //切换批改对象重置操作
      const checkType = () => {
        _optionsObj.checkStudent = [{ name: [] }];
        this.setState({ optionsObj: _optionsObj })
      }
      this.setState({
        optionsObj: _optionsObj
      }, () => {

        switch (type) {
          case 'topicSource':
            topicSource()
            break;
          case 'topicFilter':
            topicFilter()
            break;
          case 'checkType':
            checkType()
            break;
          default:
        }
      })
    }


    /**
     * 改变页码
     * @param page
     */
    const changePage = (page) => {
      _optionsObj['topicSet'] = undefined;
      this.setState({
        optionsObj: _optionsObj
      })
    }

    /**
     * 手风琴开关
     * @param key
     */
    const changeCollapse = (key) => {
      this.setState({ activeKey: key })
    }

    /**
     * 取消选中单个学生
     * @param id
     */
    const handleStudents = (id) => {
      const _students = [...students];
      //判断如果数组中存在当前id就删除，否则就添加
      if (students.includes(id)) {
        const index = students.indexOf(id);
        _students.splice(index, 1)
      } else {
        _students.push(id)
      }
      _optionsObj.students = _students;
      this.setState({ optionsObj: _optionsObj })
    }

    //----------------------------------------2012-09-28任务可按组布置（xiongwei）-START--------------------------------
    /**
     * 判断该组是否全部选中
     * @param 组id
     */
    const judgeGroupInStudents = (id) => {
      const _students = [...students];
      //该组学生列表
      let groupStudentList = [];
      //_students是否全部包含groupStudentList
      let groupState = true;
      //判断该组中是否全选 没有 加-- 有 减
      studentGroupList.map(({ groupId, studentIds }) => {
        if (id == groupId) {
          groupStudentList = [...studentIds]
        }
      })
      //判断该组是否全部选中 true 全部选中
      groupStudentList.map((item) => {
        if (_students.includes(item.id)) {
          return
        } else {
          groupState = false
        }
      })
      return groupState
    }

    /**
     * 取消选中某组个学生
     * @param 组id
     */
    const handleStudentsGroup = (id) => {
      const _students = [...students];
      const groupState = judgeGroupInStudents(id)
      let groupStudentList = [];
      studentGroupList.map(({ groupId, studentIds }) => {
        if (id == groupId) {
          groupStudentList = [...studentIds]
        }
      })
      //该组已选 //则取消该组
      if (groupState) {
        groupStudentList.map((item) => {
          if (_students.includes(item.id)) {
            const index = _students.indexOf(item.id);
            _students.splice(index, 1)
          }
        })
      } else {
        groupStudentList.map((item) => {
          if (students.includes(item.id)) {
            return
          } else {
            _students.push(item.id)
          }
        })
      }
      _optionsObj.students = _students;
      this.setState({ optionsObj: _optionsObj })

    }
    //----------------------------------------2012-09-28任务可按组布置（xiongwei）-end--------------------------------

    //判断批改学生组是否合法
    const isCheckStudent = () => {
      const lastCheck = checkStudent[checkStudent.length - 1];//取出最后一个批改组
      const lastCheckKey = Object.keys(lastCheck)[0];//取出最后一个批改组键值
      return lastCheckKey === 'name' || !existArr(lastCheck[lastCheckKey])
    }
    /**
     * 添加一个学生批改组
     */
    const addCheckStudent = () => {
      //判断只有选择了批改学生和被批改学生才能进行添加
      if (isCheckStudent()) {
        message.warn('请完成当前未填写完的批改学生组')
        return
      }
      _optionsObj['checkStudent'] = [...checkStudent, { name: [] }]//{name:[]}为占位
      this.setState({
        optionsObj: _optionsObj
      })
    }

    /**
     * 删除当前批改组
     * @param index
     */
    const deleteCheckStudent = (index) => {
      _optionsObj.checkStudent.splice(index, 1)
      this.setState({ optionsObj: _optionsObj })
    }

    /**
     * 批改学生
     * @param val
     */
    const handleCorrectStudent = (val, index = 0) => {
      let currentCheck = _optionsObj.checkStudent[index]
      const checkKey = Object.keys(currentCheck)[0];
      _optionsObj.checkStudent[index] = { [val]: currentCheck[checkKey].filter(re => re !== val) }
      this.setState({
        optionsObj: _optionsObj
      })
    }

    /**
     * 被批改学生
     * @param val
     */
    const handleCheckedStudent = (val, index = 0) => {
      const currentCheck = _optionsObj.checkStudent[index];//当前批改学生组
      const _currentCheck = { ...currentCheck };
      const currentCheckKey = Object.keys(currentCheck);//当前批改学生键值
      _currentCheck[currentCheckKey] = val;
      _optionsObj.checkStudent[index] = _currentCheck;
      this.setState({ optionsObj: _optionsObj })
    }

    /**
     * 试卷列表分页器
     * @param page
     */
    const handelTopicPage = (page) => {
      dispatch({
        type: namespace + '/getPaperLists',
        payload: {
          paperType: _optionsObj.topicFilter,
          page,
          size: 10
        },
        callback: () => {
          this.setState({ testPage: page })
        }
      })
    }


    /**
     * 手风琴操作
     * @returns {*}
     */
    const getExtra = () => {
      //全选
      const checkAllAndNothing = (e, type, studentData) => {
        e.stopPropagation && e.stopPropagation();
        if (existArr(studentData)) {
          const studentsId = studentData.map(re => re.id)
          const { optionsObj } = this.state;
          let studentIdArr = []
          switch (type) {
            case 'all'://全选
              studentIdArr = studentData.reduce((a, b) => {
                a.push(b.id)
                return a
              }, [])
              break;
            case 're'://反选
              studentIdArr = studentsId.filter(re => !students.includes(re))
              break;
            default://清空
              studentIdArr = []
          }
          _optionsObj.students = studentIdArr;
          this.setState({ optionsObj: _optionsObj })
        }
      }

      return (
        <>
          <a onClick={(e) => checkAllAndNothing(e, 'all', _getStudentLists)}>全选</a>
          <a onClick={(e) => checkAllAndNothing(e, 're', _getStudentLists)}>反选</a>
          <a onClick={(e) => checkAllAndNothing(e, 'cancel', _getStudentLists)}>取消</a>
        </>
      )
    }

    /**
     * 选择题组
     */
    const topicSetComponent = (data, total) => {
      return (
        (data && data.length ?
          <>
            <div className={styles['topic']}>
              <Radio.Group onChange={(e) => onChangeRadio(e, 'topicSet')} value={optionsObj.topicSet}>
                {
                  data.map(re => <Radio key={re.id} value={re.id}>{re.name}</Radio>)
                }
              </Radio.Group>
            </div>
            {parseInt(total, 10) > 10
              ?
              <div className={styles['topicPagination']}>
                <Pagination onChange={handelTopicPage} current={testPage} total={total} />
              </div> :
              ''
            }
          </>
          :
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )
      )
    }

    /**
     * 课后练习
     * @param data
     */
    const homework = (data) => {
      return (data ? <div><CheckTopicList onRef={this.getCheckTopicListRef} location={location} /></div> :
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />)
    }

    /**
     * 教师批改
     * @param studentData
     * @returns {*}
     */
    const teacherCheck = (studentData) => {

      return (
        <Collapse onChange={changeCollapse} accordion={true} activeKey={activeKey}
          className={styles['orientColl']} ghost>
          <Panel extra={existArr(studentData) && activeKey ? getExtra() : ''} header="向指定学生布置作业(默认全班)" key="1">
            {existArr(studentData) ?
              <div className={styles['panelBox']}>
                {/* //----------------------------------------2012-09-28任务可按组布置（xiongwei）-START-------------------------------- */}
                {
                  existArr(studentGroupList) && studentGroupList.map(({ groupId, groupName, studentIds }) => {
                    if (groupId) {
                      return (
                        <div
                          className={styles['group']}
                          key={groupId}
                        >
                          <div className={styles['groupName']}>
                            {groupName}：
                          </div>
                          <div className={styles['groupitem']}>
                            {studentIds.map((re) => {
                              return (
                                <div onClick={() => handleStudents(re.id)}
                                  className={`${styles['student']} ${students.includes(re.id) ? styles['studentChecked'] : ''}`}
                                  key={re.id}>{re.userName ? re.userName : '未知学生'}
                                </div>
                              )
                            })}
                          </div>
                          <div
                            className={styles[judgeGroupInStudents(groupId) ? 'nochoose' : 'nochoose']}
                            onClick={() => handleStudentsGroup(groupId)}
                          >
                            {judgeGroupInStudents(groupId) ? '取消该组' : '选择该组'}
                          </div>
                        </div>
                      )
                    } else {
                      return (
                        <div
                          key='sss'
                          className={styles['group1']}
                        >
                          {studentIds.map((re) => {
                            return (
                              <div onClick={() => handleStudents(re.id)}
                                className={`${styles['student']} ${students.includes(re.id) ? styles['studentChecked'] : ''}`}
                                key={re.id}>{re.userName ? re.userName : '未知学生'}
                              </div>
                            )
                          })}
                        </div>
                      )
                    }
                  })}
                {/* //----------------------------------------2012-09-28任务可按组布置（xiongwei）-START-------------------------------- */}
                {/* {
                  studentData.map(re => <div onClick={() => handleStudents(re.id)}
                    className={`${styles['student']} ${students.includes(re.id) ? styles['studentChecked'] : ''}`}
                    key={re.id}>{re.name ? re.name : '未知学生'}
                  </div>)
                } */}
              </div>
              :
              <div><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>
            }
          </Panel>
        </Collapse>
      )
    }

    const studentCheck = (studentData, selectStudentArr) => {
      return (
        existArr(studentData) ?
          <div className={styles['studentCheckedBox']}>
            {
              checkStudent.map((re, index) => {
                return (
                  <div key={index} className={styles['selectCorrectStudent']}>
                    <div>
                      <span>批改学生：</span>
                      <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="选择批改学生"
                        optionFilterProp="children"
                        value={selectedCheckStudentKey[index] === 'name' ? undefined : selectedCheckStudentKey[index]}
                        disabled={index !== (checkStudent.length - 1)}
                        onChange={(e) => handleCorrectStudent(e, index)}
                        filterOption={(input, option) =>
                          option.children && option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {
                          getCheckStudentArr(index, studentData).map(re => <Option key={re.id}
                            value={re.id}>{re.name}</Option>)
                        }
                      </Select>
                    </div>
                    <div>
                      <span>被批改学生：</span>
                      <Select
                        mode="multiple"
                        onChange={(e) => handleCheckedStudent(e, index)}
                        style={{ width: '200px', height: '32px' }}
                        placeholder="被批改学生"
                        disabled={index !== (checkStudent.length - 1)}
                        value={checkStudent[index][Object.keys(checkStudent[index])[0]]}
                        filterOption={(input, option) =>
                          option.children && option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {
                          getCheckedStudentArr(index, selectStudentArr).map(re => <Option key={re.id}
                            value={re.id}>{re.name}</Option>)
                        }
                      </Select>
                    </div>
                    <div>
                      {
                        index === 0 ?
                          <Button type='primary' onClick={addCheckStudent}>添加批改学生</Button>
                          :
                          <Button danger type='primary' onClick={() => deleteCheckStudent(index)}>删除</Button>
                      }
                    </div>
                  </div>
                )
              })
            }
          </div>
          :
          <div><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>)
    }
    return (
      <Modal
        className={styles['componentAddTaskModal']}
        maskClosable={false}
        title="布置任务"
        visible={visible}
        width={'80vm'}
        onOk={handleOk}
        onCancel={() => this.onOff(false)}
      >
        <Spin tip="加载中..." spinning={!!loading}>
          <div className={styles['taskOption']}>
            <Row align={colSpan.align} className={styles['rowBox']}>
              <Col span={colSpan.l} className={styles['name']}>任务类型：</Col>
              <Col span={colSpan.r} className={'optionBox'}>
                <Radio.Group onChange={(e) => onChangeRadio(e, 'taskType')} value={optionsObj.taskType}>
                  <Radio value={1}>作业</Radio>
                  <Radio value={2}>测验</Radio>
                  <Radio value={3}>考试</Radio>
                </Radio.Group>
              </Col>
            </Row>

            <div className={styles['topicSource']}>
              <Radio.Group buttonStyle="solid" onChange={(e) => onChangeRadio(e, 'topicSource')}
                value={optionsObj.topicSource}>
                {
                  choiceGroup ? [<Radio.Button key='3' value={3}>已选题组</Radio.Button>,
                  <Radio.Button key='1' value={1}>更换题组</Radio.Button>] :
                    <Radio.Button value={1}>选择题组</Radio.Button>
                }
                <Radio.Button value={2}>课后练习</Radio.Button>
              </Radio.Group>
            </div>

            {
              optionsObj.topicSource === 1 ? <Row align={colSpan.align} className={styles['rowBox']}>
                <Col span={colSpan.l} className={styles['name']}>题组类型筛选：</Col>
                <Col span={colSpan.r} className={'optionBox'}>
                  <Radio.Group onChange={(e) => onChangeRadio(e, 'topicFilter')} value={optionsObj.topicFilter}>
                    <Radio value={1}>作业</Radio>
                    <Radio value={2}>测验</Radio>
                    <Radio value={3}>考试</Radio>
                  </Radio.Group>
                </Col>
              </Row>
                : ''
            }

            {
              optionsObj.topicSource == 3 && choiceGroup ?
                <div className={styles['selected-group']}>
                  【当前选择】《{choiceGroup.name}》
                </div>
                :
                <div className={styles['topicSet']}>
                  <Spin tip="加载中..." spinning={!!loading}>
                    {
                      optionsObj.topicSource === 1 ?
                        topicSetComponent(_getPaperLists, total)
                        :
                        homework(1)
                    }
                  </Spin>
                </div>
            }


            <Row align={colSpan.align} className={styles['rowBox']}>
              <Col span={colSpan.l} className={styles['name']}>完成时间：</Col>
              <Col span={colSpan.r} className={'optionBox'}>
                <DatePicker
                  value={optionsObj.finishDate ? moment(optionsObj.finishDate, 'YYYY-MM-DD') : undefined}
                  onChange={onChangeDate}
                  allowClear={false}
                />
                <TimePicker
                  style={{ marginLeft: '4px' }}
                  value={optionsObj.finishDate && optionsObj.finishDate.split(' ')[1] ? moment(optionsObj.finishDate.split(' ')[1], fTimeFormat) : undefined}
                  format={fTimeFormat}
                  onChange={onChangeTime}
                  allowClear={false}
                />
              </Col>
            </Row>
            <div className={styles['orient']}>
              {
                teacherCheck(_getStudentLists)
              }
            </div>

            <Row align={colSpan.align} className={styles['rowBox']}>
              <Col span={colSpan.l} className={styles['name']}>批改类型：</Col>
              <Col span={colSpan.r} className={'optionBox'}>
                <Radio.Group buttonStyle="solid" onChange={(e) => onChangeRadio(e, 'checkType')}
                  value={optionsObj.checkType}>
                  <Radio.Button value={1}>教师批改</Radio.Button>
                  {/*<Radio.Button value={2}>学生批改</Radio.Button>*/}
                  {
                    userInfo?.studyId==16 ? <Radio.Button value={4}>学生自评</Radio.Button> : null
                  }
                </Radio.Group>
              </Col>
            </Row>
            <div className={styles['orient']}>
              {
                optionsObj.checkType === 2 ?
                  studentCheck(_getStudentLists, selectStudentArr)
                  :
                  ''
              }
            </div>
          </div>

        </Spin>
      </Modal>
    )
  }
}
