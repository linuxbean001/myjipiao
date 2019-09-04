import React from 'react'
import {withRouter, Link} from "react-router-dom";
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {getFaresData} from '../../../fetch/service'


import Farelist from './farelist'

import * as optionsActionCollection from '../../../actions/options'
import * as stepActionCollection from '../../../actions/step'


import util from '../../../util/utility.js'
import MessageDiv from '../../../components/MessageDiv'
import SpinDiv from '../../../components/SpinDiv'

import {Col, Row} from 'antd';



class SearchResult extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      error:"",
      isDataLoad: false,
      isShowFilter: false
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



  goHome() {
    this.props.history.push("/")
  }

  goPrev() {
    //history.back()
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.searchIndex != this.getReduxDataByID('leg'+this.props.legIndex).searchIndex)
    {
      this.startSearch()
    }
  }

  initSlides()
  {
    const slides = [
      'price',
      'travel_time',
      'dep_travel_time',
      'ret_travel_time',
      'dep_take_off_time',
      'ret_take_off_time',
      'dep_landing_time',
      'ret_landing_time'
    ];
    for (var i = 0; i < slides.length; i++) {
      var new_obj = {};
      new_obj[slides[i] + '_value'] = [0, 100];
      this.setState(new_obj, () => {
        this.updateMark(slides[i]);
      });
    }
  }


  // filter and sort --------------------------------------------------------------------------------------------------------------------
  isShowFare(fare, filter)
  {
    const step = this.props.step
    const data = this.getTargetDataArea()
    const avs = util.getAv(data.searchResult, fare.source_index, fare.fare_index, fare.av_index);
    const is_return = step.tripType === 'RT';

    //by airlines
    var codes="";
    for (var k=0; k< data.carrier.length; k++)
    {
      if(data.carrier[k].is_selected ===1)
      {
        codes += '_'+data.carrier[k].code;
      }
    }


    if ((codes !=="") && (codes.indexOf(fare.carrier_code) < 0))
    {
      return false;
    }

    //by stop
    var stop=[];
    for (var k=0; k< data.stop.length; k++)
    {
      if(data.stop[k].is_selected ===1)
      {
        stop.push(data.stop[k].stop)
      }
    }

    if ((stop.length > 0) && (stop.indexOf(fare.stop) < 0))
    {
      return false;
    }

    const rangeKeys = is_return
    ?['price',  'dep_travel_time',  'dep_take_off_time',  'dep_landing_time']
    :['price',  'dep_travel_time',  'dep_take_off_time',  'dep_landing_time', 'ret_travel_time',  'ret_take_off_time',  'ret_landing_time', 'total_travel_time']

    for (var i = 0; i < rangeKeys.length; i++) {
      const key = rangeKeys[i];
      const value = fare[key];
      const range = data[key];
      if ((value < range.low) || (value > range.high)) {
        return false;
      }
    }



    return true;
  }


  goBack() {
    //window.history.back();
    this.props.history.push('/');
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
        return <div><MessageDiv keywordFn={(item)=> {return this.getKeyword(item)}} message={this.state.error}/></div>
      }
      else {
        if (!state.isDataLoad)
        {
          return <div></div>
        }
        else {
          const html = this.getContent()
          return <div>{html}</div>
        }
      }
    }
  }

  getContent() {
    const stepIndex = 1;
    const fare_filter = (item) => {
      return this.isShowFare(item)
    }

    const isReturn = (this.getTargetDataArea()).fsr.trip_type=== "RT"
    const isMulti = this.getReduxDataByID('legs').length > 1


    const device = this.getReduxDataByID('system').device
    const fareTable = (this.getTargetDataArea()).fareTable.filter(fare_filter)

      return (
        <div className='b2cfare'>
          <div className="fare-all">
            <Farelist device={device} isReturn= {isReturn} data={fareTable} legIndex={this.props.legIndex} fsr={(this.getTargetDataArea()).fsr} isMulti={isMulti} keywordFn={(item)=>{return this.getKeyword(item)}}/>
          </div>
        </div>
      )
  }

  getTargetDataArea()
  {
    return this.props.step.byHash['leg'+this.props.legIndex]
  }

  //-----------------------------------------------------------------------------------------------------------------------------------------------------------------
  // Search data
  startSearch() {
    //this.props.stepActions.updateItem({cart:[], paxes:[], ffList:[], ccList:[], ff_airline_list:[]})
    this.setState({isBusy: true})
    var param = {
      time: '123456',
      data: (this.getTargetDataArea()).fsr
    }

    const result = getFaresData(param)
    result.then(res => {
      return res.json()
    }).then(json => {
      const data = json
      if (data.error === '') {
        try {
          this.createFareTable(data)
          this.setState({isBusy:false, isDataLoad:true})
        }
        catch(err)
        {
          this.setState({isBusy: false, error: err})
        }
      } else {
        this.setState({isBusy: false, error: data.error})
      }
    }).catch(resp => {
      this.setState({isBusy: false})
    })
  }

  createFareTable(searchResult) {
     let search_index = this.props.legIndex
     var leg ={}
     //console.log("searResult", searchResult)
     leg.searchResult = searchResult
     const data = searchResult.SearchList
     //create new leg
     const the_min = 1000000000000000000000;
     var filterTemp = {
       floor: the_min,
       low: 0,
       high: 0,
       ceil: 0
     };

     var fare_table = [];

     var filter ={
       carrier : [],
       stop:[],
       travel_class : [],
       price :Object.assign({}, filterTemp),
       dep_travel_time : Object.assign({}, filterTemp),
       ret_travel_time : Object.assign({}, filterTemp),
       total_travel_time : Object.assign({}, filterTemp),

       dep_take_off_time : Object.assign({}, filterTemp),
       dep_landing_time : Object.assign({}, filterTemp),
       ret_take_off_time : Object.assign({}, filterTemp),
       ret_landing_time : Object.assign({}, filterTemp)
     }

     for (var i = 0; i < data.length; i++) {
       //create fare table and airlines table
       var gds_obj = data[i];
       for (var j = 0; j < gds_obj.Rows.length; j++) {
         var row_obj = gds_obj.Rows[j];

         if (filter.travel_class.indexOf(row_obj.TravelClass.replace("Premium", "Premium ")) < 0) {
           filter.travel_class.push(row_obj.TravelClass.replace("Premium", "Premium "));
         }

         //carrier
         var is_found = false;
         for (var c = 0; c < filter.carrier.length; c++) {
           var c_obj = filter.carrier[c];
           if (c_obj.code === row_obj.CarrierCode) {
             is_found = true;
             c_obj.count++;
             util.updateSliderRange(c_obj.price_range, Math.ceil(row_obj.TotalFare));
             break;
           }
         }

         if (!is_found) {
           var new_carrier = {
             name: row_obj.CarrierName,
             code: row_obj.CarrierCode,
             price_range: Object.assign({}, filterTemp),
             count: 1,
             id: filter.carrier.length,
             is_selected: 0
           };
           //console.log("update carrier price")
           util.updateSliderRange(new_carrier.price_range, row_obj.TotalFare);
           filter.carrier.push(new_carrier);
         }

         //price filter
         //console.log("update prie")
         util.updateSliderRange(filter.price, row_obj.TotalFare);



         for (var k = 0; k < row_obj.AvailReference.length; k++) {

           var av_obj = row_obj.AvailReference[k];

           var fare_obj = {
             search_index:search_index,
             source_index: i,
             supplier_id: gds_obj.SupplierId,
             supplier_name: gds_obj.SupplierName,
             fare_index: j,
             av_index: k,
             stop:1,
             book_class: row_obj.BookClass,
             seat:[row_obj.Departure.SeatAvail],
             travel_class: row_obj.TravelClass.replace("Premium", "Premium "),
             price: (row_obj.TotalFare).toFixed(2),
             currency: row_obj.FareCurrency,
             carrier: row_obj.CarrierName,
             carrier_code: row_obj.CarrierCode,
             dep_take_off_time: "",
             dep_landing_time: "",
             ret_take_off_time: "",
             ret_landing_time: "",
             dep_travel_time: "",
             ret_travel_time: ""
           };

           // dep_travel_time
           if ((av_obj.DepartureId > 0) && (gds_obj.Departure.length >= av_obj.DepartureId)) {
             //push dep itineraries
             var av = gds_obj.Departure[av_obj.DepartureId - 1];

             if (fare_obj.stop < av.FlightList.length)
             {
               fare_obj.stop = av.FlightList.length
             }
             //fare_obj.itineraries.push(av);
             this.getTimeRange(av, fare_obj, filter, false);
           }

           if ((av_obj.ReturnId > 0) && (gds_obj.Return != null) && (gds_obj.Return.length > 0) && (gds_obj.Return.length >= av_obj.ReturnId)) {

             //push ret itineraries
             //fare_obj.book_class.push(row_obj.Return.BookClass);
             var av = gds_obj.Return[av_obj.ReturnId - 1];

             if (fare_obj.stop < av.FlightList.length)
             {
               fare_obj.stop = av.FlightList.length
             }
             //fare_obj.itineraries.push(av);
             this.getTimeRange(av, fare_obj, filter, true);

             //set total travel tiem as together
             fare_obj.total_travel_time = fare_obj.dep_travel_time+fare_obj.ret_travel_time;
           }
           else {
             // set total travel time as dep travel_time
             fare_obj.total_travel_time = fare_obj.dep_travel_time;
           }

           util.updateSliderRange(filter.total_travel_time, fare_obj.total_travel_time);


           for (var f=0; f< filter.stop.length; f++)
           {
             var flag = false
             if (filter.stop[f].id == fare_obj.stop)
             {
               flag = true
               break
             }
           }

           if(!flag)
           {
             filter.stop.push({id:fare_obj.stop, stop:fare_obj.stop, is_selected:0})
           }

           // add new fare
           fare_table.push(fare_obj);
         }
       }
     }



     leg.carrier = filter.carrier
     leg.stop = filter.stop
     leg.carrier_list = []
     leg.travel_class = filter.filter_travel_class

     leg.price = filter.price
     leg.dep_travel_time = filter.dep_travel_time
     leg.ret_travel_time = filter.ret_travel_time
     leg.total_travel_time = filter.total_travel_time

     leg.dep_take_off_time = filter.dep_take_off_time
     leg.dep_landing_time = filter.dep_landing_time
     leg.ret_take_off_time = filter.ret_take_off_time
     leg.ret_landing_time = filter.ret_landing_time

     leg.fareTable = fare_table
     leg.isFareTableLoad =true

     leg.searchIndex = this.getReduxDataByID('system').searchIndex

     this.props.stepActions.updateItem({id:'leg'+search_index,...leg})
   };

  // create time range
  getTimeRange(av_obj, fare_obj, filter, is_return) {
    var preFix = is_return
      ? "ret_"
      : "dep_";

    var t_time = util.getMinutes(av_obj.TravelTime);

    if (t_time === 0) {
      ////console.log("travelTime", av_obj.TravelTime+'  '+ t_time);
    }

    fare_obj[preFix + 'travel_time'] = t_time;

    util.updateSliderRange(filter[preFix + 'travel_time'], t_time);

    if (av_obj.FlightList.length > 0) {
      var flight_obj = av_obj.FlightList[0];
      var last_flight_obj = av_obj.FlightList[av_obj.FlightList.length - 1];

      var d_time = util.replaceAll(flight_obj.FromDate, '-', '') * 1440 + util.getMinutes(flight_obj.FromTime.replace(':', ''));
      var l_time = util.replaceAll(last_flight_obj.ToDate, '-', '') * 1440 + util.getMinutes(last_flight_obj.ToTime.replace(':', ''));
      fare_obj[preFix + 'take_off_time'] = d_time;
      fare_obj[preFix + 'landing_time'] = l_time;


      util.updateSliderRange(filter[preFix + 'take_off_time'], d_time);

      util.updateSliderRange(filter[preFix + 'landing_time'], l_time);
    }
  }
  //--------------------------------------------------------------------------------------------------------------------------------------------
  componentDidMount() {
    const data = this.getTargetDataArea()
    if ((data.isFareTableLoad == null) || !data.isFareTableLoad)
    {
      this.startSearch()
    }
    else {
      this.setState({isDataLoad:true})
    }
  } //end of componentDidMount

  //----------------------------------------------------------------------------------------------------------------------------------------------------------------------
  render() {

    const error = this.state.error
    const html = this.getHtml()

    return (
      <div className="currentFarelist">
        {html}
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
export default connect(mapStateToProps, mapDispatchToProps)(SearchResult)
