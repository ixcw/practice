/**
 *@Author:xiongwei
 *@Description:年级报告四要素表格
 *@Date:Created in  2021/4/30
 *@Modified By:
 */
import React from 'react'
import styles from './index.less'
import { existArr } from "@/utils/utils";
import { Table, Select } from "antd";
import SelectModal from '../SelectModal'
import { GradeReport as namespace } from '@/utils/namespace'
import { connect } from 'dva'
import queryString from 'query-string';
const { Option } = Select;
@connect(state => ({
  GradeReportClassInfoList: state[namespace].findGradeReportClassInfo,
  findExamReportCognizeLoading: state[namespace].findExamReportCognizeLoading,//认知层次Loading
  findExamReportKeyAbilityLoading: state[namespace].findExamReportKeyAbilityLoading,//关键能力Loading
  findExamReportCompetenceLoading: state[namespace].findExamReportCompetenceLoading,//核心素养Loading
}))
export default class FourElementsTable extends React.Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      value: [],
      SelectValue: 1,
      pageSize: 10
    }
  }
  /**
* 页面组件即将卸载时：清空数据
*/
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  componentDidMount() {
  }
  render() {
    const { value, SelectValue, pageSize } = this.state;
    const { ExamReportList, GradeReportClassInfoList = [], dispatch, type = '',
      location,
      findExamReportCognizeLoading, findExamReportCompetenceLoading, findExamReportKeyAbilityLoading
    } = this.props;
    let tableLoading
    let titleStr
    if (type == 'findExamReportCognize') { tableLoading = findExamReportCognizeLoading; titleStr='认知层次'}
    if (type == 'findExamReportKeyAbility') { tableLoading = findExamReportKeyAbilityLoading; titleStr='关键能力' }
    if (type == 'findExamReportCompetence') { tableLoading = findExamReportCompetenceLoading; titleStr='核心素养' }
    const { search } = location;
    const query = queryString.parse(search);
    let defaultValue = [-1]
    GradeReportClassInfoList.map(({ id }) => { defaultValue.push(id) })
    let column = [
      {
        title: titleStr,
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        render: (text) => text == null ? '--' : <span style={{ color: '#189DFF' }}>{text}</span>
      },
    ];
    existArr(ExamReportList.data) && existArr(ExamReportList.data[0].list) && ExamReportList.data[0].list.map(({ className, classIds }) => {
      column.push({
        title: className + '(得分率)',
        dataIndex: className + (classIds + 1),
        key: className + (classIds + 1),
        align: 'center',
        render: (text) => text == null ? '--' : text + '%'
      })
    })
    let tableData = existArr(ExamReportList.data) && ExamReportList.data.map(({ name, list = [] }, index) => {
      let obj = {
        id: index,
        name,
      }
      existArr(list) && list.map(({ className, classIds, classScoreRate }) => {
        obj[className + (classIds + 1)] = classScoreRate;
      })
      return obj
    });
    const handleChangeSelect = (value) => {
      this.setState({
        SelectValue: value,
        pageSize: 10
      })
      dispatch({
        type: namespace + '/' + type,
        payload: {
          reportType: 3,
          level: value,
          jobId: query.jobId,
          page: 1,
          size: 10,
          classIds: existArr(this.state.value) ? this.state.value.toString() : defaultValue.toString(),
        }
      })
    }
    //获取选择框点击确认时传回来的参数
    const getParameter = (value) => {
      this.setState({
        value,
        pageSize: 10
      })
      dispatch({
        type: namespace + '/' + type,
        payload: {
          reportType: 3,
          level: SelectValue,
          jobId: query.jobId,
          page: 1,
          size: 10,
          classIds: value.toString(),
        }
      })
    }
    const TableonChange = (pagination) => {
      this.setState({
        pageSize: pagination.pageSize
      })
      dispatch({
        type: namespace + '/' + type,
        payload: {
          reportType: 3,
          level: SelectValue,
          page: pagination.current,
          size: pagination.pageSize,
          jobId: query.jobId,
          classIds: existArr(this.state.value) ? this.state.value.toString() : defaultValue.toString(),
        }
      })
    }
    return (
      <div className={styles['FourElementsTable']}>
        <SelectModal outputParameter={getParameter} defaultValue={existArr(value) ? value : defaultValue}>

          <Select value={SelectValue} onChange={handleChangeSelect}>
            <Option value={1}>第一级</Option>
            {
              type != 'findExamReportCompetence' ?
                <>
                  <Option value={2}>第二级</Option>
                  <Option value={3}>第三级</Option>
                </>
                : ''
            }
          </Select>

        </SelectModal>
        <div className={styles['FourElementsTable-TABLE']}>
          <Table
            columns={column}
            dataSource={tableData}
            style={{ width: '100%' }}
            bordered
            rowKey='id'
            loading={!!tableLoading}
            onChange={(pagination) => { TableonChange(pagination) }}
            pagination={{ total: ExamReportList.total, pageSize: pageSize, current: ExamReportList.currentPage, }}
          />
        </div>
      </div>
    )
  }
}