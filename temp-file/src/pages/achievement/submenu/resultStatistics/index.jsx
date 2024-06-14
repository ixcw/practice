import { useEffect, useState } from "react";
import { connect } from "dva";
import { AchievementSubmenu as namespace } from "@/utils/namespace";
import AddAndEditModal from "./components/AddAndEdit";
import Details from "./components/details";
import {
  Row,
  Col,
  Button,
  Select,
  Input,
  Table,
  Space,
  Spin,
  Modal,
  message,
  Image,
} from "antd";
import {
  SearchOutlined,
  DeliveredProcedureOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import accessTokenCache from "@/caches/accessToken";
const { confirm } = Modal;
const token = accessTokenCache() && accessTokenCache();
// import * as XLSX from 'xlsx' // 导出为Excel文件所需的库

const ResultStatistics = ({ dispatch, visible, detailsVisible }) => {
  const [loading, setLoading] = useState(true); // 是否为加载状态

  const [AddAndEditOpen, setAddAndEditOpen] = useState(false); //添加与修改弹窗
  const [dataList, setDataList] = useState(null); //数据列表
  const [inquireAssemble, setInquireAssemble] = useState({ getTime: 8 }); //查询的数据集合
  const [currentPage, setCurrentPage] = useState(1); // 当前页
  const [pageNumberSize, setPageNumberSize] = useState(10); // 当前数据条数
  const [total, setTotal] = useState(null); // 总条数
  const [annexVisible, setAnnexVisible] = useState(false); // 查看成果相关资料弹框
  const [annexList, setAnnexList] = useState([]); // 存储数据
  const [gradeOptions, setGradeOptions] = useState([]); // 成果级别
  const [awardList, setAwardList] = useState([]); // 成果奖项
  const [achievementId, setAchievementId] = useState(); // 存储删除id
  const [typeOptions, setTypeOptions] = useState([]); // 成果类型下拉框

  //监听查询集合的数据，有变化就调接口
  useEffect(() => {
    encapsulationInquireMethod(currentPage, pageNumberSize, inquireAssemble);
  }, [inquireAssemble]);

  //封装查询请求
  const encapsulationInquireMethod = (page, size, value) => {
    setLoading(true);
    dispatch({
      type: namespace + "/getAchievementListApi",
      payload: { page, size, ...value },
      callback: (res) => {
        console.log(res, "列表数据");
        if (res.result.code == 200) {
          setDataList(res.result.data.data);
          setTotal(res.result.data.total);
        } else {
          message.error(`${res.result.msg}`);
          return;
        }
      },
    });

    // // 获取字典数据
    // dispatch({
    //   type: namespace + "/batchLoadDictGroups",
    //   payload: { dictCodes: "DICT_ACHV_LEVEL" },
    //   callback: (res) => {
    //     console.log(res, "字典数据");
    //     if (res.code === 200) {
    //       setGradeOptions(
    //         res.data
    //           .filter((item) => item.dictCode === "DICT_ACHV_LEVEL")[0]
    //           .dictItems.map((item) => {
    //             return { value: item.itemValue, label: item.itemText };
    //           })
    //       );
    //     } else {
    //       return;
    //     }
    //   },
    // });

    // 获取字典数据
    dispatch({
      type: namespace + "/batchLoadDictGroups",
      payload: {
        dictCodes: "DICT_ACHV_LEVEL,DICT_ACHV_AWARD_LEVEL,DICT_ACHV_TYPE",
      },
      callback: (res) => {
        console.log(res, "字典数据");
        if (res.code === 200) {
          setGradeOptions(
            res.data
              .filter((item) => item.dictCode === "DICT_ACHV_LEVEL")[0]
              .dictItems.map((item) => {
                return { value: item.itemValue, label: item.itemText };
              })
          );
          setAwardList(
            res.data
              .filter((item) => item.dictCode === "DICT_ACHV_AWARD_LEVEL")[0]
              .dictItems.map((item) => {
                return { value: item.itemValue, label: item.itemText };
              })
          );

          setTypeOptions(
            res.data
              .filter((item) => item.dictCode === "DICT_ACHV_TYPE")[0]
              .dictItems.map((item) => {
                return { value: item.itemValue, label: item.itemText };
              })
          );
        } else {
          return;
        }
      },
    });

    setLoading(false);
  };

  //表头配置
  const columns = [
    {
      title: "序号",
      fixed: "left",
      width: 80,
      render: (text, record, index) => {
        return (currentPage - 1) * pageNumberSize + index + 1;
      },
    },
    {
      title: "成果名称",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      width: 100,
    },
    {
      title: "成果级别",
      dataIndex: "achiLevel",
      key: "achiLevel",
      width: 100,
      render: (text, record, index) => {
        const t = gradeOptions.filter((item) => item.value == record.achiLevel);
        return t[0] ? t[0].label : "";
      },
    },
    {
      title: "成果类型",
      dataIndex: "achiType",
      key: "achiType",
      width: 100,
      render: (test, record) => {
        const em =
          typeOptions &&
          typeOptions.filter((item) => item.value == record.achiType);
        return em[0] ? em[0].label : "";
      },
    },
    {
      title: "其他获奖类型",
      dataIndex: "otherAchiType",
      key: "otherAchiType",
      width: 130,
    },
    {
      title: "奖次",
      dataIndex: "willRank",
      key: "willRank",
      width: 100,
      render: (text, record, index) => {
        const t = awardList.filter((item) => item.value == record.willRank);
        return t[0] ? t[0].label : "";
      },
    },
    {
      title: "获奖者姓名",
      dataIndex: "userName",
      key: "userName",
      width: 120,
    },
    {
      title: "参与者姓名",
      dataIndex: "otherUserName",
      key: "otherUserName",
      width: 120,
    },
    {
      title: "获奖者身份",
      dataIndex: "roleName",
      key: "roleName",
      width: 120,
    },
    {
      title: "教研组/届别",
      dataIndex: "subjectNameAadSpoce",
      key: "subjectNameAadSpoce",
      width: 120,
      render: (text, record, index) => {
        return record.subjectName || record.getSpoceId + "届";
      },
    },
    {
      title: "成果编号",
      dataIndex: "achiNo",
      key: "achiNo",
      width: 120,
    },
    {
      title: "获得成果日期",
      dataIndex: "getTime",
      key: "getTime",
      width: 120,
    },
    {
      title: "成果证书",
      dataIndex: "achiPng",
      key: "achiPng",
      width: 150,
      ellipsis: true,
      render: (text, record, index) => {
        const img = record.achiPng?.split(",");
        return (
          <div style={{ width: "150px", height: "100%", overflowX: "auto" }}>
            <Image.PreviewGroup
              preview={{
                onChange: (current, prev) =>
                  console.log(`current index: ${current}, prev index: ${prev}`),
              }}
            >
              {img?.map((item, index) => {
                return (
                  <Image
                    key={index}
                    width={50}
                    src={item}
                    style={{ marginLeft: "5px", height: "80%" }}
                  />
                );
              })}
            </Image.PreviewGroup>
          </div>
        );
      },
    },
    {
      title: "成果相关资料",
      dataIndex: "annex",
      key: "annex",
      width: 120,
      ellipsis: true,
      render: (text, record, index) => {
        return (
          <a
            onClick={() => {
              setAnnexList(record.annex);
              setAnnexVisible(!annexVisible);

            }}
          >
            查看
          </a>
        );
      },
    },

    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 200,
      render: (_, record) => (
        <Space size="middle" style={{ color: "#1677ff" }}>
          <a onClick={() => detailsResult(record.id)}>详情</a>
          <a onClick={() => editResults(record.id)}>修改</a>
          <a onClick={() => showModal(record.id)}>删除</a>
        </Space>
      ),
    },
  ];

  //分页器配置
  const paginationConfig = {
    pageSize: pageNumberSize, // 每页显示的数据条数
    current: currentPage, // 当前页数
    total: total, // 数据总数
    // showSizeChanger: true, // 显示改变每页显示数据数量
    showQuickJumper: true, // 显示快速跳转页数
    pageSizeOptions: ["10", "20", "50", "100"], // 可选的每页显示数据数量
    showTotal: (total) => `共 ${total} 条`, // 自定义显示总数文本
    onChange: (page, pageSize) => {
      console.log("当前页:", page);
      setCurrentPage(page);

      setPageNumberSize(pageSize);

      setInquireAssemble({ ...inquireAssemble });

      // 处理翻页逻辑
    },
    onShowSizeChange: (current, size) => {
      console.log("当前页:", current);
      console.log("每页显示数据:", size);
      // 处理改变每页显示数据数量的逻辑
      setInquireAssemble({ ...inquireAssemble });
    },
  };

  //导出
  const exportToExcel = () => {
    confirm({
      title: "导出提示",
      icon: <ExclamationCircleOutlined />,
      content: "您即将导出成果数据!",
      onOk() {
        setLoading(true);
        function request() {
          const xhr = new XMLHttpRequest();
          xhr.open(
            "POST",
            "/auth/web/v1/AchievementManage/exportAchievementList",
            true
          );
          xhr.responseType = "blob"; // 包装返回数据格式, 打印出来是 Blob 格式的数据，不是乱码的文本
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.setRequestHeader("Authorization", token);
          xhr.onload = function () {
            download(xhr.response);
            setLoading(false);
          };
          xhr.send(JSON.stringify({ ...inquireAssemble }));
        }

        function download(blobUrl) {
          const xlsx = "application/vnd.ms-excel;charset=UTF-8";
          const blob = new Blob([blobUrl], { type: xlsx });
          // console.log(blob, '这是blob')
          const a = document.createElement("a"); // 转换完成，创建一个a标签用于下载
          a.download = `成果数据.xls`;
          //  a.download = '学生批量导出数据.xls'
          a.href = window.URL.createObjectURL(blob);
          a.click();
          a.remove();
          message.success(`成果数据已下载`);
        }
        request();
      },
      onCancel() {},
    });
  };

  //删除
  const showModal = (id) => {
    confirm({
      title: "确认删除",
      icon: <ExclamationCircleOutlined />,
      content: "您即将删除成果数据？该操作不可逆!",
      onOk() {
        dispatch({
          type: namespace + "/deleteAchievementDetails",
          payload: { id: id },
          callback: (res) => {
            if (res.code == 200) {
              encapsulationInquireMethod(
                currentPage,
                pageNumberSize,
                inquireAssemble
              );
              message.success("删除成功");
            } else {
              message.error(res.msg);
            }
          },
        });
      },
      onCancel() {},
    });
  };

  //添加成果
  const handleOpenModal = () => {
    dispatch({
      type: namespace + "/showModal",
      payload: { foo: "添加成果" }, // 传递给弹框的数据
    });
  };

  //修改数据
  const editResults = (id) => {
    dispatch({
      type: namespace + "/showModal",
      payload: { foo: "修改成果", id }, // 传递给弹框的数据
    });
  };

  //查看详情
  const detailsResult = (id) => {
    dispatch({
      type: namespace + "/detailsShowModal",
      payload: { id }, // 传递给弹框的数据
    });
  };

  //获得者身份下拉事件
  const stanHandle = (value) => {
    console.log(value);
    setCurrentPage(1);
    setPageNumberSize(10);
    setInquireAssemble({ ...inquireAssemble, roleId: value });
  };
  const standOptions = [
    {
      value: 1,
      label: "学生",
    },
    {
      value: 2,
      label: "教师",
    },
  ];

  //成果类型下拉事件
  const typeHandle = (value) => {
    setCurrentPage(1);
    setPageNumberSize(10);
    setInquireAssemble({ ...inquireAssemble, achiType: value });
  };
  // const typeOptions = [
  //   {
  //     value: "科研",
  //     label: "科研",
  //   },
  //   {
  //     value: "专利",
  //     label: "专利",
  //   },
  //   {
  //     value: "论文",
  //     label: "论文",
  //   },
  //   {
  //     value: "课题",
  //     label: "课题",
  //   },
  //   {
  //     value: "竞赛获奖",
  //     label: "竞赛获奖",
  //   },
  // ];

  //成果获得时间下拉事件
  const timeHandle = (value) => {
    setCurrentPage(1);
    setPageNumberSize(10);
    setInquireAssemble({ ...inquireAssemble, getTime: value });
  };
  const timeOptions = [
    {
      value: 0,
      label: "近一周",
    },
    {
      value: 1,
      label: "近一个月",
    },
    {
      value: 2,
      label: "近三个月",
    },
    {
      value: 3,
      label: "近半年",
    },
    {
      value: 4,
      label: "近一年",
    },
    {
      value: 5,
      label: "近三年",
    },
    {
      value: 6,
      label: "近五年",
    },
    {
      value: 7,
      label: "近十年",
    },
    {
      value: 8,
      label: "不限",
    },
  ];

  //成果等级下拉框事件
  const gradeHandle = (value) => {
    setCurrentPage(1);
    setPageNumberSize(10);
    setInquireAssemble({ ...inquireAssemble, achiLevel: value });
  };

  //参与者输入事件
  const participateHandle = (e) => {
    setCurrentPage(1);
    setPageNumberSize(10);
    setInquireAssemble({ ...inquireAssemble, otherUserName: e.target.value });
  };

  //获得者输入事件
  const obtainedHandle = (e) => {
    setCurrentPage(1);
    setPageNumberSize(10);
    setInquireAssemble({ ...inquireAssemble, userName: e.target.value });
  };
  //成果名称输入事件
  const nameHandle = (e) => {
    setCurrentPage(1);
    setPageNumberSize(10);
    console.log(e.target.value);
    setInquireAssemble({ ...inquireAssemble, name: e.target.value });
  };
  //查找事件
  const lookHandle = () => {
    setCurrentPage(1);
    setPageNumberSize(10);
    setInquireAssemble({ ...inquireAssemble });
  };

  // 组件的内容
  return (
    <div style={{ backgroundColor: "#fff" }}>
      <div style={{ borderBottom: "2px solid #F5F6F9" }}>
        <Row gutter={[10, 40]} style={{ padding: "10px 20px" }}>
          <Col span={21}>
            <Row wrap justify="start" gutter={[10, 20]} align="middle">
              <Col span={6}>
                获得者身份：
                <Select
                  showSearch
                  allowClear
                  onChange={stanHandle}
                  options={standOptions}
                  style={{ width: "50%" }}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                ></Select>
              </Col>
              <Col span={6}>
                <span style={{ marginLeft: "14px" }}> 成果类型：</span>
                <Select
                  showSearch
                  allowClear
                  options={typeOptions}
                  onChange={typeHandle}
                  style={{ width: "50%" }}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                ></Select>
              </Col>
              <Col span={6}>
                <span style={{ marginLeft: "14px" }}> 获得时间：</span>
                <Select
                  showSearch
                  options={timeOptions}
                  defaultValue={8}
                  onChange={timeHandle}
                  style={{ width: "50%" }}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                ></Select>
              </Col>
              <Col span={6}>
                <span style={{ marginLeft: "14px" }}> 成果名称：</span>
                <Input onChange={nameHandle} style={{ width: "50%" }}></Input>
              </Col>
              <Col span={6}>
                <span style={{ marginLeft: "14px" }}> 成果等级：</span>
                <Select
                  showSearch
                  allowClear
                  options={gradeOptions}
                  onChange={gradeHandle}
                  style={{ width: "50%" }}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                ></Select>
              </Col>
              <Col span={6}>
                获得者姓名：
                <Input
                  onChange={obtainedHandle}
                  style={{ width: "50%" }}
                ></Input>
              </Col>
              <Col span={6}>
                参与者姓名：
                <Input
                  onChange={participateHandle}
                  style={{ width: "50%" }}
                ></Input>
              </Col>
            </Row>
          </Col>
          <Col span={3}>
            <Button
              onClick={lookHandle}
              type="primary"
              icon={<SearchOutlined />}
            >
              查询
            </Button>
          </Col>
        </Row>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: ".625rem 1.25rem",
        }}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleOpenModal()}
        >
          添加成果
        </Button>
        <Button
          type="primary"
          icon={<DeliveredProcedureOutlined />}
          onClick={() => exportToExcel()}
        >
          导出
        </Button>
      </div>

      <div>
        <Spin size="large" spinning={loading}>
          <Table
            columns={columns}
            dataSource={dataList}
            rowKey={(record, index) => index}
            rowHeight={50}
            scroll={{ x: "true", y: "true" }}
            pagination={paginationConfig}
          />
        </Spin>
      </div>

      <Modal
        width={620}
        title="成果相关资料"
        visible={annexVisible}
        footer={null}
        cancelText
        onCancel={() => {
          setAnnexVisible(!annexVisible);
        }}
      >
        {/* <h2>文档格式点击自动下载再查看，图片格式点击打开新窗口查看</h2> */}
        {annexList &&
          annexList.map((item, index) => {
            return (
              <div key={index}>
                {/*  eslint-disable-next-line */}
                <a href={item.annexWebsite} target="_blank" rel="noopener">
                  {item.annexDesignation}
                </a>
              </div>
            );
          })}
      </Modal>

      {visible && <AddAndEditModal lookHandle={lookHandle} />}
      {detailsVisible && <Details></Details>}
    </div>
  );
};
// 将 reducers 中的状态映射到组件的 props 上
function mapStateToProps(state) {
  return {
    visible: state[namespace].visible, // 使用正确的 namespace
    data: state[namespace].data, // 使用正确的 namespace
    detailsVisible: state[namespace].detailsVisible, // 详情
  };
}

export default connect(mapStateToProps)(ResultStatistics);
