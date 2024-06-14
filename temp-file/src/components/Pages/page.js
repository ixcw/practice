import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb, Spin, Icon } from 'antd';
import classnames from 'classnames';
import Flex from '../Flex';
import './Page.less';

const prefixCls = "page-wrapper";

export default function Page({ children, header, footer, loading }) {
  return (
    <Spin spinning={!!loading} className='page-spin' tip="正在加载中...">
      <Flex direction="column" className={prefixCls}>
        {header}
        <Flex isItem direction="column" className={prefixCls + '-main'}>
          {children}
        </Flex>
        {footer}
      </Flex>
    </Spin>
  );
}

Page.propTypes = {
  header: PropTypes.any,
  footer: PropTypes.any,
  loading: PropTypes.bool
};
Page.Header = function ({ breadcrumb, urls, title, operation, children, className, style }) {

  if (title && window.document.title !== title) { //只在标题不相同的时候设置
    window.document.title = title + '-' + window.$systemTitleName;
    //  @ts-ignore
    if (window._czc) {
      //  @ts-ignore
      window._czc.push(['_trackEvent', `${window.$systemTitleName}-${title}`, '查看']);
    }
  }
  const _className = classnames(prefixCls + '-header', className, 'no-print');

  return (
    <Flex className={_className} justify="space-around" align="middle" style={style}>
      {/* <div className={classnames(prefixCls + '-header-title', 'no-print')}>
        <Breadcrumb>
          {renderBreadcrumb(breadcrumb, urls)}
        </Breadcrumb>
      </div> */}
      <Flex.Item className={prefixCls + '-header-main'}>{children}</Flex.Item>
      {operation}
    </Flex>
  );
};

Page.Header.propType = {
  breadcrumb: PropTypes.array,
  title: PropTypes.string,
  operation: PropTypes.object,
  urls: PropTypes.array,
};


// eslint-disable-next-line
function renderBreadcrumb(breadcrumb, urls = []) {
  const homeTitle = <Breadcrumb.Item href="/#/" key={-1}>
    <Icon type="home" />
  </Breadcrumb.Item>
  return ([homeTitle,
    breadcrumb && breadcrumb.length ?
      breadcrumb.map((b, i) => {
        const sTitle = b.includes('-') ? b.split('-').reverse() : b;
        if (Array.isArray(sTitle)) {
          return sTitle.map((title, index) => {
            return urls[index] ? <Breadcrumb.Item key={index} href={'/#' + urls[index]}>{title}</Breadcrumb.Item>
              : <Breadcrumb.Item key={index}>{title}</Breadcrumb.Item>
          })
        } else {
          return <Breadcrumb.Item key={i}>{b}</Breadcrumb.Item>
        }
      }) : null]
  );
}

Page.Footer = function (props) {
  const className = classnames(prefixCls + '-footer', props.className);
  return <footer {...{ ...props, className }} />
};
