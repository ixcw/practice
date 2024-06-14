/**
 *@Author:ChaiLong
 *@Description:删除信息
 *@Date:Created in  2020/6/28
 *@Modified By:
 */
import React from "react";
import { Modal, Input, message, Row, Col, Button } from "antd";
import { connect } from "dva";
import { ClassAndTeacherManage as namespace } from "@/utils/namespace";
import userInfoCache from "@/caches/userInfo";
import { phoneReg } from "@/utils/const";
import YpRiddlerRender from "@/components/YpRiddlerRender/index.js"; //滑块验证
import { string } from "prop-types";

@connect((state) => ({}))
export default class DeleteClass extends React.Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      visible: false,
      modalData: {}, //传递过来的信息
      loginUserInfo: userInfoCache() || {}, // 获取当前用户信息
      inputCode: "", //
      isDisabled: false, // 控制验证按钮
      countdown: 0, // 秒
    };
  }

  //将验证组件挂载到父组件上
  onRefYpRiddlerRender = (ref) => {
    this.YpRiddlerRenderRef = ref;
  };

  //首次加载的函数
  fetchSubjectNames = (record) => {
    const { dispatch } = this.props;
    if (Array.isArray(record)) {
      //批量删除
      const em = record.map((item) => item.id).join(",");

      this.setState({ modalData: em });
    } else {
      // 单条删除
      this.setState({ modalData: record.id });
    }
  };

  componentDidMount() {
    this.props.onRef(this);
  }

  /**
   * modal开关
   * @param t false开，true关
   * @param record 传递过来的信息
   */
  handleClassVisible = (t, record) => {
    this.setState(
      {
        visible: t,
        loginUserInfo: userInfoCache() || {}, // 获取当前用户信息
        inputCode: "", //
        isDisabled: false, // 控制验证按钮
        countdown: 0, // 秒
      },
      () => {
        if (t == true) {
          this.fetchSubjectNames(record);
          console.log(this.state.loginUserInfo,"当前信息")
        }
      }
    );
  };

  /**
   * 验证码输入框改变事件
   */
  onInputChange = (e) => {
    this.setState({ inputCode: e.target.value });
  };

  /**
   * 获取验证码 打开滑块验证  倒计时60s
   * @param	object	滑块验证通过参数
   * @param	isShow	滑块验证状态
   */
  getCode = (object = {}, isShow = false) => {
    const { isDisabled, loginUserInfo } = this.state;
    const { dispatch } = this.props;

    if (isDisabled) return;

    if (!phoneReg.test(loginUserInfo.phone)) {
      message.warning("手机号有误，请前往个人中心重新设置!");
      return;
    }
    if (isShow == 1) {
      this.YpRiddlerRenderRef.showIsSlideShow(); //展示验证弹窗
      return;
    }
    if (isShow == 2 && (!object.token || !object.authenticate)) {
      message.warning("参数有误,请稍后重试!");
      return;
    }

    dispatch({
      type: namespace + "/getVerificationCode",
      payload: {
        token: object.token, //行为验证token
        authenticate: object.authenticate, //行为验证许可authenticate
        phoneNumber: loginUserInfo.phone, //管理员手机号
        type: 6, //删除标识符
      },
      callback: (res) => {
        if (res.code === 200) {
          message.success("验证码发送成功，请注意查收");
          this.setState({ isDisabled: true, countdown: 60 });

          const timer = setInterval(() => {
            this.setState((prevState) => ({
              countdown: prevState.countdown - 1,
            }));
          }, 1000);
          setTimeout(() => {
            clearInterval(timer);

            this.setState({ isDisabled: false });
          }, 60000);
        }
      },
    });
  };

  /**
   * 确认删除
   */
  saveClass = () => {
    const { loginUserInfo, inputCode, modalData } = this.state;
    const { dispatch } = this.props;
    // 效验验证码
    dispatch({
      type: namespace + "/verificationCode",
      payload: { phoneNumber: loginUserInfo.phone, validateCode: inputCode },
      callback: (res) => {
        if (res.code === 200) {
          // 删除教师账号
          dispatch({
            type: namespace + "/batchDelete",
            payload: { ids: String(modalData) },
            callback: (res) => {
              console.log(res, "删除");
              if ((res = "删除成功")) {
                this.handleClassVisible(false);
                this.setState({ inputCode: null });
                this.props.handleClick();
                this.props.onSelectChange();
                message.success(res);
              } else {
                message.error(res);
              }
            },
          });
        } else {
          message.error("验证码错误请重新输入！");
        }
      },
    });
  };

  render() {
    const { visible, loginUserInfo, inputCode, isDisabled, countdown } =
      this.state;

    //表单样式
    const FormItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <div>
        <Modal
          title="身份验证"
          visible={visible}
          onOk={this.saveClass}
          onCancel={() => this.handleClassVisible(false)}
        >
          <div style={{ margin: "20px 0" }}>
            请输入
            {`${loginUserInfo.phone?.substr(
              0,
              3
            )}****${loginUserInfo.phone?.substr(-4)}`}
            接收到的验证码
          </div>
          <Row gutter={[12, 0]}>
            <Col span={12}>
              <Input
                value={inputCode}
                onChange={(e) => this.onInputChange(e)}
                placeholder="请输入验证码"
              />
            </Col>
            <Col span={12}>
              <Button
                type="primary"
                disabled={isDisabled}
                onClick={() => this.getCode({}, 1)}
              >
                {isDisabled ? `${countdown}秒后再次获取` : "获取验证码"}
              </Button>
            </Col>
          </Row>
          <YpRiddlerRender
            onRef={this.onRefYpRiddlerRender}
            sendCheckCode={this.getCode}
          />
        </Modal>
      </div>
    );
  }
}
