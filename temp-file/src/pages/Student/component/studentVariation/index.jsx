/**
 * 学生数据
 * @author:田忆
 * date:2023年4月25日
 * */

import React, { useEffect, memo } from "react";
import styles from "./index.less";
import { connect } from "dva";
import { StudentData as namespace } from "@/utils/namespace";
import {
  Modal,
  Tabs,
  Form,
  Row,
  Col,
  Image,
  Spin,
  Cascader,
  DatePicker,
  Table,
  Input,
  Select,
  Button,
  notification,
} from "antd";
import { useState } from "react";
import moment from "moment";
import { string } from "prop-types";
import FormItem from "antd/lib/form/FormItem";
function index(props) {
  const {
    studentVariationOpen,
    showStudentVariation,
    dispatch,
    variationAccount,
    DictionaryDictGroups,
    CityAddressOptions,
    ProvinceCityAddressOptions,
  } = props;
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [detailsData, setDetailsData] = useState({}); // 存储信息
  const [Guardians, setGuardians] = useState([]); // 存储监护人信息

  const [educational, setEducational] = useState([]); //存储教育信息
  const [FamilyList, setFamilyList] = useState([]); // 存储家庭成员信息
  const [CheckupList, setCheckupList] = useState([]); // 存储体检信息
  const [yearOptions, setYearOptions] = useState([]);
  const [ReportImage, setReportImage] = useState([]);

  // console.log(props.account,'这是传值数据')
  useEffect(() => {
    //请求学生详情数据
    // console.log(variationAccount, '这是传值数据')
    if (variationAccount !== null && studentVariationOpen) {
      setLoading(true);
      //请求籍贯
      dispatch({
        type: namespace + "/getDictionaryAddress",
        payload: { deep: 3 },
      });
      //请求字典数据
      dispatch({
        type: namespace + "/getDictionaryDictGroups",
        payload: {
          dictCodes:
            "DICT_SEX,DICT_NATION,DICT_DISE,DICT_RELATION,DICT_EDU,DICT_WORK,DICT_STUDY_STATUS,DICT_PHYS_RESULT,DICT_ENROLL_PARENT_RELATION,DICT_DOC_TYPE,",
        },
        callback: (res) => {
          console.log(res, "这是字典数据index");
        },
      });
      dispatch({
        type: namespace + "/getStudentDetails",
        payload: { account: variationAccount },
        callback: (res) => {
          console.log(res, "学生详情");
          setLoading(res.result && res.result.length > 0);
          setDetailsData(res?.result);
          setGuardians(res?.result?.studentGuardiansList);
          setEducational(res?.result?.studentSchoolList);
          setFamilyList(res?.result?.uuserFamilyList);
          setCheckupList(res?.result?.uuserCheckupList);
          setYearOptions(
            res?.result?.uuserCheckupList?.map((item) => {
              return {
                label: item.year,
                value: item.year,
              };
            })
          );
        },
      });
    }

    setReportImage(null);
    // console.log(nationNameOptions,"民族对应的下拉框")
  }, [studentVariationOpen]);

  const isDiseaseOptions = DictionaryDictGroups?.find(
    (item) => item.dictCode === "DICT_DISE"
  )?.dictItems.map((item) => {
    return { value: item.itemValue, label: item.itemText };
  });
  const nationNameOptions = DictionaryDictGroups?.find(
    (item) => item.dictCode === "DICT_NATION"
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
  const phaseOptions = DictionaryDictGroups?.find(
    (item) => item.dictCode === "DICT_STUDY_STATUS"
  )?.dictItems.map((item) => {
    return { value: item.itemValue, label: item.itemText };
  });
  const physicalOptions = DictionaryDictGroups?.find(
    (item) => item.dictCode === "DICT_PHYS_RESULT"
  )?.dictItems.map((item) => {
    return { value: item.itemValue, label: item.itemText };
  });
  const sexOptions = DictionaryDictGroups?.find(
    (item) => item.dictCode === "DICT_SEX"
  )?.dictItems?.map((item) => {
    return { value: item.itemValue, label: item.itemText };
  });

  const certificateTye = DictionaryDictGroups?.find(
    (item) => item.dictCode === "DICT_DOC_TYPE"
  )?.dictItems.map((item) => {
    return { value: item.itemValue, label: item.itemText };
  });

  // // 地址内容处理 （省-市）
  // const ProvinceCityAddressOptions = DictionaryAddress?.map(item => {
  //   return {
  //     value: item.id,
  //     label: item.name,
  //     children: item.children?.map(item2 => { return { value: item2.id, label: item2.name } })
  //   }
  // })
  // // 地址内容处理 （省）
  // const CityAddressOptions = DictionaryAddress?.map(item => { return { value: item.id, label: item.name } })

  const CheckUpColumns = [
    {
      title: "序号",
      render: (text, record, index) => {
        return `${index + 1}`;
      },
    },
    {
      title: "学段",
      dataIndex: "studyName",
      key: "studyName",
      render: (text, record, index) => {
        return (
          <Form.Item name={["transfer", index, "name"]}>
            <Input />
          </Form.Item>
        );
      },
    },
    {
      title: "学校名称",
      dataIndex: "schoolName",
      key: "schoolName",
      render: (text, record, index) => {
        return (
          <Form.Item name={["transfer", index, "schoolName"]}>
            <Input />
          </Form.Item>
        );
      },
    },
  ];
  const FamilyColumns = [
    {
      title: "编号",
      dataIndex: "id",
      key: "id",
      width: 0,
      render: (text, record, index) => {
        return (
          <Form.Item name={["uuserFamilyList", index, "id"]}>
            {index + 1}
          </Form.Item>
        );
      },
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
      render: (text, record, index) => {
        return (
          <Form.Item name={["uuserFamilyList", index, "name"]}>
            <Input style={{ width: "80px" }} />
          </Form.Item>
        );
      },
    },

    // {
    //   title: '性别',
    //   dataIndex: 'sex',
    //   key: 'sex',
    //   width: 100,
    //   render: (text, record, index) => {
    //     return <Form.Item name={['uuserFamilyList', index, 'sex']}>
    //       <Select  getPopupContainer={triggerNode => triggerNode.parentNode} options={sexOptions} style={{ width: '80px' }} />
    //     </Form.Item>
    //   }
    // },
    // {
    //   title: '民族',
    //   dataIndex: 'nationName',
    //   key: 'nationName',
    //   width: 180,
    //   render: (text, record, index) => {
    //     return <Form.Item name={['uuserFamilyList', index, 'nationName']}>
    //       <Select showSearch optionFilterProp="label" options={nationNameOptions} style={{ width: '180px' }} getPopupContainer={triggerNode => triggerNode.parentNode} />
    //     </Form.Item>
    //   }
    // },
    {
      title: "出生日期",
      dataIndex: "birthday",
      key: "birthday",
      render: (text, record, index) => {
        return (
          <Form.Item name={["uuserFamilyList", index, "birthday"]}>
            <DatePicker style={{ width: "150px" }} />
          </Form.Item>
        );
      },
    },

    {
      title: "关系",
      dataIndex: "relation",
      key: "relation",
      render: (text, record, index) => {
        return (
          <Form.Item name={["uuserFamilyList", index, "relation"]}>
            <Select
              options={relationOptions}
              style={{ width: "80px" }}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            />
          </Form.Item>
        );
      },
    },
    {
      title: "证件类型",
      dataIndex: "docType",
      key: "docType",
      render: (text, record, index) => {
        return (
          <Form.Item name={["uuserFamilyList", index, "docType"]}>
            <Select
              options={certificateTye}
              style={{ width: "150px" }}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            />
          </Form.Item>
        );
      },
    },
    {
      title: "证件号码",
      dataIndex: "familyIdentityCard",
      key: "familyIdentityCard",
      render: (text, record, index) => {
        return (
          <Form.Item name={["uuserFamilyList", index, "familyIdentityCard"]}>
            <Input style={{ width: "180px" }} />
          </Form.Item>
        );
      },
    },
    {
      title: "工作省份",
      dataIndex: "workProvince",
      key: "workProvince",
      render: (text, record, index) => {
        return (
          <Form.Item name={["uuserFamilyList", index, "workProvince"]}>
            <Select
              showSearch
              options={CityAddressOptions}
              style={{ width: "150px" }}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            />
          </Form.Item>
        );
      },
    },
    {
      title: "工作情况",
      dataIndex: "workType",
      key: "workType",
      render: (text, record, index) => {
        return (
          <Form.Item name={["uuserFamilyList", index, "workType"]}>
            <Select
              options={workOptions}
              style={{ width: "150px" }}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            />
          </Form.Item>
        );
      },
    },
    {
      title: "联系电话",
      dataIndex: "phone",
      key: "phone",
      render: (text, record, index) => {
        return (
          <Form.Item name={["uuserFamilyList", index, "phone"]}>
            <Input style={{ width: "150px" }} />
          </Form.Item>
        );
      },
    },
    {
      title: "家庭住址",
      dataIndex: "address",
      key: "address",
      render: (text, record, index) => {
        return (
          <Form.Item name={["uuserFamilyList", index, "address"]}>
            <Input style={{ width: "450px" }} />
          </Form.Item>
        );
      },
    },
  ];
  const CheckupColumns = [
    {
      title: "编号",
      dataIndex: "id",
      key: "id",

      render: (text, record, index) => {
        return (
          <Form.Item name={["uuserCheckupList", index, "id"]}>
            {index + 1}
          </Form.Item>
        );
      },
    },
    {
      title: "年份",
      dataIndex: "year",
      key: "year",
      render: (text, record, index) => {
        return (
          <Form.Item name={["uuserCheckupList", index, "year"]}>
            <Input />
          </Form.Item>
        );
      },
    },
    {
      title: "体检结果",
      dataIndex: "contentPng",
      key: "contentPng",
      render: (text, record, index) => {
        return (
          <Form.Item name={["uuserCheckupList", index, "result"]}>
            <Select
              options={physicalOptions}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            />
          </Form.Item>
        );
      },
    },
    {
      title: "诊断结果",
      dataIndex: "content",
      key: "content",
      render: (text, record, index) => {
        return (
          <Form.Item name={["uuserCheckupList", index, "content"]}>
            <Input />
          </Form.Item>
        );
      },
    },
  ];

  // 设置显示默认值
  useEffect(() => {
    if (detailsData?.isDisease && detailsData?.isDisease?.split("-")[0] == 0) {
      setDisabled4(true);
    } else {
      setDisabled4(false);
    }
    form.setFieldsValue({
      isOneParent:detailsData.isOneParent && detailsData.isOneParent =="否"? "0":"1",
      birthday: detailsData.birthday && moment(detailsData.birthday),
      userName: detailsData?.studentName,
      docType: detailsData?.docType && detailsData?.docType?.split("-")[0],
      sex: detailsData?.sex && detailsData?.sex?.split("-")[0],
      nationId: String(detailsData?.nationId),
      areaId:
        detailsData.areaIds && detailsData.areaIds?.split(/[;,]/)?.map(Number),
      identityCard: detailsData?.identityCard,
      age: detailsData?.age,
      address: detailsData?.address,
      isDisease:
        detailsData?.isDisease && detailsData?.isDisease?.split("-")[0],
      diseaseName: detailsData?.diseaseName,
      studentGuardianList: detailsData?.studentGuardiansList?.map((a) => {
        return {
          id: a?.id,
          guarName: a?.guarName,
          relation: a?.relation?.split("-")[0],
          phone: a?.phone,
        };
      }),
      uuserFamilyList: detailsData?.uuserFamilyList?.map((item) => {
        return {
          id: item?.id,
          name: item?.name,
          relation: item?.relation && item?.relation?.split("-")[0],
          docType: item?.docType && item?.docType?.split("-")[0],
          familyIdentityCard: item?.familyIdentityCard,
          // education: item?.education && item?.education?.split('-')[0],
          workProvince:
            item?.workProvince && item?.workProvince.split("-")[0] - 0,
          workType: item?.workType && item?.workType.split("-")[0],
          phone: item?.phone,
          address: item?.address,
          birthday: item.birthday && moment(item.birthday),
          // nativePlace: item?.nativePlace && (item.nativePlace?.split('-')[0] + '')?.substring((item.nativePlace?.split('-')[0] + '').length - 2) != "00" ? [(item.nativePlace?.split('-')[0] + '')?.substring(0, 2) + '0000' - 0, (item.nativePlace?.split('-')[0] + '')?.substring(0, 4) + '00' - 0, item.nativePlace?.split('-')[0] - 0] : [(item.nativePlace?.split('-')[0] + '')?.substring(0, 2) + '0000' - 0, item.nativePlace?.split('-')[0] - 0],
          // nationName: item?.nationName?.split('-')[0],
          // sex: item?.sex?.split('-')[0]
        };
      }),
      uuserCheckupList: detailsData?.uuserCheckupList?.map((item) => {
        return {
          userId: item?.userId,
          id: item?.id,
          year: item?.year,
          result: item?.result.split("-")[0],
          content: item?.content,
        };
      }),
    });
  }, [detailsData]);

  //点击修改
  const onFinish = (value) => {

    console.log(value,"value")

    const filteredArr = value.studentGuardianList.filter((item) => {
      // 判断每个属性是否为空
      const isNotEmpty = item.id && item.guarName && item.relation && item.phone;
      return isNotEmpty;
    });

    const modifyValues = {
      isOneParent:value.isOneParent,
      birthday: moment(value["birthday"]).format("YYYY-MM-DD"),
      age: value.age ? value.age : "0",
      studentId: detailsData?.userId,
      areaId: value["areaId"] && value["areaId"][value.areaId.length - 1],
      studentGuardianList:filteredArr,
      uuserFamilyList: value.uuserFamilyList?.map((item) => {
        return {
          address: item.address,
          // education: item.education,
          familyIdentityCard: item.familyIdentityCard,
          id: item.id,
          name: item.name,
          // nationName: item.nationName - 0,
          // nativePlace: (item.nativePlace[2] !== null) ? item.nativePlace[2] : ((item.nativePlace[1] !== null) ? item.nativePlace[1] : item.nativePlace[0]),
          phone: item.phone,
          relation: item.relation,
          // sex: item.sex - 0,
          docType: item.docType,
          workProvince: item.workProvince,
          workType: item.workType,
          birthday: moment(item.birthday).format("YYYY-MM-DD"),
        };
      }),
    };
    const { ...newValues } = { ...value, ...modifyValues };
    dispatch({
      type: namespace + "/putStudentData",
      payload: newValues,
      callback: (res) => {
        console.log(res);
        if (res.err && res?.err?.code == 601) {
          // 错误提示
        } else {
          openNotificationWithIcon("success");
          showStudentVariation(false);
        }
      },
    });
  };
  // 学生创建提示
  const openNotificationWithIcon = (type) => {
    notification[type]({
      message: "修改学生信息提示",
      description: "您完成一名学生的修改！",
    });
  };

  //根据年份获取报告
  const handleYear = (e) => {
    console.log(e);
    dispatch({
      type: namespace + "/getMedicalExamination",
      payload: { checkYear: e, userId: detailsData?.userId },
      callback: (res) => {
        console.log(res, "体检信息");
        if (res.result[0]?.contentPng) {
          setReportImage(res.result[0].contentPng.split(";"));
        }
      },
    });
  };

  //点击切换

  const [amendData, setAmendData] = useState([]);
  const onChangeTabs = (e) => {
    console.log(e);
    if (e == 2) {
      dispatch({
        type: namespace + "/getAmendData",
        payload: { userId: detailsData?.userId },
        callback: (res) => {
          console.log(res, "修改记录");
          setAmendData(res?.result);
        },
      });
    }
  };

  //修改记录头
  const amendColumns = [
    {
      title: "序号",
      render: (text, record, index) => {
        return `${index + 1}`;
      },
    },
    {
      title: "调整字段",
      dataIndex: "modifyColName",
    },
    {
      title: "修改前字段信息",
      dataIndex: "oldContent",
    },
    {
      title: "修改后字段信息",
      dataIndex: "modifyContent",
    },
    {
      title: "修改时间",
      dataIndex: "createTime",
      render: (createTime) => {
        return moment(parseInt(createTime, 0)).format(
          "YYYY年-MM月-DD日 HH:mm:ss"
        );
      },
    },
  ];

  //点击取消
  const Cancel = () => {
    showStudentVariation(!studentVariationOpen);
  };

  const [disabled4, setDisabled4] = useState(false);
  const handleSelect4 = (e) => {
    console.log(e);
    if (e == 0) {
      setDisabled4(true);
    } else {
      setDisabled4(false);
    }
  };
  const ImageDiseaseImg =
    detailsData?.diseaseImg == null ? (
      <Row>
        {/* <Col span={6}>
          <Image width={180} src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"></Image>
        </Col>
        <Col span={6}>
          <Image width={180} src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"></Image>
        </Col> */}
      </Row>
    ) : (
      <Image.PreviewGroup
        preview={{
          onChange: (current, prev) =>
            console.log(`current index: ${current}, prev index: ${prev}`),
        }}
      >
        <Row>
          {detailsData?.diseaseImg.split(";").map((item, index) => {
            return (
              <Col span={6} key={index}>
                <Image width={180} height={180} src={item}></Image>
              </Col>
            );
          })}
        </Row>
      </Image.PreviewGroup>
    );

  return (
    <div>
      <Modal
        title="修改"
        visible={studentVariationOpen}
        width={900}
        footer={null}
        destroyOnClose={true}
        onCancel={() => showStudentVariation(!studentVariationOpen)}
        bodyStyle={{ padding: "0 24px 24px 24px" }}
      >
        <Tabs
          defaultActiveKey="1"
          className={styles["StudentDetails"]}
          onChange={onChangeTabs}
        >
          <Tabs.TabPane tab="学生信息" key="1">
            <Spin spinning={loading}>
              <Form
                name="form"
                form={form}
                onFinish={onFinish}
                autoComplete="off"
              >
                <div className={styles["miniBox"]}>
                  <h4 className={styles["titleH5"]}>基础信息</h4>
                  <div>
                    <Row>
                      <Col span={19}>
                        <Row style={{ padding: "10px 0" }}>
                          <Col span={10}>
                            <Form.Item label="姓名" name="userName">
                              <Input style={{ width: "150px" }} />
                            </Form.Item>
                          </Col>
                          <Col span={14}>
                            <Form.Item label="性别" name="sex">
                              <Select
                                getPopupContainer={(triggerNode) =>
                                  triggerNode.parentNode
                                }
                                options={sexOptions}
                                style={{ width: "190px" }}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row style={{ padding: "10px 0" }}>
                          <Col span={10}>
                            <Form.Item label="证件类型" name="docType">
                              <Select
                                disabled={true}
                                style={{ width: "180px" }}
                                options={certificateTye}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={14}>
                            <Form.Item label="民族" name="nationId">
                              <Select
                                showSearch
                                optionFilterProp="label"
                                options={nationNameOptions}
                                style={{ width: "190px" }}
                                getPopupContainer={(triggerNode) =>
                                  triggerNode.parentNode
                                }
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row style={{ padding: "10px 0" }}>
                          <Col span={10}>
                            <Form.Item label="证件号码" name="identityCard">
                              <Input
                                disabled={true}
                                style={{ width: "180px" }}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={14}>
                            <Form.Item label="年龄" name="age">
                              <Input
                                disabled={
                                  detailsData.docType?.split("-")[0] == 1
                                    ? true
                                    : false
                                }
                                style={{ width: "190px" }}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={5}>
                        {detailsData?.headImg == null ? (
                          <Image
                            width={100}
                            height={120}
                            style={{ border: "1px solid  #d9d9d9" }}
                            src="error"
                            fallback="data:image/png;base64,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"
                          />
                        ) : (
                          <Image
                            width={100}
                            height={120}
                            style={{ border: "1px solid  #d9d9d9" }}
                            src={detailsData?.headImg}
                          >
                            {" "}
                          </Image>
                        )}
                      </Col>
                    </Row>
                    <Row style={{ padding: "10px 0" }}>
                      <Col span={8}>学籍号：{variationAccount}</Col>
                      <Col span={8}>
                        <Form.Item label="出生日期" name="birthday">
                          <DatePicker />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item label="籍贯" name="areaId">
                      <Cascader
                        options={ProvinceCityAddressOptions}
                        style={{ width: "720px" }}
                        getPopupContainer={(triggerNode) =>
                          triggerNode.parentNode
                        }
                      />
                    </Form.Item>
                    <Form.List name="studentGuardianList">
                      {(fields, { add, remove }) => {
                        if (fields.length < 2) {
                          for (let i = fields.length; i < 2; i++) {
                            fields.push({ key: i, name: i });
                          }
                        }
                        return (
                          <>
                            {fields.map(({ key, name, ...restField }) => {
                              return (
                                <>
                                  <div
                                    key={key}
                                    style={{ marginBottom: "16px" }}
                                  >
                                    <Row style={{ padding: "10px 0" }}>
                                      <Col span={8}>
                                        <Form.Item
                                          label="监护人姓名"
                                          name={[name, "guarName"]}
                                        >
                                          <Input style={{ width: "150px" }} />
                                        </Form.Item>
                                      </Col>

                                      <Col span={8}>
                                        <Form.Item
                                          label="与学生关系："
                                          name={[name, "relation"]}
                                        >
                                          <Select
                                            showSearch
                                            optionFilterProp="label"
                                            options={relationOptions}
                                            style={{ width: "150px" }}
                                            getPopupContainer={(triggerNode) =>
                                              triggerNode.parentNode
                                            }
                                          />
                                        </Form.Item>
                                      </Col>

                                      <Col span={8}>
                                        <Form.Item
                                          label="手机号："
                                          name={[name, "phone"]}
                                        >
                                          <Input style={{ width: "150px" }} />
                                        </Form.Item>
                                      </Col>
                                    </Row>
                                  </div>
                                </>
                              );
                            })}
                          </>
                        );
                      }}
                    </Form.List>

                    <Row style={{ padding: "10px 0" }}>
                      <Col span={24}>
                        <Form.Item label="家庭住址：" name="address">
                          <Input style={{ width: "690px" }} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row style={{ padding: "10px 0" }}>
                      <Col span={8}>
                        <Form.Item label="具有特殊疾病" name="isDisease">
                          <Select
                            options={isDiseaseOptions}
                            onChange={handleSelect4}
                            style={{ width: "150px" }}
                            getPopupContainer={(triggerNode) =>
                              triggerNode.parentNode
                            }
                          />
                        </Form.Item>
                      </Col>

                      <Col span={16}>
                        <Form.Item label="疾病名称" name="diseaseName">
                          <Input
                            disabled={disabled4}
                            style={{ width: "420px" }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row style={{ padding: "10px 0" }}>
                      <Col span={8}>
                        <Form.Item label="是否单亲家庭" name="isOneParent">
                          <Select
                            options={[
                              { label: "是", value: "1" },
                              { label: "否", value: "0" },
                            ]}
                            style={{ width: "150px" }}
                            getPopupContainer={(triggerNode) =>
                              triggerNode.parentNode
                            }
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                </div>
                <div className={styles["miniBox"]}>
                  <h3 className={styles["titleH5"]}>疾病证明书</h3>
                  <div style={{ textAlign: "center" }}>{ImageDiseaseImg}</div>
                </div>

                <div className={styles["miniBox"]}>
                  <h3 className={styles["titleH5"]}>教育信息</h3>
                  {educational?.map((item, index) => {
                    return (
                      <div key={index}>
                        <Row style={{ padding: "10px 0" }}>
                          <Col span={8}>开始时间：{item?.startDate}</Col>
                          <Col span={8}></Col>
                          <Col span={8}>截止时间：{item?.endDate}</Col>
                        </Row>
                        <Row style={{ padding: "10px 0" }}>
                          <Col span={8}>届别：{item?.spoceId}</Col>
                          <Col span={8}>学段：{item?.studyName}</Col>
                          <Col span={8}>学校名称：{item?.schoolName}</Col>
                        </Row>
                        <Row style={{ padding: "10px 0" }}>
                          <Col span={8}>就读年级：{item?.gradeName}</Col>
                        </Row>
                        <Row style={{ padding: "10px 0" }}>
                          {item?.studentMassageList?.length > 0 ? null : (
                            <Col span={8}>
                              {" "}
                              有无跳级转班记录：无转班，跳级记录
                            </Col>
                          )}
                          {/* <Col span={8}>有无跳级记录：{item?.studentMassageList?.length > 0 ? '有' : '无'}</Col> */}
                        </Row>
                        {item?.studentMassageList?.map((a) => {
                          return (
                            <div key={a?.id}>
                              <Row style={{ padding: "10px 0" }}>
                                <Col span={8}>
                                  {a?.operate}记录：{a?.operateDate}
                                </Col>
                                <Col span={12}>
                                  {a?.oldName}
                                  <b>——————</b>
                                  {a?.newName}
                                </Col>
                              </Row>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
                <div className={styles["miniBox"]}>
                  <h3 className={styles["titleH5"]}>家庭信息</h3>
                  <div>
                    <Table
                      columns={FamilyColumns}
                      dataSource={FamilyList?.map((item) => {
                        return { ...item, key: item.id };
                      })}
                      bordered
                      pagination={false}
                      scroll={{ x: true }}
                    />
                  </div>
                </div>
                <div className={styles["miniBox"]}>
                  <h3 className={styles["titleH5"]}>体检信息</h3>
                  <Spin
                    indicator={null}
                    tip="为方便您使用，此处信息请前往手机APP修改"
                  >
                    <div>
                      <Table
                        columns={CheckupColumns}
                        dataSource={CheckupList?.map((item) => {
                          return { ...item, key: item.id };
                        })}
                        bordered
                        pagination={false}
                      />
                    </div>
                    <div
                      className={styles["miniBox"]}
                      style={{ marginTop: "20px" }}
                    >
                      <h3
                        className={styles["titleH5"]}
                        style={{ marginLeft: 0 }}
                      >
                        查看体检报告年份{" "}
                        <Select
                          showSearch
                          optionFilterProp="label"
                          options={yearOptions}
                          style={{ width: 100 }}
                          onChange={handleYear}
                          getPopupContainer={(triggerNode) =>
                            triggerNode.parentNode
                          }
                        />{" "}
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                        }}
                      >
                        <Image.PreviewGroup
                          preview={{
                            onChange: (current, prev) =>
                              console.log(
                                `current index: ${current}, prev index: ${prev}`
                              ),
                          }}
                        >
                          {ReportImage &&
                            ReportImage?.map((item, index) => {
                              return (
                                <Row>
                                  <Col span={6} key={index}>
                                    <Image
                                      width={180}
                                      height={130}
                                      src={item}
                                    ></Image>
                                  </Col>
                                </Row>
                              );
                            })}
                        </Image.PreviewGroup>
                      </div>
                    </div>
                  </Spin>
                </div>

                <div style={{ textAlign: "center" }}>
                  <Button
                    type="primary"
                    style={{ marginRight: "10px" }}
                    onClick={Cancel}
                  >
                    取消
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ marginLift: "10px" }}
                  >
                    确认
                  </Button>
                </div>
              </Form>
            </Spin>
          </Tabs.TabPane>

          <Tabs.TabPane tab="修改记录" key="2">
            <Table
              columns={amendColumns}
              dataSource={amendData.map((item) => {
                return { ...item, key: item.id };
              })}
              bordered
              pagination={false}
            />
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    DictionaryDictGroups: state[namespace].DictionaryDictGroups,
    DictionaryAddress: state[namespace].DictionaryAddress,

    CityAddressOptions: state[namespace].CityAddressOptions,
    ProvinceCityAddressOptions: state[namespace].ProvinceCityAddressOptions,
  };
};
export default memo(connect(mapStateToProps)(index));
