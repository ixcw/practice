/**
* 题目图片修改组件
* @author:张江
* @date:2020年11月11日
* @version:v1.0.0
* */

// eslint-disable-next-line
import React from 'react';
import PropTypes from 'prop-types';
import {
  Radio,
  notification,
  Upload,
  Modal,
  Spin,
  message,
  InputNumber,
  Popover,
  Button
} from 'antd';
import { questionBankImageType } from '@/utils/const';
import MarkdownRender from "../MarkdownRender/MarkdownRender";
import { existArr, dealQuestionRender, dealQuestionEdit, dealFieldName } from '@/utils/utils';
import userInfoCache from '@/caches/userInfo';
import QuestionParseUtil from "../MarkDown/QuestionParseUtil";
import styles from './EditImageModal.less';
import { connect } from "dva";
import { QuestionBank as namespace } from "@/utils/namespace";
import { InboxOutlined } from '@ant-design/icons';
const { confirm } = Modal;

const { Dragger } = Upload;
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

@connect(state => ({
  loading: state[namespace].loading,
}))

export default class EditImageModal extends React.Component {
  static propTypes = {
    QContent: PropTypes.object.isRequired,//题目信息
    editImgvisible: PropTypes.bool.isRequired,//是否显示上传弹框
    hideEditImgvisible: PropTypes.func.isRequired,//上传弹框操作隐藏
    updateQuestionImage: PropTypes.func.isRequired,//修改题目图片
  };


  constructor(props) {
    super(...arguments);
    this.state = {
      previewImage: null,
      editType: '2',
      file: {},
      QuestionPartInfo: {},
      judgeQuestionPartInfo: {},
      QuestionPartInfoLoding: false,
      imgOperType: 1,//1 替换 2删除 3在前添加 4在后添加
      toBeDeletedList: [],
    };
  }

  componentDidMount() {
    const { QContent, editImgvisible } = this.props;
    const { editType } = this.state;
    if (QContent && QContent.id && editImgvisible) {
      this.setState({
        toBeDeletedList: []
      })
      this.getQuestionPartInfo(QContent.id, QContent.dataId && QContent.dataId > 0 ? editType : '3')
    }
  }

  getQuestionPartInfo = (questionId, type) => {
    const {
      location,
      dispatch,
    } = this.props;
    this.setState({
      editType: type,
      QuestionPartInfoLoding: true,
    })
    dispatch({
      type: namespace + '/getQuestionAllInfoById',
      payload: {
        questionId,
        type,
      },
      callback: (result) => {
        const returnJudge = window.$HandleAbnormalStateConfig(result);
        if (returnJudge && !returnJudge.isContinue) { return; };//如果异常 直接返回
        this.setState({
          QuestionPartInfo: result || {},
          QuestionPartInfoLoding: false,
          judgeQuestionPartInfo: JSON.parse(JSON.stringify(result || {})),
        })
      }
    });
  }

  //接收file对象
  handleReturn = (file, uploadType = 1, qIndex) => {
    if (JSON.stringify(file) === "{}") {
      notification.warn({
        message: '警告信息',
        description: '请先上传文件！',
      })
      return
    }
    const fileSize = file.size / 1024 / 1024 < 20;
    if (!fileSize) {
      notification.warn({
        message: '警告信息',
        description: `${file.name}文件大小超出20M，请修改后重新上传`,
      })
      return;
    }
    if (JSON.stringify(file) !== "{}" && file.name) {
      const fileSuffixA = file.name.split('.');
      const fileSuffix = fileSuffixA[fileSuffixA.length - 1];
      if (fileSuffix === 'png' || fileSuffix === 'jpg' || fileSuffix === 'jpeg') {
        this.setState({ file }, () => {
          if (uploadType == 1) {//没有图片时的上传处理
            this.uploadQuestionImage(uploadType, qIndex);
          }
        })
      } else {
        notification.warn({
          message: '警告信息',
          description: '请上传文件扩展名必须为：png jpg jpeg等！',
        })
      }
    }
    this.handlePreview(file);

  };

  /**
  * 上传图片预览
  * @param file  ：文件对象
  */
  handlePreview = async file => {
    let preview = null
    if (!file.url) {
      preview = await getBase64(file);
    }
    this.setState({
      previewImage: file.url || preview,
    });
  };

  /**
  * 编辑类型选择
  * @param value  ：编辑类型值
  */
  editChange = ({ target: { value } }) => {
    const { QContent } = this.props;
    const { QuestionPartInfo, judgeQuestionPartInfo, editType } = this.state;
    const _self = this;
    const getQuestionPartInfo = () => {
      _self.hideuploadImgvisible();
      _self.setState({
        editType: String(value),
        toBeDeletedList: []
      }, () => {
        if (QContent && QContent.id) {
          _self.getQuestionPartInfo(QContent.id, value)
        }
      })
    }

    if (JSON.stringify(QuestionPartInfo) != JSON.stringify(judgeQuestionPartInfo) && editType != value) {
      this.setState({
        editType,
      })
      confirm({
        title: '当前类型数据已有改动,但是未保存,切换到其他类型当前类型数据将会丢失,确定切换其他类型吗？',
        content: '',
        onOk() {
          getQuestionPartInfo();
        },
        onCancel() { },
      });
    } else {
      getQuestionPartInfo();
    }
  }


  // 确定保存题目的图片 按顺序
  saveQuestionImage = () => {
    const {
      dispatch,
      updateQuestionImage,
      hideEditImgvisible } = this.props
    const { editType, QuestionPartInfo, toBeDeletedList, judgeQuestionPartInfo } = this.state;
    if (!QuestionPartInfo) {
      return;
    }
    if (JSON.stringify(QuestionPartInfo) == JSON.stringify(judgeQuestionPartInfo)) {//值没有变化时 不改动
      hideEditImgvisible();
      return;
    }

    // 处理去掉content字段
    let tempQuestionPartInfo = []
    if (existArr(QuestionPartInfo)) {
      tempQuestionPartInfo = QuestionPartInfo.map((item) => {
        return {
          id: item.id,
          contentPng: item.contentPng,
        }
      })
    } else {
      tempQuestionPartInfo = [{
        id: QuestionPartInfo.id,
        contentPng: QuestionPartInfo.contentPng,
      }]
    }

    const callback = () => {
      hideEditImgvisible();
      const fileName = toBeDeletedList.join(',');
      if (!fileName) {
        return;
      }
      dispatch({
        type: namespace + '/deleteQiNiuImgByFileName',
        payload: {
          fileName,
        },
        callback: () => {
          this.setState({
            toBeDeletedList: []
          })
        }
      });
    }
    let payload = {
      // questionImgVo: {
      type: editType,
      list: tempQuestionPartInfo
      // },
    }

    dispatch({//修改题目图片
      type: namespace + '/updateQuestionAllImgById',
      payload: payload,
      callback: (result) => {
        const returnJudge = window.$HandleAbnormalStateConfig(result);
        if (returnJudge && !returnJudge.isContinue) { return; };//如果异常 直接返回
        callback();
        message.success('图片修改保存成功');
        updateQuestionImage(payload, callback)
      }
    });
    // updateQuestionImage(payload, callback)
  }


  /**
  * 获取输入的图片大小
  * @param event  ：图片大小输入值
  * @param imgUrlId  ：图片id地址
  * @param imgUrlsA  ：图片解析数组
  * @param imgIndex  ：小题选项类型下标
  */
  onInputNumberChange = (event, imgUrlId, imgUrlsA, imgIndex) => {
    const { QuestionPartInfo } = this.state;
    imgUrlsA.map((item, index) => {
      let tempItem = '';
      let contentPng = '';//图片拼接
      if (item) {
        if (existArr(item.urlList)) {
          item.urlList.map((imgItem) => {
            const urlItem = imgItem.imgUrl;//图片地址
            const imgWidth = imgItem.imgWidth;//图片大小
            tempItem = urlItem;
            const dealImageWidth = (width) => {
              if (!width || !Number(width)) {
                tempItem = urlItem;
                return;
              }
              if (urlItem.includes('?')) {
                const itemArray = urlItem.split('?')
                tempItem = itemArray[0] + '?' + width
              } else {
                tempItem = urlItem + '?' + width
              }
            }
            if (imgUrlId == urlItem) {
              dealImageWidth(event)
            } else {
              dealImageWidth(imgWidth)
            }
            contentPng = (contentPng ? contentPng + ',' : contentPng) + tempItem;
          })

        } else {
          contentPng = '';
        }

        if (existArr(QuestionPartInfo)) {
          if (index == imgIndex) {
            QuestionPartInfo[imgIndex].contentPng = contentPng;
            if (!contentPng) {
              QuestionPartInfo[imgIndex].content = QuestionPartInfo[imgIndex].content && QuestionPartInfo[imgIndex].content.replace(new RegExp("\\[myImgCur\\]", "g"), " ")
            }
          }
        } else {
          QuestionPartInfo.contentPng = contentPng;
          if (!contentPng) {
            QuestionPartInfo.content = QuestionPartInfo.content && QuestionPartInfo.content.replace(new RegExp("\\[myImgCur\\]", "g"), " ")
          }
        }
      }
    })
    this.setState({
      QuestionPartInfo,
      imgUrlsA
    })
  }

  /**
  * 渲染题目材料与图片
  */
  renderQuestionImage = () => {
    const { QuestionPartInfo } = this.state;
    if (existArr(QuestionPartInfo)) {
      return (<div className='render-image-box'>
        {
          QuestionPartInfo.map((it, index) => (
            <div key={index} style={{ margin: '0 20px 0px 0px' }}>
              <div style={{ display: 'flex' }}>
                <span style={{ marginRight: 5 }}>{it.code ? it.code : ''}</span>
                {
                  it.content || it.contentPng ? <MarkdownRender
                    source={QuestionParseUtil.fixContent(it.content, dealQuestionRender(it.contentPng, true))}
                    escapeHtml={false} skipHtml={false}
                  /> : null
                }
              </div>
              {it.content && it.content.includes('[myImgCur]') ? null : dealQuestionRender(it.contentPng)}
            </div>
          ))
        }
      </div>)
    } else {
      return (<div className='render-image-box'>
        {
          QuestionPartInfo.content || QuestionPartInfo.contentPng ?
            <MarkdownRender
              source={QuestionParseUtil.fixContent(QuestionPartInfo.content ? QuestionPartInfo.content : '', dealQuestionRender(QuestionPartInfo.contentPng, true))}
              escapeHtml={false} skipHtml={false}
            />
            : '暂无内容'
        }
        {QuestionPartInfo.content && QuestionPartInfo.content.includes('[myImgCur]') ? null : dealQuestionRender(QuestionPartInfo.contentPng)}
      </div>)
    }
  }

  /**
  * 渲染题目图片列表
  */
  renderTypeImageList = () => {
    const { previewImage, editType, QuestionPartInfo, uploadImgvisible } = this.state
    const userInfo = userInfoCache();
    const qiniuPath = userInfo && userInfo.qiniuPath ? userInfo.qiniuPath : 'https://resformalqb.gg66.cn/';
    let imgUrlsA = [];

    const dealImList = (QInfo) => {//处理图片的方法
      const tempimgUrlsA = QInfo.contentPng && QInfo.contentPng.includes(',') ? QInfo.contentPng.split(',') : QInfo.contentPng ? [QInfo.contentPng] : [];
      let singleJson = {
        id: QInfo.id,
        code: QInfo.code || '',
        urlList: []
      }
      tempimgUrlsA.map((ItemUrl) => {//动态计算 获取图片的地址与宽度
        if (ItemUrl == 'null' || !ItemUrl) {
          return;
        }
        // 处理图片宽度 约定符号?  7a004ba838d04f14b685594a3d869ced.png?135
        let imgArray = ItemUrl.includes('?') ? ItemUrl.split('?') : ItemUrl;
        const tempItemUrl = existArr(imgArray) ? imgArray[0] : imgArray;
        const tempItemWidth = existArr(imgArray) ? imgArray[1] : '';
        const tempItemUrlJson = {
          imgUrl: tempItemUrl,
          imgWidth: tempItemWidth,
        }
        singleJson.urlList.push(tempItemUrlJson)
      })
      // if (existArr(singleJson.urlList)) {
      imgUrlsA.push(singleJson)
      // }
    }

    if (existArr(QuestionPartInfo)) {//小题/选项的情况
      QuestionPartInfo.map((questionItem) => {
        dealImList(questionItem)
      })
    } else {
      dealImList(QuestionPartInfo)
    }

    if (existArr(imgUrlsA)) {//渲染图片列表
      let tempIndex = 0;
      return (<div className='type-image-list'>
        { imgUrlsA.map((item, index) => {
          if (existArr(item.urlList)) {
            return item.urlList.map((imgItem, urlIndex) => {
              const urlItem = imgItem.imgUrl;
              tempIndex = tempIndex + 1
              const content = (
                <div className='oper-image-button'>
                  <span onClick={() => {
                    this.operImageAddDelReplace(3, item, urlIndex, imgUrlsA)
                  }}>在当前图片前添加</span>
                  <span onClick={() => {
                    this.operImageAddDelReplace(4, item, urlIndex, imgUrlsA)
                  }}>在当前图片后添加</span>
                </div>
              );
              return (
                <div key={tempIndex} className='image-item'>
                  <div>
                    <label>{item.code ? item.code + '--' : ''}{tempIndex}. {urlItem + ' ?'}</label>
                    <InputNumber min={30} max={580} placeholder='请输入宽度' value={imgItem.imgWidth || undefined} onChange={(e) => {
                      this.onInputNumberChange(e, urlItem, imgUrlsA, index)
                    }} />
                  </div>

                  <div className='image-box'>
                    <div className='image-oper'>
                      <span onClick={() => {
                        this.operImageAddDelReplace(1, item, urlIndex, imgUrlsA)
                      }}>替换</span>
                      <span onClick={() => {
                        this.operImageAddDelReplace(2, item, urlIndex, imgUrlsA)
                      }}>删除</span>
                      <Popover
                        content={content}
                        title=""
                        trigger="hover"
                        placement="bottom"
                      >
                        <span>添加</span>
                      </Popover>
                    </div>
                    <img src={qiniuPath + urlItem} alt='' />
                  </div>
                </div>
              )
            })

          } else {
            const uploadProps = {
              beforeUpload: (file) => { this.handleReturn(file, 1, index) },
              multiple: false,
              showUploadList: false,
            };
            return (<div className='image-item' key={index}>
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                {
                  item.code ? <h4>上传【{item.code}】图片</h4> : null
                }
                <p className="ant-upload-text">点击或将图片拖拽到这里上传</p>
              </Dragger>
            </div>)
          }
        })
        }
      </div>)
    } else {//没图片时可选择上传
      const tempQuestionPartInfo = QuestionPartInfo ? (existArr(QuestionPartInfo) ? JSON.parse(JSON.stringify(QuestionPartInfo)) : [QuestionPartInfo]) : []
      return (< div className='type-image-list' >
        {
          tempQuestionPartInfo.map((item, index) => {
            const uploadProps = {
              beforeUpload: (file) => { this.handleReturn(file, 1, index) },
              multiple: false,
              showUploadList: false,
            };
            return (<div className='image-item' key={index}>
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击或将图片拖拽到这里上传</p>
                {
                  previewImage ? <img alt="example" style={{ width: '160px', height: '160px' }} src={previewImage} /> : null
                }
              </Dragger>
            </div>)
          })
        }
      </div>)
    }
  }


  /**
  * 隐藏上传图片弹窗
  */
  hideuploadImgvisible = () => {
    this.setState({
      uploadImgvisible: false,
      previewImage: null,
      file: null
    })
  }

  /**
  * 隐藏上传图片弹窗
    * @param imgOperType  ：操作类型
    * @param imageItem  ：图片地址对象
    * @param imageIndex  ：图片地址下标
  */
  operImageAddDelReplace = (imgOperType, imageItem, imageIndex, imgUrlsA) => {
    const { toBeDeletedList } = this.state;
    const _self = this;
    this.setState({
      imgUrlsA
    })
    if (imgOperType == 1) {//替换图片
      confirm({
        title: '确认替换当前图片吗？',
        content: '',
        onOk() {
          _self.setState({
            uploadImgvisible: true,
            imgOperType,
            imageItem,
            imageIndex,
          })
        },
        onCancel() { },
      });

    } else if (imgOperType == 2) {//确认删除图片 本地操作
      confirm({
        title: '确认删除当前图片吗？',
        content: '',
        onOk() {
          for (const key in imgUrlsA) {
            const value = imgUrlsA[key];
            if (value.id == imageItem.id) {
              toBeDeletedList.push(value.urlList[imageIndex].imgUrl)
              value.urlList.splice(imageIndex, 1);
              _self.setState({
                imgUrlsA,
                toBeDeletedList
              }, () => {
                _self.onInputNumberChange(0, '', imgUrlsA, key)
              })
              break;
            }
          }
        },
        onCancel() { },
      });
    } else {
      this.setState({
        uploadImgvisible: true,
        imgOperType,
        imageItem,
        imageIndex,
      })
    }

  }


  // 上传图片信息
  uploadQuestionImage = (uploadType, qIndex) => {
    const {
      dispatch,
      hideEditImgvisible
    } = this.props
    const {
      editType,
      file,
      QuestionPartInfo,
      imgOperType,
      imageItem,
      imageIndex, imgUrlsA } = this.state;
    if (JSON.stringify(file) === "{}" || file == null) {
      notification.warn({
        message: '警告信息',
        description: '请先选择上传的文件！',
      })
      return
    }
    let formData = new FormData();
    formData.append('file', file);
    if (uploadType == 1 && qIndex != -1) {//没有任何图片 上传时操作
      dispatch({
        type: `${namespace}/uploadQuestionImg`,
        payload: {
          formData: formData,
        },
        callback: (result) => {
          if (existArr(QuestionPartInfo)) {
            QuestionPartInfo[qIndex].contentPng = result;
          } else {
            QuestionPartInfo.contentPng = result;
          }
          this.setState({
            QuestionPartInfo,
          })
          message.success("上传成功!")
          this.hideuploadImgvisible();
        }
      })
    } else if (imgOperType == 1) {//替换操作
      formData.append('fileName', imageItem.urlList[imageIndex].imgUrl);
      dispatch({
        type: `${namespace}/uploadQuestionImg`,
        payload: {
          formData: formData,
        },
        callback: (result) => {
          for (const key in imgUrlsA) {
            const value = imgUrlsA[key];
            if (value.id == imageItem.id) {
              imgUrlsA[key].urlList[imageIndex].imgUrl = result;
              this.setState({
                imgUrlsA
              })
              this.onInputNumberChange(0, '', imgUrlsA, key);
              message.success("替换成功!")
              this.hideuploadImgvisible();
              break;
            }
          }
        }
      })
    } else if (imgOperType == 3 || imgOperType == 4) {//在图片前后添加图片
      dispatch({
        type: `${namespace}/uploadQuestionImg`,
        payload: {
          formData: formData,
        },
        callback: (result) => {
          for (const key in imgUrlsA) {
            const value = imgUrlsA[key];
            let urlList = imgUrlsA[key].urlList;
            let imgUrlInfo = JSON.parse(JSON.stringify(urlList[imageIndex]))
            imgUrlInfo.imgUrl = result;
            if (value.id == imageItem.id) {
              if (imgOperType == 3) {//在当前图片之前添加
                urlList.splice(imageIndex, 0, imgUrlInfo)
              } else if (imgOperType == 4) {//在当前图片后添加
                urlList.splice(imageIndex + 1, 0, imgUrlInfo)
              }
              imgUrlsA[key].urlList = urlList;
              this.setState({
                imgUrlsA
              })
              this.onInputNumberChange(0, '', imgUrlsA, key);
              this.hideuploadImgvisible();
              message.success("添加成功!")
              break;
            }
          }
        }
      })
    }
  }

  render() {
    const {
      hideEditImgvisible,
      editImgvisible,
      QContent,
      loading
    } = this.props;
    const {
      previewImage,
      editType,
      QuestionPartInfo,
      QuestionPartInfoLoding,
      uploadImgvisible,
      imgOperType,
    } = this.state
    const uploadProps = {
      beforeUpload: (file) => { this.handleReturn(file, editType, -1) },
      multiple: false,
      showUploadList: false,
    };

    return (
      <div className={styles['edit-image-box']}>
        <Modal
          title="修改图片"
          visible={editImgvisible}
          onOk={this.saveQuestionImage}
          onCancel={hideEditImgvisible}
          okText="确认"
          cancelText="取消"
          maskClosable={false}
          width={'90%'}
        >
          <Spin tip="加载中..." spinning={!!QuestionPartInfoLoding || !!loading}>
            <div style={{ textAlign: 'center' }}>
              <Radio.Group value={editType} buttonStyle="solid" onChange={this.editChange}>
                {
                  questionBankImageType.map((item) => {
                    if (QContent && (Number(QContent.dataId) < 0 || Number(QContent.dataId) == 0) && item.code == 2) {
                      return null;
                    } else if (QContent && !existArr(QContent.optionList) && item.code == 4) {
                      return null;
                    } else {
                      return (<Radio.Button value={String(item.code)} key={item.code}>{item.name}</Radio.Button>)
                    }
                  })
                }
              </Radio.Group>
            </div>

            <div className='upload-content-box'>
              {/* 左边题目渲染 */}
              {this.renderQuestionImage()}
              {/* 右边图片列表 */}
              <div className='type-image-list-box'>
                {
                  this.renderTypeImageList()
                }
              </div>
            </div>
            <Modal
              title={imgOperType == 1 ? "替换图片" : imgOperType == 2 ? "删除图片" : imgOperType == 3 ? "在当前图片前添加" : imgOperType == 4 ? "在当前图片后添加" : "修改图片"}
              visible={uploadImgvisible}
              onCancel={this.hideuploadImgvisible}
              footer={[
                <Button key='cancel' onClick={this.hideuploadImgvisible} loading={!!loading}>取消</Button>,
                <Button key='ok' type="primary" onClick={this.uploadQuestionImage} loading={!!loading}>上传</Button>
              ]}
              maskClosable={false}
            >
              <Spin tip="正在上传,请稍候..." spinning={!!loading}>
                <div className='upload-image-box'>
                  <Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">点击或将图片拖拽到这里上传</p>
                    {
                      previewImage ? <img alt="example" style={{ width: '160px', height: '160px' }} src={previewImage} /> : null
                    }
                  </Dragger>
                </div>
              </Spin>
            </Modal>
          </Spin>
        </Modal>
      </div>
    )
  }
}

