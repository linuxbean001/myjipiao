import React from 'react'

import {withRouter} from "react-router-dom";

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import Itinerary from './Itinerary/index'
import CartItinerary from '../CartItinerary/index'
import util from '../../util/utility.js'

import * as optionsActionCollection from '../../actions/options'
import * as stepActionCollection from '../../actions/step'

import {Tooltip, Button, Icon} from 'antd';



class Availability extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isShowFlights:false
    }
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

  getSupplierFlagUrl(name) {
      return util.getSupplierFlagUrl(name, this.props.options.supplier)
  }

  getTargetDataArea()
  {
    return this.props.step.byHash['leg'+this.props.legIndex]
  }

  getItineraries() {
    const dataArea = this.getTargetDataArea()
    const avs = util.getAv(dataArea.searchResult,this.props.data.source_index,this.props.data.fare_index, this.props.data.av_index);
    //console.log("avs", avs)
    return avs;
  }

  getItinerariesHtml() {
    const itineraries = this.getItineraries()
    return (
      <div>
      {
        itineraries.map((item,index) =>{
          return <div className="itinerary-div" key={index}>
                 <Itinerary  data={itineraries[index].itinerary} index={index}/>
                 </div>
        })
      }
      </div>
    )
  }

  getFlightHtml() {
    const itineraries = this.getItineraries()
    return (
      <div>
      {
        itineraries.map((item,index) =>{
          return <div className="all-flights" key={index}>
                    <CartItinerary data={item} device={'pc'}></CartItinerary>
                  </div>
        })
      }
      </div>
    )
  }

  getDisabled() {
    const cart = this.props.step.byHash['cart']
    if (cart == null)
    {
      return false
    }

    for (var i=0; i< this.props.step.byHash['cart'].length; i++)
    {
      var obj = this.props.step.byHash['cart'][i]
      if (obj.leg == this.props.legIndex)
      {
        return true
      }
    }

    return false
  }

  getAirlineName(code)
  {
    const airline = this.props.options.airline
    for (var i=0; i< airline.length; i++)
    {
      if (airline[i].Airline == code.trim().toUpperCase())
      {
        return airline[i].Name
      }
    }
  }

  getKeyword(key) {
    return util.getKeyword(key, this.props.options.keywords, this.getReduxDataByID('system').language)
  }

  toggleFlightsList() {
    this.setState({isShowFlights: !this.state.isShowFlights})
  }

  getTotalFareTotal(cart_price) {
      var tempTaxCount = 0;
      var tempNettCount = 0;
      var tempGrossCount = 0;
      //const cart_price = this.getReduxDataByID("fare_price").PaxDetails
      const fsr = this.getReduxDataByID('leg0').fsr

      for (var i = 0; i < cart_price.length; i++) {
          var item = cart_price[i];

          var tax = parseFloat(item.Tax);
          var nett = parseFloat(item.AirPrice);
          var gross =  tax+nett;

          if (item.IsAdult) {
              tempTaxCount += tax * fsr.adult;
              tempNettCount += nett * fsr.adult;
              tempGrossCount += gross * fsr.adult;
          }

          if (item.IsChild) {
            tempTaxCount += tax * fsr.child;
            tempNettCount += nett * fsr.child;
            tempGrossCount += gross * fsr.child;
          }

          if (item.IsInfant) {
            tempTaxCount += tax * fsr.infant;
            tempNettCount += nett * fsr.infant;
            tempGrossCount += gross * fsr.infant;
          }
      }

      this.setState({isShowPrice:true, nett:tempNettCount, tax:tempTaxCount, total:tempGrossCount})
      //this.props.stepActions.updateItem({cartSummary:{nett:tempNettCount.toFixed(2), tax:tempTaxCount.toFixed(2), total:tempGrossCount.toFixed(2)}})
  }

  getPriceHtml() {
    if(this.getReduxDataByID("fare_price") != null)
    {
      try {
        var tempTaxCount = 0;
        var tempNettCount = 0;
        var tempGrossCount = 0;

        const cart_price = this.getReduxDataByID("fare_price").PaxDetails
        const fsr = this.getReduxDataByID('leg0').fsr
        let currencySymbol = this.getReduxDataByID('system').currency+' '

        for (var i = 0; i < cart_price.length; i++) {
            var item = cart_price[i];

            var tax = parseFloat(item.Tax);
            var nett = parseFloat(item.AirPrice);
            var gross =  tax+nett;

            if (item.IsAdult) {
                tempTaxCount += tax * fsr.adult;
                tempNettCount += nett * fsr.adult;
                tempGrossCount += gross * fsr.adult;
            }

            if (item.IsChild) {
              tempTaxCount += tax * fsr.child;
              tempNettCount += nett * fsr.child;
              tempGrossCount += gross * fsr.child;
            }

            if (item.IsInfant) {
              tempTaxCount += tax * fsr.infant;
              tempNettCount += nett * fsr.infant;
              tempGrossCount += gross * fsr.infant;
            }
        }

        return (
          <div className="pad-ver">
             <table style={{width:'100%'}}>
               <tbody>
                <tr>
                  <td className="text-right"><span className="text-bold">{this.getKeyword('kNett')}: </span></td>
                  <td className="text-right"><span className="currency">{currencySymbol}</span><span className="itinerary-money">{tempNettCount.toFixed(2)}</span></td>
                </tr>
                <tr>
                  <td className="text-right"><span className="text-bold">{this.getKeyword('kTax')}: </span></td>
                  <td className="text-right"><span className="currency">{currencySymbol}</span><span className="itinerary-money">{tempTaxCount.toFixed(2)}</span></td>
                </tr>
                <tr>
                  <td className="text-right"><span className="text-bold text-danger">{this.getKeyword('kTotal')}: </span></td>
                  <td className="text-right text-danger"><span className="currency">{currencySymbol}</span><span className="itinerary-money">{tempGrossCount.toFixed(2)}</span></td>
                </tr>
               </tbody>
             </table>
          </div>
        )
      }
      catch(err) {
        //console.log(err.message)
        return <div></div>
      }
    }
    else {
      return <div></div>
    }
  }

  render() {
    const data = this.props.data
    const flagUrl = this.getSupplierFlagUrl(data.supplier_name)
    const itinerariesHtml = this.getItinerariesHtml()
    const url = util.getAirlineImage(data.carrier_code)
    const airName = this.getAirlineName(data.carrier_code)
    const fsr = this.getReduxDataByID('leg0').fsr
    const symbol = util.getCurrencySymbol(fsr.currency)
    const tripType = fsr.trip_type==='RT'? 'Return':'One Way'
    const travelClass = fsr.travel_class
    return (
      <div className='av-container'>
        <div className="av-content">
        {/*
          <div className="av-top text-normal">
          <table style={{width:"100%"}}>
            <tbody>
              <tr>
                <td>
                  <Tooltip title={airName}>
                  <img className="logo" src={url}/>
                  </Tooltip>
                </td>
                <td className="price">{symbol}{data.price}</td>
                <td>
                  <table>
                   <tbody>
                     <tr>
                       <td>{this.getKeyword("kPP")}</td>
                       <td>{this.getKeyword("kClass")}</td>
                     </tr>
                     <tr>
                       <td>{this.getKeyword('k'+util.replaceAll(tripType,' ',''))}</td>
                       <td>{this.getKeyword('k'+travelClass)}</td>
                     </tr>
                   </tbody>
                 </table>
                </td>
              </tr>
            </tbody>
          </table>
          </div>
        */}
        <table style={{width: '100%', borderBottom:'1px solid #b69750'}}>
          <tbody>
            {
              this.getReduxDataByID('system').device =='pc'
              ?<tr>
                  <td className="td-itinerary">{itinerariesHtml}</td>
                  <td style={{width:'10%', paddingLeft:'10px'}}>
                     {
                       this.props.selectedAV == '1'
                       ?<div className="price-av itinerary-right">{this.getPriceHtml()}</div>
                       :  <div className='itinerary-right'>
                            <div style={{marginLeft:'-15px'}}><span className='currency'>{data.currency}</span><span className='itinerary-money'>{data.price}</span></div>
                            <Button type="primary" onClick={this.itemSelect.bind(this, this.props.data)} disabled={this.getDisabled()}>{this.getKeyword("kSelect")}</Button>
                            <div className='seat'>{data.seat} tickets left</div>
                          </div>
                     }
                  </td>
                </tr>
              :  <tr>
                  <td>
                  <div className="td-itinerary">{itinerariesHtml}</div>
                  <div className="text-right">
                     {
                       this.props.selectedAV == '1'
                       ?<div className="price-av itinerary-right">{this.getPriceHtml()}</div>
                       :  <div className='itinerary-right'>
                            <div style={{marginLeft:'-15px'}}><span className='currency'>{data.currency}</span><span className='itinerary-money'>{data.price}</span></div>
                            <Button type="primary" onClick={this.itemSelect.bind(this, this.props.data)} disabled={this.getDisabled()}>{this.getKeyword("kSelect")}</Button>
                            <div className='seat'>{data.seat} tickets left</div>
                          </div>
                     }
                  </div>
                  </td>
                </tr>
            }

          </tbody>
        </table>
        <div className = "pad-ver text-right">
          <Button type="primary" shape="circle" onClick={this.toggleFlightsList.bind(this)}>
            <Icon type="info"  />
          </Button>
        </div>
        {
          this.state.isShowFlights
          ?  <div className="flight-container">
                {this.getFlightHtml()}
            </div>
          : <div></div>
        }
        </div>
      </div>
    )
  }



  itemSelect(item) {
    //this.createPaxes();
    const cid = this.props.legIndex * 10000 + this.props.data.source_index *1000+ this.props.data.fare_index*100 + this.props.data.av_index
    const obj = {id:cid, leg:this.props.legIndex, gds:this.props.data.source_index, fare:this.props.data.fare_index, av:this.props.data.av_index, price:this.props.data.price};

    this.props.stepActions.updateItem({id:'selectedAV', ...item})
    this.props.stepActions.addArrayItem({id:"cart", obj:obj})
    this.props.history.push("/Passenger");
  }
}

// -------------------redux react 绑定--------------------

function mapStateToProps(state) {
  return {options: state.options, step: state.step}
}

function mapDispatchToProps(dispatch) {
  return {
    optionsActions: bindActionCreators(optionsActionCollection, dispatch),
    stepActions: bindActionCreators(stepActionCollection, dispatch)
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Availability))
