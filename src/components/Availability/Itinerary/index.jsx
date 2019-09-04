import React from 'react'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as optionsActionCollection from '../../../actions/options'

import {Row, Col,Icon} from 'antd';

import util from "../../../util/utility"

class Itinerary extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      steps: []
    }
  }

  itemSelect(index) {
    // //console.log("selected from parent", index);
  }

  getKeyword(text)
  {
    return util.getKeyword(text, this.props.options.keywords, this.getReduxDataByID('system').language)
  }

  getReduxDataByID(id)
  {
    return util.getReduxDataByID(this.props.step, id)
  }

  getCityName(code) {
    const city = this.props.options.city
    for (var i=0; i<city.length; i++)
    {
      if (code === city[i].City)
      {
        if (this.getReduxDataByID('system').language == 'cn')
        {
          return city[i].CityName_Cn
        }
        else {
          return city[i].CityName
        }

      }
    }

    return ''
  }

  getTravelTime(strTime)
  {
    if (strTime =='')
    {
      return strTime
    }
    else {
      var strHour = this.getReduxDataByID('system').language == 'English'? 'h ':'小时 '
      var strMin = this.getReduxDataByID('system').language == 'English'? 'm':'分钟'
      return strTime.substring(0,2)+ strHour + strTime.substring(2,4)+ strMin
    }
  }

  getAirlineName(index)
  {
    const flightList  = this.props.data.FlightList
    var code =''
    if (index == 0)
    {
      code = flightList[index].CarrierCode
    }
    else {
      if (flightList[index].CarrierCode == flightList[index-1].CarrierCode)
      {
        return ''
      }
      else {
        code = flightList[index].CarrierCode
      }
    }
    const airline = this.props.options.airline
    for (var i=0; i< airline.length; i++)
    {
      if (airline[i].Airline == code.trim().toUpperCase())
      {
        return airline[i].Name
      }
    }
  }

  getOutbound() {
    const data = this.props.data
    if (this.getReduxDataByID('leg0').fsr.trip_type =='RT')
    {
      return (
      <tr>
        <td className="text-left av-title text-normal">
          {
            this.props.index == 0
            ? this.getKeyword('kOutbound')
            : this.getKeyword('kReturnLeg')
          } <span className="text-sm"><i className="fa fa-calendar text-warning"></i> {data.FlightList[0].FromDate}</span>
        </td>
        <td className="text-right text-normal pad-rgt">
            {
              data.FlightList.map((item,index)=>{
               const url = util.getAirlineImage(this.props.data.FlightList[0].CarrierCode)
               return  <span key={index} className="pad-lft"><b>{this.getAirlineName(index)}</b>&nbsp;&nbsp;<b className="text-danger">{item.CarrierCode}</b>&nbsp;<b>{item.FlightNumber}</b></span>
              })
            }
         </td>
      </tr>
    )
    }
    else {
      return (
        <tr>
          <td className="text-left av-title text-normal"><span className="text-sm"><i className="fa fa-calendar text-warning"></i> {data.FlightList[0].FromDate}</span></td>
          <td className="text-right text-normal pad-rgt">
            <ul className="inline">
              {
                data.FlightList.map((item,index)=>{
                 const url = util.getAirlineImage(this.props.data.FlightList[0].CarrierCode)
                 return  <span key={index} className="pad-lft"><b>{this.getAirlineName(index)}</b>&nbsp;&nbsp;<b className="text-danger">{item.CarrierCode}</b>&nbsp;<b>{item.FlightNumber}</b></span>
                })
              }
            </ul>
          </td>
        </tr>
      )
    }
  }

  getStopCity(flights) {
    let arr = flights.slice(0, flights.length-1)
    return (
      <div className="middle-stops astop">
        {
          arr.map((item, index)=>{
            return <div className='astop-item' key={index}>{this.getCityName(item.ToCode.trim())}</div>
          })
        }
      </div>
    )
  }


  render() {
    const data = this.props.data
    let carrier_code = this.props.data.FlightList[0].CarrierCode
    const url = util.getAirlineImage(carrier_code)
    const isReturn = this.getReduxDataByID('leg0').fsr.trip_type ==='RT'

    return (
      <div className="av-div av-bottom">
         <table className="av-table">
           <tbody>
             <tr>
              <td rowSpan={2}><img className='airline-logo' src={url}/>{carrier_code}</td>
              <td className="text-bottom text-center time">{data.FlightList[0].FromTime}<i>{util.getAmPm(data.FlightList[0].FromTime)}</i></td>
              <td className="text-bottom text-center line">{this.getTravelTime(data.TravelTime)}</td>
              <td className="text-bottom text-center time">{util.getTimeFormat(data.FlightList[data.FlightList.length-1].ToTime)}<i>{util.getAmPm(data.FlightList[data.FlightList.length-1].ToTime)}</i></td>
             </tr>
             <tr>
               <td className="text-top text-center acity">{this.getCityName(data.FromCity)}</td>
               <td className="text-top text-center astop">{data.FlightList.length == 1? this.getKeyword('kDirect'): this.getStopCity(data.FlightList)}</td>
               <td className="text-top text-center acity">{this.getCityName(data.ToCity)}</td>
             </tr>
             {/*
             <tr>
               <td className="w50 text-left">
                 <div className="flight-time text-left">{data.FlightList[0].FromTime}
                   <i>{data.FlightList[0].FromTime}</i>
                 </div>
               </td>
               <td className="w50 text-right">
                 <div className="flight-time pull-right">{util.getTimeFormat(data.FlightList[data.FlightList.length-1].ToTime)}
                   <i>{util.getAmPm(data.FlightList[data.FlightList.length-1].ToTime)}</i>
                   <span className="text-xs text-danger">{util.dayDiff(data.FlightList[0].FromDate, data.FlightList[data.FlightList.length-1].ToDate)}</span>
                 </div>
               </td>
             </tr>
             <tr>
               <td colSpan="3" className="flights-div">
                 <table>
                   <tbody>
                     <tr>
                       <td className="airport w30">{this.getCityName(data.FromCity)}</td>
                       <td className="code">{data.FromCity}</td>
                       <td className="travel-time left-light">
                         <div style={{color:"#f4f4f4"}}>{this.getTravelTime(data.TravelTime)}</div>
                         <div style={{color:"#13A79A"}}>{data.FlightList.length == 1? this.getKeyword('kDirect'): (data.FlightList.length-1)+ this.getKeyword('kMiddleStop')}</div>
                       </td>
                       <td className="left-dark airport w30">
                         {this.getCityName(data.ToCity)}
                       </td>
                       <td className="code">{data.ToCity}</td>
                     </tr>
                   </tbody>
                 </table>
               </td>
             </tr>
             */}
           </tbody>
         </table>
      </div>
    )
  }
}

// -------------------redux react --------------------

function mapStateToProps(state) {
  return {
    options: state.options,
    step: state.step
  }
}

function mapDispatchToProps(dispatch) {
  return {
    optionsActions: bindActionCreators(optionsActionCollection, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Itinerary)
