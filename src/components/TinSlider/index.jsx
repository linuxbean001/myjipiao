import React from 'react'


import { Slider } from 'antd';
import util from '../../util/utility.js'

import './style.less'

class TinSlider extends React.Component {
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      marks: {0:'', 100:''},
      value: [0,100]
    }
  }

  componentWillReceiveProps(nextProps){
    // if (nextProps.legIndex !== this.props.legIndex)
    // {
    //   const range = this.props.range;
    //   const low = Math.round((range.low - range.floor)*100/(range.ceil-range.floor));
    //   const high =  Math.round((range.high - range.floor)*100/(range.ceil-range.floor));
    //   const lowMark = this.sliderValueFormat(this.getRealValue(low));
    //   const highMark = this.sliderValueFormat(this.getRealValue(high));
    //
    //   this.setState({marks:, value:[low, high]})
    // }
  }

  getValue() {
    const range = this.props.range;
    const low = Math.round((range.low - range.floor)*100/(range.ceil-range.floor));
    const high =  Math.round((range.high - range.floor)*100/(range.ceil-range.floor));
    return [low, high]
  }

  getMark() {
    const range = this.props.range;
    const low = Math.round((range.low - range.floor)*100/(range.ceil-range.floor));
    const high =  Math.round((range.high - range.floor)*100/(range.ceil-range.floor));
    const lowMark = low==0? '':this.sliderValueFormat(this.getRealValue(low));
    const highMark = high==100?'':this.sliderValueFormat(this.getRealValue(high));

    return {[low]:lowMark, [high]:highMark}
  }


  render() {
    const lowValue = this.tipFormatter(0);
    const highValue = this.tipFormatter(100)
    return (
    <div>
      <div><span className="filter-title">{this.props.title}</span><span className="filter-range">({lowValue} - {highValue})</span></div>
      <Slider range step={5} marks={this.getMark()}  value={this.getValue()} onChange={this.onAfterChange.bind(this)} tipFormatter={this.tipFormatter.bind(this)} />
    </div>
  )}

  tipFormatter(value){
    return this.sliderValueFormat(this.getRealValue(value))
  }

  onAfterChange(value) {

    const changeFn = this.props.changeFn
    var realValue = [this.getRealValue(value[0]), this.getRealValue(value[1])]
    var data = {key:this.props.indexKey, value:realValue};
    //console.log('onAfterChange: ', value);
    changeFn(data)
  }

  sliderValueFormat(value){
     const key = this.props.indexKey;
     if(key.indexOf('price') >=0)
     {
       return  '$ '+value;
     }
     else {
       if(key.indexOf('travel_time') >=0)
       {
         var minutes = value % 60;
         var hours = Math.floor(parseInt(value) / 60);
         return hours + 'h ' + minutes + 'min ';
       }
       else {
            var strValue = Math.floor(value/1440)+'';
            var year        = strValue.substring(0,4);
            var month       = strValue.substring(4,6);
            var day         = strValue.substring(6,8);
           var date        = new Date(year, month-1, day);

            const minutes = value % 1440;
            var hour = Math.floor(minutes / 60);
            var min = minutes % 60;

           var str_time = (hour <10? '0':'')+ hour+':'+ (min <10? '0':'')+min;


           var days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

           return days[date.getDay()]+" "+str_time
       }
     }
  }

  getRealValue(value) {
    if (value == 0) return this.props.range.floor;
    if (value == 100) return this.props.range.ceil;
    var real_value = Math.floor(this.props.range.floor + (this.props.range.ceil - this.props.range.floor)*value/100);
    return real_value;
  }
}

export default TinSlider
