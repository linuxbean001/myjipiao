import React from 'react'

import {Link, withRouter} from 'react-router-dom'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as optionsActionCollection from '../../../actions/options'
import * as stepActionCollection from '../../../actions/step'

import util from '../../../util/utility'
import SpinDiv from '../../../components/SpinDiv/index'
import Cart from '../../../components/Cart/index'

import { Popover, Button, Row, Col } from 'antd';
import {getPriceData} from '../../../fetch/service'

class CartBar extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
    visible: false,
    isBusy:false,
    isShowCartDetail:false,
    isShowPrice:false,
    nett:0.00,
    tax:0.00,
    total:0,
    error:''
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

  hide() {
    this.setState({
      visible: false,
    });
  }

  handleVisibleChange (visible) {
    this.setState({ visible });
  }



  getDateFormat(item) {
    return item
  }

  getTimeFormat(item) {
    return item
  }

  goFarePrice(e) {
    e.preventDefault()
    this.props.selectFn()
  }

  getPrice() {
    this.setState({isBusy:true})
    var param = util.getPriceParam(this.props.step)
    const result = getPriceData(param)
    result.then(res => {
      return res.json()
    }).then(json => {
      // 处理获取的数据
      const data = json
      //console.log("fare price")
       if (data.error === "")
       {
         this.getTotalFareTotal(data.PaxDetails)
       }

      this.setState({error: data.error, isBusy:false})
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

      this.setState({isShowPrice:true, nett:tempNettCount, tax:tempTaxCount, total:tempGrossCount})

      //this.props.stepActions.updateItem({cartSummary:{nett:tempNettCount.toFixed(2), tax:tempTaxCount.toFixed(2), total:tempGrossCount.toFixed(2)}})
  }


 removeCart(cartitem){
   this.props.stepActions.removeArrayItem({key:'cart', data:cartitem})
   this.props.stepActions.updateItem({ccList:[], ffList:[]})
   this.setState({isShowPrice:false})
 }

 clearCart() {
   this.props.stepActions.clearArray("cart")
 }

 getKeyword(key) {
   return util.getKeyword(key, this.props.options.keywords, this.getReduxDataByID('system').language)
 }

 componentWillReceiveProps(nextProps){
   if (nextProps.step.byHash['cart'].length !== this.props.step.byHash['cart'].length)
   {
     this.setState({isShowPrice:false})
   }
 }

 getTotal() {
    var total = 0.00
    const data = this.props.step.byHash['cart']
    for (var i=0; i<data.length; i++)
    {
      total += data[i].price
    }

    return total
 }

 toggleCartDetail() {
   this.setState({isShowCartDetail:!this.state.isShowCartDetail})
 }

  getContent() {
    if (!this.state.isShowCartDetail)
    {
      return <div></div>
    }
    else {
      const data = this.props.step.byHash['cart']
      const isPC = this.getReduxDataByID('system').device === 'pc'
      const divClass = isPC? "cart-list-div pc":"cart-list-div"
      const currencySymbol = util.getCurrencySymbol(this.getReduxDataByID('leg0').currency)

      return <div className="cart-list-div">
               <div className='border-box fare-shade'>
               <Cart device={this.getReduxDataByID('system').device} isEdit={true} changeFn={(item)=>{this.removeCart(item)}}/>
               </div>
               <div className="text-center" style={{width:"100%"}}>
                 {
                   this.state.error !==''
                   ?<div className="alert alert-danger">{this.state.error}</div>
                   :<div></div>
                 }

                 {
                   this.state.isBusy
                   ?<SpinDiv keywordFn={(item)=>{return this.getKeyword(item)}}></SpinDiv>
                   :<div></div>
                 }

                 {
                   this.state.isShowPrice && !this.state.isBusy
                   ?<div className="pad-ver"><Row type="flex" justify="space-around" align="middle">
                      <Col span={8}><span className="money-span-title">{this.getKeyword('kNett')}: </span><span className="money-span">{currencySymbol}{this.state.nett}</span></Col>
                      <Col span={8}><span className="money-span-title">{this.getKeyword('kNett')}: </span><span className="money-span">{currencySymbol}{this.state.tax}</span></Col>
                      <Col span={8}><span className="money-span-title">{this.getKeyword('kTotal')}: </span><span className="money-span">{currencySymbol}{this.state.total.toFixed(2)}</span></Col>
                    </Row></div>
                   :<div></div>
                 }
                 <div className="row pad-top">
                     <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 text-left">
                         <button className="btn  btn-primary" onClick={this.getPrice.bind(this)}>{this.getKeyword('kGetPrice')}</button>
                     </div>
                     <div className="col-lg-4 col-lg-4 col-md-4 col-sm-4 col-xs-4 text-center">
                         <button className="btn btn-default" onClick={this.clearCart.bind(this)}>{this.getKeyword('kClear')}</button>
                      </div>
                    <div className="col-lg-4 col-lg-4 col-md-4 col-sm-4 col-xs-4 text-right">
                         <button className="btn  btn-warning" onClick={this.goFarePrice.bind(this)}>{this.getKeyword('kBook')}</button>
                     </div>
                 </div>
               </div>
              </div>
    }

  }


  render() {
    const cart = this.props.step.byHash['cart']
    const total = this.getTotal()
    const content = this.getContent()
    const fsr = this.getReduxDataByID('leg0').fsr
    const placement = this.getReduxDataByID('system').device==='pc'? "bottomRight":"bottomLeft"
    return (
      <div>
      <button className="btn btn-default cart-btn" type="button" onClick={this.toggleCartDetail.bind(this)}>
          <span className="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span>&nbsp;<span className="badge ng-binding">{cart.length}</span>
          <span>{this.getKeyword("kTotal")}</span>
          <span className="text-danger pad-rt">{total}</span>
          <span className="text-default">{this.getKeyword("kAdult")}<i className="badge ng-binding">{fsr.adult}</i></span>
          {
            fsr.child == 0
            ?<span></span>
            :<span className="gray-font ng-binding">Child <i className="badge ng-binding">{fsr.child}</i></span>
          }
          {
            fsr.infant == 0
            ?<span></span>
            :<span className="gray-font ng-binding">Infant <i className="badge ng-binding">{fsr.infant}</i></span>
          }
      </button>
      {content}
      </div>
    )
  }
}


function mapStateToProps(state) {
  return {
    options: state.options,
    step: state.step,
    isFarePrice: state.step.fare_price != null
  }
}

function mapDispatchToProps(dispatch) {
  return {
    optionsActions: bindActionCreators(optionsActionCollection, dispatch),
    stepActions: bindActionCreators(stepActionCollection, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CartBar)
