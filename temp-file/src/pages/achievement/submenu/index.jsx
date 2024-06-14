import { useEffect, useState } from "react";
import ResultStatistics from "./resultStatistics";
import ResultsDisplay from "./resultsDisplay";
import { Button } from "antd";
import styles from "../../achievement/index.module.scss";
import { UnorderedListOutlined, AppstoreOutlined } from "@ant-design/icons";
import { Achievement as namespace } from "@/utils/namespace";
import { connect } from "dva";
import userInfoCache from "@/caches/userInfo"; //获取用户信息

const Submenu = ({ history }) => {
  const [sum, setSum] = useState(null);
  const [userName, setUserName] = useState(null);
  const [showBarChart, setShowBarChart] = useState(true);

  const userInfo = userInfoCache(); //用户信息

  const handleToggleChart = () => {
    setShowBarChart(!showBarChart);
  };

  // 定义回调函数，用于接收子组件传递的参数
  const handleData = (name, sum) => {
    setSum(sum);
    setUserName(name);
    // 处理接收到的数据
  };
  const BackHandle = () => {
    history.push("/Achievement");
  };

  return (
    <div id={styles["studentData"]}>
      <div
        style={{
          display: "flex",
          padding: "0 1.25rem",
          justifyContent: "space-between",
          alignItems: "center",
          height: "4.5rem",
          borderBottom: ".125rem solid #F5F6F9",
          backgroundColor: "#fff",
        }}
      >
        <h1 className={styles.submeun}> {userInfo?.schoolName}成果展示</h1>
        <div style={{ fontWeight: "800" }}>
          {showBarChart ? null : `${userName + "(" + sum + "项)"}`}
        </div>
        {/* <Button style={{ border: '1px solid #1677ff' }}>切换图表</Button> */}
        <div>
          <Button
            style={{
              border: "1px solid #1677ff",
              color: "#1677ff",
              marginRight: "10px",
            }}
            onClick={BackHandle}
          >
            返回
          </Button>
          <Button
            onClick={handleToggleChart}
            style={{ border: "1px solid #1677ff", color: "#1677ff" }}
            icon={
              showBarChart ? <AppstoreOutlined /> : <UnorderedListOutlined />
            }
          >
            {showBarChart ? "以图文展示" : "以列表展示"}
          </Button>
        </div>
      </div>
      {showBarChart ? (
        <ResultStatistics />
      ) : (
        <ResultsDisplay sendData={handleData} />
      )}
    </div>
  );
};

export default connect()(Submenu);
