import { Descriptions } from "antd";
import { useState, useEffect } from "react";
import { connect } from "dva";
import { Parent as namespace } from "../../../../utils/namespace";
import {
  Cascader,
  Col,
  Row,
  Spin,
  Menu,
  Radio,
  Button,
  Select,
  Option,
  Input,
  Form,
  Checkbox,
  Tag,
  Table,
  Space,
  Modal,
  Dropdown,
  Pagination,
} from "antd";
import styles from "./ParentDetails.less";

function MyDetail(props) {
  const {
    TeacherDetailIds,
    isModalOpen,
    showTeacherDetails,
    TeacherDetailId,
    TeacherDetailsOpen,
    dispatch,
  } = props;
  const [loading, setLoading] = useState(true);
  const [TeacherDetail, setTeacherDetail] = useState({});
  const [TeacherDetails, setTeacherDetails] = useState([]);
  const [PhysicalListData, setPhysicalListData] = useState([]);

  useEffect(() => {
    if (TeacherDetailsOpen) {
      setLoading(true);
      dispatch({
        type: namespace + "/queryFamilyDetailsMesApi",
        payload: {
          familyId: TeacherDetailId,
          assocStuIdentityCards: TeacherDetailIds,
        },
        callback: (res) => {
          if (res) {
            setLoading(false);
            setTeacherDetail(res?.result?.uUserFamily);
            setTeacherDetails(
              res?.result?.parentAssoStudentMesList?.map((item) => {
                return { ...item, key: item.id };
              })
            );
          }
        },
      });
    }
  }, [TeacherDetailsOpen]);

  // 更多详情表格表头
  const columnstop = [
    {
      title: "年度",
      dataIndex: "annual",
      key: "age",
      width: "140px",
    },
    {
      title: "测评结果",
      dataIndex: "Evaluationresult",
      key: "address",
      width: "140px",
    },
  ];

  // 更多详情表格表单
  const datafooter = [
    {
      key: "1",

      annual: "2023",
      Evaluationresult: "健康",
    },
    {
      key: "3",
      annual: "2022",
      Evaluationresult: "健康",
    },
    {
      key: "3",
      annual: "2021",
      Evaluationresult: "健康",
    },
  ];
  //点击事件
  const handleOk = () => {
    isModalOpen(false);
  };

  const handleCancel = () => {
    showTeacherDetails(false);
  };

  const columnsp = [
    {
      title: "学生姓名",
      dataIndex: "name",
      key: "name",
      width: "80px",
    },
    {
      title: "学生性别",
      dataIndex: "sex",
      key: "sex",
      width: "80px",
    },
    {
      title: "所属学校",
      dataIndex: "schoolName",
      key: "schoolName",
      width: "80px",
    },
    {
      title: "所在年级",
      dataIndex: "gradeName",
      key: "gradeName",
      width: "80px",
    },
    {
      title: "所在班级",
      dataIndex: "className",
      key: "className",
      width: "80px",
    },
    {
      title: "学籍号",
      dataIndex: "account",
      key: "account",
      width: "80px",
    },
  ];

  return (
    <>
      <Modal
        title="家长详情"
        visible={isModalOpen}
        width={800}
        className={styles["NewTeacher"]}
        dataSource={PhysicalListData}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        bodyStyle={{ padding: "0 24px 24px 24px" }}
      >
        <div style={{ marginLeft: "-21px", marginTop: "21px" }}>
          <span
            style={{ fontWeight: "700", marginLeft: "20px", marginTop: "21px" }}
          >
            基本信息
          </span>
        </div>
        <Form style={{ padding: "20px" }}>
          <Row style={{ padding: "12px 0" }}>
            <Col span={9}>姓名：{TeacherDetail?.name}</Col>
            <Col span={6}>性别：{TeacherDetail?.sex}</Col>
            <Col span={6} offset={3}>
              民族：{TeacherDetail?.nationName}
            </Col>
          </Row>
          <Row style={{ padding: "12px 0" }}>
            <Col span={7}>
              证件类型：
              {TeacherDetail?.docType ? TeacherDetail.docType : "居民身份证"}
            </Col>
            <Col span={13} offset={2}>
              证件号码：{TeacherDetail?.familyIdentityCard}
            </Col>
          </Row>
          <Row style={{ padding: "12px 0" }}>
            <Col span={9}>籍贯：{TeacherDetail?.nativePlace}</Col>
            <Col span={7}>关系：{TeacherDetail?.relation}</Col>
          </Row>
          <Row style={{ padding: "12px 0" }}>
            <Col span={5}>年龄：{TeacherDetail?.age}</Col>
            <Col span={12} offset={4}>
              联系电话：{TeacherDetail?.phone}
            </Col>
          </Row>
          <Row style={{ padding: "12px 0" }}>
            <Col span={7}>工作省份：{TeacherDetail?.workProvince}</Col>
            <Col span={7} offset={2}>
              工作情况：{TeacherDetail?.workType}
            </Col>
          </Row>
          <Row style={{ padding: "12px 0" }}>
            <Col span={7}>家庭住址：{TeacherDetail?.address}</Col>
            <Col span={7} offset={2}>
              座机：{TeacherDetail?.fixedPhone}
            </Col>
          </Row>
          <div style={{ marginLeft: "-21px" }}>
            <span style={{ fontWeight: "700" }}>学历信息</span>
          </div>
          <Row style={{ padding: "12px 0" }}>
            <Col span={7}>学历层次：{TeacherDetail?.education}</Col>
            <Col span={7} offset={2}>
              就读专业：{TeacherDetail?.major}
            </Col>
          </Row>
          <div style={{ marginLeft: "-21px" }}>
            <span style={{ fontWeight: "700" }}>关联学生信息</span>
          </div>
          <div style={{ marginTop: "21px" }}>
            <Table
              columns={columnsp}
              dataSource={TeacherDetails}
              bordered={true}
              pagination={false}
            />
          </div>
        </Form>
        {/* <div>
              <span style={{ fontWeight: "700" }}>心理测评</span>
            </div>
            <div>
              <Table
                columns={columnstop}
                dataSource={datafooter}
                bordered={true}
              />
            </div> */}
      </Modal>
    </>
  );
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps)(MyDetail);
