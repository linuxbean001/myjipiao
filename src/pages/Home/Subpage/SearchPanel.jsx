import React from 'react'
import {withRouter} from "react-router-dom";
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {
  Menu,
  Dropdown,
  Radio,
  Button,
  Icon,
  Input,
  Select,
  DatePicker,
  AutoComplete,
  Col,
  Row,
  Tooltip,
  Popover
} from 'antd'



import * as optionsActionCollection from '../../../actions/options'
import * as stepActionCollection from '../../../actions/step'
import Ads from '../../../components/Ads/index'
import Leg from '../../../components/Leg/index'
import util from '../../../util/utility'

import moment from 'moment';

import {getFaresData} from '../../../fetch/service'




class SearchPanel extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      trip_type:'RT'
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

  hide(){
  this.setState({
    visible: false
  })
  }

handleVisibleChange(visible)  {
  this.setState({
    visible: visible
  })
}


  togglePanel() {
    if (this.props.step.currentFareSearchStep != 0)
    {
      if (this.props.changeFn != null)
      {
        this.props.changeFn()
      }
    }
  }

  //------------------------------------------------------------------------------------------------------------------------------------
  getFaresBySegment (data, source_index, seg_index, sector) {
    var target_fare_table = [];
    for (var j = 0; j < data[source_index].Rows.length; j++) {
      var f_obj = data[source_index].Rows[j];
      try {
        for (var k = 0; k < f_obj.AvailReference.length; k++) {
          var segId = sector == 1
            ? f_obj.AvailReference[k].DepartureId
            : f_obj.AvailReference[k].ReturnId;
          if (segId == seg_index + 1) {
            target_fare_table.push({source_index: source_index, fare_index: j, price: f_obj.BaseFare, total_fare: f_obj.TotalFare})
            break;
          }
        }
      } catch (err) {}
    }

    return target_fare_table;
  }

  createSegTable(data, i, seg_table, seg_list, it)
  {
    for (var k = 0; k < seg_list.length; k++) {

      var segment_key = "";
      var seg_obj = seg_list[k];

      for (var f = 0; f < seg_obj.FlightList.length; f++) {
        var f_obj = seg_obj.FlightList[f];
        segment_key += f_obj.CarrierCode;
        segment_key += f_obj.FlightNumber;
        segment_key += f_obj.FromCode;
      }

      var seg_found = false;

      for (var s = 0; s < seg_table.length; s++) {
        var s_obj = seg_table[s];
        if (s_obj.segment_key === segment_key) {
          s_obj.source_index.push(i);
          s_obj.seg_index.push(k);
          //s_obj.pcc.push(gds.PCC);
          seg_found = true;

          var seg_fares = this.getFaresBySegment(data, i, k, it + 1);

          s_obj.fares.push.apply(s_obj.fares, this.getFaresBySegment(data, i, k, it + 1));
          break;
        }
      }

      if (!seg_found) {
        var segment = {
          source_index: [i],
          seg_index: [k],
          segment_key: segment_key,
          is_no_stop: seg_obj.FlightList.length == 1,
          from_time: seg_obj.FlightList[0].FromTime,
          fares: [],
          DepartureUTCTick: seg_obj.FlightList[0].DepartureUTCTick
        }

        segment.fares.push.apply(segment.fares, this.getFaresBySegment(data, i, k, it + 1));

        seg_table.push(segment);
      }

    }
  }




  //------------------------------------------------------------------------------------------------------------------------------------
  onClear() {
    this.setState({fsr:[this.getNewFsr()]})
  }


  clearSearchResult() {
    this.props.stepActions.addItem({isFareTableLoad: false});
    this.props.stepActions.addItem({fareTable: []});
    this.props.stepActions.addItem({avalabilityTable: []});
    this.props.stepActions.addItem({cart: []});
    this.props.stepActions.addItem({faresIndex: []});
  }

  ajaxSearch(i, param)
  {
    const result = getFaresData(param)
    result.then(res => {
      return res.json()
    }).then(json => {
      // 处理获取的数据

      const data = json
      this.createFareTable(i,data);


      // if (data.error === '') {
      //   this.clearSearchResult()
      //   this.props.stepActions.addItem({searchResult: data})
      //   this.createFareTable(data.SearchList);
      //   if(this.props.changeFn != null){
      //     this.props.changeFn()
      //   }
      //   else {
      //   this.props.history.push('/Fare');
      //   }
      // }

      this.setState({isBusy: false})
    }).catch(resp => {
      this.setState({isBusy: false})
    });
  }

  startSearch() {
    this.props.startSearch()
  }

  getDefaultDate(value, is_departure) {
    if (value === "") {
      return null;
    } else {
      var words = value.split("-");
      return new Date(words[0], words[1] - 1, words[2]);
    }
  }

  renderOption(item) {
    const Option = Select.Option;
    return (
      <Option key={item.City} text={item.Name}>
        {item.City}
        <span className="global-search-item-count">{item.Name}</span>
      </Option>
    );
  }


  componentDidMount() {
    let system = this.getReduxDataByID('system')
    if(this.props.isDataLoad)
    {
      if(system.currentFareSearchStep === 3)
      {
        this.setReduxDataByID(
          'system',
          {...{system}, ...{currentFareSearchStep:0}}
        )
      }
    }
  }



  renderOption(item) {
    const Option = Select.Option;
    return (
      <Option key={item.City} text={item.CityName}>
        {item.CityName}
      </Option>
    )
  }

  handleSearch(key, value) {
    this.setState({[key]: value})
  }

getSystem() {
  return this.getReduxDataByID('system')
}

getSystemFsrInfo() {
  let system = this.getReduxDataByID('system')
  return {
    trip_type: system.trip_type,
    adult:system.adult,
    infant:system.infant,
    child:system.child,
    travel_class:system.travel_class,
    is_b2c: system.is_b2c,
    isAutoTicket: system.isAutoTicket,
    currency:system.currency,
    isDomestic: system.isDomestic,
    isUsa:system.isUsa
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

onChangeTripTypeMB(e) {
  this.onChangeTripType(e.target.value)
}

onChangeTripType(type) {
  let system = this.getSystem()
  let legs = this.getReduxDataByID('legs')

  let length = legs.length

  let oldType = system.trip_type
  if(oldType == type)
  {
    return
  }

  this.refreshLegData('trip_type',type)

  for(var i=0;i< legs.length; i++)
  {
    this.props.stepActions.updateArrayItem(
      {
          id:'legs',
          index:i,
          key: 'return_date',
          value:''
      }
    )
  }

  if(oldType == 'MC')
  {
    this.props.stepActions.updateArrayLength(
      {
        id:'legs',
        length:1
      }
    )

    for(var i=1; i< length; i++)
    {
      this.props.stepActions.removeItem('leg'+i)
    }
  }
  else {
    if(type == 'MC')
    {
      this.addNewLeg()
    }
  }

  this.props.stepActions.updateItem(
    {
      id:'system',
      trip_type: type
    }
  )
}

addNewLeg() {

  let length = this.getReduxDataByID('legs').length

  var tempFsr = {
      from_city: "",
      to_city: "",
      departure_date:'',
      return_date: '',
      carrier: "",
      ...this.getSystemFsrInfo()
  }

  this.props.stepActions.addArrayItem(
    {
      id:'legs',
      obj:tempFsr
    }
  )

  this.props.stepActions.addItem(
    {
      id: 'leg'+ length,
      fsr:{
        ...tempFsr
      }
    }
  )
}

  removeAllLeg(){
    let legs = this.getReduxDataByID("legs")
    let length = legs.length

    for (var i=1;i< length; i++ )
    {
      this.props.stepActions.removeItem('leg'+i)
    }

    this.props.stepActions.updateArrayLength(
      {
        id:'legs',
        length:1
      }
    )
  }

  getTripTypeHtml() {
    let system = this.getReduxDataByID('system')
    let legs = this.getReduxDataByID('legs')
    let tripArr =['OW', 'RT','MP']

    if(system.device=='pc')
    {
      return(
        <ul className="hor-list">
          {
            tripArr.map((item,index)=>{
              let liClass = item == system.trip_type? 'trip-type-li active':'trip-type-li'
              return  (  <li key={index} className={liClass} onClick={this.onChangeTripType.bind(this,item)}>
                         {this.getKeyword('k'+item)}
                        </li>
                      )
            })
          }
        </ul>
      )
    }
    else {
      return (
        <Radio.Group value={system.trip_type} onChange={this.onChangeTripTypeMB.bind(this)}>
          {
            tripArr.map((item,index)=>{
              return  (
                  <Radio.Button key={index} value={item}>{this.getKeyword('k'+item)}</Radio.Button>
                )
            })
          }
        </Radio.Group>
      )
    }
  }

  render() {
    let system = this.getReduxDataByID('system')
    let legs = this.getReduxDataByID('legs')
    console.log('legslegs',legs)
    let tripArr =['OW', 'RT']
    return (
      <div className="search-panel">
      <div className="trip-type-div middle-box">
        {this.getTripTypeHtml()}
      </div>
      <div className="legs-div">
        {
          legs.map((item,index)=>{
            const isLastObject = index === (legs.length -1)
            return (
            <Leg key={index}
              focusIndex = {system.focusIndex}
              addFn = {this.addNewLeg.bind(this)}
              searchFn = {this.startSearch.bind(this)}
              fsr={item}
              index={index}/>
            )
          })
        }
      </div>
      </div>
    )
  }
}

// -------------------redux react --------------------
function mapStateToProps(state) {
  console.log('state.options',state.options.keywords)
  return {
    options: state.options,
    step: state.step,
    isMobile: state.step.byHash['system'].device !== 'pc',
    isDataLoad: (state.step.byHash['leg0'] != null) && (state.step.byHash['leg0'].fsr != null)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    optionsActions: bindActionCreators(optionsActionCollection, dispatch),
    stepActions: bindActionCreators(stepActionCollection, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchPanel)
