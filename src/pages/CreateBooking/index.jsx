import React from 'react'

import {Link, withRouter} from 'react-router-dom'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as optionsActionCollection from '../../actions/options'
import * as stepActionCollection from '../../actions/step'

import {createBooking, getPaymentTransaction} from '../../fetch/service'

import MessageDiv from '../../components/MessageDiv'
import SpinDiv from '../../components/SpinDiv'
import PaxInfo from '../../components/PaxInfo/index'

import Cart from '../../components/Cart/index'

import util from '../../util/utility'

import {Col, Row, Modal, Button, message, Icon} from 'antd'

import PaymentGateway from './subpage/gateway'
import './style.less'

class CreateBooking extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showModal:false,
      isLoadingTrasaction:false,
      isBusy:false,
      isDataLoad:false,
      isPaymentSuccess:false,
      isShowFailureMessage: false,
      orderno:'',
      error:''
    }
  }

  getReduxDataByID(id)
  {
    return util.getReduxDataByID(this.props.step, id)
  }

  getKeyword(text)
  {
    return util.getKeyword(text, this.props.options.keywords, this.getReduxDataByID('system').language)
  }


  paymentOK() {
    this.setState({
      isLoadingTrasaction:true
    })
    const result = getPaymentTransaction({refer:this.state.orderno})
    result.then(res => {
      return res.json()
    }).then(json => {
      // 处理获取的数据
      const data = json
      //console.log("fare price")
      if (data.error === "") {
        //console.log("transaction", data)
        if (data.transaction[0].Is_Success == 1)
        {
          //this.props.stepActions.addItem({payment_transaction: json})
          //this.submit()
          //message.success(this.getKeyword('kPaySuccess'))
          this.setState({isPaymentSuccess:true, isShowFailureMessage:false})
        }
        else {
          //message.error(this.getKeyword('kPayFailure'))
          this.setState({isPaymentSuccess:false, isShowFailureMessage:true})
        }

      } else {
         message.error(this.getKeyword('kPayNotFound'))
         this.setState({isPaymentSuccess:false, isShowFailureMessage:false})
      }

      this.setState({
        showModal: false,
        isLoadingTrasaction: false
      })
    }).catch(resp => {
      this.setState({
        showModal: false,
        isLoadingTrasaction: false
      })

      message.error("Failed to location payment information");
    })
  }

  paymentCancel() {
    this.setState({
      showModal: false,
    });
  }


  goHome() {
    var arr = [ 'isMoreInfoNeed', 'fare_price', 'payment', 'pnr']
    for (var i=1; i< this.getReduxDataByID("legs").length; i++)
    {
      arr.push('leg'+ i)
    }

    for (var i=0;i< arr.length; i++)
    {
      this.props.stepActions.removeItem(arr[i])
    }

    this.props.stepActions.updateItem({
       id: 'contact_details', ...{
       Mobile: "",
       Phone: "",
       Email: "",
       SpecialNotes: "",
       LastPurchaseDate: ""}
    })

    this.props.stepActions.clearMultiArray(['cart', 'adult', 'child', 'infant'])

    this.props.stepActions.updateItem({
      id:'system',
      ...{
          trip_type: "RT",
          legIndex: 0,
          adult: 1,
          infant: 0,
          child: 0,
          travel_class: "Economy"
        }
      })

    this.props.stepActions.updateArrayItem(
      {
        id:'legs',
        index:0,
        obj: {...this.getReduxDataByID('legs')[0], ...util.getFreshFsr()}
      }
    )

    this.props.stepActions.updateItem(
      {
        id: 'leg0',
        fsr: util.getFreshFsr()
      }
    )

    this.props.stepActions.addArrayItem(
      {
        id:'adult',
        obj: util.createPax('adult',1)
      }
    )


    this.props.history.push("/")
  }

  goBack() {
    this.props.history.push("Passenger")
  }

  getKeyword(key) {
    return util.getKeyword(key, this.props.options.keywords, this.getReduxDataByID('system').language)
  }



    submit() {
    let fsr = this.getReduxDataByID('leg0').fsr;
    let price = this.getReduxDataByID('fare_price').PaxDetails

    var strPaxDetail = JSON.stringify({
      adult: JSON.stringify(this.props.step.byHash['adult']),
      child: JSON.stringify(this.props.step.byHash['child']),
      infant:JSON.stringify(this.props.step.byHash['infant'])
    })

    var farePrice =[];
    for (var i=0;i<price.length; i++)
    {
      farePrice.push({
        ...price[i],
        ...{FareBasises:''}
      })
    }

    let arrAdult = this.getReduxDataByID('adult')

    var param = {
      token: "rrr",
      data: {
        AvailList: util.getPriceParam(this.props.step, this.getReduxDataByID('system').currency).data.AvailList,
        PaxDetails: [...this.props.step.byHash['adult'], ...this.props.step.byHash['child'],...this.props.step.byHash['infant']],
        Header: {...this.props.step.byHash['contact_details'],...this.getReduxDataByID('system')},
        IsAutoTicket: 0,
        Payment:this.props.step.byHash['payment'],
        jsonPax:strPaxDetail,
        jsonPrice: JSON.stringify(farePrice),
        jsonFlight:'',
        email: this.props.step.byHash['contact_details'].Email,
        title: arrAdult[0].PaxTitle,
        first_name: arrAdult[0].PaxFirstName,
        last_name: arrAdult[0].PaxLastName,
        phone:this.props.step.byHash['contact_details'].Phone
      }
    }


    /*
    const carts = this.props.step.byHash['cart'];

    for (var k=0; k< carts.length; k++)
    {
      var cart = carts[k]
      var searchResult = this.props.step.byHash['leg'+cart.leg].searchResult.SearchList;
      var dep = searchResult[cart.gds].Departure;
      var av = searchResult[cart.gds].Rows[cart.fare].AvailReference[cart.av];

      var depObj = Object.assign({}, dep[av.DepartureId - 1]);

      for (var i = 0; i < depObj.FlightList.length; i++) {
        var obj = depObj.FlightList[i];
        obj.BookClass = searchResult[cart.gds].Rows[cart.fare].Departure.BookClass;
      }


      param.data.AvailList.push(depObj);

      if(av.ReturnId > 0)
      {
        var ret = searchResult[cart.gds].Return;
        retObj =   Object.assign({}, ret[av.ReturnId - 1]);

        for (var i = 0; i < retObj.FlightList.length; i++) {
          var obj = retObj.FlightList[i];
          obj.BookClass = searchResult[cart.gds].Rows[cart.fare].Return.BookClass;
        }

        param.data.AvailList.push(retObj);
      }
    }
    */

    this.setState({isBusy:true})

    var arrAvailist =[];
    for (var i=0;i<param.data.AvailList.length; i++)
    {
      arrAvailist.push({
        ...param.data.AvailList[i],
        ...{FlightList:JSON.stringify(param.data.AvailList[i].FlightList), ReferenceKeys:''}
      })
    }

    param.data.jsonFlight = JSON.stringify(arrAvailist)

    const result = createBooking(param)
    result.then(res => {
      return res.json()
    }).then(json => {
      // 处理获取的数据
      const data = json
      if (data.error === "") {
        this.props.stepActions.addItem({id:'pnr',  ...json});
        this.setState({isBusy:false, error: data.error, isDataLoad:true, orderno:data.orderno})

      } else {
        this.setState({error: data.error, isBusy:false, orderno:''});
      }
    })
  }

  onChange(key, value)
 {
   //console.log(key, e.target.value)
   this.props.stepActions.updateItem({id:'payment', [key]:value})
 }

   startPayment(gateway) {
     this.setState({
       showModal: true
     });

     //Gateway(string  SupplierID, string Amount, string Refer,  string Token)
     if (!window.location.origin) {
      window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
     }
     var preFix = window.location.port==3000?  window.location.origin.replace("3000","50380"):window.location.origin;
     window.open(preFix+"/Payment/Gateway?SupplierID="+ gateway.ID+'&Amount='+0+'&Refer='+this.state.orderno+"&Token=123456")
   }


  getHtml() {
   const state = this.state

   if(state.isBusy)
   {
     return <SpinDiv keywordFn={(item)=> {return this.getKeyword(item)}}/>
   }
   else {
     //not busy
     if (state.error !='')
     {
       return <div>
               <div className="text-right pad-all">
                 <button className="btn btn-primary" onClick={this.goBack.bind(this)}>{this.getKeyword("kPrev")}</button>
               </div>
                <MessageDiv type="error" keywordFn={(item)=> {return this.getKeyword(item)}} message={this.state.error}/>
              </div>
     }
     else {
       if (!state.isDataLoad)
       {
         return <div></div>
       }
       else {
         try {
           const paxes = [...this.props.step.byHash['adult'], ...this.props.step.byHash['child'],...this.props.step.byHash['infant']]
           const device = this.getReduxDataByID('system').device
           let divClass = device == 'pc'? 'createbooking-white-div':"createbooking-white-div-mb"
           let noteClass = device == 'pc'? 'pull-right notes':"notes"
           return (
             <div className={divClass}>
               <div className="jumbotron">
                 <h1>{this.getKeyword("kRelocator")}: {this.props.step.byHash['pnr'].Relocators[0]}</h1>
                 <p>{this.getKeyword('kBookingSuccessMessage')}</p>
                 {
                   state.isShowFailureMessage
                   ?<p className="text-danger">{this.getKeyword('kPayFailureInfo')}</p>
                   :null
                 }

                 {
                   state.isPaymentSuccess
                   ?<p className="text-success">{this.getKeyword('kPaySuccessInfo')}</p>
                   :null
                 }
               </div>

               <div className="flight-header">
                 <i className="fa fa-user"></i>
                 {this.getKeyword("kPassengerDetails")}
               </div>
               <div>
                 {this.getReduxDataByID('adult').map((item, index) => {
                   return <PaxInfo key={index} index={index} data={item} show_price={1}></PaxInfo>
                 })
                }
                {this.getReduxDataByID('child').map((item, index) => {
                  return <PaxInfo key={index} index={index} data={item} show_price={1}></PaxInfo>
                })
               }
               {this.getReduxDataByID('infant').map((item, index) => {
                 return <PaxInfo key={index} index={index} data={item} show_price={1}></PaxInfo>
               })
              }
               </div>
               <div className="flight-header">
                 <i className="fa fa-plane"></i>
                {this.getKeyword('kFlightsItinerary')}
               </div>
               <Cart device={this.getReduxDataByID('system').device} isEdit={false}/>
               {
                 !this.state.isPaymentSuccess
                 ?<div className="flight-header">
                  <i className="fa fa-credit-card"></i> {this.getKeyword("kPayment")} &nbsp;
                  <label>
                    <i className="fa fa-cc-visa"></i>
                    <i className="fa fa-cc-amex"></i>
                    <i className="fa fa-cc-mastercard"></i>
                    <i className="fa fa-cc-jcb"></i>
                    <i className="fa fa-cc-diners-club"></i>
                    <i className="fa fa-cc-discover"></i>
                </label>
                <div className= {noteClass}>
                <Icon type="info-circle" />
                 {this.getKeyword("kPaymentNote")}
                </div>
                 </div>
                 :<div></div>
               }
                 {
                   this.state.isPaymentSuccess
                   ?<div></div>
                   :<PaymentGateway paymentFn={(gw)=>{this.startPayment(gw)}} amount={this.getReduxDataByID("payment").cash_amount}/>
                 }
             </div>
           )
         }
         catch(err) {
             return <div><MessageDiv keywordFn={(item)=> {return this.getKeyword(item)}} message={err.message}/></div>
         }
     }
     }
   }
 }

 componentDidMount() {

   this.props.stepActions.updateItem({
     id:'system',
     heading:'kCreateBooking'
   })

   if(!this.state.isDataLoad)
   {
     this.submit()
   }

     window.scrollTo(0,0);
 } //end of componentDidMount


  render() {

    let isPC = this.getReduxDataByID('system').device =='pc'
    let divClass = isPC? 'white-div middle-box':'white-div'
    return (
      <div className={divClass}>
        <Modal
         title="付款中"
         visible={this.state.showModal}
         footer={[
           <Button key="submit" type="primary" loading={this.state.isLoadingTrasaction} onClick={this.paymentOK.bind(this)}>
             结束付款
           </Button>,
         ]}
        >
         <p>付款结束前请不要关闭窗口</p>
       </Modal>
        <div className="flight-header">
          <div className="text-right">
            {
              this.state.error==''
              ?<button className="btn btn-warning" onClick={this.goHome.bind(this)}>{this.getKeyword("kBack")}</button>
              :<div></div>
            }
          </div>
        </div>
        {this.getHtml()}
      </div>
    )
  }
}

// 使用 require.ensure 异步加载，还不支持 ES6 的 export
// export default Detail
// -------------------redux react 绑定--------------------

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
export default connect(mapStateToProps, mapDispatchToProps)(CreateBooking)
