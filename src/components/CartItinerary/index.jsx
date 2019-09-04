import React from 'react'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as optionsActionCollection from '../../actions/options'
import * as stepActionCollection from '../../actions/step'


import util from '../../util/utility'
import {Row, Col} from 'antd'


class CartItinerary extends React.Component {
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

  getReduxDataArrayByID(id)
  {
    return util.getReduxDataArrayByID(this.props.step, id)
  }


  render() {
    const itinerary = this.props.data.itinerary;
    const bookClass = this.props.data.bookClass;
    const depUrl = 'https://www.flightsb2b.com/images/airlines/other/departure0.png';
    const arrUrl = 'https://www.flightsb2b.com/images/airlines/other/arrival0.png';
    const seatUrl = 'https://www.flightsb2b.com/images/airlines/other/airplaneseat.png';
    let isPC = this.getReduxDataByID('system').device =='pc'

    return (
      <div>
          <div className="flightListContainer">
            {
            itinerary.FlightList.map((item, index) => {
               const url = util.getAirlineImage(item.CarrierCode);
               if (isPC)
               {
                 return <div key={index} className="pad-ver">
                         <Row type="flex" justify="center" align="middle">
                           <Col span={2}><img src={url} className="logo"/>{item.CarrierCode} {item.FlightNumber}</Col>
                           <Col span={9}>
                             <Row type="flex" justify="center" align="top">
                               <Col span={4}><img src={depUrl}/></Col>
                               <Col span={4}>{item.FromCode}</Col>
                               <Col span={10}><i className="fa fa-calendar"></i>{item.FromDate}</Col>
                               <Col span={6}><i className="fa fa-clock-o"></i>{item.FromTime}</Col>
                             </Row>
                           </Col>
                           <Col span={9}>
                             <Row type="flex" justify="center" align="middle">
                               <Col span={4}><img src={arrUrl}/></Col>
                               <Col span={4}>{item.ToCode}</Col>
                               <Col span={10}><i className="fa fa-calendar"></i>{item.ToDate}</Col>
                               <Col span={6}><i className="fa fa-clock-o"></i>{item.ToTime}</Col>
                             </Row>
                           </Col>
                           <Col span={4}><img src={seatUrl}/>{item.AirCraft}</Col>
                         </Row>
                       </div>
                  }
                  else {
                    return <div key={index} className="cart-flight-div">
                            <Row type="flex" justify="center" align="middle">
                              <Col span={6}><img src={url} className="logo"/>{item.CarrierCode}  {item.FlightNumber}</Col>
                              <Col span={18}>
                                <Row type="flex" justify="center" align="middle">
                                  <Col span={3}><img src={depUrl}/></Col>
                                  <Col span={3}>{item.FromCode}</Col>
                                  <Col span={11}><i className="fa fa-calendar"></i>{item.FromDate}</Col>
                                  <Col span={7}><i className="fa fa-clock-o"></i>{item.FromTime}</Col>
                                </Row>
                              </Col>
                              <Col span={6}><img src={seatUrl}/>{item.AirCraft}</Col>
                              <Col span={18}>
                                <Row type="flex" justify="center" align="middle"  style={{padding:"3px 0px"}}>
                                  <Col span={3}><img src={arrUrl}/></Col>
                                  <Col span={3}>{item.ToCode}</Col>
                                  <Col span={11}><i className="fa fa-calendar"></i>{item.ToDate}</Col>
                                  <Col span={7}><i className="fa fa-clock-o"></i>{item.ToTime}</Col>
                                </Row>
                              </Col>

                            </Row>
                          </div>
                  }
            })
          }

          </div>
      </div>

    )
  }
}

// -------------------redux react--------------------

function mapStateToProps(state) {
  return {
    options: state.options,
    step: state.step
  }
}

function mapDispatchToProps(dispatch) {
  return {
    optionsActions: bindActionCreators(optionsActionCollection, dispatch),
    stepActions: bindActionCreators(stepActionCollection, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CartItinerary)
