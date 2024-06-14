/**
 * 学生数据
 * @author:田忆
 * date:2023年4月25日
 * */

import React, { useState, useEffect, useRef } from "react";
import { withRouter } from "react-router-dom";
import {
  Col,
  Row,
  Button,
  Select,
  Input,
  Tooltip,
  Spin,
  Space,
  Form,
  Table,
  Modal,
  Dropdown,
  Menu,
  Checkbox,
  Pagination,
  Radio,
  message,
  Upload,
  TreeSelect,
  Cascader,
} from "antd";
import {
  SettingOutlined,
  HomeOutlined,
  MailOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";

import styles from "./student.less";
import { connect } from "dva";
import { StudentData as namespace } from "@/utils/namespace";
import NewStudentDetail from "./component/newStudentDetail";
import Details from "./component/StudentDetails"; //详情页面
import DetailsCopy2 from "./component/StudentDetails copy 2"; // web端详情
import Variation from "./component/studentVariation";
import Alteration from "./component/alteration";
import NewDetails from "./component/StudentDetails copy";
import { excelType } from "@/utils/const";
import StudentMigration from "./component/StudentMigration/index"; //学生迁移
import userInfoCache from "@/caches/userInfo"; //权限组件
import AuditRecord from "./component/auditRecord";
import DeleteStudent from "./component/deleteStudent"; //删除学生

import accessTokenCache from "@/caches/accessToken";
const { confirm } = Modal;
const token = accessTokenCache() && accessTokenCache();

function student(props) {
  const loginUserInfo = userInfoCache() || {};
  const deleteStudentRef = useRef(null);
  const [StatStudentStatistics, setStatStudentStatistics] = useState({}); //存储学生完善信息
  const [ExpansionScreening, setExpansionScreening] = useState(false); //折叠显示
  const [loading, setLoading] = useState(true); //table懒加载
  const [studentList, setStudentList] = useState([]); // 学生列表数据
  const [studentTotal, setStudentTotal] = useState(""); //存储学生总人数
  const [BasicsCheckboxDefaultValues, setBasicsCheckboxDefaultValues] =
    useState([
      "id",
      "sex",
      "name",
      "account",
      "action",
      "apoce",
      "examineStatusText",
    ]); // 表格字段初始数据
  const [TableRollingWidth, setTableRollingWidth] = useState(0);
  const [NewColumns, setNewColumns] = useState([]);
  const [selectOptionsParameter, setSelectOptionsParameter] = useState({}); // 存储下拉框字段
  const [spoceList, setSpoceList] = useState([]); //存储学校学级
  const [classList, setClassList] = useState([]); // 班级列表
  const [gradeList, setGradeList] = useState([]); // 存储当前学校的年级信息
  const [studyList, setStudyList] = useState([]); //存储学段
  const [schoolData, setSchooleData] = useState([]); //存储学校学段，年级，班级信息
  const [grateStatusClass, getGrateStatusClass] = useState({});
  const [spinningAll, setSpinningAll] = useState(false); // 全屏加载
  //新建弹窗
  const [newStudentOpen, setNewStudentOpen] = useState(false);
  const [disabledCode, setDisabledCode] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]); //多选-被选中的行

  const { dispatch, DictionaryDictGroups, location } = props;

  useEffect(() => {
    if (loginUserInfo.code == "SCHOOL_ADMIN") {
      //学校管理员
      //请求班主任班级列别表
      dispatch({
        type: namespace + "/getSpoceGradeClass",
        callback: (res) => {
          // console.log(res?.result, '这是请求学校年级学段学级班级列表')
          setSchooleData(res?.result?.studyList);
          setStudyList(
            res?.result?.studyList?.map((item) => {
              return {
                value: item.id,
                label: item.name,
              };
            })
          );
          setSpoceList(
            res?.result?.spoceList.map((item) => {
              return {
                label: item.id,
                value: item.id,
              };
            })
          );
        },
      });

      setDisabledCode(true);
    }
    if (loginUserInfo.code == "CLASS_HEAD") {
      //请求班主任班级列别表
      dispatch({
        type: namespace + "/getTeacherManegeClass",

        callback: (res) => {
          // console.log(res, '这是请求班主任班级列表')
          setClassList(res?.result);
        },
      });
      //获取当前学校学级班级信息
      dispatch({
        type: namespace + "/getGrateStatusClassData",
        callback: (res) => {
          // console.log(res, '这是当前学校信息')
          if (res?.result) {
            setSpoceList(
              res?.result?.spoceList.map((item) => {
                return {
                  label: item.id,
                  value: item.id,
                };
              })
            );
          }
        },
      });
      setDisabledCode(false);
    } // 班主任

    //请求学生完善信息数据
    dispatch({
      type: namespace + "/getStudentStatistics",
      payload: {},
      callback: (res) => {
        // console.log(res, '待完善学生数据')
        if (JSON.stringify(res.result) !== "{}") {
          setStatStudentStatistics(res?.result);
        }
      },
    });

    // 请求学生分页列表数据
    dispatch({
      type: namespace + "/getStudentPageList",
      payload: { page: 1, size: 10 },
      callback: (res) => {
        setLoading(false);
        if (JSON.stringify(res.result) !== "{}") {
          setStudentList(res.result.data);
          setStudentTotal(res.result.total);
        }
        // console.log(res, '学生数据')
      },
    });
    //请求字典数据
    dispatch({
      type: namespace + "/getDictionaryDictGroups",
      payload: {
        dictCodes:
          "DICT_SEX,DICT_NATION,DICT_DISE,DICT_RELATION,DICT_EDU,DICT_WORK,DICT_STUDY_STATUS,DICT_PHYS_RESULT",
      },
      callback: (res) => {
        console.log(res, "这是字典数据");
      },
    });

    //请求当前学校年纪学籍班级信息
  }, []);

  //校级web 端详情页面
  const [studentDetailsOpen1, setStudentDetailsOpen1] = useState(false);
  const [account1, setAccount1] = useState(null); // 存储学生学籍
  const handleStudentDetails1 = (e) => {
    setAccount1(e.account);
    setStudentDetailsOpen1(!studentDetailsOpen1); // 打开详情
  };
  //关闭web详情
  const showStudentDetails1 = () => {
    setStudentDetailsOpen1(!studentDetailsOpen1);
  };

  //校级web审核记录
  const [auditRecordOpen, setAuditRecordOpen] = useState(false);
  const [account2, setAccount2] = useState(null); // 存储学生学籍
  const [examineStatus1, setExamineStatus1] = useState(null);
  const handleAlteration1 = (e) => {
    setAccount2(e.stuIdentityCard);
    setExamineStatus1(e.examineStatus);
    setAuditRecordOpen(!auditRecordOpen);
  };
  const showAuditRecord = () => {
    setAuditRecordOpen(!auditRecordOpen);
  };

  const showNewStudent = () => {
    setNewStudentOpen(!newStudentOpen);
    getStudentList(currentPage, currentSize, selectOptionsParameter);
  };
  //详情弹窗
  const [account, setAccount] = useState(null); // 存储学生学籍
  const [examineStatus, setExamineStatus] = useState(null);
  const [studentDetailsOpen, setStudentDetailsOpen] = useState(false);
  const handleStudentDetails = (e) => {
    // console.log(e, '1234')
    setAccount(e.account);
    setExamineStatus(e.examineStatus);
    setStudentDetailsOpen(!studentDetailsOpen);
  };
  //修改弹窗
  const [variationAccount, setVariationAccount] = useState(null);
  const [studentVariationOpen, setStudentVariationOpen] = useState(false);
  const handleVariation = (e) => {
    setVariationAccount(e.account);
    setStudentVariationOpen(!studentVariationOpen);
  };
  //变动弹窗
  const [alterationAccount, setAlterationAccount] = useState(null);
  const [alterationOpen, setAlterationOpen] = useState(false);
  const handleAlteration = (e) => {
    setAlterationAccount(e);
    setAlterationOpen(!alterationOpen);
  };

  // 确认删除弹窗
  const deleteDataStudent = (record) => {
    confirm({
      title: "删除提示",
      icon: <ExclamationCircleOutlined />,
      content: (
        <>
          {Array.isArray(record) ? (
            <div>您确定要进行批量删除操作吗？</div>
          ) : (
            <div>
              您确定要删除名为{" "}
              <span style={{ color: "#1890ff", margin: "10px 0 0 0" }}>
                {record.name}
              </span>{" "}
              的学生吗？
            </div>
          )}
          <div style={{ fontWeight: 800, margin: "10px 0 0 0" }}>
            该删除操作不可逆。
          </div>
        </>
      ),
      okType: "danger",
      onOk() {
        deleteStudentRef.current.showDeleteStudent(record);
      },
    });
  };

  // rowSelection对象表示需要行选择
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(selectedRowKeys, selectedRows);
      setSelectedRows(selectedRows);
    },
  };
  // 多选删除
  const onMultipleDel = () => {
    deleteDataStudent(selectedRows);
  };

  //审核弹窗
  const [studentDetailsCopyOpen, setStudentDetailsCopyOpen] = useState(false);
  const handleNewStudentDetails = (e) => {
    // console.log(e.examineStatus, '这是传过去的数据')
    setAccount(e.account);
    setExamineStatus(e.examineStatus);
    setStudentDetailsCopyOpen(!studentDetailsCopyOpen);
  };

  //迁移学生抽槽
  const [topDrawerVisible, setTopDrawerVisible] = useState(false);
  const topDrawerIncident = () => {
    setTopDrawerVisible(!topDrawerVisible);
    getStudentList(currentPage, currentSize, selectOptionsParameter);
    dispatch({
      type: namespace + "/getStudentStatistics",
      payload: { classId: classId },
      callback: (res) => {
        // console.log(res, '待完善学生数据')
        if (JSON.stringify(res.result) !== "{}") {
          setStatStudentStatistics(res?.result);
        }
      },
    });
  };

  const showStudentDetails = () => {
    setStudentDetailsOpen(!studentDetailsOpen);
  };
  const showStudentVariation = () => {
    setStudentVariationOpen(!studentVariationOpen);
    getStudentList(currentPage, currentSize, selectOptionsParameter);
  };
  const showAlteration = () => {
    setAlterationOpen(!alterationOpen);
    getStudentList(currentPage, currentSize, {
      ...selectOptionsParameter,
      classId: classId,
    });
    //请求班主任班级列别表
  };
  const showStudentDetailsCopy = () => {
    setStudentDetailsCopyOpen(!studentDetailsCopyOpen);
    // console.log(studentDetailsOpen)
    getStudentList(currentPage, currentSize, selectOptionsParameter);
  };

  const getStudentList = (currentPage, currentSize, value) => {
    setLoading(true);
    // 请求学生分页列表数据
    dispatch({
      type: namespace + "/getStudentPageList",
      payload: { page: currentPage, size: currentSize, ...value },
      callback: (res) => {
        setLoading(false);
        // console.log(res.result, '学生列表数据')
        if (JSON.stringify(res?.result) !== "{}") {
          setStudentList(res?.result?.data);
          setStudentTotal(res?.result?.total);
          setCurrentPage(res?.result?.currentPage);
        }
      },
    });
    dispatch({
      type: namespace + "/getTeacherManegeClass",
      payload: { spoce: spoceId },
      callback: (res) => {
        // console.log(res, '这是请求班主任班级列表')
        setClassList(res?.result);
      },
    });
    // dispatch({
    //   type: namespace + "/getStudentStatistics",
    //   payload: {},
    //   callback: (res) => {
    //     // console.log(res, '待完善学生数据')
    //     if (JSON.stringify(res.result) !== '{}') {
    //       setStatStudentStatistics(res?.result)
    //     }
    //   }
    // })
  };
  useEffect(() => {
    setSelectOptionsParameter(selectOptionsParameter);
    getStudentList(currentPage, currentSize, selectOptionsParameter);
    // console.log(selectOptionsParameter, '字段')
  }, [selectOptionsParameter]);

  //下拉框

  const sexOptions = DictionaryDictGroups?.find(
    (item) => item.dictCode === "DICT_SEX"
  )?.dictItems?.map((item) => {
    return { value: item.itemValue, label: item.itemText };
  });
  const examineStatusOptions = [
    {
      label: "待完善",
      value: 1,
    },
    {
      label: "未审核",
      value: 2,
    },
    {
      label: "已通过",
      value: 3,
    },
    {
      label: "已驳回",
      value: 4,
    },
    {
      label: "待提交复核",
      value: 5,
    },
    {
      label: "待复核",
      value: 6,
    },
  ];
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
  const physicalOptions = DictionaryDictGroups?.find(
    (item) => item.dictCode === "DICT_PHYS_RESULT"
  )?.dictItems.map((item) => {
    return { value: item.itemValue, label: item.itemText };
  });
  //下拉框事件
  //点击学级联动学生与班级信息
  const [spoceId, setSpoce] = useState("");

  // useEffect(() => {

  //   dispatch({
  //     type: namespace + "/getTeacherManegeClass",
  //     payload: { spoce: spoceId },
  //     callback: (res) => {
  //       console.log(res, '这是点击学级时班主任班级列表')
  //       if (res.result == []) {
  //         setClassList([])
  //       } else {

  //         setClassList(res?.result)
  //       }
  //     }
  //   })

  // }, [spoceId])
  const [classOptions1, setClassOptions1] = useState([]); // 存储班级下拉框
  const handleClassChange = (value) => {
    setSpoce(value);
    setClassOptions1([]);
    setClassLabel(null);
    if (loginUserInfo.code == "SCHOOL_ADMIN") {
      //学校管理员
      dispatch({
        type: namespace + "/getSpoceGradeClass",
        payload: { spoceId: value },
        callback: (res) => {
          const tem = res.result?.studyList
            ?.map((item) => {
              return {
                label: item.name,
                value: item.name,
                children: item.stuGradeList
                  ?.filter((e) => e.stuCalssList.length != 0)
                  .map((item1) => {
                    return {
                      label: item1.name,
                      value: item1.name,
                      children: item1.stuCalssList?.map((item2) => {
                        return {
                          label: item2.name,
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
    // if (loginUserInfo.code == 'CLASS_HEAD') { //班主任

    //   //请求班主任班级列别表
    //   dispatch({
    //     type: namespace + "/getTeacherManegeClass",
    //     payload: { spoce: value },
    //     callback: (res) => {
    //
    //       setClassList(res?.result)
    //     }
    //   })
    // }

    setSelectOptionsParameter({
      ...selectOptionsParameter,
      spoce: value,
      classId: null,
    });
  };
  const handleSexChange = (value) => {
    setCurrentPage(1);
    setSelectOptionsParameter({ ...selectOptionsParameter, sex: value });
  };

  const handleExamineStatusChange = (value) => {
    setCurrentPage(1);
    setSelectOptionsParameter({
      ...selectOptionsParameter,
      examineStatus: value,
    });
  };

  const handleIsDiseaseChange = (value) => {
    setSelectOptionsParameter({ ...selectOptionsParameter, isDisease: value });
  };
  const handleNationNameChange = (value) => {
    setSelectOptionsParameter({ ...selectOptionsParameter, nationId: value });
  };
  //输入框事件
  const handleNameChange = (e) => {
    setSelectOptionsParameter({
      ...selectOptionsParameter,
      userName: e.target.value,
    });
    getStudentList(currentPage, currentSize, selectOptionsParameter);
  };
  //输入框改变事件
  const handleNameInput = (e) => {
    setCurrentPage(1);
    if (e.target.value == "") {
      setSelectOptionsParameter({
        ...selectOptionsParameter,
        userName: undefined,
      });
    } else {
      setSelectOptionsParameter({
        ...selectOptionsParameter,
        userName: e.target.value,
      });
    }
  };
  //点击事件
  const handleSearch = () => {
    getStudentList(currentPage, currentSize, selectOptionsParameter);
  };
  //学籍框
  const handleAccountChange = (e) => {
    setCurrentPage(1);
    setCurrentSize(10);
    setSelectOptionsParameter({
      ...selectOptionsParameter,
      account: e.target.value,
    });
  };
  const handleAccountInput = (e) => {
    if (e.target.value == "") {
      setSelectOptionsParameter({
        ...selectOptionsParameter,
        account: undefined,
      });
    } else {
      setSelectOptionsParameter({
        ...selectOptionsParameter,
        account: e.target.value,
      });
    }
  };

  // 一键督促完善
  const UrgeImproveSuccess = () => {
    dispatch({
      type: namespace + "/getPushFinishStudentMes",
      callback: (res) => {
        Modal.success({
          title: "督促完善成功提示",
          content: (
            <div>
              <p>
                已成功向 {StatStudentStatistics?.incompleteNumber}{" "}
                未完善信息学生发送完善信息提示！
              </p>
            </div>
          ),
        });
      },
    });
  };

  //存储班级ID
  const [classId, setClassId] = useState("");
  //点击班级
  const classOnChange = (id) => {
    // console.log(id, "点击的班级的id")
    setClassId(id);
    dispatch({
      type: namespace + "/getStudentStatistics",
      payload: {
        //动态传入id,后面修改
        classId: id,
      },
      callback: (res) => {
        if (JSON.stringify(res.result) !== "{}") {
          setStatStudentStatistics(res?.result);
        }
      },
    });
    setCurrentPage(1);
    setCurrentSize(10);
    setSelectOptionsParameter({ ...selectOptionsParameter, classId: id });
    // getStudentList(1, 10, { ...selectOptionsParameter, classId: id })
  };

  //班级渲染
  const newClassList =
    classList &&
    classList?.map((item) => {
      return (
        <Radio.Button
          onClick={() => classOnChange(item.id)}
          value={item.id}
          key={item.id}
        >
          <Tooltip title={() => item.name}>
            <p
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {item.name} <br /> {item.studentClassPersonNum}人
            </p>
          </Tooltip>
        </Radio.Button>
      );
    });

  // console.log(newClassList, "这是渲染的班级")

  //点击全部按钮获取班级数据
  const allStudentData = () => {
    //请求学生完善信息数据
    setClassId(null);
    dispatch({
      type: namespace + "/getStudentStatistics",
      payload: {},
      callback: (res) => {
        if (JSON.stringify(res.result) !== "{}") {
          setStatStudentStatistics(res?.result);
        }
      },
    });
    setCurrentPage(1);
    setCurrentSize(10);
    setSelectOptionsParameter({ ...selectOptionsParameter, classId: null });
  };

  // 表格分页
  const [currentPage, setCurrentPage] = useState(1); // 当前页
  const [currentSize, setCurrentSize] = useState(10);
  const onPaginationChange = (page, size) => {
    setSelectedRows([]);
    getStudentList(page, size, selectOptionsParameter);
    setCurrentPage(page);
    setCurrentSize(size);
  };

  // 展开/折叠更多筛选
  const onExpansionScreening = () => {
    setExpansionScreening(!ExpansionScreening);
  };

  //表格字段下拉菜单
  const basicsOptions = [
    { label: "序号", value: "id", disabled: true },
    { label: "姓名", value: "name", disabled: true },
    { label: "性别", value: "sex" },
    { label: "特异体质", value: "isDisease" },
    { label: "学籍号", value: "account" },
    { label: "民族", value: "nationName" },
    { label: "班级", value: "className" },
    { label: "年级", value: "gradeName" },
    { label: "届别", value: "spoce" },
    { label: "疾病名称", value: "diseaseName" },
    { label: "审核状态", value: "examineStatusText", disabled: true },
    { label: "操作", value: "action", disabled: true },
  ];

  const onBasicsCheckboxChange = (checkedValues) => {
    // console.log(checkedValues, '字段筛选')
    setBasicsCheckboxDefaultValues(checkedValues);
    setNewColumns(
      columns.filter((item) => BasicsCheckboxDefaultValues.includes(item.key))
    );
    setTableRollingWidth(
      columns
        .filter((item) => BasicsCheckboxDefaultValues.includes(item.key))
        .map((item) => item.width)
        .reduce((prev, cur) => prev + cur)
    );
  };
  useEffect(() => {
    setNewColumns(
      columns.filter((item) => BasicsCheckboxDefaultValues.includes(item.key))
    );
    setTableRollingWidth(
      columns
        .filter((item) => BasicsCheckboxDefaultValues.includes(item.key))
        .map((item) => item.width)
        .reduce((prev, cur) => prev + cur)
    );
  }, [BasicsCheckboxDefaultValues]);
  useEffect(() => {
    setNewColumns(
      columns.filter((item) => BasicsCheckboxDefaultValues.includes(item.key))
    );
    setTableRollingWidth(
      columns
        .filter((item) => BasicsCheckboxDefaultValues.includes(item.key))
        .map((item) => item.width)
        .reduce((prev, cur) => prev + cur)
    );
  }, [currentPage]);
  // 表格字段筛选
  const DropdownItems = (
    <Menu multiple={true} forceSubMenuRender={true} className="DropdownPopup">
      <Menu.SubMenu title="基础信息" key="foundation" icon={<HomeOutlined />}>
        <Checkbox.Group
          options={basicsOptions}
          defaultValue={BasicsCheckboxDefaultValues}
          onChange={onBasicsCheckboxChange}
        />
      </Menu.SubMenu>
      <Menu.SubMenu
        title="体检信息"
        key="FileInformation"
        disabled
        icon={<MailOutlined />}
      >
        <Checkbox.Group />
      </Menu.SubMenu>
    </Menu>
  );

  //表格头部字段
  const columns = [
    {
      title: "序号",
      key: "id",
      width: 50,
      fixed: "left",
      render: (text, record, index) =>
        (currentPage - 1) * currentSize + index + 1,
    },
    {
      title: "学生姓名",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      width: 100,
    },
    {
      title: "性别",
      dataIndex: "sex",
      key: "sex",
      width: 50,
    },
    {
      title: "学籍号",
      dataIndex: "account",
      key: "account",
      width: 200,
    },
    // {
    //   title: '身份证号',
    //   dataIndex: 'stuIdentityCard',
    //   key: 'stuIdentityCard',
    //   width: 200
    // },
    {
      title: "届别",
      dataIndex: "spoce",
      key: "spoce",
      width: 100,
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
      width: 100,
    },
    {
      title: "民族",
      dataIndex: "nationName",
      key: "nationName",
      width: 100,
    },
    {
      title: "特异体质",
      dataIndex: "isDisease",
      key: "isDisease",
      width: 100,
    },
    {
      title: "病状名称",
      dataIndex: "diseaseName",
      key: "diseaseName",
      width: 100,
    },
    {
      title: "审核状态",
      dataIndex: "examineStatusText",
      width: 100,
      key: "examineStatusText",
      // render: (examineStates) => {
      //   let x = ''
      //   switch (examineStates) {
      //     case 1: x = '待完善'
      //       break;
      //     case 2: x = '未审核';
      //       break;
      //     case 3: x = '已通过'
      //       break;
      //     case 4: x = '已驳回';
      //       break;
      //     case 5: x = '待提交复核';
      //       break;
      //     case 6: x = '待复核';
      //       break;
      //     default: x = ''
      //   }
      //   return x
      // }
    },
    {
      title: "操作",
      key: "action",
      width: 250,
      fixed: "right",
      render: (_, record) => {
        if (loginUserInfo.code == "CLASS_HEAD") {
          return (
            <Row>
              <Col span={6}>
                {record.examineStatus == "2" ||
                record.examineStatus == "6" ||
                record.examineStatus == "5"
                  ? window.$PowerUtils.judgeButtonAuth(location, "审核") && (
                      <Button
                        type="link"
                        onClick={() => handleNewStudentDetails(record)}
                      >
                        审核
                      </Button>
                    )
                  : window.$PowerUtils.judgeButtonAuth(location, "查看") && (
                      <Button
                        type="link"
                        onClick={() => handleStudentDetails(record)}
                      >
                        更多详情
                      </Button>
                    )}
              </Col>
              <Col span={6}>
                {window.$PowerUtils.judgeButtonAuth(location, "编辑") && (
                  <Button type="link" onClick={() => handleVariation(record)}>
                    修改
                  </Button>
                )}
              </Col>
              <Col span={6}>
                {window.$PowerUtils.judgeButtonAuth(location, "变动") && (
                  <Button type="link" onClick={() => handleAlteration(record)}>
                    变动
                  </Button>
                )}
              </Col>
              <Col span={6}>
                {window.$PowerUtils.judgeButtonAuth(location, "删除") && (
                  <Button type="link" onClick={() => deleteDataStudent(record)}>
                    删除
                  </Button>
                )}
              </Col>
            </Row>
          );
        }
        if (loginUserInfo.code == "SCHOOL_ADMIN") {
          return (
            <Row>
              <Col span={8}>
                {window.$PowerUtils.judgeButtonAuth(location, "查看") && (
                  <Button
                    type="link"
                    onClick={() => handleStudentDetails1(record)}
                  >
                    更多详情
                  </Button>
                )}
              </Col>
              <Col span={8}>
                {window.$PowerUtils.judgeButtonAuth(location, "审核记录") && (
                  <Button type="link" onClick={() => handleAlteration1(record)}>
                    审核记录
                  </Button>
                )}
              </Col>
              <Col span={8}>
                {window.$PowerUtils.judgeButtonAuth(location, "删除") && (
                  <Button type="link" onClick={() => deleteDataStudent(record)}>
                    删除
                  </Button>
                )}
              </Col>
            </Row>
          );
        }
      },
    },
  ];

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

    var headers = option.headers || {}; // when set headers['X-Requested-With'] = null , can close default XHR header
    // see https://github.com/react-component/upload/issues/33

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

  //   批量导入上传组件配置信息
  const UploadProps = {
    name: "file",
    action: "/auth/web/v1/familyMes/importStudentMes",
    data: grateStatusClass[0],
    headers: { Authorization: token },
    accept:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,multipart/form-data ", //指定选择文件框默认文件类型(.xls/.xlsx)
    onChange(info) {
      //正在上传.
      // console.log(info, '123')
      if (info.file.status === "uploading") {
        setLoading(true);
      }
      if (info.file.status === "done") {
        if (info.file.response.type == "application/json") {
          const reader = new FileReader();
          reader.readAsText(info.file.response);
          reader.onload = function (event) {
            const jsonData = JSON.parse(event.target.result);
            // console.log(jsonData);
            if (jsonData.code == 200) {
              message.success("学生数据导入成功！");
              getStudentList(currentPage, currentSize, selectOptionsParameter);
              //请求学生完善信息数据
              dispatch({
                type: namespace + "/getStudentStatistics",
                payload: { classId: classId },
                callback: (res) => {
                  // console.log(res, '待完善学生数据')
                  if (JSON.stringify(res.result) !== "{}") {
                    setStatStudentStatistics(res?.result);
                  }
                },
              });
              setLoading(false);
            } else {
              message.error("学生数据导入失败！");
              setLoading(false);
            }
          };
        } else {
          const blob = new Blob([info.file.response], {
            type: "application/vnd.ms-excel",
          });
          const a = document.createElement("a"); // 转换完成，创建一个a标签用于下载
          a.download = "学生信息导入反馈";
          a.href = URL.createObjectURL(blob);
          a.click();
          a.remove();
          setLoading(false);
          message.error(
            "学生数据导入失败原因已下载，请打开Excel查看具体原因！"
          );
        }
      } else if (info.file.status === "error") {
        setLoading(false);
        message.error(`${info.file.name} 上传出错`);
      }
    },
  };

  const UploadClick = (e) => {
    // console.log(e)
    getGrateStatusClass(
      classList
        ?.filter((item) => item.id == e.key)
        .map((item) => {
          return {
            classId: item.id,
            className: item.anotherName,
            gradeName: item.gradeName,
          };
        })
    );
  };

  // 批量导出
  const onBatchDerive = (e) => {
    const tem = classList?.filter((item) => item.id == e.key);
    // console.log(tem)
    const a = NewColumns.filter(
      (item) => item.key !== "id" && item.key !== "action"
    ).map((item) => {
      return {
        key: item.key,
        name: item.title,
      };
    });
    // console.log(columns, '表头')
    // console.log(NewColumns, '新表头')
    // console.log(a, '字段')
    // console.log(b, '字段')
    confirm({
      title: "导出提示",
      icon: <ExclamationCircleOutlined />,
      content: "您即将导出的学生数据为表格字段中所选中的字段!",
      onOk() {
        setSpinningAll(true);
        function request() {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", "/auth/web/v1/familyMes/exportStudentMes", true);
          xhr.responseType = "blob"; // 包装返回数据格式, 打印出来是 Blob 格式的数据，不是乱码的文本
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.setRequestHeader("Authorization", token);
          xhr.onload = function () {
            // console.log(xhr, '这是xhr')
            // console.log(xhr.response, '这是响应的')
            download(xhr.response);
            setSpinningAll(false);
          };
          xhr.send(
            JSON.stringify({
              ...selectOptionsParameter,
              classId: e.key == "key" ? null : e.key,
              columns: a,
            })
          );
        }

        function download(blobUrl) {
          const xlsx = "application/vnd.ms-excel;charset=UTF-8";
          const blob = new Blob([blobUrl], { type: xlsx });
          // console.log(blob, '这是blob')
          const a = document.createElement("a"); // 转换完成，创建一个a标签用于下载
          a.download =
            e.key == "key" ? "导出全部学生数据" : `${tem[0].name}学生数据.xls`;
          //  a.download = '学生批量导出数据.xls'
          a.href = window.URL.createObjectURL(blob);
          a.click();
          a.remove();
          if (e.key == "key") {
            message.success("全部学生数据已下载");
          } else {
            message.success(`${tem[0].name}学生数据已下载`);
          }
        }
        request();
      },
      onCancel() {},
    });
  };

  //导入
  const toChannel = (
    <Menu>
      {classList?.map((item) => {
        return (
          <Menu.Item key={item.id} onClick={UploadClick}>
            {/* {item.name} */}
            <Upload
              {...UploadProps}
              beforeUpload={beforeUpload}
              showUploadList={false}
              customRequest={customRequest}
            >
              {item.name}
            </Upload>
          </Menu.Item>
        );
      })}
    </Menu>
  );
  //管理员导入
  const toChannelAdmin = {
    name: "file",
    action: "/auth/web/v1/familyMes/importStudentMes",
    headers: { Authorization: token },
    accept:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,multipart/form-data ", //指定选择文件框默认文件类型(.xls/.xlsx)
    onChange(info) {
      //正在上传.
      // console.log(info, '123')
      if (info.file.status === "uploading") {
        setLoading(true);
      }
      if (info.file.status === "done") {
        if (info.file.response.type == "application/json") {
          const reader = new FileReader();
          reader.readAsText(info.file.response);
          reader.onload = function (event) {
            const jsonData = JSON.parse(event.target.result);
            // console.log(jsonData);
            if (jsonData.code == 200) {
              message.success("学生数据导入成功！");
              getStudentList(currentPage, currentSize, selectOptionsParameter);

              //请求学生完善信息数据
              dispatch({
                type: namespace + "/getStudentStatistics",
                payload: {},
                callback: (res) => {
                  // console.log(res, '待完善学生数据')
                  if (JSON.stringify(res.result) !== "{}") {
                    setStatStudentStatistics(res?.result);
                  }
                },
              });
              setLoading(false);
            } else {
              message.error("学生数据导入失败！");
              setLoading(false);
            }
          };
        } else {
          const blob = new Blob([info.file.response], {
            type: "application/vnd.ms-excel",
          });
          const a = document.createElement("a"); // 转换完成，创建一个a标签用于下载
          a.download = "学生信息导入反馈";
          a.href = URL.createObjectURL(blob);
          a.click();
          a.remove();
          setLoading(false);
          message.error(
            "学生数据导入失败原因已下载，请打开Excel查看具体原因！"
          );
        }
      } else if (info.file.status === "error") {
        setLoading(false);
        message.error(`${info.file.name} 上传出错`);
      }
    },
  };

  // 导出
  const ExportData = () => {
    return (
      <Menu>
        <Menu.Item key="key" onClick={onBatchDerive}>
          全部
        </Menu.Item>
        {classList?.map((item) => {
          return (
            <Menu.Item key={item.id} onClick={onBatchDerive}>
              {item.name}
            </Menu.Item>
          );
        })}
      </Menu>
    );
  };

  const amount = classList?.reduce((ageSum, cur) => {
    return ageSum + cur.studentClassPersonNum;
  }, 0);

  //校级web端

  //导出
  const handleExportData = () => {
    const a = NewColumns.filter(
      (item) => item.key !== "id" && item.key !== "action"
    ).map((item) => {
      return {
        key: item.key,
        name: item.title,
      };
    });
    // console.log(columns, '表头')
    // console.log(NewColumns, '新表头')
    // console.log(a, '字段')
    // // console.log(b, '字段')
    confirm({
      title: "导出提示",
      icon: <ExclamationCircleOutlined />,
      content: "您即将导出的学生数据为表格字段中所选中的字段!",
      onOk() {
        setSpinningAll(true);
        function request() {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", "/auth/web/v1/familyMes/exportStudentMes", true);
          xhr.responseType = "blob"; // 包装返回数据格式, 打印出来是 Blob 格式的数据，不是乱码的文本
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.setRequestHeader("Authorization", token);
          xhr.onload = function () {
            // console.log(xhr, '这是xhr')
            // console.log(xhr.response, '这是响应的')
            download(xhr.response);
            setSpinningAll(false);
          };
          xhr.send(
            JSON.stringify({
              ...selectOptionsParameter,
              classId: classId ? classId : null,
              columns: a,
            })
          );
        }

        function download(blobUrl) {
          const xlsx = "application/vnd.ms-excel;charset=UTF-8";
          const blob = new Blob([blobUrl], { type: xlsx });
          // console.log(blob, '这是blob')
          const a = document.createElement("a"); // 转换完成，创建一个a标签用于下载
          a.download = `学生数据.xls`;
          //  a.download = '学生批量导出数据.xls'
          a.href = window.URL.createObjectURL(blob);
          a.click();
          a.remove();
          message.success(`学生数据已下载`);
        }
        request();
      },
      onCancel() {},
    });
  };
  //班级联结下拉框
  const [classLabel, setClassLabel] = useState(null);
  const classStudentData1 = (value, label) => {
    setCurrentPage(1);
    setClassLabel(value);
    console.log(value, "=>班级");
    setClassId(value ? value[value.length - 1] : null);
    setSelectOptionsParameter({
      ...selectOptionsParameter,
      classId: value ? value[value.length - 1] : null,
    });
  };

  //下载批量导入模板
  const ImportTemplate = () => {
    function request() {
      const xhr = new XMLHttpRequest();
      xhr.open(
        "GET",
        "/auth/web/v1/familyMes/downloadStuAndFamilyMesTemple?flag=0",
        true
      );
      xhr.responseType = "blob"; // 包装返回数据格式, 打印出来是 Blob 格式的数据，不是乱码的文本
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Authorization", token);
      xhr.onload = function () {
        // console.log(xhr, '这是xhr')
        // console.log(xhr.response, '这是响应的')
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
      // console.log(blob, '这是blob')
      const a = document.createElement("a"); // 转换完成，创建一个a标签用于下载
      a.download = `学生模板.xls`;
      a.href = window.URL.createObjectURL(blob);
      a.click();
      a.remove();
      message.success(`学生模板已下载`);
    }

    request();
  };

  const displayRender = (labels) => {
    if (!classLabel) {
      return null; // 清空时不显示任何内容
    }
    return labels[labels.length - 1]; // 显示子节点的标签
  };

  return (
    <Spin spinning={spinningAll} size="large">
      <div id={styles["studentData"]}>
        {/* 头部 */}
        <div className={styles["header"]}>
          <div className={styles["left"]}>
            <p>
              已完善资料学生人数：{StatStudentStatistics?.completedNumber} 人
            </p>
            <p>
              未完善资料学生人数：{StatStudentStatistics?.incompleteNumber}人
            </p>
            {window.$PowerUtils.judgeButtonAuth(location, "督促") && (
              <Button type="primary" onClick={UrgeImproveSuccess}>
                一键督促完善
              </Button>
            )}
          </div>
          <div className={styles["right"]}>
            <Space>
              {window.$PowerUtils.judgeButtonAuth(location, "迁移") && (
                <Button
                  type="link"
                  onClick={() => {
                    setTopDrawerVisible(!topDrawerVisible);
                  }}
                >
                  迁移学生
                </Button>
              )}

              {window.$PowerUtils.judgeButtonAuth(location, "下载模板") && (
                <Button type="link" onClick={ImportTemplate}>
                  下载批量导入模板
                </Button>
              )}

              {loginUserInfo.code == "SCHOOL_ADMIN" ? (
                <>
                  {window.$PowerUtils.judgeButtonAuth(location, "批量导入") && (
                    <Upload
                      {...toChannelAdmin}
                      beforeUpload={beforeUpload}
                      showUploadList={false}
                      customRequest={customRequest}
                    >
                      <Button type="link">批量导入</Button>
                    </Upload>
                  )}
                  {window.$PowerUtils.judgeButtonAuth(location, "批量导出") && (
                    <Button type="link" onClick={handleExportData}>
                      批量导出
                    </Button>
                  )}
                </>
              ) : (
                <>
                  {window.$PowerUtils.judgeButtonAuth(location, "批量导入") && (
                    <Dropdown overlay={toChannel}>
                      <Button type="link">批量导入</Button>
                    </Dropdown>
                  )}
                  {window.$PowerUtils.judgeButtonAuth(location, "批量导入") && (
                    <Dropdown overlay={ExportData}>
                      <Button type="link">批量导出</Button>
                    </Dropdown>
                  )}
                </>
              )}
            </Space>
          </div>
        </div>
        {/* 筛选 */}
        <div className={styles["screening"]}>
          {loginUserInfo.code == "SCHOOL_ADMIN" ? (
            <>
              <Row>
                <Col span={22}>
                  <Row>
                    <Col span={3}>
                      届别：
                      <Select
                        showSearch
                        optionFilterProp="label"
                        options={spoceList}
                        onChange={handleClassChange}
                        allowClear
                        style={{ width: 80 }}
                        getCalendarContainer={(triggerNode) =>
                          triggerNode.parentNode
                        }
                      />
                    </Col>
                    <Col span={6}>
                      年级：
                      <Cascader
                        showSearch
                        allowClear
                        value={classLabel}
                        options={classOptions1}
                        displayRender={displayRender}
                        onChange={classStudentData1}
                        style={{ width: 200 }}
                      ></Cascader>
                    </Col>
                    <Col span={4}>
                      姓名：{" "}
                      <Input
                        onPressEnter={handleNameChange}
                        onChange={handleNameInput}
                        placeholder="请输入姓名"
                        style={{ width: 120 }}
                      />
                    </Col>
                    <Col span={3}>
                      性别：
                      <Select
                        showSearch
                        optionFilterProp="label"
                        options={sexOptions}
                        onChange={handleSexChange}
                        allowClear
                        style={{ width: 80 }}
                        getCalendarContainer={(triggerNode) =>
                          triggerNode.parentNode
                        }
                      />
                    </Col>

                    <Col span={5}>
                      审核情况：
                      <Select
                        showSearch
                        optionFilterProp="label"
                        options={examineStatusOptions}
                        onChange={handleExamineStatusChange}
                        allowClear
                        style={{ width: 150 }}
                        getCalendarContainer={(triggerNode) =>
                          triggerNode.parentNode
                        }
                      />{" "}
                    </Col>
                    <Col span={1}>
                      <Button onClick={handleSearch}>搜索</Button>
                    </Col>
                  </Row>
                </Col>
                <Col span={2}>
                  <Button
                    type="link"
                    onClick={onExpansionScreening}
                    icon={
                      ExpansionScreening ? <UpOutlined /> : <DownOutlined />
                    }
                  >
                    更多筛选
                  </Button>
                </Col>
              </Row>
              {ExpansionScreening && (
                <div style={{ margin: "20px 0 0 0" }}>
                  <Row>
                    <Col span={4}>
                      民族：
                      <Select
                        showSearch
                        optionFilterProp="label"
                        options={nationNameOptions}
                        onChange={handleNationNameChange}
                        allowClear
                        style={{ width: 120 }}
                        getCalendarContainer={(triggerNode) =>
                          triggerNode.parentNode
                        }
                      />{" "}
                    </Col>
                    <Col span={5}>
                      特异体质：
                      <Select
                        showSearch
                        optionFilterProp="label"
                        options={isDiseaseOptions}
                        onChange={handleIsDiseaseChange}
                        allowClear
                        style={{ width: 120 }}
                        getCalendarContainer={(triggerNode) =>
                          triggerNode.parentNode
                        }
                      />
                    </Col>
                    <Col span={5}>
                      学籍号：
                      <Input
                        onPressEnter={handleAccountChange}
                        onChange={handleAccountInput}
                        placeholder="请输入学籍号"
                        style={{ width: 200 }}
                      />{" "}
                    </Col>
                  </Row>
                </div>
              )}
            </>
          ) : (
            <>
              <Row>
                <Col span={22}>
                  <Row size={[8, 16]} wrap>
                    <Col span={3}>
                      届别：
                      <Select
                        showSearch
                        optionFilterProp="label"
                        options={spoceList}
                        onChange={handleClassChange}
                        allowClear
                        style={{ width: 80 }}
                        getCalendarContainer={(triggerNode) =>
                          triggerNode.parentNode
                        }
                      />
                    </Col>
                    <Col span={5}>
                      姓名：{" "}
                      <Input
                        onPressEnter={handleNameChange}
                        onChange={handleNameInput}
                        placeholder="请输入姓名"
                        style={{ width: 150 }}
                      />
                    </Col>
                    <Col span={3}>
                      性别：
                      <Select
                        options={sexOptions}
                        onChange={handleSexChange}
                        allowClear
                        style={{ width: 80 }}
                        getCalendarContainer={(triggerNode) =>
                          triggerNode.parentNode
                        }
                      />
                    </Col>
                    <Col span={5}>
                      审核情况：
                      <Select
                        showSearch
                        optionFilterProp="label"
                        options={examineStatusOptions}
                        onChange={handleExamineStatusChange}
                        allowClear
                        style={{ width: 120 }}
                        getCalendarContainer={(triggerNode) =>
                          triggerNode.parentNode
                        }
                      />{" "}
                    </Col>
                    <Col span={6}>
                      学籍号：
                      <Input
                        onPressEnter={handleAccountChange}
                        onChange={handleAccountInput}
                        placeholder="请输入学籍号"
                        style={{ width: 200 }}
                      />{" "}
                    </Col>
                    <Col span={1}>
                      <Button onClick={handleSearch}>搜索</Button>
                    </Col>
                  </Row>
                </Col>
                <Col span={2}>
                  <Button
                    type="link"
                    onClick={onExpansionScreening}
                    icon={
                      ExpansionScreening ? <UpOutlined /> : <DownOutlined />
                    }
                  >
                    更多筛选
                  </Button>
                </Col>
              </Row>
              {ExpansionScreening && (
                <div style={{ margin: "20px 0 0 0" }}>
                  <Row>
                    <Col span={5}>
                      特异体质：
                      <Select
                        options={isDiseaseOptions}
                        onChange={handleIsDiseaseChange}
                        allowClear
                        style={{ width: 120 }}
                        getCalendarContainer={(triggerNode) =>
                          triggerNode.parentNode
                        }
                      />
                    </Col>

                    <Col span={5}>
                      民族：
                      <Select
                        showSearch
                        optionFilterProp="label"
                        options={nationNameOptions}
                        onChange={handleNationNameChange}
                        allowClear
                        style={{ width: 120 }}
                        getCalendarContainer={(triggerNode) =>
                          triggerNode.parentNode
                        }
                      />{" "}
                    </Col>
                  </Row>
                </div>
              )}
            </>
          )}
        </div>
        {/* 创建 */}
        <div className={styles["createStaff"]}>
          <Row gutter={16}>
            <Col span={18}>
              {window.$PowerUtils.judgeButtonAuth(location, "添加") && (
                <Button
                  type="dashed"
                  size={"large"}
                  block
                  onClick={showNewStudent}
                  disabled={disabledCode}
                >
                  创建学生学籍
                </Button>
              )}
            </Col>
            <Col span={6}>
              <Dropdown
                overlay={DropdownItems}
                arrow={true}
                trigger={["click"]}
              >
                <Button type="primary" icon={<SettingOutlined />}>
                  表格字段
                </Button>
              </Dropdown>
              {window.$PowerUtils.judgeButtonAuth(location, "批量删除") && (
                <Button
                  type="primary"
                  onClick={onMultipleDel}
                  disabled={!selectedRows.length > 0}
                  danger
                  style={{ margin: "0 10px" }}
                >
                  一键删除
                </Button>
              )}
            </Col>
          </Row>
        </div>
        {/* 列表 */}
        <Row>
          {loginUserInfo.code == "SCHOOL_ADMIN" ? (
            <>
              <Col span={24}>
                <Spin spinning={loading}>
                  <Table
                    rowSelection={rowSelection}
                    columns={NewColumns}
                    dataSource={studentList}
                    rowKey={(record, index) =>
                      record.userId + "_" + record.classId
                    }
                    bordered
                    pagination={false}
                    scroll={{ x: TableRollingWidth + 400 }}
                  />
                </Spin>
                <Pagination
                  showSizeChanger
                  onChange={onPaginationChange}
                  total={studentTotal}
                  current={currentPage}
                  defaultPageSize={10}
                  showTotal={(studentTotal) => `总计 ${studentTotal} 人`}
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
              <Col span={3} className="listLeft">
                <Radio.Group
                  defaultValue="all"
                  buttonStyle="stuIdentityCard"
                  style={{ width: 150 }}
                >
                  <Radio.Button value="all" onClick={allStudentData}>
                    全部
                    <br />
                    {amount}人
                  </Radio.Button>
                  {newClassList}
                </Radio.Group>
              </Col>
              <Col span={21}>
                <Spin spinning={loading}>
                  <Table
                    rowSelection={rowSelection}
                    columns={NewColumns}
                    dataSource={studentList}
                    rowKey={(record, index) => record.userId + "_" + record.classId}
                    bordered
                    pagination={false}
                    scroll={{ x: TableRollingWidth + 400 }}
                  />
                </Spin>
                <Pagination
                  showSizeChanger
                  onChange={onPaginationChange}
                  total={studentTotal}
                  current={currentPage}
                  defaultPageSize={currentSize}
                  showTotal={(studentTotal) => `总计 ${studentTotal} 人`}
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

        {/* 引用删除学生组件 */}
        <DeleteStudent
          innerRef={deleteStudentRef}
          getStudentList={getStudentList}
          setSelectedRows={setSelectedRows}
        />

        <NewStudentDetail
          newStudentOpen={newStudentOpen}
          showNewStudent={showNewStudent}
          getStudentList={getStudentList}
        ></NewStudentDetail>
        <Details
          studentDetailsOpen={studentDetailsOpen}
          showStudentDetails={showStudentDetails}
          account={account}
          examineStatus={examineStatus}
        ></Details>
        <Variation
          studentVariationOpen={studentVariationOpen}
          showStudentVariation={showStudentVariation}
          variationAccount={variationAccount}
        ></Variation>
        <Alteration
          alterationOpen={alterationOpen}
          showAlteration={showAlteration}
          alterationAccount={alterationAccount}
        ></Alteration>
        <NewDetails
          studentDetailsCopyOpen={studentDetailsCopyOpen}
          showStudentDetailsCopy={showStudentDetailsCopy}
          account={account}
          examineStatus={examineStatus}
          getStudentList={getStudentList}
        ></NewDetails>
        <StudentMigration
          topDrawerVisible={topDrawerVisible}
          topDrawerIncident={topDrawerIncident}
        ></StudentMigration>

        {/* 校级web  */}
        <DetailsCopy2
          studentDetailsOpen1={studentDetailsOpen1}
          showStudentDetails1={showStudentDetails1}
          account1={account1}
        ></DetailsCopy2>
        <AuditRecord
          auditRecordOpen={auditRecordOpen}
          showAuditRecord={showAuditRecord}
          examineStatus1={examineStatus1}
          account2={account2}
        ></AuditRecord>
      </div>
    </Spin>
  );
}

const mapStateToProps = (state) => {
  // console.log(state, '这是同步的请求')
  return {
    DictionaryDictGroups: state[namespace].DictionaryDictGroups,
  };
};

export default withRouter(connect(mapStateToProps)(student));
