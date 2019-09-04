import React from 'react'


import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import { AutoComplete , Select} from 'antd';
import * as stepActionCollection from '../../../actions/step'



import TinSlider from '../../../components/TinSlider/index'
import Carrierlist from './carrierlist'
import Stoplist from './stoplist'

import util from '../../../util/utility.js'

class Filter extends React.Component {
  constructor(props, context) {
    super(props, context);

  }

  getKeyword(text)
  {
    return util.getKeyword(text, this.props.options.keywords, this.getReduxDataByID('system').language)
  }

  getReduxDataByID(id)
  {
    return util.getReduxDataByID(this.props.step, id)
  }



  renderOption(item) {
    const Option = Select.Option
    return (
      <Option key={item.ID} text={item.Name}>
        {item.Name}
      </Option>
    );
  }


  handleFFChange(value) {
    const ffList = this.props.options.frequentFlierAirlineList
    const step = this.props.step
    this.props.stepActions.updateItem({ff_airline_list:value})
    for(var k=0; k< value.length; k++)
    {
      const ffa = value[k]
      const ffList = this.props.options.frequentFlierAirlineList
      for (var s= 0; s< ffList.length; s++)
      {
        if (ffa == ffList[s].ID)
        {
          for (var g=0; g< step.legCount; g++)
          {
             for (var c=0; c< step.byHash['leg'+g].carrier.length; c++)
             {
               if (step.byHash['leg'+g].carrier[c].is_selected == 0)
               {
                 step.byHash['leg'+g].carrier[c].is_selected = 1
               }
             }
          }
        }
      }
    }

  }


  hideFilter() {
    this.props.filterFn()
  }

  validFFName(item, input) {

    var value = input.trim().toLowerCase();

    if ((value.length >1) && ((item.Name.toLowerCase() === value) || (item.Name.toLowerCase().indexOf(value) >= 0))) {
      return true;
    }

    return false;
  }

  ffFilter(item) {
    return this.validFFName(item, this.getReduxDataByID('system').ffValue);
  }

  handleSearch(value) {
      if (value=='')
      {
        this.clearCarrierList()
      }

        this.props.stepActions.updateItem({
          ...this.getReduxDataByID('system'),
          ...{ffValue:value, ffName:value}
        })

  }


  onSelect(value) {
    this.props.stepActions.updateItem({id: 'system', ffValue:value, ffName:this.getFFName(value)})
    var arr =[]
    const ffalist = this.props.options.frequentFlierAirlineList
    for (var i=0; i< ffalist.length; i++)
    {
      if (ffalist[i].Frequent_Flier_ID == value)
      {
        arr.push(ffalist[i].Airline)
      }
    }


    for (var i=0; i< this.getReduxDataByID('legs').length; i++)
    {
      var leg = this.props.step.byHash['leg'+i]
      var carrier = leg.carrier.slice(0)

      for (var j=0; j< carrier.length; j++)
      {
        carrier[j].is_selected =  arr.indexOf(carrier[j].code) >=0? 1:0;
      }

      this.updateCarrierList(j, carrier)
    }

  }

  clearCarrierList() {
    for (var i=0; i< this.getReduxDataByID('legs').length; i++)
    {
      var leg = this.props.step.byHash['leg'+i]
      var carrier = leg.carrier.slice(0)

      for (var j=0; j< carrier.length; j++)
      {
        carrier[j].is_selected = 0
      }

      this.updateCarrierList(j, carrier)
    }
  }

  getFFName(id)
  {
    const ffA = this.props.options.frequentFlierList
    for (var i=0; i< ffA.length; i++)
    {
      if (ffA[i].ID == id)
      {
        return ffA[i].Name
      }
    }

    return ""
  }

  onAutoChange(value, label)
  {
    //console.log("onAutoChange value", value)
      //  this.props.stepActions.updateItem({ffValue:value, ffName:value})
  }


  render() {
    const data = this.props.data
     const isReturn = data.fsr.trip_type ==="RT"
     const getKeyword = this.props.keywordFn
     const filterByFFInput =  (item) => {
         return this.ffFilter(item)
      }
     const ffSource = this.props.options.frequentFlierList.filter(filterByFFInput).map(this.renderOption)

    const Option = AutoComplete.Option;
    const system = this.getReduxDataByID('system')

    return (
      <div>
        {
          system.device == 'pc'
          ?<div></div>
          :<div className="btn-close text-right">
            <span>{this.getKeyword('kCloseWindow0')}</span><i className="fa fa-times text-success"></i><span className='mar-rgt'>{this.getKeyword('kCloseWindow1')}</span>
            <button className="btn btn-success btn-icon"><i className="fa fa-times" onClick={this.hideFilter.bind(this)}></i></button>
          </div>
        }


        <Stoplist data={data.stop}  legIndex={this.props.legIndex} keywordFn={(item)=>{return getKeyword(item)}} changeFn={(data) => this.onStopChange(data)}/>
        <div className="slider-group">

        <h3>{getKeyword("kPrice")}</h3>
        <div>
          <TinSlider key='price' legIndex={this.props.legIndex} title="Price" indexKey="price" range={data.price} changeFn={(data) => this.onAfterChange(data)}/>
        </div>
        <h3>{getKeyword("kDurations")}</h3>
        <div>
          <TinSlider key='dep_travel_time' legIndex={this.props.legIndex} title={getKeyword('kOutgoing')} indexKey="dep_travel_time" range={data.dep_travel_time} changeFn={(data) => this.onAfterChange(data)}/>
        </div>
        {!isReturn
          ? <div></div>
          : <TinSlider key="ret_travel_time" legIndex={this.props.legIndex} title={getKeyword('kReturnLeg')} indexKey="ret_travel_time" range={data.ret_travel_time} changeFn={(data) => this.onAfterChange(data)}/>
        }
        <h3>Times</h3>
        <div>
          <TinSlider key="dep_take_off_time" legIndex={this.props.legIndex} title={getKeyword('kTakeOff')+' '+ data.fsr.from_city} indexKey="dep_take_off_time" range={data.dep_take_off_time} changeFn={(data) => this.onAfterChange(data)}/>
          <TinSlider key="dep_landing_time" legIndex={this.props.legIndex} title={getKeyword('kLanding')+ ' '+data.fsr.to_city} indexKey="dep_landing_time" range={data.dep_landing_time} changeFn={(data) => this.onAfterChange(data)}/>
        </div>
        {data.fsr.return_date === ''
          ? <div></div>
          : <div className="ret-time-container">
            <div>
              <TinSlider key="ret_take_off_time" legIndex={this.props.legIndex} title={getKeyword('kTakeOff')+ ' '+data.fsr.to_city} indexKey="ret_take_off_time" range={data.ret_take_off_time} changeFn={(data) => this.onAfterChange(data)}/>
              <TinSlider  key="ret_landing_time" legIndex={this.props.legIndex} title={getKeyword('kLanding')+ ' '+data.fsr.from_city} indexKey="ret_landing_time" range={data.ret_landing_time} changeFn={(data) => this.onAfterChange(data)}/>
            </div>
          </div>
          }
          </div>
            <div className="pad-all">
            <h3>{getKeyword("kFF")}</h3>
              <div className="pad-ver input-div">
                <AutoComplete
                  style={{ width: '100%', fontWeight:'bold', fontSize:'16px' }}
                  value={this.props.step.ffName}
                  dataSource={ffSource}
                  onChange={this.onAutoChange.bind(this)}
                  onSelect={this.onSelect.bind(this)}
                  onSearch={this.handleSearch.bind(this)}
                  placeholder={getKeyword("kPleaseSelect")}/>
            </div>
          </div>
          <Carrierlist data={data.carrier}  legIndex={this.props.legIndex} keywordFn={(item)=>{return getKeyword(item)}} changeFn={(data) => this.onCarrierChange(data)}/>
      </div>
    )
  }


  updateCarrierList(index, arr)
  {
    const dataArea = this.props.step.byHash['leg'+index]
    this.props.stepActions.updateItem({id:'leg'+index, ...{...dataArea, ...{carrier:arr}}})
  }

  onCarrierChange(data)
  {
    this.props.onAfterChange({key:'carrier', value:data})//()
  }

  onStopChange(data)
  {
    this.props.onAfterChange({key:'stop', value:data})//()
  }

  onAfterChange(data)
  {
    this.props.onAfterChange(data)
  }
}

function mapStateToProps(state) {
  return {
    step: state.step,
    options: state.options
  }
}

function mapDispatchToProps(dispatch) {
  return {
    stepActions: bindActionCreators(stepActionCollection, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Filter)
