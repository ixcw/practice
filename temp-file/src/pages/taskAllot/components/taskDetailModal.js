/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2020/12/4
 *@Modified By:
 */
import React from 'react'
import {Modal, Table, Button} from 'antd'
import styles from './taskAllotModal.less'
import {connect} from 'dva'
import {TaskAllot as namespace} from '@/utils/namespace'
import {existObj} from "@/utils/utils";

@connect(state => ({
  initTaskAllocation: state[namespace].initTaskAllocation,//任务分配知识点初始化
  loading: state[namespace].loading
}))
export default class TaskDetailModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false
    }
  }

  componentDidMount() {
    this.props.onRef(this)
  }


  /**
   *  modal开关
   * @param status
   */
  switchForTaskDetail = (status) => {
    let objStatus = {};
    //关闭清空
    if (!status) {
      this.props.dispatch({
        type: namespace + '/set',
        payload: {
          initTaskAllocation: []
        }
      })
    }
    objStatus.isModalVisible = status;
    this.setState(objStatus)
  }

  /**
   * 打开任务分配并且初始化
   * @param obj
   */
  openTaskDetail = (obj) => {
    this.switchForTaskDetail(true)
    this.setState({memberRecord: obj})
  }

  render() {
    const {isModalVisible} = this.state;
    const {loading, getTaskDetail = {}} = this.props;
    const {taskDetailVOArrayList = []} = existObj(getTaskDetail) || {};
    const particularsList = () => {
      //详情列表
      const ParticularsList = [];
      taskDetailVOArrayList.map((item, index) => {
        item.key = index;
        ParticularsList.push(item)
      })
      ParticularsList.push(...[{
        key: 'key1',
        bigKnowledgeName: "",
        smallKnowledgeName: "smallKnowledgeName1",
        totalQuestionNum: getTaskDetail.totalCountQuestionNum || 0,
        totalQuestionSetNum: getTaskDetail.totalCountQuestionSetParamNum || 0,
        uploadVedioNum: getTaskDetail.totalCountQuestionVideoNum || 0,
      }, {
        key: 'key2',
        bigKnowledgeName: "",
        smallKnowledgeName: "smallKnowledgeName2",
        totalQuestionNum: '',
        totalQuestionSetNum: getTaskDetail.surplusCountQuestionSetParamNum || 0,
        uploadVedioNum: getTaskDetail.surplusCountQuestionVideoNum || 0,
      }])

      return ParticularsList
    };

    const ModalColumns = [
      {
        title: '序号',
        align: 'center',
        key: 'index',
        render: (value, row, index) => {
          const obj = {
            children: <span style={{color: 'red'}}>合计</span>,
            props: {},
          };
          if (index < taskDetailVOArrayList.length) {
            return index + 1
          }
          if (index === taskDetailVOArrayList.length) {
            // obj.props.rowSpan = 2;
            obj.props.colSpan = 3;

          }
          if (index === taskDetailVOArrayList.length + 1) {
            obj.children = <span style={{color: 'red'}}>剩余</span>;
            obj.props.colSpan = 4;

          }

          return obj;
        },
      },
      {
        title: '大知识点',
        dataIndex: 'bigKnowledgeName',
        key: 'bigKnowledgeName',
        align: 'center',
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === taskDetailVOArrayList.length) {
            // obj.props.rowSpan = 2;
            obj.props.colSpan = 0;

          }
          if (index === taskDetailVOArrayList.length + 1) {
            // obj.props.rowSpan = 2;
            obj.props.colSpan = 0;

          }
          return obj;
        },
      },
      {
        title: '小知识点',
        dataIndex: 'smallKnowledgeName',
        key: 'smallKnowledgeName',
        align: 'center',
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === taskDetailVOArrayList.length) {
            // obj.props.rowSpan = 2;
            obj.props.colSpan = 0;

          }
          if (index === taskDetailVOArrayList.length + 1) {
            // obj.props.rowSpan = 2;
            obj.props.colSpan = 0;

          }
          return obj;
        },
      },
      {
        title: '总设参任务数',
        dataIndex: 'totalQuestionNum',
        key: 'totalQuestionNum',
        align: 'center',
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === taskDetailVOArrayList.length + 1) {
            // obj.props.rowSpan = 2;
            obj.props.colSpan = 0;
          }
          return obj;
        },
      },
      {
        title: '已设参',
        dataIndex: 'totalQuestionSetNum',
        key: 'totalQuestionSetNum',
        align: 'center',
      },
      {
        title: '已上传微课',
        dataIndex: 'uploadVedioNum',
        key: 'uploadVedioNum',
        align: 'center',
      },
    ]
    return (<div className={styles['taskAllotModal']}>
      <Modal
        className='taskAllotModal'
        title="分配任务"
        visible={isModalVisible}
        width='800'
        onCancel={() => this.switchForTaskDetail(false)}
        footer={[
          <Button key="submit" type="primary" loading={loading} onClick={() => this.switchForTaskDetail(false)}>
            确定
          </Button>,
        ]}
      >
        <Table
          bordered
          onRow={(record, index) => {
            if (index == taskDetailVOArrayList.length || index == taskDetailVOArrayList.length + 1) {
              return {style: {backgroundColor: 'rgb(180, 180, 180)'},}
            }
          }} rowKey='key' columns={ModalColumns} dataSource={particularsList()} pagination={false}/>
      </Modal>
    </div>)
  }
}
