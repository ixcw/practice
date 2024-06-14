/**
 * 视频播放器
 * @author:熊伟
 * @date:2020年9月1日
 * @version:v1.0.0
 * */
import React, { Component } from 'react';
import Page from "@/components/Pages/page";
import WrongPage from '../index';
export default class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    const title = '403';
    const breadcrumb = [title];
    const header = (
      <Page.Header breadcrumb={breadcrumb} title={title} />
    );

    return (
      <Page header={header} >
        <WrongPage type='403' />
      </Page>
    )
  }
}



