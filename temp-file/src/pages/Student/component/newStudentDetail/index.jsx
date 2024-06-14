import React from "react";
import { connect } from "dva";
import { StudentData as namespace } from "@/utils/namespace";
import { useEffect, useState, memo } from "react";
import {
  Modal,
  Tabs,
  Form,
  Row,
  Col,
  Select,
  Input,
  Button,
  DatePicker,
  Cascader,
  notification,
  message,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import styles from "./index.less";
import { specialCharReg, IdCardReg } from "@/utils/const";
import moment from "moment";
import { number } from "prop-types";
const { RangePicker } = DatePicker;
function index(props) {
  const {
    dispatch,
    newStudentOpen,
    showNewStudent,
    DictionaryDictGroups,
    CityAddressOptions,
    getStudentList,
    ProvinceCityAddressOptions,
  } = props;
  const [form] = Form.useForm(); //基本信息
  // const [atSchoolMessage] = Form.useForm() // 在校信息
  const [spoceList, setSpoceList] = useState([]); //存储学校学级
  const [classData, setClassData] = useState([]); // 存储班级信息
  const [phaseOptions, setPhaseOptions] = useState([]); // 存储学段信息
  const [nextPhaseOptions, setNextPhaseOptions] = useState([]); //存储下一个学段信息
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [disabled, setDisabled] = useState(true); //存储学生年龄禁用属性
  const [defaultValue, setDefaultValue] = useState("1");
  const [disabled4, setDisabled4] = useState(false);
  const [MarryState, setMarryState] = useState(2);
  const [IdCardAge, setIdCardAge] = useState(null);
  const [handlePolit, setHandlePolit] = useState(null);
  const [gradeClass, setGradeClass] = useState({});
  const [gradeOptions, setGradeOptions] = useState([]); // 存储班级下拉列表
  const [classOptions, setClassOptions] = useState([]); // 存储班级下拉框
  const [schoolData, setSchoolData] = useState({}); // 存储当前学校信息
  const [numberDate, setNumberDate] = useState("");

  // const handleMarryChange = (value) => { setMarryState(value) };
  useEffect(() => {
    //请求字典数据
    dispatch({
      type: namespace + "/getDictionaryDictGroups",
      payload: {
        dictCodes:
          "DICT_SEX,DICT_NATION,DICT_RELATION,DICT_EDU,DICT_DISE,DICT_WORK,DICT_STUDY_STATUS,DICT_ENROLL_PARENT_RELATION,DICT_DOC_TYPE",
      },
      callback: (res) => {
        // console.log(res, '这是字典数据')
      },
    });
    //请求籍贯
    dispatch({
      type: namespace + "/getDictionaryAddress",
      payload: { deep: 3 },
    });
    //获取当前学校学级班级信息
    dispatch({
      type: namespace + "/getGrateStatusClassData",
      callback: (res) => {
        // console.log(res, '这是当前学校信息')
        if (res.result) {
          setSchoolData(res.result);
          setSpoceList(
            res.result.spoceList.map((result) => {
              return {
                label: result.id,
                value: result.id,
              };
            })
          );
          setClassData(
            res.result.classList.map((a) => {
              return {
                label: a.name,
                value: a.id,
              };
            })
          );
          setPhaseOptions(
            res.result.studyList.map((a) => {
              return {
                label: a.name,
                value: a.id,
              };
            })
          );
          setSchoolOptions([
            {
              label: res.result.schoolName,
              value: res.result.schoolId,
            },
          ]);
        }
      },
    });
    //学段信息
    dispatch({
      type: namespace + "/getStudying",
      callback: (res) => {
        // console.log(res, '学段信息')
        setNextPhaseOptions(
          res.result.map((a) => {
            return {
              label: a.name,
              value: a.id,
            };
          })
        );
      },
    });

    //初始化默认值
    form.setFieldsValue({ docType: "1" });
  }, [newStudentOpen]);

  //下拉框处理
  const sexOptions = DictionaryDictGroups?.find(
    (item) => item.dictCode === "DICT_SEX"
  )?.dictItems?.map((item) => {
    return { value: item.itemValue - 0, label: item.itemText };
  });
  const nationNameOptions = DictionaryDictGroups?.find(
    (item) => item.dictCode === "DICT_NATION"
  )?.dictItems.map((item) => {
    return { value: item.itemValue, label: item.itemText };
  });
  const isDiseaseOptions = DictionaryDictGroups?.find(
    (item) => item.dictCode === "DICT_DISE"
  )?.dictItems.map((item) => {
    return { value: item.itemValue, label: item.itemText };
  });
  const relationOptions = DictionaryDictGroups?.find(
    (item) => item.dictCode === "DICT_ENROLL_PARENT_RELATION"
  )?.dictItems.map((item) => {
    return { value: item.itemValue, label: item.itemText };
  });
  const natureOptions = DictionaryDictGroups?.find(
    (item) => item.dictCode === "DICT_EDU"
  )?.dictItems.map((item) => {
    return { value: item.itemValue, label: item.itemText };
  });
  const workOptions = DictionaryDictGroups?.find(
    (item) => item.dictCode === "DICT_WORK"
  )?.dictItems.map((item) => {
    return { value: item.itemValue, label: item.itemText };
  });

  const certificateTye = DictionaryDictGroups?.find(
    (item) => item.dictCode === "DICT_DOC_TYPE"
  )?.dictItems.map((item) => {
    return { value: item.itemValue, label: item.itemText };
  });

  const ifOptions = [
    {
      label: "是",
      value: "转班",
    },
    {
      label: "否",
      value: null,
    },
  ];
  const ifOptions1 = [
    {
      label: "是",
      value: "跳级",
    },
    {
      label: "否",
      value: null,
    },
  ];
  const ifOptions2 = [
    {
      label: "是",
      value: "转学",
    },
    {
      label: "否",
      value: null,
    },
  ];

  // 限制可选择的时间
  const disabledDate = (current) => {
    return current && current > moment().endOf("day");
  };
  const disabledEndDate = (current) => {
    return current && current > moment().endOf("day");
  };

  // 根据身份证计算年龄
  const [showRules, setShowRules] = useState(false);
  function isValidIdCard(idCard) {
    if (typeof idCard !== "string") {
      return false;
    }

    if (idCard.length !== 18) {
      return false;
    }
    const regExp =
      /^[1-9]\d{5}(19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    if (!regExp.test(idCard)) {
      return false;
    }
    const factors = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const checkCodes = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
    let sum = 0;
    for (let i = 0; i < 17; i++) {
      sum += parseInt(idCard.charAt(i), 10) * factors[i];
    }
    const checkCode = checkCodes[sum % 11];
    if (checkCode !== idCard.charAt(17).toUpperCase()) {
      return false;
    }

    return true;
  }

  function calculateAge(idCard) {
    if (!isValidIdCard(idCard)) {
      setShowRules(true);
      return null;
    }

    const birthYear = parseInt(idCard.substr(6, 4), 10);
    const birthMonth = parseInt(idCard.substr(10, 2), 10);
    const birthDay = parseInt(idCard.substr(12, 2), 10);
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();
    let age = todayYear - birthYear;
    if (
      todayMonth < birthMonth ||
      (todayMonth === birthMonth && todayDay < birthDay)
    ) {
      age -= 1;
    }
    return age;
  }
  // 根据身份证计算年龄
  const handleIdentityCardChange = (event) => {
    // console.log(event.target.value, '改变输入框')
    setIdCardAge("");
    // console.log(IdCardAge, "这是改变时的年龄")
    if (calculateAge(event.target.value) !== null) {
      setIdCardAge(calculateAge(event.target.value));
      setNumberDate(event.target.value);
    } else {
      setIdCardAge("");
    }
  };

  //学生证件类型事件
  const certificateEvent = (e) => {
    if (e == 1) {
      setDisabled(true);
      form.setFieldsValue({ areaId: "", nation: "" });
    } else {
      setDisabled(false);
      form.setFieldsValue({ areaId: [100, 1001, 10001], nation: "58" });
    }
  };

  const certificateEventParent = (value, option, key) => {
    if (value == 1) {
      const parents = form.getFieldValue("Parents");
      const updatedParents = [...parents]; // 创建一个副本，以免直接修改原始数据
      updatedParents[key] = {
        ...updatedParents[key],
        education: "",
        nationName: "",
        nativePlace: null,
      };
      form.setFieldsValue({ Parents: updatedParents });
    } else {
      const parents = form.getFieldValue("Parents");
      const updatedParents = [...parents]; // 创建一个副本，以免直接修改原始数据
      updatedParents[key] = {
        ...updatedParents[key],
        education: "11",
        nationName: "58",
        nativePlace: [100, 1001, 10001],
      };
      form.setFieldsValue({ Parents: updatedParents });
    }
  };

  useEffect(() => {
    if (disabled) {
      console.log("1231");
      form.setFieldsValue({ age: IdCardAge });
    }
  }, [IdCardAge]);

  const handleSelect4 = (e) => {
    if (e == 0) {
      setDisabled4(true);
    } else {
      setDisabled4(false);
    }
  };

  //点击确定时
  const handleOk = (e) => {
    // console.log(e, '这是点击确认时')
    form
      .validateFields()
      .then((values) => {
        console.log(values, "点击确认时");
        const tem = values["guardianName2"]
          ? [
              {
                guarName: values["guardianName2"],
                phone: values["phone2"],
                relation: values["relation2"],
              },
            ]
          : [];
        const parents = values.Parents?.map((item) => {
          return {
            address: item.address ? item.address : null,
            education: item.education,
            familyIdentityCard: item.familyIdentityCard
              ? item.familyIdentityCard
              : null,
            name: item.name ? item.name : null,
            nationName: item.nationName ? item.nationName : null,
            nativePlace: item.nativePlace[item.nativePlace.length - 1],

            phone: item.phone,
            relation: item.relation ? item.relation : null,
            sex: item.sex,
            workProvince: item.workProvince,
            workType: item.workType,
            docType: item.docType,
            birthday: moment(item.birthday).format("YYYY-MM-DD"),
          };
        });
        const formData = {
          isOneParent: values["isOneParent"],
          birthday: moment(values["birthday"]).format("YYYY-MM-DD"),
          age: values["age"],
          docType: values["docType"],
          address: values["address"],
          areaId: values["areaId"][values.areaId.length - 1],
          diseaseName: values["illness"] ? values["illness"] : null,
          identityCard: values["IDnumber"] ? values["IDnumber"] : null,
          isDisease: values["constitution"]
            ? Number(values["constitution"])
            : null,
          nationId: Number(values["nation"]),
          sex: values["sex"],
          studentGuardianList: [
            {
              guarName: values["guardianName1"]
                ? values["guardianName1"]
                : null,
              phone: values["phone1"] ? values["phone1"] : null,
              relation: values["relation1"]
                ? Number(values["relation1"])
                : null,
            },
            ...tem,
          ],
          uuserFamilyList: parents,
          userName: values["userName"] ? values["userName"] : null,
          studentOnSchoolDTO: {
            account: values["account"] ? values["account"] : null, //学籍号
            schoolId: schoolData.schoolId ? schoolData.schoolId : null, //学校id
            schoolName: schoolData.schoolName ? schoolData.schoolName : null, //学校名称
            classId: values["classId"] ? values["classId"] : null, //班级id
            gradeName: values["changeGrade"]
              ? gradeOptions.filter(
                  (item) => item.value == values["changeGrade"]
                )[0].label
              : null,

            spoce: values["classes"] ? values["classes"] : null, //学级
            startDate: values["startTime"]
              ? values["startTime"]._d.getTime()
              : null,
            endDate: values["endTime"] ? values["endTime"]._d.getTime() : null,

            studyId: values["phase"] ? values["phase"] : null, // 学段
          },
        };

        console.log(formData, "要上传的");
        dispatch({
          type: namespace + "/getNewStudentData",
          payload: formData,
          callback: (res) => {
            if (res.err && res?.err?.code == 601) {
              // 错误提示
            } else {
              openNotificationWithIcon("success");
              setEduStartDatePicker(null);
              setEduEndDatePicker(null);
              getStudentList(1, 10);
              showNewStudent(false);
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

  // 学生创建提示
  const openNotificationWithIcon = (type) => {
    notification[type]({
      message: "新建学生基本信息提示",
      description: "您完成一名新学生的新建！",
    });
  };
  const handleCancel = () => {
    setIdCardAge("");
    setEduStartDatePicker(null);
    setEduEndDatePicker(null);
    showNewStudent(false);
  };
  const [SwitchTag, setSwitchTag] = useState("1");

  //切换tab
  const onChangeTabs = (key) => {
    setSwitchTag(key);
  };

  const [classValue, setClassValue] = useState(null);

  // 根据年级选择班级
  const gradeChange = (e) => {
    form.setFieldsValue({
      classId: null,
    });
    dispatch({
      type: namespace + "/getSpoceGangedClass",
      payload: { spoce: spoceDate, gradeId: e },
      callback: (res) => {
        console.log(res, "班级联动");
        if (res?.result?.length > 0 && res.result.code !== 601) {
          message.success(`这个届别年级有${res.result.length}个班级`);
          setClassOptions(
            res.result?.map((item) => {
              return {
                label: item.name,
                value: item.id,
              };
            })
          );
        } else {
          message.error("这个届别的年级没有班级，请换个届别或年级");
          form.setFieldsValue({ classId: null });
          setClassOptions([]);
        }
      },
    });
  };

  const [spoceDate, setSpoceDate] = useState("");
  //存储学级
  const spoceOptions = (e) => {
    form.setFieldsValue({
      phase: null,
      changeGrade: null,
      classId: null,
    });
    setSpoceDate(e);
  };

  // 学段改变
  const phaseChange = (e) => {
    console.log(e, "学段改变");
    form.setFieldsValue({
      changeGrade: null,
      classId: null,
    });
    setGradeOptions(
      schoolData?.yearGradeList
        ?.filter((item) => item.parentId == e)
        .map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        })
    );
  };
  // 开始时间不能大于结束时间
  const [EduStartDatePicker, setEduStartDatePicker] = useState(null);
  const [EduEndDatePicker, setEduEndDatePicker] = useState(null);
  const onEduStartDatePicker = (value) => {
    setEduStartDatePicker(new Date(Date.parse(value.format())).getTime());
  };
  const onEduEndDatePicker = (value) => {
    setEduEndDatePicker(new Date(Date.parse(value.format())).getTime());
  };
  const disabledEduStartDate = (Value) => {
    const startValue = new Date(Date.parse(Value.format())).getTime();
    if (!startValue || !EduEndDatePicker) {
      return false;
    }
    return startValue.valueOf() > EduEndDatePicker.valueOf();
  };
  const disabledEduEndDate = (Value) => {
    const endValue = new Date(Date.parse(Value.format())).getTime();
    if (!endValue || !EduStartDatePicker) {
      return false;
    }
    return EduStartDatePicker.valueOf() >= endValue.valueOf();
  };

  const ageInput = (e) => {
    // console.log(e, "123213");
    // if (e == NaN) {
    //   message.error('身份证不合法')
    // }
  };

  return (
    <div>
      <Modal
        title="新建学生"
        visible={newStudentOpen}
        width={650}
        destroyOnClose={true}
        onOk={handleOk}
        onCancel={handleCancel}
        bodyStyle={{ padding: "0 24px 24px 24px" }}
      >
        <Tabs
          defaultActiveKey="1"
          className={styles["NewTeacher"]}
          onChange={onChangeTabs}
        >
          <Tabs.TabPane tab="基础信息" key="1">
            <Form
              name="form"
              form={form}
              autoComplete="off"
              preserve={false}
              initialValues={{ nationId: 1, sex: 0, marryId: 2, politId: 1 }}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              <Row gutter={[12, 0]}>
                <Col span={12}>
                  <Form.Item
                    label="姓名"
                    name="userName"
                    rules={[{ required: true, message: "请填写学生姓名!" }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="证件类型"
                    name="docType"
                    rules={[{ required: true, message: "请选择证件类型" }]}
                  >
                    <Select
                      showSearch
                      optionFilterProp="label"
                      options={certificateTye}
                      onChange={certificateEvent}
                      allowClear
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    />
                  </Form.Item>

                  <Form.Item label="年龄" name="age" rules={[{ required: true, message: "请输入年龄" }]}>
                    <Input disabled={disabled} onChange={ageInput}   />
                  </Form.Item>
                  <Form.Item
                    label="出生日期"
                    name="birthday"
                    rules={[{ required: true, message: "请选择出生日期" }]}
                  >
                    <DatePicker />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="性别"
                    name="sex"
                    rules={[{ required: true, message: "请选择学生性别!" }]}
                  >
                    <Select
                      options={sexOptions}
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label="证件号码"
                    name="IDnumber"
                    rules={
                      showRules
                        ? [
                            { required: true, message: "请填写证件号码!" },
                            {
                              pattern: disabled ? IdCardReg : specialCharReg,
                              message: "请输入正确的证件号码！",
                            },
                          ]
                        : [{ required: true, message: "请填写证件号码!" }]
                    }
                  >
                    <Input
                      onChange={(event) => {
                        handleIdentityCardChange(event);
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="民族"
                    name="nation"
                    rules={[{ required: true, message: "请选择民族!" }]}
                  >
                    <Select
                      showSearch
                      optionFilterProp="label"
                      options={nationNameOptions}
                      allowClear
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                label="籍贯"
                name="areaId"
                rules={[{ required: true, message: "请选择籍贯!" }]}
              >
                <Cascader
                  showSearch
                  optionFilterProp="label"
                  options={ProvinceCityAddressOptions}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                />
              </Form.Item>
              <Form.Item
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                label="家庭住址"
                name="address"
              >
                <Input />
              </Form.Item>
              <Row gutter={[12, 0]}>
                <Col span={12}>
                  <Form.Item
                    label="监护人姓名"
                    name="guardianName1"
                    rules={[{ required: true, message: "请填写监护人姓名!" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="关系"
                    name="relation1"
                    rules={[
                      { required: true, message: "请填写与监护人的关系!" },
                    ]}
                  >
                    <Select
                      showSearch
                      optionFilterProp="label"
                      options={relationOptions}
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                label="联系电话"
                name="phone1"
                rules={[
                  { required: true, message: "请填写与监护人的联系电话!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Row gutter={[12, 0]}>
                <Col span={12}>
                  <Form.Item label="监护人姓名" name="guardianName2">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="关系" name="relation2">
                    <Select
                      showSearch
                      optionFilterProp="label"
                      options={relationOptions}
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                label="联系电话"
                name="phone2"
              >
                <Input />
              </Form.Item>
              <Row gutter={[12, 0]}>
                <Col span={12}>
                  <Form.Item
                    label="是否特异体质"
                    name="constitution"
                    rules={[{ required: true, message: "请选择" }]}
                  >
                    <Select
                      options={isDiseaseOptions}
                      onChange={handleSelect4}
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="疾病名称" name="illness">
                    <Input disabled={disabled4} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="是否单亲家庭"
                    name="isOneParent"
                    rules={[{ required: true, message: "请选择" }]}
                  >
                    <Select
                      options={[
                        { label: "是", value: "1" },
                        { label: "否", value: "0" },
                      ]}
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              {/*  */}
              <h3 className={styles["title"]}>家庭信息</h3>
              <div style={{ display: MarryState == 2 ? "block" : "none" }}>
                <Form.List name="Parents" initialValue={[{}]}>
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <div key={key} className={styles["miniBox"]}>
                          {/* <hr /> */}
                          <Row justify="space-around" align="middle">
                            <Col span={key !== 0 ? 22 : 24}>
                              <Row gutter={[12, 0]}>
                                <Col span={12}>
                                  <Form.Item
                                    label="姓名"
                                    name={[name, "name"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "请填写的姓名!",
                                      },
                                    ]}
                                  >
                                    <Input />
                                  </Form.Item>
                                  <Form.Item
                                    label="工作省份"
                                    name={[name, "workProvince"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "请选择工作省份!",
                                      },
                                    ]}
                                  >
                                    <Select
                                      showSearch
                                      optionFilterProp="label"
                                      options={CityAddressOptions}
                                      getPopupContainer={(triggerNode) =>
                                        triggerNode.parentNode
                                      }
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    label="联系电话"
                                    name={[name, "phone"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "请填写联系电话!",
                                      },
                                    ]}
                                  >
                                    <Input />
                                  </Form.Item>
                                  <Form.Item
                                    label="证件类型"
                                    name={[name, "docType"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "请选择证件类型",
                                      },
                                    ]}
                                  >
                                    <Select
                                      showSearch
                                      optionFilterProp="label"
                                      options={certificateTye}
                                      onChange={(value, option) =>
                                        certificateEventParent(
                                          value,
                                          option,
                                          key
                                        )
                                      }
                                      allowClear
                                      getPopupContainer={(triggerNode) =>
                                        triggerNode.parentNode
                                      }
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    label="学历层次"
                                    name={[name, "education"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "请选择学历!",
                                      },
                                    ]}
                                  >
                                    <Select
                                      showSearch
                                      optionFilterProp="label"
                                      options={natureOptions}
                                      getPopupContainer={(triggerNode) =>
                                        triggerNode.parentNode
                                      }
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    label="出生日期"
                                    name="birthday"
                                    rules={[
                                      {
                                        required: true,
                                        message: "请选择出生日期",
                                      },
                                    ]}
                                  >
                                    <DatePicker />
                                  </Form.Item>
                                </Col>
                                <Col span={12}>
                                  <Form.Item
                                    label="性别"
                                    name={[name, "sex"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "请选择性别!",
                                      },
                                    ]}
                                  >
                                    <Select
                                      options={sexOptions}
                                      getPopupContainer={(triggerNode) =>
                                        triggerNode.parentNode
                                      }
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    label="关系"
                                    name={[name, "relation"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "请填写与监护人的关系!",
                                      },
                                    ]}
                                  >
                                    <Select
                                      showSearch
                                      optionFilterProp="label"
                                      options={relationOptions}
                                      getPopupContainer={(triggerNode) =>
                                        triggerNode.parentNode
                                      }
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    label="工作情况"
                                    name={[name, "workType"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "请填写工作情况!",
                                      },
                                    ]}
                                  >
                                    <Select
                                      showSearch
                                      optionFilterProp="label"
                                      options={workOptions}
                                      getPopupContainer={(triggerNode) =>
                                        triggerNode.parentNode
                                      }
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    label="证件号码"
                                    name={[name, "familyIdentityCard"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "请填写证件号码!",
                                      },
                                      {
                                        pattern: new RegExp(
                                          `^(${IdCardReg.source}|${specialCharReg.source})$`
                                        ),
                                        message: "请输入正确的证件号码！",
                                      },
                                    ]}
                                  >
                                    <Input />
                                  </Form.Item>
                                  <Form.Item
                                    label="民族"
                                    name={[name, "nationName"]}
                                  >
                                    <Select
                                      showSearch
                                      optionFilterProp="label"
                                      options={nationNameOptions}
                                      allowClear
                                      getPopupContainer={(triggerNode) =>
                                        triggerNode.parentNode
                                      }
                                    />
                                  </Form.Item>
                                </Col>
                              </Row>

                              <Form.Item
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                                label="籍贯"
                                name={[name, "nativePlace"]}
                              >
                                <Cascader
                                  showSearch
                                  optionFilterProp="label"
                                  options={ProvinceCityAddressOptions}
                                  getPopupContainer={(triggerNode) =>
                                    triggerNode.parentNode
                                  }
                                />
                              </Form.Item>

                              <Form.Item
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                                label="家庭住址"
                                name={[name, "address"]}
                              >
                                <Input />
                              </Form.Item>
                            </Col>
                            {key !== 0 && (
                              <Col span={1} offset={1}>
                                <MinusCircleOutlined
                                  onClick={() => remove(name)}
                                />
                              </Col>
                            )}
                          </Row>
                        </div>
                      ))}
                      <Form.Item wrapperCol={{ span: 24 }}>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                          style={{ height: "100px" }}
                        >
                          添加家庭信息
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </div>
            </Form>
          </Tabs.TabPane>

          <Tabs.TabPane tab="在校信息" key="2" forceRender={true}>
            <Form
              name="form"
              form={form}
              autoComplete="off"
              preserve={false}
              initialValues={{ nationId: 1, sex: 0, marryId: 2, politId: 1 }}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              <Row>
                <Col span={12}>
                  <Form.Item
                    label="开始时间"
                    name="startTime"
                    rules={[{ required: true, message: "请选择开始时间!" }]}
                  >
                    <DatePicker
                      onChange={onEduStartDatePicker}
                      disabledDate={disabledEduStartDate}
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                      style={{ width: "100%" }}
                      rules={[{ required: true, message: "请选择开始时间!" }]}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="截止时间"
                    name="endTime"
                    rules={[{ required: true, message: "请选择截止时间!" }]}
                  >
                    <DatePicker
                      onChange={onEduEndDatePicker}
                      disabledDate={disabledEduEndDate}
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                      style={{ width: "100%" }}
                      rules={[{ required: true, message: "请选择截止时间!" }]}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[12, 0]}>
                <Col span={12}>
                  <Form.Item label="学校名称" name="schoolName">
                    <Input
                      defaultValue={schoolData.schoolName}
                      disabled={true}
                    />
                  </Form.Item>

                  <Form.Item
                    label="学段"
                    name="phase"
                    rules={[{ required: true, message: "请选择学级段!" }]}
                  >
                    <Select
                      options={phaseOptions}
                      onChange={phaseChange}
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label="年级"
                    name="changeGrade"
                    rules={[{ required: true, message: "请选择年级班级信息!" }]}
                  >
                    <Select
                      options={gradeOptions}
                      onChange={gradeChange}
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="届别"
                    name="classes"
                    rules={[{ required: true, message: "请选择届别!" }]}
                  >
                    <Select
                      options={spoceList}
                      onChange={spoceOptions}
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label="学籍号"
                    name="account"
                    rules={[{ required: true, message: "请输入学籍号" }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="年级班级信息"
                    name="classId"
                    rules={[{ required: true, message: "请选择年级班级信息!" }]}
                  >
                    <Select
                      options={classOptions}
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                      defaultValue={classValue}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    DictionaryDictGroups: state[namespace].DictionaryDictGroups,

    CityAddressOptions: state[namespace].CityAddressOptions,
    ProvinceCityAddressOptions: state[namespace].ProvinceCityAddressOptions,
  };
};
export default memo(connect(mapStateToProps)(index));
