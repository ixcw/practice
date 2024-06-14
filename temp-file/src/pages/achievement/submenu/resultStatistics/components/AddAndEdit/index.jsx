import { connect } from "dva";
import { useEffect, useState } from "react";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import RichTextEditor from "@/components/RichText";
import {
  Modal,
  Breadcrumb,
  Button,
  Form,
  Input,
  Select,
  Row,
  Col,
  Upload,
  Spin,
  DatePicker,
  message,
} from "antd";
import { AchievementSubmenu as namespace } from "@/utils/namespace";
import styles from "./index.module.scss";
import "dayjs/locale/zh-cn";
import locale from "antd/es/date-picker/locale/zh_CN";
import accessTokenCache from "@/caches/accessToken";
import moment from "moment";

const token = accessTokenCache() && accessTokenCache();
const Authorization = { Authorization: token };

const AddAndEdit = ({ visible, data, dispatch, lookHandle }) => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true); //加载
  const [gradeList, setGradeList] = useState([]); // 界别列表
  const [groupList, setGroupList] = useState([]); // 存储组别
  const [previewOpen, setPreviewOpen] = useState(false); // 图片预览的弹框
  const [previewImage, setPreviewImage] = useState(""); //预览的图片
  const [fileList, setFileList] = useState([]); //上传图片的数组
  const [defaultFileList, setDefaultFileList] = useState([]); // 文件列表
  const [action, setAction] = useState(); //存储接口
  const [rankList, setRankList] = useState([]); // 存储成果级别
  const [awardList, setAwardList] = useState([]); // 存储成果奖项
  const [classOptions, setClassOptions] = useState([]); // 获得者下拉框
  const [obtainedValue, setObtainedValue] = useState(); // 存储获得者选着得身份
  const [participationValue, setParticipationValue] = useState(); // 存储参与者选的身份
  const [NameOptions, setNameOptions] = useState([]); // 存储获得者姓名下拉框内容
  const [parNameOptions, setParNameOptions] = useState([]); // 存储参与者姓名下拉框内容
  const [participationOption, setParticipationOption] = useState([]); // 参与者学生或教师下拉框
  const [timeValue, setItemValue] = useState(""); // 存储选择的时间
  const [studentTeacher, setStudentTeacher] = useState([]); // 获得者学生或教师数据
  const [pStudentTeacher, setPStudentTeacher] = useState([]); // 参与者学生或教师
  const [typeOptions, setTypeOptions] = useState([]); // 成果类型下拉框

  useEffect(() => {
    setLoading(true);

    dispatch({
      type: namespace + "/getGradeIdApi",
      callback: (res) => {
        console.log(res, "=>年级数据");
        if (res.result.code == 200) {
          setGradeList(
            res.result.data.map((item) => {
              return {
                value: item.id,
                label: item.name,
              };
            })
          );
        } else {
          return;
        }
      },
    });

    dispatch({
      type: namespace + "/teacherGroup",
      callback: (res) => {
        console.log(res, "教研组");
        if (res.code === 200) {
          setGroupList(
            res.data?.map((item) => {
              return { value: item.id, label: item.teachGroupName };
            })
          );
        } else {
          return;
        }
      },
    });

    // 获取字典数据
    dispatch({
      type: namespace + "/batchLoadDictGroups",
      payload: {
        dictCodes: "DICT_ACHV_LEVEL,DICT_ACHV_AWARD_LEVEL,DICT_ACHV_TYPE",
      },
      callback: (res) => {
        console.log(res, "字典数据");
        if (res.code === 200) {
          setRankList(
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

    if (data?.foo == "修改成果") {
      //请求数据赋值
      console.log(data, "传递的数据");
      dispatch({
        type: namespace + "/achievementDetails",
        payload: { id: data?.id },
        callback: (res) => {
          console.log(res, "详情数据");
          if (res.code == 200) {
            setFileList(
              res.data?.achiPng?.split(",").map((item, index) => {
                return {
                  url: item,
                  uid: index,
                  status: "done",
                  name: "image.png",
                };
              })
            ); // 图片

            form.setFieldsValue({
              achiPng: res.data?.achiPng?.split(",").map((item, index) => {
                return {
                  url: item,
                  uid: index,
                  status: "done",
                  name: "image.png",
                };
              }),
            });
            // const efaultFileList = [
            //   {
            //     uid: '-1',
            //     name: 'xxx.png',
            //     status: 'done',
            //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            //     thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            //   },
            //   {
            //     uid: '-2',
            //     name: 'yyy.png',
            //     status: 'error',
            //   },
            // ];
            setDefaultFileList(
              res.data?.annex?.map((item, index) => {
                return {
                  uid: index,
                  name: item.annexDesignation,
                  status: "done",
                  url: item.annexWebsite,
                  thumbUrl: item.annexWebsite,
                };
              })
            ); // 文件；列表

            setItemValue(res.data.getTime); // 时间

            //获得者请求数据
            if (res.data.roleId == 1) {
              //学生
              dispatch({
                type: namespace + "/getGradeIdApi",
                callback: (em) => {
                  console.log(em, "=>年级数据");
                  if (em.result.code == 200) {
                    setClassOptions(
                      em.result?.data?.map((item) => {
                        return {
                          value: item.id,
                          label: item.name,
                        };
                      })
                    );
                  } else {
                    return;
                  }
                },
              });

              dispatch({
                type: namespace + "/getParticipantStudentName",
                payload: { spoceId: res.data.getSpoceId },
                callback: (em) => {
                  console.log(em, "学生");
                  if (em.code == 200) {
                    setStudentTeacher(em.data);
                    setNameOptions(
                      em.data?.map((item) => {
                        return {
                          value: item.id,
                          label:
                            item.name +
                            item.identityCard?.slice(0, 4) +
                            "**" +
                            item.identityCard?.slice(-4),
                        };
                      })
                    );
                  } else {
                    message.error(em.alert);
                  }
                },
              });
            } else if (res.data.roleId == 2) {
              // 教师
              // setClassOptions(groupList);

              dispatch({
                type: namespace + "/teacherGroup",
                callback: (em) => {
                  console.log(res, "教研组");
                  if (em.code === 200) {
                    setClassOptions(
                      em.data?.map((item) => {
                        return { value: item.id, label: item.teachGroupName };
                      })
                    );
                  } else {
                    return;
                  }
                },
              });

              dispatch({
                type: namespace + "/getParticipantTeacherName",
                payload: { teachGroupId: res.data.teachGroupId },
                callback: (em) => {
                  console.log(em, "教师");
                  if (em.code == 200) {
                    setStudentTeacher(em.data);
                    setNameOptions(
                      em.data?.map((item) => {
                        return {
                          value: item.id,
                          label:
                            item.name +
                            item.identityCard?.slice(0, 4) +
                            "**" +
                            item.identityCard?.slice(-4),
                        };
                      })
                    );
                  } else {
                    message.error(em.alert);
                  }
                },
              });
            } else {
              setClassOptions([]);
            }

            //参与者修改请求数据
            if (res.data?.otherRoleId == 1) {
              // setParticipationOption(gradeList);

              dispatch({
                type: namespace + "/getGradeIdApi",
                callback: (em) => {
                  console.log(em, "=>年级数据");
                  if (em.result.code == 200) {
                    setParticipationOption(
                      em.result.data.map((item) => {
                        return {
                          value: item.id,
                          label: item.name,
                        };
                      })
                    );
                  } else {
                    return;
                  }
                },
              });

              dispatch({
                type: namespace + "/getParticipantStudentName",
                payload: { spoceId: res.data.joinSpoceId },
                callback: (em) => {
                  console.log(em, "参与者学生");
                  if (em.code == 200) {
                    setPStudentTeacher(em.data);
                    setParNameOptions(
                      em.data?.map((item) => {
                        return {
                          value: item.id,
                          label:
                            item.name +
                            item.identityCard?.slice(0, 4) +
                            "**" +
                            item.identityCard?.slice(-4),
                        };
                      })
                    );
                  } else {
                    message.error(em.alert);
                  }
                },
              });
            } else if (res.data.otherRoleId == 2) {
              // setParticipationOption(groupList);

              dispatch({
                type: namespace + "/teacherGroup",
                callback: (em) => {
                  console.log(em, "教研组");
                  if (em.code === 200) {
                    setParticipationOption(
                      em.data?.map((item) => {
                        return { value: item.id, label: item.teachGroupName };
                      })
                    );
                  } else {
                    return;
                  }
                },
              });

              dispatch({
                type: namespace + "/getParticipantTeacherName",
                payload: { teachGroupId: res.data.otherTeachGroupId },
                callback: (em) => {
                  console.log(em, "教师");
                  if (em.code == 200) {
                    setPStudentTeacher(em.data);
                    setParNameOptions(
                      em.data?.map((item) => {
                        return {
                          value: item.id,
                          label:
                            item.name +
                            item.identityCard?.slice(0, 4) +
                            "**" +
                            item.identityCard?.slice(-4),
                        };
                      })
                    );
                  } else {
                    message.error(em.alert);
                  }
                },
              });
            } else {
              setParticipationOption([]);
            }

            setObtainedValue(res.data?.roleId);
            setParticipationValue(res.data?.otherRoleId);

            form.setFieldsValue({
              Lv: {
                province: res.data?.achiLevel ? res.data?.achiLevel : null,
                willRank: String(res.data.willRankId),
              },
              stand: {
                userId: res.data?.userId
                  ? res.data?.userId.split(",").map(Number)
                  : null, //获得者id
                getSpoceId:
                  res.data?.roleId == 1
                    ? res.data?.getSpoceId
                    : Number(res.data?.teachGroupId), //获得者届id
              }, //获得者
              achiNo: res.data?.achiNo, //成果编号
              achiType: res.data?.achiType, //成果类型
              content: res.data?.content, //内容

              getTime: moment(res.data?.getTime), //获得时间

              name: res.data?.name, //成果名称

              otherAchiType: res.data?.otherAchiType, //其他获奖类型

              otherRoleId: res.data?.otherRoleId, //参与者角色id，1为学生，2为老师
              participation: {
                joinSpoceId:
                  res.data?.otherRoleId == 1
                    ? res.data?.joinSpoceId
                    : res.data?.otherTeachGroupId,
                otherUserName: res.data?.otherUserId
                  ? res.data?.otherUserId?.split(",").map(Number)
                  : null, //参与者姓名
              },
              roleId: res.data?.roleId,
            }); // 使用 setFieldsValue 设置表单字段的值

            setLoading(false);
          }
        },
      });
    } else {
      form.setFieldsValue({}); // 使用 setFieldsValue 设置表单字段的值
      setLoading(false);
    }
  }, [data?.foo]);

  useEffect(() => {
    console.log("执行了没有");
    setFileList([]); //删除图片
  }, [visible]);

  // 定义校验规则
  const validationRules = {
    name: [
      {
        required: true,
        message: "请填写姓名",
      },
    ],
    email: [
      {
        required: true,
        message: "请填写邮箱地址",
      },
    ],
    province: [
      {
        required: true,
        message: "请填写邮箱地址",
      },
    ],
    province2: [
      {
        required: true,
        message: "请填写邮箱地址",
      },
    ],
  };

  //保存
  const handleOtherEvent = () => {
    const img = fileList.map((item) => {
      return item.url || item.response.data;
    });
    const annex =
      defaultFileList &&
      defaultFileList.map((item) => {
        return {
          annexDesignation: item.name,
          annexWebsite: item.url || item.response.data,
        };
      });

    const annexName =
      defaultFileList &&
      defaultFileList.map((item) => {
        return item.name;
      });

    //处理是届别还是组别

    form
      .validateFields()
      .then((values) => {
        console.log(values);
        // 如果校验通过，则执行其他事件的逻辑
        // const card = studentTeacher.filter(
        //   (item) => item.id == values["stand"].userId
        // )[0];
        // console.log(card, "身份证");
        console.log(pStudentTeacher);
        console.log(studentTeacher);
        // console.log(NameOptions);

        const filteredNames = values["participation"]?.otherUserName
          ? pStudentTeacher
              .filter((item) =>
                values["participation"]?.otherUserName?.includes(item.id)
              )
              .map((item) => item.name)
          : null;

        const stanUser = studentTeacher
          .filter((item) => values["stand"].userId.includes(item.id))
          .map((item) => item.identityCard)
          .join(",");

        console.log(stanUser);

        console.log(values["participation"]?.otherUserName);
        console.log(filteredNames);

        const dataList = {
          achiLevel: values["Lv"].province,
          achiNo: values["achiNo"],
          achiPng: img.join(","),
          achiType: values["achiType"],
          annex: annex,
          annexName: annexName.join(","),
          content: values["content"],
          getSpoceId: obtainedValue == 1 ? values["stand"].getSpoceId : null,
          getTime: timeValue,
          joinSpoceId:
            participationValue == 1
              ? values["participation"].joinSpoceId
              : null,
          name: values["name"],
          otherAchiType: values["otherAchiType"],
          otherRoleId: values["otherRoleId"],
          otherTeachGroupId:
            participationValue == 2
              ? values["participation"]?.joinSpoceId
              : null,
          otherUserId: values["participation"]?.otherUserName
            ? values["participation"]?.otherUserName.join(",")
            : null,
          roleId: values["roleId"],
          teachGroupId: obtainedValue == 2 ? values["stand"].getSpoceId : null,
          userId: values["stand"].userId.join(","),
          userIdentityCard: stanUser,
          willRankId: values["Lv"].willRank,
          otherUserName: filteredNames ? filteredNames.join(",") : null,
        };
        console.log(dataList, "上传的");

        // 关闭弹框

        if (data?.foo == "修改成果") {
          const dataList2 = { ...dataList, id: data?.id };

          dispatch({
            type: namespace + "/updateAchievement",
            payload: dataList2,
            callback: (res) => {
              console.log(res, "数据");
              if (res.code == 200) {
                console.log(data);

                message.success("修改成功");

                dispatch({
                  type: `${namespace}/hideModal`,
                });
                lookHandle();
              }else{
                message.error(res.msg);
              }
            },
          });
        } else {
          dispatch({
            type: namespace + "/addAchievements",
            payload: dataList,
            callback: (res) => {
              console.log(res, "数据");
              if (res.code == 200) {
                console.log(data);

                message.success("添加成功");

                dispatch({
                  type: `${namespace}/hideModal`,
                });
                lookHandle();
              }else{
                message.error(res.msg)
              }
            },
          });
        }
      })
      .catch((error) => {
        // 校验不通过，可以进行相关处理，比如显示错误信息
        console.log("校验不通过", error);
        message.error(`有${error.errorFields.length}个必填项未填`);
      });
  };

  //上传成果图片
  const normFile = (e) => {
    console.log(e, "=>上传图片绑定的");
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleUpload = ({ fileList: newFileList }) => {
    console.log(newFileList);
    setFileList(newFileList);
    form.setFieldsValue({ achiPng: newFileList });
  };

  const beforeUpload = (file, fileListItem) => {
    const isImage = file.type === "image/jpeg" || file.type === "image/png";
    if (!isImage) {
      message.error("只能上传jpg或png格式的图片");
      return isImage || Upload.LIST_IGNORE;
    }
    const maxCount = 3; // 最大限制为3个文件
    if (fileListItem.length + 1 > maxCount) {
      message.error(`最多只能上传${maxCount}张图片`);
      return Upload.LIST_IGNORE;
    }
    return isImage;
  };
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const ImageHandleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    console.log(file, "=>这是点击的");
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  //上传成果相关资料
  const handleBeforeUpload = ({ file, fileList: newFileList }) => {
    console.log(file, newFileList);
    setDefaultFileList(newFileList);
  };

  const handlePreviewFile = (file) => {
    console.log(file);
    // 自定义文件跳转逻辑
    const filePath = `${file.response.data}`; // 根据需要设置自定义路径或URL
    window.open(filePath, "_blank"); // 通过 window.open() 方法打开一个新窗口或标签页
  };

  //身份下拉内容
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

  // //成果类型下拉内容
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
  //     value: "其他成果类型",
  //     label: "其他成果类型",
  //   },
  // ];

  const [AchiTypeDisabled, setAchiTypeDisabled] = useState(true);

  const typeHandle = (value) => {
    form.setFieldsValue({ otherAchiType: null });
    console.log(value);
    if (value == "5") {
      setAchiTypeDisabled(false);
    } else {
      setAchiTypeDisabled(true);
    }
  };

  //富文本
  const [content, setContent] = useState("");

  const handleEditorChange = (newContent) => {
    setContent(newContent);
    console.log(content);
  };

  const handleCancel = () => {
    dispatch({
      type: `${namespace}/hideModal`,
    });
  };

  //获得者身份下拉改变
  const standHandle = (value) => {
    form.setFieldsValue({
      stand: {
        getSpoceId: null,
        userId: [],
      },
    });

    console.log(value);
    setObtainedValue(value);
    if (value == 1) {
      setClassOptions(gradeList);
    } else if (value == 2) {
      setClassOptions(groupList);
    } else {
      setClassOptions([]);
    }
  };

  //获得者届别或组别改变事件

  const classHandle = (value) => {
    console.log(value);

    form.setFieldsValue({
      stand: {
        userId: [],
      },
    });

    if (obtainedValue == 1) {
      dispatch({
        type: namespace + "/getParticipantStudentName",
        payload: { spoceId: value },
        callback: (res) => {
          console.log(res, "学生");
          if (res.code == 200) {
            setStudentTeacher(res.data);
            setNameOptions(
              res.data?.map((item) => {
                return {
                  value: item.id,
                  label:
                    item.name +
                    item.identityCard?.slice(0, 4) +
                    "**" +
                    item.identityCard?.slice(-4),
                };
              })
            );
          } else {
            message.error(res.alert);
          }
        },
      });
    } else if (obtainedValue == 2) {
      dispatch({
        type: namespace + "/getParticipantTeacherName",
        payload: { teachGroupId: value },
        callback: (res) => {
          console.log(res, "教师");
          if (res.code == 200) {
            setStudentTeacher(res.data);
            setNameOptions(
              res.data.map((item) => {
                return {
                  value: item.id,
                  label:
                    item.name +
                    item.identityCard?.slice(0, 4) +
                    "**" +
                    item.identityCard?.slice(-4),
                };
              })
            );
          } else {
            message.error(res.alert);
          }
        },
      });
    } else {
      setNameOptions([]);
    }
  };

  //参与者身份改变
  const participationHandle = (value) => {
    form.setFieldsValue({
      participation: {
        joinSpoceId: null,
        otherUserName: [],
      },
    });

    setParticipationValue(value);
    if (value == 1) {
      setParticipationOption(gradeList);
    } else if (value == 2) {
      setParticipationOption(groupList);
    } else {
      setParticipationOption([]);
    }
  };
  // 参与者教研组或者届别下拉框改变事件
  const participationOptionsHandle = (value) => {
    if (participationValue == 1) {
      dispatch({
        type: namespace + "/getParticipantStudentName",
        payload: { spoceId: value },
        callback: (res) => {
          console.log(res, "学生");
          if (res.code == 200) {
            setPStudentTeacher(res.data);
            setParNameOptions(
              res.data?.map((item) => {
                return {
                  value: item.id,
                  label:
                    item.name +
                    item.identityCard?.slice(0, 4) +
                    "**" +
                    item.identityCard?.slice(-4),
                };
              })
            );
          } else {
            message.error(res.alert);
          }
        },
      });
    } else if (participationValue == 2) {
      dispatch({
        type: namespace + "/getParticipantTeacherName",
        payload: { teachGroupId: value },
        callback: (res) => {
          console.log(res, "教师");
          if (res.code == 200) {
            setPStudentTeacher(res.data);
            setParNameOptions(
              res.data?.map((item) => {
                return {
                  value: item.id,
                  label:
                    item.name +
                    item.identityCard?.slice(0, 4) +
                    "**" +
                    item.identityCard?.slice(-4),
                };
              })
            );
          } else {
            message.error(res.alert);
          }
        },
      });
    } else {
      setParNameOptions([]);
    }

    form.setFieldsValue({
      participation: {
        otherUserName: [],
      },
    });
  };

  //时间改变事件
  const handleDateChange = (date, dateString) => {
    console.log(date, dateString);
    setItemValue(dateString);
  };
  const disabledDate = (current) => {
    // 获取4号的日期
    const fourthDay = new Date();
    fourthDay.setDate(fourthDay.getDate() + 1); // 将日期设置为明天
    fourthDay.setHours(0, 0, 0, 0);

    // 比较传入的日期与4号的日期
    return current && current.valueOf() >= fourthDay.getTime();
  };
  const [valueLabel, setValueLabel] = useState([]);
  // 获取参与者姓名
  const otherUserNameHandle = (value, optionLabelProp) => {
    console.log(value, optionLabelProp);
  };

  return (
    <Modal
      width={1200}
      visible={visible}
      footer={null}
      // closable={false}
      destroyOnClose={true}
      onCancel={() => handleCancel()}
    >
      {/* 弹框内容，可以使用 data 中的数据 */}
      <div
        style={{
          padding: "0 1.25rem",
          height: "4.5rem",
          borderBottom: ".125rem solid #F5F6F9",
          backgroundColor: "#fff",
        }}
      >
        <h1 className={styles.submeun}>{data && data.foo}</h1>
      </div>

      <div
        style={{
          width: "100%",
          backgroundColor: "#fff",
          padding: "1rem 2.25rem",
        }}
      >
        <Spin size="large" spinning={loading}>
          <Form form={form} name="成果">
            <Row gutter={[40, 0]} wrap>
              <Col span={6}>
                <Form.Item
                  name="name"
                  label="成果名称："
                  rules={validationRules.name}
                >
                  <Input placeholder="请输入名称" />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  name="getTime"
                  label="获得时间："
                  rules={[{ required: true }]}
                >
                  <DatePicker
                    onChange={handleDateChange}
                    disabledDate={disabledDate}
                    disabled={data?.foo == "修改成果" ? true : false}
                  ></DatePicker>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="achiType"
                  label="成果类型："
                  rules={[{ required: true }]}
                >
                  <Select
                    optionFilterProp="label"
                    allowClear
                    showSearch
                    placeholder="请选择类型"
                    onChange={typeHandle}
                    options={typeOptions}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="otherAchiType" label="其他成果名称：">
                  <Input
                    disabled={AchiTypeDisabled}
                    placeholder="请输入其他获奖"
                  />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item name="achiNo" label="成果(证书)编号：">
                  <Input placeholder="请输入成果证书编号" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="Lv"
                  label="成果等级："
                  rules={[{ required: true }]}
                >
                  <Input.Group compact>
                    <Form.Item
                      name={["Lv", "province"]}
                      noStyle
                      rules={[{ required: true, message: "请选择级别" }]}
                    >
                      <Select
                        style={{ width: "50%" }}
                        optionFilterProp="label"
                        allowClear
                        showSearch
                        placeholder="请选择级别"
                        options={rankList}
                        getPopupContainer={(triggerNode) =>
                          triggerNode.parentNode
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      name={["Lv", "willRank"]}
                      noStyle
                      rules={[{ required: true, message: "请选择奖项 " }]}
                    >
                      <Select
                        style={{ width: "50%" }}
                        optionFilterProp="label"
                        allowClear
                        showSearch
                        placeholder="请选择奖项"
                        options={awardList}
                        getPopupContainer={(triggerNode) =>
                          triggerNode.parentNode
                        }
                      />
                    </Form.Item>
                  </Input.Group>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="roleId"
                  label="获得者身份："
                  rules={[{ required: true }]}
                >
                  <Select
                    optionFilterProp="label"
                    showSearch
                    onChange={standHandle}
                    placeholder="请选择身份"
                    options={standOptions}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  />
                </Form.Item>
              </Col>
              <Col span={18}>
                <Form.Item
                  name="stand"
                  label="获得者姓名："
                  rules={[{ required: true }]}
                >
                  <Input.Group compact>
                    <Form.Item
                      name={["stand", "getSpoceId"]}
                      noStyle
                      rules={[{ required: true, message: "请选择组或届" }]}
                    >
                      <Select
                        style={{ width: "25%" }}
                        optionFilterProp="label"
                        showSearch
                        placeholder="请选择等级"
                        onChange={classHandle}
                        options={classOptions}
                        getPopupContainer={(triggerNode) =>
                          triggerNode.parentNode
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      name={["stand", "userId"]}
                      noStyle
                      rules={[{ required: true, message: "请选择姓名 " }]}
                    >
                      <Select
                        mode="multiple"
                        style={{ width: "75%" }}
                        optionFilterProp="label"
                        showSearch
                        placeholder="请选择姓名"
                        options={NameOptions}
                        labelInValue={false}
                        getPopupContainer={(triggerNode) =>
                          triggerNode.parentNode
                        }
                      />
                    </Form.Item>
                  </Input.Group>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="otherRoleId" label="参与者身份：">
                  <Select
                    optionFilterProp="label"
                    showSearch
                    onChange={participationHandle}
                    placeholder="请选择身份"
                    options={standOptions}
                    allowClear
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  />
                </Form.Item>
              </Col>
              <Col span={18}>
                <Form.Item name="participation" label="参与者姓名：">
                  <Input.Group compact>
                    <Form.Item name={["participation", "joinSpoceId"]} noStyle>
                      <Select
                        style={{ width: "25%" }}
                        optionFilterProp="label"
                        showSearch
                        onChange={participationOptionsHandle}
                        placeholder="请选择组或届"
                        options={participationOption}
                        getPopupContainer={(triggerNode) =>
                          triggerNode.parentNode
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      name={["participation", "otherUserName"]}
                      noStyle
                    >
                      <Select
                        mode="multiple"
                        style={{ width: "75%" }}
                        optionFilterProp="label"
                        allowClear
                        showSearch
                        onChange={otherUserNameHandle}
                        labelInValue={false}
                        placeholder="请选择姓名"
                        options={parNameOptions}
                        getPopupContainer={(triggerNode) =>
                          triggerNode.parentNode
                        }
                      />
                    </Form.Item>
                  </Input.Group>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="content"
              label="成果详情："
              style={{ height: "250px" }}
            >
              <RichTextEditor value={content} onChange={handleEditorChange} />
            </Form.Item>

            <Form.Item
              name="achiPng"
              label="成果证书："
              getValueFromEvent={normFile}
              rules={[
                {
                  required: true, // 这里标记为required
                  message: "请上传成果证书", // 这是不通过验证时的提示信息
                },
              ]}
            >
              <div>
                <Upload
                  action="/auth/web/front/v1/upload/uploadImage"
                  headers={Authorization}
                  listType="picture-card"
                  beforeUpload={beforeUpload}
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleUpload}
                >
                  <div>
                    <PlusOutlined />
                    <div
                      style={{
                        marginTop: 8,
                      }}
                    >
                      上传
                    </div>
                  </div>
                </Upload>
                <div style={{ fontSize: ".625rem", color: "#666666" }}>
                  (请上传文件，支持jpg、png格式)
                </div>
                <Modal
                  open={previewOpen}
                  footer={null}
                  onCancel={ImageHandleCancel}
                >
                  <img
                    alt="example"
                    style={{
                      width: "100%",
                    }}
                    src={previewImage}
                  />
                </Modal>
              </div>
            </Form.Item>

            <Row gutter={[40, 0]} wrap>
              <Col span={10}>
                <Form.Item name="annex" label="成果相关资料：">
                  <div>
                    <Upload
                      maxCount={4}
                      listType="picture"
                      action="/auth/web/front/v1/upload/uploadFile"
                      headers={Authorization}
                      defaultFileList={[...defaultFileList]}
                      fileList={defaultFileList}
                      onChange={handleBeforeUpload}
                      onPreview={handlePreviewFile}
                    >
                      <Button icon={<UploadOutlined />}>上传</Button>
                    </Upload>
                    <div style={{ fontSize: ".625rem", color: "#666666" }}>
                      (请上传文件，支持jpg、png、pdf等格式)
                    </div>
                  </div>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item wrapperCol={{ san: 24 }}>
              <div style={{ textAlign: "center" }}>
                <Button
                  type="primary"
                  style={{ marginRight: 10 }}
                  onClick={handleOtherEvent}
                >
                  保存
                </Button>
                <Button onClick={handleCancel}>取消</Button>
              </div>
            </Form.Item>
          </Form>
        </Spin>
      </div>
    </Modal>
  );
};

// 将 reducers 中的状态映射到组件的 props 上
function mapStateToProps(state) {
  return {
    visible: state[namespace].visible, // 使用正确的 namespace
    data: state[namespace].data, // 使用正确的 namespace
  };
}

export default connect(mapStateToProps)(AddAndEdit);
