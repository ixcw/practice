import { connect } from "dva";
import { useEffect, useState, useRef } from "react";

import {
  Modal,
  Breadcrumb,
  Button,
  Form,
  Input,
  Select,
  Row,
  Col,
  Image,
  Spin,
  DatePicker,
  message,
} from "antd";
import { AchievementSubmenu as namespace } from "@/utils/namespace";
import { useReactToPrint } from "react-to-print";
import download from "downloadjs";

import "dayjs/locale/zh-cn";

const details = ({ detailsVisible, data, dispatch }) => {
  const [loading, setLoading] = useState(true); //加载
  const [detailsData, setDetailsData] = useState(null); // 详情数据
  const printDom = useRef();

  useEffect(() => {
    console.log("执行了没有");
    setLoading(true);

    dispatch({
      type: namespace + "/achievementDetails",
      payload: { id: data?.id },
      callback: (res) => {
        console.log(res, "详情数据");
        if (res.code == 200) {
          setDetailsData(res.data);
          console.log(
            res.data.annex.map((item) => {
              return item.annexWebsite;
            })
          );
          setLoading(false);
        } else {
          message.error("网络出错");
          return;
        }
      },
    });
  }, [detailsVisible]);

  // 打印
  const handlePrint = useReactToPrint({
    content: () => printDom.current,
  });
  const DownloadHandle = async () => {
    await downloadFiles(
      detailsData?.annex.map((item) => item.annexWebsite),
      "files"
    );
    await downloadFiles(detailsData?.achiPng.split(","), "images");
  };
  const downloadFiles = async (urls, folder) => {
    for (const url of urls) {
      const response = await fetch(url);
      const blob = await response.blob();

      // 获取文件名
      const filename = url.substring(url.lastIndexOf("/") + 1);

      // 创建文件夹
      const folderPath = `./${folder}`;

      // 下载文件到文件夹
      download(blob, filename, folderPath);
    }
  };

  //取消
  const handleCancel = () => {
    dispatch({
      type: namespace + "/detailsHideModal",
    });
  };

  return (
    <Modal
      width={1200}
      title="成果详情"
      visible={detailsVisible}
      footer={null}
      destroyOnClose={true}
      onCancel={() => handleCancel()}
    >
      <Spin size="large" spinning={loading}>
        <div style={{ padding: "20px" }}>
          <div ref={printDom}>
            <div>成果名称：{detailsData?.name}</div>
            <Row>
              <Col span={6}>获得时间：{detailsData?.getTime}</Col>
              <Col span={6}>获得人：{detailsData?.userName}</Col>
              {detailsData?.otherUserName && (
                <Col span={6}>参与人：{detailsData?.otherUserName}</Col>
              )}
            </Row>
            <Row>
              <Col span={6}>获得者身份：{detailsData?.roleName}</Col>
              {detailsData?.otherRoleId && (
                <Col span={6}>
                  {detailsData?.otherRoleId == 1
                    ? `届别：${detailsData?.joinSpoceId}`
                    : detailsData?.otherRoleId == 2
                    ? `教研组：${detailsData?.teachGroupName}`
                    : ""}
                </Col>
              )}
              <Col span={6}>
                成果类型：{detailsData?.achiTypeName}
                {detailsData?.otherAchiType
                  ? "-" + detailsData?.otherAchiType
                  : null}
              </Col>
              <Col span={6}>
                成果等级：{detailsData?.achiLevelName + detailsData?.willRank}
              </Col>
            </Row>
            <div
              dangerouslySetInnerHTML={{ __html: detailsData?.content }}
            ></div>
            <div>
              <div> 成果证书：</div>
              <span>
                {detailsData?.achiPng &&
                  detailsData?.achiPng.split(",").map((item, index) => (
                    <span key={index} style={{ marginLeft: "20px" }}>
                      <Image.PreviewGroup
                        preview={{
                          onChange: (current, prev) =>
                            console.log(
                              `current index: ${current}, prev index: ${prev}`
                            ),
                        }}
                      >
                        <Image width={100} src={item} />
                      </Image.PreviewGroup>
                    </span>
                  ))}
              </span>
            </div>
            <div> 成果相关资料：</div>
            <span>
              {detailsData?.annex &&
                detailsData?.annex.map((item, index) => (
                  <span key={index}>
                    <div>
                      {/*  eslint-disable-next-line */}
                      <a
                        href={item.annexWebsite}
                        target="_blank"
                        rel="noopener"
                      >
                        {item.annexDesignation}
                      </a>
                    </div>
                  </span>
                ))}
            </span>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <Button
            type="primary"
            style={{ marginRight: 10 }}
            onClick={DownloadHandle}
          >
            下载附件资料
          </Button>
          <Button
            type="primary"
            style={{ marginRight: 10 }}
            onClick={handlePrint}
          >
            打印
          </Button>
          <Button onClick={handleCancel}>取消</Button>
        </div>
      </Spin>
    </Modal>
  );
};

// 将 reducers 中的状态映射到组件的 props 上
function mapStateToProps(state) {
  return {
    detailsVisible: state[namespace].detailsVisible, // 使用正确的 namespace
    data: state[namespace].data, // 使用正确的 namespace
  };
}

export default connect(mapStateToProps)(details);
