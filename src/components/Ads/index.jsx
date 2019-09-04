import React from 'react'

import {Carousel} from 'antd';
import SpinDiv from '../SpinDiv/index'
import './style.less'

class Ads extends React.Component {
  /*
    轮播图需要用到一个第三方插件 https://github.com/voronianski/react-swipe 根据其文档要求需要安装插件，
    即`npm install react swipe-js-iso react-swipe --save`，这个插件的日常使用我已经验证过，大家可放心使用
    */
  constructor(props, context) {
    super(props, context);
    
  }
  render() {
    const ads = this.props.data

    return (
      <div id="ads">
        <Carousel autoplay>
          {ads.map((item, index) => {
            const imgUrl = "https://flightsb2b.com/Images/airlines/ads/"+item.Ad_Image_URL;
            if(item.Supplier_ID===1)
            {
            return <div key={index} style={{"width":"100%"}}><img src={imgUrl} style={{"width":"100%"}}></img></div>
            }
          })}
        </Carousel>
        <SpinDiv />
      </div>

    )
  }
}

export default Ads
