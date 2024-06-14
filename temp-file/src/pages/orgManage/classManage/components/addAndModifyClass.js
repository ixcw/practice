/**
 *@Author:ChaiLong
 *@Description:添加修改班级信息
 *@Date:Created in  2020/6/28
 *@Modified By:
 */
import React from "react";
import { Form, Modal, Select, Input, message } from "antd";
import { connect } from "dva";
import { ClassAndTeacherManage as namespace } from "@/utils/namespace";
import { doHandleYear } from "@/utils/utils";
import userInfoCaches from "@/caches/userInfo";

const Option = Select.Option;
const FormItem = Form.Item;
@connect((state) => ({}))
export default class AddAndModifyClass extends React.Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      visible: false,
      modalData: {}, //班级信息
      gradeParentId: "",
      getSchoolMajors: [],
    };
  }

  componentDidMount() {
    this.formRef = React.createRef();
    this.props.onRef(this);
  }

  /**
   * modal开关
   * @param t false开，true关
   * @param record 班级信息
   */
  handleClassVisible = (t, record) => {
    console.log(record, t, "fsdfsfdf");
    this.setState({
      visible: t,
      modalData: record ? record : {},
    });
    if (!t) this.formRef.current.resetFields();
    if (record && record.collageId) {
      this.setState({ gradeParentId: "42" });
    } else {
      this.setState({ gradeParentId: "1" });
    }
  };
  afterCloseHandle = () => {
    this.setState({
      modalData: {},
    });
  };
  /**
   * 对班级名称进行动态拼接
   */
  fillAnotherName = () => {
    const { getGradeList = [] } = this.props;
    console.log(getGradeList, "getGradeList");

    const { setFieldsValue, getFieldsValue } = this.formRef.current;
    //由于getGradeList比onChange响应时间慢，所以需要给个定时器才能完成实时拿到表单数据
    setTimeout((re) => {
      const {
        yearGradeCode = "",
        gradeId = "",
        shortName = "",
      } = getFieldsValue(["yearGradeCode", "gradeId", "shortName"]);
      //赋值父级id
      const gradeParentId =
        getGradeList && gradeId && getGradeList.length
          ? getGradeList.filter((re) => re.id === gradeId)[0].parentId
          : "";
      this.setState({ gradeParentId });

      if (gradeParentId != 42) {
        //查出年级
        const gradeName =
          getGradeList && gradeId && getGradeList.length
            ? getGradeList.filter((re) => re.id === gradeId)[0].name
            : "";
        //将班级名称拼接出来
        setFieldsValue({
          fullName: `${yearGradeCode ? yearGradeCode + "届" : ""} ${gradeName}${
            shortName ? shortName + "班" : ""
          }`,
        });
      }
    }, 5);
  };

  //点击院系
  fillCollageName = (value, Option) => {
    const { dispatch, query = {} } = this.props;

    const { setFieldsValue, getFieldsValue } = this.formRef.current;

    //将班级名称拼接出来
    setFieldsValue({
      majorId: "",
    });

    dispatch({
      type: namespace + "/getSchoolMajorsList",
      payload: {
        collageId: Option.value,
      },
      callback: (res) => {
        // console.log(res, "专业列表");
        if (res) {
          this.setState({ getSchoolMajors: [...res.data] });
        }
      },
    });
  };

  //点击专业

  fillMajorName = () => {
    const { getGradeList = [], getSchoolCollages = [] } = this.props;
    const { getSchoolMajors } = this.state;
    const { setFieldsValue, getFieldsValue } = this.formRef.current;
    //由于getGradeList比onChange响应时间慢，所以需要给个定时器才能完成实时拿到表单数据
    setTimeout((re) => {
      const {
        yearGradeCode = "",
        gradeId = "",
        shortName = "",
        collageId = "",
        majorId = "",
      } = getFieldsValue([
        "yearGradeCode",
        "gradeId",
        "shortName",
        "collageId",
        "majorId",
      ]);

      console.log(gradeId, "gradeId");
      //赋值父级id
      const gradeParentId =
        getGradeList && gradeId && getGradeList.length
          ? getGradeList.filter((re) => re.id === gradeId)[0].parentId
          : "";
      this.setState({ gradeParentId });
      //查出年级
      const gradeName =
        getGradeList && gradeId && getGradeList.length
          ? getGradeList.filter((re) => re.id === gradeId)[0].name
          : "";
      //查出院系
      const collageName =
        getSchoolCollages && getSchoolCollages.length
          ? getSchoolCollages.filter((re) => re.id === collageId)[0].name
          : "";
      //查专业
      const majorName =
        getSchoolMajors && getSchoolMajors.length
          ? getSchoolMajors.filter((re) => re.id === majorId)[0].name
          : "";

      //将班级名称拼接出来
      setFieldsValue({
        fullName: `${
          yearGradeCode ? yearGradeCode + "届" : ""
        } ${collageName} ${majorName}${gradeName}${
          shortName ? shortName + "班" : ""
        }`,
      });
    }, 5);
  };

  /**
   * 保存修改或新增的班级
   */
  saveClass = () => {
    const { dispatch, query = {} } = this.props;
    const { modalData } = this.state;
    const userInfo = userInfoCaches();
    this.formRef.current.validateFields().then((values) => {
      dispatch({
        type: namespace + "/saveClassInfos",
        payload: {
          id: modalData.id, //修改的时候有id,新增的时候没有
          schoolId: userInfo.schoolId,
          gradeId: values.gradeId,
          shortName: values.shortName + "班",
          fullName: values.fullName,
          studyYear: values.yearGradeCode,
          collageId: values.collageId,
          majorId: values.majorId,
        },
        callback: () => {
          message.success("保存成功");
          this.props.handleClick();
          this.setState({ visible: false, modalData: {} });
          this.formRef.current.resetFields();
        },
      });
    });
  };

  render() {
    const { modalData, visible, gradeParentId, getSchoolMajors } = this.state;
    const {
      getGradeList = [],
      particularYear = [],
      query = {},
      getSchoolCollages = [],
    } = this.props;
    //表单样式
    const FormItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <div>
        <Modal
          title={`${modalData.id ? "修改班级" : "新增班级"}`}
          visible={visible}
          onOk={this.saveClass}
          onCancel={() => this.handleClassVisible(false)}
          okText="保存"
          cancelText="取消"
          wrapClassName="add-modal"
          afterClose={this.afterCloseHandle}
          destroyOnClose={true}
        >
          <Form {...FormItemLayout} ref={this.formRef}>
            <FormItem
              label="届别"
              name={"yearGradeCode"}
              initialValue={
                (modalData.studyYear
                  ? modalData.studyYear.toString()
                  : undefined) ||
                parseInt(query.spoceId, 10) ||
                doHandleYear()
              }
              rules={[
                {
                  required: true,
                  message: "请选择年级",
                },
              ]}
            >
              <Select onChange={this.fillAnotherName} placeholder="请选择届数">
                {particularYear
                  ? particularYear.map((item, index) => {
                      return (
                        <Option value={item.code} key={index}>
                          {item.name}
                        </Option>
                      );
                    })
                  : null}
              </Select>
            </FormItem>
            <FormItem
              label="年级"
              name={"gradeId"}
              initialValue={
                modalData.gradeId !== undefined
                  ? parseInt(modalData.gradeId, 10)
                  : query.gradeId && parseInt(query.gradeId, 10) >= 0
                  ? parseInt(query.gradeId, 10)
                  : undefined
              }
              rules={[
                {
                  required: true,
                  message: "请选择年级",
                },
              ]}
            >
              <Select onChange={this.fillAnotherName} placeholder="请选择届数">
                {getGradeList
                  ? getGradeList.map((item) => {
                      return (
                        <Option value={item.id} key={item.id}>
                          {item.name}
                        </Option>
                      );
                    })
                  : null}
              </Select>
            </FormItem>
            {/* 新增续需求，职高字段 */}

            {gradeParentId && gradeParentId == "42" && (
              <FormItem
                label="院系"
                name={"collageId"}
                initialValue={
                  modalData.gradeId !== undefined
                    ? parseInt(modalData.collageId, 10)
                    : query.gradeId && parseInt(query.collageId, 10) >= 0
                    ? parseInt(query.collageId, 10)
                    : undefined
                }
                rules={[
                  {
                    required: true,
                    message: "请选择院系",
                  },
                ]}
              >
                <Select
                  onChange={this.fillCollageName}
                  placeholder="请选择院系"
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
              </FormItem>
            )}
            {gradeParentId && gradeParentId == "42" && (
              <FormItem
                label="专业"
                name={"majorId"} // 修改name属性值为"specialtyId"
                initialValue={
                  modalData.gradeId !== undefined
                    ? parseInt(modalData.majorId, 10)
                    : query.gradeId && parseInt(query.majorId, 10) >= 0
                    ? parseInt(query.majorId, 10)
                    : undefined
                }
                rules={[
                  {
                    required: true,
                    message: "请选择专业",
                  },
                ]}
              >
                <Select onChange={this.fillMajorName} placeholder="请选择专业">
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
              </FormItem>
            )}

            <FormItem
              label="班级编号"
              name={"shortName"}
              initialValue={
                modalData.shortName
                  ? modalData.shortName.toString().replace("班", "")
                  : undefined
              }
              rules={[
                {
                  required: true,
                  message: "输入班级",
                },
              ]}
            >
              <Input
                onChange={this.fillAnotherName}
                placeholder="请输入班级编号"
                addonAfter="班"
              />
            </FormItem>
            <FormItem
              label="班级名称"
              name={"fullName"}
              initialValue={modalData.fullName}
              rules={[
                {
                  required: true,
                  message: "请输入班级简称",
                },
              ]}
            >
              <Input placeholder="请输入班级简称" disabled />
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}
