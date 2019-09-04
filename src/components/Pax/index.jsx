import React from 'react'


import util from '../../util/utility'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {Row, Col} from 'antd'

import * as optionsActionCollection from '../../actions/options'
import * as stepActionCollection from '../../actions/step'



class Pax extends React.Component {
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

  onChange(key, e)
  {
    const pax = this.props.data
    let value = e.target.value
    this.props.stepActions.updateArrayItem({id:this.props.type, index: this.props.index, key:key, value:e.target.value})

    if((key == 'PaxMonth') ||(key == 'PaxYear'))
    {
      if(pax.PaxDay.trim() != '')
      {
        let max = this.getMaxDay(pax.PaxDay, value+'', pax.PaxYear)
        if (pax.PaxDay*1 > max)
        {
          this.props.stepActions.updateArrayItem({id:this.props.type, index: this.props.index, key:'PaxDay', value:''})
        }
      }
    }

    if((key == 'PassportExpireMonth') ||(key == 'PassportExpireYear'))
    {
      if(pax.PassportExpireDay.trim() != '')
      {
        let max = this.getMaxDay(pax.PassportExpireDay, value+'', pax.PassportExpireYear)
        if (pax.PaxDay*1 > max)
        {
          this.props.stepActions.updateArrayItem({id:this.props.type, index: this.props.index, key:'PassportExpireDay', value:''})
        }
      }
    }
  }

  getNumberArray(l,r) {
    return ['', ...(new Array(r - l+1).fill().map((_,k) =>  k + l))];
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

  getFrequentFlyerList() {
    var count = 0
    let carrier = this.getReduxDataByID('selectedAV').carrier_code
    let arr =  this.props.options.frequentFlierList
    for (var i=0; i< arr.length; i++)
    {
      if(carrier.toLowerCase().trim() == arr[i].Code.toLowerCase().trim())
      {
        count ++;
      }
    }

    return count
  }

  getMonthName(index)
  {
    return this.props.options['month_'+this.getReduxDataByID('system').language][index]
  }

  getMaxDay(day, month, year)
  {
    var max = 30
    if ( month.trim() != '')
    {
      if([1,3,5,7,8,10,12].indexOf(month*1) >=0)
      {
        max = 31
      }
      else {
        if(month*1 == 2)
        {
          if(year.trim() == '')
          {
            max = 28
          }
          else {
            if(this.isLeapYear(year*1))
            {
              max = 29
            }
            else {
              max = 28
            }
          }
        }
      }
    }

    return max
  }


  isLeapYear (year) {
    return !(year % (year % 100 ? 4 : 400))
  }

  render() {
    const pax = this.props.data
    const span = this.getReduxDataByID('system').device === 'pc'? '12':'24'
    const current_year = (new Date()).getFullYear();
    const getKeyword = this.props.keywordFn

    let count = this.getFrequentFlyerList()

    var low_year = 0;
    var high_year = current_year;
    switch(this.props.type) {
    case 'adult':
         //adult
        low_year = current_year -88;
        high_year = current_year-11;
        break;
    case 'child':
        low_year = current_year -11;
        high_year = current_year-1;
        break;
    case 'infant':
        low_year = current_year -2;
        high_year = current_year-0;
        break;
    default:
    }

    const month = this.getNumberArray(1,12);
    const day = this.getNumberArray(1,31);
    const year = this.getNumberArray(low_year, high_year).reverse();

    const pyear = this.getNumberArray(current_year, current_year+30);
    return (
      <div className="pax-container">
        <div className="pax-title">{getKeyword(this.getPaxType(pax.PaxType))} {this.props.index+1}</div>
          <Row>
            <Col span={span}>
              <Row type="flex" justify="space-around" align="middle">
                <Col span={8}><div className="input-label">{getKeyword("kTitle")}</div></Col>
                <Col span={16}>
                  <select className="form-control" value ={pax.PaxTitle} onChange={this.onChange.bind(this,'PaxTitle')}>
                    <option value=""></option>
                    <option value="Mr">{this.getKeyword('kMr')}</option>
                    <option value="Mrs">{this.getKeyword('kMrs')}</option>
                    <option value="Ms">{this.getKeyword('kMs')}</option>
                    <option value="Master">{this.getKeyword('kMaster')}</option>
                    <option value="Miss">{this.getKeyword('kMiss')}</option>
                  </select>
                </Col>
                <Col span={8}>
                  <div className="input-label">{getKeyword("kLastName")}<span className="red-font">*</span></div>
                </Col>
                <Col span={16}>
                  <input type="text" className="form-control" value ={pax.PaxLastName}  onChange={this.onChange.bind(this,'PaxLastName')}/>
                </Col>
              </Row>
              <Row type="flex" justify="space-around" align="middle">
                <Col span={8}><div className="input-label">{getKeyword("kFirstNameShort")}
                  <span className="red-font">*</span>
                  / {getKeyword("kMiddleNameShort")}</div></Col>
                <Col span={16}>
                  <table>
                    <tbody>
                    <tr>
                      <td><input className="form-control" type="text" value ={pax.PaxFirstName}   onChange={this.onChange.bind(this,'PaxFirstName')}/></td>
                      <td><input className="form-control" type="text" value ={pax.PaxMiddleName} placeholder={getKeyword("kMiddleName")}  onChange={this.onChange.bind(this,'PaxMiddleName')}/></td>
                    </tr>
                    </tbody>
                  </table>
                </Col>
              </Row>
              <Row type="flex" justify="space-around" align="middle">
                <Col span={8}><div className="input-label"><i className="fa fa-calendar"></i>
                &nbsp;{getKeyword("kDOB")}
                <span className="red-font">*</span></div></Col>
                <Col span={16}>
                  <table>
                    <tbody>
                    <tr>
                      <td>
                        <select className="form-control" value ={pax.PaxMonth} onChange={this.onChange.bind(this,'PaxMonth')}>
                          {month.map((item,index)=>{
                            return <option key={index} value={item}>{this.getMonthName(index)}</option>
                          })}
                        </select>
                      </td>
                      <td>
                        <select className="form-control" value ={pax.PaxDay} onChange={this.onChange.bind(this,'PaxDay')}>
                          {day.map((item,index)=>{

                            if(item <= this.getMaxDay(pax.PaxDay, pax.PaxMonth, pax.PaxYear))
                            {
                              return <option key={index} value={item}>{item}</option>
                            }
                          })}
                        </select>
                      </td>
                      <td>
                        <select className="form-control" value ={pax.PaxYear} onChange={this.onChange.bind(this,'PaxYear')}>
                          {year.map((item,index)=>{
                            return <option key={index} value={item}>{item}</option>
                          })}
                        </select>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </Col>
              </Row>
              {
                count == 0
                ?null
                :<Row type="flex" justify="space-around" align="middle">
                  <Col span={8}><div className="input-label"><i className="fa fa-paper-plane"></i>&nbsp;{getKeyword("kFF")}</div></Col>
                  <Col span={16}>
                      <select className="form-control" value ={pax.Member} onChange={this.onChange.bind(this,'Member')}>
                        <option key={-1} value="">{getKeyword('kPleaseSelect')}</option>
                        {this.props.options.frequentFlierList.map((item,index)=>{
                          let carrier = this.getReduxDataByID('selectedAV').carrier_code
                          if(carrier.toLowerCase().trim() == item.Code.toLowerCase().trim())
                          {
                            return <option key={index} value={item.Name}>{item.Name}</option>
                          }
                        })}
                      </select>
                  </Col>
                </Row>
              }

              {
                count ==0
                ?null
                :  <Row type="flex" justify="space-around" align="middle">
                    <Col span={8}><div className="input-label"><i className="fa fa-drivers-license-o"></i>&nbsp;{getKeyword("kMember")}</div></Col>
                    <Col span={16}>
                    <input className="form-control" type="text" value ={pax.Membership}   onChange={this.onChange.bind(this,'Membership')}/>
                    </Col>
                  </Row>
              }
            </Col>
            { this.getReduxDataByID('isMoreInfoNeed').isMoreInfoNeed
            ?<Col span={span}>
              <Row type="flex" justify="space-around" align="middle">
                <Col span={8}><div className="input-label"><i className="fa fa-id-card"></i>&nbsp;{getKeyword("kIdType")}</div></Col>
                <Col span={16}>
                  <select className="form-control" value ={pax.IDType}  onChange={this.onChange.bind(this,'IDType')}>
                    <option value="Passport">{getKeyword("kPassport")}</option>
                  </select>
                </Col>
              </Row>
              <Row type="flex" justify="space-around" align="middle">
                <Col span={8}><div className="input-label"><i className="fa fa-user-circle-o"></i>&nbsp;{getKeyword("kNationality")}</div></Col>
                <Col span={16}>
                    <select className="form-control" value ={pax.Nationality} onChange={this.onChange.bind(this,'Nationality')}>
                      <option key={-1} value="">{getKeyword('kPleaseSelect')}</option>
                      {this.props.options.nationnality.map((item,index)=>{
                        return <option key={index} value={item.ID}>{item.Name}</option>
                      })}
                    </select>
                </Col>
              </Row>
              <Row type="flex" justify="space-around" align="middle">
                <Col span={8}><div className="input-label"><i className="fa fa-drivers-license"></i>&nbsp;{getKeyword("kIDNo")}</div></Col>
                <Col span={16}>
                  <input className="form-control" type="text" value ={pax.PassportNo}   onChange={this.onChange.bind(this,'PassportNo')}/>
                </Col>
              </Row>
              <Row type="flex" justify="space-around" align="middle">
                <Col span={8}><div className="input-label">  <i className="fa fa-map-marker map-marker"></i>&nbsp;{getKeyword("kPassportPlace")}</div></Col>
                <Col span={16}>
                    <input className="form-control" type="text" value ={pax.PassportPlace}   onChange={this.onChange.bind(this,'PassportPlace')}/>
                </Col>
              </Row>
              <Row type="flex" justify="space-around" align="middle">
                <Col span={8}><div className="input-label"><i className="fa fa-calendar"></i>
                  &nbsp;{getKeyword("kPassportExpired")}</div></Col>
                <Col span={16}>
                  <table>
                    <tbody>
                    <tr>
                      <td>
                        <select className="form-control" value ={pax.PassportExpireMonth} onChange={this.onChange.bind(this,'PassportExpireMonth')}>
                          {month.map((item,index)=>{
                            return <option key={index} value={item}>{this.getMonthName(index)}</option>
                          })}
                        </select>
                      </td>
                      <td>
                        <select className="form-control" value ={pax.PassportExpireDay} onChange={this.onChange.bind(this,'PassportExpireDay')}>
                          {day.map((item,index)=>{
                            if(item <= this.getMaxDay(pax.PassportExpireDay, pax.PassportExpireMonth, pax.PassportExpireYear))
                            {
                              return <option key={index} value={item}>{item}</option>
                            }
                          })}
                        </select>
                      </td>
                      <td>
                        <select className="form-control" value ={pax.PassportExpireYear} onChange={this.onChange.bind(this,'PassportExpireYear')}>
                          {pyear.map((item,index)=>{
                            return <option key={index} value={item}>{item}</option>
                          })}
                        </select>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </Col>
              </Row>
            </Col>
            :<div></div>
            }
            {/*}
            <Col span={span}>
              <Row type="flex" justify="space-around" align="middle">
                <Col span={10}>
                  <div className="input-label"><i className="fa fa-server"></i>&nbsp;{getKeyword("kKTN")}</div>
                </Col>
                <Col span={14}>
                    <input type="text" className="form-control" value ={pax.ktn}  onChange={this.onChange.bind(this,'ktn')}/>
                </Col>
              </Row>
              <Row type="flex" justify="space-around" align="middle">
                <Col span={10}><div className="input-label"><i className="fa fa-server"></i>&nbsp;{getKeyword("kRCN")}</div></Col>
                <Col span={14}>
                  <input type="text" className="form-control" value ={pax.rcn}   onChange={this.onChange.bind(this,'rcn')}/>
                </Col>
              </Row>
            </Col>
            */}
          </Row>

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

export default connect(mapStateToProps, mapDispatchToProps)(Pax)
