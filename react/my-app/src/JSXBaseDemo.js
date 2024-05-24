import React from 'react'

class JSXBaseDemo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: 'james',
      imgUrl: 'xxxxx',
      flag: true,
      num: 0
    }
  }

addNum = () => {
  this.setState((prevState, props) => { return {num: prevState.num + 1} })
  this.setState((prevState, props) => { return {num: prevState.num + 1} })
  this.setState((prevState, props) => { return {num: prevState.num + 1} })
  console.log(this.state.num)
}
  
  render() {
    const exprElem = <div>
      <p>{this.state.flag ? 'yes' : 'no' } + {this.state.num}</p>
      <button onClick={this.addNum}>click</button>
    </div>
    return exprElem
  }
}

export default JSXBaseDemo