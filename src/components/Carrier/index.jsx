import React from 'react'

import {Link, hashHistory} from 'react-router'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import * as stepActionCollection from '../../actions/step'

import { Checkbox } from 'antd';

import util from "../../util/utility"


class Carrier extends React.Component {
  constructor(props, context) {
    super(props, context);

  }

  getKeyword(text)
  {
    return util.getKeyword(text, this.props.options.keywords, this.getReduxDataByID('system').language)
  }

  getReduxDataByID(id)
  {
    return util.getReduxDataByID(this.props.step, id)
  }

  render() {
    const data = this.props.data
    return (
    <li className= "list-group-item"> <img className="airline-logo" alt={data.code} src={'https://www.flightsb2b.com/images/airlines/png/' + data.code + '.png'}/>
  <strong className="pad-lft">{data.code}</strong>
  <span style={{"float":"right"}}>
     <strong className="text-danger pad-rgt">{util.getCurrencySymbol(this.getReduxDataByID('leg0').fsr.currency)}{data.price_range.floor}+</strong>
    <Checkbox onChange={this.onChange.bind(this)} checked={data.is_selected == 1}></Checkbox>
  </span>
</li>

    )
  }

  onChange(e) {
    const isSelected = this.props.data.is_selected === 1? 0:1;
    this.props.changeFn({id:this.props.data.id, is_selected:this.props.data.is_selected==1?0:1})
    //this.props.stepActions.updateArrayItemAttribute({key:"carrier", data:{id:this.props.data.id, is_selected:isSelected}})
  }
}


function mapStateToProps(state) {
  return {
    step: state.step
  }
}

function mapDispatchToProps(dispatch) {
  return {
    stepActions: bindActionCreators(stepActionCollection, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Carrier)
