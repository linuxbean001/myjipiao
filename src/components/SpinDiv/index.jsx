import React from 'react'

import { Spin } from 'antd';
import './style.less'

class SpinDiv extends React.Component {
  constructor(props, context) {
    super(props, context);
    
  }

  render() {
    return (
      <div className="content-div spin-div" style={{textAlign:'center', minHeight:'200px', paddingTop:"80px", fontSize:'20px'}}>
      <Spin tip="Loading..." size="large">
    </Spin>
    </div>
    )
  }
}

export default SpinDiv
