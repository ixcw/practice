/**
 *@Author:ChaiLong
 *@Description:点阵笔管理
 *@Date:Created in  2021/6/15
 *@Modified By:
 * @updateAuthor:张江
 * @updateVersion:v1.0.1
 * @updateDate:2021年09月28日
 * @description 更新描述:优化列表 显示点阵笔名称 添加唯一key
 */
import React from 'react';
import styles from './penManage.less'
import {Button, Table, Popconfirm, Empty} from 'antd'
import {EditOutlined} from '@ant-design/icons'
import {PlusOutlined, UploadOutlined} from '@ant-design/icons'
import AddModifyPen from "./components/addModifyPen";
import {connect} from 'dva'
import BatchImport from "./components/batchImport";
import {PenManage as namespace} from '@/utils/namespace'
import {existArr, getLocationObj, replaceSearch} from "@/utils/utils";
import { pumaNodeTypeList } from "@/utils/const";
import paginationConfig from "@/utils/pagination";
import Page from "@/components/Pages/page";
import AddClassroomModal from "./components/addClassroomModal";

@connect(state => ({
  penList: state[namespace].findPenList,//笔列表
  findRoomInfo: state[namespace].findRoomInfo,//教室列表
  loading: state[namespace].loading,//加载状态
}))
export default class PenManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getAddModifyRef = (ref) => {
    this.addModifyRef = ref
  }

  getBatchImportRef = (ref) => {
    this.batchImportRef = ref
  }

  getClassroomRef = (ref) => {
    this.classroomRef = ref;
  }

  render() {
    const {location, penList, dispatch, loading, findRoomInfo} = this.props;
    const {query} = getLocationObj(location)
    const title = '学生班级报告';
    const breadcrumb = [title];
    const header = (
      <Page.Header breadcrumb={breadcrumb} title={title}/>
    );
    const _findRoomInfo = existArr(findRoomInfo);
    /**
     * 删除点阵笔
     * @param id
     */
    const deletePen = (id) => {
      dispatch({
        type: namespace + '/deletePenInformationById',
        payload: {
          id
        },
        callback: () => {
          dispatch({
            type: namespace + '/findPenList',
            payload: {
              roomId:query?.id,
              page: query.p || 1,
              size: 10
            }
          })
        }
      })
    }


    const columns = [
      {
        title: '序号',
        dataIndex: 'code',
        key: 'code',
        render: text => <a>{text}</a>,
      },
      {
        title: '点阵笔序列号',
        dataIndex: 'penSerial',
        key: 'penSerial',
      },
      {
        title: '点阵笔名称',
        dataIndex: 'penName',
        key: 'penName',
      },
      {
        title: '点阵笔类型',
        key: 'penType',
        dataIndex: 'penType',
        render: text => <span>{pumaNodeTypeList[Number(text)-1]?.name}</span>,
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <div>
            <a onClick={() => openModal(record)}>编辑</a>
            <Popconfirm
              placement="top"
              title={'确认删除当前只能笔么？'}
              onConfirm={() => deletePen(record.id || record.code)}
              okText="确认"
              cancelText="取消"
            >
              <a style={{marginLeft: '12px'}}>删除</a>
            </Popconfirm>
          </div>
        )
      }
    ];

    const openModal = (record) => {
      this.addModifyRef.handleSwitch(record)
    }

    const openBatchImport = () => {
      this.batchImportRef.handleSwitch()
    }

    /* 改变表格
      * @param pagination  ：页码
      */
    const handleTableChange = (pagination) => {
      const _query = {...query, p: pagination.current}
      replaceSearch(dispatch, location, _query)
    };

    /**
     * 打开modal新增或编辑
     * @param record
     */
    const openClassroomModal = (record) => {
      this.classroomRef.switchOnOff(true, record)
    }

    /**
     * 下载通用答题卡
     */
    // const downLoadAnswerCar = () => {
    //   dispatch({
    //     type: namespace + '/getConnectionCard',
    //     callback: (request) => {
    //       window.open(`${request?.url}`)
    //     }
    //   })
    // }

    return (
      <Page header={header} loading={!!loading}>
        <div id={styles['penManage']}>
          <div className={styles['penManageHeader']}>
            {/*<Button type="primary" onClick={downLoadAnswerCar}>下载通用答题卡</Button>*/}
            <Button size={'large'} onClick={openClassroomModal}>创建教室</Button>
            <div className={styles['contentBox']}>
              <div className={styles['classBox']}>
                {_findRoomInfo ? _findRoomInfo.map((item) =>
                  <div key={item.id} onClick={() => replaceSearch(dispatch, location, {...query, id: item.id})}
                         className={`${styles['classEdit']} ${query?.id == item.id ? styles['isClassroom'] : ''}`}>
                      <div className={styles['class']}>{item.name}</div>
                      <EditOutlined style={{color: query?.id == item.id ? 'white' : ''}}
                                    onClick={() => openClassroomModal(item)} className={styles['editOutlined']}/></div>)
                  : <Empty/>
                }
              </div>
              {query?.id?<div className={styles['penBox']}>
                <div className={styles['title']}>
                  <div className={styles['leftBox']}>
                    点阵笔：<span>{penList?.total}</span>
                  </div>
                  <div className={styles['rightBox']}>
                    <Button onClick={openBatchImport} icon={<UploadOutlined/>}>批量导入</Button>
                    <Button type="primary" className={styles['add']} icon={<PlusOutlined/>}
                            onClick={openModal}>添加</Button>
                  </div>
                </div>
                <div className={styles['penManageContent']}>
                  <Table
                    rowKey={'penSerial'}
                    pagination={paginationConfig({s: 10, p: query.p}, penList?.total || 0)}
                    onChange={handleTableChange} columns={columns} dataSource={penList?.data || []}/>
                </div>
              </div>:<Empty style={{margin:'0 auto'}}/>}
            </div>
          </div>
          <AddModifyPen location={location} onRef={this.getAddModifyRef}/>
          <BatchImport query={query} onRef={this.getBatchImportRef}/>
          <AddClassroomModal onRef={this.getClassroomRef}/>
        </div>
      </Page>
    )
  }
}
