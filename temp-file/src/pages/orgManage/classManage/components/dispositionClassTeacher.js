/**
 *@Author:田忆
 *@Description:配置班级科任教师
 *@Date:2023/10/12
 *@Modified By:
 */
import React from "react";
import { Button, Modal, Select, message, Row, Col, Spin } from "antd";
import { connect } from "dva";
import { ClassAndTeacherManage as namespace } from "@/utils/namespace";
import { doHandleYear } from "@/utils/utils";
import userInfoCaches from "@/caches/userInfo";

@connect((state) => ({
  // getSubjectConfig: state[namespace].getSubjectConfig,//当前班级班主任
}))
export default class DispositionClassTeacher extends React.Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      visible: false,
      selectedSubject: "", // 当前选择的学科
      selectedSubjectId: null, // 当前选中的学科ID
      subjectNames: [], // 学科名称数组
      nameMappings: {}, // 学科与对应名字的映射
      nameMappingsId: {}, // 学科与对应id的映射
      isPopupVisible: false, // 弹出框是否可见
      modalData: {}, //班级信息
      teacherOption: [], //教师数组
      teacherValue: null, // 班主任id
      selectedSubjectLabel: "", //回填下拉
      loading: true,
    };
  }

  //打开弹窗发起的请求函数

  fetchSubjectNames = () => {
    const { dispatch } = this.props;
    const { loading } = this.state;
    this.setState({ loading: true });
    // 发起后端请求获取学科名称数据
    dispatch({
      type: namespace + "/getSubjectConfig",
      payload: { classId: this.state.modalData.id },
      callback: (res) => {
        console.log(res);
        if (res.subjectTeacherList && res.subjectTeacherList.length > 0) {
          const result = res.subjectTeacherList.reduce((obj, item) => {
            if (item.teacherUserName !== null) {
              obj[item.subjectName] = item.teacherUserName;
            }
            return obj;
          }, {});

          const resultId = res.subjectTeacherList.reduce((obj, item) => {
            if (item.teacherUserId !== null) {
              obj[item.subjectId] = item.teacherUserId;
            }
            return obj;
          }, {});

          this.setState({ nameMappings: { ...result } });
          this.setState({ nameMappingsId: { ...resultId } });

          const subjectNames = res.subjectTeacherList;
          this.setState({ subjectNames });
        } else {
          message.warning("没有科目信息");
        }
        this.setState({ teacherValue: res.headTeacherId });
      },
    });
    dispatch({
      type: namespace + "/listTeachers",
      callback: (res) => {
        if (res.length > 0) {
          const teacherOption = res.map((e) => {
            return {
              value: e.id,
              label: e.userName,
            };
          });
          this.setState({ teacherOption });
        } else {
          message.warning("教师数据为空");
        }
      },
    });

    this.setState({ loading: false });
  };

  componentDidMount() {
    this.props.onRef(this);
  }

  /**
   * modal开关
   * @param t false开，true关
   * @param record 班级信息
   */
  handleClassVisible = (t, record) => {
    this.setState(
      {
        visible: t,
        modalData: record ? record : {},
        nameMappings: {}, // 学科与对应名字的映射
        nameMappingsId: {}, // 学科与对应id的映射
        isPopupVisible: false, // 弹出框是否可见
        teacherOption: [], //教师数组
        teacherValue: null, // 班主任id
        subjectNames: [], // 学科名称数组
        selectedSubject: "", // 当前选择的学科
        selectedSubjectId: null, // 当前选中的学科ID
      },
      () => {
        if (t == true) {
          this.fetchSubjectNames();
        }
      }
    );
  };

  /**
   * 选中科目
   */
  handleButtonClicked = (subject) => {
    const { nameMappings } = this.state;
    console.log(subject, "=>sub");
    console.log(nameMappings, "=>nameMappings");
    const selectedName =
      nameMappings[subject.subjectName] || subject.teacherUserId || ""; // 获取该学科对应的名字，若不存在则设置为空字符串
    this.setState(
      {
        isPopupVisible: true,
        selectedSubject: subject.subjectName,
        selectedSubjectId: subject.subjectId,
        selectedSubjectLabel: selectedName, // 设置selectedSubject为选中的名字
      },
      () => {}
    );
  };

  /**
   * 下拉框选择科任老师
   */
  handleNameSelected = (value, labelInValue) => {
    const { selectedSubject, selectedSubjectId, nameMappings, nameMappingsId } =
      this.state;
    //名称
    const updatedNameMappings = {
      ...nameMappings,
      [selectedSubject]: labelInValue?.label ? labelInValue.label : null,
    };
    //id
    const updatedNameMappingsId = {
      ...nameMappingsId,
      [selectedSubjectId]: value,
    };

    this.setState({
      isPopupVisible: false,
      selectedSubject: "",
      nameMappings: updatedNameMappings,
      nameMappingsId: updatedNameMappingsId,
    });
  };

  /**
   * 下拉框选择班主任
   */
  handleTeacherSelect = (value) => {
    this.setState({ teacherValue: value });
  };

  /**
   * 保存
   */
  saveClass = () => {
    const { nameMappings, nameMappingsId } = this.state;
    console.log(nameMappings);
    console.log(nameMappingsId);

    const result = Object.entries(nameMappingsId).map(
      ([subjectId, teacherUserId]) => {
        return { subjectId: Number(subjectId), teacherUserId };
      }
    );
    const { dispatch } = this.props;
    dispatch({
      type: namespace + "/saveSubjectConfig",
      payload: {
        classId: this.state.modalData.id,
        className: this.state.modalData.fullName,
        headTeacherId: this.state.teacherValue,
        subjectTeacherList: result,
      },
      callback: (res) => {
        if (res == "配置成功") {
          this.setState({
            visible: false,
            selectedSubject: "",
            selectedSubjectId: null,
            subjectNames: [],
            nameMappings: {},
            nameMappingsId: {},
            isPopupVisible: false,
            modalData: {},
            teacherOption: [],
            teacherValue: null,
          });
          message.success(`${res}`);

          this.setState({});
        } else {
          message.error("配置失败");
        }
      },
    });
  };

  render() {
    const {
      visible,
      subjectNames,
      nameMappings,
      isPopupVisible,
      modalData,
      teacherOption,
      teacherValue,
      selectedSubjectLabel,
      loading,
    } = this.state;

    return (
      <div>
        <Modal
          destroyOnClose={true}
          title={"配置班主任及科任教师"}
          visible={visible}
          onOk={this.saveClass}
          onCancel={() => this.handleClassVisible(false)}
          okText="保存"
          cancelText="取消"
          wrapClassName="add-modal"
        >
          <Spin spinning={loading}>
            <div>
              {" "}
              <span style={{ fontWeight: "800" }}>班级：</span>{" "}
              {modalData.fullName}
            </div>
            <div style={{ margin: "20px 0", fontWeight: "800" }}>
              班主任：
              <Select
                showSearch
                value={teacherValue}
                style={{ width: "300px" }}
                options={teacherOption}
                optionFilterProp="label"
                allowClear
                onChange={(e) => {
                  this.handleTeacherSelect(e);
                }}
              />
            </div>
            <div style={{ fontWeight: "800" }}>科任教师</div>
            <Row wrap gutter={[12, 24]}>
              {subjectNames.map((subject) => (
                <Col span={6} key={subject.subjectId}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Button onClick={() => this.handleButtonClicked(subject)}>
                      {subject.subjectName}
                    </Button>
                    <span>{nameMappings[subject.subjectName]}</span>
                  </div>
                </Col>
              ))}
            </Row>
            {isPopupVisible && (
              <div style={{ marginTop: "20px" }}>
                <div style={{ fontWeight: "800" }}>选择科任教师：</div>
                <Select
                  allowClear
                  value={selectedSubjectLabel}
                  showSearch
                  style={{ width: "300px" }}
                  options={teacherOption}
                  optionFilterProp="label"
                  onChange={(e, label) => this.handleNameSelected(e, label)}
                />
              </div>
            )}
          </Spin>
        </Modal>
      </div>
    );
  }
}
