/**
 *@Author:ChaiLong
 *@Description:班级管理
 *@Date:Created in  2020/3/9
 *@Modified By:
 */
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "dva";
import queryString from "query-string";
import {
  Button,
  Icon,
  Cascader,
  Modal,
  Select,
  Table,
  Popover,
  Input,
  Spin,
} from "antd";
import Page from "@/components/Pages/page";
import styles from "./classInfo.less";
import paginationConfig from "@/utils/pagination";
import {
  dealTimestamp,
  doHandleYear,
  replaceSearch,
  copyText,
  getLocationObj,
} from "@/utils/utils";
import { particularYear } from "@/utils/const";
import { ClassAndTeacherManage as namespace, Public } from "@/utils/namespace";
import AddAndModifyClass from "./components/addAndModifyClass";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import userInfoCaches from "@/caches/userInfo";

import DispositionClassTeacher from "./components/dispositionClassTeacher";
import GenerateClassTeacher from "./components/generateClassTeacher";
import DeleteClass from "./components/deleteClass";
import UpSectionClass from "./components/upSectionClass";

const { confirm } = Modal;

const Option = Select.Option;
@connect((state) => ({
  getGradeList: state[Public].gradeList, //获取年级
  findClassInfoBys: state[namespace].findClassInfoBys, //班级列表
  loading: state[namespace].loading,
}))
class ManageClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalData: {},
      query: {},
      QRCInfo: {}, //口令信息
      checkList: [], // 勾选中的
      getGradeList: [], // 当前年级
      getSchoolCollages: [], // 获取院系列表
      getSchoolMajors: [], // 获取专业列表
      classController: false,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      location: { search },
    } = nextProps;
    const { location } = this.props;
    //将query存储到state中
    if (search !== location.search) {
      const query = queryString.parse(search);
      this.setState({ query });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: namespace + "/set",
      payload: {
        findClassInfoBys: {},
      },
    });
  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    const { query } = getLocationObj(location);
    const userInfo = userInfoCaches();

    //初始化年级
    dispatch({
      type: Public + "/getSchoolGrades",
      callback: (res) => {
        console.log(res, "年级数据");
        if (res) {
          this.setState({ getGradeList: [{ name: "全部", id: -1 }, ...res] });
        }
      },
    });
    dispatch({
      type: namespace + "/findClassInfoBys",
      payload: {
        page: query.p || 1,
        size: 10,
        studyYear: query.spoceId || doHandleYear(),
        gradeId: query.gradeId ? query.gradeId : null,
        schoolId: userInfo.schoolId || 1,
      },
    });
    //获取院系列表
    dispatch({
      type: namespace + "/getSchoolCollagesList",
      callback: (res) => {
        console.log(res, "院系列表");
        if (res) {
          this.setState({ getSchoolCollages: [...res.data] });
        }
      },
    });
    //获取当前学段
    dispatch({
      type: namespace + "/getStudies",
      callback: (res) => {
        console.log(res, "当前学段列表");
        if (res) {
          this.setState({
            classController: res.some((item) => item.id == 42),
          });
          // this.setState({ getSchoolCollages: [ ...res]})
        }
      },
    });
    //获取专业列表
    dispatch({
      type: namespace + "/getSchoolMajorsList",
      callback: (res) => {
        console.log(res, "专业列表");
        if (res) {
          this.setState({ getSchoolMajors: [...res.data] });
        }
      },
    });
    // 获取届别
  }

  /**
   * 将新增/修改子组件添加修改班级的dom挂载到父组件上
   * @param ref
   */
  onRefAddAndModifyClass = (ref) => {
    this.addAndModifyClass = ref;
  };

  /**
   * 将配置子组件添加修改班级的dom挂载到父组件上
   * @param ref
   */
  onRefDispositionClassTeacher = (ref) => {
    this.dispositionClassTeacher = ref;
  };

  /**
   * 将批量生成班级子组件添加修改班级的dom挂载到父组件上
   * @param ref
   */
  onRefGenerateClassTeacher = (ref) => {
    this.generateClassTeacher = ref;
  };

  /**
   * 删除弹框挂载到父组件
   * @param ref
   */
  omRefDeleteClass = (ref) => {
    this.deleteClass = ref;
  };

  /**
   * 一键升段组件
   */
  onRefUpSectionClass = (ref) => {
    this.UpSectionClass = ref;
  };

  /**
   *新增、修改开关
   * @param t true:开，false:关
   * @param record
   */
  openAddClass = (t, record) => {
    this.addAndModifyClass.handleClassVisible(t, record);
  };

  /**
   * 删除开关
   * @param t true:开，false:关
   */
  deleteClassVisible = (t, record) => {
    this.deleteClass.handleClassVisible(t, record);
  };

  /**
   * 一键升段开关
   * @param t true:开，false:关
   */
  sectionClass = (t) => {
    this.UpSectionClass.handleClassVisible(t);
  };

  /**
   * 批量生成班级开关
   * @param t true:开，false:关
   */
  generateClass = (t, record) => {
    this.generateClassTeacher.handleClassVisible(t, record);
  };

  /**
   * 配置开关
   * @param t true:开，false:关
   * @param record
   */
  dispositionClass = (t, record) => {
    this.dispositionClassTeacher.handleClassVisible(t, record);
  };

  /**
   * 多选开关
   * @param t true:开，false:关
   * @param record
   */
  multipleChoice = () => {
    const { checkList } = this.state;
    this.showDeleteConfirm(checkList);
  };

  /**
   * 切换年级或学级
   * @param e
   * @param str
   */
  handleGradeSpoceId = (e, str) => {
    const { dispatch, location } = this.props;
    const { search } = location;
    let query = queryString.parse(search);
    query[str] = e == "-1" ? null : e;
    query.p = undefined;
    replaceSearch(dispatch, location, query);
  };

  /**
   * 放大二维码
   * @param qr 二维码地址
   */
  openQR = (qr) => () => {
    window.open(
      qr,
      "_blank",
      "height=" +
        800 +
        ",width=" +
        800 +
        ",top=0, left=0,toolbar=no, menubar=no, scrollbars=no, location=no, status=no"
    );
  };

  /**
   * 复制到剪贴板
   */
  copyQrCode = () => {
    const qrCodeDom = this.qrCode;
    copyText(qrCodeDom.innerText);
  };

  //列表分页、排序、筛选变化时触发
  handleTableChange = (page) => {
    const { dispatch, location } = this.props;
    const { search } = location;
    let query = queryString.parse(search);
    query = { ...query, p: page.current };
    replaceSearch(dispatch, location, query);
  };

  /**
   * 动态请求qrc并显示
   * @param id
   */
  handleQRC = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: namespace + "/getClassCommandInfo",
      payload: { id },
      callback: (response) => {
        if (Object.keys(response).length) {
          this.setState({ QRCInfo: response });
        }
      },
    });
  };
  /**
   * 控制口令信息关闭清空信息状态
   * @param status
   */
  onVisibleChange = (status) => {
    if (!status) {
      this.setState({ QRCInfo: {} });
    }
  };

  //删除提示框
  showDeleteConfirm = (record) => {
    const this1 = this;

    confirm({
      title: "删除提示",
      icon: <ExclamationCircleOutlined />,
      content: (
        <>
          {record.length > 1 ? (
            <div>您确定要进行批量删除操作吗？</div>
          ) : (
            <div>
              您确定要删除名为
              <span style={{ color: "#1890ff", margin: "10px 0 0 0" }}>
                {record.fullName}
              </span>
              的班级吗？
            </div>
          )}
          <div style={{ fontWeight: 800, margin: "10px 0 0 0" }}>
            该删除操作不可逆。
          </div>
        </>
      ),
      okType: "danger",
      onOk() {
        this1.deleteClassVisible(true, record);
      },
    });
  };

  //更新状态
  onSelectChange = () => {
    this.setState({ checkList: [] });
  };

  render() {
    const { location, loading, findClassInfoBys = {} } = this.props;
    const { QRCInfo, checkList, getGradeList } = this.state;
    const { search, pathname } = location;
    const query = queryString.parse(search);
    const title = "班级管理-组织机构";
    const breadcrumb = [title];
    const userInfo = userInfoCaches();
    const header = <Page.Header breadcrumb={breadcrumb} title={title} />;

    const popoverContent = (record) => {
      return (
        <Spin spinning={!!loading} tip="正在加载中...">
          <div className={styles["popoverBox"]}>
            <div className={styles["message"]}>
              <p>1:学生通过口令字符串或口令二维码，可以加入对应的班级</p>
              <p>2:口令信息请勿随意泄漏，以免造成无关人员加入</p>
              <p>
                3:此口令将在{dealTimestamp(record.endTime, "YYYY-MM-DD")}失效
              </p>
            </div>
            <div className={styles["content"]}>
              <div className={styles["title"]}>{record.fullName}</div>
              <div className={styles["wordBox"]}>
                <div className={styles["qrCode"]}>
                  <div className={styles["name"]}>口令字符串</div>
                  <div className={styles["qrBox"]}>
                    <div
                      className={styles["coped"]}
                      ref={(ref) => {
                        this.qrCode = ref;
                      }}
                    >
                      {record.qrCode}
                    </div>
                    <a onClick={this.copyQrCode}>复制</a>
                  </div>
                </div>

                <div className={styles["qrCodeAddress"]}>
                  <div className={styles["name"]}>口令二维码</div>
                  <div className={styles["qrImgBox"]}>
                    <div className={styles["coped"]}>
                      <img
                        onClick={this.openQR(record.qrCodeAddress)}
                        src={record.qrCodeAddress}
                        alt="二维码"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Spin>
      );
    };

    let dynamicColumns = [];

    if (this.state.classController) {
      dynamicColumns = dynamicColumns.concat(
        { title: "院系", dataIndex: "collageName", key: "collageName" },
        { title: "专业", dataIndex: "majorName", key: "majorName" }
      );
    }

    const columns = [
      { title: "届别", dataIndex: "studyYear", key: "studyYear" },
      { title: "年级", dataIndex: "gradeName", key: "gradeName" },
      ...dynamicColumns,
      { title: "班级全称", dataIndex: "fullName", key: "fullName" },
      { title: "班级简称", dataIndex: "shortName", key: "shortName" },
      { title: "班级全称", dataIndex: "fullName", key: "fullName" },
      {
        title: "操作",
        dataIndex: "",
        key: "x",
        width: 300,
        align: "center",
        render: (text, record) => (
          <div className={styles["options"]}>
            {window.$PowerUtils.judgeButtonAuth(location, "编辑") && (
              <a onClick={() => this.openAddClass(true, record)}>修改</a>
            )}
            {window.$PowerUtils.judgeButtonAuth(location, "口令信息") && (
              <Popover
                onVisibleChange={this.onVisibleChange}
                id={styles["popover"]}
                placement="left"
                title={"口令信息"}
                content={popoverContent(QRCInfo)}
                trigger="click"
              >
                <a
                  onClick={() => this.handleQRC(record.id)}
                  style={{ marginLeft: "20px" }}
                >
                  口令信息
                </a>
              </Popover>
            )}

            {window.$PowerUtils.judgeButtonAuth(location, "删除") && (
              <a
                style={{ marginLeft: "20px" }}
                onClick={() => this.showDeleteConfirm(record)}
              >
                删除
              </a>
            )}
            {window.$PowerUtils.judgeButtonAuth(location, "配置") && (
              <a
                style={{ marginLeft: "20px" }}
                onClick={() => this.dispositionClass(true, record)}
              >
                配置
              </a>
            )}
          </div>
        ),
      },
    ];
    //多选
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ checkList: selectedRows });
      },
    };

    return (
      <Page header={header} loading={!!loading}>
        <div id={styles["ManageClass"]}>
          <div className={styles["class-list"]}>
            <div className={styles["topSearch"]}>
              <div className={styles["menuInput"]}>
                <div className={`${styles["grade"]} ${styles["box"]}`}>
                  <label>年级：</label>
                  <Select
                    defaultValue={
                      query.gradeId ? parseInt(query.gradeId, 10) : "全部"
                    }
                    style={{ width: 120 }}
                    onChange={(e) => this.handleGradeSpoceId(e, "gradeId")}
                  >
                    {getGradeList.length &&
                      getGradeList.map((re) => (
                        <Option key={re.id} value={re.id}>
                          {re.name}
                        </Option>
                      ))}
                  </Select>
                </div>
                <div className={`${styles["spoce"]} ${styles["box"]}`}>
                  <label>届别：</label>
                  <Select
                    defaultValue={
                      query.spoceId ? query.spoceId : doHandleYear()
                    }
                    style={{ width: 120 }}
                    onChange={(e) => this.handleGradeSpoceId(e, "spoceId")}
                  >
                    {particularYear.map((re) => (
                      <Option key={re.code} value={re.code}>
                        {re.code}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className={styles["addClass"]}>
                {window.$PowerUtils.judgeButtonAuth(location, "一键升段") && (
                  <Button onClick={() => this.sectionClass(true)}>
                    一键升段
                  </Button>
                )}
                {window.$PowerUtils.judgeButtonAuth(
                  location,
                  "批量生成班级"
                ) && (
                  <Button onClick={() => this.generateClass(true)}>
                    批量生成班级
                  </Button>
                )}
                {window.$PowerUtils.judgeButtonAuth(location, "添加") && (
                  <Button onClick={() => this.openAddClass(true)}>新增</Button>
                )}
                {window.$PowerUtils.judgeButtonAuth(location, "批量删除") && (
                  <Button
                    onClick={() => this.multipleChoice()}
                    disabled={!checkList.length > 0}
                  >
                    批量删除
                  </Button>
                )}
              </div>
            </div>
            {findClassInfoBys &&
            findClassInfoBys.data &&
            findClassInfoBys.data.length > 0 ? (
              <Table
                className={styles["user-table"]}
                columns={columns}
                rowSelection={rowSelection}
                bordered
                onChange={this.handleTableChange}
                dataSource={findClassInfoBys.data}
                pagination={paginationConfig(
                  query,
                  findClassInfoBys.total || 0
                )}
                rowKey="id"
              />
            ) : (
              <div
                style={{ marginTop: "0", height: "300px" }}
                className="no-data"
              >
                <ExclamationCircleOutlined />
                暂无数据,请切换年级或学级
              </div>
            )}
          </div>
          {/* 新增与修改 */}
          <AddAndModifyClass
            particularYear={particularYear}
            getGradeList={getGradeList}
            getSchoolCollages={this.state.getSchoolCollages}
            getSchoolMajors={this.state.getSchoolMajors}
            query={query}
            onRef={this.onRefAddAndModifyClass}
            handleClick={this.handleGradeSpoceId}
          />
          {/* 配置 */}
          <DispositionClassTeacher
            particularYear={particularYear}
            query={query}
            onRef={this.onRefDispositionClassTeacher}
          />
          {/* 批量生成班级 */}
          <GenerateClassTeacher
            particularYear={particularYear}
            getSchoolCollages={this.state.getSchoolCollages}
            getSchoolMajors={this.state.getSchoolMajors}
            query={query}
            handleClick={this.handleGradeSpoceId}
            onRef={this.onRefGenerateClassTeacher}
          />
          {/* 删除 */}
          <DeleteClass
            handleClick={this.handleGradeSpoceId}
            onSelectChange={this.onSelectChange}
            onRef={this.omRefDeleteClass}
          />
          {/* 一键升段 */}
          <UpSectionClass
            handleClick={this.handleGradeSpoceId}
            onRef={this.onRefUpSectionClass}
          />
        </div>
      </Page>
    );
  }
}

export default withRouter(ManageClass);
