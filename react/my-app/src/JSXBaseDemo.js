import React from 'react'

class JSXBaseDemo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: 'james',
      imgUrl: 'xxxxx',
      flag: true
    }
  }

  render() {
    const pElem = <p>{this.state.name}</p>
    const exprElem = <p>{this.state.flag ? 'yes' : 'no' }</p>
    return exprElem
  }
}