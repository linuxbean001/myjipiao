import React from 'react'


import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'


import * as optionsActionCollection from '../../actions/options'
import * as stepActionCollection from '../../actions/step'

import util from '../../util/utility.js'
import {Col, Row, Menu, Icon} from 'antd';
import MessageDiv from '../../components/MessageDiv'
import SpinDiv from '../../components/SpinDiv'


import SearchResult from './Subpage/searchResult'
import Filter from './Subpage/filter'
import CartBar from './Subpage/cartbar'
import SearchPanel from '../Home/Subpage/SearchPanel'


class Fare extends React.Component {
  constructor(props, context) {
    super(props, context);
    const stepIndex = 1;

    this.state = {
      error:"",
      isShowCartDetail:false,
      isShowFilter:false,
      isShowResearch:false,
      pageIndex: 105,
      searchIndex:0,
      pageName: 'page-fare',
      currentIndex:0,
      isDataLoad:false
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

  componentDidMount() {
      this.props.stepActions.clearArray("cart")
      this.props.stepActions.removeItem("fare_price")
      this.setState({isDataLoad:true})

      this.props.stepActions.updateItem({
        id:'system',
        heading:'kFareResult'
      })

      window.scrollTo(0,0);
  }

  getTargetDataArea()
  {
    return this.props.step.byHash['leg'+this.state.currentIndex]
  }

  onAfterChange(data)
  {
    const dataArea = this.getTargetDataArea()
    const targetData = dataArea[data.key]

    if (data.key == 'carrier')
    {
        this.props.stepActions.updateItem({
          ...this.getReduxDataByID('system'),
          ...{ffValue:'', ffName:''}
        })
    }

    if (['carrier','stop'].indexOf(data.key) < 0)
    {
      this.props.stepActions.updateItem(
        {
          id:'leg'+this.state.currentIndex,
          ...{...dataArea, ...{[data.key]:{...targetData, ...{low:data.value[0],high:data.value[1]}}}}
        }
      )
    }
    else {
      var cList = dataArea[data.key].slice(0)
      for (var i=0; i< cList.length; i++)
      {
        if (cList[i].id == data.value.id)
        {
          cList[i].is_selected = data.value.is_selected
          break
        }
      }

      this.props.stepActions.updateItem({id:'leg'+this.state.currentIndex, ...{...dataArea, ...{[data.key]:cList}}})

    }

  }

  handleClick(e) {
    this.setState({
      currentIndex: e.key
    });
  }

  //toggleFilter() {
    //this.props.stepActions.updateItem({id:'system', isShowFilter:!this.getReduxDataByID('system').isShowFilter})
  //}

  toggleCartDetail() {
    this.setState({isShowCartDetail: !this.state.isShowCartDetail})
  }

  goBack() {
    //window.history.back();
    this.props.history.push('/');
  }

  getIndexArr() {
    return this.getReduxDataByID('legs')
  }

  startSearch() {
    var dataArea = this.getTargetDataArea()
    this.props.stepActions.updateItem({id:'leg0', isFareTableLoad:false})
    this.props.stepActions.updateItem({id:'system', searchIndex:util.getTime()})
    this.props.stepActions.clearArray("cart")
  }

  goNext() {
    this.props.history.push("/Passenger")
  }

  getKeyword(key) {
    return util.getKeyword(key, this.props.options.keywords, this.getReduxDataByID('system').language)
  }

  getHtml() {
  const state = this.state
  let system = this.getReduxDataByID('system')
  const filterClass = ''    //this.getReduxDataByID('system').isShowFilter? 'filter-div in':'filter-div'
    //not busy
    if (state.error !=='')
    {
      //show error
      return <div><MessageDiv type="error" keywordFn={(item)=> {return this.getKeyword(item)}} message={this.state.error}/></div>
    }
    else {
      if (!state.isDataLoad)
      {
        return <div></div>
      }
      else {
        var arr = this.getIndexArr()
        var dataArea = this.getTargetDataArea()
        const isRenderFilter = (dataArea != null) && (dataArea.isFareTableLoad != null) && (dataArea.isFareTableLoad=== true)
        const topClass = this.state.isShowCartDetail? 'fare-top-bar all':'fare-top-bar'
        if (isRenderFilter)
        {
          if(system.device=='pc')
          {
            return (
              <div  className="fare-all-div">
                <div className="middle-box">
                <div>
                  <div className= "notes">
                  <Icon type="info-circle" />
                   {this.getKeyword("kPriceNote")}
                  </div>
                </div>
                <Row>
                  <Col xs={12} sm={12} md={8} lg={8} xl={6}>
                  {
                    !isRenderFilter
                    ?<div></div>
                    :<div className="new-filter-div">
                      <Filter device={this.getReduxDataByID('system').device}
                        data={this.props.step.byHash['leg'+this.state.currentIndex]}
                        onAfterChange={(data)=>{this.onAfterChange(data)}}
                        legIndex = {this.state.currentIndex}
                        keywordFn ={(item)=>{return this.getKeyword(item)}}
                        filterFn={this.toggleFilter.bind(this)}
                      />
                    </div>
                  }
                  </Col>
                  <Col xs={12} sm={12} md={16} lg={16} xl={18}>
                {arr.map((item,index)=>{
                  return <SearchResult key={index} legIndex={index} searchIndex={system.searchIndex}/>
                })}
                  </Col>
                </Row>
                </div>
              </div>
            )
          }
          else {
            return (
              <div  className="fare-all-div">
                <div className="middle-box">
                  {
                    !isRenderFilter
                    ?<div></div>
                    :<div className="left-float-div full-div in">
                      {
                        this.state.isShowFilter
                        ?<div className="new-filter-div left">
                          <Filter device={this.getReduxDataByID('system').device}
                            data={this.props.step.byHash['leg'+this.state.currentIndex]}
                            onAfterChange={(data)=>{this.onAfterChange(data)}}
                            legIndex = {this.state.currentIndex}
                            keywordFn ={(item)=>{return this.getKeyword(item)}}
                            filterFn={this.toggleFilter.bind(this)}
                          />
                        </div>
                        :null
                      }
                     </div>
                  }
                 <div>
                 <div>
                   <div className= "notes">
                   <Icon type="info-circle" />
                    {this.getKeyword("kPriceNote")}
                   </div>
                   {arr.map((item,index)=>{
                     return <SearchResult key={index} legIndex={index} searchIndex={system.searchIndex}/>
                   })}
                 </div>
                 </div>
                </div>
              </div>
            )
          }

        }
        else {
          return(
          <div  className="fare-all-div">
            <div className="middle-box">
              {arr.map((item,index)=>{
                return <SearchResult key={index} legIndex={index} searchIndex={system.searchIndex}/>
              })}
            </div>
          </div>
          )
        }
      }
    }
}


  toggleFilter() {
    this.setState({isShowFilter: !this.state.isShowFilter})
  }

  toggleResearch() {
    this.setState({isShowResearch: !this.state.isShowResearch})
  }


  render() {

    const error = this.state.error
    const html = this.getHtml()
    let item = this.getReduxDataByID('legs')[0]
    let isPC = this.getReduxDataByID('system').device =='pc'
    let divClass = isPC? 'fare-result-container':'fare-result-container mb'
    return (
      <div className={divClass}>
        {
          isPC
          ?<div className='text-right middle-box pad-ver'>
            <button className="btn btn-primary" onClick={this.goBack.bind(this)}>{this.getKeyword("kPrev")}</button>
          </div>
          :<div className='middle-box pad-ver text-right'>
            <button className="btn btn-primary mar-rgt" onClick={this.goBack.bind(this)}>{this.getKeyword("kPrev")}</button>
            <button className="btn btn-warning mar-rgt" onClick={this.toggleResearch.bind(this)}>{this.getKeyword("kReSearch")}</button>
            <button className="btn btn-success" onClick={this.toggleFilter.bind(this)}>{this.getKeyword("kFilter")}</button>
          </div>
        }

        {
          isPC
          ?<SearchPanel startSearch={this.startSearch.bind(this)}/>
          :<div>
            {
              this.state.isShowResearch
              ?<SearchPanel startSearch={this.startSearch.bind(this)}/>
              :<div></div>
            }
           </div>
        }

        {html}
      </div>
    )
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
export default connect(mapStateToProps, mapDispatchToProps)(Fare)
