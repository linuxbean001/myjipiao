import React from 'react'

import {Link, withRouter} from 'react-router-dom'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as optionsActionCollection from '../../../actions/options'
import * as stepActionCollection from '../../../actions/step'

import {getPaymentData} from '../../../fetch/service'



import MessageDiv from '../../../components/MessageDiv'
import SpinDiv from '../../../components/SpinDiv'



import util from '../../../util/utility'

import {Col, Row} from 'antd'

import './style.less'

class PaymentGateway extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      error: "",
      isDataLoad:false,
      gateway:[],
      orderNo:'',
      isProcessing:false,
      isBusy:false
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


    getKeyword(text)
    {
      return util.getKeyword(text, this.props.options.keywords, this.getReduxDataByID('system').language)
    }


  getGateway() {
    this.setState({isBusy:true, gateway:[]})
    var param = {
      time: '123456',
      amount: this.props.amount
    }
    const result = getPaymentData(param)
    result.then(res => {
      return res.json()
    }).then(json => {
      // 处理获取的数据
      const data = json
      //console.log("fare price")
      if (data.error === "") {
        this.setState({isBusy:false, gateway:data.gateway, orderNo:data.orderno, error:data.error, isDataLoad:true})
      } else {
        this.setState({error: data.error, isBusy:false})
      }
    })
  }



  startPayment(gw) {
    this.setState({
      isProcessing: true
    })

    //console.log(gw)
    this.props.paymentFn(gw)
  }

  componentDidMount() {
    if(!this.state.isDataLoad)
    {
      this.getGateway()
    }
  } //end of componentDidMount

  getSurchargeDislay(item) {
    var noSurcharge =  (item.Surcharge_Percent ==0) && (item.Surcharge_Dollar == 0);
    var noPromo = (item.Discount_Percent ==0) && (item.Discount_Dollar == 0);
    var surcharge = item.Surcharge;

    if (surcharge == 0)
    {
      return <div>免支付手续费</div>
    }
    else {
      if (noPromo)
      {
          return <div>支付手续费 <i className="text-warning">{item.Surcharge_Percent}%</i>  <b className="pad-lft text-danger">${surcharge.toFixed(2)}</b></div>
      }
      else {
        return <div>
                  <div>支付手续费 <i className="text-warning">{item.Surcharge_Percent}%</i>  <b className="pad-lft text-danger">${surcharge.toFixed(2)}</b></div>
                  <div>选择<b className="text-primary pad-hor">{item.Payment_Title}</b>{this.getKeyword("kPaymentDeduct")}<i className="pad-hor text-warning">{item.Discount_Percent}%</i>{this.getKeyword("kPaymentUpTo")}<b className="pad-lft text-danger">${item.Discount_Cap.toFixed(2)}</b></div>
              </div>
      }
    }
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
       if (!state.isDataLoad)
       {
         return <div></div>
       }
       else {
           try {
             const gateway = this.state.gateway
             const device = this.getReduxDataByID('system').device
             const strClass = device==="pc"? "text-bold pad-all":"text-bold pad-all"
             let isPC = device =='pc'
             return (
               <div>
                 {
                   gateway.map((item, index)=> {
                     var bgUrl = {
                        background: "url(" + util.getImageUrl(item.Image) + ") 80% 50% no-repeat"
                     }

                     return (
                     <div key={index} className={strClass} style={{borderTop:"1px solid #e9e9e9"}}>
                       <Row type="flex" justify="space-around" align="middle">
                        <Col  xs={12} sm={12} md={12} lg={8} xl={8}>
                        {
                          isPC
                          ?<div style={bgUrl}>{item.Payment_Title}</div>
                          :<div className="text-left"><img src={util.getImageUrl(item.Image)}/></div>
                        }

                        </Col>
                        <Col  xs={12} sm={12} md={12} lg={8} xl={8}>
                        <div>{this.getSurchargeDislay(item)}</div>
                        </Col>
                        <Col  xs={12} sm={12} md={12} lg={6} xl={6}>
                        <div className="text-info">总支付金额: <b className="pad-lft text-danger">${item.Total_Charge.toFixed(2)}</b></div>
                        </Col>
                        <Col  xs={12} sm={12} md={12} lg={2} xl={2}>
                        <div>  <button className="btn btn-warning" onClick={this.startPayment.bind(this,item)}>>></button></div>
                        </Col>
                      </Row>
                    </div>
                  )
                   })
                 }
               </div>
             )
           }
           catch(err) {
               //console.log("error", err.message)
               return <div><MessageDiv keywordFn={(item)=> {return this.getKeyword(item)}} message={err.message}/></div>
           }
       }
     }
   }
 }

  render() {
    return (
      <div>
        {
          this.getHtml()
        }
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
export default connect(mapStateToProps, mapDispatchToProps)(PaymentGateway)
