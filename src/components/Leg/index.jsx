import React from 'react'

import {Link, hashHistory} from 'react-router'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import LegBoard from '../legBoard'
import Calendar from '../calendar'
import './index.css'

import {
  Menu,
  Dropdown,
  Radio,
  Button,
  Icon,
  Input,
  Col,
  Row,
  Tooltip,
  message,
  Popover
} from 'antd'



import util from '../../util/utility'
import * as stepActionCollection from '../../actions/step'
import * as optionsActionCollection from '../../actions/options'

import moment from 'moment';


class Leg extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      fsrArr: [1,2,3,4,5,6],
      adult:[1,2,3,4,5,6,7,8,9],
      child:[0,1,2,3,4,5,6,7,8],
      infant:[0,1,2,3,4,5,6,7,8],
      travel_class:['Economy','Premium Economy','Business','First'],
      fsrIndex:0,
      isShowLegBoard:false,
      fsrKey:'',
      inputValue:'',
      loading:false,
      from_city:'',
      to_city:'',
      addaTrip:[],
      defaultMp:[]
    }
  }

  deleteTrip=()=>{

    const {defaultMp} = this.state;
    const id= 6;
    defaultMp.pop(id);
    defaultMp.pop(id)
    defaultMp.pop(id)
    defaultMp.pop(id)
    this.setState({
      defaultMp
    })
  }
  handleVisibleChange(visible)  {
    this.setState({
      visible: visible
    })
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


  startSearch ()  {
    //  this.setState({ loading: true });
    let legs = this.getReduxDataByID('legs')
    let fsr = this.getFsr()
    let system = this.getReduxDataByID('system')
    let isLast = this.props.index == legs.length-1
    let isReturn = system.trip_type == 'RT'

    if (fsr.from_city.trim() == '')
    {
      message.error(this.getKeyword('kInputFromCity'));
      return;
    }

    if (fsr.to_city.trim() == '')
    {
      message.error(this.getKeyword('kInputToCity'));
      return;
    }


    if (fsr.departure_date.trim() == '')
    {
      message.error(this.getKeyword('kInputFromDate'));
      return;
    }

    if ((system.trip_type == 'RT') && (fsr.return_date.trim() == ''))
    {
      message.error(this.getKeyword('kInputReturnDate'));
      return;
    }



    this.props.searchFn();
  }

  getFsr() {
    let legs = this.getReduxDataByID("legs")
    return legs[this.props.index]
  }

  toggleLegBoard() {
    this.setState({isShowLegBoard:false})
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.focusIndex != this.props.index)
    {
      this.setState({isShowLegBoard:true})
    }

    //console.log('fsr', nextProps.fsr)

    if(nextProps.fsr.from_city != this.props.fsr.from_city)
    {
      this.setState({from_city:this.getCityName(nextProps.fsr.from_city)})
    }

    if(nextProps.fsr.to_city != this.props.fsr.to_city)
    {
      this.setState({to_city:this.getCityName(nextProps.fsr.to_city)})
    }

  }


  refreshLegData(key, value) {
    let legs = this.getReduxDataByID('legs')
    for (var i=0;i< legs.length; i++)
    {
      let theLeg = this.getReduxDataByID('leg'+i)
      if(theLeg != null)
      {
        this.props.stepActions.updateItem(
          {
            ...theLeg,
            ...{fsr: {...theLeg.fsr, ...{[key]:value}}}
          }
        )
      }
    }
  }

  updateSystem(key, value)
  {
    //console.log(key+ value)
    let system = this.getReduxDataByID('system')
    this.props.stepActions.updateItem({
       id:'system',
       [key]:value
    })

    this.refreshLegData(key, value)

    if(['adult', 'child', 'infant'].indexOf(key) >=0)
    {
      let targetArr = this.getReduxDataByID(key)
      if(targetArr.length != value)
      {
        if (targetArr.length < value)
        {
           this.props.stepActions.addArrayItem({
             id:key,
             obj:util.createPax(key,value - targetArr.length)
           })
        }
        else {
          this.props.stepActions.updateArrayLength({
            id:key,
            length:value
          })
        } //end of else
      } //end of not equal
    }
  }

  updateTravelClass(e)
  {
    this.updateSystem('travel_class', e.target.value)
  }

  getPaxNumber(adultType)
  {
    let system = this.getReduxDataByID('system')
    let value = system[adultType]
    let arr = this.state[adultType]

    return (
      <tr>
      <td className="input-title blue-font"> {this.getKeyword('k'+adultType)}</td>
      {
        arr.map ((item,index)=>{
             let theClass = item == value? 'pax-number-active':'pax-number'
             return <td key={index} className="pax-number-cell"><div className='text-center' onClick={this.updateSystem.bind(this,adultType,item)}><span className={theClass}>{item}</span></div></td>
           })
      }
      </tr>
    )
  }

  getPopContent() {
    const class_options = this.state.travel_class.map(d => <option key={d} value={d}>{ this.getKeyword("k"+d.replace(" ",''))}</option>)
    const fsr = this.getFsr()
    let system = this.getReduxDataByID('system')
    let tClass = system.travel_class
    const RadioGroup = Radio.Group

    return (
    <div className="pop-input-div">
      <table className="frame-table">
        <tbody>
            {
              this.getPaxNumber('adult')
            }
            {
              this.getPaxNumber('child')
            }
            {
              this.getPaxNumber('infant')
            }
        </tbody>
      </table>
      <div className="tclass-div">
      <RadioGroup onChange={this.updateTravelClass.bind(this)} value={system.travel_class}>
      {
        this.state.travel_class.map ((item,index)=>{
             let theClass = item == tClass? 'tclass-active':'tclass'
             return   <Radio key={index} value={item}>{item}</Radio>
           })
      }
      </RadioGroup>
      </div>

    </div>
  )
  }



  getFsrOption(index) {
    let fsr = this.getFsr()
    let system = this.getReduxDataByID('system')
    let legArr = this.getReduxDataByID('legs')
    let key = this.state.fsrKey

    if(key.indexOf('city') >=0)
    {
      return(
        <div>
        {
          this.getCityOptionHtml(index)
        }
        </div>
      )
    }

    if(key=='departure_date')
    {
      let min = this.props.index == 0? util.formatDateValue(new Date()):legArr[this.props.index-1].departure_date
      return <Calendar attr="departure_date" device={this.getReduxDataByID("system").device} value={fsr.departure_date} min={min} max={fsr.return_date}  placeholder={this.getKeyword("kDepartureDate")} selectFn={this.selectDate.bind(this)}/>
    }

    if(key=='return_date')
    {
      let min = legArr[0].departure_date==''? util.formatDateValue(new Date()):legArr[0].departure_date
      return(
        <Calendar attr="return_date" device={this.getReduxDataByID("system").device} value={fsr.return_date} min={min}  placeholder={this.getKeyword("kReturnDate")} selectFn={this.selectDate.bind(this)}/>
      )
    }


      if(key=='pax_class')
      {
        return(
           <div>
            {
              this.getPopContent()
            }
           </div>
        )
    }
  }

  cityChange(key,e)
  {
    this.setState({[key]:e.target.value})
  }

  fsrChange(index,key,e) {
    console.log("index:"+index+' '+key+ ' '+e.target.value)
    let value = e.target.value.trim()
    let system = this.getReduxDataByID("system")
    let stateValue = this.state[key]
    let fsr = this.getFsr()

    if(value != stateValue)
    {
      if(key.indexOf('city') >=0)
      {
        if(this.getCityName(fsr[key]) == stateValue)
        {
          if(value !='')
          {
            this.setState({[key]:value.replace(stateValue,'')})
          }
          else {
            this.setState({[key]:value})
          }
        }
      }
      else {
        this.setState({[key]:value})
      }
    }

    if ((value != '') && (value.length >=3))
    {
      if(!this.state.isShowLegBoard)
      {
        this.setState({isShowLegBoard:true})
      }
    }
  }

  fsrFocus(index,key) {
    this.setState({fsrIndex:index, fsrKey: key, isShowLegBoard:true}, function(){
      this.updateSystem('focusIndex', this.props.index)
    })
  }

  getArrowUp(isArrow){
    if(isArrow)
    {
      return <div className="text-right"><img src="/images/icon/arrow-up.png" /></div>
    }
    else {
      return <div></div>
    }
  }

  getFsrCellPax(index, isArrow) {
    let system = this.getReduxDataByID('system')
    let paxCount = system.adult + system.child + system.infant

    if(system.device == 'pc')
    {
      return(
        <div>
          <Row>
              <Col span={4}><i className='fa fa-user'/></Col>
              <Col span={20} style={{verticalAlign:'middle'}}>
                  <div className="pax-cabin" onClick={this.fsrFocus.bind(this, index,'pax_class')} >{this.getKeyword('kPax')}:{paxCount}/{this.getKeyword('k'+system.travel_class)}</div>
              </Col>
          </Row>
          {
            this.getArrowUp(isArrow)
          }
        </div>
      )
    }
    else {
      return(
        <div>
          <Row>
              <Col span={5}><i className='fa fa-user'/></Col>
              <Col span={19} style={{verticalAlign:'middle'}}>
                  <div className="pax-cabin" onClick={this.fsrFocus.bind(this, index,'pax_class')} >{this.getKeyword('kPax')}:{paxCount}/{this.getKeyword('k'+system.travel_class)}</div>
              </Col>
          </Row>
        </div>
      )
    }


  }

  removeLeg(item_index){
    this.props.stepActions.removeArrayItem(
      {
        id:'legs',
        index:item_index
      }
    )
  }

  addNewLeg() {
    this.props.addFn()
  }

  getSearchButton() {
    return <Button type="primary"  onClick={this.startSearch.bind(this)}>
              {this.getKeyword('kSearch')}
            </Button>
  }

  addATripButton(){
    console.log('id')
    let {defaultMp} =  this.state;
    const id= 6;
    defaultMp.push(id)
    defaultMp.push(id)
    defaultMp.push(id)
    defaultMp.push(id)
    this.setState({
      defaultMp
    })
    console.log('id',id)
  }
  getAddATripButton=()=>{

    return <Button type="primary"  onClick={this.addATripButton.bind(this)}>
              Add a trip
            </Button>
  }

  getFsrCell(index) {
    console.log('indexindex1',index)
    let legs = this.getReduxDataByID('legs')
    let fsr = this.getFsr()
    let system = this.getReduxDataByID('system')
    let isLast = this.props.index == legs.length-1
    let isReturn = system.trip_type == 'RT'

    let isArrow = (this.state.fsrIndex == index) && this.state.isShowLegBoard && (system.focusIndex == this.props.index) &&(system.device=='pc')

    if(index ==0)
    {
      return (
        <div className="fsr-cell">
          <Row>
              <Col span={5}><img src={util.getIconImage("dep.png")}/></Col>
              <Col span={19} style={{verticalAlign:'middle'}}>
                  <div className="form-group">
                    <Input className="form-input"  value={this.state.from_city} placeholder={this.getKeyword('kFromCity')} onFocus={this.fsrFocus.bind(this, index,'from_city')}  onChange={this.cityChange.bind(this, 'from_city')}/>
                  </div>
              </Col>
          </Row>
          {
            this.getArrowUp(isArrow)
          }
        </div>
      )
    }
 
    if(index ==1) {
      return (
        <div className="fsr-cell">
          <Row>
              <Col span={5}><img src={util.getIconImage("arv.png")}/></Col>
              <Col span={19} style={{verticalAlign:'middle'}}>
                  <div className="form-group">
                    <Input className="form-input"  value={this.state.to_city} placeholder={this.getKeyword('kToCity')}  onFocus={this.fsrFocus.bind(this, index,'to_city')}   onChange={this.cityChange.bind(this, 'to_city')}/>
                  </div>
              </Col>
          </Row>
          {
          this.getArrowUp(isArrow)
          }
        </div>
      )
    }

    if(index == 2)
    {
      return (
      <div className="fsr-cell">
        <Row>
            <Col span={5}><i className='fa fa-calendar'/></Col>
            <Col span={19} style={{verticalAlign:'middle'}}>
                <div className="form-group">
                  <Input className="form-input" value={fsr.departure_date} placeholder={this.getKeyword('kFromDate')} onFocus={this.fsrFocus.bind(this, index,'departure_date')}  onChange={this.fsrChange.bind(this, index,'departure_date')}/>
                </div>
            </Col>
        </Row>
        {
          isArrow
          ?<div className="text-right"><img src="/images/icon/arrow-up.png" /></div>
          :<div></div>
        }
      </div>
    )
    }

    if(system.trip_type == 'OW')
    {
      if(index==3)
      {
        return (
            <div className="fsr-cell">
            {
              this.getFsrCellPax(isArrow)
            }
            </div>
        )
      }

      if(index == 4)
      {
        return <div className="fsr-btn-cell">{this.getSearchButton()}</div>
      }
    }


    if (system.trip_type == 'RT')
    {
      if(index == 3)
      {
        return(
          <div className="fsr-cell">
            <Row>
                <Col span={5}><i className='fa fa-calendar'/></Col>
                <Col span={19} style={{verticalAlign:'middle'}}>
                    <div className="form-group">
                      <Input className="form-input" value={fsr.return_date} placeholder={this.getKeyword('kToDate')}  onFocus={this.fsrFocus.bind(this, index,'return_date')}   onChange={this.fsrChange.bind(this, index,'return_date')} />
                    </div>
                </Col>
            </Row>
            {
              this.getArrowUp(isArrow)
            }
          </div>
        )
      }

      if(index == 4)
      {
        return (
            <div className="fsr-cell">
            {
              this.getFsrCellPax(isArrow)
            }
            </div>
        )
      }

      if(index == 5)
      {
            return <div className="fsr-btn-cell">{this.getSearchButton()}</div>
      }
    }

    
    if(system.trip_type == 'MP'){
      if(index == 4 )
      {
        return (
         <div>
          <p className="step-color">2nd pass</p>
            <div className="fsr-cell">
            <Row>
                <Col span={5}><img src={util.getIconImage("dep.png")}/></Col>
                <Col span={19} style={{verticalAlign:'middle'}}>
                    <div className="form-group">
                      <Input className="form-input"  value={this.state.from_city} placeholder={this.getKeyword('kFromCity')} onFocus={this.fsrFocus.bind(this, index,'from_city')}  onChange={this.cityChange.bind(this, 'from_city')}/>
                    </div>
                </Col>
            </Row>
            {
              this.getArrowUp(isArrow)
            }
          </div>
         </div>
        )
      }
      if(index == 5 )
      {
        return (
          <div><p className="step-color-padding"></p>
          <div className="fsr-cell">
          <Row>
              <Col span={5}><img src={util.getIconImage("arv.png")}/></Col>
              <Col span={19} style={{verticalAlign:'middle'}}>
                  <div className="form-group">
                    <Input className="form-input"  value={this.state.to_city} placeholder={this.getKeyword('kToCity')}  onFocus={this.fsrFocus.bind(this, index,'to_city')}   onChange={this.cityChange.bind(this, 'to_city')}/>
                  </div>
              </Col>
          </Row>
          {
          this.getArrowUp(isArrow)
          }
        </div>
        </div>
        )
      }
     
      if(index == 6 )
      {
        return (
          <div><p className="step-color-padding"></p>
          <div className="fsr-cell">
        <Row>
            <Col span={5}><i className='fa fa-calendar'/></Col>
            <Col span={19} style={{verticalAlign:'middle'}}>
                <div className="form-group">
                  <Input className="form-input" value={fsr.departure_date} placeholder={this.getKeyword('kFromDate')} onFocus={this.fsrFocus.bind(this, index,'departure_date')}  onChange={this.fsrChange.bind(this, index,'departure_date')}/>
                </div>
            </Col>
        </Row>
        {
          isArrow
          ?<div className="text-right"><img src="/images/icon/arrow-up.png" /></div>
          :<div></div>
        }
      </div>
      </div>
        )
      }
      if(index==8 )
      {
        return (
         <div>
            <p className="step-color">3nd pass</p>
            <div className="fsr-cell">
            <Row>
                <Col span={5}><img src={util.getIconImage("dep.png")}/></Col>
                <Col span={19} style={{verticalAlign:'middle'}}>
                    <div className="form-group">
                      <Input className="form-input"  value={this.state.from_city} placeholder={this.getKeyword('kFromCity')} onFocus={this.fsrFocus.bind(this, index,'from_city')}  onChange={this.cityChange.bind(this, 'from_city')}/>
                    </div>
                </Col>
            </Row>
            {
              this.getArrowUp(isArrow)
            }
          </div>
         </div>
        )
      }

      if(index ==9 )
      {
        return (
          <div><p className="step-color-padding"></p>
          <div className="fsr-cell">
          <Row>
              <Col span={5}><img src={util.getIconImage("arv.png")}/></Col>
              <Col span={19} style={{verticalAlign:'middle'}}>
                  <div className="form-group">
                    <Input className="form-input"  value={this.state.to_city} placeholder={this.getKeyword('kToCity')}  onFocus={this.fsrFocus.bind(this, index,'to_city')}   onChange={this.cityChange.bind(this, 'to_city')}/>
                  </div>
              </Col>
          </Row>
          {
          this.getArrowUp(isArrow)
          }
        </div>
        </div>
        )
      }

      if(index ==10)
      {
        return (
          <div><p className="step-color-padding"></p>
          <div className="fsr-cell">
        <Row>
            <Col span={5}><i className='fa fa-calendar'/></Col>
            <Col span={19} style={{verticalAlign:'middle'}}>
                <div className="form-group">
                  <Input className="form-input" value={fsr.departure_date} placeholder={this.getKeyword('kFromDate')} onFocus={this.fsrFocus.bind(this, index,'departure_date')}  onChange={this.fsrChange.bind(this, index,'departure_date')}/>
                </div>
            </Col>
        </Row>
        {
          isArrow
          ?<div className="text-right"><img src="/images/icon/arrow-up.png" /></div>
          :<div></div>
        }
      </div>
      </div>
        )
      }

      if(index ==12)
      {
        return (
         <div>
           <p className="step-color">Step4</p>
            <div className="fsr-cell">
            <Row>
                <Col span={5}><img src={util.getIconImage("dep.png")}/></Col>
                <Col span={19} style={{verticalAlign:'middle'}}>
                    <div className="form-group">
                      <Input className="form-input"  value={this.state.from_city} placeholder={this.getKeyword('kFromCity')} onFocus={this.fsrFocus.bind(this, index,'from_city')}  onChange={this.cityChange.bind(this, 'from_city')}/>
                    </div>
                </Col>
            </Row>
            {
              this.getArrowUp(isArrow)
            }
          </div>
         </div>
        )
      }

      if(index==13 )
      {
        return (
          <div><p className="step-color-padding"></p>
          <div className="fsr-cell">
          <Row>
              <Col span={5}><img src={util.getIconImage("arv.png")}/></Col>
              <Col span={19} style={{verticalAlign:'middle'}}>
                  <div className="form-group">
                    <Input className="form-input"  value={this.state.to_city} placeholder={this.getKeyword('kToCity')}  onFocus={this.fsrFocus.bind(this, index,'to_city')}   onChange={this.cityChange.bind(this, 'to_city')}/>
                  </div>
              </Col>
          </Row>
          {
          this.getArrowUp(isArrow)
          }
        </div>
        </div>
        )
      }

      
     
      if(index ==14)
      {
        return (
          <div><p className="step-color-padding"></p>
          <div className="fsr-cell">
        <Row>
            <Col span={5}><i className='fa fa-calendar'/></Col>
            <Col span={19} style={{verticalAlign:'middle'}}>
                <div className="form-group">
                  <Input className="form-input" value={fsr.departure_date} placeholder={this.getKeyword('kFromDate')} onFocus={this.fsrFocus.bind(this, index,'departure_date')}  onChange={this.fsrChange.bind(this, index,'departure_date')}/>
                </div>
            </Col>
        </Row>
        {
          isArrow
          ?<div className="text-right"><img src="/images/icon/arrow-up.png" /></div>
          :<div></div>
        }
      </div>
      </div>
        )
      }
      if(index ==16)
      {
        return (
         <div>
           <p className="step-color">Step5</p>
            <div className="fsr-cell">
            <Row>
                <Col span={5}><img src={util.getIconImage("dep.png")}/></Col>
                <Col span={19} style={{verticalAlign:'middle'}}>
                    <div className="form-group">
                      <Input className="form-input"  value={this.state.from_city} placeholder={this.getKeyword('kFromCity')} onFocus={this.fsrFocus.bind(this, index,'from_city')}  onChange={this.cityChange.bind(this, 'from_city')}/>
                    </div>
                </Col>
            </Row>
            {
              this.getArrowUp(isArrow)
            }
          </div>
         </div>
        )
      }
      
      if(index ==17)
      {
        return (
          <div><p className="step-color-padding"></p>
          <div className="fsr-cell">
          <Row>
              <Col span={5}><img src={util.getIconImage("arv.png")}/></Col>
              <Col span={19} style={{verticalAlign:'middle'}}>
                  <div className="form-group">
                    <Input className="form-input"  value={this.state.to_city} placeholder={this.getKeyword('kToCity')}  onFocus={this.fsrFocus.bind(this, index,'to_city')}   onChange={this.cityChange.bind(this, 'to_city')}/>
                  </div>
              </Col>
          </Row>
          {
          this.getArrowUp(isArrow)
          }
        </div>
        </div>
        )
      }

      
      if(index ==18)
      {
        return (
          <div><p className="step-color-padding"></p>
          <div className="fsr-cell">
        <Row>
            <Col span={5}><i className='fa fa-calendar'/></Col>
            <Col span={19} style={{verticalAlign:'middle'}}>
                <div className="form-group">
                  <Input className="form-input" value={fsr.departure_date} placeholder={this.getKeyword('kFromDate')} onFocus={this.fsrFocus.bind(this, index,'departure_date')}  onChange={this.fsrChange.bind(this, index,'departure_date')}/>
                </div>
            </Col>
        </Row>
        {
          isArrow
          ?<div className="text-right"><img src="/images/icon/arrow-up.png" /></div>
          :<div></div>
        }
      </div>
      </div>
        )
      }
      
      // if(index == 4 || index==8 ||index ==12 || index ==16)
      // {
      //   return (
      //    <div>
      //       <div className="fsr-cell">
      //       <Row>
      //           <Col span={5}><img src={util.getIconImage("dep.png")}/></Col>
      //           <Col span={19} style={{verticalAlign:'middle'}}>
      //               <div className="form-group">
      //                 <Input className="form-input"  value={this.state.from_city} placeholder={this.getKeyword('kFromCity')} onFocus={this.fsrFocus.bind(this, index,'from_city')}  onChange={this.cityChange.bind(this, 'from_city')}/>
      //               </div>
      //           </Col>
      //       </Row>
      //       {
      //         this.getArrowUp(isArrow)
      //       }
      //     </div>
      //    </div>
      //   )
      // }

      // if(index == 5 || index ==9 || index==13 || index ==17)
      // {
      //   return (
      //     <div className="fsr-cell">
      //     <Row>
      //         <Col span={5}><img src={util.getIconImage("arv.png")}/></Col>
      //         <Col span={19} style={{verticalAlign:'middle'}}>
      //             <div className="form-group">
      //               <Input className="form-input"  value={this.state.to_city} placeholder={this.getKeyword('kToCity')}  onFocus={this.fsrFocus.bind(this, index,'to_city')}   onChange={this.cityChange.bind(this, 'to_city')}/>
      //             </div>
      //         </Col>
      //     </Row>
      //     {
      //     this.getArrowUp(isArrow)
      //     }
      //   </div>
      //   )
      // }

      // if(index == 6 || index ==10 || index ==14 || index ==18)
      // {
      //   return (
      //     <div className="fsr-cell">
      //   <Row>
      //       <Col span={5}><i className='fa fa-calendar'/></Col>
      //       <Col span={19} style={{verticalAlign:'middle'}}>
      //           <div className="form-group">
      //             <Input className="form-input" value={fsr.departure_date} placeholder={this.getKeyword('kFromDate')} onFocus={this.fsrFocus.bind(this, index,'departure_date')}  onChange={this.fsrChange.bind(this, index,'departure_date')}/>
      //           </div>
      //       </Col>
      //   </Row>
      //   {
      //     isArrow
      //     ?<div className="text-right"><img src="/images/icon/arrow-up.png" /></div>
      //     :<div></div>
      //   }
      // </div>
      //   )
      // }

      if(index==7){
        if(!(index==7 && this.state.defaultMp.length>8)){
          return <div><p className="step-color-padding"></p><div className="fsr-btn-cell">{this.getAddATripButton()}</div></div>
        }else{
          return <div><p className="step-delete" onClick={this.deleteTrip}>delete</p><div className="fsr-cell">---</div></div>
        }
      }

      if(index==11){
        if(!(index==11 && this.state.defaultMp.length>12)){
          return <div><p className="step-color-padding"></p><div className="fsr-btn-cell">{this.getAddATripButton()}</div></div>
        }else{
          return <div><p className="step-delete" onClick={this.deleteTrip}>delete</p><div className="fsr-cell">---</div></div>
        }
      }
      if(index==15){
        if(!(index==15 && this.state.defaultMp.length>16)){
          return <div><p className="step-color-padding"></p><div className="fsr-btn-cell">{this.getAddATripButton()}</div></div>
        }else{
          return <div><p className="step-delete" onClick={this.deleteTrip}>delete</p><div className="fsr-cell">---</div></div>
        }
      }
      if(index==19){
        return <div><p className="step-delete" onClick={this.deleteTrip}>delete</p> <div className="fsr-cell">---</div></div>
      }

      
    
    }

    if(this.props.index == 0)
    {
      return (
          <div className="fsr-cell">
          {
            this.getFsrCellPax(isArrow)
          }
          </div>
      )
    }

    return (
        <div>
          <Row>
            <Col className="fsr-cell text-center" span={6}><Button type="primary" icon="plus-circle" onClick={this.addNewLeg.bind(this)} /></Col>
            {
              legs.length == 2
              ?<Col className="fsr-cell text-center" span={6}></Col>
              :<Col className="fsr-cell text-center" span={6}><Button type="danger" icon="close" onClick={this.removeLeg.bind(this,this.props.index)}/></Col>
            }
            <Col span={12}><div className="fsr-btn-cell">{this.getSearchButton()}</div></Col>
          </Row>
        </div>
    )
  }

  selectDate(key, value)
  {
    //console.log(key,value)
    let legs = this.getReduxDataByID('legs')
    this.props.stepActions.updateArrayItem({
      id:'legs',
      key: key,
      value:value,
      index:this.props.index
    })

    let legID = 'leg'+ this.props.index
    this.props.stepActions.updateItem({
      id:legID, fsr:{...this.getReduxDataByID(legID).fsr, ...{[key]:value}}
    })


    this.setState({[key]:value, isShowLegBoard:false})
  }

  updateFsr(key, value) {
    //console.log(key, value)
    let legs = this.getReduxDataByID('legs')
    this.props.stepActions.updateArrayItem({
      id:'legs',
      key: key,
      value:value,
      index:this.props.index
    })

    let legID = 'leg'+ this.props.index
    this.props.stepActions.updateItem({
      id:legID, fsr:{...this.getReduxDataByID(legID).fsr, ...{[key]:value}}
    })


    if ((key == 'from_city') ||(key == 'to_city'))
    {
       this.setState({[key]:this.getCityName(value), isShowLegBoard:false})
    }
  }


  validCityName(item, input) {
    try {
      var value = input.trim().toLowerCase();
      if ((value.length < 3) || (value == '')) {
        return false;
      }

      let isLength = value.length > 2
      let isCode = item.City.toLowerCase() === value
      let isName = (item.CityName != null)&&((item.CityName.toLowerCase()+"").indexOf(value) >= 0)
      let isNameCn = (item.CityName_Cn != null)&&((item.CityName_Cn+"").indexOf(value) >= 0)

      if (isLength && (isCode || isName || isNameCn)) {
        return true;
      }
      return false;
    }
    catch(err)
    {
      return false;
    }
  }

  fromCityFilter(item) {
    //console.log(item)
    return this.validCityName(item, this.state.from_city);
  }

  toCityFilter(item) {
    //console.log(item)
    return this.validCityName(item, this.state.to_city);
  }


  getCityName(value) {
    if (value === '')
      return '';
    const city = this.props.options.city;
    for (var i = 0; i < this.props.options.city.length; i++) {
      if (value === city[i].City) {
        return city[i].CityName_Cn;
      }
    }

    return ''
  }

  getDefaultDate(value, is_departure) {
    if (value === "") {
      return null;
    } else {
      var words = value.split("-");
      return new Date(words[0], words[1] - 1, words[2]);
    }
  }

  onSwapCity() {
    const fsr = this.props.data
    var obj = {};
    obj["from_city"] = fsr.to_city;
    obj["to_city"] = fsr.from_city;
    this.setState({from_city:this.getCityName(obj.from_city), to_city:this.getCityName(obj.to_city)})
    this.props.updateFn(this.props.index, obj)
  }

  //----------------------------------------------------------

  onChange(key, date, dateString) {
    this.updateFsr(key, dateString)
  }

  handleInputChange(key, e) {
    e.stopPropagation()
    this.updateFsr(key, e.target.value)
  }

  handleSelectChange(key, event) {
    this.updateFsr(key, event.target.value)
  }


  componentDidMount() {
    
    let {defaultMp} =  this.state;
    defaultMp.push(6)
    defaultMp.push(6)
    defaultMp.push(6)
    defaultMp.push(6)
    defaultMp.push(6)
    defaultMp.push(6)
    defaultMp.push(6)
    defaultMp.push(6)
    this.setState({
      defaultMp
    })
    this.setState ({
      from_city: this.getCityName(this.getFsr().from_city),
      to_city: this.getCityName(this.getFsr().to_city),
    })
  } //end of componentDidMount

  disabledTodayDate(current) {
    const maxDate = this.props.data.not_before
    return current && current.valueOf() < util.getDateByString(maxDate)
  }

  disabledBeforeFromDate(current) {
    const maxDate = this.props.data.departure_date
    return current && current.valueOf() < util.getDateByString(maxDate)
  }

  handleSearch(key, value) {
    //console.log("handleSearch "+key+ ' '+ value);
    this.setState({[key]: value})
  }


  onSelect(key, value) {
    //console.log("onSelect "+key+ ' '+ value);
    this.updateFsr(key, value)
    this.setState({[key]: this.getCityName(value)})
  }

  onAutoChange(key, value, label)
  {
    //console.log("onChange "+key+ ' '+ value);
    this.setState({key:value})
  }

  getCabinClassText() {
    const fsr = this.props.data
    var text = fsr.adult+ ' '+this.getKeyword("kAdult")
    if (fsr.child > 0)
    {
      text += ' '+ fsr.child+ ' '+this.getKeyword("kChild")
    }

    if (fsr.infant > 0)
    {
      text += ' '+ fsr.infant + ' '+this.getKeyword("kInfant")
    }

    text += ' '+ this.getKeyword("k"+fsr.travel_class.replace(' ',''))

    return text
  }

  getKeyword(text)
  {
    return util.getKeyword(text, this.props.options.keywords, this.getReduxDataByID('system').language)
  }


  getSwapClass() {
    const fsr = this.props.data
    if((fsr.to_city.trim() ==='') ||(fsr.from_city.trim() ===''))
    {
      return "hidden"
    }
    else {
      if(this.props.index > 0)
      {
        return "btn btn-warning swap_div low"
      }
      else {
        return "btn btn-warning swap_div"
      }
    }
  }

  getSystem() {
    return this.getReduxDataByID('system')
  }


  getInputValue(aKey) {
    if(aKey.toLowerCase().indexOf('city') > 0)
    {
        let fsr = this.getFsr()
        if((fsr[aKey] != '') && (this.getCityName(fsr[aKey]) == this.state[aKey]))
        {
          return fsr[aKey]
        }
        return this.state[aKey]
    }
  }

  getFsrArr() {
    let system = this.getSystem()
    if(system.device == 'pc')
    {
      return system.trip_type == 'OW'? [5,5,5,5,4]: system.trip_type=="RT"? [4,4,4,4,4,4]:this.state.defaultMp
    }
    else {
      return system.trip_type == 'OW'? [24,24,24,24,24]: system.trip_type=="RT"? [24,24,24,24,24,24]:[24,24,24,24]
    }
  }

  getLegboardHtml() {
      let system = this.getReduxDataByID('system')

      if (system.device =='pc')
      {
        if(!((system.focusIndex == this.props.index) && this.state.isShowLegBoard))
        {
          return null
        }
        else {
          return  <LegBoard legIndex={this.props.index} boardType={0} updateFsr={this.updateFsr.bind(this)} toggleLegBoard ={this.toggleLegBoard.bind(this)} fsrKey={this.state.fsrKey} inputValue={this.getInputValue(this.state.fsrKey)}/>
        }
      }
      else {
        let mbClass = (system.focusIndex == this.props.index) && this.state.isShowLegBoard? "left-float-div full-div in": 'left-float-div full-div'
        return (
          <div className={mbClass}>
             <div className="fake-header header-title white-font">
                <table  style={{width:'100%'}}>
                  <tbody>
                    <tr>
                      <td style={{width:'25%'}}><div className="pad-hor text-left"><i className="fa fa-chevron-left" onClick={this.toggleLegBoard.bind(this)}></i></div></td>
                      <td style={{width:'50%'}}><div className="text-center">{this.state.fsrKey}</div></td>
                      <td style={{width:'25%'}}></td>
                    </tr>
                  </tbody>
                </table>
             </div>
             <LegBoard legIndex={this.props.index} boardType={0} updateFsr={this.updateFsr.bind(this)} toggleLegBoard ={this.toggleLegBoard.bind(this)} fsrKey={this.state.fsrKey} inputValue={this.getInputValue(this.state.fsrKey)}/>
          </div>
        )
      }
  }

  getHtml() {
    const fsr = this.getFsr()
    let system = this.getSystem()
    let state = this.state
    //let fsrArr = system.trip_type == 'OW'? [5,5,5,5,4]: system.trip_type=="RT"? [4,4,4,4,4,4]:[6,6,6,6]
    let fsrArr = this.getFsrArr()
    return (
      <div className="fare-search-container">
          <div className="middle-box">
            <Row gutter={2}>
             {
               fsrArr.map((item,index)=>{
                 return <Col span={item} key={index}>{this.getFsrCell(index)}</Col>
               })
             }
           </Row>
         </div>
        { this.getLegboardHtml()}
     </div>
    )
  }


  getButton() {
     const index = this.props.index
     if(index == 0)
     {
       if (this.getReduxDataByID('system').device === 'pc')
       {
              return <div className="input-div text-center"></div>
       }
       else {
              return <div></div>
       }

     }
     else {
       if (index == 1)
       {
         return (
           <div className="input-div text-left">
             <button className="btn btn-icon" onClick={this.addLeg.bind(this)}><i className="fa fa-plus-square" aria-hidden="true"></i></button>
            </div>
         )
       }
       else {
         return (
           <div className="input-div text-left">
             <button className="btn btn-icon" onClick={this.addLeg.bind(this)}><i className="fa fa-plus-square" aria-hidden="true"></i></button>
             <button className="btn btn-icon" onClick={this.removeLeg.bind(this)}><i className="fa fa-window-close" aria-hidden="true"></i></button>
            </div>
         )
       }
     }
  }

  getReturnDateHtml() {
    const span2 =  !this.props.isMobile? 4:24
    const tripType = this.props.trip_type
    const labelClass = (this.props.isMobile || this.props.index ==0)
      ? 'search-title'
      : 'invisible'

    if (tripType === 'MC')
    {
      return (
        <Col span={span2}>
          {
            (this.props.isMobile && this.props.index == 0)
            ?<div></div>
            :<div className={labelClass}>&nbsp;</div>
          }
          {this.getButton()}
        </Col>
      )
    }
    else
    {
      if (tripType === "RT")
      {
        //return date
        const data = this.props.data
        return  ( <Col span={span2}>
              <div className={labelClass}> {this.getKeyword("kReturn")}</div>
              <div className="input-div">
                  <Calendar disabledDate = {this.disabledBeforeFromDate.bind(this)} allowClear={false} value ={moment(data.return_date, 'YYYY-MM-DD')} onChange={this.onChange.bind(this, 'return_date')}/>
              </div>
          </Col>
        )
      }
      else {

          // return date hiding
          if (this.props.isMobile)
          {
            return <div></div>
          }
          else {
            return (<Col span={span2}>
                  <div className={labelClass}> {this.getKeyword("kReturn")}</div>
                  <div className="input-div text-center">
                      ---
                  </div>
              </Col>
            )
        }
      }
    }
  }

  render() {
    const strClass = (this.props.isMobile? 'mbleg':'pcleg')+' '+this.getReduxDataByID('system').brand+'-div'
    let legs = this.getReduxDataByID('legs')
    let legsJson = JSON.stringify({legs:legs[this.props.index], state:this.state})
    return (
      <div className={strClass}>
        {this.getHtml()}
      </div>
    )
  }
}

// -------------------redux react 绑定--------------------
function mapStateToProps(state) {
  return {
    options: state.options,
    step: state.step,
    isMobile: state.step.byHash['system'].device !== 'pc'
  }
}

function mapDispatchToProps(dispatch) {
  return {
    optionsActions: bindActionCreators(optionsActionCollection, dispatch),
    stepActions: bindActionCreators(stepActionCollection, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Leg)
