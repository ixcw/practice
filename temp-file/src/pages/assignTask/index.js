/**
 *@Author:ChaiLong
 *@Description:布置作业
 *@Date:Created in  2020/8/20
 *@Modified By:
 */
import React from 'react'
import styles from './assignTask.less'
import { Table, Button, message, Checkbox, Radio, Tag } from 'antd'
import { connect } from 'dva'
import { existArr, replaceSearch, existObj, getLocationObj, getPageQuery, dealTimestamp } from '@/utils/utils'
import paginationConfig from '@/utils/pagination';
import queryString from 'query-string';
import { routerRedux } from 'dva/router'
import { AssignTask as namespace } from '@/utils/namespace'
import Page from '@/components/Pages/page'
import AddTask from "./components/addTask";//布置任务
import AssignCalendar from "./components/assignCalendar";//日历
import isToDesktopCache from "@/caches/isToDesktop";//是否是桌面端记录缓存


const CheckboxGroup = Checkbox.Group;
@connect(state => ({
  getWorkLists: state[namespace].getWorkLists,
  loading: state[namespace].loading
}))
export default class AssignTask extends React.Component {
  componentDidMount() {

  }


  /**
   * 列表分页、排序、筛选变化时触发
   * @param page 页数
   */
  handleTableChange = (page) => {
    const { dispatch, location } = this.props;
    const { search } = location;
    let query = queryString.parse(search);
    query = { ...query, p: page.current };
    replaceSearch(dispatch, location, query);
  };

  /**
   * 获取addTask的ref
   * @param ref
   */
  getAddTaskRef = (ref) => {
    this.addRef = ref
  }

  /**
   * 获取日历ref
   */
  getCalendarRef = (ref) => {
    this.canlendarRef = ref
  }

  /**
   * 打开布置任务
   */
  openAddTask = () => {
    this.addRef.onOff(true)
  }
  /**
   * 打开布置任务
   */
  openCalendar = () => {
    this.canlendarRef.onOff(true)
  }

  /**
   * 查看报告
   * @param t 没有批改人数不允许查看报告
   * @param record 字段
   * @param type 1班级报告。0年级报告
   */
  lookReport = (t, record, type = 1) => {
    const { dispatch } = this.props;
    console.log(record)
    if (!t) {
      if (!record.correctNum) {
        // message.warning('抱歉，当前试卷没有人被批改')
        return
      }
    }

    if (type) {
      dispatch(routerRedux.push({
        pathname: '/testReport',
        search: queryString.stringify({ jobId: record.id, id: record.id, jobType: record.jobType, paperId: record.paperId })
      }));
    } else {
      //跳转到年级报告
      dispatch(routerRedux.push({
        pathname: '/gradeReport',
        search: queryString.stringify({ jobId: record.parentId, paperId: record.paperId })
      }));
    }
  }

  render() {
    const { location, getWorkLists = {}, loading, dispatch } = this.props;
    const { data = [], total = 0 } = existObj(getWorkLists) ? getWorkLists : {};
    const { query, pathname } = getLocationObj(location)
    let _data = existArr(data) ? data : [];
    const paperType = query.paperType ? query.paperType.split(",") : [];
    const ButtonAuth = (name) => window.$PowerUtils.judgeButtonAuth(pathname, name)
    const title = '布置任务';
    const breadcrumb = [title];
    const header = (
      <Page.Header breadcrumb={breadcrumb} title={title} />
    );

    //任务类型
    const options = [
      { label: '作业', value: '1' },
      { label: '测验', value: '2' },
      { label: '考试', value: '3' },
    ];

    const studentState = (typeArr, unit = "人") => {
      if (existArr(typeArr)) {
        return (
          <div>
            {typeArr.map((re, index) => (
              <div key={index}>
                <span>{re.name}：</span>
                <span>{re.num ? re.num : 0}{unit}</span>
              </div>
            ))}
          </div>
        )
      }
    };

    /**
     * 布置任务筛选
     * @param list
     * @param name
     */
    const onChange = (list, name) => {
      const _query = query || {}
      console.log('aaaccc', list)
      _query[name] = list
      _query.p = 1
      replaceSearch(dispatch, location, { ..._query })
    };

    const isToDesktop = isToDesktopCache();
    let assignTaskColumns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '科目',
        dataIndex: 'subjectName',
        key: 'subjectName',
      },
      {
        title: '批改类型',
        dataIndex: 'correctType',
        key: 'correctType',
        render: (text) => <span>{['教师批改', '学生批改', '', '学生自评'][parseInt(text, 10) - 1]}</span>
      },
      {
        title: '类型',
        dataIndex: 'jobType',
        key: 'jobType',
        render: (text, record) =>
          <span>{`${['作业', '测验', '考试'][parseInt(text, 10) - 1]} ${record.paperFrom === 1 ? '(数据人库)' : ''}`}</span>
      },
      {
        title: '布置/截止时间',
        dataIndex: 'startTime',
        key: 'startTime',
        render: (text, record) => {
          const typeArr = [{
            name: '布置时间',
            num: record.startTime ? dealTimestamp(record.startTime, 'YYYY-MM-DD HH:mm') : '-'
          }, {
            name: '截止时间',
            num: record.endTime ? dealTimestamp(record.endTime, 'YYYY-MM-DD HH:mm') : '-',
          }]
          return (
            <div className={styles['performance']}>
              {studentState(typeArr, '')}
            </div>
          )
        }
      },
      {
        title: '布置对象',
        dataIndex: 'groupName',
        key: 'groupName',
        render: (text) => text ? text : '--'
      },
      {
        title: '完成情况',
        dataIndex: 'submitNum',
        key: 'submitNum',
        render: (text, record) => {
          const totalNum = parseInt(record.totalNum, 10);//总人数
          const submitNum = text ? parseInt(text, 10) : 0
          const typeArr = [{ name: '已完成', num: submitNum }, {
            name: '未完成',
            num: totalNum - submitNum ? totalNum - submitNum : 0
          }]
          return (
            <div className={styles['performance']}>
              {studentState(typeArr)}
            </div>
          )
        }
      },
      {
        title: '批阅情况',
        dataIndex: 'correctNum',
        key: 'correctNum',
        render: (text, record) => {
          const totalNum = parseInt(record.totalNum, 10);//总人数
          const correctNum = text ? parseInt(text, 10) : 0
          const typeArr = [{ name: '已批阅', num: correctNum },
          {
            name: '未批阅',
            num: (totalNum - correctNum) ? (totalNum - correctNum) : 0
          }]
          return (
            <div className={styles['performance']}>
              {studentState(typeArr)}
            </div>
          )
        }
      },
      // isToDesktop &&
      // {
      //   title: '任务状态',
      //   dataIndex: 'groupName',
      //   key: 'groupName',
      //   render: (text) => text ? <Tag color="blue">进行中</Tag> : '--'
      // },
      {
        title: '操作',
        dataIndex: 'action',
        render: (text, record) => {
          const totalNum = parseInt(record.totalNum, 10);//总人数
          const submitNum = parseInt(record.submitNum, 10);//完成人数
          const correctNum = parseInt(record.correctNum, 10);//完成人数
          return (
            <div className={styles['action']}>

              {isToDesktop && ButtonAuth('作答采集') && record.status != 2 ?
                <div className={styles['checkReport']}>
                  <a onClick={() => {
                    window.desktopNewWindow('openLiveBroadcastForTsdWin', String(record.id));//2021年07月07日 张江 执行桌面端方法 单个任务作答直播
                    //  @ts-ignore
                    if (window._czc) {
                      //  @ts-ignore
                      window._czc.push(['_trackEvent', `${window.$systemTitleName}-桌面端-作答采集`, '查看']);
                    }
                  }}>作答采集</a>
                </div>
                : ''
              }

              {ButtonAuth('查看报告') ?
                <div className={styles['checkReport']}>
                  <a disabled={!correctNum && !record.correctNum} onClick={() => this.lookReport(correctNum, record)}>班级报告</a>
                  {record.paperFrom === 1 ? <a disabled={!correctNum && !record.correctNum} style={{ marginLeft: '10px' }}
                    onClick={() => this.lookReport(correctNum, record, 0)}>年级报告</a> : ''}

                </div>
                : ''
              }
              {
                totalNum !== submitNum && 0 ?
                  <div className={styles['inform']}>
                    {ButtonAuth('催交作业') ? <Button color='#50a1f0'>催交作业</Button> : ''}
                    {ButtonAuth('通知家长监督学生作业') ? <Button color='#50a1f0'>通知家长监督学生作业</Button> : ''}
                  </div>
                  :
                  ''
              }
            </div>
          )
        }
      }
    ];
    if (isToDesktop) {
      //2021年10月11日 张江 桌面端添加任务状态显示
      // 添加在倒数第二个
      assignTaskColumns.splice(-1, 0, {
        title: '任务状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => text == 2 ? <Tag color="geekblue">已结束</Tag> : text == 1 ? <Tag color="blue">进行中</Tag> : <Tag>未开始</Tag>
      });
    }
    return (
      <Page header={header} loading={!!loading}>
        <div id={styles['assignTask']}>
          <div className={styles['taskFilter']}>
            <span className={styles['title']}>任务类型：</span>
            <CheckboxGroup options={options} value={paperType}
              onChange={(list) => onChange(list.join(","), 'paperType')} />
          </div>

          <div className={styles['funcBlock']}>
            <div className={styles['table']}>
              <Table
                rowKey='id'
                pagination={paginationConfig(query, total)}
                className={styles['assignTaskTable']}
                dataSource={_data}
                onChange={this.handleTableChange}
                columns={assignTaskColumns} />
            </div>
            <div className={styles['jobAction']}>
              {ButtonAuth('布置作业') ? <Button onClick={this.openAddTask}>布置任务</Button> : ''}
              {ButtonAuth('查看作业日历') ? <Button onClick={this.openCalendar}>查看任务日历</Button> : ''}
            </div>
          </div>
          <AddTask location={location} onRef={this.getAddTaskRef} />
          <AssignCalendar location={location} onRef={this.getCalendarRef} />
        </div>
      </Page>
    )
  }
}

