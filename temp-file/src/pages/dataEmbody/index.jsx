/**
 *@Author:ChaiLong
 *@Description:数据入库
 *@Date:Created in  2021/5/11
 *@Modified By:
 */
import React from 'react';
import styles from './dataEmbody.less'
import { Cascader, Select, Button, message } from 'antd'
import { getLocationObj, replaceSearch, existArr, doHandleYear } from '@/utils/utils'
import { Public, QuestionBank, DataEmbody as namespace, Auth } from '@/utils/namespace'
import queryString from 'query-string'
import { connect } from 'dva'
import { particularYear } from "@/utils/const";
import ImportExamText from "./components/importExamText";
import TestDataTable from "./components/testDataTable";
import userInfoCache from "@/caches/userInfo";


const { Option } = Select;

@connect(state => ({
  subjectList: state[QuestionBank].subjectList,//科目
  getGradeList: state[Public].gradeList,//获取年级
  authButtonList: state[Auth].authButtonList,//按钮权限数据
}))
export default class DataEmbody extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cascaderOptions: [],//学校级联数据
      TaskUploadVisible: false,
      isEdit: false,
      singleData: null,
    };
  }


  componentDidMount() {
    const { dispatch } = this.props;
    //初始化年级
    dispatch({
      type: Public + '/getGradeList'
    });

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
  }

  /**
   * 修改或添加(导入文档)任务
   * @param payload  ：参数对象
   */
  editOrAddTasks = (payload) => {
    const { location } = this.props;
    const year = doHandleYear();
    const { query } = getLocationObj(location);
    const _query = { ...query };
    const {
      dispatch,
    } = this.props;
    const {
      isEdit,
    } = this.state
    let formData = new FormData();
    //-------------------------2022/7/12--xiongwei----------------------------------
    payload.importType = 3;
    //-------------------------2022/7/12--xiongwei----------------------------------
    Object.keys(payload).forEach(key => {
      if (typeof payload[key] === 'undefined') {
        delete payload[key]
      } else if (!isEdit) {
        formData.append(key, payload[key]);
      }
    });
    if (isEdit) {
      dispatch({//修改导入任务参数
        type: namespace + '/updateWorkParam',
        payload,
        callback: (result) => {
          this.setState({ TaskUploadVisible: false, singleData: null });
          message.success(result);
        }
      });
    } else {// 导入word 解析题目信息
      formData.delete('testName')
      dispatch({
        type: QuestionBank + '/importQuestionBank',
        payload: {
          formData: formData,
        },
        callback: (result) => {
          this.setState({ TaskUploadVisible: false, singleData: null });
          dispatch({
            type: namespace + '/addExamJob',
            payload: {
              jobId: result.jobId,
              jobName: result.name,
              subjectId: result.subjectId,
              gradeId: formData.get('gradeId'),
              paperId: result.id,
              yearId: formData.get('yearId'),
              schoolId: result.schoolId
            },
            callback: () => {
              dispatch({
                type: namespace + '/findMakingSystemData',
                payload: {
                  schoolId: _query.schoolId || '',
                  gradeId: _query.gradeId || '',
                  yearId: query.year === 'null' ? "" : (query.year || year),
                  subjectId: _query.subjectId || '',
                  page: _query.p || 1,
                  size: 10
                }
              })
              message.success('导入成功');
            }
          })
        }
      });
    }
  }


  render() {
    const { cascaderOptions, gradeCode, TaskUploadVisible, singleData, isEdit } = this.state;
    const { dispatch, getGradeList = [], subjectList = [], location, authButtonList } = this.props;
    const { query } = getLocationObj(location);
    const _query = { ...query };
    const _subjectList = existArr(subjectList) || [];//科目
    const realSubjectId = _query.subjectId || (_subjectList[0] ? _subjectList[0].id : 0);//判断当前真实科目Id
    // const user = userInfoCache();
    // const isAdmin = user.code !== 'GG_QUESTIONBANKADMIN';
    // 权限判断处理
    const powerDeal = (buttonName) => {
      return window.$PowerUtils.judgeButtonAuth(authButtonList, buttonName);
    }
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


    /**
     * 机构或者学校级联选择
     * @param value ：选择的值
     */
    const onCascaderChange = (value, selectedOptions) => {
      const { dispatch, location } = this.props;
      const { search } = location;
      let query = queryString.parse(search);
      query.schoolId = value[value.length - 1];
      replaceSearch(dispatch, location, query);
    };


    /**
     * 切换年级或学级
     * @param e
     * @param str
     */
    const handleGradeSpoceId = (e, str) => {
      const { dispatch, location } = this.props;
      const { search } = location;
      let query = queryString.parse(search);
      query[str] = e;
      query.p = undefined;
      replaceSearch(dispatch, location, query);
    };

    /**
     * 关闭弹窗
     */
    const onCancel = () => {
      this.setState({ TaskUploadVisible: false, item: null })
      dispatch({
        type: QuestionBank + '/set',
        payload: {
          subjectAddList: []
        }
      })
    }
    return (
      <div id={styles['dataEmbody']}>
        <div className={styles['filterTop']}>
          <div className={styles['leftBox']}>
            {powerDeal('学校') ? <div className={`${styles['school']} ${styles['box']}`}>
              <label>学校：</label>
              <Cascader
                fieldNames={{ label: 'name', value: 'id', children: 'areas' }}
                options={cascaderOptions}
                loadData={loadCascaderData}
                onChange={onCascaderChange}
                placeholder="请选择学校"
                style={{ width: 120 }} />
            </div> : '' }
            <div className={`${styles['grade']} ${styles['box']}`}>
              <label>年级：</label>
              <Select value={_query.gradeId ? parseInt(_query.gradeId, 10) : 'null'} style={{ width: 120 }}
                onChange={(e) => handleGradeSpoceId(e, 'gradeId')}>
                <Option key={'null'}>全部</Option>
                {
                  getGradeList.length && getGradeList.map(re => <Option key={re.id} value={re.id}>{re.name}</Option>)
                }
              </Select>
            </div>

            <div className={styles['subject']}>
              <label>科目：</label>
              <Select value={_query.subjectId ? String(realSubjectId) : 'null'} placeholder="请选择科目"
                style={{ width: 120 }}
                onChange={(e) => handleGradeSpoceId(e, 'subjectId')}>
                <Option key={'null'}>全部</Option>
                {
                  _subjectList.map(re => <Option key={re.id}>{re.name}</Option>)
                }
              </Select>
            </div>

            <div className={styles['year']}>
              <label>年份：</label>
              <Select value={_query.year || doHandleYear()} onChange={(e) => handleGradeSpoceId(e, 'year')}
                placeholder="请选择年份" style={{ width: 120 }}>
                <Option key={'null'}>全部</Option>
                {particularYear.map(it =>
                  <Option key={it.code} value={it.code}>{it.name}</Option>
                )}
              </Select>
            </div>
          </div>

          {powerDeal('数据入库') ? <div className={styles['rightBox']}>
            <Button onClick={() => {
              this.setState({ TaskUploadVisible: true, isEdit: false, })
            }} type="primary">
              数据入库
            </Button>
          </div> : ''}

        </div>
        <div className={styles['testDataTable']}>
          <TestDataTable location={location} />
        </div>
        {
          TaskUploadVisible ? <ImportExamText
            visible={TaskUploadVisible}
            item={singleData}
            isEdit={isEdit}
            location={location}
            onCancel={onCancel}
            onOk={(payload) => {
              this.editOrAddTasks(payload);//修改或添加(导入文档)任务
            }}
          /> : null
        }
      </div>
    )
  }
}
