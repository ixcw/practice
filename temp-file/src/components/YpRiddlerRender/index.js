/**
 * 滑动滑块验证
 * @author:张江
 * @date:2020年10月21日
 * @version:v1.0.0
 * */
// import React from 'react';
// import { message } from 'antd';

// class YpRiddlerRender extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {}
//   }

//   // componentWillMount() {

//   // }

//   componentDidMount() {
//     this.initYpRiddler();
//   }

//   initYpRiddler() {
//     const { sendCheckCode, idString = 'YpRiddler-container' } = this.props;
//     const idStringLabel = document.getElementById(idString);
//     if (!idStringLabel) {
//       return;
//     }
//     // 语言模版
//     const LANG_OTHER = {
//       'YPcaptcha_01': '请点击按钮开始验证',
//       'YPcaptcha_02': '请按顺序点击:',
//       'YPcaptcha_03': '向右拖动滑块完成拼图',
//       'YPcaptcha_04': '验证失败，请重试',
//       'YPcaptcha_05': '验证成功',
//       lang:'zh-cn'
//     }
//     const YpRiddlerOption = {
//       expired: 10,
//       mode: 'dialog',
//       winWidth: 500,
//       // lang: 'zh-cn', // 界面语言, 目前支持: 中文简体 zh-cn, 英语 en
//       langPack: LANG_OTHER, // 你可以通过该参数自定义语言包, 其优先级高于lang
//       container: idStringLabel,
//       appId: '8b9a1097b17f4ae7bd70bf7802c492e5',
//       version: 'v1',
//       noButton: true,
//       onError: function (param) {
//         if (!param.code) {
//           console.error('错误请求');
//         }
//         else if (parseInt(param.code / 100,10) == 5) {
//           // 服务不可用时，开发者可采取替代方案
//           // console.error('验证服务暂不可用');
//           message.error("验证服务暂不可用，请稍后再试或联系客服！")
//         }
//         else if (param.code == 429) {
//           // console.warn('请求过于频繁，请稍后再试');
//           message.error("请求过于频繁，请稍后再试！")
//         }
//         else if (param.code == 403) {
//           message.error("请求受限，请稍后再试！")
//         }
//         else if (param.code == 400) {
//           // console.warn('非法请求，请检查参数');
//           message.error("验证异常！请稍后重试！")
//         }
//         // 异常回调
//         message.error("验证异常！请稍后重试！")
//       },
//       onSuccess: function (validInfo, close, useDefaultSuccess) {
//         // 成功回调
//         // alert('验证通过! token=' + validInfo.token + ', authenticate=' + validInfo.authenticate)
//         sendCheckCode({ type: 'onSuccess', ...validInfo, }, undefined)
//         // 验证成功默认样式
//         useDefaultSuccess(true)
//         close()
//       },
//       onFail: function (code, msg, retry) {
//         // 失败回调
//         // alert('出错啦：' + msg + ' code: ' + code)
//         retry()
//       },
//       beforeStart: function (next) {
//         console.log('验证马上开始')
//         sendCheckCode({ type: 'beforeStart' }, next)
//       },
//       onExit: function () {
//         // 退出验证 （仅限dialog模式有效）
//         console.log('退出验证')
//       }
//     }
//     new window.YpRiddler(YpRiddlerOption);
//   }

//   render() {
//     return null;
//   }

// }
// export default YpRiddlerRender


/**
 * 自定义滑动滑块验证
 * @author:张江
 * @date:2022年03月18日
 * @version:v1.0.0
 * */
import React, { Component } from 'react'
import {
  getPicture, reqCheck
} from '@/services/public/public';
import './index.less';
import CryptoUtils from "@/utils/CryptoUtils";
import { CSSTransition } from 'react-transition-group';

class VerifySlideFixed extends Component {

  captchaRef = React.createRef();

  constructor(props) {
    super(props)
    this.state = {
      blockSize: {
        width: '50px',
        height: '50px'
      },
      setSize: {
        imgHeight: 200,
        imgWidth: 310,
        barHeight: 40,
        barWidth: 310,
      },
      backImgBase: '', // 验证码背景图片
      blockBackImgBase: '', // 验证滑块的背景图片
      backToken: '', // 后端返回的唯一token值
      startMoveTime: "",    //移动开始的时间
      endMovetime: '',      //移动结束的时间
      tipsBackColor: '',    //提示词的背景颜色
      secretKey: '', //后端返回的加密秘钥 字段
      captchaType: 'blockPuzzle',
      moveBlockBackgroundColor: 'rgb(255, 255, 255)',
      leftBarBorderColor: '',
      iconColor: '',
      // barAreaLeft: 0,
      // barAreaOffsetWidth: 0,
      startLeft: null,
      moveBlockLeft: null,
      leftBarWidth: null,
      status: false,	    //鼠标状态
      isEnd: false,		//是够验证完成
      passFlag: '',
      tipWords: '',
      text: '向右滑动完成验证',
    }

  }

  componentDidMount() {
    this.props.onRef(this)
    this.uuid()
    this.getData()
    this.init()
  }

  showIsSlideShow() {
    this.refresh()
    this.setState({
      isSlideShow: true,
    })
  }
  // 初始话 uuid 
  uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var slider = 'slider-' + s.join("");
    var point = 'point-' + s.join("");
    // 判断下是否存在 slider
    // console.log(localStorage.getItem('slider'))
    if (!localStorage.getItem('slider')) {
      localStorage.setItem('slider', slider)
    }
    if (!localStorage.getItem('point')) {
      localStorage.setItem("point", point);
    }
  }
  init() {
    var _this = this

    window.removeEventListener("touchmove", function (e) {
      _this.move(e);
    });
    window.removeEventListener("mousemove", function (e) {
      _this.move(e);
    });

    //鼠标松开
    window.removeEventListener("touchend", function () {
      _this.end();
    });
    window.removeEventListener("mouseup", function () {
      _this.end();
    });

    window.addEventListener("touchmove", function (e) {
      _this.move(e);
    });
    window.addEventListener("mousemove", function (e) {
      _this.move(e);
    });

    //鼠标松开
    window.addEventListener("touchend", function () {
      _this.end();
    });
    window.addEventListener("mouseup", function () {
      _this.end();
    });
  }
  getData() {
    getPicture({ captchaType: this.state.captchaType, clientUid: localStorage.getItem('slider'), ts: Date.now() }).then(res => {
      // console.log(res)
      if (res.repCode == '0000') {
        this.setState({
          backImgBase: res.repData.originalImageBase64,
          blockBackImgBase: res.repData.jigsawImageBase64,
          backToken: res.repData.token,
          secretKey: res.repData.secretKey
        })
      }
      // 请求次数超限
      if (res.repCode == '6201') {
        this.setState({
          backImgBase: null,
          blockBackImgBase: null,
          leftBarBorderColor: '#d9534f',
          iconColor: '#fff',
          iconClass: 'icon-close',
          passFlag: false,
          tipWords: res.repMsg
        })
        setTimeout(() => {
          this.setState({
            tipWords: ''
          })
        }, 1000);
      }
    })
  }
  refresh = () => {
    this.getData()
    this.setState({
      moveBlockLeft: '',
      leftBarWidth: '',
      text: '向右滑动完成验证',
      moveBlockBackgroundColor: '#fff',
      leftBarBorderColor: '#337AB7',
      iconColor: '#fff',
      status: false,
      isEnd: false
    })
  }
  setBarArea = (event) => {
    let barAreaLeft = event && event.getBoundingClientRect().left
    let barAreaOffsetWidth = event && event.offsetWidth
    this.barAreaLeft = barAreaLeft
    this.barAreaOffsetWidth = barAreaOffsetWidth
  }

  start = (e) => {
    e = e || window.event
    let x;
    if (!e.touches) {  //兼容PC端 
      x = e.clientX;
    } else {           //兼容移动端
      x = e.touches[0].pageX;
    }
    // this.state.startLeft = Math.floor(x - this.state.barAreaLeft);
    // this.state.startMoveTime = +new Date();    //开始滑动的时间
    this.setState({
      startLeft: Math.floor(x - this.barAreaLeft),
      startMoveTime: +new Date()
    })
    if (this.state.isEnd == false) {
      this.setState({
        text: '',
        moveBlockBackgroundColor: '#337ab7',
        leftBarBorderColor: '#337AB7',
        iconColor: '#fff',
        status: true
      })
      this.text = ''
      e.stopPropagation();
    }
  }

  move = (e) => {
    e = e || window.event;
    let x;
    if (this.state.status && this.state.isEnd == false) {
      if (!e.touches) {
        //兼容PC端
        x = e.clientX;
      } else {
        //兼容移动端
        x = e.touches[0].pageX;
      }
      var bar_area_left = this.barAreaLeft;
      var move_block_left = x - bar_area_left; //小方块相对于父元素的left值
      if (move_block_left >= this.barAreaOffsetWidth - parseInt(parseInt(this.state.blockSize.width, 10) / 2, 10) - 2) {
        move_block_left = this.barAreaOffsetWidth - parseInt(parseInt(this.state.blockSize.width, 10) / 2, 10) - 2;
      }
      if (move_block_left <= 0) {
        move_block_left = parseInt(this.state.blockSize.width / 2, 10);
      }
      //拖动后小方块的left值
      // this.state.moveBlockLeft = (move_block_left - this.state.startLeft) + "px"
      // this.state.leftBarWidth = (move_block_left - this.state.startLeft) + "px"
      this.setState({
        moveBlockLeft: (move_block_left - this.state.startLeft) + "px",
        leftBarWidth: (move_block_left - this.state.startLeft) + "px",
      })
      // this.setState({
      //   moveBlockLeft: this.state.moveBlockLeft,
      //   leftBarWidth: this.state.leftBarWidth
      // })
    }
  }

  end = () => {
    // this.state.endMovetime = +new Date();
    this.setState({
      endMovetime: +new Date()
    })
    const { secretKey } = this.state
    var _self = this;
    const { sendCheckCode } = this.props
    //判断是否重合
    if (this.state.status && this.state.isEnd == false) {
      var moveLeftDistance = parseInt((this.state.moveBlockLeft || '').replace('px', ''), 10);
      moveLeftDistance = moveLeftDistance * 310 / parseInt(this.state.setSize.imgWidth, 10)
      let data = {
        captchaType: this.state.captchaType,
        "pointJson": secretKey ? CryptoUtils.aesEncrypt(JSON.stringify({ x: moveLeftDistance, y: 5.0 }), secretKey) : JSON.stringify({ x: moveLeftDistance, y: 5.0 }),
        "token": this.state.backToken,
        clientUid: localStorage.getItem('slider'),
        ts: Date.now()
      }
      reqCheck(data).then(res => {
        if (res.repCode == "0000") {
          // this.state.isEnd = true;
          // this.state.passFlag = true
          // this.state.tipWords =
          //   this.setState({
          //     tipWords: `${((this.state.endMovetime - this.state.startMoveTime) / 1000).toFixed(2)}s验证成功`
          //   })
          const repData = res.repData;
          this.setState({
            isEnd: true,
            passFlag: true,
            tipWords: `${((this.state.endMovetime - this.state.startMoveTime) / 1000).toFixed(2)}s验证成功`,
          })
          setTimeout(() => {
            this.setState({
              tipWords: '',
            },)
            this.closeBox();
            sendCheckCode({
              token: repData.token, authenticate: `${secretKey};${repData.pointJson}`
            }, 2)
          }, 1000)
        } else {
          this.setState({
            isEnd: true,
            moveBlockBackgroundColor: '#d9534f',
            leftBarBorderColor: '#d9534f',
            iconColor: '#fff',
            iconClass: 'icon-close',
            passFlag: false,
            tipWords: res.repMsg || '验证失败'
          })
          setTimeout(() => {
            this.refresh();
            this.setState({
              tipWords: ''
            })
          }, 1000);
        }
      })
      // this.state.status = false;
      this.setState({
        status: false,
      })
    }
  }

  closeBox = () => {
    this.setState({
      isSlideShow: false,
    })
  }

  render() {
    const { vSpace, barSize, transitionWidth, finishText, transitionLeft, imgSize } = this.props;
    const { backImgBase, isSlideShow } = this.state;
    return (
      // 蒙层
      <div className="captcha-mask" style={{ display: isSlideShow ? 'block' : 'none' }}>
        <div className="verifybox" style={{ maxWidth: parseInt(imgSize.width, 10) + 30 + 'px' }}>
          <div className='verifybox-top'>
            请完成{window.$systemTitleName}安全验证
            <span className='verifybox-close' onClick={() => this.closeBox()}>
              <i className='iconfont icon-close'></i>
            </span>
          </div>
          <div className='verifybox-bottom' style={{ padding: '15px' }}>
            {/* 验证容器 */}
            <div style={{ position: 'relative' }} className='stop-user-select'>
              <div
                className='verify-img-out'
                style={{ height: parseInt(this.state.setSize.imgHeight, 10) + vSpace }}
              >
                <div
                  className='verify-img-panel'
                  style={{ width: this.state.setSize.imgWidth, height: this.state.setSize.imgHeight }}
                >
                  {backImgBase ? <img
                    src={'data:image/png;base64,' + backImgBase}
                    alt=""
                    style={{ width: '100%', height: '100%', display: 'block' }}
                  /> : <img
                    src={'https://reseval.gg66.cn/default.jpg'}
                    alt=""
                    style={{ width: '100%', height: '100%', display: 'block' }}
                  />}
                  <div
                    className='verify-refresh'
                    onClick={() => this.refresh()}
                  >
                    <i className='iconfont icon-refresh'></i>
                  </div>
                  <CSSTransition in={this.state.tipWords.length > 0} timeout={150} classNames="tips" unmountOnExit>
                    <span
                      className={
                        this.state.passFlag
                          ? `${'verify-tips'} ${'suc-bg'}`
                          : `${'verify-tips'} ${'err-bg'}`
                      }
                    >
                      {this.state.tipWords}
                    </span>
                  </CSSTransition>
                </div>
              </div>

              <div
                className='verify-bar-area'
                style={{ width: this.state.setSize.imgWidth, height: barSize.height, lineHeight: barSize.height }}
                ref={(bararea) => this.setBarArea(bararea)}
              >
                <span className='verify-msg'>{this.state.text}</span>
                <div
                  className='verify-left-bar'
                  style={{
                    width: this.state.leftBarWidth !== undefined ? this.state.leftBarWidth : barSize.height,
                    height: barSize.height,
                    borderColor: this.state.leftBarBorderColor,
                    transaction: transitionWidth,
                  }}
                >
                  <span className='verify-msg'>{finishText}</span>

                  <div
                    className='verify-move-block'
                    onTouchStart={(e) => this.start(e)}
                    onMouseDown={(e) => this.start(e)}
                    style={{
                      width: barSize.height,
                      height: barSize.height,
                      backgroundColor: this.state.moveBlockBackgroundColor,
                      left: this.state.moveBlockLeft,
                      transition: transitionLeft,
                    }}
                  >
                    <i
                      className='verify-icon iconfont icon-right'
                      style={{ color: this.state.iconColor }}
                    ></i>
                    <div
                      className='verify-sub-block'
                      style={{
                        width: Math.floor((parseInt(this.state.setSize.imgWidth, 10) * 47) / 310) + 'px',
                        height: this.state.setSize.imgHeight,
                        top: '-' + (parseInt(this.state.setSize.imgHeight, 10) + vSpace) + 'px',
                        backgroundSize: this.state.setSize.imgWidth + ' ' + this.state.setSize.imgHeight,
                      }}
                    >
                      <img
                        src={'data:image/png;base64,' + this.state.blockBackImgBase}
                        alt=""
                        style={{ width: '100%', height: '100%', display: 'block' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

VerifySlideFixed.defaultProps = {
  mode: 'fixed',
  vSpace: 5,
  imgSize: {
    width: '310px',
    height: '200px',
  },
  barSize: {
    width: '310px',
    height: '40px',
  },
  setSize: {
    imgHeight: 200,
    imgWidth: 310,
    barHeight: 0,
    barWidth: 0,
  }
};

export default VerifySlideFixed