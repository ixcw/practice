/**
 * 学生数据
 * @author:田忆
 * date:2023年4月25日
 * */

import styles from "./index.less";
import React, { useEffect, memo, useRef } from "react";
import { connect } from "dva";
import moment from "moment";
import { StudentData as namespace } from "@/utils/namespace";
import {
  Modal,
  Tabs,
  Form,
  Row,
  Col,
  Image,
  Spin,
  Space,
  Table,
  Select,
  Button,
  message,
  Input,
  Upload,
} from "antd";
import { useState } from "react";
import { useReactToPrint } from "react-to-print";
import accessTokenCache from "@/caches/accessToken";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

const token = accessTokenCache() && accessTokenCache();
const { TextArea } = Input;
// const getBase64 = (img, callback) => {
//   const reader = new FileReader();
//   reader.addEventListener('load', () => callback(reader.result));
//   reader.readAsDataURL(img);
// };

function index(props) {
  const {
    studentDetailsCopyOpen,
    showStudentDetailsCopy,
    dispatch,
    account,
    examineStatus,
    DictionaryDictGroups,
    getStudentList,
  } = props;

  const printDom = useRef();
  const [loading, setLoading] = useState(false);
  const [detailsData, setDetailsData] = useState({}); // 存储信息
  const [Guardians, setGuardians] = useState([]); // 存储监护人信息
  const [educational, setEducational] = useState([]);
  const [FamilyList, setFamilyList] = useState([]); // 存储家庭成员信息
  const [CheckupList, setCheckupList] = useState([]); // 存储体检信息
  const [ReportImage, setReportImage] = useState([]);

  const [PassDisplay, setPassDisplay] = useState(false); // 申请开关
  const [RejectionDisplay, setRejectionDisplay] = useState(false);
  const [ReviewTextArea, setReviewTextArea] = useState("");
  const [imageUrlData, setImageUrlData] = useState(null);
  const [imageUrl, setImageUrl] = useState([]);
  const [GroundsRejection, setGroundsRejection] = useState("");

  const [recordDataSource, setRecordDataSource] = useState([]); // 审核记录表

  // console.log(props.account,'这是传值数据')
  useEffect(() => {
    //请求学生详情数据
    if (account !== null && studentDetailsCopyOpen) {
      setLoading(true);
      //请求字典数据
      dispatch({
        type: namespace + "/getDictionaryDictGroups",
        payload: {
          dictCodes:
            "DICT_SEX,DICT_NATION,DICT_DISE,DICT_RELATION,DICT_EDU,DICT_WORK,DICT_STUDY_STATUS",
        },
        callback: (res) => {
          console.log(res, "这是字典数据");
        },
      });
      dispatch({
        type: namespace + "/getStudentDetails",
        payload: { account: account },
        callback: (res) => {
          console.log(res, "学生详情");
          setLoading(res.result && res.result.length > 0);
          setDetailsData(res?.result);
          setGuardians(res?.result?.studentGuardiansList);

          setEducational(res?.result?.studentSchoolList);
          setFamilyList(res?.result?.uuserFamilyList);
          setCheckupList(res?.result?.uuserCheckupList);

          setNewCheckupList(res?.result?.uuserCheckupList);
          setYearOptions(
            res?.result?.uuserCheckupList
              .map((item) => {
                return {
                  label: item.year,
                  value: item.year,
                };
              })
              .filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (obj) => JSON.stringify(obj) === JSON.stringify(item)
                  )
              )
          );
        },
      });
    }

    setReportImage(null);
  }, [studentDetailsCopyOpen]);
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
    (item) => item.dictCode === "DICT_RELATION"
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

  //点击切换tabs
  const onChangeTabs = (e) => {
    console.log(e);
    if (e == 2) {
      dispatch({
        type: namespace + "/getApprovedMemo",
        payload: { identityCard: detailsData?.identityCard, examineStatus: 0 },
        callback: (res) => {
          console.log(res, "审核记录，驳回记录");
          setRecordDataSource(res?.result);
        },
      });
    }
  };
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
    },
    {
      title: "学校名称",
      dataIndex: "schoolName",
      key: "schoolName",
    },
  ];
  const FamilyColumns = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
      width: 80,
    },
    {
      title: "关系",
      dataIndex: "relation",
      key: "relation",
      width: 70,
      render: (text, record, index) => {
        return `${text.split("-")[1]}`;
      },
    },
    {
      title: "证件类型",
      dataIndex: "docType",
      key: "docType",
      width: 100,
      render: (text, record, index) => {
        return `${text && text.split("-")[1]}`;
      },
    },
    {
      title: "证件号码",
      dataIndex: "familyIdentityCard",
      key: "familyIdentityCard",
      width: 150,
    },
    {
      title: "工作省份",
      dataIndex: "workProvince",
      key: "workProvince",
      width: 100,
      render: (text, record, index) => {
        return `${text.split("-")[1]}`;
      },
    },
    {
      title: "工作情况",
      dataIndex: "workType",
      key: "workType",
      width: 120,
      render: (text, record, index) => {
        return `${text.split("-")[1]}`;
      },
    },
    {
      title: "联系电话",
      dataIndex: "phone",
      key: "phone",
      width: 80,
    },
    {
      title: "家庭住址",
      dataIndex: "address",
      key: "address",
    },
  ];
  const CheckupColumns = [
    {
      title: "年份",
      dataIndex: "year",
      key: "year",
    },
    {
      title: "体检结果",
      dataIndex: "result",
      key: "result",
      render: (text, record, index) => {
        return `${text.split("-")[1]}`;
      },
    },
    {
      title: "诊断结果",
      dataIndex: "content",
      key: "content",
    },
  ];

  const [yearOptions, setYearOptions] = useState(null); // 存储年份
  const [newCheckupList, setNewCheckupList] = useState(null);
  const [yearValue, setYearValue] = useState(null);
  const handleYear = (value) => {
    setYearValue(value);
    if (value && !contentValue) {
      setCheckupList(newCheckupList?.filter((item) => item.year == value));
    } else if (value && contentValue) {
      setCheckupList(
        newCheckupList?.filter(
          (item) =>
            item.result.split("-")[0] == contentValue && item.year == value
        )
      );
    } else if (!value && !contentValue) {
      setCheckupList(newCheckupList);
    } else if (!value && contentValue) {
      setCheckupList(
        newCheckupList?.filter(
          (item) => item.result.split("-")[0] == contentValue
        )
      );
    }
  };

  const contentOptions = [
    {
      value: "1",
      label: "健康",
    },
    {
      value: "2",
      label: "存在疾病",
    },
  ];
  const [contentValue, setContentValue] = useState(null);
  const handleContent = (value) => {
    setContentValue(value);

    if (value && !yearValue) {
      setCheckupList(
        newCheckupList?.filter((item) => item.result.split("-")[0] == value)
      );
    } else if (value && yearValue) {
      setCheckupList(
        newCheckupList?.filter(
          (item) => item.result.split("-")[0] == value && item.year == yearValue
        )
      );
    } else if (!value && yearValue) {
      setCheckupList(newCheckupList?.filter((item) => item.year == yearValue));
    } else if (!value && !yearValue) {
      setCheckupList(newCheckupList);
    }
  };

  //审核记录头
  const recordColumns = [
    {
      title: "序号",
      key: "id",
      render: (text, record, index) => {
        return `${index + 1}`;
      },
    },
    {
      title: "审核状态",
      dataIndex: "examineStatus",
      key: "examineStatus",
      render: (examineStatus) => {
        if (examineStatus == 3) {
          return "通过";
        } else {
          return "驳回";
        }
      },
    },
    {
      title: "审核时间",
      dataIndex: "createTime",
      render: (createTime) => {
        return moment(parseInt(createTime, 0)).format(
          "YYYY年-MM月-DD日 HH:mm:ss"
        );
      },
    },
    {
      title: "审核结果",
      render: (_, record) => (
        // <a onClick={() => { setGroundsRejection('驳回理由：' + record.content) }}>查看详情</a>
        <a
          onClick={() => {
            ViewDetails(record);
          }}
        >
          查看详情
        </a>
      ),
    },
  ];

  const ViewDetails = (record) => {
    if (record.examineStatus == 3) {
      setGroundsRejection(null);
      setImageUrl(
        record.confirmPng
          ?.split(",")
          .map((item, index) => ({ img: item, key: index }))
      );
    } else {
      setImageUrl([]);
      setGroundsRejection("驳回理由：" + record.content);
    }
  };

  //驳回记录
  // const rejectColumns = [
  //   {
  //     title: '序号',
  //     key: 'id',
  //     render: (text, record, index) => {
  //       return (`${index + 1}`)
  //     }
  //   },
  //   {
  //     title: '审核结果',
  //     dataIndex: 'examineStatus',
  //     key: 'examineStatus',
  //     render: (examineStatus) => {
  //       if (examineStatus == 3) {
  //         return ('通过')
  //       } else {
  //         return ('驳回')
  //       }
  //     }
  //   },
  //   {
  //     title: '驳回理由',
  //     dataIndex: 'content',
  //     key: 'content',
  //   },
  //   {
  //     title: '审核时间',
  //     dataIndex: 'createTime',
  //     render: (createTime) => {
  //       return moment(parseInt(createTime, 0)).format("YYYY年-MM月-DD日 HH:mm:ss");
  //     }
  //   },
  // ]

  // 审核通过
  const BeApproved = () => {
    setRejectionDisplay(false);
    setPassDisplay(!PassDisplay);
  };

  // 审核驳回
  const ReviewReject = () => {
    setPassDisplay(false);
    setRejectionDisplay(!RejectionDisplay);
  };

  // 打印
  const handlePrint = useReactToPrint({
    content: () => printDom.current,
  });

  // 提交--驳回
  const AuditSubmitReject = () => {
    if (ReviewTextArea) {
      dispatch({
        type: namespace + "/putAssessorStudent",
        payload: {
          identityCard: detailsData?.identityCard,
          examineStatus: 4,
          content: ReviewTextArea,
        },
        callback: (res) => {
          if (res.result == "success") {
            message.success("审核驳回！");
            showStudentDetailsCopy(!studentDetailsCopyOpen);
            setImageUrl(null);
            getStudentList();
          }
        },
      });
    } else {
      message.error("驳回理由为必填项");
    }
  };

  // 驳回理由
  const onTextAreaChange = (e) => {
    setReviewTextArea(e.target.value);
  };

  // 提交--通过
  const AuditSubmitPass = () => {
    const img = fileList.map((item) => {
      return item.response.data;
    });

    if (img.length == 0) {
      return message.error("请上传确认件！");
    } else {
      dispatch({
        type: namespace + "/putAssessorStudent",
        payload: {
          identityCard: detailsData?.identityCard,
          examineStatus: 3,
          confirmPng: img.join(","),
        },
        callback: (res) => {
          if (res.result == "success") {
            showStudentDetailsCopy(!studentDetailsCopyOpen);
            message.success("审核通过！");
            setImageUrl(null);
            getStudentList();
          }
        },
      });
    }
  };

  // 上传前的文件效验
  const beforeUpload = (file) => {
    console.log(file, "文件校验");
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      return message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      return message.error("Image must smaller than 2MB!");
    }
  };
  //   上传组件配置信息
  const UploadProps = {
    name: "file",
    maxCount: 5,
    action: "/auth/web/front/v1/upload/uploadImage",
    headers: { Authorization: token },
    accept: ".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PNG,.GIF,.BMP",
    onChange(info) {
      //正在上传
      console.log(info);
      if (info.file.status === "uploading") {
        setLoading(true);
      }
      if (info.file.status === "done") {
        message.success("上传成功");
        getBase64(info.file.originFileObj, (url) => {
          // setLoading(false);
          setImageUrl(imageUrl.push(url));
        });
        setImageUrlData(info.file.response.data);
      } else if (info.file.status === "error") {
        setLoading(false);
        message.error(`${info.file.name} 上传出错`);
      }
    },
  };

  //上传确认件2.0
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      console.log(reader, "这是reader");
      reader.readAsDataURL(file);
      console.log(reader.readAsDataURL(file), "看看是什么");
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const handlePreview = async (file) => {
    setPreviewImage(file.response.data);
    console.log(file.response.data);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const handleCancel = () => setPreviewOpen(false);
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        上传确认件
      </div>
    </div>
  );

  const ImageDiseaseImg =
    detailsData?.diseaseImg == null ? (
      <Row>
        {/* <Col span={12}>
          <Image width={180} src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"></Image>
        </Col>
        <Col span={12}>
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
                <Image width={180} height={200} src={item}></Image>
              </Col>
            );
          })}
        </Row>
      </Image.PreviewGroup>
    );

  return (
    <div>
      <Modal
        title="审核"
        visible={studentDetailsCopyOpen}
        width={900}
        footer={null}
        destroyOnClose={true}
        onCancel={() => {
          showStudentDetailsCopy(!studentDetailsCopyOpen);
          setImageUrl(null);
          setGroundsRejection("");
        }}
        bodyStyle={{ padding: "0 24px 24px 24px" }}
      >
        <Tabs
          defaultActiveKey="1"
          className={styles["StudentDetails"]}
          onChange={onChangeTabs}
        >
          <Tabs.TabPane tab="学生信息" key="1">
            <Spin spinning={loading}>
              <div ref={printDom} className={styles["printPage"]}>
                <div className={styles["miniBox"]}>
                  <h4 className={styles["titleH5"]}>基础信息</h4>
                  <div>
                    <Row>
                      <Col span={19}>
                        <Row style={{ padding: "10px 0" }}>
                          <Col span={10}>姓名：{detailsData?.studentName} </Col>
                          <Col span={14}>
                            性别：
                            {detailsData?.sex &&
                              detailsData?.sex.split("-")[1]}{" "}
                          </Col>
                        </Row>
                        <Row style={{ padding: "10px 0" }}>
                          <Col span={12}>
                            证件类型：
                            {detailsData?.docType &&
                              detailsData?.docType.split("-")[1]}{" "}
                          </Col>
                          <Col span={12} pull={2}>
                            民族：{detailsData?.nationName}{" "}
                          </Col>
                        </Row>
                        <Row style={{ padding: "10px 0" }}>
                          <Col span={12}>
                            证件号码：{detailsData?.identityCard}
                          </Col>
                          <Col span={12} pull={2}>
                            年龄：{detailsData?.age}{" "}
                          </Col>
                        </Row>
                      </Col>
                      <Col span={5} pull={2}>
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
                        {/* <Image width={100} height={120} src="error" fallback="data:image/png;base64,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" /> */}
                      </Col>
                    </Row>
                    <Row style={{ padding: "10px 0" }}>
                      <Col span={8}>学籍号：{account}</Col>
                      <Col span={8} pull={2}>
                        出生日期：{detailsData?.birthday}
                      </Col>
                    </Row>
                    <Row style={{ padding: "10px 0" }}>
                      籍贯：{detailsData?.areaName}
                    </Row>
                    <Row style={{ padding: "10px 0" }}>
                      <Col span={8}>
                        监护人姓名：
                        {Guardians?.length > 0
                          ? `${Guardians[0].guarName}`
                          : ""}{" "}
                      </Col>
                      <Col span={8}>
                        与学生关系：
                        {Guardians?.length > 0
                          ? `${Guardians[0].relation.split("-")[1]}`
                          : ""}
                      </Col>
                      <Col span={6}>
                        手机号：
                        {Guardians?.length > 0 ? `${Guardians[0].phone}` : ""}
                      </Col>
                    </Row>
                    <Row style={{ padding: "10px 0" }}>
                      <Col span={8}>
                        监护人姓名：
                        {Guardians?.length > 1
                          ? `${Guardians[1].guarName}`
                          : ""}{" "}
                      </Col>
                      <Col span={8}>
                        与学生关系：
                        {Guardians?.length > 1
                          ? `${Guardians[1].relation.split("-")[1]}`
                          : ""}
                      </Col>
                      <Col span={6}>
                        手机号：
                        {Guardians?.length > 1 ? `${Guardians[1].phone}` : ""}
                      </Col>
                    </Row>

                    <Row style={{ padding: "10px 0" }}>
                      <Col span={24}>家庭住址：{detailsData?.nativePlace}</Col>
                    </Row>
                    <Row style={{ padding: "10px 0" }}>
                      <Col span={8}>
                        具有特殊疾病：
                        {detailsData?.isDisease &&
                          detailsData?.isDisease.split("-")[1]}
                      </Col>
                      <Col span={8}>疾病名称：{detailsData?.diseaseName}</Col>
                    </Row>
                    <Row style={{ padding: "10px 0" }}>
                      <Col span={8}>
                        是否单亲家庭：{detailsData?.isOneParent}
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
                  {educational?.map((item) => {
                    return (
                      <div key={item.id}>
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
                            <Col span={8}> 有无跳级转班记录：无</Col>
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
                    />
                  </div>
                </div>
                <div className={styles["miniBox"]}>
                  <h3 className={styles["titleH5"]}>体检信息</h3>
                  {/* <div>
                  <Table columns={CheckupColumns} dataSource={CheckupList?.map(item => { return { ...item, key: item.id } })} bordered pagination={false} />
                </div>
                <div className={styles['miniBox']} style={{ marginTop: '20px' }} >

                  <h3 className={styles['titleH5']} style={{ marginLeft: 0 }}>查看体检报告年份 <Select onChange={handleYear} options={yearOptions} style={{ width: 100 }} getCalendarContainer={triggerNode => triggerNode.parentNode} /> </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                    <Image.PreviewGroup
                      preview={{
                        onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                      }}
                    >
                      {
                        ReportImage && ReportImage?.map((item, index) => {
                          return (

                            <Row>

                              <Col span={6} key={index}  >
                                <Image width={180} height={130} src={item} ></Image>
                              </Col>
                            </Row>

                          )
                        })
                      }

                    </Image.PreviewGroup>
                  </div>
                </div> */}
                  <Row>
                    <Col span={12}>
                      查看年份：
                      <Select
                        allowClear
                        onChange={handleYear}
                        options={yearOptions}
                        style={{ width: 100 }}
                        getCalendarContainer={(triggerNode) =>
                          triggerNode.parentNode
                        }
                      />
                    </Col>
                    <Col span={12}>
                      诊断结果：
                      <Select
                        allowClear
                        onChange={handleContent}
                        options={contentOptions}
                        style={{ width: 100 }}
                        getCalendarContainer={(triggerNode) =>
                          triggerNode.parentNode
                        }
                      />
                    </Col>
                  </Row>
                  {CheckupList.length > 0 &&
                    CheckupList?.map((item, index) => {
                      return (
                        <div key={index} style={{ margin: "20px 0" }}>
                          <Row>
                            <Col span={8}>体检年份：{item.year}</Col>
                            <Col span={8}>
                              体检结果：{item.result.split("-")[1]}
                            </Col>
                            <Col span={8}>诊断结果：{item.content}</Col>
                          </Row>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-evenly",
                              margin: "20px 0",
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
                              {item.contentPng &&
                                item.contentPng
                                  .split(";")
                                  ?.map((item1, index1) => {
                                    return (
                                      <Row>
                                        <Col span={6} key={index1}>
                                          <Image
                                            width={180}
                                            height={130}
                                            src={item1}
                                          ></Image>
                                        </Col>
                                      </Row>
                                    );
                                  })}
                            </Image.PreviewGroup>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </Spin>

            <div style={{ textAlign: "center" }}>
              <Button
                onClick={BeApproved}
                type="primary"
                size="large"
                style={{ width: "100px", marginRight: "100px" }}
              >
                通过
              </Button>
              <Button
                onClick={ReviewReject}
                type="primary"
                size="large"
                style={{ width: "100px" }}
                danger
              >
                驳回
              </Button>
            </div>
            {RejectionDisplay && (
              <>
                <Row style={{ marginTop: "15px" }}>
                  <Col span={3}>驳回理由：</Col>
                  <Col span={21}>
                    <TextArea
                      rows={4}
                      onChange={onTextAreaChange}
                      placeholder="请填写驳回理由..."
                    />
                  </Col>
                </Row>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    type="primary"
                    size="large"
                    onClick={AuditSubmitReject}
                    style={{ width: "100px", marginTop: "20px" }}
                  >
                    提交
                  </Button>
                </div>
              </>
            )}
            {PassDisplay && (
              <div style={{ textAlign: "center" }}>
                <Button
                  onClick={handlePrint}
                  type="dashed"
                  style={{
                    width: "100%",
                    height: "100px",
                    margin: "20px 0",
                    fontWeight: 600,
                    fontSize: "16px",
                    color: "#555555",
                  }}
                >
                  打印预览
                </Button>
                {/* <Upload {...UploadProps} beforeUpload={beforeUpload} showUploadList={false}>
                  {imageUrl ? (<img src={imageUrl} alt="avatar" style={{ width: '100%' }} />) : (uploadButton)}
                </Upload> */}
                <Upload
                  {...UploadProps}
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                >
                  {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal
                  visible={previewOpen}
                  title={previewTitle}
                  footer={null}
                  onCancel={handleCancel}
                >
                  <img
                    alt="example"
                    style={{
                      width: "100%",
                    }}
                    src={previewImage}
                  />
                </Modal>

                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    type="primary"
                    size="large"
                    onClick={AuditSubmitPass}
                    style={{ width: "100px", marginTop: "20px" }}
                  >
                    提交
                  </Button>
                </div>
              </div>
            )}
          </Tabs.TabPane>
          <Tabs.TabPane tab="审核记录" key="2">
            <Table
              rowKey={(record) => record.id}
              dataSource={recordDataSource}
              columns={recordColumns}
              bordered={true}
              pagination={false}
            />
            {imageUrl?.length >= 0 && (
              <div style={{ marginTop: "10px" }}>
                <Image.PreviewGroup>
                  {imageUrl.map((item) => {
                    return <Image key={item.key} src={item.img} />;
                  })}
                </Image.PreviewGroup>
              </div>
            )}
            {GroundsRejection && (
              <div style={{ marginTop: "10px" }}>
                <p>{GroundsRejection}</p>
              </div>
            )}
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    DictionaryDictGroups: state[namespace].DictionaryDictGroups,
  };
};
export default memo(connect(mapStateToProps)(index));
