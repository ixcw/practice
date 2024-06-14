/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2021/5/18
 *@Modified By:
 */
import React from 'react';
import {Table, Badge, Upload, message} from 'antd'
import {doHandleYear, existArr, existObj, getLocationObj, pushNewPage, replaceSearch} from "@/utils/utils";
import {connect} from 'dva'
import paginationConfig from "@/utils/pagination";
import {DataEmbody as namespace} from '@/utils/namespace'
import accessTokenCache from "@/caches/accessToken";
import moment from 'moment'
import singleTaskInfoCache from "@/caches/singleTaskInfo";
import pageRecord from "@/caches/pageRecord";
import userInfoCache from "@/caches/userInfo";


@connect(state => ({
  findMakingSystemData: state[namespace].findMakingSystemData,//
}))
export default class TestDataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {location, dispatch, findMakingSystemData} = this.props;
    const {data, total} = existObj(findMakingSystemData) || {};
    const {query} = getLocationObj(location);
    const _query = {...query};
    const token = accessTokenCache() && accessTokenCache();
    const year = doHandleYear();
    const user = userInfoCache();
    const disableUser = user.code === 'GG_QUESTIONBANKADMIN' ? {} : {pointerEvents: 'none', color: 'black'};


    /**
     * 根据传入的对象，打开新页面
     * @param obj  ：参数对象
     * @param item  ：任务对象
     * @param pathname  ：地址
     */
    const replaceNewPage = (obj, item, pathname) => {
      item.isSee = -1
      item.comePage = 'uploadData'
      singleTaskInfoCache(item);
      const {dispatch, location} = this.props;
      //修改地址栏最新的请求参数
      pushNewPage({jobId: obj.jobId, queryType: '6'}, pathname, dispatch)
    };


    /**
     * 改变loading状态
     * @param bool
     */
    const changeLoading = (bool) => {
      dispatch({
        type: namespace + '/set',
        payload: {
          loading: bool
        }
      })
    };


    /**
     * 批量导入上传配置
     * @param record
     * @returns {{headers: {Authorization: (void|*)}, data: {schoolId: *}, onChange(*): void, name: string, multiple: boolean, action: string, accept: string}}
     */
    const tableProps = (record) => {
      return {
        name: 'file',
        action: '/auth/web/front/v1/making/system/importMakingSystemData',
        multiple: false,
        data: {
          id: record.id,
          schoolId: record.schoolId,
          paperId: record.paperId,
          subjectId: record.subjectId,
          classId: '',
          gradeId: record.gradeId
        },
        headers: {Authorization: token},
        accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/vnd.ms-excel",//指定选择文件框默认文件类型
        onChange(info) {
          const {code = '', msg = ''} = info.file.response ? info.file.response : {};
          //正在上传
          if (info.file.status === 'uploading') {
            changeLoading(true);
          }
          if (info.file.status === 'done') {
            if (code === 200) {
              message.success('上传成功');
              setTimeout(() => {
                dispatch({
                  type: namespace + '/findMakingSystemData',
                  payload: {
                    schoolId: query.schoolId || '',
                    gradeId: query.gradeId || '',
                    yearId: query.year === 'null' ? "" : (query.year || year),
                    subjectId: query.subjectId || '',
                    page: query.p || 1,
                    size: 10
                  }
                })
                query.classId = 0;//批量导入成功后切换到全部教师
              }, 500)
            } else {
              changeLoading(false);
              message.error(msg)
            }
          } else if (info.file.status === 'error') {
            changeLoading(false);
            message.error(`${info.file.name} 上传出错`);
          }
        }
      }
    }

    /**
     * 获取是否可查看报告状态
     * @param status  上传报告状态
     * @param knowParam 知识点设参状态
     */
    const getReportStatus = (status, knowParam) => {
      return status === 2 && knowParam === '已设参'
    }

    /**
     * table配置
     * @param record
     * @param index
     * @returns {JSX.Element}
     */
    const expandedRowRender = (record, index) => {
      const columns = [
        {title: '序号', dataIndex: 'parentId', key: 'parentId', render: (text, record, i) => <span>{i + 1}</span>},
        {title: '班级名称', dataIndex: 'className', key: 'className'},
        {
          title: '总人数/实际参考人数',
          dataIndex: 'totalNum',
          key: 'totalNum',
          render: (text, record) => <span>{`${record.totalNum || 0}/${record.examNum || 0}`}</span>
        },
        {
          title: '缺考人数',
          dataIndex: 'operation',
          key: 'operation',
          render: (text, record) => <span>{(record.totalNum - record.examNum) || 0}</span>
        },
        {
          title: '报告',
          dataIndex: 'upgradeNum',
          key: 'upgradeNum',
          render: (text,r) => (getReportStatus(record.status, record.knowParam) ? <a
              onClick={() => pushNewPage({
                jobId: r.jobId,
                paperId: record.paperId,
              }, '/testReport', dispatch)}>班级报告</a> :
            <span>班级报告</span>)
        },
      ];
      return <Table rowKey={'classId'} columns={columns} dataSource={record.classInfo} pagination={false}/>;
    };

    const columns = [
      {title: '试卷名称', dataIndex: 'name', key: 'name'},
      {title: '年级', dataIndex: 'gradeName', key: 'gradeName'},
      {title: '科目', dataIndex: 'subjectName', key: 'subjectId'},
      {
        title: '创建时间', dataIndex: 'createTime', key: 'createTime', render: (text) => {
          return moment(text).format('YYYY-MM-DD  HH:mm:ss')
        }
      },
      {title: '权限', dataIndex: 'showWay', key: 'showWay'},
      {title: '班级数量', dataIndex: 'classNum', key: 'classNum'},
      {
        title: '知识点设参',
        dataIndex: 'knowParam',
        key: 'knowParam',
        render: (text, record) => <a style={disableUser} onClick={() => replaceNewPage({
          jobId: record.jobId
        }, record, '/question-list')}>{text}</a>
      },
      {
        title: '分数数据', key: 'status', render: (text, record) => {
          return record.status === 1 ? <span>计算中</span> :
            record.knowParam === '未设参' ? <span>上传</span>
              :
              <Upload disabled={user.code !== 'GG_QUESTIONBANKADMIN'} showUploadList={false} {...tableProps(record)}
                      beforeUpload={this.beforeUpload}>
                <a style={disableUser}>{record.status === 0 ? '上传' : '重新上传'}</a>
              </Upload>
        }
      },
      {title: '三要素设参', dataIndex: 'threeParam', key: 'threeParam'},
      {
        title: '年级报告',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text, record) => (getReportStatus(record.status, record.knowParam) ? <a onClick={() => {
          pushNewPage({jobId: record.id, paperId: record.paperId,}, '/gradeReport', dispatch)
        }}>年级报告</a> : <span>年级报告</span>)
      }
    ];

    /**
     * 是否允许展开的行
     * @param record
     * @returns {boolean}
     */
    const rowExpandable = (record) => existArr(record.classInfo)

    /**
     * 列表分页、排序、筛选变化时触发
     * @param page 页数
     */
    const handleTableChange = (page) => {
      _query.p = page.current;
      replaceSearch(dispatch, location, _query);
    };
    return (
      <div>
        <Table
          rowKey={'id'}
          className="components-table-demo-nested"
          columns={columns}
          expandable={{expandedRowRender, rowExpandable}}
          dataSource={data}
          onChange={handleTableChange}
          pagination={paginationConfig(query, total || 0)}
        />
      </div>
    )
  }
}
