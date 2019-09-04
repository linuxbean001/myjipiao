import React from 'react'




import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as optionsActionCollection from '../../actions/options'
import * as stepActionCollection from '../../actions/step'

import CartItinerary from '../../components/CartItinerary/index'

import util from '../../util/utility'
import {Row, Col} from 'antd'


class Cart extends React.Component {
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

  componentDidMount() {
    //console.log('Get fare price component did amount');
  } //end of componentDidMount

  getAv(cart) {
    const step = this.props.step
    const dataArea = step.byHash['leg'+cart.leg]
    const searchResult = dataArea.searchResult.SearchList;
    const dep = searchResult[cart.gds].Departure;
    const ret = searchResult[cart.gds].Return;
    const av = searchResult[cart.gds].Rows[cart.fare].AvailReference[cart.av];

    var avs =[];
    avs.push({itinerary:dep[av.DepartureId-1], bookClass:searchResult[cart.gds].Rows[cart.fare].Departure});
    if(av.ReturnId >0)
    {
      avs.push({itinerary:ret[av.ReturnId-1], bookClass:searchResult[cart.gds].Rows[cart.fare].Return});
    }
    return avs;
  }

  onChange(item){
    this.props.changeFn(item)
  }

  render() {
    const step = this.props.step
    const currency = util.getCurrencySymbol(step.byHash['leg0'].fsr.currency)
    const sortedCart = util.sortByKey(step.byHash['cart'], 'leg', true)
    return (
      <div>
        {
            sortedCart.map((cartItem, cartIndex)=>{
              const avs = this.getAv(cartItem)
              if (!this.props.isEdit)
              {
                return (
                  <div key={cartIndex} className="flight-it">
                        {
                          avs.map((item,index)=>{

                              return <div className="CartItinerary" key={index}>
                                        <CartItinerary data={item} device={this.props.device}></CartItinerary>
                                      </div>
                          })
                        }
                  </div>
                )
              }
              else {
                return (
                      <div className="CartItinerary" key={cartIndex}>
                      <Row type="flex" justify="space-around" align="middle" >
                          <Col span={21}>
                            {
                              avs.map((item,index)=>{
                                  return <div key={index}>
                                            <CartItinerary data={item} device={this.props.device}></CartItinerary>
                                          </div>
                              })
                            }
                          </Col>
                          <Col span={3}>
                            {
                              this.getReduxDataByID('system').device === 'pc'
                              ?<button className="btn btn-icon" onClick={this.onChange.bind(this, cartItem)}><span className="text-danger text-bold pad-all">{currency} {cartItem.price} </span><i className="fa fa-times"></i></button>
                              :<div>
                                <div className="text-danger text-bold text-center" style={{paddingBottom:3}}>{currency} {cartItem.price} </div>
                                <div className="text-center">
                                  <button className="btn btn-danger btn-sm" onClick={this.onChange.bind(this, cartItem)}><i className="fa fa-times"></i></button>
                                </div>
                              </div>
                            }
                              </Col>
                       </Row>
                       </div>
                     )
            }
          })
        }
      </div>
    )
  }
}


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
export default connect(mapStateToProps, mapDispatchToProps)(Cart)
