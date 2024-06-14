import React, { useState, useEffect, Children } from "react";
import { connect } from "dva";
import { Parent as namespace } from "@/utils/namespace";
import { phoneReg, IdCardReg } from "@/utils/const";
import moment from "moment";
import styles from "./NewParent.less";
import {
  SettingOutlined,
  HomeOutlined,
  MailOutlined,
  UserOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import {
  Tabs,
  message,
  Cascader,
  Col,
  Row,
  Spin,
  Menu,
  Radio,
  Button,
  Select,
  Input,
  Option,
  Form,
  Checkbox,
  Tag,
  Table,
  Space,
  Modal,
  DatePicker,
  Pagination,
  notification,
} from "antd";

const { TabPane } = Tabs;
function ParentNew(props) {
  const {
    classList,
    NewTeacherOpen,
    showNewTeacher,
    relationOptions,
    getTeacherList,
    DictionaryDictGroups,
    situAtion,
    sdentification,
    eduCational,
    ProvinceCityAddressOptions,
    sexOptions,
    nationAs,
    dispatch,
  } = props;
  const [basicForm] = Form.useForm(); //基本信息

  const { Option } = Select;
  const [xuejihaoss, xuejihao] = useState([]);
  const [IdCardAge, setIdCardAge] = useState(null);

  const [docTypeValue, setDocTypeValue] = useState(1); //证件类型  1身份证 2护照...
  // 家长创建提示
  const openNotificationWithIcon = (type) => {
    notification[type]({
      message: "新建家长提示",
      description: "您完成一名家长账号的新建！",
    });
  };
  const [loading, setLoading] = useState(false);
  const handleOk = () => {
    const classIID = classList.map((item) => {
      return item.id;
    });
    basicForm
      .validateFields()
      .then((values) => {
        setLoading(true);
        const modifyValues = {
          ...(docTypeValue !== 1 && {
            birthday: values["birthday"].format("YYYY-MM-DD"),
          }),
          nativePlace: values["nativePlace"] && values["nativePlace"][2],
          account: values["account"] && values["account"].split("/").pop(),
        };
        const { ...newValues } = { ...values, ...modifyValues };
        dispatch({
          type: namespace + "/addFamilyMesApi",
          payload: newValues,
          callback: (res) => {
            if (res.err && res?.err?.code == 601) {
              // 错误提示
              setLoading(false);
            } else {
              openNotificationWithIcon("success");
              showNewTeacher(false);
              setLoading(false);
              getTeacherList(1, 10);
              basicForm.resetFields();
            }
          },
        });
      })
      .catch((info) => {
        info.errorFields &&
          message.error(
            "还有 " + info.errorFields.length + " 个必填项未填写！"
          );
      });
  };
  const handleCancel = () => {
    showNewTeacher(false);
    basicForm.resetFields();
  };

  const guanlian = (value) => {
    dispatch({
      type: namespace + "/queryStudentAssocLietMesApi",
      payload: { classId: value },
      callback: (res) => {
        // xuejihao(res.result)
        xuejihao(
          res.result.map((res) => {
            return {
              label: res.studentName + "-" + res.account,
              value: res.studentName + "///" + res.account,
            };
          })
        );
      },
    });
  };

  // 根据身份证计算年龄
  const handleIdentityCardChange = (event) => {
    if (docTypeValue !== 1) return;
    // 如果证件类型为身份证，再进行计算
    event.persist();
    const UUserCard = event.target.value;
    if (UUserCard.match(IdCardReg)) {
      const date = `${UUserCard.substring(6, 10)}/${UUserCard.substring(
        10,
        12
      )}/${UUserCard.substring(12, 14)}`;
      setIdCardAge(moment().diff(date, "years"));
    } else {
      setIdCardAge(null);
    }
  };

  useEffect(() => {
    setIdCardAge(IdCardAge);
    basicForm.setFieldsValue({ age: IdCardAge });
  }, [IdCardAge]);

  const [selectedValue, setSelectedValue] = useState([]);
  const handleCancelSetuser = (value) => {
    setSelectedValue(value);
  };

  const handleCascaderChange = (value) => {
    // console.log('选中的值：', value);
    // 执行其他想要的操作...
  };
  //手机号和电话号验证
  const validatePhoneOrTel = (rule, value, callback) => {
    const phoneReg = /^1[0-9]{10}$/;
    const telReg = /^(\d{3,4}-)?\d{7,8}(-\d{1,4})?$/;

    // 判断是否满足手机号或电话号码格式
    const isPhoneValid = phoneReg.test(value);
    const isTelValid = telReg.test(value);

    if (!value || isPhoneValid || isTelValid) {
      callback();
    } else {
      callback("请输入正确的手机号或电话号码！");
    }
  };

  // 限制可选择的时间
  const disabledDate = (current) => {
    return current && current > moment().endOf("day");
  };

  // 证件类型下拉框
  const handleDocTypeChange = (value) => {
    setDocTypeValue(value);
    // 清空年龄、身份证号、民族、籍贯
    basicForm.setFieldsValue({
      age: null,
      identityCard: null,
      nationId: null,
      areaId: null,
    });
  };

  return (
    <div>
      <Modal
        title="新建家长"
        visible={NewTeacherOpen}
        width={800}
        onCancel={handleCancel}
        onOk={handleOk}
        confirmLoading={loading}
      >
        <Tabs defaultActiveKey="1" className={styles["NewTeacher"]}>
          <Tabs.TabPane tab="基础信息" key="BasicInformation">
            <Form
              name="form"
              form={basicForm}
              autoComplete="off"
              preserve={false}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              <Row gutter={[10, 0]}>
                <Col span={11}>
                  <Form.Item
                    label="姓名"
                    rules={[{ required: true, message: "请填写家长姓名!" }]}
                    allowClear={true}
                    name="name"
                  >
                    <Input style={{ width: 225 }} />
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item
                    label="性别"
                    rules={[{ required: true, message: "请填写家长性别!" }]}
                    allowClear={true}
                    name="sex"
                  >
                    <Select options={sexOptions} style={{ width: 225 }} />
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item
                    label="民族"
                    rules={[{ required: true, message: "请填写民族" }]}
                    name="nationName"
                  >
                    <Select
                      filterOption={(inputValue, option) =>
                        option.label
                          .toLowerCase()
                          .indexOf(inputValue.toLowerCase()) >= 0
                      }
                      showSearch
                      style={{ width: 225 }}
                      options={nationAs}
                    />
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item
                    label="联系电话"
                    allowClear={true}
                    rules={[
                      { required: true, message: "联系电话不能为空!" },
                      { validator: validatePhoneOrTel },
                    ]}
                    name="phone"
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={14} style={{ marginLeft: "-30px" }}>
                  <Form.Item
                    label="籍贯"
                    name="nativePlace"
                    rules={[{ required: true, message: "请填写籍贯" }]}
                  >
                    <Cascader
                      filterOption={(inputValue, option) =>
                        option.label
                          .toLowerCase()
                          .indexOf(inputValue.toLowerCase()) >= 0
                      }
                      showSearch
                      allowClear={true}
                      onChange={handleCascaderChange}
                      options={ProvinceCityAddressOptions}
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                      style={{ width: 575 }}
                    />
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item
                    label="证件类型"
                    name="docType"
                    rules={[
                      {
                        required: true,
                        message: "请选择证件类型",
                      },
                    ]}
                  >
                    <Select
                      filterOption={(inputValue, option) =>
                        option.label
                          .toLowerCase()
                          .indexOf(inputValue.toLowerCase()) >= 0
                      }
                      showSearch
                      options={sdentification}
                      onChange={handleDocTypeChange}
                    />
                  </Form.Item>
                </Col>
                <Col span={11}>
                      <Form.Item label='证件号码' name='familyIdentityCard' rules={[{ required: true }, { pattern: docTypeValue === 1 ? IdCardReg : null, message: '请输入正确的身份证号码！' }]}>
                        <Input
                          onChange={event => {
                            handleIdentityCardChange(event)
                          }}
                        />
                      </Form.Item>
                    </Col>
                <Col span={11}>
                  {docTypeValue === 1 ? (
                    <Form.Item label="年龄" name="age">
                      <Input disabled type="number" />
                    </Form.Item>
                  ) : (
                    <Form.Item
                      label="出生日期"
                      name="birthday"
                      rules={[{ required: true }]}
                    >
                      <DatePicker
                        disabledDate={disabledDate}
                        getPopupContainer={(triggerNode) =>
                          triggerNode.parentNode
                        }
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  )}
                </Col>

                <Col span={11}>
                  <Form.Item
                    label="工作省份"
                    name="workProvince"
                    rules={[
                      {
                        required: true,
                        message: "请选择工作省份",
                      },
                    ]}
                  >
                    <Select
                      filterOption={(inputValue, option) =>
                        option.label
                          .toLowerCase()
                          .indexOf(inputValue.toLowerCase()) >= 0
                      }
                      showSearch
                      options={ProvinceCityAddressOptions}
                    />
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item
                    label="工作情况"
                    name="workType"
                    rules={[
                      {
                        required: true,
                        message: "请选择工作情况",
                      },
                    ]}
                  >
                    <Select
                      filterOption={(inputValue, option) =>
                        option.label
                          .toLowerCase()
                          .indexOf(inputValue.toLowerCase()) >= 0
                      }
                      showSearch
                      options={situAtion}
                    />
                  </Form.Item>
                </Col>
                <Col span={15}>
                  <Form.Item
                    style={{ marginLeft: "-60px" }}
                    rules={[{ required: true, message: "请填写家庭住址" }]}
                    label="家庭住址"
                    name="address"
                  >
                    <Input style={{ width: 575 }} />
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item
                    label="学历层次"
                    rules={[{ required: true, message: "请填写学历层次" }]}
                    name="education"
                  >
                    <Select
                      filterOption={(inputValue, option) =>
                        option.label
                          .toLowerCase()
                          .indexOf(inputValue.toLowerCase()) >= 0
                      }
                      showSearch
                      options={eduCational}
                    />
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item label="所学专业" name="major">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item label="座机" name="fixedPhone">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Tabs.TabPane>
          <TabPane tab="关联学生信息" key="2">
            <Form form={basicForm}>
              <Row>
                <Col span={22} offset={1}>
                  <Form.Item
                    label="家长与学生关系"
                    allowClear
                    rules={[
                      { required: true, message: "请填写家长与学生关系!" },
                    ]}
                    name="relation"
                  >
                    <Select
                      filterOption={(inputValue, option) =>
                        option.label
                          .toLowerCase()
                          .indexOf(inputValue.toLowerCase()) >= 0
                      }
                      showSearch
                      style={{ width: 555 }}
                      options={relationOptions}
                    />
                  </Form.Item>
                </Col>
                <Col span={22} offset={1}>
                  <Form.Item
                    label="年级班级信息"
                    allowClear
                    rules={[{ required: true, message: "请填写年级班级信息!" }]}
                    name="gradeClass"
                  >
                    <Select
                      style={{ width: 570 }}
                      onSelect={guanlian}
                      filterOption={(input, option) =>
                        option.projectName.indexOf(input) >= 0
                      }
                    >
                      {Array.isArray(classList) && classList.length
                        ? classList.map((item, index) => (
                            <Select.Option
                              key={index}
                              value={item.id}
                              projectName={item.name}
                            >
                              {item.gradeName + item.anotherName}
                            </Select.Option>
                          ))
                        : null}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={22} offset={1}>
                  <Form.Item
                    label="姓名/学籍号关联"
                    allowClear
                    rules={[
                      { required: true, message: "请填写姓名/学籍号关联!" },
                    ]}
                    name="account"
                  >
                    <Select
                      filterOption={(inputValue, option) =>
                        option.label
                          .toLowerCase()
                          .indexOf(inputValue.toLowerCase()) >= 0
                      }
                      showSearch
                      options={xuejihaoss}
                      onChange={handleCancelSetuser}
                      style={{ width: 550 }}
                    ></Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    sexOptions: state[namespace].sexOptions,
    nationAs: state[namespace].nationAs,
    ProvinceCityAddressOptions: state[namespace].ProvinceCityAddressOptions,
    situAtion: state[namespace].situAtion,
    sdentification: state[namespace].sdentification,
    eduCational: state[namespace].eduCational,
    relationOptions: state[namespace].relationOptions,
  };
};

export default connect(mapStateToProps)(ParentNew);
