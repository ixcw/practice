/**
 * 资助数据列表数据
 * @author [作者]（ShiHaiGui）
 * @date [创建日期] 2023/10/16
 * @since [产品/模块版本] 1.7.0
 */
import { useState, useEffect } from "react";
import styles from "./index.less";
import { connect } from "dva";
import { excelType } from "@/utils/const";
import moment from "moment";
import {
  Col,
  Row,
  Form,
  Input,
  Select,
  Button,
  Table,
  Space,
  Modal,
  TreeSelect,
  Popconfirm,
  Pagination,
  message,
  Cascader,
  Spin,
  Upload,
  Carousel,
  DatePicker,
} from "antd";
import { Subsidizelist as namespace } from "@/utils/namespace";
import accessTokenCache from "@/caches/accessToken";
import {
  SearchOutlined,
  PlusOutlined,
  SwapLeftOutlined,
  SwapRightOutlined,
  DownloadOutlined,
  CloudUploadOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const Subsidize = (props) => {
  const {
    Subsidizeid,
    dispatch,
    supportTypeOptions,
    poorTypeOptions,
    GradeDirectoryOptions,
  } = props;
  const { confirm } = Modal;
  const token = accessTokenCache() && accessTokenCache();
  const Authorization = { Authorization: token };
  const [Newform] = Form.useForm();
  const [Editform] = Form.useForm();
  const [Inquireform] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [YearData, setYeardata] = useState(null);
  const [ButtonLoading, setButtonLoading] = useState({
    perfect: false,
    Download: false,
  });
  const [OneInchImageUrl, setOneInchImageUrl] = useState([]); //上传文件
  const [defaultFileList, setDefaultFileList] = useState([]); // 申请原因文件列表
  const [defaultAnnexList, setdefaultAnnexList] = useState([]); // 其它材料文件列表
  const [AllScreening, setAllScreening] = useState({});
  const [action, setAction] = useState(); //存储接口
  const [TableRollingWidth, setTableRollingWidth] = useState(0); // 表格滚动宽度
  const [ListsubsidizePages, setListsubsidizePages] = useState(1);//当前页
  const [ListDataPageSize, setListDataPageSize] = useState(10);
  const [subsidizeTotal, setsubsidizeTotal] = useState(0);//总条数
  const [ClassYear, setClassYear] = useState(null); //届级
  const [SubsidizeListData, setSubsidizeListData] = useState([]); //查询资助信息
  const [GradeDirectory, setGradeDirectory] = useState([]); //获取年级目录和班级列表
  const [InquireStudent, setInquireStudent] = useState([]); //查询学生信息
  const [studentTeacher, setStudentTeacher] = useState([]);
  const [timeValue, setTimeValue] = useState("");
  const [EditData, setEditData] = useState(""); //修改数据
  const [error, setError] = useState(""); //校验
  const [PupilNameOptions, setPupilNameOptions] = useState([]);
  const [viewDetails, setviewDetails] = useState({}); //查看资助原因
  const [OtherMaterials, setOtherMaterials] = useState({}); //查看其它材料原因
  const [ModifyView, setModifyView] = useState({}); //查看修改
  const [ClassDataOption, setClassDataOption] = useState({}); //班级名称
  const [idCardDataOption, setidCardDataOption] = useState({}); //身份证
  // const [value, setValue] = useState(undefined);
  const [CheckboxDefaultValues, setCheckboxDefaultValues] = useState([
    "supportYear",
    "identityCard",
    "studentName",
    "gradeId",
    "supportType",
    "supportNum",
  ]); //批量导出字段


  // 限制可选择的时间
  const disabledDate = (current) => {
    return current && current > moment().endOf("day");
  };

  // 自定义ajax请求 修改接收格式responseType='blob'
  const customRequest = (option) => {
    const getError = (option, xhr) => {
      var msg = "cannot "
        .concat(option.method, " ")
        .concat(option.action, " ")
        .concat(xhr.status, "'");
      var err = new Error(msg);
      err.status = xhr.status;
      err.method = option.method;
      err.url = option.action;
      return err;
    };

    const getBody = (xhr) => {
      if (xhr.responseType && xhr.responseType !== "text") {
        return xhr.response;
      }
      var text = xhr.responseText || xhr.response;

      if (!text) {
        return text;
      }

      try {
        return JSON.parse(text);
      } catch (e) {
        return text;
      }
    };

    // eslint-disable-next-line no-undef
    var xhr = new XMLHttpRequest();
    xhr.responseType = "blob";

    if (option.onProgress && xhr.upload) {
      xhr.upload.onprogress = function progress(e) {
        if (e.total > 0) {
          e.percent = (e.loaded / e.total) * 100;
        }

        option.onProgress(e);
      };
    } // eslint-disable-next-line no-undef

    var formData = new FormData();

    if (option.data) {
      Object.keys(option.data).forEach(function (key) {
        var value = option.data[key]; // support key-value array data
        if (Array.isArray(value)) {
          value.forEach(function (item) {
            // { list: [ 11, 22 ] }
            // formData.append('list[]', 11);
            formData.append("".concat(key, "[]"), item);
          });
          return;
        }

        formData.append(key, option.data[key]);
      });
    } // eslint-disable-next-line no-undef

    if (option.file instanceof Blob) {
      formData.append(option.filename, option.file, option.file.name);
    } else {
      formData.append(option.filename, option.file);
    }

    xhr.onerror = function error(e) {
      option.onError(e);
    };

    xhr.onload = function onload() {
      // allow success when 2xx status
      // see https://github.com/react-component/upload/issues/34
      if (xhr.status < 200 || xhr.status >= 300) {
        return option.onError(getError(option, xhr), getBody(xhr));
      }

      return option.onSuccess(getBody(xhr), xhr);
    };

    xhr.open(option.method, option.action, true); // Has to be after `.open()`. See https://github.com/enyo/dropzone/issues/179

    if (option.withCredentials && "withCredentials" in xhr) {
      xhr.withCredentials = true;
    }

    var headers = option.headers || {};

    // 添加默认请求头 Authorization
    if (option.authorization) {
      headers.Authorization = token;
    }

    if (headers["X-Requested-With"] !== null) {
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    }

    Object.keys(headers).forEach(function (h) {
      if (headers[h] !== null) {
        xhr.setRequestHeader(h, headers[h]);
      }
    });
    xhr.send(formData);
    return {
      abort: function abort() {
        xhr.abort();
      },
    };
  };

  // 批量导入前的文件效验
  const beforeUpload = (file) => {
    let vaild;
    const acceptType = () => {
      if (excelType.indexOf && typeof excelType.indexOf === "function") {
        const index = excelType.indexOf(file.type);
        if (index >= 0) {
          return true;
        } else if (index < 0 && (!file.type || file.type === "") && file.name) {
          const regex = new RegExp("(\\.xls$)|(\\.xlsx$)");
          return regex.test(file.name);
        }
      }
      return false;
    };
    vaild = acceptType();
    if (!vaild) {
      message.error("请上传正确格式的excel!");
    }

    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error("上传文件必须小于10m!");
    }
    return vaild && isLt10M;
  };

  //   上传组件配置信息(批量导入)
  const UploadSubsidizelist = {
    name: "file",
    action: "/auth/web/v1/studentSupport/importSupportMes",
    headers: { Authorization: token },
    accept:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel ", //指定选择文件框默认文件类型(.xls/.xlsx)
    onChange(info) {
      //正在上传
      if (info.file.status === "uploading") {
        setLoading(true);
      }
      if (info.file.status === "done") {
        if (info.file.response.type == "application/json") {
          const reader = new FileReader();
          reader.readAsText(info.file.response);
          reader.onload = function (event) {
            const jsonData = JSON.parse(event.target.result);
            if (jsonData.code == 200) {
              message.success("资助数据导入成功！");
              getSubsidizelist();
              setLoading(false);
            } else {
              message.error("资助数据导入失败！");
              setLoading(false);
            }
          };
        } else {
          const blob = new Blob([info.file.response], {
            type: "application/vnd.ms-excel;charset=UTF-8",
          });
          const a = document.createElement("a"); // 转换完成，创建一个a标签用于下载
          a.download = "资助数据导入反馈.xls";
          a.href = window.URL.createObjectURL(blob);
          a.click();
          a.remove();
          getSubsidizelist();
          setLoading(false);
          Modal.warning({
            title: "导入失败",
            content: "资助数据导入失败原因已下载,请打开Excel查看具体原因！",
          });
        }
      } else if (info.file.status === "error") {
        setLoading(false);
        message.error(`${info.file.name} 上传出错`);
      }
    },
  };

  // 批量导出资助数据
  const BulkExport = () => {
    confirm({
      title: "导出提示",
      icon: <ExclamationCircleOutlined />,
      content: "您即将导出表格中的资助数据!",
      onOk() {
        function request() {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", "/auth/web/v1/studentSupport/exportSupport", true);
          xhr.responseType = "blob"; // 包装返回数据格式, 打印出来是 Blob 格式的数据，不是乱码的文本
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.setRequestHeader("Authorization", token);
          xhr.onload = function () {
            download(xhr.response);
          };
          xhr.send(
            JSON.stringify({
              ...AllScreening,
              exportFields: CheckboxDefaultValues.toString()
                .replace(/Text/g, "")
                .split(",")
                .filter((item) => item !== "action" && item !== "index"),
            })
          );
        }

        function download(blobUrl) {
          const xlsx = "application/vnd.ms-excel;charset=UTF-8";
          const blob = new Blob([blobUrl], { type: xlsx });
          const a = document.createElement("a"); // 转换完成，创建一个a标签用于下载
          a.download = "资助批量导出数据.xls";
          a.href = window.URL.createObjectURL(blob);
          a.click();
          a.remove();
          message.success("资助批量导出数据已下载！");
        }
        request();
      },
      onCancel() {},
    });
  };

  // 下载资助导入模板
  const onDownloadTemple = () => {
    setButtonLoading({ ...ButtonLoading, Download: true });
    function request() {
      const xhr = new XMLHttpRequest();
      xhr.open(
        "GET",
        "/auth/web/v1/studentSupport/downloadStuAndFamilyMesTemple",
        true
      );
      xhr.responseType = "blob"; // 包装返回数据格式, 打印出来是 Blob 格式的数据，不是乱码的文本
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Authorization", token);
      xhr.onload = function () {
        if (xhr.response.type == "application/json") {
          message.error("网络连接错误或登录过期，下载失败");
        } else {
          download(xhr.response);
        }
      };
      xhr.send();
    }
    function download(blobUrl) {
      const xlsx = "application/vnd.ms-excel;charset=UTF-8";
      const blob = new Blob([blobUrl], { type: xlsx });
      const a = document.createElement("a"); // 转换完成，创建一个a标签用于下载
      a.download = "资助导入模板.xls";
      a.href = window.URL.createObjectURL(blob);
      a.click();
      a.remove();
      message.success("资助导入模板 已下载！");
      setButtonLoading({ ...ButtonLoading, Download: false });
    }
    request();
  };

  useEffect(() => {
    /**
     * 获取年级目录和班级列表
     * @param {string} spoceId 学籍
     */
    dispatch({
      type: namespace + "/queryCatalogApi",
    });

    //批量加载多个字典组
    dispatch({
      type: namespace + "/getDictionaryDictGroups",
      payload: { dictCodes: "DICT_SUPPORT_TYPE,DICT_POOR_TYPE" },
    });
  }, []);

  /**
   * 查询资助信息
   * @param {integer} supportYea 资助年度
   * @param {string} identityCard  学生身份证
   * @param {string} studentName 学生姓名
   * @return {Object} 返回值描述
   */

  const getSubsidizelist = (page = 1, size = 10, value) => {
    console.log('getSubsidizelist', page, size, value);
    setLoading(true);
    dispatch({
      type: namespace + "/querySupportStudentMesApi",
      payload: { page, size, ...value },
      callback: (res) => {
        if (res) {
          setLoading(false);
          setSubsidizeListData(res?.result?.data?.records);
          setsubsidizeTotal(res?.result?.data?.total);
          setListsubsidizePages(res?.result?.data?.current);
          console.log('ListsubsidizePages', res?.result?.data?.current);
        }
      },
    });
  };

  useEffect(() => {setAllScreening(AllScreening);getSubsidizelist(1, 10, AllScreening);}, [AllScreening]);

  // // 表格分页
  // const NotificationChange = (pages, size) => {
  //   getSubsidizelist( pages,size, AllScreening );
  // };

// 表格分页
const NotificationChange = (page, size) => {
  console.log('NotificationChange', page, size, AllScreening);
  // 更新 ListsubsidizePages 的值
  setListsubsidizePages(page);
  getSubsidizelist(page, size, AllScreening);
};

  /**
   * 添加受助学生
   * @param {integer} gradeId 年级id
   * @param {integer} classId 班级id
   * @param {string} studyPhone 学籍号
   * @return {Object} 返回值描述
   */

  const AddStudent = () => {
    //其它材料文件
    const annex =defaultAnnexList && defaultAnnexList?.map((item) => {return item.name + "*" + item.response?.data;}).join(",");
    //资助原因文件
    const reasonAnnex =defaultFileList && defaultFileList?.map((item) => {return item.name + "*" + item.response?.data;}).join(",");
    Newform.validateFields()
      .then((values) => {
        console.log(values)
        console.log(ClassDataOption)
        console.log(idCardDataOption)
        // 如果校验通过，则执行其他事件的逻辑
        const data = {
          supportYear: values.supportYear?.format("YYYY"), //资助年份
          studyPhone: values["studentName"].key, //学籍号
          gradeId: values["ClassGrade"][values["ClassGrade"].length - 2], //年级id
          classId: values["ClassGrade"][values["ClassGrade"].length - 1], //班级id
          className: ClassDataOption.label, //班级名称
          identityCard: idCardDataOption.value.substring(1), //学生身份证
          supportType: values["supportType"], //资助类型
          poorType: values["poorType"], //贫困类型
          bank: values["bank"], //所属银行
          bankNumber: values["bankNumber"], //银行卡号
          supportNum: values["supportNum"], //资助金额
          reason: values["reason"], //资助原因
          annex: annex, //其它材料附件
          reasonAnnex: reasonAnnex, //资助原因附件
        };

        dispatch({
          type: namespace + "/addSupportStudentMesApi",
          payload: data,
          callback: (res) => {
            if (res.result.code === 200) {
              message.success("添加受助学生成功！");
              Newform.resetFields()
              setIsModalOpenTo(false);
              getSubsidizelist();
            }else{
              message.error("添加受阻学生失败")
            }
          },
        });
      })
      .catch((error) => {
        // 校验不通过,显示错误信息
        message.error(`有${error?.errorFields?.length}个必填项未填`);
      });
  };
  //上传资助原因相关资料
  const handleBeforeUpload = ({ file, fileList: newFileList }) => {
    setDefaultFileList(newFileList);
  };
   //上传资助原因最大文件为3
   const uploadButtonReason = (!defaultFileList || defaultFileList.length < 3) ? (
  <Button icon={<UploadOutlined />}>上传文件</Button>
   ) : null;

  //上传其它材料相关资料
   const handleAnnexUpload = ({ file, fileList: newFileList }) => {
    setdefaultAnnexList(newFileList);
   };

 //上传其它材料最大文件为3
 const uploadButtonOther = (!defaultAnnexList || defaultAnnexList.length < 3)  ? (
  <Button icon={<UploadOutlined />}>上传文件</Button>
) : null;

const handlePreviewFile = (file) => {
  // 自定义文件跳转逻辑
  const filePath = `${file.response.data}`; // 根据需要设置自定义路径或URL
  window.open(filePath, "_blank"); // 通过 window.open() 方法打开一个新窗口或标签页
};


  const handleAnnex = (file) => {
    // 自定义文件跳转逻辑
    const filePath = `${file.response.data}`; // 根据需要设置自定义路径或URL
    window.open(filePath, "_blank"); // 通过 window.open() 方法打开一个新窗口或标签页
  };

  /**
   * 删除学生资助信息
   * @param {string} id 资助id
   * @return {Object}
   */
  const handleDelete = (record) => {
    setLoading(true);
    dispatch({
      type: namespace + "/deleteSupportMesApi",
      payload: { id: record.id },
      callback: (res) => {
        if (res.result?.code === 200) {
          message.success("删除资助学生信息成功！");
          setLoading(false);
          getSubsidizelist();
        } else {
          // setLoading(false);
          message.error("删除资助学生信息失败！");
        }
      },
    });
  };
  const showremove = (record) => {
    // setLoading(true);
  };
  /**
   * 修改资助学生信息
   * @param {integer} id 资助id
   * @return {Object}
   */

  //修改受助学生
  const EditItem = () => {
    //其它材料文件
    const annex = defaultAnnexList &&defaultAnnexList?.map((item) => {return item.url && (item.name + "*" + item.url) ||item.response.data && (item.name + "*" + item.response.data)})
        .join();
    //资助原因文件
    const reasonAnnex =
      defaultFileList &&
      defaultFileList
        ?.map((item) => {
          return item.url && (item.name + "*" + item.url) ||item.response.data && (item.name + "*" + item.response.data)
        })
        .join(",");
    Editform.validateFields()
      .then((values) => {
        // 如果校验通过，则执行其他事件的逻辑
        const Editdata = {
          supportYear: values.supportYear?.format("YYYY"), //资助年份
          id: EditData.id, //资助id
          supportType: values["supportType"], //资助类型
          supportNum: values["supportNum"], //资助金额
          poorType: values["poorType"], //贫困类型
          bank:values["bank"],//所属银行
          bankNumber: values["bankNumber"], //银行卡号
          reason: values["reason"], //资助原因
          annex: annex, //附件
          reasonAnnex:reasonAnnex, //资助原因附件
        };


        dispatch({
          type: namespace + "/updateSupportMesApi",
          payload: Editdata,
          callback: (res) => {
            if (res.result.code === 200) {
              message.success("修改受助学生成功！");
              setIsModalOpenFour(false);
              getSubsidizelist();
            }else{
              message.error("修改受阻学生失败")
            }
          },
        });
      })
      .catch((error) => {
        // 校验不通过,显示错误信息
        message.error(`有${error?.errorFields?.length}个必填项未填`);
      });
  };


  /**
   * 添加受助学生弹窗-受助学生下拉框-存储班级名称
   */
  const displayRender = (labels,selectedOptions) => {
    // setClassDataOption(selectedOptions[selectedOptions.length - 1])
    return labels[labels.length - 1]
  };



  /**
   * 添加受助学生弹窗-受助学生下拉框-存储学生身份证
   */
  const studentId = (option)=>{
    console.log(option)
    setidCardDataOption(option)
  }



  /**
   * 添加受助学生弹窗-受助学生下拉框
   * @param {object} selectedOptions 选中的年级/班级
   *
   */
  const onUsernameChange = (value, selectedOptions) => {
    setClassDataOption(selectedOptions[selectedOptions.length - 1]);
    if (!ClassYear) return message.warning("请先选择界别！");
    Newform.setFieldsValue({ username: null });
    dispatch({
      type: namespace + "/querystudentMesApi",
      payload: {
        classId: selectedOptions[selectedOptions?.length - 1].value,
        spoce: ClassYear,
      },
      callback: (res) => {
        if (res.result.code === 200) {
          setPupilNameOptions(
            res.result.data?.map((itemThree) => {
              return {
                value: itemThree.account,
                label:
                  itemThree.studentName +
                  itemThree.identityCard.replace(
                    /(\d{6})\w+(\d{3}[Xx]?)/,
                    "$1******$2"
                  ),
              };
            })
          );
        }
      },
    });
  };

  //届级点击事件
  const onChangeClassYear = (_, value) => {
    setClassYear(value - 0);
  };

  //申请资助原因弹框
  const [isModalOpen, setIsModalOpen] = useState(false);
  const View = (value) => {
    setviewDetails(value);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  //其它材料弹框
  const [isModalOpenone, setIsModalOpenone] = useState(false);
  const Details = (value) => {
    setOtherMaterials(value);
    setIsModalOpenone(true);
  };
  const handleOkone = () => {
    setIsModalOpenone(false);
  };
  const handleCancelone = () => {
    setIsModalOpenone(false);
  };
  //添加学生弹框
  const [isModalOpenTo, setIsModalOpenTo] = useState(false);
  const Addition = () => {
    setIsModalOpenTo(true);
  };
  const handleOkTo = () => {
    setIsModalOpenTo(false);
  };
  const handleCancelTo = () => {
    setIsModalOpenTo(false);
  };

  //修改受助学生信息弹框
  const [isModalOpenFour, setIsModalOpenFour] = useState(false);
  const handleOkFour = () => {
    setIsModalOpenFour(false);
  };
  const handleCancelFour = () => {
    setIsModalOpenFour(false);
  };
  const Edit = (value) => {
    setEditData(value)
//申请资助原因附件
    setDefaultFileList(
      value.reasonAnnex?.split(',').map((item, index) => {
        return {
          uid: index,
          name: item?.split('*')[0],
          status: "done",
          url: item?.split('*')[1],
          thumbUrl: item.split('*')[1],
        };
      })
    );
    //其它材料附件
    setdefaultAnnexList(
      value.annex?.split(',').map((item, index) => {return {uid: index,name: item?.split('*')[0],status: "done",url: item?.split('*')[1],thumbUrl: item?.split('*')[1],};}));
    Editform.setFieldsValue({
      supportYear: moment(value.supportYear, 'YYYY'),
      poorType:value.poorType-0,//贫困类型
      supportType:value.supportType-0,//资助类型
      bank:value.bank,//所属银行
      bankNumber:value.bankNumber,//银行卡号
      supportNum:value.supportNum,//资助金额
      reason:value.reason//资助原因

    })
    setModifyView(value);
    setIsModalOpenFour(true);
  };



  //资助管理表格列头
  const Subsidizecolumns = [
    {
      title: "序号",
      dataIndex: "index",
      render: (text, record, index) =>(ListsubsidizePages - 1) * 10 + index + 1,
      key: "index",
      width: 100,
      fixed: 'left'
    },
    {
      title: "学生姓名",
      dataIndex: "studentName",
      key: "studentName",
      width: 130,
      fixed: 'left'
    },
    {
      title: "年级",
      dataIndex: "gradeName",
      key: "gradeName",
      width: 100,
    },
    {
      title: "班级",
      dataIndex: "className",
      key: "className",
      width: 150,

    },

    {
      title: "学生身份证号",
      dataIndex: "identityCard",
      key: "identityCard",
      width: 160,
    },
    {
      title: "学籍号",
      dataIndex: "studyPhone",
      key: "studyPhone",
      width: 170,
    },
    {
      title: "性别",
      dataIndex: "sexText",
      key: "sexText",
      width: 100,
    },
    {
      title: "民族",
      dataIndex: "nationText",
      key: "nationText",
      width: 100,
    },
    {
      title: "家庭住址",
      dataIndex: "address",
      key: "address",
      width: 150,
    },
    {
      title: "所属银行",
      dataIndex: "bank",
      key: "bank",
      width: 150,
    },
    {
      title: "银行卡号",
      dataIndex: "bankNumber",
      key: "bankNumber",
      width: 170,
    },
    {
      title: "家长姓名",
      dataIndex: "parentUserName",
      key: "parentUserName",
      width: 120,
    },
    {
      title: "家长身份证号",
      dataIndex: "parentIdentityCard",
      key: "parentIdentityCard",
      width: 180,
    },
    {
      title: "资助年度",
      dataIndex: "supportYear",
      key: "supportYear",
      width: 150,
    },
    {
      title: "申请资助原因",
      dataIndex: "reason",
      key: "reason",
      width: 150,
      render: (_, record) => (
        <Space size="middle" style={{ color: "#1677ff" }}>
          <Button type="link" onClick={() => View(record)}>
            查看资助原因
          </Button>
        </Space>
      ),
    },
    {
      title: "资助类型",
      dataIndex: "supportTypeText",
      key: "supportTypeText",
      width: 150,
    },
    {
      title: "贫困类型",
      dataIndex: "poorTypeText",
      key: "poorTypeText",
      width: 150,
    },
    {
      title: "资助金额",
      dataIndex: "supportNum",
      key: "supportNum",
      width: 150,
    },
    {
      title: "其它材料",
      dataIndex: "b",
      key: "b",
      width: 150,
      render: (_, record) => (
        <Space size="middle" style={{ color: "#1677ff" }}>
          <Button type="link" onClick={() => Details(record)}>
            查看详情
          </Button>
        </Space>
      ),
    },
    {
      title: "操作",
      dataIndex: "c",
      key: "c",
      width: 150,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Space size="middle" style={{ color: "#1677ff" }}>
          <Button type="link" onClick={() => Edit(record)}>
            修改
          </Button>
          <Popconfirm
            title="确认要删除吗？"
            okText="确认"
            onConfirm={() => handleDelete(record)}
            cancelText="取消"
          >
            <Button type="link" onClick={() => showremove(record)}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];


  const validateBankNumber = (rule, value, callback) => {
    const regex = /^[0-9]{16,19}$/; // 包含16到19位数字
    const symbolRegex = /[^a-zA-Z0-9]/; // 匹配任何非字母和非数字的字符
    if (!regex.test(value)) {
      callback("请输入正确的银行卡号！");
    } else if (symbolRegex.test(value)) {
      callback("银行卡号不能包含字母或特殊符号！");
    } else {
      callback();
    }
  };

  // 正则校验输入框
  const handleInputChange = (e) => {
    let value = e.target.value;
    // 去除小数点
    value = value.replace(/\./g, "");
    // 去除加减号
    value = value.replace(/[+-]/g, "");
    // 去除字母
    value = value.replace(/[a-zA-Z]/g, "");
    e.target.value = value;
  };


//学生姓名输入事件
const participateHandle = (e) => {
  setListsubsidizePages(1);
  setListDataPageSize(10);
  setAllScreening({ ...AllScreening, studentName: e.target.value });
};

 // 处理资助年度事件
 const onChangeYear = (value) => {
  setListsubsidizePages(1);
  setListDataPageSize(10);
  setAllScreening({ ...AllScreening, supportYear: value?.format("YYYY")});
};

//学生身份证号输入事件
const onChangeStudentID = (e) => {
   setListsubsidizePages(1);
  setListDataPageSize(10);
  setAllScreening({ ...AllScreening, identityCard: e.target.value });
  };

  //资助类型下拉点击事件
  const onChangesupportType = (value) => {
   setListsubsidizePages(1);
   setListDataPageSize(10);
   setAllScreening({ ...AllScreening, supportType: value });
  };

  //年级下拉点击事件
  const Changegrade = (value) => {
    console.log("gradeId:", value[value.length - 2]);
   setListsubsidizePages(1);
   setListDataPageSize(10);
   setAllScreening({ ...AllScreening, gradeId: value[value?.length - 2] });
  };

  //贫困类型下拉点击事件
  const onChangepoorType = (value) => {
  setListsubsidizePages(1);
   setListDataPageSize(10);
   setAllScreening({ ...AllScreening, poorType: value });
  };

  //资助金额点击事件
  const onChangesupportNum = (e) => {
   setListsubsidizePages(1);
   setListDataPageSize(10);
   setAllScreening({ ...AllScreening, supportNum: e.target.value });
  };

  //查询事件
  const onClickInquire = () => {
   setListsubsidizePages(1);
   setListDataPageSize(10);
   setAllScreening({ ...AllScreening, });
  };



  return (
    <>
      <div className={styles["centertop"]}>
        <div>
          <div className={styles["General"]}>
            <p
              style={{
                fontWeight: "700",
                fontSize: "15px",
                color: "#2F78FF",
                marginLeft: "10px",
                marginTop: "10px",
              }}
            >
              资助数据
            </p>
          </div>
          <div>

            <Form
              name="Inquireform"
              form={Inquireform}
              // onFinish={InquireItem}
              // autoComplete="off"
            >
              <Row style={{ marginTop: "30px", marginLeft: "10px" }}>
                <Col span={4}>
                  <Form.Item label="学生姓名" name="studentName">
                    <Input
                    onChange={participateHandle}
                      placeholder="请输入学生姓名"
                      // onKeyDown={handleInputChange}
                      allowClear
                    />
                  </Form.Item>
                </Col>
                <Col span={4} offset={1}>
                  <Form.Item label="资助年度" name="supportYear">
                    <DatePicker
                      onChange={onChangeYear}
                      picker="year"
                      disabledDate={disabledDate}
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={4} offset={1}>
                  <Form.Item label="年级" name="gradeName">
                    <Cascader
                      onChange={Changegrade}
                      displayRender={displayRender}
                      options={GradeDirectoryOptions}
                      placeholder="请选择内容"
                    />
                  </Form.Item>
                </Col>
                <Col span={4} offset={1}>
                  <Form.Item label="学生身份证号" name="identityCard">
                    <Input
                      onChange={onChangeStudentID}
                      placeholder="请输入内容"
                      onKeyDown={handleInputChange}
                    />
                  </Form.Item>
                </Col>
                <Col span={4} offset={1}>
                  <Form.Item>
                    <Button type="primary" onClick={onClickInquire}>
                      <SearchOutlined />
                      查询
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
              <Row style={{ marginLeft: "10px" }}>
                <Col span={4}>
                  <Form.Item label="资助类型" name="supportTypeText">
                    <Select
                    onChange={onChangesupportType}
                      placeholder="请选择内容"
                      options={supportTypeOptions}
                      allowClear
                      showsearch="true"
                    />
                  </Form.Item>
                </Col>
                <Space style={{marginLeft:"75px"}}>
                    <Form.Item label="贫困类型" name="poorTypeText">
                    <Select
                    onChange={onChangepoorType}
                      placeholder="请选择内容"
                      options={poorTypeOptions}
                      allowClear
                      style={{ width: 200 }}
                      showsearch="true"
                    />
                  </Form.Item>
                    </Space>

                <Space style={{marginLeft:"124px"}}>
                <Form.Item label="资助金额" name="supportNum">
                    <Input
                      style={{width: 200 }}
                      onChange={onChangesupportNum}
                      placeholder="请输入内容"
                      addonAfter="元"
                      onKeyDown={handleInputChange}
                    />
                  </Form.Item>
                </Space>
              </Row>
            </Form>

          </div>
          <div>
            <hr className={styles["dashedhr"]} />
          </div>
          <div style={{ marginTop: "30px" }}>
            <Row style={{ marginLeft: "20px" }}>
              <Col span={1}>
                <Button type="primary" onClick={Addition}>
                  <PlusOutlined />
                  添加受助学生
                </Button>
              </Col>
              <Col span={8} offset={15}>
                <Button
                  type="link"
                  loading={ButtonLoading.Download}
                  onClick={onDownloadTemple}
                  style={{ marginRight: "10px", backgroundColor: "#EEF0F3" }}
                >
                  下载批量导入模板
                </Button>
                <Upload
                  {...UploadSubsidizelist}
                  beforeUpload={beforeUpload}
                  customRequest={customRequest}
                  showUploadList={false}
                >
                  <Button type="link" style={{ backgroundColor: "#EEF0F3" }}>
                    <SwapLeftOutlined />
                    批量导入
                  </Button>
                </Upload>

                <Button
                  type="link"
                  onClick={BulkExport}
                  style={{ backgroundColor: "#EEF0F3", marginLeft: "10px" }}
                >
                  <SwapRightOutlined /> 批量导出
                </Button>
              </Col>
            </Row>
          </div>
          <div style={{ marginTop: "20px" }}>
            <Spin spinning={loading}>
              <Table
                rowKey={(SubsidizeListData) => SubsidizeListData.id}
                columns={Subsidizecolumns}
                dataSource={Array.from(SubsidizeListData)}
                bordered={true}
                scroll={{ x: 3000 }}
                // scroll={{ x: TableRollingWidth + 450, y: 500 }}
                pagination={false}
              />
            </Spin>
          </div>
          <div>
            <Pagination
              onChange={NotificationChange}
              total={subsidizeTotal}
              current={ListsubsidizePages}
              defaultPageSize={10}
              showTotal={(subsidizeTotal) => `总计 ${subsidizeTotal} 条`}
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "center",
              }}
            />
          </div>
          <div>
            {/* 申请资助原因弹框 */}
            <Modal
              visible={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
              footer={false}
              width="800px"
            >
              <div style={{ textAlign: "center" }}>
                <h2
                  style={{
                    margin: 0,
                    fontWeight: "700",
                    fontSize: "19px",
                    marginBottom: "30px",
                  }}
                >
                  申请资助原因
                </h2>
              </div>
              <Row>
                <Col span={4}>姓名：{viewDetails?.studentName}</Col>
                <Col span={3} offset={1}>
                  性别：{viewDetails?.sexText}
                </Col>
                <Col span={8} offset={1}>
                  学号：{viewDetails?.studyPhone}
                </Col>
                <Col span={6} offset={1}>
                  班级名称：{viewDetails?.className}
                </Col>
              </Row>
              <Row style={{ marginTop: "20px" }}>
                <Col span={24}>申请资助原因：{viewDetails?.reason}</Col>
              </Row>
              <Row style={{ marginTop: "20px" }}>
                <Col span={12}>
                  附件：{viewDetails?.reasonAnnex &&viewDetails?.reasonAnnex.split(",").map((item, index) => (<Button key={index} target="_blank" type="link" href={item?.split("*")[1]}>{item?.split("*")[0]}</Button>))}
                </Col>
              </Row>
              {/* <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  style={{ backgroundColor: "#EEF0F3" }}
                  onClick={DownloadReason}
                >
                  <DownloadOutlined />
                  下载附件
                </Button>
              </div> */}
            </Modal>
          </div>

          <div>
            {/* 其它材料弹框 */}
            <Modal
              visible={isModalOpenone}
              onOk={handleOkone}
              onCancel={handleCancelone}
              footer={false}
              width="800px"
            >
              <div style={{ textAlign: "center" }}>
                <h2
                  style={{
                    margin: 0,
                    fontWeight: "700",
                    fontSize: "19px",
                    marginBottom: "30px",
                  }}
                >
                  其它材料
                </h2>
              </div>
              <Row>
                <Col span={4}>姓名：{OtherMaterials?.studentName}</Col>
                <Col span={3} offset={1}>
                  性别：{OtherMaterials?.sexText}
                </Col>
                <Col span={8} offset={1}>
                  学号：{OtherMaterials?.studyPhone}
                </Col>
                <Col span={6} offset={1}>
                  班级名称：{OtherMaterials?.className}
                </Col>
              </Row>
              <Row style={{ marginTop: "20px" }}>
                <Col span={24}>申请资助原因：{OtherMaterials?.reason}</Col>
              </Row>
              <Row style={{ marginTop: "20px" }}>
                <Col span={12}>
                  附件：{OtherMaterials?.annex &&OtherMaterials?.annex.split(",").map((item, index) => (<Button key={index} target="_blank" type="link" href={item?.split("*")[1]}>{item?.split("*")[0]}</Button>))}
                </Col>
              </Row>
              <div style={{ display: "flex", justifyContent: "center" }}>
                {/* <Button
                  style={{ backgroundColor: "#EEF0F3" }}
                  onClick={DownloadMaterials}
                >
                  <DownloadOutlined />
                  下载附件
                </Button> */}
              </div>
            </Modal>
          </div>
          <div>
            <Modal
              visible={isModalOpenTo}
              onOk={handleOkTo}
              onCancel={handleCancelTo}
              footer={false}
              width="1000px"
            >
              <div style={{ textAlign: "center" }}>
                <h2
                  style={{
                    margin: 0,
                    fontWeight: "700",
                    fontSize: "19px",
                    marginBottom: "30px",
                  }}
                >
                  添加受助学生
                </h2>
              </div>
              <Form
                name="Newform"
                form={Newform}
                // onFinish={AddItem}
                // autoComplete="off"
              >
                <Row style={{ marginTop: "30px", color: "#333333 " }}>
                  <Col span={5}>
                    <Form.Item
                      label="届级"
                      name=""
                      rules={[
                        {
                          required: true,
                          message: "请选择内容!",
                        },
                      ]}
                    >
                      <DatePicker
                        onChange={onChangeClassYear}
                        picker="year"
                        placeholder="请选择届级"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6} offset={1}>
                    <Form.Item
                      label="班级"
                      name="ClassGrade"
                      rules={[{ required: true }]}
                    >
                      <Cascader
                        showsearch="true"
                        onChange={onUsernameChange}
                        displayRender={displayRender}
                        options={GradeDirectoryOptions}
                        placeholder="请选择班级"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8} offset={3}>
                    <Form.Item
                      label="学生姓名"
                      name="studentName"
                      rules={[{ required: true }]}
                    >
                      <Select
                        labelInValue={true}
                        allowClear
                        showsearch="true"
                        onSelect={studentId}
                        placeholder="请选择学生姓名"
                        options={PupilNameOptions}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col span={5}>
                    <Form.Item
                      label="资助年度"
                      name="supportYear"
                      rules={[
                        {
                          required: true,
                          message: "请选择内容!",
                        },
                      ]}
                    >
                      <DatePicker
                        disabledDate={disabledDate}
                        getPopupContainer={(triggerNode) =>
                          triggerNode.parentNode
                        }
                        picker="year"
                      ></DatePicker>
                    </Form.Item>
                  </Col>
                 <Space style={{marginLeft:"41px"}}>
                 <Form.Item
                      label="贫困类型"
                      name="poorType"
                      rules={[
                        {
                          required: true,
                          message: "请选择内容!",
                        },
                      ]}
                    >
                      <Select
                      style={{width:200}}
                        allowClear
                        placeholder="请选择贫困类型"
                        options={poorTypeOptions}
                      />
                    </Form.Item>
                 </Space>


                  <Col span={7} offset={2}>
                    <Form.Item
                      label="资助类型"
                      name="supportType"
                      rules={[
                        {
                          required: true,
                          message: "请选择内容!",
                        },
                      ]}
                    >
                      <Select
                        placeholder="请选择资助类型"
                        options={supportTypeOptions}
                        allowClear
                        showsearch="true"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                <Col span={5}>
                    <Form.Item
                      label="所属银行"
                      name="bank"
                      rules={[
                        {
                          required: true,
                          message: "请输入内容!",
                        },
                      ]}
                    >
                      <Input
                        placeholder="请输入内容"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}offset={1}>
                    <Form.Item
                      label="银行卡号"
                      name="bankNumber"
                      rules={[
                        {
                          required: true,
                          message: "请输入内容!",
                        },
                        {
                          validator: validateBankNumber,
                        },
                      ]}
                    >
                      <Input
                        placeholder="请输入银行卡号"
                        onKeyDown={handleInputChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={7} offset={3}>
                    <Form.Item
                      label="资助金额"
                      name="supportNum"
                      rules={[
                        {
                          required: true,
                          message: "请输入内容!",
                        },
                      ]}
                      validateStatus={error ? "error" : ""}
                      help={error}
                    >
                      <Input
                        addonAfter="元"
                        placeholder="请输入资助金额"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      label="申请资助原因"
                      name="reason"
                      rules={[
                        {
                          required: true,
                          message: "请输入内容!",
                        },
                      ]}
                    >
                      <TextArea rows={4} placeholder="请输入申请资助原因" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Form.Item label="申请资助原因附件" name="reasonAnnex"
                  >
                    <div>
                      <Upload
                        maxCount={3}
                        listType="picture"
                        action="/auth/web/front/v1/upload/uploadFile"
                        headers={Authorization}
                        defaultFileList={defaultFileList ? [...defaultFileList] : []}
                        fileList={defaultFileList ? [...defaultFileList] : []}
                        onChange={handleBeforeUpload}
                        onPreview={handlePreviewFile}
                      >
                        {uploadButtonReason}
                      </Upload>

                    </div>
                    <div style={{ fontSize: "10px", marginTop: "10px" }}>
                      <p>
                        (请上传申请资助原因文件,文件上限为3条)
                      </p>
                    </div>
                  </Form.Item>
                </Row>
                <Form.Item label="其它材料" name="annex">
                  <div>
                    <Upload
                      maxCount={3}
                      listType="picture"
                      action="/auth/web/front/v1/upload/uploadFile"
                      headers={Authorization}
                      defaultFileList={defaultAnnexList ? [...defaultAnnexList] : []}
                      fileList={defaultAnnexList ? [...defaultAnnexList] : []}
                      onChange={handleAnnexUpload}
                      onPreview={handleAnnex}
                    >
                      {uploadButtonOther}
                    </Upload>
                  </div>
                <div style={{ fontSize: "10px", marginLeft: "50px" }}>
                  <p>(请上传其它材料文件,文件上限为3条)</p>
                </div>
                </Form.Item>
              </Form>
              <Row>
                <Col offset={6}>
                  <div style={{ marginLeft: "190px" }}>
                    <Button type="primary" onClick={AddStudent}>
                      保存
                    </Button>
                  </div>
                </Col>
              </Row>
            </Modal>
          </div>
          <div>
            <Modal
              visible={isModalOpenFour}
              onOk={handleOkFour}
              onCancel={handleCancelFour}
              footer={null}
              width="1200px"
            >
              <div style={{ textAlign: "center" }}>
                <h2
                  style={{
                    margin: 0,
                    fontWeight: "700",
                    fontSize: "17px",
                    marginBottom: "30px",
                  }}
                >
                  修改受助学生信息
                </h2>
              </div>
              <div>
                <Row style={{ marginTop: "20px" }}>
                  <Col span={4}>
                    <p>学号：{ModifyView?.studyPhone}</p>
                  </Col>
                  <Col span={3} offset={2}>
                    <p>年级：{ModifyView?.gradeName}</p>
                  </Col>
                  <Col span={4} offset={1}>
                    <p>班级：{ModifyView?.className}</p>
                  </Col>
                  <Col span={3} offset={1}>
                    <p>家长姓名：{ModifyView?.parentUserName}</p>
                  </Col>
                  <Col span={5} offset={1}>
                    <p>家长身份证号：{ModifyView?.parentIdentityCard}</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={3}>
                    <p>学生姓名：{ModifyView?.studentName}</p>
                  </Col>
                  <Col span={2} offset={3}>
                    <p>性别：{ModifyView?.sexText}</p>
                  </Col>
                  <Col span={3} offset={2}>
                    <p>民族：{ModifyView?.nationText}</p>
                  </Col>
                  <Col span={5} offset={2}>
                    <p>学生身份证号：{ModifyView?.identityCard}</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={10}>
                    <p>家庭住址：{ModifyView?.address}</p>
                  </Col>
                </Row>
              </div>
              <Form
                name="Editform"
                form={Editform}
                // onFinish={EditItem}
                // autoComplete="off"
              >
                <Row style={{ marginTop: "15px" }}>
                  <Col span={4}>
                    <Form.Item
                      label="资助年度"
                      name="supportYear"
                      rules={[
                        {
                          required: true,
                          message: "请选择内容!",
                        },
                      ]}
                    >
                      <DatePicker
                        onChange={onChangeYear}
                        picker="year"
                        disabledDate={disabledDate}
                        getPopupContainer={(triggerNode) =>
                          triggerNode.parentNode
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Space style={{marginLeft:"190px"}}>
                  <Form.Item
                      label="贫困类型"
                      name="poorType"
                      rules={[
                        {
                          required: true,
                          message: "请选择内容!",
                        },
                      ]}
                    >
                      <Select
                      style={{width:200}}
                        options={poorTypeOptions}
                        allowClear
                        showsearch="true"
                        placeholder="请选择贫困类型"
                      />
                    </Form.Item>
                  </Space>


                  <Col span={5} offset={4}>
                    <Form.Item
                      label="资助类型"
                      name="supportType"
                      rules={[
                        {
                          required: true,
                          message: "请选择内容!",
                        },
                      ]}
                    >
                      <Select
                        options={supportTypeOptions}
                        allowClear
                        showsearch="true"
                        placeholder="请选择资助类型"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row style={{ marginTop: "15px" }}>
                <Col span={5}>
                    <Form.Item
                      label="所属银行"
                      name="bank"
                      rules={[
                        {
                          required: true,
                          message: "请输入内容!",
                        },
                      ]}
                    >
                      <Input
                        placeholder="请输入内容"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}offset={3}>
                    <Form.Item
                      label="银行卡号"
                      name="bankNumber"
                      rules={[
                        {
                          required: true,
                          message: "请输入内容!",
                        },
                      ]}
                    >
                      <Input placeholder="请输入银行卡号" />
                    </Form.Item>
                  </Col>
                  <Col span={5} offset={4}>
                    <Form.Item
                      label="资助金额"
                      name="supportNum"
                      rules={[
                        {
                          required: true,
                          message: "请输入内容!",
                        },
                      ]}
                    >
                      <Input addonAfter="元" placeholder="请输入金额" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      label="申请资助原因"
                      name="reason"
                      rules={[
                        {
                          required: true,
                          message: "请输入!",
                        },
                      ]}
                    >
                      <TextArea
                        rows={4}
                        placeholder="请输入申请资助原因"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Form.Item label="申请资助原因" name="reasonAnnex">
                    <div>
                      <Upload
                        maxCount={3}
                        listType="picture"
                        action="/auth/web/front/v1/upload/uploadFile"
                        headers={Authorization}
                        defaultFileList={defaultFileList ? [...defaultFileList] : []}
                        fileList={defaultFileList ? [...defaultFileList] : []}
                        onChange={handleBeforeUpload}
                        onPreview={handlePreviewFile}
                      >
                        {uploadButtonReason}
                        {/* <Button icon={<UploadOutlined />}>上传文件</Button> */}
                      </Upload>
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#666666",
                        marginTop: "10px",
                      }}
                    >
                      <p>
                        (请上传申请资助原因文件，文件上限为3条)
                      </p>
                    </div>
                  </Form.Item>
                </Row>
                <Row>
                  <Form.Item label="其它材料" name="annex">
                    <Row style={{ marginLeft: "30px" }}>
                      <div>
                        <Upload
                          maxCount={3}
                          listType="picture"
                          action="/auth/web/front/v1/upload/uploadFile"
                          headers={Authorization}
                          defaultFileList={defaultAnnexList ? [...defaultAnnexList] : []}
                          fileList={defaultAnnexList ? [...defaultAnnexList] : []}
                          onChange={handleAnnexUpload}
                          onPreview={handleAnnex}
                        >
                          {uploadButtonOther}
                        </Upload>
                      </div>
                    </Row>
                  </Form.Item>
                </Row>
                <div
                  style={{
                    fontSize: "10px",
                    marginLeft: "50px",
                    color: "#666666",
                  }}
                >
                  <p>(请上传其它材料文件，文件上限为3条)</p>
                </div>
              </Form>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Form.Item>
                  <Button loading={loading} type="primary" onClick={EditItem}>
                    确定
                  </Button>
                </Form.Item>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    supportTypeOptions: state[namespace].supportTypeOptions,
    poorTypeOptions: state[namespace].poorTypeOptions,
    GradeDirectoryOptions: state[namespace].GradeDirectoryOptions,
    gradeOptions: state[namespace].gradeOptions,
  };
};

export default connect(mapStateToProps)(Subsidize);
