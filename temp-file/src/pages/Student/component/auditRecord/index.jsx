/**
 * 学生数据
 * @author:田忆
 * date:2023年4月25日
 * */


import React, { useEffect, memo } from 'react'

import { connect } from 'dva'
import moment from 'moment';
import { StudentData as namespace } from '@/utils/namespace'
import { Modal, Tabs, Form, Row, Col, Image, Spin, Space, Table, Select, Button } from 'antd';
import { useState } from 'react';
import {
  ArrowRightOutlined,

} from '@ant-design/icons';

function index(props) {
  const { auditRecordOpen, showAuditRecord, dispatch, account2, examineStatus1, DictionaryDictGroups } = props
  const [loading, setLoading] = useState(false)
  const [detailsData, setDetailsData] = useState({}) // 存储信息

  const [recordDataSource, setRecordDataSource] = useState([]) // 审核记录表

  const [imageUrl, setImageUrl] = useState([]);
  const [GroundsRejection, setGroundsRejection] = useState('')


  useEffect(() => {
    // //请求学生数据
    // dispatch({
    //   type: namespace + "/getStudentDetails",
    //   payload: { account: account1 },
    //   callback: (res) => {
    //     console.log(res, '学生详情')
    //     setLoading(res.result && res.result.length > 0)
    //     setDetailsData(res?.result)
    //     setGuardians(res?.result?.studentGuardiansList)

    //     setEducational(res?.result?.studentSchoolList)
    //     setFamilyList(res?.result?.uuserFamilyList)
    //     setCheckupList(res?.result?.uuserCheckupList)

    //   }
    // })
    //请求学生详情数据
    console.log(account2, '这是传值数据')
    console.log(examineStatus1, '这是审核的')
    if (account2 !== null && auditRecordOpen) {
      setLoading(true)
      //请求记录
      dispatch({
        type: namespace + "/getApprovedMemo",
        payload: { identityCard: account2, examineStatus: 0 },
        callback: (res) => {
          console.log(res, '审核记录，驳回记录')
          setRecordDataSource(res?.result)
        }
      })

    }
  }, [auditRecordOpen])





  //审核记录头
  const recordColumns = [
    {
      title: '序号',
      key: 'id',
      render: (text, record, index) => {
        return (`${index + 1}`)
      }
    },
    {
      title: '审核状态',
      dataIndex: 'examineStatus',
      key: 'examineStatus',
      render: (examineStatus) => {
        if (examineStatus == 3) {
          return ('通过')
        } else {
          return ('驳回')
        }
      }
    },
    {
      title: '审核时间',
      dataIndex: 'createTime',
      render: (createTime) => {
        return moment(parseInt(createTime, 0)).format("YYYY年-MM月-DD日 HH:mm:ss");
      }
    },
    {
      title: '审核结果',
      render: (_, record) => (
        // <a onClick={() => { setGroundsRejection('驳回理由：' + record.content) }}>查看详情</a>
        <a onClick={() => { ViewDetails(record) }}>查看详情</a>
      )
    },

  ]


  const ViewDetails = (record) => {
    if (record.examineStatus == 3) {
      setGroundsRejection(null)
      setImageUrl(record.confirmPng?.split(",").map((item, index) => ({ img: item, key: index })))
    } else {
      setImageUrl([])
      setGroundsRejection('驳回理由：' + record.content)
    }
  }



  return (
    <div>
      <Modal title="审核记录" visible={auditRecordOpen} width={900} footer={null} destroyOnClose={true} onCancel={() => showAuditRecord(!auditRecordOpen)} bodyStyle={{ padding: '0 24px 24px 24px', }} >
        <Table rowKey={record => record.id} dataSource={recordDataSource} columns={recordColumns} bordered={true} pagination={false} />
        {imageUrl?.length >= 0 &&
          <div style={{ marginTop: '10px' }}>
            <Image.PreviewGroup>
              {
                imageUrl.map(item => {
                  return (
                    <Image key={item.key} src={item.img} />
                  )
                })
              }
            </Image.PreviewGroup>
          </div>
        }
        {GroundsRejection &&
          <div style={{ marginTop: '10px' }}>
            <p>{GroundsRejection}</p>
          </div>
        }
      </Modal>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    DictionaryDictGroups: state[namespace].DictionaryDictGroups,
  }
}
export default memo(connect(mapStateToProps)(index))
