import React from 'react'

import {Link, withRouter} from 'react-router-dom'

import {Row, Col} from 'antd'
import util from '../../../util/utility'

class HeadingBox extends React.Component {
  constructor(props, context) {
    super(props, context);
    
  }

  componentDidMount() {} //end of componentDidMount
  render() {
    const data = this.props.data
    const key = this.props.language =='English'? '_En':'_Cn'
    const intSpan = !this.props.isMobile? 8:24
    const getKeyword = this.props.keywordFn

    return (
      <div>
         <div className="title-div">
           <div className="main-title">{data['Heading'+key]}</div>
           <div className="sub-title">{data["Title"+key]}</div>
         </div>
        <Row type="flex" justify="space-between" align="top">
         {
           data.items.map((item, index)=>{
             return (
               <Col key={index} span={intSpan}>
                 <img src={util.getUploadImageUrl(item.Image)} className="ad-img"/>
                 <div className="line-bar ad-bar">
                   <Row type="flex" justify="space-between" align="top">
                     <Col span={12}>
                       <div className="from_location text-left">{item['Dest_Name'+key]} <i>{item['Country'+key]}</i></div>
                     </Col>
                     <Col span={12}>
                       <div className="price text-right">{getKeyword('kGetPrice')} <i className="fa fa- fa-caret-right"/></div>
                     </Col>
                   </Row>
                 </div>
               </Col>
             )
           })
         }
         </Row>
         <div className="price swhere text-right">Search everywhere <i className="fa fa- fa-caret-right"/></div>
      </div>
    )
  }
}

export default HeadingBox
