/**
 *@Author:ChaiLong
 *@Description:一键升段
 *@Date:Created in 2023/10/20
 *@Modified By:
 */
import React from "react";
import {
  Spin,
  Modal,
  Table,
  Input,
  message,
  Row,
  Col,
  Popconfirm,
  Switch,
  Button,
} from "antd";
import { connect } from "dva";
import { ClassAndTeacherManage as namespace } from "@/utils/namespace";
import { doHandleYear } from "@/utils/utils";
import userInfoCaches from "@/caches/userInfo";
import { FastBackwardFilled } from "@ant-design/icons";

@connect((state) => ({}))
export default class UpSectionClass extends React.Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      visible: false,
      loading: true, // 加载状态
      dataSource: [], // 渲染的数据
      isModalOpen: false, //提示框
      classController: false, // 控制器
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }
  //打开弹窗发起的请求函数

  // previewClassList,预览
  // submitClassList,提交

  fetchSubjectNames = () => {
    const { dispatch } = this.props;
    this.setState({ loading: true });
    dispatch({
      type: namespace + "/previewClassList",
      callback: (res) => {
        console.log(res, "预览班级");
        if (res) {
          this.setState({ dataSource: res });
        } else {
          message.error("网络连接失败");
          return;
        }
      },
    });
    this.setState({ loading: false });
  };

  /**
   * modal开关
   * @param t false开，true关
   * @param record 班级信息
   */
  handleClassVisible = (t, record) => {
    this.setState(
      {
        visible: t,
        isModalOpen: false, //提示框
        loading: true, // 加载状态
        dataSource: [], // 渲染的数据
      },
      () => {
        if (t == true) {
          this.fetchSubjectNames();
        }
        if (record && record.collageId) {
          this.setState({ classController: true });
        } else {
          this.setState({ classController: false });
        }
      }
    );
  };

  // 添加重组班级
  handleAdd = (classList, item, index) => {
    console.log(classList);
    const { dataSource } = this.state;
    console.log(item);
    console.log(index);

    const newList = {
      beforeUpgradeClassName: "",
      afterUpgradeClassName:
        item.gradFlag === 1
          ? item.spoceName +
            item.gradeName +
            (classList.length + 1) +
            "班(已毕业)"
          : item.spoceName + item.nextGradeName + (classList.length + 1) + "班",
      studentsFollowFlag: 0,
      gradeId: item.gradeId,
      spoceId: item.spoceId,
    };
    if (classList.length > 1) {
      const exists = classList.some(
        (item) => item.afterUpgradeClassName == newList.afterUpgradeClassName
        // || item.afterUpgradeClassName == ""
      );
      if (exists) {
        message.error("上一条数据没完善或将要添加的默认班级与上面的班级重复");
        return;
      }
    }

    const newData = dataSource.map((dataItem) => {
      if (
        (dataItem.spoceId === item.spoceId &&
          dataItem.gradeId === item.gradeId) ||
        dataItem.gradeId === item.beforeUpgradeGradeId
      ) {
        dataItem.classList.push(newList);
      }
      return dataItem;
    });
    this.setState({ dataSource: [...newData] });
  };

  /**
   * 删除
   */
  handleDelete = (item, key) => {
    console.log(item, "当前项");
    const newData = this.state.dataSource.map((dataItem) => {
      if (
        (dataItem.spoceId === item.spoceId &&
          dataItem.gradeId === item.beforeUpgradeGradeId) ||
        (dataItem.spoceId === item.spoceId && dataItem.gradeId === item.gradeId)
      ) {
        console.log(item.beforeUpgradeClassName, "看看这个值");

        if (item.beforeUpgradeClassName === "") {
          const updatedList = dataItem.classList.filter(
            (classItem) =>
              item.afterUpgradeClassName !== classItem.afterUpgradeClassName
          );

          console.log(updatedList, "删除后的数据原班级为空");
          return { ...dataItem, classList: updatedList };
        } else {
          console.log("123");
          const updatedList = dataItem.classList.map((classItem) => {
            console.log(
              item.afterUpgradeClassName === classItem.afterUpgradeClassName
            );
            console.log(item);
            if (
              item.afterUpgradeClassName === classItem.afterUpgradeClassName
            ) {
              console.log("赋值为空");
              return { ...classItem, afterUpgradeClassName: "" };
            }
            return classItem;
          });

          console.log(updatedList, "删除后的数据原班级不为空");
          return { ...dataItem, classList: updatedList };
        }
      }

      return dataItem;
    });
    console.log(newData);
    this.setState({ dataSource: newData });
  };
  /**
   * 跟随班级事件
   */
  handleFollowSwitch = (record, checked) => {
    console.log(record, "点击的");
    console.log(checked, "第二项");

    const newData = this.state.dataSource.map((dataItem) => {
      if (
        (dataItem.spoceId === record.spoceId &&
          dataItem.gradeId === record.beforeUpgradeGradeId) ||
        (dataItem.spoceId === record.spoceId &&
          dataItem.gradeId === record.gradeId)
      ) {
        const updatedList = dataItem.classList.map((classItem) => {
          if (classItem.classId === record.classId) {
            return {
              ...classItem,
              studentsFollowFlag: checked == true ? 1 : 0,
            };
          }
          return classItem;
        });
        return { ...dataItem, classList: updatedList };
      }
      return dataItem;
    });
    this.setState({ dataSource: newData });
  };

  //输入的班级事件
  handleClassChange = (e, item) => {
    console.log(e.target.value);
    console.log(item, "查看");
    const newData = this.state.dataSource.map((dataItem) => {
      if (
        (dataItem.spoceId === item.spoceId &&
          dataItem.gradeId === item.gradeId) ||
        (dataItem.spoceId === item.spoceId &&
          dataItem.gradeId == item.beforeUpgradeGradeId)
      ) {
        console.log("1");
        const updatedList = dataItem.classList.map((classItem) => {
          if (classItem.afterUpgradeClassName == item.afterUpgradeClassName) {
            if (e.target.value == "") {
              return {
                ...classItem,
                afterUpgradeClassName: e.target.value,
                studentsFollowFlag: 0,
              };
            } else {
              return {
                ...classItem,
                afterUpgradeClassName: e.target.value,
                studentsFollowFlag: 1,
              };
            }
          }
          return classItem;
        });
        return { ...dataItem, classList: updatedList };
      }
      return dataItem;
    });
    console.log(newData, "更新后的数据");
    this.setState({ dataSource: newData });
  };

  /**
   *
   * @param 渲染的数据} classList
   * @param 整条数据 item
   * @returns
   */
  getColumnsWithFlag = (classList, item) => {
    const lastItem = classList[classList.length - 1];
    return [
      {
        title: "原班级",
        dataIndex: "beforeUpgradeClassName",
        key: "beforeUpgradeClassName",
      },
      {
        title: "升段后的班级",
        dataIndex: "afterUpgradeClassName",
        key: "afterUpgradeClassName",
        render: (_, record) => {
          return (
            <Input
              placeholder="请输入班级"
              value={
                record.studentsFollowFlag === 0 && item.gradFlag == 0
                  ? record.afterUpgradeClassName
                  : record.afterUpgradeClassName
              }
              onChange={(e) => this.handleClassChange(e, record)}
            />
          );
        },
      },
      {
        title: "操作",
        render: (_, record, index) => (
          <div>
            {!(item.gradFlag == 1) &&
              !(record.beforeUpgradeClassName == "") && (
                <span>
                  学生跟随
                  <Switch
                    checked={record.studentsFollowFlag == 1 ? true : false}
                    onChange={(checked) =>
                      this.handleFollowSwitch(record, checked)
                    }
                  />
                  {/* {record.studentsFollowFlag == 0 ? "(拆班重组)" : null} */}
                </span>
              )}

            {record.beforeUpgradeClassName == "" &&
            index == classList.length - 1 ? (
              <Popconfirm
                title="确定删除？"
                onConfirm={() => this.handleDelete(record)}
              >
                <a style={{ marginLeft: "10px" }}>删除</a>
              </Popconfirm>
            ) : null}
          </div>
        ),
      },
    ];
  };

  // 数据源改变
  dataSourceHandle = (classList) => {
    const data = [...classList];
    return data;
  };

  // 提示框确认时
  handleOk = () => {
    this.setState({ isModalOpen: false }, () => {
      this.handleClassVisible(false);
      this.props.handleClick();
      message.success("操作成功");
    });
  };

  /**
   * 保存
   */
  saveClass = () => {
    const { dispatch, query = {} } = this.props;
    const { isModalOpen } = this.state;
    const filteredData = this.state.dataSource.map((dataItem) => {
      const muchClassList = [];
      const updatedList = dataItem.classList.filter((classItem) => {
        if (classItem.beforeUpgradeClassName == "") {
          muchClassList.push(classItem.afterUpgradeClassName);
          return false;
        }
        return true;
      });

      return { ...dataItem, classList: updatedList, muchClassList };
    });
    console.log(filteredData, "过滤后的数组");

    dispatch({
      type: namespace + "/submitClassList",
      payload: filteredData,
      callback: (res) => {
        console.log(res, "返回的数据");
        if (res.code === 201) {
          console.log(isModalOpen);
          this.setState({ isModalOpen: true, alert: res.alert });
        } else if (res.code === 200) {
          this.handleClassVisible(false);
          this.props.handleClick();
          message.success("操作成功");
        } else {
          message.error("操作失败");
        }
      },
    });
  };

  render() {
    const { visible, loading, dataSource, alert, isModalOpen,classController } = this.state;

    return (
      <div>
        <Modal
          title="一键升段"
          visible={visible}
          onOk={this.saveClass}
          width={1400}
          onCancel={() => this.handleClassVisible(false)}
          okText="保存"
          cancelText="取消"
          wrapClassName="add-modal"
        >
          <Spin spinning={loading}>
            <h3>(说明：学生跟随开关为关闭状态，这个班级就是拆班重组)</h3>
            <Row wrap gutter={[8, 32]}>
              {dataSource.map((item, index) => {
                return (
                  <Col span={12} key={item.spoceId + "" + item.gradeId}>
                    <div>
                      {classController
                        ? item.spoceName +
                          item.collageName +
                          item.majorName +
                          item.gradeName
                        : item.spoceName + item.gradeName}
                      {"升段"}
                      <Button
                        style={{ marginLeft: "30px" }}
                        onClick={() =>
                          this.handleAdd(item.classList, item, index)
                        }
                      >
                        添加重组班级
                      </Button>
                    </div>
                    <div style={{ width: "100%" }}>
                      <Table
                        bordered
                        pagination={false}
                        rowKey={(record, index) => index}
                        dataSource={this.dataSourceHandle(item.classList)}
                        columns={this.getColumnsWithFlag(item.classList, item)}
                      />
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Spin>
          <Modal
            closable={false}
            cancelText
            visible={isModalOpen}
            onOk={() => this.handleOk()}
          >
            {alert}
          </Modal>
        </Modal>
      </div>
    );
  }
}
