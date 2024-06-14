/**
 * 左侧导航栏
 * @author:shihaigui
 * date:2023年4月25日===
 * */

import React, { useState,useEffect } from "react";
import styles from "./School.less";
import { Col, Row, Menu } from "antd";
import { MailOutlined, HomeOutlined, UserOutlined } from "@ant-design/icons";
import Enrollmentrate from "./Enrollmentrate/Enrollmentrate";
import PreviewPrinting from "./PreviewPrinting/PreviewPrinting";
import ProjectSituation from "./ProjectSituation/ProjectSituation";
import SchoolTeacherScale from "./SchollTeacherScale/SchoolTeacherScale";
import SchoolFacility from "./SchoolFacility/SchoolFacility";
import { connect } from "dva";
import { School as namespace } from "../../utils/namespace";
import SchoolHonor from "./SchoolHonor/SchoolHonor";
import SchoolFoundation from "./SchoolFoundation/SchoolFoundation";
import Page from "@/components/Pages/page";
const title = '数据中心-学校数据';
const breadcrumb = [title];
const header = (<Page.Header breadcrumb={breadcrumb} title={title}/>)
export default function school() {
  //刷新后展示当前页面内容
  const [selectedKey, setSelectedKey] = useState(localStorage.getItem('selectedKey') || "SchoolFoundation");
  const [contentMap, setContentMap] = useState({
    SchoolFoundation: <SchoolFoundation />,
    SchoolFacility: <SchoolFacility />,
    SchoolTeacherScale: <SchoolTeacherScale />,
    SchoolHonor: <SchoolHonor />,
    ProjectSituation: <ProjectSituation />,
    Enrollmentrate: <Enrollmentrate />,
    PreviewPrinting: <PreviewPrinting />
  });

  const handleClickMenu = (e) => {
    setSelectedKey(e.key);
  };

  useEffect(() => {
    localStorage.setItem('selectedKey', selectedKey);
  }, [selectedKey]);

  return (
    <Page header={header}>
      <div className={styles["centertop"]}>
        <div>
        <Row gutter={[0, 32]}>
            <Col span={3}>
              <Menu onClick={handleClickMenu} style={{ position: 'fixed' }}selectedKeys={selectedKey}>
                <Menu.Item key={"SchoolFoundation"}>
                  <HomeOutlined />
                  学校基础信息
                </Menu.Item>
                <Menu.Item key={"SchoolFacility"}>
                  <MailOutlined />
                  学校设施情况
                </Menu.Item>
                <Menu.Item key={"SchoolTeacherScale"}>
                  <UserOutlined />
                  学校教师规模
                </Menu.Item>
                <Menu.Item key={"SchoolHonor"}>
                  <UserOutlined />
                  学校荣誉
                </Menu.Item>
                <Menu.Item key={"ProjectSituation"}>
                  <UserOutlined />
                  项目情况
                </Menu.Item>
                <Menu.Item key={"Enrollmentrate"}>
                  <UserOutlined />
                  升学率
                </Menu.Item>
                <Menu.Item key={"PreviewPrinting"}>
                  <UserOutlined />
                  学校概况
                </Menu.Item>
              </Menu>
            </Col>
            <Col span={21} className={styles["rightBox"]}>
              {contentMap[selectedKey]}
            </Col>
          </Row>
        </div>
      </div>
    </Page>
  );
}
