import React from 'react'


import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import util from '../../util/utility'

import * as optionsActionCollection from '../../actions/options'
import * as stepActionCollection from '../../actions/step'



class PaxInfo extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = Object.assign({},this.props.data);
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

  componentDidMount() {}

  getKeyword(key) {
    return util.getKeyword(key, this.props.options.keywords, this.getReduxDataByID('system').language)
  }

  onChange(key, e)
  {
    //console.log(key, e.target.value);
    this.setState({key:e.target.value});
  }

  getNumberArray(l,r) {
    return new Array(r - l+1).fill().map((_,k) =>  k + l);
  }

  getPrice() {
    const paxDetails = this.getReduxDataByID("fare_price").PaxDetails
    for (var i=0; i< paxDetails.length; i++)
    {
      if((this.props.data.PaxType ==='ADT') && (paxDetails[i].IsAdult))
      {
        return paxDetails[i];
      }

      if((this.props.data.PaxType ==='CHD') && (paxDetails[i].IsChild))
      {
        return paxDetails[i];
      }

      if((this.props.data.PaxType ==='INF') && (paxDetails[i].IsInfant))
      {
        return paxDetails[i];
      }
    }
  }

  getPaxType(item){
    if (item === 'ADT')
    {
      return 'kAdult'
    }

    if (item === 'CHD')
    {
      return 'kChild'
    }

    return 'kInfant'
  }

  getNationality(nid)
  {
    const nations = this.props.options.nationnality
    for (var i=0; i< nations.length; i++)
    {
      if (nations[i].ID == nid)
      {
        return nations[i].Name;
      }
    }
  }

  render() {
    const pax = this.props.data
    const signClass = pax.PaxType === "ADT"? "fa fa-user":"fa fa-child"
    const signText = this.getKeyword(this.getPaxType(pax.PaxType))
    const price = this.getPrice()
    const currencySymbol = util.getCurrencySymbol(this.getReduxDataByID('leg0').currency)


    return (
      <div className="pax-info">
        <div className="pax-info-header">#{this.props.index+1}   {pax.PaxTitle}  {pax.PaxFirstName} {pax.PaxMiddleName} {pax.PaxLastName} <span className="pull-right"><i className={signClass}></i> {signText} <i className="fa fa-calendar"></i>{this.getKeyword("kDOB")}({pax.PaxDay}/{pax.PaxMonth}/{pax.PaxYear})</span></div>
        <div className="row" style={{marginLeft:0, marginRight:0}}>
                  <div className="col-lg-8 col-md-8 col-sm-6 col-xs-12">
                      <div className="row" style={{"display":pax.IDType===""? "none":"block"}}>
                          <div className="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                              <i className="fa fa-id-card"></i>&nbsp;{this.getKeyword("kIdType")}
                          </div>
                          <div className="col-lg-7 col-md-7 col-sm-7 col-xs-7 col-md-7 col-sm-7 col-xs-7 text-bold">
                              {pax.IDType}
                          </div>
                      </div>
                      <div className="row" style={{"display":pax.PassportNo===""? "none":"block"}}>
                          <div className="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                             &nbsp;
                          </div>
                          <div className="col-lg-7 col-md-7 col-sm-7 col-xs-7 text-bold">
                              {pax.PassportNo}
                          </div>
                      </div>
                      <div className="row" style={{"display":pax.Nationality===""? "none":"block"}}>
                          <div className="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                              <i className="fa fa-user-circle-o"></i>&nbsp;{this.getKeyword("kNationality")}
                          </div>
                          <div className="col-lg-7 col-md-7 col-sm-7 col-xs-7 text-bold">
                             {this.getNationality(pax.Nationality)}
                          </div>
                      </div>
                      <div className="row" style={{"display":pax.PassportPlace===""? "none":"block"}}>
                          <div className="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                              <i className="fa fa-map-marker map-marker"></i>&nbsp;{this.getKeyword("kPassportPlace")}
                          </div>
                          <div className="col-lg-7 col-md-7 col-sm-7 col-xs-7 text-bold">
                              {pax.PassportPlace}
                          </div>
                      </div>
                      <div className="row"  style={{"display":pax.PassportExpireYear+'-'+pax.PassportExpireMonth+'-'+pax.PassportExpireDay==='--'? "none":"block"}}>
                          <div className="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                              <i className="fa fa-calendar"></i> {this.getKeyword("kPassportExpired")}
                          </div>
                          <div className="col-lg-7 col-md-7 col-sm-7 col-xs-7 text-bold">
                              {pax.PassportExpireYear+'-'+pax.PassportExpireMonth+'-'+pax.PassportExpireDay}
                          </div>
                      </div>
                      <div  className="row" style={{"display":pax.Member===""? "none":"block"}}>
                          <div className="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                              <i className="fa fa-paper-plane"></i>&nbsp;{this.getKeyword("kFF")}
                          </div>
                          <div className="col-lg-7 col-md-7 col-sm-7 col-xs-7 text-bold">
                              {pax.Member}
                          </div>
                      </div>
                      <div  className="row" style={{"display":pax.Membership===""? "none":"block"}}>
                          <div className="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                              <i className="fa fa-drivers-license-o"></i>&nbsp;{this.getKeyword("kMember")}
                          </div>
                          <div className="col-lg-7 col-md-7 col-sm-7 col-xs-7 text-bold">
                              {pax.Membership}
                          </div>
                      </div>
                  </div>
                  {/*
                  <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                      <div  className="row" style={{"display":pax.ktn===""? "none":"block"}}>
                          <div className="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                              <i className="fa fa-server"></i>&nbsp;{this.getKeyword("kKTN")}
                          </div>
                          <div className="col-lg-7 col-md-7 col-sm-7 col-xs-7  text-bold">
                              {pax.ktn}
                          </div>
                      </div>
                      <div  className="row" style={{"display":pax.rcn===""? "none":"block"}}>
                          <div className="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                              <i className="fa fa-server"></i>&nbsp;{this.getKeyword("kRCN")}
                          </div>
                          <div className="col-lg-7 col-md-7 col-sm-7 col-xs-7  text-bold">
                              {pax.rcn}
                          </div>
                      </div>
                  </div>
                  */}
                  <div  className="col-lg-4 col-md-4 col-sm-6 col-xs-12 text-right">
                      <div className="row">
                          <div className="col-lg-5 col-md-5 col-sm-5 col-xs-5 text-bold">
                              {this.getKeyword("kNetFare")}
                          </div>
                          <div className="col-lg-7 col-md-7 col-sm-7 col-xs-7 text-bold text-danger">
                              {currencySymbol}{(+price.AirPrice).toFixed(2)}
                          </div>
                      </div>
                      <div className="row">
                          <div className="col-lg-5 col-md-5 col-sm-5 col-xs-5 text-bold">
                              {this.getKeyword("kTax")}
                          </div>
                          <div className="col-lg-7 col-md-7 col-sm-7 col-xs-7 text-bold text-danger">
                              {currencySymbol}{(+price.Tax).toFixed(2)}
                          </div>
                      </div>
                      <div className="row">
                          <div className="col-lg-5 col-md-5 col-sm-5 col-xs-5 text-bold">
                              {this.getKeyword("kTotalWithTax")}
                          </div>
                          <div className="col-lg-7 col-md-7 col-sm-7 col-xs-7  text-bold text-danger text-lg">
                              {currencySymbol}{(+(price.AirPrice) + +(price.Tax)).toFixed(2)}
                          </div>
                      </div>
                  </div>
              </div>
      </div>
    )
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

export default connect(mapStateToProps, mapDispatchToProps)(PaxInfo)
