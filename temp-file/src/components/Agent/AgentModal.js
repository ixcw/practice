/**
 *@Author:xiongwei
 *@Description:代理--Modal
 *@Date:Created in  2021/7/8
 *@Modified By:
 */
import React from 'react';
import styles from './AgentModal.less';
import PropTypes from 'prop-types';
import { Modal, Table } from 'antd'
import { dealTimestamp } from '@/utils/utils';
export default class AgentModal extends React.Component {
  static propTypes = {
    type: PropTypes.string,// 判断是分销月报--还是代理明细
  };
  constructor(props) {
    super(...arguments);
    this.state = {
      visible: false,
      record: {},
      selectId: 1,//默认选中
      tableData: {},
      pageSize: 10,
      current: 1,
    }
  }
  componentDidMount() {
    const { handleModal } = this.props;
    const { selectId } = this.state
    this.props.onRef(this);
    // handleModal(selectId)  
  }
  render() {
    const { type, handleModal, loading } = this.props;
    const { visible, record, selectId, tableData, current, pageSize } = this.state;
    const list = [
      {
        name: '区县代理',
        id: 1
      },
      {
        name: '推介代理',
        id: 2
      },
      {
        name: '学校或机构',
        id: 3
      },
    ]
    const onClickSelect = (id) => {
      this.setState({
        selectId: id,
        tableData: {},
        pageSize: 10,
        current: 1,
      })
      //--设置表格数据
      handleModal(id, 10, 1)
    }
    const columns = () => {
      if (selectId == 1 && type == 'AgentDetail' || selectId == 2 && type == 'AgentDetail') {
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
            dataIndex: 'agentUserName',
            key: 'agentUserName',
            render: (text) => text === ' ' ? '--' : text
          },
          {
            title: '代理类型',
            align: 'center',
            key: 'agentId',
            dataIndex: 'agentId',
            render: (text) => {
              if (text == 1) {
                return '市级代理商'
              } else if (text == 2) {
                return '区/县代理'
              } else if (text == 3) {
                return '已冻结'
              } else {
                return '--'
              }
            }
          },
          {
            title: '代理区域',
            align: 'center',
            key: 'areaName',
            dataIndex: 'areaName',
            render: (text) => text === ' ' ? '--' : text
          },
          {
            title: '代理费',
            align: 'center',
            key: 'agentCost',
            dataIndex: 'agentCost',
            render: (text) => text? text.toFixed(2) : "0.00"
          },
          {
            title: '用户数',
            align: 'center',
            key: 'userNnmber',
            dataIndex: 'userNnmber',
            render: (text) => text === ' ' ? '0' : text
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
        ]
      } else if (selectId == 3 && type == 'AgentDetail') {
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
            render: (text) => text === ' ' ? '--' : text
          },
          {
            title: '组织类型',
            align: 'center',
            key: 'organizationType',
            dataIndex: 'organizationType',
            render: (text) => text === ' ' ? '--' : text
          },
          {
            title: '学段',
            align: 'center',
            key: 'study_id',
            dataIndex: 'study_id',
            render: (text) =>text? text.replace("1","小学").replace("2","初中").replace("3","高中").replace("16","专升本"):'--'
          },
          {
            title: '学生用户数',
            align: 'center',
            key: 'userNnmber',
            dataIndex: 'userNnmber',
            render: (text) => text? text : "0"
          },
          {
            title: '所属区域',
            align: 'center',
            key: 'detail_address',
            dataIndex: 'detail_address',
            render: (text) => text === ' ' ? '0' : text
          },
          {
            title: '状态',
            align: 'center',
            key: 'status',
            dataIndex: 'status',
            render: (text) => {
              if(text==1){
                return '待激活'
              }else if(text==2){
                return '已激活'
              }else if(text==3){
                return '已冻结'
              }else{
                return '--'
              }
            }
          },
        ]
      } else {
        return []
      }
    }
    const handleTableChange = (pagination) => {
      this.setState({
        pageSize: pagination.pageSize,
        current: pagination.current,
      })
      handleModal(selectId, pagination.pageSize, pagination.current)
    }
    return (
      <Modal
        visible={visible}
        footer={null}
        width='80%'
        title={record.agentUserName + '   ' + record.area + '代理商'}
        onCancel={() => this.setState({ visible: false, record: {}, selectId: 1, tableData: {} })}
      >
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
            rowKey='id'
            onChange={handleTableChange}
            loading={loading}
            bordered
            pagination={{ total: tableData.total, pageSize: pageSize, current: current, }}
            dataSource={tableData.data}
          />
        </div>
        </div>
      </Modal>
    )
  }
}