import React from 'react'

import {Link} from 'react-router'
import util from '../../util/utility'
import {Row, Col} from 'antd'


class Box extends React.Component {
  /*
    轮播图需要用到一个第三方插件 https://github.com/voronianski/react-swipe 根据其文档要求需要安装插件，
    即`npm install react swipe-js-iso react-swipe --save`，这个插件的日常使用我已经验证过，大家可放心使用
    */
  constructor(props, context) {
    super(props, context);

  }

  getClassName(index) {
    if (index === 0)
    {
      return "pad-all text-left";
    }

    if(index === 2)
    {
      return "pad-all text-right";
    }

    return  "pad-all text-center";
  }


  render() {
    const data = this.props.data
    const url = util.getImageUrl("b"+(this.props.serial+1)+".png")
    const className = this.getClassName(this.props.index)

    const span1 = this.props.device === 'pc'? 10: 6
    const span2 = this.props.device === 'pc'? 14: 18

    const title = this.props.keywordFn(data.title)

    return (
      <div className="tin-box">
                <Row type="flex" justify="left" align="middle">
                 <Col span={span1}>  <img src={url} style={{width:"100%"}}/></Col>
                 <Col span={span2}>
                   <p className="blink_title">
                    <a href={data.link} target="_blank">{title}</a>
                  </p>
                 </Col>
               </Row>
      </div>
    )
  }
}

export default Box
