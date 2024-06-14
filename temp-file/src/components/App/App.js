import React from 'react';
import { Layout, Row, Affix, Menu } from 'antd';
import HeaderMenu from './HeaderMenu';
import TopHeader from './TopHeader';
import FooterMenu from '../FooterMenu/FooterMenu';
import styles from './App.less';
import { getLocationObj } from "@/utils/utils";
const { Header, Content, Footer } = Layout;

class App extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      collapsed: document.body.clientWidth < 1600 ? true : false,
    };
  }

  /**
* 是否显示文字
* @param e  ：事件对象
*/
  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  render() {
    const { collapsed } = this.state;
    let myDate = new Date();
    const tYear = myDate.getFullYear();

  /** ********************************************************* 桌面端使用报告判断 start author:张江 date:2021年05月12日 *************************************************************************/
    const { location } = this.props
    const _location = getLocationObj(location);
    const { query } = _location || {};
    const isHaveToken = query && query.gbdpw;
    const isShowMenu = query && (query.isShowMenu == 'show' || !query.isShowMenu);
  /** ********************************************************* 桌面端使用报告判断 start author:张江 date:2021年05月12日 *************************************************************************/

    return (
      <Layout className={styles.headerMenue}>
        {/*<Header style={{ background: '#fff', padding:0 }} />*/}
        {
          !isShowMenu ? null: <Affix offsetTop={0} className='no-print' style={{ zIndex: 999 }}>
            <Header className='no-print'>
              <div>
                <TopHeader />
              </div>
              <div>
                <HeaderMenu collapsed={collapsed}/>
              </div>
            </Header>
          </Affix>
        }
       
        <Content style={{
          marginTop: !isShowMenu ? '0px':'52px',//头部固定  98px
          minHeight: '74.6vh'
        }}>
          {this.props.children}
        </Content>
        {
          
          !isShowMenu ? null : <Footer style={{ textAlign: 'center' }} className='no-print'>
            <div className={styles["footer-bottom"]}>
              <FooterMenu />
              <p><a
                id="_xinchacharenzheng_cert_vip_kexinweb"
                style={{ textDecoration: 'none' }}
                rel="noopener noreferrer"
                target="_blank"
                href="https://xyt.xinchacha.com/pcinfo?sn=513954059762405376&certType=6">
                <img src="https://xyt.xinchacha.com/img/icon/icon3.png" alt='可信网站' />
              </a> © <span>2016-{tYear} 贵州树精英教育科技有限责任公司版权所有ICP证：<a href="https://beian.miit.gov.cn" target=" _blank">黔ICP备16009384号-4</a></span></p>
            </div>
          </Footer>
        }
       
      </Layout>
    );
  }
}

export default App;
