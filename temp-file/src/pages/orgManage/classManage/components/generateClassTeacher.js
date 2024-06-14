/**
 *@Author:田忆
 *@Description:一键生成班级
 *@Date:2023/10/17
 *@Modified By:
 */
import React from "react";
import { Button, Modal, message, Input, Table, Select } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { connect } from "dva";
import { ClassAndTeacherManage as namespace } from "@/utils/namespace";
import { doHandleYear } from "@/utils/utils";
import userInfoCaches from "@/caches/userInfo";
const Option = Select.Option;
@connect((state) => ({
  // getSubjectConfig: state[namespace].getSubjectConfig,//当前班级班主任
}))
export default class GenerateClassTeacher extends React.Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      visible: false,
      studiesList: [], // 学段数据
      grateRankList: [], // 界别数据渲染
      rankChecked: [], // 界别为选中状态的项渲染
      classTable: [], //表格数据
      schoolGrades: [], // 存储下拉框年级
      inputValue: "2020届", // 存储输入框的值
      optionsValue: [], // 存储下拉框的值
      customList: [], // 自定义界别数组
      customChecked: [], // 自定义存储选中的
      allChecked: false, // 全选按钮
      classController: false, // 控制器
      getSchoolCollagesOption: [], //院系存储的option
      getSchoolMajorsOption: [], // 专业存储的option
      getSchoolMajors: [],
      MajorsValue: "",
    };
  }

  //封装首次需要的请求
  fetchSubjectNames = () => {
    const { dispatch } = this.props;
    dispatch({
      type: namespace + "/getStudies",
      callback: (res) => {
        const data = res.map((item) => {
          return {
            id: item.id,
            name: item.name,
            checked: false,
          };
        });
        this.setState({
          studiesList: data,
          // classController: res.some((item) => item.id == 42),
        });
      },
    });

    dispatch({
      type: namespace + "/getSchoolGrades",
      callback: (res) => {
        if (res.length > 0) {
          const arr = res.map((item) => {
            return {
              value: item.id,
              label: item.name,
            };
          });
          this.setState({ schoolGrades: arr });
        }
      },
    });
  };

  //封装获取界别的请求
  fetchGrate = (ids) => {
    const { dispatch } = this.props;
    const { rankChecked } = this.state;
    const studiesId = ids.join(",");

    dispatch({
      type: namespace + "/listThGrades",
      payload: { studies: studiesId },
      callback: (res) => {
        if (res.length > 0) {
          if (rankChecked.length > 0) {
            const data = res.map((item1) => {
              const matchingItem = rankChecked.find(
                (item) => item.name == item1.name
              );
              if (matchingItem) {
                return { ...item1, checked: matchingItem.checked };
              }
              return item1;
            });

            const em = [];
            data.forEach((item1) => {
              rankChecked.forEach((item2) => {
                if (item1.name == item2.name) {
                  em.push(item2);
                }
              });
            });

            this.setState(
              {
                rankChecked: em,
              },
              () => this.fetchRankClass(0)
            );

            this.setState({ grateRankList: data });
          } else {
            const data = res.map((item) => {
              return { ...item, checked: false };
            });

            this.setState({ grateRankList: data });
          }
        } else {
          message.error("界别为空");
        }
      },
    });
  };

  //封装生成班级列表函数
  fetchRankClass = (model) => {
    const { dispatch } = this.props;
    const {
      rankChecked,
      classController,
      getSchoolCollagesOption,
      getSchoolMajorsOption,
    } = this.state;
    if (rankChecked.length <= 0) {
      this.setState({ classTable: [] });
      return;
    }

    // getSchoolCollagesOption: [], //院系存储的option
    // getSchoolMajorsOption: [], // 专业存储的option
    const data = rankChecked.map((item) => {
      let tem = classController && {
        collageId: getSchoolCollagesOption.value,
        majorId: getSchoolMajorsOption.value,
        majorName: getSchoolMajorsOption.children,
        collageName: getSchoolCollagesOption.children,
      };
      return {
        gradeId: item.gradeId,
        gradeName: item.gradeName,
        name: `${item.spoceName}${
          classController ? getSchoolCollagesOption.children : ""
        }${classController ? getSchoolMajorsOption.children : ""}${
          item.gradeName
        }`,
        spoceId: item.spoceId,
        spoceName: item.spoceName,
        startNum: item.startingQuantity,
        totalNum: item.quantity,
        ...tem,
      };
    });

    dispatch({
      type: namespace + "/previewList",
      payload: { model, thGradesParams: data },
      callback: (res) => {
        if (res.length > 0) {
          this.setState({ classTable: res });
        } else {
          message.error("网络出错");
        }
      },
    });
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
        studiesList: [], // 学段数据
        grateRankList: [], // 界别数据渲染
        rankChecked: [], // 界别为选中状态的项渲染
        classTable: [], //表格数据
        schoolGrades: [], // 存储下拉框年级
        inputValue: "2020届", // 存储输入框的值
        optionsValue: [], // 存储下拉框的值
        customList: [], // 自定义界别数组
        customChecked: [], // 自定义存储选中的
      },
      () => {
        if (t == true) {
          this.fetchSubjectNames();
        }
      }
    );
  };

  /**
   * 点击的学段
   * @param selectedSchool 参数
   */
  handleSchoolClick = (id) => {
    const { studiesList } = this.state;

    const updateButtons = studiesList.map((btn) => {
      if (btn.id === id) {
        return { ...btn, checked: !btn.checked };
      }
      return btn;
    });
    console.log(updateButtons);
    const em = updateButtons.every((item) => item.checked == false);

    this.setState({
      classController:updateButtons.some(item=>item.id==42 && item.checked)
    })

    console.log(em,"点击的");
    if (em) {
      return message.error("必须选中一个学段");
    }

    //获取选中状态的id
    const arr = [];
    const buttonId = updateButtons.map((item) => {
      if (item.checked == true) {
        return arr.push(item.id);
      }
    });

    this.setState({ studiesList: updateButtons });

    this.fetchGrate(arr);
  };

  /**
   * 点击的界别
   * @param selectedSchool 参数
   */
  handleRankClick = (rank) => {
    if (this.state.classController) {
      // getSchoolCollagesOption:[], //院系存储的option
      // getSchoolMajorsOption:[], // 专业存储的option
      if (
        !this.state.getSchoolCollagesOption ||
        !this.state.getSchoolMajorsOption ||
        !this.state.MajorsValue
      ) {
        message.error("先选择院系与专业");
        return;
      }
    }

    const { grateRankList, rankChecked, customChecked } = this.state;

    const updateButtons = grateRankList.map((btn) => {
      if (btn.name === rank.name) {
        return { ...btn, checked: !btn.checked };
      }
      return btn;
    });

    //选中的项拿出来
    const arr = [];
    const buttonId = updateButtons.map((item) => {
      if (item.checked == true) {
        return arr.push({ ...item, quantity: 1, startingQuantity: 1 });
      }
    });

    rankChecked.forEach((item1) => {
      const index = arr.findIndex((item2) => item2.name === item1.name);
      if (index !== -1) {
        arr[index] = item1;
      }
    });

    this.setState(
      {
        rankChecked: [...arr, ...customChecked],
      },
      () => this.fetchRankClass(0)
    );
    console.log([...arr, ...customChecked], "[...arr, ...customChecked]");
    this.setState({ grateRankList: updateButtons });
  };

  /**
   * 起始值改变事件
   */

  handleInputChange = (productId, value) => {
    const { rankChecked } = this.state;

    if (value <= 0) {
      message.error("起始班级不能小于0");
      return;
    }
    const updatedProducts = rankChecked.map((product) => {
      if (product.name === productId.name) {
        return { ...product, startingQuantity: Number(value) };
      }
      return product;
    });
    this.setState({ rankChecked: updatedProducts }, () => {
      this.fetchRankClass(0);
    });
  };
  /**
   * 增加改变事件
   */
  handleIncrement = (productId) => {
    const { rankChecked } = this.state;

    const updatedProducts = rankChecked.map((product) => {
      if (product.name === productId.name) {
        return { ...product, quantity: product.quantity + 1 };
      }
      return product;
    });
    console.log(updatedProducts);
    this.setState({ rankChecked: updatedProducts }, () => {
      this.fetchRankClass(0);
    });
  };
  /**
   * 减少改变事件
   */
  handleDecrement = (productId, value) => {
    const { rankChecked } = this.state;
    if (productId.quantity <= 1) {
      message.error("不能小于1");
      return;
    }

    const updatedProducts = rankChecked.map((product) => {
      if (product.name === productId.name) {
        return { ...product, quantity: product.quantity - 1 };
      }
      return product;
    });
    console.log(updatedProducts);
    this.setState({ rankChecked: updatedProducts }, () => {
      this.fetchRankClass(0);
    });
  };

  /**
   * 输入框改变事件
   */

  inputHandle = (e) => {
    this.setState({ inputValue: e.target.value });
  };
  /**
   * 下拉框改变事件
   */
  optionsHandle = (value, optionLabelProp) => {
    this.setState({ optionsValue: optionLabelProp });
  };
  /**
   * 点击添加
   */
  appendHandle = () => {
    const { inputValue, optionsValue, rankChecked, grateRankList, customList } =
      this.state;

    // 获取前四位
    const firstFour = inputValue.substring(0, 4);
    // 校验前四位是否为数字
    const isDigit = /^\d+$/.test(firstFour);

    // 校验第五个字符是否为"界"
    const fifthChar = inputValue.charAt(4);
    const isFifthCharValid = fifthChar === "届";

    if (isDigit && isFifthCharValid) {
    } else {
      message.error("界别有误，请按照年份加届格式输入");
      return;
    }

    const em = {
      checked: false,
      gradeId: optionsValue.value,
      gradeName: optionsValue.label,
      name: inputValue + optionsValue.label,
      quantity: 1,
      spoceId: firstFour,
      spoceName: inputValue,
      startingQuantity: 1,
    };
    const existingName = grateRankList.some((item) => item.name == em.name);

    if (existingName) {
      message.error("自定义数据已存在");
      return;
    }

    const hasTarget = grateRankList.some(
      (item) => item.gradeName == em.gradeName
    );
    if (!hasTarget) {
      message.error("没有点击对应的学段，请先选对应学段");
      return;
    }
    const targetTrue = customList.some((item) => item.name == em.name);
    if (targetTrue) {
      message.error("创建已经存在");
      return;
    }

    this.setState({ customList: [...customList, em] });
  };

  /**
   * 自定义数组按钮状态改变事件
   */
  handleSelectButton = (rank) => {
    const { customList, rankChecked } = this.state;

    if (this.state.classController) {
      // getSchoolCollagesOption:[], //院系存储的option
      // getSchoolMajorsOption:[], // 专业存储的option
      if (
        !this.state.getSchoolCollagesOption ||
        !this.state.getSchoolMajorsOption ||
        !this.state.MajorsValue
      ) {
        message.error("先选择院系与专业");
        return;
      }
    }

    const updateButtons = customList.map((btn) => {
      if (btn.name === rank.name) {
        return { ...btn, checked: !btn.checked };
      }
      return btn;
    });

    //溢出rankChecked 中有的customList 后面重新添加
    const newArr = rankChecked.filter(
      (item) => !updateButtons.some((obj) => obj.name === item.name)
    );

    const arr = updateButtons.filter((item) => item.checked == true);

    this.setState({ customList: updateButtons });
    this.setState({ customChecked: arr });

    this.setState({ rankChecked: [...newArr, ...arr] }, () =>
      this.fetchRankClass(0)
    );
  };
  /**
   * 删除按钮
   */
  handleRemoveButton = (event, rank) => {
    const { customList, rankChecked } = this.state;

    event.stopPropagation(); // 阻止事件冒泡

    const newArray = customList.filter((item) => item.name !== rank);
    const newArray2 = customList.filter(
      (item) => item.name !== rank && item.checked == true
    );

    const filteredArr = rankChecked.filter(
      (item) => !customList.some((obj) => obj.name === item.name)
    );
    this.setState(
      { customList: newArray, rankChecked: [...filteredArr, ...newArray2] },
      () => this.fetchRankClass(0)
    );
  };

  /**
   * 选中所有届别-全选
   */
  allRankChecked = () => {
    const { grateRankList, customList, allChecked } = this.state;
    const allData = grateRankList.map((item) => {
      return {
        ...item,
        checked: !allChecked,
        quantity: 1,
        startingQuantity: 1,
      };
    });
    const allCustom = customList.map((item) => {
      return { ...item, checked: !allChecked };
    });

    const rem = [...allData, ...allCustom].every(
      (item) => item.checked === true
    );

    this.setState(
      {
        rankChecked: rem ? [...allData, ...allCustom] : [],
        customList: allCustom,
        grateRankList: allData,
        allChecked: !allChecked,
      },
      () => this.fetchRankClass(0)
    );
  };
  /**
   * 院系选择
   */
  fillCollageName = (value, option) => {
    console.log(option, "option");
    const { dispatch, query = {} } = this.props;

    this.setState({ MajorsValue: "" });

    this.setState({ getSchoolCollagesOption: option });
    dispatch({
      type: namespace + "/getSchoolMajorsList",
      payload: {
        collageId: option.value,
      },
      callback: (res) => {
        // console.log(res, "专业列表");
        if (res) {
          this.setState({ getSchoolMajors: [...res.data] });
        }
      },
    });
  };
  /**
   * 选中专业改变事件
   */
  fillMajorName = (value, option) => {
    this.setState({ MajorsValue: option.children });
    this.setState({ getSchoolMajorsOption: option });
  };

  /**
   * 保存
   */
  saveClass = () => {
    const { rankChecked, classTable } = this.state;
    const { dispatch } = this.props;

    const Flag = classTable.some((item) => item.existFlag == 1);
    console.log(Flag, "判断是否存在");
    console.log(classTable, "查看数据");

    dispatch({
      type: namespace + "/batchGenerate",
      payload: classTable,
      callback: (res) => {
        if (res) {
          this.setState({ visible: false });
          this.props.handleClick();
          message.success(res);
        }
      },
    });
  };

  render() {
    const {
      visible,
      studiesList,
      grateRankList,
      rankChecked,
      classTable,
      schoolGrades,
      customList,
      classController,
      getSchoolCollagesOption, //院系存储的option
      getSchoolMajorsOption, // 专业存储的option
      getSchoolMajors,
      MajorsValue,
    } = this.state;
    const { getSchoolCollages = [] } = this.props;
    const columns = [
      {
        title: "序号",
        dataIndex: "index",
        key: "index",
        width: 80,
        render: (text, record, index) => index + 1,
      },
      {
        title: "年级",
        dataIndex: "gradeName",
        key: "gradeName",
        width: 100,
      },
      {
        title: "班级名称",
        dataIndex: "className",
        key: "className",
        render: (text, record, index) => {
          if (record.existFlag == 1) {
            return (
              <span style={{ color: "red" }}>
                {record.className} + {"(该班级已经存在，生成时自动跳过)"}
              </span>
            );
          } else {
            return <span>{record.className}</span>;
          }
        },
      },
    ];

    return (
      <div>
        <Modal
          width={1000}
          destroyOnClose={true}
          title={"批量生成班级"}
          visible={visible}
          onOk={this.saveClass}
          onCancel={() => this.handleClassVisible(false)}
          okText="保存"
          cancelText="取消"
          wrapClassName="add-modal"
        >
          <div>
            <span style={{ fontWeight: "800" }}>
              学段：
              {studiesList.map((school) => (
                <Button
                  key={school.id}
                  type={school.checked ? "primary" : "default"}
                  onClick={() => this.handleSchoolClick(school.id)}
                  style={{ margin: "5px 10px " }}
                >
                  {school.name}
                </Button>
              ))}
            </span>
          </div>
          {classController && (
            <div style={{ marginTop: "20px" }}>
              <span style={{ fontWeight: "800" }}>
                院系：
                <Select
                  onChange={this.fillCollageName}
                  placeholder="请选择院系"
                  style={{ width: "200px" }}
                >
                  {getSchoolCollages
                    ? getSchoolCollages.map((item) => {
                        return (
                          <Option value={item.id} key={item.id}>
                            {item.name}
                          </Option>
                        );
                      })
                    : null}
                </Select>
              </span>
            </div>
          )}
          {classController && (
            <div style={{ marginTop: "20px" }}>
              <span style={{ fontWeight: "800" }}>
                专业：
                <Select
                  onChange={this.fillMajorName}
                  placeholder="请选择专业"
                  value={MajorsValue}
                  style={{ width: "200px" }}
                >
                  {getSchoolMajors
                    ? getSchoolMajors.map((item) => {
                        return (
                          <Option value={item.id} key={item.id}>
                            {item.name}
                          </Option>
                        );
                      })
                    : null}
                </Select>
              </span>
            </div>
          )}

          <div style={{ marginTop: "20px" }}>
            <span style={{ fontWeight: "800" }}>
              届别：
              {grateRankList.map((rank) => (
                <Button
                  key={rank.name}
                  type={rank.checked ? "primary" : "default"}
                  onClick={() => this.handleRankClick(rank)}
                  style={{ margin: "5px 10px " }}
                >
                  {rank.name}
                </Button>
              ))}
            </span>
          </div>

          <div style={{ marginTop: "20px" }}>
            <div>
              <span style={{ fontWeight: 800 }}>自定义届别：</span>
              <span>
                <Input
                  style={{ width: 100 }}
                  defaultValue="2020届"
                  onChange={(e) => this.inputHandle(e)}
                />
              </span>
              <span>
                <Select
                  style={{ width: 100 }}
                  options={schoolGrades}
                  onChange={(value, optionLabelProp) =>
                    this.optionsHandle(value, optionLabelProp)
                  }
                />
              </span>
              <span>
                <Button onClick={() => this.appendHandle()}>添加</Button>
              </span>
              <span style={{ marginLeft: "50px" }}>
                <Button onClick={() => this.allRankChecked()}>
                  选中所有届别包括自定义届别
                </Button>
              </span>
            </div>
            <div>
              {customList.map((rank) => (
                <span key={rank.name}>
                  <Button
                    type={rank.checked ? "primary" : "default"}
                    style={{ margin: "10px" }}
                    onClick={() => this.handleSelectButton(rank)}
                  >
                    {rank.name}
                  </Button>
                  <CloseOutlined
                    onClick={(event) =>
                      this.handleRemoveButton(event, rank.name)
                    }
                    style={{
                      color: "#fff",
                      backgroundColor: "#f5222d",
                    }}
                  />
                </span>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                flex: 1,
              }}
            >
              <h4 style={{ fontWeight: "800" }}>各年级班级生成数量：</h4>
              <div>
                {rankChecked.map((product) => (
                  <div key={product.name}>
                    <span>
                      {product.spoceName}
                      {getSchoolCollagesOption &&
                        getSchoolCollagesOption.children}
                      {getSchoolMajorsOption && getSchoolMajorsOption.children}
                      {product.gradeName},共
                    </span>
                    <span>
                      <Button
                        onClick={(value) =>
                          this.handleDecrement(product, value)
                        }
                      >
                        -
                      </Button>
                      <span>{product.quantity}</span>
                      <Button onClick={() => this.handleIncrement(product)}>
                        +
                      </Button>
                    </span>
                    个班级，起始班级：
                    <Input
                      type="number"
                      style={{ width: 80 }}
                      value={product.startingQuantity}
                      onChange={(e) =>
                        this.handleInputChange(product, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                // flex: 1,
                width: "450px",
              }}
            >
              <h4 style={{ fontWeight: "800" }}>
                生成预览：{" "}
                <Table
                  rowKey={(record) => record.className}
                  columns={columns}
                  dataSource={classTable}
                  pagination={false}
                  scroll={{ y: 400 }}
                />
              </h4>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
