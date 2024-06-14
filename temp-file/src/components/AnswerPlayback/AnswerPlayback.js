import React from 'react'
import SVG from 'svg.js'
import {Button, Modal, notification} from 'antd';
import "./AnswerPlayback.less"
import PropTypes from 'prop-types';
import {getStyle, getBrowserVersion, openNotificationWithIcon} from "@/utils/utils";

export default class AnswerPlayback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDrawing: false,
      svgState: undefined
    }
  }

  static propTypes = {
    penType: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),//作答轨迹解析方式【1是滕千里，2是拓思德】【无解析状态】
    answerTrajectory: PropTypes.array,//作答轨迹
    isPlayback: PropTypes.bool,//是否回放轨迹
    style: PropTypes.object,//样式配置对象
    index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),//如果页面出现多个轨迹渲染需要传入
  };

  componentDidMount() {
    const { answerTrajectory = [], penType = 1} = this.props;
    if (answerTrajectory) {
      setTimeout(() => {
        this.drawAnswer(this.handlePoints(answerTrajectory ? answerTrajectory : [], penType));
      }, 100)
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    const {answerTrajectory, penType, index} = nextProps;
    const proAnswerTrajectory = this.props;
    //重置掉svg画布
    let svg = null;
    svg = SVG(`playbackSvg${index}`).size(Math.abs(0), 0);
    //使用容器宽高，设置viewBox宽高
    svg.viewbox(0, 0, Math.abs(0) + 20, Math.abs(0));


    if (answerTrajectory && JSON.stringify(answerTrajectory) !== JSON.stringify(proAnswerTrajectory)) {
      //设置viewBoxSize的尺寸对象
      setTimeout(() => {
        this.drawAnswer(this.handlePoints(answerTrajectory, penType));
      }, 100)
    }
  }


  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   const {answerTrajectory, penType} = this.props;
  //   console.log("=======>传进来的", penType, answerTrajectory);
  //   if (penType && answerTrajectory && answerTrajectory.length > 0) {
  //     //设置viewBoxSize的尺寸对象
  //     this.drawAnswer(this.handlePoints(answerTrajectory, penType));
  //   }
  // }


  /**
   * 根据解析方式的不同，对数据处理，统一处理成拓思德的数据模式（千位的数据）
   * @param points
   * @return {Array}
   */
  handlePoints = (points, penType) => {
    let resultPoints = [];
    points && points.length > 0 && points.map(point => {
      let _cx = point.fx / 100 + point.x;
      let _cy = point.fy / 100 + point.y;
      let resultPoint = {
        cx: penType == 1 ? _cx * 30 : _cx,
        cy: penType == 1 ? _cy * 30 : _cy,
        type: point.type
      };
      resultPoints.push(resultPoint);
    })
    // console.log("处理后的点===》", resultPoints)
    return resultPoints;
  };


  /**
   * 获取数据列表中最小的点（即整个轨迹区域的左上角的最小点）
   * @return {{x: number, y: number}}：坐标点
   */
  getMinPoint = (points) => {
    let x = parseFloat(points[0].cx);
    let y = parseFloat(points[0].cy);
    for (let i = 0; i < points.length; i++) {
      let point = points[i];
      let tempX = parseFloat(point.cx)
      let tempY = parseFloat(point.cy)
      if (tempX < x) {
        x = tempX
      }
      if (tempY < y) {
        y = tempY
      }
    }
    return {x, y}
  }

  /**
   * 获取数据列表中最大的点（即整个轨迹区域的右下角的最大点）
   * @return {{x: number, y: number}}：坐标点
   */
  getMaxPoint = (points) => {
    let x = parseFloat(points[0].cx);
    let y = parseFloat(points[0].cy);
    for (let i = 0; i < points.length; i++) {
      let point = points[i]
      let tempX = parseFloat(point.cx)
      let tempY = parseFloat(point.cy)
      if (tempX > x) {
        x = tempX
      }
      if (tempY > y) {
        y = tempY
      }
    }
    return {x, y}
  }

  /**
   * 获取实际轨迹的viewBox，
   * @return viewBox {width: number, height: number, scale:number,minPoint:{x,y}, maxPoint:{x,y}}:包含宽度，高度，以及宽高比例的对象
   */
  getViewBox = (points) => {
    const viewBox = {};
    const minPoint = this.getMinPoint(points);
    const maxPoint = this.getMaxPoint(points);
    viewBox.minPoint = minPoint;
    viewBox.maxPoint = maxPoint;
    viewBox.width = Math.abs(maxPoint.x - minPoint.x);
    viewBox.height = Math.abs(maxPoint.y - minPoint.y);
    viewBox.scale = viewBox.width / viewBox.height;
    return viewBox;
  };


  drawAnswer = (points, play) => {
    const {index = ''} = this.props;
    let theSvg = document.getElementById(`playbackSvg${index}`);
    //1.获取回放区域的对象
    let playBackArea = document.getElementById(`playback-part${index}`);
    if (theSvg && playBackArea) {
      //2.获取容器区域的实际宽度
      const width = parseInt(playBackArea?.offsetWidth, 10);

      //获取viewBox的宽高
      const viewBox = this.getViewBox(points);
      const viewBoxWidth = viewBox.width;
      const viewBoxHeight = viewBox.height;
      //坐标点绘制的宽高比
      const viewBoxScale = viewBoxWidth / viewBoxHeight;
      //3.根据比例和已知容器宽度，计算容器高度
      let height = viewBox.width <= width ? viewBox.height + 60 : width / viewBoxScale + 60;
      let svg = null;

      //如果没有获取到svg的这个标签，则直接返回false，结束操作
      if (!theSvg) {
        openNotificationWithIcon("warning", "渲染作答轨迹失败！", "失败原因，在渲染作答轨迹时，需要渲染的dom节点不存在！", 3)
        return false;
      }
      svg = SVG(`playbackSvg${index}`).size(Math.abs(width), height);
      //使用容器宽高，设置viewBox宽高
      svg.viewbox(0, 0, Math.abs(width) + 20, Math.abs(height));

      svg.preserveAspectRatio = "xMidYMid meet";
      //将svg放入state，方便卸载组件的时候清理
      this.setState({
        svgState: svg
      })
      if (points && points.length > 0) {
        // console.log("最小点：", viewBox.minPoint);//勿删，调试用
        // console.log('最大的点', viewBox.maxPoint)//勿删，调试用
        if (SVG.supported) {
          theSvg.style.display = 'block';
          this.doDrawAnswerSvg(points, svg, viewBox, width, play)
        } else {
          theSvg.style.display = 'none'
        }
      } else {
        svg.clear()
      }
    }
  };


  isPlayingInfo = () => {
    Modal.info({
      title: '提示',
      content: (
        <div>
          <p>回放正在进行，请稍候...</p>
        </div>
      ),
      onOk() {
      },
    });
  };


  doDrawAnswerSvg = (points, svg, viewBox, width, play) => {
    let scale = viewBox.width / width;
    let draw = svg;
    if (SVG.supported) {
      draw.clear();
      this.setState({
        isDrawing: true
      });
      let lines = [];
      let line = [];
      for (let i = 0; i < points.length; i++) {
        let point = points[i]

        //判断作答轨迹是否下笔
        if (point.type === 'PEN_DOWN' || point.type === 'PEN_UP') {
          if (line.length > 0) {
            lines.push(line.join(" "))
          }
          line = []
        } else {
          let x = 0;
          let y = 0;
          //如果答题轨迹的宽度超过div
          // console.log("ViewBox：", viewBox)//勿删，调试用
          // console.log("divBox：", width)//勿删，调试用
          if (viewBox.width <= width || viewBox.width <= 1000) {
            x = parseFloat(point.cx - viewBox.minPoint.x) / 4;
            y = parseFloat(point.cy - viewBox.minPoint.y) / 4;
          } else {
            // console.log("按比例缩放")//勿删
            x = parseFloat(point.cx - viewBox.minPoint.x) / scale;
            y = parseFloat(point.cy - viewBox.minPoint.y) / scale;
          }
          line.push(`${x}, ${y}`);
        }
        if (i === points.length - 1) {
          lines.push(line.join(" "))
        }
      }
      // console.log('line',lines)
      lines.map(it => {
        draw.polyline(it).fill('none').stroke({width: 2, color: '#666'})
      });
      this.setState({
        isDrawing: false
      });
    }
    if (play) {
      let supportedVersion = getBrowserVersion().supported;
      if (supportedVersion) {
        this.doPlay()
      }
    }
  };

  doPlay = () => {
    const {index = ''} = this.props;
    this.setState({
      isDrawing: true
    }, () => {
      let svgTag = document.getElementById(`playbackSvg${index}`);
      let strokes = [];
      let polylines = svgTag.getElementsByTagName(`polyline${index}`);
      let j = 0;
      for (let i = 0; i < polylines.length; i++) {
        if (polylines[i].getTotalLength) {
          strokes[i] = polylines[i].getTotalLength();
        }
        polylines[i].style.strokeDashoffset = polylines[i].getTotalLength();
        polylines[i].style.strokeDasharray = polylines[i].getTotalLength();
      }
      this.setState({
        isDrawing: true
      });

      function strokeAnimation(svgEle, polylineDist, context) {
        let svgDom = svgEle.animate([
            {strokeDashoffset: polylineDist}, {strokeDashoffset: '0'}],
          {duration: polylineDist * 10, fill: 'forwards'}
        )

        svgDom.onfinish = function () {
          j++;
          if (polylines[j]) {
            strokeAnimation(polylines[j], polylines[j].getTotalLength(), context);
          }
          if (j >= polylines.length) {
            context.setState({
              isDrawing: false
            });
          }
        }
      }

      strokeAnimation(polylines[0], strokes[0], this);
    });
  };


  playbackHistory = () => {
    this.drawAnswer(this.handlePoints(this.props.answerTrajectory, this.props.penType), true);
  };


  render() {
    const {answerTrajectory, isPlayback = true, index = ''} = this.props;
    const {isDrawing} = this.state;
    const svgStyle = {
      backgroundColor: answerTrajectory ? '#f9f9f9' : '',
      border: answerTrajectory ? 'solid 1px #cecece' : '',
      height: answerTrajectory ? 'auto' : 0
    }
    return (
      <div className="answerlAyback">
        <div id={`playback-part${index}`} className="playback" style={{...this.props.style}}>
          <div className="answerlAybackHearder">
            <p style={{fontWeight: 'bold', fontSize: 16}}>作答轨迹：</p>
            {
              isPlayback && answerTrajectory
                ?
                <Button type="primary" onClick={() => {
                  if (!isDrawing) {
                    this.playbackHistory()
                  } else {
                    this.isPlayingInfo()
                  }
                }}>作答回放</Button>
                : ""
            }
          </div>
          <div>
            {
              !answerTrajectory ? <p>本题暂无作答轨迹...</p> : ""
            }
            <svg className="footSvg" id={`playbackSvg${index}`} style={svgStyle}/>
          </div>
        </div>
      </div>
    )
  }
}

