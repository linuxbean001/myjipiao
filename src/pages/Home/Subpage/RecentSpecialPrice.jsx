import React from 'react'


import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {withRouter} from "react-router-dom";
import * as stepActionCollection from '../../../actions/step'
import * as optionsActionCollection from '../../../actions/options'

import {Row, Col, Carousel} from 'antd'

import util from '../../../util/utility'

class RecentSpecialPrice extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      index:0,
      arr:[0,1,2,3]
    }
  }

  getKeyword(text)
  {
    return util.getKeyword(text, this.props.options.keywords, this.getReduxDataByID('system').language)
  }

  getReduxDataByID(id)
  {
    return util.getReduxDataByID(this.props.step, id)
  }

  getReduxDataArrayByID(id)
  {
    return util.getReduxDataArrayByID(this.props.step, id)
  }

  setReduxDataByID(id, jsonData)
  {
    let data = this.getReduxDataByID(id)
    if(data == null)
    {
      this.props.stepActions.addItem({id:id, ...jsonData})
    }
    else {
      this.props.stepActions.updateItem({...data, ...jsonData})
    }
  }

  onChange(index)
  {
    this.setState({index:index})
  }

  startSearch() {
    this.props.history.push("/Fare")
  }


  componentDidMount() {

  } //end of componentDidMount

  getPriceHtml(index) {
    return (
      <div className="re-div">
         <div>
           <img src={'/images/'+'rsp.png'} />
         </div>
         <div className="bottom-bar text-center">
            墨尔本激浪深度一日游
         </div>
         <div className="bottom-arrow text-right">
              <i className="fa fa-play">&nbsp;&nbsp;</i>
         </div>
      </div>
    )
  }

  render() {
      return(
        <div className="recentspecialprice">
            <div className="picture-div">
               <h3>{this.getKeyword('kRecentSpecialPrice')}</h3>
               <Row gutter={16}>
                <Col span={6}>{this.getPriceHtml(0)}</Col>
                <Col span={6}>{this.getPriceHtml(1)}</Col>
                <Col span={6}>{this.getPriceHtml(2)}</Col>
                <Col span={6}>{this.getPriceHtml(3)}</Col>
              </Row>
            </div>
        </div>
      )
  }
}

// -------------------redux react --------------------
function mapStateToProps(state) {
  return {
    options: state.options,
    step: state.step,
    isMobile: state.step.byHash['system'].device !== 'pc',
    isDataLoad: (state.step.byHash['leg0'] != null) && (state.step.byHash['leg0'].fsr != null)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    optionsActions: bindActionCreators(optionsActionCollection, dispatch),
    stepActions: bindActionCreators(stepActionCollection, dispatch)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RecentSpecialPrice))
