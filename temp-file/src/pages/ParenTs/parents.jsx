/**
 * 家长数据
 * @author:仝梦园
 * date:2023年4月27日
 * */
import React, { useState, useEffect, useRef } from "react";
import { connect } from "dva";
import { Parent as namespace } from "../../utils/namespace";
import NewTeacher from "./componets/NewParent/NewParent";
import ParentDetails from "./componets/ParentDetails/ParentDetails";
import DelectParent from "./componets/DelectParent"
import { excelType } from "@/utils/const";
import styles from "./parents.less";
import {
  ExclamationCircleOutlined,
  SearchOutlined,
  SettingOutlined,
  HomeOutlined,
  MailOutlined,
  UserOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import {
  Upload,
  message,
  Cascader,
  Col,
  Row,
  Spin,
  Menu,
  Radio,
  Button,
  Select,
  Tooltip,
  Option,
  Input,
  Form,
  Checkbox,
  Tag,
  Table,
  Space,
  Modal,
  Dropdown,
  Pagination,
  TreeSelect,
} from "antd";
import accessTokenCache from "@/caches/accessToken";
import userInfoCache from "@/caches/userInfo";
import Page from "@/components/Pages/page";
const title = "数据中心-家长数据";
const breadcrumb = [title];
const header = <Page.Header breadcrumb={breadcrumb} title={title} />;
//搜索框
const { Search } = Input;

const { confirm } = Modal;

function Parents(props) {
  const token = accessTokenCache() && accessTokenCache();
  const {
    location,
    dispatch,
    DetailId,
    sexOptions,
    eduCational,
    situAtion,
    nationAs,
    ProvinceCityAddressOptions,
  } = props;

  const DeleteTeacherRef = useRef(null)
  //家长id
  const [AllScreening, setAllScreening] = useState({});
  const [NewColumns, setNewColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listDataSource, setListDataSource] = useState([]);
  const [listDataTotal, setListDataTotal] = useState(0);
  const [ListDataCurrentPage, setListDataCurrentPage] = useState(1);
  const [ListDataPageSize, setListDataPageSize] = useState(10);
  const [TeacherDetailId, setTeacherDetailId] = useState(null);
  const [TeacherDetailIds, setTeacherDetailIds] = useState(null);
  const [DetailLoading, setDetailLoading] = useState(true);
  const [CheckboxDefaultValues, setCheckboxDefaultValues] = useState([
    "spoce",
    "nativePlace",
    "nationName",
    "age",
    "tags",
    "userName",
    "phone",
    "fixedPhone",
    "sex",
    "education",
    "workProvince",
    "workType",
    "assocStuNames",
    "index",
    "relation",
    "className",
  ]);
  const [StatTeacherStatistics, setStatTeacherStatistics] = useState({});
  const [ButtonLoading, setButtonLoading] = useState(false);
  const [classList, setClassList] = useState([]); // 班级列表
  const [spoceList, setSpoceList] = useState([]); //存储学校学级
  const [grateStatusClass, getGrateStatusClass] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([])//多选-被选中的行

  const loginUserInfo = userInfoCache() || {};

  useEffect(() => {
    if (
      loginUserInfo.code === "SCHOOL_ADMIN" ||
      loginUserInfo.code === "CLASS_HEAD"
    ) {
      //学校管理员
      // StatTeacherStatisticsApi();
      getQueryTreeCatalogueMesApi();
      dispatch({
        type: namespace + "/batchLoadDictGroupsApi",
        payload: {
          dictCodes:
            "DICT_NATION,DICT_WORK,DICT_DOC_TYPE,DICT_EDU,DICT_TRAIN,DICT_TRAIN_LEVEL,DICT_HONOUR_TYPE,DICT_HONOR,DICT_ACHV_LEVEL,DICT_WORK,DICT_RELATION,DICT_PHYS_RESULT,DICT_ENROLL_PARENT_RELATION,DICT_SEX,DICT_MARRIAGE,DICT_POLIT,DICT_WORK,DICT_POST_INFO,DICT_STUDY_STATUS,DICT_UNIT_METHOD,DICT_NATURE,DICT_POST_CHANGE_TYPE,DICT_MANDARIN_LEVEL,DICT_TITLE,DICT_POST",
        },
      });
      dispatch({
        type: namespace + "/getDictionaryAddressApi",
        payload: { deep: 3 },
      });
      dispatch({
        type: namespace + "/getGrateStatusClassData",
        callback: (res) => {
          if (res.result) {
            setSpoceList(
              res.result.spoceList.map((result) => {
                return {
                  label: result.id,
                  value: result.id,
                };
              })
            );
          }
        },
      });
    }
  }, []);

  const sendTeacherDetailId = (id) => {
    setTeacherDetailId(id);
  };

  const sendTeacherDetailIds = (assocStuIdentityCards) => {
    setTeacherDetailIds(assocStuIdentityCards);
  };

//   const StatTeacherStatisticsApi = () => {
//     dispatch({
//         type: namespace + "/getStatTeacherStatistics",
//         callback: (res) => {
//             if (JSON.stringify(res.result) !== '{}') {
//                 setStatTeacherStatistics(res?.result)
//             }
//         }
//     })
// }

  //分页查询家长信息
  const getTeacherList = (page = 1, size = 10, value) => {
    setLoading(true);
    dispatch({
      type: namespace + "/queryFamilyListMesApi",
      payload: { page, size, ...value },
      callback: (res) => {
        if (res) {
          setLoading(false);
          setListDataSource(
            res.data?.map((item) => {
              return { ...item, key: item.id+Math.floor(Math.random() * 100000000).toString().padStart(8, '0').slice(0, 8)-0 };
            })
          );
          setListDataTotal(res?.total);
          setListDataCurrentPage(res?.currentPage);
        }
      },
    });

    dispatch({
      type: namespace + "/queryFamilyClassMesAndGradeMesApi",
      payload: { spoce: getClassListszid },
      callback: (res) => {
        if (res.result) {
          setClassList(res.result);
        } else {
          setClassList(null);
        }
      },
    });
  };

  const [getClassListsz, getClassList] = useState([]);
  const [PeriodList, getPeriodList] = useState([]);
  const [PeriodLists, getPeriodLists] = useState([]);
  const [GradeList, getGradeList] = useState([]);
  const [MultipleList, getMultipleList] = useState([]);

  //查询班级，学级，学段，年级
  const getQueryTreeCatalogueMesApi = () => {
    dispatch({
      type: namespace + "/queryTreeCatalogueMesApi",
      callback: (res) => {
        getClassList(
          res.result.spoceList.map((res) => {
            return {
              value: res.id,
              label: res.id,
            };
          })
        );
        getPeriodLists(res?.result?.studyList);
        getPeriodList(
          res.result.studyList.map((res) => {
            return {
              label: res.name,
              value: res.id,
            };
          })
        );
      },
    });
  };

  useEffect(() => {
    setAllScreening(AllScreening);
    getTeacherList(ListDataCurrentPage, ListDataPageSize, AllScreening);
  }, [AllScreening]);

  // 搜索框
  // const onSearch = (value) => console.log(value);

  // 展开/折叠筛选
  const [ExpansionScreening, setExpansionScreening] = useState(false);

  // 展开/折叠筛选
  const onExpansionScreening = () => {
    setExpansionScreening(!ExpansionScreening);
  };

  // 表格滚动宽度
  const [TableRollingWidth, setTableRollingWidth] = useState(0);

  // 表格字段按钮 下拉菜单
  const basicsOptions = [
    { label: "家长姓名", value: "userName", disabled: true },
    { label: "学届", value: "spoce" },
    { label: "关系", value: "relation" },
    { label: "性别", value: "sex" },
    { label: "民族", value: "nationName" },
    { label: "籍贯", value: "nativePlace" },
    { label: "年龄", value: "age" },
    { label: "学历层次", value: "education" },
    { label: "工作省份", value: "workProvince" },
    { label: "工作情况", value: "workType" },
    { label: "手机号", value: "phone", disabled: true },
    { label: "固定电话", value: "fixedPhone", disabled: true },
    { label: "关联学生", value: "assocStuNames" },
    { label: "班级", value: "className" },
    { label: "操作", value: "tags", disabled: true },
    { label: "序号", value: "index", disabled: true },
  ];

  //表格字段筛选
  const onCheckboxChange = (checkedValues) => {
    setCheckboxDefaultValues(checkedValues);
    setNewColumns(columns.filter((item) => checkedValues.includes(item.key)));
    setTableRollingWidth(
      columns
        .filter((item) => checkedValues.includes(item.key))
        .map((item) => item.width)
        .reduce((prev, cur) => prev + cur)
    );
  };

  // rowSelection对象表示需要行选择
	const rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
		    setSelectedRows(selectedRows)
		}
    }
    // 多选删除
    const onMultipleDel = () => { 
        showDeleteConfirm(selectedRows)
    }

  useEffect(() => {
    setNewColumns(
      columns.filter((item) => CheckboxDefaultValues.includes(item.key))
    );
    setTableRollingWidth(
      columns
        .filter((item) => CheckboxDefaultValues.includes(item.key))
        .map((item) => item.width)
        .reduce((prev, cur) => prev + cur)
    );
  }, [ListDataCurrentPage]);

  const DropdownItems = (
    <Menu multiple={true} forceSubMenuRender={true} className="DropdownPopup">
      <Menu.SubMenu title="基础信息" key="foundation" icon={<HomeOutlined />}>
        <Checkbox.Group
          options={basicsOptions}
          defaultValue={CheckboxDefaultValues}
          onChange={onCheckboxChange}
        />
      </Menu.SubMenu>
    </Menu>
  );
  const [gradeValue, setGradeValue] = useState(null);

  // 确认删除弹窗
  const showDeleteConfirm = record => {
    confirm({
      title: '删除提示',
      icon: <ExclamationCircleOutlined />,
      content: (
        <>
          {Array.isArray(record) ? (
            <div>您确定要进行批量删除操作吗？</div>
          ) : (
            <div>
              您确定要删除名为 <span style={{ color: '#1890ff', margin: '10px 0 0 0' }}>{record.userName}</span> 的家长吗？
            </div>
          )}
          <div style={{ fontWeight: 800, margin: '10px 0 0 0' }}>该删除操作不可逆。</div>
        </>
      ),
      okType: 'danger',
      onOk() {
        DeleteTeacherRef.current.showDeleteTeacher(record)
      }
    })
  }

  // 家长表格表头
  const columns = [
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
      fixed: "left",
      render: (text, record, index) =>
        (ListDataCurrentPage - 1) * ListDataPageSize + index + 1,
      width: "70px",
    },
    {
      title: "家长姓名",
      dataIndex: "userName",
      key: "userName",
      fixed: "left",
      width: "140px",
    },
    {
      title: "关系",
      dataIndex: "relation",
      key: "relation",
      width: "140px",
    },
    {
      title: "关联学生",
      dataIndex: "assocStuNames",
      key: "assocStuNames",
      width: "140px",
      ellipsis: true,
    },
    {
      title: "班级",
      dataIndex: "className",
      key: "className",
      width: "140px",
    },
    {
      title: "学届",
      dataIndex: "spoce",
      key: "spoce",
      width: "140px",
    },
    {
      title: "性别",
      dataIndex: "sex",
      key: "sex",
      width: "100px",
    },
    {
      title: "年龄",
      dataIndex: "age",
      key: "age",
      width: "100px",
    },
    {
      title: "民族",
      dataIndex: "nationName",
      key: "nationName",
      width: "100px",
    },
    {
      title: "学历层次",
      dataIndex: "education",
      key: "education",
      width: "100px",
    },
    {
      title: "籍贯",
      dataIndex: "nativePlace",
      key: "nativePlace",
      width: "200px",
    },
    {
      title: "工作省份",
      dataIndex: "workProvince",
      key: "workProvince",
      width: "140px",
    },
    {
      title: "工作情况",
      dataIndex: "workType",
      key: "workType",
      width: "140px",
    },
    {
      title: "手机号",
      dataIndex: "phone",
      key: "phone",
      width: "140px",
    },
    {
      title: "座机",
      dataIndex: "fixedPhone",
      key: "fixedPhone",
      width: "140px",
    },
    {
      title: "操作",
      key: "tags",
      dataIndex: "tags",
      width: "180px",
      render: (_, record) => {
        return (
          <Row>
            <Col span={12}>
              <Button
                type="link"
                onClick={() => {
                  showTeacherDetails();
                  sendTeacherDetailId(record.id);
                  sendTeacherDetailIds(record.assocStuIdentityCards);
                }}
              >
                更多详情
              </Button>
            </Col>
            <Col span={12}>
              <Button type="link" onClick={() => {showDeleteConfirm(record)}}>删除</Button>
            </Col>
          </Row>
        );
      },
    },
  ];

  // 更多详情表格表单
  const datafooter = [
    {
      key: "1",

      annual: "2023",
      Evaluationresult: "健康",
    },
    {
      key: "3",
      annual: "2022",
      Evaluationresult: "健康",
    },
    {
      key: "3",
      annual: "2021",
      Evaluationresult: "健康",
    },
  ];

  const handleAccountChange = (value) => {
    setListDataCurrentPage(1);
    setAllScreening({ ...AllScreening, stuName: value });
  };

  //家长弹窗
  const handleCityAddressChange = (value) => {
    setListDataCurrentPage(1);
    setAllScreening({ ...AllScreening, nativePlace: value && value[2] });
  };
  const [TeacherDetailsOpen, setTeacherDetailsOpen] = useState(false);
  const showTeacherDetails = () => {
    setIsModalOpen(!isModalOpen);
    setTeacherDetailsOpen(!TeacherDetailsOpen);
  };
  const [NewTeacherOpen, setNewTeacherOpen] = useState(false);
  const [TeacherChangeOpen, setTeacherChangeOpen] = useState(false);
  const showTeacherChange = () => {
    setIsModalOpen(true);
    setTeacherChangeOpen(!TeacherChangeOpen);
  };
  const showNewTeacher = () => {
    setNewTeacherOpen(!NewTeacherOpen);
  };

  // 筛选事件
  const handleSexChange = (value) => {
    setListDataCurrentPage(1);
    setAllScreening({ ...AllScreening, sex: value });
  };
  const handleSexCha = (value) => {
    setListDataCurrentPage(1);
    setAllScreening({ ...AllScreening, workCase: value });
  };
  const handleSexChangess = (value) => {
    setListDataCurrentPage(1);
    setAllScreening({ ...AllScreening, education: value });
  };
  const handleNationChange = (value) => {
    setListDataCurrentPage(1);
    setAllScreening({ ...AllScreening, nationName: value });
  };
  const handleCityAddressChanges = (value) => {
    setListDataCurrentPage(1);
    setAllScreening({ ...AllScreening, workProvince: value });
  };
  const onTeacherNameSearch = (value) => {
    setListDataCurrentPage(1);
    setAllScreening({ ...AllScreening, name: value });
  };
  const [getClassListszid, getClassListids] = useState([]);
  const [classOptions1, setClassOptions1] = useState([]); // 存储班级下拉框
  const handleCancelSetuser = (value) => {
    getClassListids(value);
    setSelectedClasid(null);
    if (loginUserInfo.code == "SCHOOL_ADMIN") {
      //学校管理员
      dispatch({
        type: namespace + "/queryTreeCatalogueMesApi",
        payload: { spoceId: value },
        callback: (res) => {
          const tem = res.result?.studyList
            ?.map((item) => {
              return {
                title: item.name,
                value: item.name,
                children: item.stuGradeList
                  ?.filter((e) => e.stuCalssList.length != 0)
                  .map((item1) => {
                    return {
                      title: item1.name,
                      value: item1.name,
                      children: item1.stuCalssList?.map((item2) => {
                        return {
                          title: item2.name,
                          value: item2.id,
                        };
                      }),
                    };
                  }),
              };
            })
            .filter((e) => e.children.length != 0);
          setClassOptions1(tem);
        },
      });
    }

    setAllScreening({ ...AllScreening, spoceId: value });
  };

  //班级联结下拉框
  const classStudentData1 = (value, label) => {
    if (typeof value == "string") {
      message.error("请选择班级");
      return;
    }

    setSelectedClasid(value);
    setAllScreening({ ...AllScreening, classId: value });
  };
  const handleMultipleSetuser = (value) => {
    setAllScreening({ ...AllScreening, classId: value });
  };

  // 表格分页
  const onPaginationChange = (page, size) => {
    getTeacherList(page, size, AllScreening);
    setListDataCurrentPage(page);
    setListDataPageSize(size);
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
    var xhr = new XMLHttpRequest();
    xhr.responseType = "blob";

    if (option.onProgress && xhr.upload) {
      xhr.upload.onprogress = function progress(e) {
        if (e.total > 0) {
          e.percent = (e.loaded / e.total) * 100;
        }

        option.onProgress(e);
      };
    }

    var formData = new FormData();

    if (option.data) {
      Object.keys(option.data).forEach(function (key) {
        var value = option.data[key];

        if (Array.isArray(value)) {
          value.forEach(function (item) {
            formData.append("".concat(key, "[]"), item);
          });
          return;
        }

        formData.append(key, option.data[key]);
      });
    }

    if (option.file instanceof Blob) {
      formData.append(option.filename, option.file, option.file.name);
    } else {
      formData.append(option.filename, option.file);
    }

    xhr.onerror = function error(e) {
      option.onError(e);
    };

    xhr.onload = function onload() {
      if (xhr.status < 200 || xhr.status >= 300) {
        return option.onError(getError(option, xhr), getBody(xhr));
      }

      return option.onSuccess(getBody(xhr), xhr);
    };

    xhr.open(option.method, option.action, true);

    if (option.withCredentials && "withCredentials" in xhr) {
      xhr.withCredentials = true;
    }

    var headers = option.headers || {};

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
  //   上传组件配置信息
  const UploadProps = {
    name: "file",
    action: "/auth/web/v1/familyMes/importMes",
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
          message.success("家长数据导入成功！");
          getTeacherList();
          setLoading(false);
        } else {
          const blob = new Blob([info.file.response], {
            type: "application/vnd.ms-excel;charset=UTF-8",
          });
          const a = document.createElement("a"); // 转换完成，创建一个a标签用于下载
          a.download = "家长数据导入反馈.xls";
          a.href = window.URL.createObjectURL(blob);
          a.click();
          a.remove();
          getTeacherList();
          setLoading(false);
          Modal.warning({
            title: "导入失败",
            content: "家长数据导入失败原因已下载,请打开Excel查看具体原因！",
          });
        }
      } else if (info.file.status === "error") {
        setLoading(false);
        message.error(`${info.file.name} 上传出错`);
      }
    },
  };

  // // 批量导出
  const onBatchDerive = (e) => {
    confirm({
      title: "导出提示",
      icon: <ExclamationCircleOutlined />,
      content: "您即将导出的家长数据为表格字段中所选中的字段!",
      onOk() {
        function request() {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", "/auth/web/v1/familyMes/exportFamily", true);
          xhr.responseType = "blob";
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.setRequestHeader("Authorization", token);
          xhr.onload = function () {
            download(xhr.response);
          };
          xhr.send(
            JSON.stringify({
              ...AllScreening,
              classId: selectedClasid,
              columns: NewColumns.filter(
                (item) => item.key !== "tags" && item.key !== "index"
              ).map((item) => {
                return { name: item.title, key: item.key };
              }),
            })
          );
        }

        function download(blobUrl) {
          const xlsx = "application/vnd.ms-excel;charset=UTF-8";
          const blob = new Blob([blobUrl], { type: xlsx });
          const a = document.createElement("a");
          a.download = "家长批量导出数据.xls";
          a.href = window.URL.createObjectURL(blob);
          a.click();
          a.remove();
          message.success("家长批量导出数据已下载！");
        }
        request();
      },
      onCancel() {},
    });
  };

  //点击全部按钮获取班级数据
  const [selectedClass, setSelectedClass] = useState("all");
  const allStudentData = () => {
    setSelectedClasid(null);
    setListDataCurrentPage(1);
    setListDataPageSize(10);
    setAllScreening({ ...AllScreening, classId: null });
    // setAllScreening({ ...AllScreening });
  };

  const [selectedClasid, setSelectedClasid] = useState(null);
  const [StatStudentStatistics, setStatStudentStatistics] = useState({}); //存储学生完善信息
  const classOnChange = (id) => {
    // queryTreeCatalogueMesApi
    setSelectedClasid(id);
    dispatch({
      type: namespace + "/queryTreeCatalogueMesApi",
      payload: {
        //动态传入id,后面修改
        classId: id,
      },
      callback: (res) => {
        // if (JSON.stringify(res.result) !== '{}') {
        //   setStatStudentStatistics(res?.result)
        // }
      },
    });
    setListDataCurrentPage(1);
    setListDataPageSize(10);
    setAllScreening({ ...AllScreening, classId: id });
  };

  //班级渲染
  const newClassList = classList?.map((item) => {
    return (
      <Radio.Button
        style={{
          marginTop: "10px",
          height: "80px",
          width: "115px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          border: "1px solid #d9d9d9", // 添加边框样式
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => classOnChange(item.id)}
        value={item.id}
        key={item.id}
      >
        <Tooltip title={() => item.gradeName + item.anotherName}>
          <p
            style={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              textAlign: "center",
            }}
          >
            {item.gradeName + item.anotherName} <br />{" "}
            {item.parentClassPersonNum}人
          </p>
        </Tooltip>
      </Radio.Button>
    );
  });

  const amount = classList?.reduce((ageSum, cur) => {
    return ageSum + cur.parentClassPersonNum;
  }, 0);

  const onAgeFinish = (value) => {
    setAllScreening({ ...AllScreening, ...value });
  };

  //下载批量导入模板
  const onBatchDownload = () => {
    function request() {
      const xhr = new XMLHttpRequest();
      xhr.open(
        "GET",
        "/auth/web/v1/familyMes/downloadStuAndFamilyMesTemple?flag=1",
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
      a.download = `家长模板.xls`;
      a.href = window.URL.createObjectURL(blob);
      a.click();
      a.remove();
      message.success(`家长模板已下载`);
    }

    request();
  };
  return (
    <Page header={header}>
      <div className={styles["parentdata"]}>
        <div>
          <Form style={{ marginLeft: "10px" }}>
            {loginUserInfo.code === "SCHOOL_ADMIN" ? (
              <>
                <Row>
                  <Col span={18}>
                    <Space size={[6, 12]} wrap>
                      <Space>
                        学届：
                        <Select
                          filterOption={(inputValue, option) =>
                            option.label
                              .toLowerCase()
                              .indexOf(inputValue.toLowerCase()) >= 0
                          }
                          showSearch
                          options={getClassListsz}
                          onChange={handleCancelSetuser}
                          style={{ width: 100 }}
                          allowClear
                        />
                      </Space>
                      <Space>
                        年级：
                        <TreeSelect
                          showSearch
                          allowClear
                          value={selectedClasid}
                          treeData={classOptions1}
                          onChange={classStudentData1}
                          style={{ width: 300 }}
                        ></TreeSelect>
                      </Space>
                      <Form.Item
                        style={{ marginTop: "25px" }}
                        label="家长姓名"
                        name="3"
                      >
                        <Input.Search
                          placeholder="家长姓名"
                          onSearch={onTeacherNameSearch}
                          style={{ width: 180 }}
                        />
                      </Form.Item>
                      <Space>
                        家长性别：
                        <Select
                          options={sexOptions}
                          onChange={handleSexChange}
                          allowClear
                          style={{ width: 150 }}
                        />
                      </Space>
                      <Space>
                        家长学历：
                        <Select
                          filterOption={(inputValue, option) =>
                            option.label
                              .toLowerCase()
                              .indexOf(inputValue.toLowerCase()) >= 0
                          }
                          showSearch
                          options={eduCational}
                          onChange={handleSexChangess}
                          allowClear
                          style={{ width: 150 }}
                        />
                      </Space>
                    </Space>
                  </Col>
                  <Col span={4}>
                    <Space>
                      <Button
                        style={{ marginLeft: "30px", marginTop: "25px" }}
                        type="link"
                        onClick={onBatchDownload}
                      >
                        下载批量导入模板
                      </Button>
                      <Upload
                        {...UploadProps}
                        beforeUpload={beforeUpload}
                        customRequest={customRequest}
                        showUploadList={false}
                      >
                        <Button
                          type="link"
                          style={{ marginLeft: "30px", marginTop: "25px" }}
                        >
                          批量导入
                        </Button>
                      </Upload>
                      <Button
                        style={{ marginLeft: "30px", marginTop: "25px" }}
                        // 设置按钮的样式
                        type="link"
                        onClick={onBatchDerive}
                      >
                        批量导出
                      </Button>
                    </Space>
                  </Col>
                </Row>
                <Row>
                  <Col span={18}>
                    <Space size={[6, 12]} wrap>
                      <Space>
                        工作情况：
                        <Select
                          filterOption={(inputValue, option) =>
                            option.label
                              .toLowerCase()
                              .indexOf(inputValue.toLowerCase()) >= 0
                          }
                          showSearch
                          options={situAtion}
                          onChange={handleSexCha}
                          allowClear
                          style={{ width: 150 }}
                        />
                      </Space>

                      <Space>
                        籍贯：
                        <Cascader
                          filterOption={(inputValue, option) =>
                            option.label
                              .toLowerCase()
                              .indexOf(inputValue.toLowerCase()) >= 0
                          }
                          showSearch
                          options={ProvinceCityAddressOptions}
                          allowClear
                          style={{ width: 350 }}
                          onChange={handleCityAddressChange}
                        />
                      </Space>

                      <Form.Item
                        style={{ marginTop: "25px" }}
                        label="关联学生姓名"
                        name="8"
                      >
                        <Input.Search
                          onSearch={handleAccountChange}
                          placeholder="请输入学生姓名"
                          style={{ width: 220 }}
                          allowClear
                        />
                      </Form.Item>

                      <Space>
                        <Form name="age" onFinish={onAgeFinish}>
                          <Space size={[0, 0]}>
                            {loginUserInfo.code === "CLASS_HEAD" ? (
                              <Form.Item
                                label="年龄"
                                name="ageMin"
                                style={{
                                  marginBottom: "0",
                                  marginLeft: "-47px",
                                }}
                              >
                                <Input
                                  allowClear
                                  style={{ width: 60, borderRight: 0 }}
                                />
                              </Form.Item>
                            ) : (
                              <Form.Item
                                label="年龄"
                                name="ageMin"
                                style={{ marginBottom: "0" }}
                              >
                                <Input
                                  allowClear
                                  style={{ width: 60, borderRight: 0 }}
                                />
                              </Form.Item>
                            )}
                            <Input
                              style={{
                                width: 30,
                                borderLeft: 0,
                                borderRight: 0,
                                pointerEvents: "none",
                              }}
                              placeholder="~"
                              disabled
                            />
                            <Form.Item
                              name="ageMax"
                              style={{ marginBottom: "0" }}
                            >
                              <Input
                                allowClear
                                style={{
                                  width: 60,
                                  borderLeft: 0,
                                  borderRight: 0,
                                }}
                              />
                            </Form.Item>
                            <Form.Item style={{ marginBottom: "0" }}>
                              <Button
                                htmlType="submit"
                                icon={
                                  <SearchOutlined
                                    style={{ color: "#8c8c8c" }}
                                  />
                                }
                              ></Button>
                            </Form.Item>
                          </Space>
                        </Form>
                      </Space>
                    </Space>
                  </Col>
                  <Col span={4} style={{ marginTop: "25px" }}>
                    {/* 更多筛选按钮 */}
                    <Button
                      type="link"
                      onClick={onExpansionScreening}
                      icon={
                        ExpansionScreening ? <UpOutlined /> : <DownOutlined />
                      }
                      style={{ marginLeft: "30px" }}
                    >
                      更多筛选
                    </Button>

                    <Dropdown
                      overlay={DropdownItems}
                      arrow={true}
                      trigger={["click"]}
                    >
                      <Button type="primary" icon={<SettingOutlined />}>
                        表格字段
                      </Button>
                    </Dropdown>
                  </Col>
                  {window.$PowerUtils.judgeButtonAuth(location, '批量删除') && <Button type="primary" style={{ marginTop: '25px' }} onClick={onMultipleDel} disabled={!selectedRows.length > 0} danger >一键删除</Button>}
                </Row>
                <div>
                  {ExpansionScreening && (
                    <div>
                      <Row>
                        <Col span={23}>
                          <Space size={[8, 16]} wrap>
                            <Space>
                              民族：
                              <Select
                                filterOption={(inputValue, option) =>
                                  option.label
                                    .toLowerCase()
                                    .indexOf(inputValue.toLowerCase()) >= 0
                                }
                                showSearch
                                options={nationAs}
                                onChange={handleNationChange}
                                allowClear
                                style={{ width: 120 }}
                              />
                            </Space>
                            <Space>
                              工作省份：
                              <Select
                                filterOption={(inputValue, option) =>
                                  option.label
                                    .toLowerCase()
                                    .indexOf(inputValue.toLowerCase()) >= 0
                                }
                                showSearch
                                options={ProvinceCityAddressOptions}
                                onChange={handleCityAddressChanges}
                                allowClear
                                style={{ width: 150 }}
                              />
                            </Space>

                            <Form.Item
                              style={{ marginTop: "25px" }}
                              label="心理测评"
                              name="2"
                            >
                              <Select
                                disabled={true}
                                defaultValue="全部"
                                style={{
                                  width: 120,
                                }}
                                options={[
                                  {
                                    value: "合格",
                                  },
                                  {
                                    value: "不合格",
                                  },
                                ]}
                              />
                            </Form.Item>
                          </Space>
                        </Col>
                      </Row>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Row>
                  <Col span={18}>
                    <Space size={[5, 13]} wrap>
                      <Space>
                        学届：
                        <Select
                          filterOption={(inputValue, option) =>
                            option.label
                              .toLowerCase()
                              .indexOf(inputValue.toLowerCase()) >= 0
                          }
                          showSearch
                          options={getClassListsz}
                          onChange={handleCancelSetuser}
                          style={{ width: 100 }}
                          allowClear
                        />
                      </Space>
                      {loginUserInfo.code === "CLASS_HEAD" ? null : (
                        <>
                          <Space>
                            年级：
                            <TreeSelect
                              showSearch
                              allowClear
                              value={selectedClasid}
                              treeData={classOptions1}
                              onChange={classStudentData1}
                              style={{ width: 350 }}
                            ></TreeSelect>
                          </Space>
                        </>
                      )}
                      {loginUserInfo.code === "CLASS_HEAD" && (
                        <Form.Item
                          style={{ marginTop: "25px" }}
                          label="家长姓名"
                          name="3"
                        >
                          <Input.Search
                            placeholder="家长姓名"
                            onSearch={onTeacherNameSearch}
                            style={{ width: 180 }}
                          />
                        </Form.Item>
                      )}
                      {(loginUserInfo.code === "CLASS_HEAD" ||
                        loginUserInfo.code !== "CLASS_HEAD") && (
                        <Space>
                          家长性别：
                          <Select
                            options={sexOptions}
                            onChange={handleSexChange}
                            allowClear
                            style={{ width: 150 }}
                          />
                        </Space>
                      )}
                      <Space>
                        家长学历：
                        <Select
                          filterOption={(inputValue, option) =>
                            option.label
                              .toLowerCase()
                              .indexOf(inputValue.toLowerCase()) >= 0
                          }
                          showSearch
                          options={eduCational}
                          onChange={handleSexChangess}
                          allowClear
                          style={{ width: 150 }}
                        />
                      </Space>
                      {loginUserInfo.code === "CLASS_HEAD" && (
                        <Space>
                          工作情况：
                          <Select
                            filterOption={(inputValue, option) =>
                              option.label
                                .toLowerCase()
                                .indexOf(inputValue.toLowerCase()) >= 0
                            }
                            showSearch
                            options={situAtion}
                            onChange={handleSexCha}
                            allowClear
                            style={{ width: 150 }}
                          />
                        </Space>
                      )}
                    </Space>
                  </Col>
                  <Col span={6} style={{ marginTop: "25px" }}>
                    <div>
                      <Space size={[2, 4]} wrap>
                        {loginUserInfo.code === "SCHOOL_ADMIN" ? null : (
                          <>
                            {/* <a
                              href="https://reseval.gg66.cn/%E5%AE%B6%E9%95%BF%E6%A8%A1%E6%9D%BF.xls"
                              download="家长数据批量导入模板.xlsx"
                              style={{ marginTop: "25px" }}
                            >
                              下载批量导入模板
                            </a> */}
                            <Button type="link" onClick={onBatchDownload}>
                              下载批量导入模板
                            </Button>
                            <Upload
                              {...UploadProps}
                              beforeUpload={beforeUpload}
                              customRequest={customRequest}
                              showUploadList={false}
                            >
                              <Button type="link">批量导入</Button>
                            </Upload>
                          </>
                        )}
                        {loginUserInfo.code !== "SCHOOL_ADMIN" && (
                          <Button
                            // 设置按钮的样式
                            type="link"
                            onClick={onBatchDerive}
                          >
                            批量导出
                          </Button>
                        )}
                      </Space>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span={18}>
                    <Space size={[6, 12]} wrap>
                      <Space>
                        籍贯：
                        <Cascader
                          filterOption={(inputValue, option) =>
                            option.label
                              .toLowerCase()
                              .indexOf(inputValue.toLowerCase()) >= 0
                          }
                          showSearch
                          options={ProvinceCityAddressOptions}
                          allowClear
                          style={{ width: 350 }}
                          onChange={handleCityAddressChange}
                        />
                      </Space>

                      <Form.Item
                        style={{ marginTop: "25px" }}
                        label="关联学生姓名"
                        name="8"
                      >
                        <Input.Search
                          onSearch={handleAccountChange}
                          placeholder="请输入学生姓名"
                          style={{ width: 220 }}
                          allowClear
                        />
                      </Form.Item>

                      <Space style={{ marginLeft: "50px" }}>
                        <Form name="age" onFinish={onAgeFinish}>
                          <Space size={[0, 0]}>
                            {loginUserInfo.code === "CLASS_HEAD" ? (
                              <Form.Item
                                label="年龄"
                                name="ageMin"
                                style={{
                                  marginBottom: "0",
                                  marginLeft: "-47px",
                                }}
                              >
                                <Input
                                  allowClear
                                  style={{ width: 60, borderRight: 0 }}
                                />
                              </Form.Item>
                            ) : (
                              <Form.Item
                                label="年龄"
                                name="ageMin"
                                style={{ marginBottom: "0" }}
                              >
                                <Input
                                  allowClear
                                  style={{ width: 60, borderRight: 0 }}
                                />
                              </Form.Item>
                            )}
                            <Input
                              style={{
                                width: 30,
                                borderLeft: 0,
                                borderRight: 0,
                                pointerEvents: "none",
                              }}
                              placeholder="~"
                              disabled
                            />
                            <Form.Item
                              name="ageMax"
                              style={{ marginBottom: "0" }}
                            >
                              <Input
                                allowClear
                                style={{
                                  width: 60,
                                  borderLeft: 0,
                                  borderRight: 0,
                                }}
                              />
                            </Form.Item>
                            <Form.Item style={{ marginBottom: "0" }}>
                              <Button
                                htmlType="submit"
                                icon={
                                  <SearchOutlined
                                    style={{ color: "#8c8c8c" }}
                                  />
                                }
                              ></Button>
                            </Form.Item>
                          </Space>
                        </Form>
                      </Space>
                      <Space>
                        工作省份：
                        <Select
                          filterOption={(inputValue, option) =>
                            option.label
                              .toLowerCase()
                              .indexOf(inputValue.toLowerCase()) >= 0
                          }
                          showSearch
                          options={ProvinceCityAddressOptions}
                          onChange={handleCityAddressChanges}
                          allowClear
                          style={{ width: 150 }}
                        />
                      </Space>
                    </Space>
                  </Col>
                  <Col span={4} style={{ marginTop: "25px" }}>
                    {/* 更多筛选按钮 */}
                    <Button
                      type="link"
                      onClick={onExpansionScreening}
                      icon={
                        ExpansionScreening ? <UpOutlined /> : <DownOutlined />
                      }
                      style={{ marginLeft: "30px" }}
                    >
                      更多筛选
                    </Button>
                    {loginUserInfo.code === "SCHOOL_ADMIN" && (
                      <Dropdown
                        overlay={DropdownItems}
                        arrow={true}
                        trigger={["click"]}
                      >
                        <Button type="primary" icon={<SettingOutlined />}>
                          表格字段
                        </Button>
                      </Dropdown>
                    )}
                  </Col>
                </Row>
                <div>
                  {ExpansionScreening && (
                    <div>
                      <Row>
                        <Col span={23}>
                          <Space size={[8, 16]} wrap>
                            <Space>
                              民族：
                              <Select
                                filterOption={(inputValue, option) =>
                                  option.label
                                    .toLowerCase()
                                    .indexOf(inputValue.toLowerCase()) >= 0
                                }
                                showSearch
                                options={nationAs}
                                onChange={handleNationChange}
                                allowClear
                                style={{ width: 120 }}
                              />
                            </Space>

                            <Form.Item
                              style={{ marginTop: "25px" }}
                              label="心理测评"
                              name="2"
                            >
                              <Select
                                disabled={true}
                                defaultValue="全部"
                                style={{
                                  width: 120,
                                }}
                                options={[
                                  {
                                    value: "合格",
                                  },
                                  {
                                    value: "不合格",
                                  },
                                ]}
                              />
                            </Form.Item>
                          </Space>
                        </Col>
                      </Row>
                    </div>
                  )}
                </div>
              </>
            )}
          </Form>
        </div>
        <div className={styles["createStaff"]}>
          <Row gutter={16}>
            {loginUserInfo.code === "SCHOOL_ADMIN" ? null : (
              <>
                <Col span={20}>
                  <Button
                    type="dashed"
                    size={"large"}
                    block
                    onClick={showNewTeacher}
                  >
                    快速创建家长账号
                  </Button>
                </Col>
                <Col span={4}>
                  <Dropdown
                    overlay={DropdownItems}
                    arrow={true}
                    trigger={["click"]}
                  >
                    <Button type="primary" icon={<SettingOutlined />}>
                      表格字段
                    </Button>
                  </Dropdown>
                  {window.$PowerUtils.judgeButtonAuth(location, '批量删除') && <Button type="primary" onClick={onMultipleDel} disabled={!selectedRows.length > 0} danger style={{margin:'0 10px'}}>一键删除</Button>}
                </Col>
              </>
            )}
          </Row>
        </div>
        <div>
          {/* 表格左侧切换 */}
          <Row gutter={[16, 0]}>
            {loginUserInfo.code == "SCHOOL_ADMIN" ? (
              <>
                <Col span={24}>
                  <Spin spinning={loading}>
                    <Table
                    rowSelection={window.$PowerUtils.judgeButtonAuth(location, '批量删除') ? rowSelection : null }
                      columns={NewColumns}
                      dataSource={listDataSource}
                      bordered
                      pagination={false}
                      scroll={{ x: TableRollingWidth + 400, y: 500 }}
                    />{" "}
                  </Spin>
                  <Pagination
                    showSizeChanger
                    onChange={onPaginationChange}
                    total={listDataTotal}
                    current={ListDataCurrentPage}
                    defaultPageSize={10}
                    showTotal={(listDataTotal) => `总计 ${listDataTotal} 人`}
                    style={{
                      marginTop: "30px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  />
                </Col>
              </>
            ) : (
              <>
                <Col span={2} className="listLeft">
                  <Radio.Group
                    style={{
                      width: "121px",
                      height: "450px",
                      overflow: "auto",
                    }}
                  >
                    <Radio.Button
                      style={{
                        width: "115px",
                        height: "80px",
                        marginTop: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onClick={allStudentData}
                    >
                      全部
                      <br />
                      {amount}人
                    </Radio.Button>
                    {newClassList}
                  </Radio.Group>
                </Col>
                <Col span={22}>
                  <Spin spinning={loading}>
                    <Table
                    rowSelection={window.$PowerUtils.judgeButtonAuth(location, '批量删除') ? rowSelection : null }
                      columns={NewColumns}
                      dataSource={listDataSource}
                      bordered
                      pagination={false}
                      scroll={{ x: TableRollingWidth + 400, y: 500 }}
                    />{" "}
                  </Spin>
                  <Pagination
                    showSizeChanger
                    onChange={onPaginationChange}
                    total={listDataTotal}
                    current={ListDataCurrentPage}
                    defaultPageSize={10}
                    showTotal={(listDataTotal) => `总计 ${listDataTotal} 人`}
                    style={{
                      marginTop: "30px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  />
                </Col>
              </>
            )}
          </Row>
        </div>
        <NewTeacher
          classList={classList}
          NewTeacherOpen={NewTeacherOpen}
          showNewTeacher={showNewTeacher}
          getTeacherList={getTeacherList}
          DetailLoading={DetailLoading}
        />
        <ParentDetails
          TeacherDetailsOpen={TeacherDetailsOpen}
          isModalOpen={isModalOpen}
          showTeacherDetails={showTeacherDetails}
          TeacherDetailId={TeacherDetailId}
          TeacherDetailIds={TeacherDetailIds}
          DetailLoading={DetailLoading}
        />
        <DelectParent innerRef={DeleteTeacherRef} getTeacherList={getTeacherList} setSelectedRows={setSelectedRows}></DelectParent>
      </div>
    </Page>
  );
}

const mapStateToProps = (state) => {
  return {
    sexOptions: state[namespace].sexOptions,
    eduCational: state[namespace].eduCational,
    situAtion: state[namespace].situAtion,
    nationAs: state[namespace].nationAs,
    ProvinceCityAddressOptions: state[namespace].ProvinceCityAddressOptions,
  };
};

export default connect(mapStateToProps)(Parents);
