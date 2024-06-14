import React, { useState, useEffect } from "react";
import { connect } from "dva";
import { Attendance as namespace } from "@/utils/namespace";
import accessTokenCache from "@/caches/accessToken";
import moment from "moment";
import styles from "./index.less";
import {ExclamationCircleOutlined} from "@ant-design/icons";
import { Col, Row, Button, message, Input, Select, Table, Pagination, Modal, DatePicker, Space, Spin} from 'antd'

const { confirm } = Modal;

const AttendancePerson = (props) => {
  const token = accessTokenCache() && accessTokenCache();
  const {
    dispatch,
    FindAllSectionOptions,
    showComponent,
    setShowComponent,
    ClassInfoOptions,
  } = props;
  const [AllScreening, setAllScreening] = useState({});
  const [listDataTotal, setListDataTotal] = useState(0);
  const [ListDataCurrentPage, setListDataCurrentPage] = useState(1);
  const [ListDataPageSize, setListDataPageSize] = useState(10);
  const [listDataSource, setListDataSource] = useState([]);
  const [findAllSecList, setfindAllSecList] = useState([]);
  const [askForLeave, setAskForLeave] = useState([]);
  const [askForLeaves, getAskForLeave] = useState([]);
  const [connectionPeoplesLiss, setConnectionPeoples] = useState([]);
  const [loading, setLoading] = useState(false)
  const InitialDate = moment(); //默认当前时间


  //查看所有课节
  const getfindAllSectionList = () => {
    dispatch({
      type: namespace + "/getFindAllSectionApi",
      payload: {},
      callback: (res) => {
        if (res.result) {
          setfindAllSecList(
            res.result.map((result) => {
              return {
                label: result.sectionName,
                value: result.id,
              };
            })
          );
        }
      },
    });
  };

  //分页查询考勤管理
  const getAttendanList = (page = 1, size = 10, value) => {
    dispatch({
      type: namespace + "/postPageFindAttendanceRecordApi",
      payload: { page, size, ...value },
      callback: (res) => {
        if (res) {
          setListDataSource(
            res.result.data?.records?.map((item) => {
              return { ...item, key: item.id };
            })
          );
          setListDataTotal(res?.result?.data?.total);
          setListDataCurrentPage(res?.result?.data?.current);
        }
      },
    });
  };

  useEffect(() => {
    setAllScreening(AllScreening);
    getAttendanList(ListDataCurrentPage, ListDataPageSize, AllScreening);
    getfindAllSectionList();
  }, [AllScreening]);

  useEffect(() => {
    // 请求班级列表
    dispatch({
      type: namespace + "/postFindMyClassInfoApi",
    });
  }, []);

  const handleClick = () => {
    setShowComponent({ ...showComponent, add: true });
  };
  const onSwitchHandleClick = () => {
    setShowComponent({ ...showComponent, switch: !showComponent.switch });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
        setAskForLeave([])
				getAskForLeave([])
				setConnectionPeoples([])
  };
  //查看班级记录详情
  const sendTeacherDetailId = (id) => {
    setLoading(true)
    dispatch({
      type: namespace + "/getFindDetailByIdApi",
      payload: { detailId: id },
      callback: (res) => {
        if (res.result?.code === 200) {
          setLoading(false)
          setAskForLeave(res.result?.data)
          getAskForLeave(res.result?.data?.classCheckWorkVo)
          setConnectionPeoples(res.result?.data?.connectionPeoples)
        } else { 
          setLoading(false)
        }
      },
    });
  };

  const columns = [
    {
      title: "序号",
      dataIndex: "name",
      width: 70,
      key: "1",
      render: (text, record, index) =>
        (ListDataCurrentPage - 1) * 10 + index + 1,
    },
    {
      title: "记录时间",
      dataIndex: "createTime",
      width: 140,
      key: "createTime",
      render: (_, record) => {
        if (record.createTime) {
          const date = new Date(record.createTime);
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const day = date.getDate();
          const hours = date.getHours();
          const minutes = date.getMinutes();

          return `${year}-${month}-${day} ${hours}:${minutes}`;
        } else {
          return "";
        }
      },
    },
    {
      title: "班级名称",
      dataIndex: "className",
      width: 150,
      key: "className",
    },
    {
      title: "节次",
      dataIndex: "sectionText",
      key: "sectionText",
      width: 100,
    },
    {
      title: "上课时间",
      dataIndex: "ymd",
      key: "ymd",
      width: 120,
      render: (_, record) =>
        record.ymd &&
        new Date(record.ymd).getFullYear() +
          "-" +
          (new Date(record.ymd).getMonth() + 1) +
          "-" +
          new Date(record.ymd).getDate(),
    },
    {
      title: "应到人数",
      dataIndex: "totalNum",
      width: 100,
      key: "totalNum",
    },
    {
      title: "实到人数",
      dataIndex: "realNum",
      width: 100,
      key: "realNum",
    },
    {
      title: "缺勤人数",
      dataIndex: "notAppearNum",
      width: 100,
      key: "notAppearNum",
    },
    {
      title: "缺勤学生姓名",
      dataIndex: "studentName",
      key: "studentName",
      width: 130,
    },
    {
      title: "是否请假",
      dataIndex: "isLeave",
      key: "isLeave",
      width: 100,
      render: (text, record) => {
        let isLeaveLabel = "";
        if (record.isLeave === 0) {
          isLeaveLabel = "否";
        } else if (record.isLeave === 1) {
          isLeaveLabel = "是";
        }
        return isLeaveLabel;
      },
    },
    {
      title: "请假类型",
      dataIndex: "leaveType",
      key: "leaveType",
      width: 100,
      render: (text, record) => {
        let leaveTypeLabel = "";
        if (record.leaveType === 1) {
					leaveTypeLabel = '事假'
				} else if (record.leaveType === 2) {
					leaveTypeLabel = '病假'
				} else if (record.leaveType === 3) {
					leaveTypeLabel = '其他'
				} else if (record.leaveType === 4) {
					leaveTypeLabel = '未请假'
				}
        return leaveTypeLabel;
      },
    },
    {
      title: "任课教师",
      dataIndex: "teacherName",
      key: "teacherName",
      width: 100,
    },
    {
      title: "请假原因",
      key: "tags",
      dataIndex: "tags",
      width: 140,
      render: (_, record) => {
        return (
          <Row>
            <Button
              type="primary"
              onClick={() => {
                showModal();
                // showTeacherDetails();
                sendTeacherDetailId(record.id);
              }}
            >
              请假详情
            </Button>
          </Row>
        );
      },
    },
  ];

  // 筛选事件
  const onTeacherNameSearch = (value) => {
    setAllScreening({ ...AllScreening, classId: value });
  };
  //节课事件
  const handleSexChange = (value) => {
    setAllScreening({ ...AllScreening, section: value });
  };
  //学生姓名
  const handleInputChange = (e) => {
    setAllScreening({ ...AllScreening, studentName: e.target.value });
  };

  const handleChange = (e) => {
    setAllScreening({ ...AllScreening, teacherName: e.target.value });
  };

  const handleSelectChange = (value) => {
    setAllScreening({ ...AllScreening, timePeriod: value });
  };

  const handleSelChange = (value) => {
    setAllScreening({ ...AllScreening, leaveType: value });
  };
  // 处理日期变化
  const onChangeSaw = (date) => {
    setAllScreening({
      ...AllScreening,
      sectionTime: moment(date)?.startOf("day")?.valueOf(),
    });
  };

  // 限制可选择的时间
  const disabledDate = (current) => {
    return current && current > moment().endOf("day");
  };

  // 表格分页
  const onPaginationChange = (page, size) => {
    getAttendanList(page, size, AllScreening);
    setListDataCurrentPage(page);
    setListDataPageSize(size);
  };

  // // 批量导出
  const onBatchDerive = (e) => {
    confirm({
      title: "导出提示",
      icon: <ExclamationCircleOutlined />,
      content: "您即将导出考勤数据!",
      onOk() {
        function request() {
          const xhr = new XMLHttpRequest();
          xhr.open(
            "POST",
            "/auth/web/v1/attendance/record/exportAttendanceRecord",
            true
          );
          xhr.responseType = "blob";
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.setRequestHeader("Authorization", token);
          xhr.onload = function () {
            download(xhr.response);
          };
          xhr.send(
            JSON.stringify({
              // ...{ page: 1, size: 10 },
              ...AllScreening,
            })
          );
        }

        function download(blobUrl) {
          const xlsx = "application/vnd.ms-excel;charset=UTF-8";
          const blob = new Blob([blobUrl], { type: xlsx });
          const a = document.createElement("a");
          a.download = "考勤批量导出数据.xls";
          a.href = window.URL.createObjectURL(blob);
          a.click();
          a.remove();
          message.success("考勤数据批量导出已下载！");
        }
        request();
      },
      onCancel() {},
    });
  };

  const newClassList = connectionPeoplesLiss?.map((item) => {
    return (
      <span key={item.phone}>
        {item.name}：{item.phone}&emsp;&emsp;&emsp;&emsp;
      </span>
    );
  });

  return (
		<div id={styles['attendancePerson']}>
			<div className={styles.container}>
				{/* 上部分内容 */}
				<div className={styles.top}>
					<div className={styles.xue}></div>
					<div className={styles.sheng}>历史考勤记录</div>
					<div className={`${styles['my-div']}`}>
						<div>
							{window.$PowerUtils.judgeButtonAuth(window.location.hash.replace(/^#/, ''), '编辑') ? (
								<Button type='primary' onClick={handleClick} className={styles.BtnSty}>
									记录考勤
								</Button>
							) : (
								''
							)}
						</div>
						<Button onClick={onSwitchHandleClick} className={styles.BtnSty2}>
							按节次查看
						</Button>
						<Button onClick={onBatchDerive}>导出</Button>
					</div>
				</div>

				{/* 中间部分内容 */}
				<div className={styles.middle}>
					<Row style={{ marginTop: 20, marginRight: 20 }}>
						<Col span={24}>
							<Space size={[10, 14]} wrap>
								<Space style={{ marginRight: 30 }}>
									班级名称：
									<Select
										placeholder='请输入班级名称'
										filterOption={(inputValue, option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0}
										showSearch
										allowClear
										style={{ width: 200 }}
										onChange={onTeacherNameSearch}
										options={ClassInfoOptions}
									/>
								</Space>

								<Space style={{ marginRight: 30 }}>
									节次：
									<Select
										options={FindAllSectionOptions}
										filterOption={(inputValue, option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0}
										onChange={handleSexChange}
										showSearch
										allowClear
										style={{ width: 200 }}
									/>
								</Space>
								<Space style={{ marginRight: 30 }}>
									缺勤学生姓名：
									<Input
										allowClear
										placeholder='请输入学生姓名'
										onChange={handleInputChange}
										filterOption={(inputValue, option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0}
										style={{ width: 200 }}
									/>
								</Space>
								<Space style={{ marginRight: 30 }}>
									任课教师：
									<Input
										allowClear
										filterOption={(inputValue, option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0}
										placeholder='请输入任课教师'
										onChange={handleChange}
										style={{ width: 200 }}
									/>
								</Space>
								<Space style={{ marginRight: 30 }}>
									记录时间：
									<Select
										defaultValue='全部'
										allowClear
										onChange={handleSelectChange}
										style={{ width: 200 }}
										options={[
											{
												value: '0',
												label: '全部'
											},
											{
												value: '1',
												label: '本周'
											},
											{
												value: '2',
												label: '上周'
											}
										]}
									/>
								</Space>
								<Space style={{ marginRight: 30 }}>
									请假类型：
									<Select
										defaultValue='全部'
										allowClear
										onChange={handleSelChange}
										style={{ width: 200 }}
										options={[
											{
												value: '0',
												label: '全部'
											},
											{
												value: '1',
												label: '事假'
											},
											{
												value: '2',
												label: '病假'
											},
											{
												value: '3',
												label: '其他'
											},
											{
												value: '4',
												label: '未请假'
											}
										]}
									/>
								</Space>
								<Space style={{ marginRight: 30 }}>
									任课时间：
									<DatePicker allowClear disabledDate={disabledDate} onChange={onChangeSaw} style={{ width: 200 }} />
								</Space>
							</Space>
						</Col>
					</Row>
					<Row style={{ marginTop: 20 }}>
						<Col span={24}>
							<Table
								className='table-container'
								columns={columns}
								dataSource={listDataSource}
								bordered
								pagination={false}
								scroll={{
									y: 400
								}}
							/>
							<Pagination
								showSizeChanger
								onChange={onPaginationChange}
								total={listDataTotal}
								current={ListDataCurrentPage}
								defaultPageSize={10}
								showTotal={listDataTotal => `总计 ${listDataTotal} 人`}
								style={{
									marginTop: '30px',
									display: 'flex',
									justifyContent: 'center'
								}}
							/>
						</Col>
					</Row>
				</div>
				<Modal
					className={styles.centeredTitle}
					title='请假详情'
					onCancel={handleCancel}
					width={1000}
					footer={[
						<Button style={{ marginRight: 430 }} key='cancel' onClick={handleCancel}>
							返回
						</Button>
					]}
					visible={isModalOpen}>
					<Spin spinning={loading}>
						<Row style={{ marginTop: 30 }}>
							<Col span={6}>
								记录时间：
								{new Date(askForLeaves?.createTime)
									.toLocaleString('zh-CN', {
										year: 'numeric',
										month: '2-digit',
										day: '2-digit',
										hour: '2-digit',
										minute: '2-digit'
									})
									.replace(/\//g, '-') // 替换斜杠为"年"
									.replace(' ', '-') // 添加"月"并替换空格
									.replace(':', ':')}
							</Col>
							<Col span={6}>任课教师：{askForLeaves?.teacherName} </Col>
							<Col span={6}>
								上课时间：
								{new Date(askForLeaves?.ymd)
									.toLocaleString('zh-CN', {
										year: 'numeric',
										month: '2-digit',
										day: '2-digit'
									})
									.replace(/\//g, '-') // 替换斜杠为横杠
									.replace(/\s/g, '-')}
							</Col>
							<Col span={6}>班级名称：{askForLeaves?.className}</Col>
						</Row>
						<Row style={{ marginTop: 30 }}>
							<Col span={6}>节次：{askForLeaves?.sectionText}</Col>
							<Col span={6}>实到人数：{askForLeaves?.realNum}人</Col>
							<Col span={6}>应到人数：{askForLeaves?.totalNum}人</Col>
							<Col span={6}>缺勤人数：{askForLeaves?.notAppearNum}人</Col>
						</Row>
						<Row style={{ marginTop: 30 }}>
							<Col span={6}>缺勤人姓名：{askForLeave?.studentName}</Col>
							<Col span={6}>
								是否请假：
								{askForLeave?.isLeave === 0 ? '否' : askForLeave?.isLeave === 1 ? '是' : ''}
							</Col>
							{askForLeave?.isLeave === 0 ? null : (
								<Col span={6}>
									请假类型：
									{askForLeave?.leaveType === 1 ? '事假' : askForLeave?.leaveType === 2 ? '病假' : askForLeave?.leaveType === 3 ? '其他' : ''}
								</Col>
							)}
						</Row>
						{askForLeave?.isLeave === 0 ? null : (
							<Row style={{ marginTop: 30 }}>
								<Col span={6}>请假时长：{askForLeave.timeDuration}</Col>
								<Col>
									{askForLeave.ymdStart && askForLeave.ymdEnd && (
										<>
											请假时间:
											{moment(askForLeave.ymdStart).format('YYYY年M月D日 HH:mm')}-{moment(askForLeave.ymdEnd).format('YYYY年M月D日 HH:mm')}
										</>
									)}
								</Col>
							</Row>
						)}
						{askForLeave?.isLeave === 0 ? null : (
							<Row style={{ marginTop: 30 }}>
								<Col>请假原因：{askForLeave?.reason}</Col>
							</Row>
						)}
						{askForLeave?.isLeave === 0 && (
							<Row style={{ marginTop: 30 }}>
								<Col span={20}>
									联系家长：
									<div style={{ marginLeft: 70, marginTop: -22 }}>{newClassList ? newClassList : <span style={{ color: '#2f78ff' }}>该学生未完善家长联系方式</span>}</div>
								</Col>
							</Row>
						)}
					</Spin>
				</Modal>
			</div>
		</div>
	)
};

const mapStateToProps = (state) => {
  return {
    FindAllSectionOptions: state[namespace].FindAllSectionOptions,
    ClassInfoOptions: state[namespace].ClassInfoOptions,
  };
};

export default connect(mapStateToProps)(AttendancePerson);
