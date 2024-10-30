import React from 'react';
import { Button } from 'antd';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';

class ProductPage extends React.Component {
  
  updatePList = () => {
    this.props.dispatch({
      type: 'product/updateList',
      payload: {
        name: '西瓜'
      }
    })
  }

  goToHome = () => {
    this.props.history.push('/')
  }

  goToHome2 = () => {
    this.props.dispatch(routerRedux.push('/'))
  }

  updatePListAsync = () => {
    this.props.dispatch({
      type: 'product/updateListAsync',
      payload: {
        name: '西瓜2'
      }
    })
  }

  updatePListMock = () => {
    this.props.dispatch({
      type: 'product/updateListApi'
    })
  }
      
  render() {
        
    console.log('ProductPage props: ', this.props)
    const { productList } = this.props
        
    return (
      <div>
        ProductPage
        {
          productList.productList.map(item => {
            return <div>{item.name}</div>
          })
        }
        <Button onClick={this.updatePList}>antd</Button>
        <Link to='/'>去首页</Link>
        <Button onClick={this.goToHome}>去首页</Button>
        <Button onClick={this.goToHome2}>去首页</Button>
        <Button onClick={this.updatePListAsync}>更新list</Button>
        <Button onClick={this.updatePListMock}>更新listMock</Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    productList: state.product
  }
}

export default connect(mapStateToProps)(ProductPage)
