import React from 'react'

import {Link, hashHistory} from 'react-router'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import Calendar from '../calendar'

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


class LegBoard extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      fsrArr: [1,2,3,4,5,6],
      adult:[1,2,3,4,5,6,7,8,9],
      child:[0,1,2,3,4,5,6,7,8],
      infant:[0,1,2,3,4,5,6,7,8],
      travel_class:['Economy','Premium Economy','Business','First'],
      fsrIndex:0,
      fsrKey:'',
      isDisabled:false,
      loading:false,
      from_city:'',
      to_city:'',
      city_input:''
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

  toggleLegBoard() {
    this.props.toggleLegBoard()
  }

  getFsr() {
    let legs = this.getReduxDataByID("legs")
    return legs[this.props.legIndex]
  }

  cityInput(e) {
    //console.log('city', e.target.value)
    this.setState({city_input:e.target.value})
  }

  componentWillReceiveProps(nextProps){

    if(nextProps.inputValue != this.state.city_input)
    {
      this.setState({city_input:nextProps.inputValue})
    }
  }

  getCityOptionHtml()
  {

    let fsrKey =  this.props.fsrKey//index==0? 'from_city':'to_city'
    let index = fsrKey == 'from_city'? 0:1
    let fsr = this.getFsr()
    let system = this.getReduxDataByID('system')



    let input = this.props.isPC? this.props.inputValue : this.state.city_input//index==0? this.state.from_city:this.state.to_city

    if(this.getStringLengthForChinese(input) < 3)
    {
      let region = this.props.options.hotregion
      let city = this.props.options.hotcity
      if(system.device =='pc')
      {
        return (
            <div>
            选择下方热门城市或在输入框中输入城市和机场，支持中文、英文、三字码查询。
            <Row>
            {
              region.map((item, index)=>{
                let span = 6
                return (
                  <Col span={6} key={index}>
                        <div className="blue-font">{item.Name}</div>
                        <div className='city-option'>
                        {
                          city.map((subitem,subindex)=>{
                            if(subitem.Region_ID == item.Region_ID)
                            {
                              return   <div key={subindex+index*100} onClick={this.updateFsr.bind(this, fsrKey,subitem.Code)}><span className="c_name">{subitem.Code}</span><span className="e_name">{subitem.City_Name}</span></div>
                            }
                          })
                        }
                        </div>
                  </Col>
                )
              })
            }
            </Row>
            </div>
        )
      }
      else {
        return (
            <div>
            选择下方热门城市或在输入框中输入城市和机场，支持中文、英文、三字码查询。
            {
              region.map((item, index)=>{
                let span = 6
                return (
                  <div key={index}>
                        <div className="blue-font">{item.Name}</div>
                        <div className='city-option'>
                        {
                          city.map((subitem,subindex)=>{
                            if(subitem.Region_ID == item.Region_ID)
                            {
                              return   <div key={subindex+index*100} onClick={this.updateFsr.bind(this, fsrKey,subitem.Code)}><span className="c_name">{subitem.Code}</span><span className="e_name">{subitem.City_Name}</span></div>
                            }
                          })
                        }
                        </div>
                  </div>
                )
              })
            }
            </div>
        )
      }
    }
    else {
      let cityList = index==0? this.props.options.city.filter(this.fromCityFilter.bind(this)):this.props.options.city.filter(this.toCityFilter.bind(this))
      if(cityList.length == 0)
      {
        if (this.props.isPC)
        {
          return (
            <div>
              No matches
            </div>
          )
        }
      }
      else {
        return (
          <div>
          {cityList.map((item,index)=>{
            return <div key={index} className="city-option" onClick={this.updateFsr.bind(this, fsrKey,item.City)}>{item.Name}</div>
          })}

          </div>
        )
      }
    }
  }

  updateSystem(key, value)
  {
    ////console.log(key+ value)
    if(value < this.state[key][0])
    {
      return
    }

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
    this.props.stepActions.updateItem({
      id:'system',
      travel_class: e.target.value
    })
  }



  getPaxNumber(adultType)
  {
    let system = this.getReduxDataByID('system')
    let value = system[adultType]
    let arr = this.state[adultType]

    if (system.device =='pc')
    {
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
    else {
      return (
        <tr className='mb-pax-number'>
        <td className="input-title blue-font"> {this.getKeyword('k'+adultType)}</td>
        <td><Button type="primary" shape="circle" icon="minus" onClick={this.updateSystem.bind(this,adultType,value-1)}/></td>
        <td>{value}</td>

        <td><Button type="primary" shape="circle" icon="plus" onClick={this.updateSystem.bind(this,adultType, value+1)} /></td>

        </tr>
      )
    }

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
               if(system.device=='pc')
               {
                 return   <Radio key={index} value={item}>{this.getKeyword('k'+item)}</Radio>
               }
               else {
                 return   <Radio key={index} style={{display:'block'}} value={item}>{this.getKeyword('k'+item)}</Radio>
               }

             })
        }
        </RadioGroup>
      </div>
    </div>
    )
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

  getPeriodArr(index)
  {
    let fsr = this.getFsr()
    let tempDate = new Date();
    let min = tempDate.getFullYear()*10000+ (tempDate.getMonth()+1)*100+ tempDate.getDate();
    console.log("boardType"+ this.props.boardType)

    if (this.props.boardType == '1')
    {
      if(this.props.priceIndex == -1)
      {
        return [{
          From_Date: min+'',
          To_Date: fsr.return_date == ''? '30000101':util.replaceAll(fsr.return_date,'-','')
        }]
      }

      let selectedPrice = this.props.options.specialPrice[this.props.priceIndex]

      if(selectedPrice == null)
      {
        return [{
          From_Date: min+'',
          To_Date: fsr.return_date == ''? '30000101':util.replaceAll(fsr.return_date,'-','')
        }]
      }

      var arr=[]

      for (var i=0; i<this.props.options.specialPricePeriod.length; i++)
      {
        let item = this.props.options.specialPricePeriod[i]
        if(item.Special_Price_ID == selectedPrice.ID)
        {
          if(item.From_Date*1 <= min)
          {
            item.From_Date = min+''
          }

          arr.push(item)
        }
      }

      return arr.sort(function(a,b) {
        return a.From_Date*1 <= b.From_Date*1
      })
    }
    else {
      if(index ==0)
      {
        console.log('for departure_date')
        return [{
          From_Date: min+'',
          To_Date: fsr.return_date==''? 30000001+'':util.replaceAll(fsr.return_date,'-','')
        }]
      }
      else {
        console.log('for return_date')
        return [{
          From_Date: fsr.departure_date ==''? min+'':util.replaceAll(fsr.departure_date,'-',''),
          To_Date: 3000000001+''
        }]
      }
    }
  }

  getFsrOption() {
    let fsr = this.getFsr()
    let system = this.getReduxDataByID('system')
    let legArr = this.getReduxDataByID('legs')
    let key = this.state.fsrKey !=''? this.state.fsrKey:this.props.fsrKey

    //let arrPeriod = this.getPeriodArr()

    if(key.indexOf('city') >=0)
    {
      return(
        <div>
        {
          this.props.isPC
          ?null
          :<div className="form-group">
            <Input className="form-input"  value={this.state.city_input} placeholder={this.getKeyword('kCity')} onChange={this.cityInput.bind(this)} />
          </div>
        }


        {
          this.getCityOptionHtml()
        }
        </div>
      )
    }

    if(key=='departure_date')
    {

      let min = this.props.legIndex == 0? util.formatDateValue(new Date()):legArr[this.props.legIndex-1].departure_date
      return <Calendar key="departure_date" attr="departure_date" device={this.getReduxDataByID("system").device} value={fsr.departure_date} period={this.getPeriodArr(0)}  placeholder={this.getKeyword("kDepartureDate")} selectFn={this.selectDate.bind(this)}/>
    }

    if(key=='return_date')
    {

      return(
        <Calendar key="return_date" attr="return_date" device={this.getReduxDataByID("system").device} value={fsr.return_date} period={this.getPeriodArr(1)} placeholder={this.getKeyword("kReturnDate")} selectFn={this.selectDate.bind(this)}/>
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



  selectDate(key, value)
  {
    //console.log(key,value)
    let legs = this.getReduxDataByID('legs')
    this.props.stepActions.updateArrayItem({
      id:'legs',
      key: key,
      value:value,
      index:this.props.legIndex
    })

    let legID = 'leg'+ this.props.legIndex
    this.props.stepActions.updateItem({
      id:legID, fsr:{...this.getReduxDataByID(legID).fsr, ...{[key]:value}}
    })


    this.setState({[key]:value})

    if(this.props.boardType == 0)
    {
      this.toggleLegBoard()
    }
    else {
      if(legs[0].trip_type == 'RT')
      {
        if(key=='departure_date')
        {
          this.fsrFocus('return_date')
        }
      }
    }
  }

  updateFsr(key, value) {
    this.props.updateFsr(key,value)
  }

 getStringLengthForChinese(val) {
	var str = new String(val);
	var bytesCount = 0;
	for (var i = 0 ,n = str.length; i < n; i++) {
		var c = str.charCodeAt(i);
		if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
			bytesCount += 1;
		} else {
			bytesCount += 2;
		}
	}
	return bytesCount;
 }



  validCityName(item, input) {
    //console.log('city', input)
    try {
      var value = input.trim().toLowerCase();
      var theLength = this.getStringLengthForChinese(value)
      //console.log(theLength)
      if ((theLength < 3) || (value == '')) {
        return false;
      }

      let isCode = item.City.toLowerCase() === value
      let isName = (item.CityName != null)&&((item.CityName.toLowerCase()+"").indexOf(value) >= 0)
      let isNameCn = (item.CityName_Cn != null)&&((item.CityName_Cn+"").indexOf(value) >= 0)

      if (isCode || isName || isNameCn) {
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
    ////console.log(item)
    return this.validCityName(item, this.props.isPC? this.props.inputValue: this.state.city_input);
  }

  toCityFilter(item) {
    ////console.log(item)
    return this.validCityName(item, this.props.isPC? this.props.inputValue: this.state.city_input);
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
    this.props.updateFn(this.props.legIndex, obj)
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
    this.setState ({
      from_city: this.getCityName(this.getFsr().from_city),
      to_city: this.getCityName(this.getFsr().to_city),
      city_input:  this.props.inputValue
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
    console.log("handleSearch "+key+ ' '+ value);
    this.setState({[key]: value})
  }


  onSelect(key, value) {
    ////console.log("onSelect "+key+ ' '+ value);
    this.updateFsr(key, value)
    this.setState({[key]: this.getCityName(value)})
  }

  onAutoChange(key, value, label)
  {
    ////console.log("onChange "+key+ ' '+ value);
    this.setState({key:value})
  }

  getCabinClassText() {
    const fsr = this.getFsr()
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
      if(this.props.legIndex > 0)
      {
        return "btn btn-warning swap_div low"
      }
      else {
        return "btn btn-warning swap_div"
      }
    }
  }

  startSearch() {
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


    this.props.startSearch()
  }

  getSystem() {
    return this.getReduxDataByID('system')
  }

  fsrFocus(key) {
    this.setState({fsrKey:key})
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


  getInputBoardHtml() {
    let index = this.props.legIndex
    let fsr = this.getReduxDataByID('legs')[0]
    let system = this.getReduxDataByID('system')
    let paxCount = system.adult + system.child + system.infant

    if(system.device == 'pc')
    {
      return <div className="leg_board pad-btm">
          <table className="frame-table">
            <tbody>
              <tr>
                <th>{this.getKeyword('kFromDate')}</th>
                <th>{this.getKeyword('kToDate')}</th>
                <th>{this.getKeyword('kPax')}</th>
                <th></th>
              </tr>
              <tr>
                <td onClick={this.fsrFocus.bind(this, 'departure_date')} >
                  <div className="leg-input" >{fsr.departure_date}</div>
                </td>

                {
                  fsr.trip_type == 'RT'
                  ?<td onClick={this.fsrFocus.bind(this, 'return_date')} ><div   className="leg-input" >{fsr.return_date}</div></td>
                  :<td><div></div></td>
                }

                <td   onClick={this.fsrFocus.bind(this, 'pax_class')} >
                  <div  className="leg-input">PAX:{paxCount}/{system.travel_class}</div>
                </td>
                <td>
                  <button className="btn btn-warning" onClick={this.startSearch.bind(this)}>{this.getKeyword('kSearch')}</button>
                </td>
              </tr>
            </tbody>
          </table>
      </div>
    }
    else {
      return <div className="leg_board pad-btm">
          <table className="frame-table">
            <tbody>
            <tr>
              <td>{this.getKeyword('kFromCity')}</td>
              <td>
                <div className="leg-input" >{this.getCityName(fsr.from_city)}</div>
              </td>
            </tr>
            <tr>
              <td>{this.getKeyword('kToCity')}</td>
              <td>
                <div className="leg-input" >{this.getCityName(fsr.to_city)}</div>
              </td>
            </tr>
            <tr>
              <td>{this.getKeyword('kTripType')}</td>
              <td>
                <div className="leg-input" >{this.getKeyword('k'+fsr.trip_type)}</div>
              </td>
            </tr>
              <tr>
                <td>{this.getKeyword('kFromDate')}</td>
                <td onClick={this.fsrFocus.bind(this, 'departure_date')} className={this.state.fsrKey=='departure_date'? 'tofill active':'tofill'}>
                  <div className="leg-input" >{fsr.departure_date}</div>
                </td>
              </tr>
              {
                fsr.trip_type == 'RT'
                ?  <tr>
                    <td>{this.getKeyword('kToDate')}</td>
                    <td onClick={this.fsrFocus.bind(this, 'return_date')} className={this.state.fsrKey=='return_date'? 'tofill active':'tofill'}><div   className="leg-input" >{fsr.return_date}</div></td>
                  </tr>
                :null
              }

              <tr>
                <td>{this.getKeyword('kPax')}</td>
                <td   onClick={this.fsrFocus.bind(this, 'pax_class')} className={this.state.fsrKey=='pax_class'? 'tofill active':'tofill'}>
                  <div  className="leg-input">PAX:{paxCount}/{system.travel_class}</div>
                </td>
              </tr>

              <tr>
                <td colSpan='2'>
                  <div className="fsr-btn-cell">
                  <Button type="primary"  onClick={this.startSearch.bind(this)}>
                            {this.getKeyword('kSearch')}
                          </Button>

                  </div>
                </td>
              </tr>
            </tbody>
          </table>
      </div>
    }


  }


  render() {
    const strClass = this.props.isMobile? 'mbleg':'pcleg'
    let legs = this.getReduxDataByID('legs')
    let legsJson = JSON.stringify({legs:legs[this.props.legIndex], state:this.state})

    let fsr = this.getFsr()
    let system = this.getSystem()
    let state = this.state
    let fsrKey = this.props.fsrKey
    let fsrOptionClass = this.props.boardType == '1'? 'fsr-options index'+ Math.floor(this.props.priceIndex/4) :'fsr-options'




    return (
     <div className={fsrOptionClass}>
       <div className="middle-box">
         <div className="fsr-option-div">
         {
           !this.props.isPC
           ?<div></div>
           : <div className="fsr-area">
              <div className="close-btn"><span className="btn btn-default" onClick={this.toggleLegBoard.bind(this)}>X</span></div>
            </div>
         }

           {
             this.props.boardType ==0
             ?null
             :<div className="table-input">
                {this.getInputBoardHtml()}
              </div>
           }
           {
             this.getFsrOption()
           }
         </div>
      </div>
     </div>
    )
  }
}

// -------------------redux react 绑定--------------------
function mapStateToProps(state) {
  return {
    options: state.options,
    step: state.step,
    isPC: state.step.byHash['system'].device == 'pc'
  }
}

function mapDispatchToProps(dispatch) {
  return {
    optionsActions: bindActionCreators(optionsActionCollection, dispatch),
    stepActions: bindActionCreators(stepActionCollection, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LegBoard)
