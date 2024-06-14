/*
Author:石海贵
Description:学生删除
Date:2023/10/10
*/

import React, { useState, useRef, useImperativeHandle } from "react";
import { Modal, message, Row, Col, Input, Button } from "antd";
import { connect } from "dva";
import userInfoCache from "@/caches/userInfo";
import { StudentData as namespace } from "@/utils/namespace";
import { phoneReg } from "@/utils/const";
import YpRiddlerRender from "@/components/YpRiddlerRender/index.js"; //滑块验证

const deleteStudent = (props) => {
  const { dispatch, getStudentList, setSelectedRows } = props;
  const loginUserInfo = userInfoCache() || {};
  const YpRiddlerRenderRef = useRef(null);
  const [isDeleteStudentOpen, setIsDeleteStudentOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [inputCode, setInputCode] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);

  // 向父组件传递方法
  useImperativeHandle(props.innerRef, () => ({
    showDeleteStudent,
  }));

  // 打开删除弹窗
  const showDeleteStudent = (params) => {
    if (Array.isArray(params)) {
      // 批量删除
      setStudentInfo(
        params.map((item) => ({
          studentId: item.userId,
          classId: item.classId,
        }))
      );
    } else {
      // 单条删除
      setStudentInfo([{ studentId: params.userId, classId: params.classId }]);
    }
    setIsDeleteStudentOpen(true);
  };

  // 验证码输入框
  const onInputChange = (e) => {
    setInputCode(e.target.value);
  };

  let timer;
  // 获取验证码 打开滑块验证  倒计时60s
  const getCode = (object = {}, isShow = false) => {
    if (isDisabled) return;

    if (!phoneReg.test(loginUserInfo.phone)) {
      message.warning("手机号有误，请前往个人中心重新设置!");
      return;
    }
    if (isShow == 1) {
      YpRiddlerRenderRef.current.showIsSlideShow(); //展示验证弹窗
      return;
    }
    if (isShow == 2 && (!object.token || !object.authenticate)) {
      message.warning("参数有误,请稍后重试!");
      return;
    }
    dispatch({
      type: namespace + "/getVerificationCodeApi",
      payload: {
        token: object.token, //行为验证token
        authenticate: object.authenticate, //行为验证许可authenticate
        phoneNumber: loginUserInfo.phone, //管理员手机号
        type: 6, //删除标识符
      },
      callback: (res) => {
        if (res.result?.code === 200) {
          message.success("验证码发送成功，请注意查收");
          setIsDisabled(true);
          setCountdown(60);
          timer = setInterval(() => {
            setCountdown((prevCountdown) => prevCountdown - 1);
          }, 1000);
          setTimeout(() => {
            clearInterval(timer);
            setIsDisabled(false);
          }, 60000);
        }
      },
    });
  };

  // 确认删除学生
  const handleOk = () => {
    // 效验验证码
    dispatch({
      type: namespace + "/verificationCodeApi",
      payload: { phoneNumber: loginUserInfo.phone, validateCode: inputCode },
      callback: (res) => {
        if (res.result?.code === 200) {
          // 删除学生账号
          dispatch({
            type: namespace + "/deleteStudentMesApi",
            payload: studentInfo,
            callback: (res) => {
              if (res.result?.code === 200) {
                Modal.success({
                  title: "删除成功！",
                  onOk() {
                    clearInterval(timer);
                    setIsDisabled(false);
                    setIsDeleteStudentOpen(false);
                    setInputCode(null);
                    getStudentList();
                    setSelectedRows([]);
                  },
                });
              }
            },
          });
        } else {
          message.error("验证码错误请重新输入！");
        }
      },
    });
  };
  // 取消
  const handleCancel = () => {
    setIsDeleteStudentOpen(false);
    setInputCode(null);
  };

  return (
    <>
      <Modal
        title="身份验证"
        visible={isDeleteStudentOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div style={{ margin: "20px 0" }}>
          请输入{" "}
          {`${loginUserInfo.phone?.substr(
            0,
            3
          )}****${loginUserInfo.phone?.substr(-4)}`}{" "}
          接收到的验证码
        </div>
        <Row gutter={[12, 0]}>
          <Col span={12}>
            <Input
              value={inputCode}
              onChange={onInputChange}
              placeholder="请输入验证码"
            />
          </Col>
          <Col span={12}>
            <Button
              type="primary"
              disabled={isDisabled}
              onClick={() => getCode({}, 1)}
            >
              {isDisabled ? `${countdown}秒后再次获取` : "获取验证码"}
            </Button>
          </Col>
        </Row>
        <YpRiddlerRender
          onRef={(ref) => (YpRiddlerRenderRef.current = ref)}
          sendCheckCode={getCode}
        />
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => {
  return {};
};
export default connect(mapStateToProps)(deleteStudent);
