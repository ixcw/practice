import React from 'react';
import { Layout } from 'antd';
import styles from './index.less';
const { Content } = Layout;



class Flex extends React.Component {
  state = {
    collapsed: false,
  };

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  render() {
    const { href } = window.location;
    const url = href.split('#')[1] || undefined;
    return (
      <Layout>
        <Layout>
          <Content className={url === '/' ? styles['home-page'] : styles['content-page']}>
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default Flex;
