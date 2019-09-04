import React from 'react'

import {Link, withRouter} from 'react-router-dom'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as optionsActionCollection from '../../actions/options'
import * as stepActionCollection from '../../actions/step'

import {getPriceData} from '../../fetch/service'

import Pax from '../../components/Pax/index'
import util from '../../util/utility'
import MessageDiv from '../../components/MessageDiv'
import SpinDiv from '../../components/SpinDiv'

import Availability from '../../components/Availability'

import {Col, Row, Checkbox, Icon} from 'antd'



class Passenger extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isDataLoad:false,
      isConfirmed:false,
      isBusy:false,
      pageIndex:110,
      error: ''
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

  goBack() {
    this.props.history.push("Fare")
  }

  submit() {
    this.props.history.push("/CreateBooking")
  }

  isInUSEUCA(cityCode)
  {
    const cities = this.props.options.city
    for (var i=0; i< cities.length; i++)
    {
      if (cities[i].City == cityCode)
      {
        if (util.isMoreInfoNeed(cities[i].Country))
        {
          return true;
        }
      }
    }

    return false;
  }

  getPrice() {
    this.setState({isBusy:true})
    var param = util.getPriceParam(this.props.step, this.getReduxDataByID('system').currency)

    //console.log("param", param)

    var isMoreInfoNeeded = false;
    for(var i=0; i< param.data.AvailList.length; i++)
    {
      var aAv = param.data.AvailList[i]
      for (var j=0; j< aAv.FlightList.length; j++)
      {
        var flight = aAv.FlightList[j]
        if (this.isInUSEUCA(flight.FromCode) || this.isInUSEUCA(flight.ToCode))
        {
          isMoreInfoNeeded= true;
          break;
        }
      }

      if (isMoreInfoNeeded) break;
    }

    this.props.stepActions.addItem({id:'isMoreInfoNeed',isMoreInfoNeed: isMoreInfoNeeded})

    const result = getPriceData(param)
    result.then(res => {
      return res.json()
    }).then(json => {
      // 处理获取的数据
      const data = json
      //console.log("fare price")
      if (data.error === "") {
        this.props.stepActions.addItem({id:'fare_price', ...json})
        this.props.stepActions.updateItem({id:'payment', cash_amount:this.getTotalFareTotal(json.PaxDetails)})
        this.setState({isBusy:false, error:data.error, isDataLoad:true})

      } else {
        this.setState({error: data.error, isBusy:false})
      }
    })
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

      return tempGrossCount
    }




  componentDidMount() {
    this.props.stepActions.updateItem({
      id:'system',
      heading:'kPassenger'
    })

     if(this.getReduxDataByID('fare_price') == null)
     {
       this.getPrice()
     }
     else {
       this.setState({isDataLoad:true})
     }

     window.scrollTo(0,0);

  } //end of componentDidMount


  validateSubmit() {
    let detail = this.getReduxDataByID('contact_details')
    var isEmail = util.validateEmail(detail.Email)
    var isPhone = detail.Phone.trim() != ''

    return isEmail && isPhone && this.state.isConfirmed
  }

  getHtml() {
   const state = this.state


   if(state.isBusy)
   {
     return <SpinDiv keywordFn={(item)=> {return this.getKeyword(item)}}/>
   }
   else {
     //not busy
     if (state.error !=='')
     {
       //show error
       return <div><MessageDiv type="error" keywordFn={(item)=> {return this.getKeyword(item)}} message={this.state.error}/></div>
     }
     else {
       if (!this.state.isDataLoad)
       {
         //console.log("isdataload", this.props.isDataLoad)
         return <div></div>
       }
       else {
         //try {
           const html = this.getContent()
           return (
             <div>
             {html}
             </div>
           )
        // }
         //catch(err) {
             //console.log("error", err.message)
             //return <div><MessageDiv keywordFn={(item)=> {return this.getKeyword(item)}} message={err.message}/></div>
         //}
     }
     }
   }
 }

 onChange(key, e)
 {
   //console.log(key, e.target.value)
   this.props.stepActions.updateItem({id:'contact_details', [key]:e.target.value})
 }

 onConfirm(e) {
   this.setState({isConfirmed:e.target.checked})
 }


 getContent()
 {
   let isPC = this.getReduxDataByID('system').device === 'pc'
   const details = this.getReduxDataByID('contact_details')
   const strSpan = isPC? 8:24
   const lftClass = isPC? 'input-group pad-ver pad-rgt':'input-group pad-all'
   const rgtClass = isPC? 'input-group pad-ver pad-lft':'input-group pad-all'

   const divClass =  isPC? 'pax-all-div':'pax-all-div-mb'

   let noteClass = isPC? 'pull-right notes':'notes'

   return (
     <div className={divClass}>
     <div className="flight-header">
       <i className="fa fa-user">&nbsp;</i>
        {this.getKeyword("kPassengerDetails")}
       <div className= {noteClass}>
       <Icon type="info-circle" />
        {this.getKeyword("kPassengerDetailsNote")}
       </div>
     </div>
       {
         this.getReduxDataByID('adult').map((item, index) => {
         return <Pax key={index} keywordFn={(item)=>{return this.getKeyword(item)}} index={index} type='adult' data={item}></Pax>
         })
       }

       {
         this.getReduxDataByID('child').map((item, index) => {
         return <Pax key={index} keywordFn={(item)=>{return this.getKeyword(item)}} index={index} type='child' data={item}></Pax>
         })
       }

       {
         this.getReduxDataByID('infant').map((item, index) => {
         return <Pax key={index} keywordFn={(item)=>{return this.getKeyword(item)}} index={index} type='infant' data={item}></Pax>
         })
       }

       <div className="flight-header">
         <i className="fa fa-address-card">&nbsp;</i>
          {this.getKeyword("kContactDetails")}
          <div className= {noteClass}>
          <Icon type="info-circle" />
           {this.getKeyword("kContactDetailsNote")}
          </div>
       </div>
       <Row>
         <Col span={strSpan}>
           <div className={lftClass}>
               <span className="input-group-addon"><i className="fa fa-phone"></i><i className="text text-danger text-bold"> *</i></span>
               <input type="text" className="form-control" value={details.Phone}  onChange={this.onChange.bind(this,'Phone')} placeholder={this.getKeyword("kPhone")}/>
           </div>
         </Col>
         <Col span={strSpan}>
           <div className="input-group pad-all">
               <span className="input-group-addon"><i className="fa fa-mobile"></i></span>
               <input type="text" className="form-control" value={details.Mobile}   onChange={this.onChange.bind(this,'Mobile')} placeholder={this.getKeyword("kMobile")}/>
           </div>
         </Col>
         <Col span={strSpan}>
           <div className={rgtClass}>
               <span className="input-group-addon"><i className="fa fa-envelope"></i><i className="text text-danger text-bold"> *</i></span>
               <input type="text" className="form-control" value={details.Email}   onChange={this.onChange.bind(this,'Email')} placeholder={this.getKeyword("kEmail")}/>
           </div>
         </Col>
       </Row>
       <div className='pad-ver'>
          <table className="policy-table">
            <tbody>
              <tr>
                <td className="pad-hor">
                     {this.state.isConfirmed}
                     <Checkbox checked={this.state.isConfirmed} onChange={this.onConfirm.bind(this)}></Checkbox>
                </td>
                <td>
                  <div className="policy" dangerouslySetInnerHTML={{__html: isPC? this.getKeyword("kConfirmPolicy"):util.replaceAll(this.getKeyword("kConfirmPolicy"),'device=pc','device=mb') }}></div>
                </td>
              </tr>
            </tbody>
          </table>
       </div>
    </div>
   )
 }

  render() {
    let isPC = this.getReduxDataByID('system').device =='pc'
    let divClass = isPC? 'white-div middle-box':'white-div'
    return (
      <div className={divClass}>
        <Availability data={this.getReduxDataByID('selectedAV')}  legIndex={0} displayType="1" selectedAV = "1" />
        {this.getHtml()}
        <div className="text-right">
          <button className="btn  btn-primary" style={{marginRight:"10px"}} onClick={this.goBack.bind(this)}>{this.getKeyword("kPrev")}</button>
          {
              this.validateSubmit()
              ?<button className="btn btn-warning" onClick={this.submit.bind(this)}>{this.getKeyword("kSubmit")}</button>
              :<button className="btn btn-info" disabled>{this.getKeyword("kSubmit")}</button>
          }
        </div>
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
    optionsActions: bindActionCreators(optionsActionCollection, dispatch),
    stepActions: bindActionCreators(stepActionCollection, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Passenger)
