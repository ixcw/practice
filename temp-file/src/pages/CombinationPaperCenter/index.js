import React from 'react';
import { connect } from "dva";
import { Tabs } from 'antd';
import { routerRedux } from 'dva/router';
import classNames from 'classnames';
import queryString from 'query-string';
import { ManualCombination as namespace } from '@/utils/namespace';
import Page from '@/components/Pages/page';
import ManualCombination from './ManualCombination/index';//手动组题
import AutomaticCombination from './AutomaticCombination/index';//自动组题
import styles from './index.less';




@connect(state => ({
  loading: state[namespace].loading
}))

class CombinationPaperCenter extends React.Component {

  constructor(props) {
    super(...arguments);
    this.state = {
      currentTitle: '',
    };
  }

  UNSAFE_componentWillMount() {
    const { location, dispatch } = this.props;
    const { search, pathname } = location;
    const query = queryString.parse(search);
    // this.setState({
    //   currentTitle: query && query.question-centerType == 2 ? '南方节点-点阵铺设' : '北方节点-点阵铺设',
    // })
    // if (query && query.flag && query.p && query.s && query.question-centerType) {
    //   return;
    // }//避免同一个接口在首次打开或刷新时调用多次
    dispatch(routerRedux.replace({
      pathname: pathname == '/question-center/automatic' ? pathname : '/question-center/manual',
    }));
  }

  // 解决警告：Can't perform a React state update on an unmounted component. ...
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    const { location, loading, dispatch, match } = this.props;
    const { params } = match;
    const { currentTitle } = this.state;
    const { search } = location;
    const query = queryString.parse(search);
    const header = (
      <Page.Header breadcrumb={[currentTitle]} title={currentTitle} />
    );
    const classString = classNames(styles['question-center-page'], 'gougou-content');
    return (
      <div className={styles['question-center-box']}>
        <Tabs className='question-center-tab' size="large" type="card" activeKey={params && params.tab ? params.tab : 'manual'}
          onChange={key => {
            dispatch(
              routerRedux.replace({
                pathname: '/question-center/' + key, search: queryString.stringify(query)
              })
            )
            this.setState({ currentTitle: key === 'manual' ? '手动组题' : '自动组题' })
          }}>
          {
            [
              {
                key: 'manual', tab: 'manual', label: "手动组题",
                children: <ManualCombination location={location} />
              },
              // {
              //   key: 'automatic', tab: 'automatic', label: "自动组题",
              //   children: <AutomaticCombination location={location} />
              // },
            ].map(it =>
              <Tabs.TabPane key={it.key} tab={it.label}>
                <Page header={header}>
                  <div className={classString}>
                    {it.children}
                  </div>
                </Page>
              </Tabs.TabPane>
            )
          }
        </Tabs>
      </div>
    )
  }
}

export default CombinationPaperCenter;
