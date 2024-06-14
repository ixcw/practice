import { useEffect, useState } from "react";
import EChartsGraph from "@/components/EChartsGraph";
import styles from "./index.module.scss";
import { withRouter } from "react-router-dom";
import { Button, message } from "antd";
import { Achievement as namespace } from "@/utils/namespace";
import { connect } from "dva";
import { Spin } from "antd";
import userInfoCache from "@/caches/userInfo"; //获取用户信息

const Achievement = ({ history, dispatch }) => {
  const [loading, setLoading] = useState(true);
  const [achievementTotalStatistics, setAchievementTotalStatistics] = useState(
    []
  ); // 存储统计数组
  const [researchGroupAchievement, setResearchGroupAchievement] = useState([]); // 存储对比数据

  // 统计图
  //setting中获取当前学校的名称

  const userInfo = userInfoCache(); //用户信息

  useEffect(() => {
    // 获取数据
    dispatch({
      type: namespace + "/achievementManageStatisticsApi",
      payload: { schoolId: userInfo?.schoolId },
      callback: (res) => {
        console.log(res);
        if (
          res.result.code == 200 &&
          res.result.data.achievementTotalStatistics
        ) {
          console.log("sdfdf");
          //统计数组
          setAchievementTotalStatistics([
            res.result.data.achievementTotalStatistics.scientificNum,
            res.result.data.achievementTotalStatistics.thesisNum,
            res.result.data.achievementTotalStatistics.subjectNum,
            res.result.data.achievementTotalStatistics.patentNum,
            res.result.data.achievementTotalStatistics.othersNum,
          ]);

          //对比数据
          setResearchGroupAchievement(res.result.data.researchGroupAchievement);
          console.log(
            res.result.data.researchGroupAchievement.map((item) => item.name)
          );

          setLoading(false);
        } else {
          setAchievementTotalStatistics([0, 0, 0, 0, 0]);
          setResearchGroupAchievement([]);
          message.error(`${res.result.msg}`);
        }
      },
    });
  }, []);

  const dataSum = achievementTotalStatistics?.reduce(
    (sum, item) => sum + item,
    0
  );
  const totalData = {
    option: {
      legend: {
        show: true,
        data: [`成果总计(${dataSum ? dataSum : "0"}项)`],
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      xAxis: {
        data: ["科研", "论文", "课题", "专利", "其他奖项"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: `成果总计(${dataSum ? dataSum : "0"}项)`,
          type: "bar",
          data: [...achievementTotalStatistics],
          barWidth: "40%",
          showBackground: true,
          backgroundColor: {
            color: "rgba(180, 180, 180, 0.2)",
          },
          label: {
            show: true,
            position: "top",
          },
          itemStyle: {
            color: '#1677ff',
          },
        },
      ],
    },
  };

  //对比图
  const compareData = {
    option: {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },

      legend: {
        orient: "horizontal",
        y: "bottom",
        // left: 100,
      },
      grid: {
        containLabel: true,
        left: "3%",
        right: "3%",
      },
      dataZoom: [
        // 使用dataZoom组件
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          start: 0,
          end: 100, // 初始显示的数据比例
        },
      ],
      xAxis: [
        {
          type: "category",
          axisLabel: {
            rotate: 45  // 旋转角度
          },
          data: researchGroupAchievement?.map((item) => item.name),

        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "科研",
          type: "bar",
          stack: "Ad",
          emphasis: {
            focus: "series",
          },
          data: researchGroupAchievement?.map((item) => item.scientificNum),
        },
        {
          name: "论文",
          type: "bar",
          stack: "Ad",
          emphasis: {
            focus: "series",
          },
          data: researchGroupAchievement?.map((item) => item.thesisNum),
        },
        {
          name: "课题",
          type: "bar",
          stack: "Ad",
          emphasis: {
            focus: "series",
          },
          data: researchGroupAchievement?.map((item) => item.subjectNum),
        },
        {
          name: "专利",
          type: "bar",
          stack: "Ad",
          emphasis: {
            focus: "series",
          },
          data: researchGroupAchievement?.map((item) => String(item.patentNum)),
        },
        {
          name: "其他获奖",
          type: "bar",
          stack: "Ad",
          emphasis: {
            focus: "series",
          },
          data: researchGroupAchievement?.map((item) => String(item.othersNum)),
        },
      ],
    },
  };

  //跳转数据页面
  const handleClick = () => {
    console.log("跳转");
    history.push("/AchievementSubmenu");
  };

  return (
    <div id={styles["studentData"]}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: "1.25rem", fontWeight: 800 }}>
          {userInfo?.schoolName}
        </h1>

        <Button type="primary" onClick={handleClick}>
          进入成果数据
        </Button>
      </div>
      {loading ? (
        <Spin />
      ) : (
        <div style={{ width: "100%", display: "flex" }}>
          <div style={{ width: "50%" }}>
            <h1 className={styles.leftBlue}>成果总计图</h1>
            <EChartsGraph data={totalData} />
          </div>
          <div style={{ width: "50%",height:"500px" }}>
            <h1 className={styles.leftBlue}>教研组成果对比图</h1>
            <EChartsGraph data={compareData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default connect()(withRouter(Achievement));
