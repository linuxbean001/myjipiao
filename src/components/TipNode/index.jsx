import React from 'react'


import {Link, hashHistory} from 'react-router'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import * as optionsActionCollection from '../../actions/options'

import util from "../../util/utility"

import { Tooltip } from 'antd';
import './style.less'

class TipNode extends React.Component {
  /*
    轮播图需要用到一个第三方插件 https://github.com/voronianski/react-swipe 根据其文档要求需要安装插件，
    即`npm install react swipe-js-iso react-swipe --save`，这个插件的日常使用我已经验证过，大家可放心使用
    */
  constructor(props, context) {
    super(props, context);

  }

  getDisplayName(code) {
     const arr = this.props.type ==="city"? this.props.options.city: this.props.options.airline
     const key = this.props.type ==="city"? "City":"Airline"
     const valueKey = this.props.type ==="city"? "CityName":"Name"
     const temp_arr = arr.filter((item)=>{
       if (item[key] === code)
       {
         return item;
       }
     })

     if (temp_arr.length > 0)
     {
       return temp_arr[0][valueKey];
     }
     else {
       return "";
     }
  }

  render() {
    const displayName = this.getDisplayName(this.props.code)
    const isCity = this.props.type ==="city"
    const url = isCity? '': util.getAirlineImage(this.props.code)
    return (
      <div>
          <Tooltip title={displayName}>
          {
            isCity
            ? <span>
               {this.props.code}
             </span>
            :  <span>
               <img src={url}  className="airline-logo" />
             </span>
          }

   </Tooltip>
      </div>
    )
  }
}

// -------------------redux react 绑定--------------------

function mapStateToProps(state) {
  return {options: state.options}
}

function mapDispatchToProps(dispatch) {
  return {
    optionsActions: bindActionCreators(optionsActionCollection, dispatch),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(TipNode)
