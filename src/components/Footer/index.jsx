import React from 'react'

import {withRouter} from "react-router-dom";
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {hashHistory, Link} from 'react-router'

import {getSubscribe} from '../../fetch/service'
import * as optionsActionCollection from '../../actions/options'
import * as stepActionCollection from '../../actions/step'

import { Menu, Dropdown, Icon, Input, Col, Row, Button, message } from 'antd'

import util from "../../util/utility"


class Footer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
          email:'',
          name:'',
          loading:false
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

    gotoPage(item) {
      this.props.history.push({pathname:'/info', id:item.ID})
    }

    searchByText(value) {
    //  //console.log(value)
    }

    onChange(e)
    {
      this.setState({email:e.target.value})
    }

    startSubscribe() {
      this.setState({loading:true})
      var param = {
        token: "rrr",
        email: this.state.email,
        name: this.state.name
      }
      const result = getSubscribe(param)
      result.then(res => {
        return res.json()
      }).then(json => {
        // 处理获取的数据
        const data = json
        if (data.error === "") {
          message.success(this.getKeyword('kSubscribeSuccess'));

        } else {
          message.error(this.getKeyword('kSubscribeFailure'));
        }

          this.setState({loading:false})
      })
    }

    render() {
        let system = this.getReduxDataByID('system')
        if(system.device =='pc')
        {
          return (
              <div className="footer-div">
                <div className="blue-box">
                  <div className="middle-box">
                     <table className="frame-table" cellpadding="1px" cellspacing="3px">
                       <tbody>
                       <tr>
                         <td className = "td-left">
                           <table className="frame-table">
                             <tbody>
                                <tr>
                                  <td className= "post-left">
                                   {this.getKeyword('kEmailReg')}
                                  </td>
                                  <td className= "post-right">
                                   {this.getKeyword('kEmailNote')}
                                  </td>
                                </tr>
                             </tbody>
                           </table>
                         </td>
                         <td></td>
                       </tr>
                       <tr>
                        <td className="td-left">
                          <table className="frame-table">
                            <tbody>
                               <tr>
                                 <td className= "bg-white">
                                    <Input className="form-input" onChange={this.onChange.bind(this)} value={this.state.email} placeholder={this.getKeyword('kInputEmail')}/>
                                 </td>
                                 <td className= "bg-orange">
                                 <Button type="primary" loading={this.state.loading}  onClick={this.startSubscribe.bind(this)}>
                                           {this.getKeyword('kSubmit')}
                                         </Button>
                                 </td>
                               </tr>
                            </tbody>
                          </table>
                        </td>
                        <td>
                        </td>
                       </tr>
                       </tbody>
                     </table>
                     <div className="middle-box">
                       <div className="bottom-about-us">
                         <table style={{width:'100%'}}>
                          <tbody>
                            <tr>
                         {
                           this.props.options.page.map((item,index)=>{
                             let style = {width: (1/this.props.options.page.length)*100+'%'}
                             var urlTemplate =  document.getElementById("infoURL").innerText;
                             var url = urlTemplate.replace('{0}', item.Title).replace('{1}',system.language).replace('{2}', system.device)
                             return <td style={style} key={index}><a className="info-link" href={url} target='_blank'>{this.getKeyword(item.Title)}</a></td>
                           })

                         }

                              </tr>
                            </tbody>
                         </table>
                       </div>
                     </div>
                  </div>
                </div>
                <div className="payment_gateway_div text-center pad-all">
                <div className="middle-box">
                <table style={{width:'100%'}}>
                 <tbody>
                   <tr>
                   <td><img src={util.getImageUrl('Credit_Card.png')} /></td>
                   <td><img src={util.getImageUrl('Union_Pay.png')} /></td>
                   <td><img src={util.getImageUrl('Alipay.png')} /></td>
                   <td><img src={util.getImageUrl('WeChat.png')} /></td>
                   <td><img src={util.getImageUrl('Account_2_Account.png')} /></td>
                    <td><img src={util.getImageUrl("IATA.png")} /></td>
                     </tr>
                   </tbody>
                </table>
                </div>
                </div>
            </div>
          )
        }
        else {
          return (
              <div className="footer-div blue-box-mb">
                <div className="panel">
                   <div className="panel-heading">
                     <h3 className="panel-title"> {this.getKeyword('kEmailReg')}</h3>
                   </div>
                   <div className="panel-body">
                     <ul className="list-group">
                       <li className="list-group-item">  <Input className="form-input" value={system.email} placeholder=""/></li>
                       <li className="list-group-item"><div className="text-right">{this.getKeyword('kSubmit')}</div></li>
                     </ul>
                   </div>
                </div>
                     <div className="panel-body info-div">
                     <ul className="list-group">
                     {
                       this.props.options.page.map((item,index)=>{
                         var urlTemplate =  document.getElementById("infoURL").innerText;
                         var url = urlTemplate.replace('{0}', item.Title).replace('{1}',system.language).replace('{2}', system.device)
                         return  <li className="list-group-item" key={index}><a href={url} target='_blank'>{this.getKeyword(item.Title)}</a></li>
                       })
                     }
                     </ul>
                     </div>

                     <div className="panel">
                        <div className="panel-heading">
                          <h3 className="panel-title">{this.getKeyword("kPayment")}</h3>
                        </div>
                        <div className="panel-body payment-list-div">
                          <ul className="list-group">
                            <li className="list-group-item"><img src={util.getImageUrl('Credit_Card.png')} /></li>
                            <li className="list-group-item"><img src={util.getImageUrl('Union_Pay.png')} /></li>
                            <li className="list-group-item"><img src={util.getImageUrl('Alipay.png')} /></li>
                            <li className="list-group-item"><img src={util.getImageUrl('WeChat.png')} /></li>
                            <li className="list-group-item"><img src={util.getImageUrl('Account_2_Account.png')} /></li>
                          </ul>
                        </div>
                    </div>
                    <div className = "text-center pad-all">
                       <img src={util.getImageUrl("IATA.png")} style={{width:'100%'}}/>
                    </div>
            </div>
          )
        }

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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Footer))
