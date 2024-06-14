/**
* 预览导出-头部导出设置
* @author:张江
* @date:2020年08月31日
* @version:v1.0.0
* */

// eslint-disable-next-line
import React from 'react';
import {
  Button,
  Radio,
  Modal
} from 'antd';
import { routerRedux } from 'dva/router';
import { ExportOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { saveFileToBlob } from 'web-downloadfile';
import { watermark } from '@/utils/utils';
import classNames from 'classnames';
import styles from './index.less';
import isToDesktopCache from "@/caches/isToDesktop";//是否是桌面端记录缓存
import { MyQuestionGroup as namespace } from '@/utils/namespace'
import userInfoCache from '@/caches/userInfo';//登录用户的信息
const { confirm } = Modal;

export default class TopSetPrint extends React.Component {
  static propTypes = {
    isShowWatermark: PropTypes.any,//是否显示 选择是否显示水印
    pdfType: PropTypes.number, //1是试卷  2是答题卡 3答案解析 默认试卷
  };


  constructor() {
    super(...arguments);
    this.state = {
      radioValue: '1',
    };
  }

  /**
  * 选择是否显示水印 默认显示
  * @param e  ：事件参数
  */
  onRadioChange = e => {
    this.setState({
      radioValue: e.target.value,
    });
  };

  render() {
    const {
      isShowWatermark,
      pdfType = 1, //1是试卷  2是答题卡 3答案解析 默认试卷
      location,
      dispatch
    } = this.props;

    const { radioValue } = this.state
    const { search } = location;
    const query = queryString.parse(search) || {};
    const handlePrint = () => {
      const isToDesktop = isToDesktopCache();
      const hasWatermark = radioValue == 1;//是否加水印
      const userInfo = userInfoCache() || {};
      const isMember = userInfo.member;//是会员
      //  @ts-ignore
      if (window._czc) {
        //  @ts-ignore
        window._czc.push(['_trackEvent', `${window.$systemTitleName}-预览导出`, '导出']);
      }

      // 调用渲染服务的接口-下载导出收费 2022年01月24日 张江 start
      if (isMember || userInfo.code !== "STUDENT") {//会员或者非学生角色可以直接下载
        const title = `${query.paperName}${pdfType == 2 ? '-答题卡' : pdfType == 3 ? '-答案解析' : ''}`
        dispatch({// 通过题组id获取题目列表
          type: namespace + '/downloadExportPDF',
          payload: {
            paperId: query.id,
            pdfType,
            hasWatermark,
            title,
            isCommon: true,
          },
          callback: (result) => {
            saveFileToBlob(result, title, 'pdf')
          }
        });
        return;
      } else {
        confirm({
          title: '提示',
          content: '会员专享功能，快来解锁试试吧！',
          okText: '会员解锁',
          onOk() {
            dispatch(routerRedux.push('/pay-center'))
          },
          onCancel() { },
        });
      }
      // 调用渲染服务的接口-下载导出收费 2022年01月24日 张江

      // // 调用渲染服务的接口-桌面端下载导出pdf 2021年10月12日 张江 start
      // if (isToDesktop) {
      //   const title = `${query.paperName}${pdfType == 2 ? '-答题卡' : pdfType == 3 ? '-答案解析' : ''}`
      //   dispatch({// 通过题组id获取题目列表
      //     type: namespace + '/downloadExportPDF',
      //     payload: {
      //       paperId: query.id,
      //       pdfType,
      //       hasWatermark,
      //       title,
      //       isCommon:true,
      //     },
      //     callback:(result)=>{
      //       saveFileToBlob(result, title,'pdf')
      //     }
      //   });
      //   return;
      // }
      // // 调用渲染服务的接口-桌面端下载导出pdf 2021年10月12日 张江 end

      // if (hasWatermark) {
      //   watermark({ "watermark_txt": "" });
      // }
      // window.print();
      // if (hasWatermark) {
      //   watermark({ "watermark_txt": " " }, true);
      // }
    };
    const options = [
      { label: '是', value: '1' },
      { label: '否', value: '2' },
    ];

    return (
      <div className={classNames(styles['header-info-box'], 'no-print')}>
        <div className={styles['info-box']}>
          {
            isShowWatermark ? <div>
              <label>是否显示水印：</label>
              <Radio.Group options={options} onChange={this.onRadioChange} value={radioValue} />
            </div> : null
          }
          <Button 
            onClick={() => { window.history.go(-1) }}
            >返回</Button>
          <Button
            style={{ marginLeft: 5 }}
            onClick={() => {}}
            >编辑试题</Button>
          <Button
            style={{ marginLeft: 5 }}
            type="primary"
            onClick={() => {}}
            >保存试题</Button>
          <Button
            style={{ marginLeft: 5 }}
            type="primary"
            onClick={() => { handlePrint() }}
            >保存并打印试题</Button>
        </div>
      </div>
    )
  }
}

