import React from 'react'

import {Link, hashHistory} from 'react-router'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import * as stepActionCollection from '../../actions/step'

import { Checkbox } from 'antd';

import util from '../../util/utility'

import './style.less'

class Stop extends React.Component {
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
    <li className= "list-group-item">
      <strong>
  {data.stop == 1? this.getKeyword('kDirect'):(data.stop-1)+' '+ this.getKeyword('kMiddleStop')}
  </strong>
  <span style={{"float":"right"}}>
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
    step: state.step,
    options: state.options
  }
}

function mapDispatchToProps(dispatch) {
  return {
    stepActions: bindActionCreators(stepActionCollection, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Stop)
