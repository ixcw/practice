/**
 *@Author:xiongwei
 *@Description:代理明细
 *@Date:Created in  2021/7/8
 *@Modified By:
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './index.less';
import { Input, Select, Button, Table, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import queryString from 'query-string'
import paginationConfig from '@/utils/pagination';
import { existArr, dealTimestamp } from "@/utils/utils";
import { AgentDetail as namespace } from '@/utils/namespace';
import Page from "@/components/Pages/page";
import AgentBox from "@/components/Agent/AgentBox";
import AgentModal from "@/components/Agent/AgentModal";
import userInfoCache from '@/caches/userInfo';//登录用户的信息
const { Option } = Select;
@connect(state => ({
  loading: state[namespace].loading,
  agentStatistics: state[namespace].agentStatistics,//统计
  findAgentUser: state[namespace].findAgentUser,//代理商查询(代理明细)
  directUserList: state[namespace].directUserList,//直接用户
}))
export default class AgentDetail extends React.Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      selectId: 1,//默认选中
      tableData: {},
      pageSize: 10,
      current: 1,
    }
  }
  componentWillUnmount() {
    const { dispatch, location } = this.props;
  }
  UNSAFE_componentWillMount() {
    const { dispatch, location } = this.props;
    dispatch({
      type: namespace + '/agentStatistics',
      payload: {

      }
    })
    dispatch({
      type: namespace + '/directUserList',
      payload: {
        // parentId:this.detailRef.state.record.parentId,
        page: 1,
        size: 10
      },
      callback: (res) => {
        this.setState({
          tableData: { ...res }
        })
      }
    })
  }
  /**
   * 根据传入的对象，往地址栏添加对应的参数
   * @param obj  ：参数对象
   */
  replaceSearch = (obj) => {
    const { dispatch, location } = this.props;
    const { search, pathname } = location;
    let query = queryString.parse(search);
    query = { ...query, ...obj };
    // this.uploadUserExcelModalCancel();
    //修改地址栏最新的请求参数
    dispatch(routerRedux.replace({
      pathname,
      search: queryString.stringify(query),
    }));
  };
  render() {
    const { agentStatistics = {}, loading } = this.props;
    const {
      selectId,//默认选中
      tableData,
      pageSize,
      current,
    } = this.state;
    const userInfo = userInfoCache() || {};
    const columns = () => {
      if (selectId == 1) {
        return [
          {
            title: '序号',
            align: 'center',
            key: 'index',
            render: (text, record, index) => index + 1
          },
          {
            title: '学生姓名',
            align: 'center',
            dataIndex: 'name',
            key: 'name',
            render: (text) => text ? text : '--'
          },
          {
            title: '学生账号',
            align: 'center',
            key: 'phone',
            dataIndex: 'phone',
            render: (text,record) => text||record.account ? text||record.account : '--'
          },
          {
            title: '所属学校',
            align: 'center',
            key: 'schoolName',
            dataIndex: 'schoolName',
            render: (text) => text ? text : '--'
          },
          {
            title: '年级',
            align: 'center',
            key: 'grade',
            dataIndex: 'grade',
            render: (text) => text ? text : '--'
          },
          {
            title: '邀请时间',
            align: 'center',
            key: 'inviteTime',
            dataIndex: 'inviteTime',
            render: (text) => text ? dealTimestamp(text, 'YYYY-MM-DD HH:mm:ss') : '--'
          },
        ]
      } else if (selectId == 2) {
        return [
          {
            title: '序号',
            align: 'center',
            key: 'index',
            render: (text, record, index) => index + 1
          },
          {
            title: '代理商名称',
            align: 'center',
            dataIndex: 'name',
            key: 'name',
            render: (text) => text ? text : '--'
          },
          {
            title: '代理商手机号',
            align: 'center',
            key: 'phone',
            dataIndex: 'phone',
            render: (text) => text ? text : '--'
          },
          {
            title: '名下总用户数(个)',
            align: 'center',
            key: 'directUser',
            dataIndex: 'directUser',
            render: (text) => text ? text : '0'
          },
          {
            title: '名下学校或机构(个)',
            align: 'center',
            key: 'schoolTotal',
            dataIndex: 'schoolTotal',
            render: (text) => text ? text : '0'
          },
          {
            title: '代理开始时间',
            align: 'center',
            key: 'startAgentDate',
            dataIndex: 'startAgentDate',
            render: (text) => text ? dealTimestamp(text, 'YYYY-MM-DD') : '--'
          },
          {
            title: '代理结束时间',
            align: 'center',
            key: 'endAgentDate',
            dataIndex: 'endAgentDate',
            render: (text) => text ? dealTimestamp(text, 'YYYY-MM-DD') : '--'
          },
          {
            title: '状态',
            align: 'center',
            key: 'statusId',
            dataIndex: 'statusId',
            render: (text) => {
              if (text == 1) {
                return <span style={{ color: '' }}>待激活</span>
              } else if (text == 2) {
                return <span style={{ color: '#007ACC' }}>已激活</span>
              } else if (text == 3) {
                return <span style={{ color: '#FF1E00' }}>已冻结</span>
              } else {
                return "--"
              }
            }
          },
        ]
      } else if (selectId == 3) {
        return [
          {
            title: '序号',
            align: 'center',
            key: 'index',
            render: (text, record, index) => index + 1
          },
          {
            title: '学校/机构',
            align: 'center',
            dataIndex: 'name',
            key: 'name',
            render: (text) => text ? text : '--'
          },
          {
            title: '组织类型',
            align: 'center',
            key: 'organizationType',
            dataIndex: 'organizationType',
            render: (text) => text ? text : '--'
          },
          {
            title: '学段',
            align: 'center',
            key: 'studyId',
            dataIndex: 'studyId',
            render: (text) => text ? text.replace("1", "小学").replace("2", "初中").replace("3", "高中").replace("16", "专升本") : '--'
          },
          {
            title: '名下注册用户数',
            align: 'center',
            key: 'agentSchoolTotal',
            dataIndex: 'agentSchoolTotal',
            render: (text) => text ? text : "0"
          },
          {
            title: '所属区域',
            align: 'center',
            key: 'detailAddress',
            dataIndex: 'detailAddress',
            render: (text) => text === ' ' ? '0' : text
          },
          {
            title: '状态',
            align: 'center',
            key: 'statusId',
            dataIndex: 'statusId',
            render: (text) => {
              if (text == 1) {
                return <span style={{ color: '' }}>待激活</span>
              } else if (text == 2) {
                return <span style={{ color: '#007ACC' }}>已激活</span>
              } else if (text == 3) {
                return <span style={{ color: '#FF1E00' }}>已冻结</span>
              } else {
                return "--"
              }
            }
          },
        ]
      } else {
        return []
      }
    }
    const list = userInfo.agentId == 2 ? [
      {
        name: '直接用户',
        id: 1
      },
      // {
      //   name: '二级代理',
      //   id: 2
      // },
      {
        name: '学校或机构',
        id: 3
      },
    ] : [
      {
        name: '直接用户',
        id: 1
      },
      {
        name: '二级代理',
        id: 2
      },
      {
        name: '学校或机构',
        id: 3
      },
    ]
    const onClickSelect = (id) => {//拉取数据
      this.setState({
        selectId: id,
        tableData: {},
        pageSize: 10,
        current: 1,
      })
      // //--设置表格数据
      handleModal(id, 10, 1)
    }
    const handleTableChange = (pagination) => {
      this.setState({
        pageSize: pagination.pageSize,
        current: pagination.current,
      })
      handleModal(selectId, pagination.pageSize, pagination.current)
    }
    const handleModal = (id, pageSize, current) => {
      const { dispatch } = this.props
      if (id == 1) {
        dispatch({
          type: namespace + '/directUserList',
          payload: {
            // parentId:this.detailRef.state.record.parentId,
            page: current,
            size: pageSize
          },
          callback: (res) => {
            this.setState({
              tableData: { ...res }
            })
          }
        })
      }
      if (id == 2) {
        dispatch({
          type: namespace + '/agentUsersByParentId',
          payload: {
            // otherInviteCode:this.detailRef.state.record.otherInviteCode,
            page: current,
            size: pageSize
          },
          callback: (res) => {
            this.setState({
              tableData: { ...res }
            })
          }
        })
      }
      if (id == 3) {
        dispatch({
          type: namespace + '/schoolByUserIdList',
          payload: {
            // agentAreaId:this.detailRef.state.record.agentAreaId,
            page: current,
            size: pageSize
          },
          callback: (res) => {
            this.setState({
              tableData: { ...res }
            })
          }
        })
      }
    }
    return (
      // <Page header={header} loading={false}>
      <div className={styles['wrap']}>
        <div className={styles['header']}>
          <AgentBox title='名下代理总用户数' subTitle={`${agentStatistics.directTotal || 0} 人`} />
          <AgentBox title='名下二级代理' subTitle={`${agentStatistics.secondLevel || 0} 个`} />
          <AgentBox title='名下学校或机构总数' subTitle={`${agentStatistics.schoolTotal || 0} 个`} />
          <AgentBox title='名下总收入' subTitle={`${agentStatistics.orderTotal || 0} 元`} />
        </div>
        <div>
          <div className={styles['select']}>
            {
              list.map(({ name, id }) =>
                <div
                  className={styles['item']}
                  key={id}
                  onClick={() => { onClickSelect(id) }}
                  style={{ backgroundColor: selectId == id && '#268BFF', color: selectId == id && '#fff' }}>
                  {name}
                </div>)
            }
          </div>
          <div>
            <Table columns={[...columns()]}
              rowKey={tableData.data && tableData.data[0] && tableData.data[0].id ? 'id' : 'endAgentDate'}
              onChange={handleTableChange}
              loading={loading}
              bordered
              pagination={{ total: tableData.total, pageSize: pageSize, current: current, }}
              dataSource={tableData.data}
            />
          </div>
        </div>
      </div>
      // </Page>
    )
  }
}
