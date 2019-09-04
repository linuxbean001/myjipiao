import React from 'react'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'


import * as optionsActionCollection from '../../../actions/options'
import * as stepActionCollection from '../../../actions/step'

import Availability from '../../../components/Availability/index'

import util from '../../../util/utility'

import {
  Col,
  Row,
  Card,
  Form,
  DatePicker,
  AutoComplete,
  Select,
  InputNumber,
  Switch,
  Radio,
  Slider,
  Button,
  Upload,
  Icon,
  Menu,
  Dropdown,
  Pagination
} from 'antd';


const FormItem = Form.Item;
const Option = Select.Option;
const OptGroup = Select.OptGroup;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;



class Farelist extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      page_no: 1,
      fares: [],
      page_size: 10,

      sort_index:0,
      sort_arr:['Price', 'Travel Time', 'Departure Time', 'Return Time'],
      sort_field_arr:['price', 'total_travel_time', 'dep_take_off_time', 'ret_take_off_time'],
      sort_dir0:true,
      sort_dir1:true,
      sort_dir2:true,
      sort_dir3:true,
      page_count: Math.ceil(this.props.data.length / 10)
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


  applySort(key, order)
  {
    //console.log("sort: "+key, order)
    var temp_sorted_fares = util.sortByKey(this.state.fares, this.state.sort, this.state.order);
    this.setState({fares: temp_sorted_fares, page_no: 1});
  }

  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    this.setState({page_no: 1});
    //this.props.refs.pageCom.setState({value:1});
  }

  componentDidMount() {
    // //console.log('componet did mount');
  }

  filterByPage(index)
  {
    const page_no = this.state.page_no;
    const page_size = this.state.page_size;
    const data = this.state.fares;

    return ((index >= (page_no-1) * page_size) && (index < page_no * page_size));
  }



  onSortClick(index)
  {
    this.setState({sort_index:index, page_no: 1});
  }

  onOrderChange(index) {
    let direction  = !this.state['sort_dir'+index]
    this.setState({['sort_dir'+index]:direction, sort_index:index, page_no: 1});
  }

  pageRender(page, type)
  {
    if (type === 'prev') {
      return <i className="fa fa-angle-left text-bold" aria-hidden="true"></i>;
    }

    if (type === 'next') {
      return <i className="fa fa-angle-right text-bold" aria-hidden="true"></i>;
    }

    if (type === 'jump-next') {
      return <i className="fa fa-double-right text-bold" aria-hidden="true"></i>;;
    }

    if (type === 'jump-prev') {
      return <i className="fa fa-double-left text-bold" aria-hidden="true"></i>;;
    }

    return <a>{page}</a>;

  }

  getSearchSummary() {
    const fsr = this.props.fsr
    const getKeyword = this.props.keywordFn
    const divClass = this.props.device == 'pc'? 'search-summary search-summary-pc text-bold':'search-summary search-summary-mb'
    return (
      <div className={divClass}>
        <span>{fsr.from_city} <i className="fa fa-calendar text-warning"></i>  {fsr.departure_date.substring(5,fsr.departure_date.length)}</span>
        {
          fsr.trip_type == 'RT'
          ?<span> <i className="fa fa-exchange text-danger"></i> </span>
          :<span> <i className="fa fa-arrow-right text-danger"></i> </span>
        }

        {
          fsr.return_date != ''
          ?<span> {fsr.to_city} <i className="fa fa-calendar text-warning"></i> {fsr.return_date.substring(5,fsr.return_date.length)} </span>
          :<span> {fsr.to_city} </span>
        }
        <span style={{borderRight:"1px solid #FFF"}}>&nbsp;</span>
        <span>&nbsp;{fsr.adult} <i className="fa fa-user"></i> </span>
        {
          fsr.child > 0
          ?<span> {fsr.child} <i className="fa fa-child"></i> </span>
          :<span></span>
        }

        {
          fsr.infant> 0
          ?<span> {fsr.infant} <i className="fa fa-child text-xs"></i> </span>
          :<span></span>
        }
        <span> {fsr.travel_class}</span>
      </div>
    )
  }

  getMenu() {
    // this.props.isReturn? ['Price', 'Travel Time', 'Departure Time', 'Return Time']:['Price', 'Travel Time', 'Departure Time']
    let sortLimit = this.props.isReturn? 4:3
    const getKeyword = this.props.keywordFn
      return (
        <ul className="hor-list">
          {this.state.sort_arr.map((item, index) =>{
            if(index < sortLimit)
            {
              let faClass = this.state['sort_dir'+index]? 'fa fa-sort-asc':'fa fa-sort-desc'
              let liClass = this.state.sort_index == index? 'pad-rgt active':'pad-rgt'
              return  <li key={item} className={liClass}>
                        <span onClick={this.onSortClick.bind(this,index)}>{getKeyword('k'+util.replaceAll(item, ' ',''))} </span><span className={faClass} onClick={this.onOrderChange.bind(this,index)}></span>
                      </li>
            }
          })
         }
        </ul>
      )
    }


  render() {
    const data = this.props.data
    const getKeyword = this.props.keywordFn
    const is_empty_fare_table = this.props.data.length ===0
    const is_one_way = this.props.isReturn
    const filterByPageNo = (item, index) => {
      return this.filterByPage(index)
    }
    let isPC = this.getReduxDataByID('system').device == 'pc'

    let span1 =isPC? 16:24
    let span2 = isPC? 8:24

    const topSpan = isPC? 6:11
    const filterMenu = this.getMenu()
    const sortSign = this.state.order? <i className="fa fa-sort-amount-asc" aria-hidden="true"></i>:<i className="fa fa-sort-amount-desc" aria-hidden="true"></i>
    return (

      <div className={isPC? 'fare-list-container':'fare-list-container-mb'}>
        {
          is_empty_fare_table
          ? <div>{getKeyword("kNoFares")}</div>
          :<div>
            {
              this.props.device!='pc'
              ?<div>{this.getSearchSummary()}</div>
              :<div></div>
            }
            <div className="pad-hor" style={{backgroundColor:"#FFF"}}>
            <Row>
              <Col span={span1}>
                <div className={isPC? 'sort-div pad-ver':'sort-div-mb pad-ver'}>
                {filterMenu}
                </div>
              </Col>
              <Col span={span2}>
                <div className="text-right pad-ver">
                  <Pagination simple  current={this.state.page_no} total={data.length} onChange={this.onPageChange.bind(this)}/>
                </div>
              </Col>
            </Row>
            <div className= "text-right notes small-notes pad-ver">
            <Icon type="info-circle" />
             {this.getKeyword("kTimeNote")}
            </div>

            </div>
            <div className={isPC? 'pc-div':'mb-div'}>
              {util.sortByKey(data, this.state.sort_field_arr[this.state.sort_index], this.state['sort_dir'+this.state.sort_index]).filter(filterByPageNo).map((item, index) => {
                return <Availability key={index} data={item}  legIndex={this.props.legIndex}/>
              })
            }
            </div>
          </div>
          }
          </div>
    )
  }

  onSelected(data)
  {

    const changeFn = this.props.changeFn
    changeFn(data)
  }

  onPageChange(e)
  {

      this.setState({
        page_no: e
      })
  }
}

// ---------------------------------------

function mapStateToProps(state) {
  return {
    options: state.options,
    step: state.step,
    isMobile: state.step.byHash['system'].device !== 'pc',
    isShowCart: util.isArrayLoad(state.step.byHash['cart'])
  }
}

function mapDispatchToProps(dispatch) {
  return {
    optionsActions: bindActionCreators(optionsActionCollection, dispatch),
    stepActions: bindActionCreators(stepActionCollection, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Farelist)
