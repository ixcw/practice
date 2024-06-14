import { useEffect, useState } from "react";
import {
  Layout,
  Radio,
  Space,
  Checkbox,
  Spin,
  Card,
  List,
  Row,
  Col,
  Image,
  message,
  Select,
  Input,
  Tooltip
} from "antd";
import PropTypes from "prop-types";
import { connect } from "dva";
import { AchievementSubmenu as namespace } from "@/utils/namespace";
const { Sider, Content } = Layout;

const ResultsDisplay = ({ sendData, dispatch }) => {
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);

  const [OutcomeValue, setOutcomeValue] = useState("1");
  const [OutcomeLabel, setOutcomeLabel] = useState("科研");
  const [typeOptions, setTypeOptions] = useState([]); // 成果类型数组
  const [standingString, setStandingString] = useState(["1"]); // 身份勾选列表
  const [categoryChecked, setCategoryChecked] = useState([]); // 类别勾选列表
  const [categoryList, setCategoryList] = useState([]); // 组别渲染数组
  const [visible, setVisible] = useState(false); // 复选框是否可见
  const [studentVisible, setStudentVisible] = useState(true); // 届别
  const [studentOptions, setStudentOptions] = useState([]); // 届别下拉框
  const [spoceList, setSpoceList] = useState([]); //选中的届别
  const [userName, setUserName] = useState(""); // 搜索

  const [argument, setArgument] = useState([]); // 上传的参数

  useEffect(() => {
    dispatch({
      type: namespace + "/teacherGroup",
      callback: (res) => {
        console.log(res, "组别数据");
        if (res.code == 200) {
          setCategoryList(res.data);
        }
      },
    });
    dispatch({
      type: namespace + "/getGradeIdApi",
      callback: (res) => {
        console.log(res, "届别");
        if (res.result.code == 200) {
          setStudentOptions(
            res.result.data.map((item) => {
              return {
                value: item.id,
                label: item.name,
              };
            })
          );
        }
      },
    });
    // 获取字典数据
    dispatch({
      type: namespace + "/batchLoadDictGroups",
      payload: { dictCodes: "DICT_ACHV_TYPE" },
      callback: (res) => {
        console.log(res, "字典数据");
        if (res.code === 200) {
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

    sendData(OutcomeLabel);

    // setLoading(false);
  }, []);

  useEffect(() => {
    fetchList();
  }, [
    argument,
    // OutcomeValue,
    // standingString,
    // categoryChecked,
    // userName,
    // spoceList,
    // page,
  ]);

  // 封装接口
  const fetchList = () => {
    setLoading(true);

    dispatch({
      type: namespace + "/getAchievementShow",
      payload: {
        achiType: OutcomeValue,
        ids: categoryChecked,
        roleIds: standingString,
        name: userName,
        spoceIds: spoceList,
        page: page,
        size: 15,
      },
      callback: (res) => {
        console.log(res, "列表数据");
        if (res.code == 200) {
          if (
            res.data.data &&
            res.data.data.length > 0 &&
            res.data.data[0] !== null
          ) {
            setData([...data, ...res.data?.data]);
            setPage((prevPage) => prevPage + 1);
            setLoading(false);
          } else {
            setLoading(false);
            setHasMore(false);
            return message.warning("数据为空");
          }
        } else {
          message.error("网络连接失败");
        }
        setLoading(false);
      },
    });

    dispatch({
      type: namespace + "/findAchiTypeAndNum",
      payload: {
        achiType: OutcomeValue,
        ids: categoryChecked,
        roleIds: standingString,
        spoceIds: spoceList,
      },
      callback: (res) => {
        console.log(res, "数量");
        if (res.code == 200) {
          // setOutcomeValue(res.data.achiType);
          // sendData(res.data.achiTypeNum, OutcomeValue);
          sendData(OutcomeLabel, res.data?.achiTypeNum);
        }
      },
    });
  };

  //滚动加载
  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollHeight - scrollTop === clientHeight && hasMore && !loading) {
      fetchList();
    }
  };

  const contentStyle = {
    height: "570px",
    backgroundColor: "#fff",
    padding: "20px",
    boxSizing: "border-box",
    // overflow: 'auto',
  };
  const siderStyle = {
    height: "570px",
    // padding: "10px 0",
    backgroundColor: "#fff",
    border: " 2px solid #F5F6F9",
    boxSizing: "border-box",
  };

  //学生教师勾选框
  const onChangeStanding = (checkedValues) => {
    setData([]);
    setPage(1);

    const hasValue = checkedValues.includes("2");
    if (hasValue) {
      setVisible(true);
    } else {
      setVisible(false);
      setCategoryChecked(null);
    }

    const hasValue1 = checkedValues.includes("1");
    if (hasValue1) {
      setStudentVisible(true);
    } else {
      setStudentVisible(false);
      setSpoceList(null);
    }

    console.log(hasValue, hasValue1);

    setStandingString(checkedValues);
    setArgument({ ...argument, standingString: checkedValues });
  };

  //组别勾选框
  const onChangeSubject = (checkedValues) => {
    setData([]);
    setPage(1);
    console.log("onChangeSubject = ", checkedValues);
    setCategoryChecked(checkedValues);
    setArgument({ ...argument, ids: checkedValues });
  };

  //成果类型
  const OutcomeChange = (e) => {
    console.log(typeOptions);

    console.log(e.target);
    const em = typeOptions.filter((item) => item.value == e.target.value);
    console.log(em);
    setData([]);
    setPage(1);
    setOutcomeValue(e.target.value);
    sendData(em[0].label);
    setOutcomeLabel(em[0].label);
    setArgument({ ...argument, achiType: e.target.value });
  };

  // 届别改变
  const selectProps = {
    mode: "multiple",
    style: {
      width: "100%",
      borderTop: "2px solid #F5F6F9",
      borderBottom: "2px solid #F5F6F9",
      marginBottom: "10px",
    },
    placeholder: "请选择届别",
    optionFilterProp: "label",
    value: spoceList,
    options: studentOptions,
    onChange: (newValue) => {
      setData([]);
      setPage(1);
      setSpoceList(newValue);
      setArgument({ ...argument, spoceIds: newValue });
    },

    maxTagCount: 1,
  };
  // const handleChange = (value) => {
  //   setData([]);
  //   setPage(1);
  //   console.log(value);
  //   // setSpoceList([...value]);

  //   // setArgument({ ...argument, spoceIds: [...value] });
  // };

  // 搜索框
  const enterHandle = (e) => {
    setData([]);
    setPage(1);

    setUserName(e.target.value);
    setArgument({ ...argument, name: e.target.value });
  };

  // 组件的内容
  return (
    <div style={{ height: "100%", backgroundColor: "#fff" }}>
      <Spin size="large" spinning={loading}>
        <Layout hasSider>
          <Sider style={siderStyle} width="150px">
            <Input
              onChange={enterHandle}
              placeholder="搜索成果名称"
              style={{
                borderBottom: "2px solid #F5F6F9",
                marginBottom: "10px",
              }}
            />

            <Radio.Group
              value={OutcomeValue}
              onChange={OutcomeChange}
              style={{
                width: "100%",
                padding: "0 10px",
                marginBottom: "20px",
              }}
            >
              <Space
                direction="vertical"
                style={{ width: "100%", textAlign: "center" }}
              >
                {typeOptions &&
                  typeOptions.map((item) => (
                    <Radio.Button
                      style={{ width: "100%", backgroundColor: "#F5F6F9" }}
                      value={item.value}
                    >
                      {item.label}
                    </Radio.Button>
                  ))}
                {/* <Radio.Button
                  style={{ width: "100%", backgroundColor: "#F5F6F9" }}
                  value="专利"
                >
                  专利
                </Radio.Button>
                <Radio.Button
                  style={{ width: "100%", backgroundColor: "#F5F6F9" }}
                  value="论文"
                >
                  论文
                </Radio.Button>
                <Radio.Button
                  style={{ width: "100%", backgroundColor: "#F5F6F9" }}
                  value="课题"
                >
                  课题
                </Radio.Button>
                <Radio.Button
                  style={{ width: "100%", backgroundColor: "#F5F6F9" }}
                  value="其他成果类型"
                >
                  其他成果类型
                </Radio.Button> */}
              </Space>
            </Radio.Group>

            <Checkbox.Group
              style={{
                width: "100%",
                height: "88px",
                lineHeight: "43.2px",
                borderTop: "2px solid #F5F6F9",
                borderBottom: "2px solid #F5F6F9",
                textAlign: "center",
                marginBottom: "10px",
              }}
              defaultValue={["1"]} // 设置默认选中的值
              onChange={onChangeStanding}
            >
              <Checkbox value="1">学生</Checkbox>
              <br />
              <Checkbox value="2">教师</Checkbox>
            </Checkbox.Group>

            {studentVisible && (
              <Select {...selectProps} />
              // <Select
              //   direction="vertical"
              //   style={{
              //     width: "100%",
              //     borderTop: "2px solid #F5F6F9",
              //     borderBottom: "2px solid #F5F6F9",
              //     marginBottom: "10px",
              //   }}
              //   onChange={handleChange}
              //   options={studentOptions}
              //   placeholder="请选择届别"
              //   optionFilterProp="label"
              //   showSearch
              // />
            )}

            {visible && (
              <Checkbox.Group
                style={{
                  width: "100%",
                  height: "140px",
                  // lineHeight: "43.2px",
                  textAlign: "left",
                  overflow: "auto",
                }}
                defaultValue={[]} // 设置默认选中的值
                onChange={onChangeSubject}
              >
                {categoryList &&
                  categoryList.map((item) => (
                    <div key={item.id}>
                      <Checkbox value={item.id}>{item.teachGroupName}</Checkbox>
                      <br />
                    </div>
                  ))}
              </Checkbox.Group>
            )}
          </Sider>

          <Content style={contentStyle}>
            <div
              onScroll={handleScroll}
              style={{ overflowY: "auto", height: "550px" }}
            >
              <List
                grid={{
                  gutter: 16,
                  column: 4,
                }}
                // style={{ textAlign: "center" }}
                dataSource={data}
                renderItem={(item) => (
                  <List.Item>
                    <Card bordered={false}>
                      <Row gutter={[20, 16]}>
                        <Col span={12} style={{ whiteSpace: "nowrap",overflow: "hidden",textOverflow: "ellipsis"}}>

                          <Tooltip title= {item.userName}>
                            <span > {item.userName}</span>
                          </Tooltip>
                        </Col>
                        <Col span={8}>{item.roleName}</Col>
                      </Row>
                      <div style={{width:"200px", whiteSpace: "nowrap",overflow: "hidden",textOverflow: "ellipsis"}}>{item.name}</div>
                      <Row>
                        <Image
                          width={200}
                          height={200}
                          src={
                            item.achiPng ? item.achiPng?.split(",")[0] : null
                          }
                        />
                      </Row>
                    </Card>
                  </List.Item>
                )}
                loadMore={loading && hasMore && <Spin />}
              />
            </div>
          </Content>
        </Layout>
      </Spin>
    </div>
  );
};

ResultsDisplay.propTypes = {
  sendData: PropTypes.func.isRequired,
};

export default connect()(ResultsDisplay);
