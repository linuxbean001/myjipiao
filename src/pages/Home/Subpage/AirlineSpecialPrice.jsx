import React from 'react'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as stepActionCollection from '../../../actions/step'
import * as optionsActionCollection from '../../../actions/options'

import LegBoard from '../../../components/legBoard/index'
import {Row, Col, Carousel} from 'antd'



import util from '../../../util/utility'

class AirlineSpecialPrice extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      index:0,
      arr:[0,1,2,3],
      priceIndex:-1,
      isShowFsrBoard:false
    }
    this.gotoSlide = this.gotoSlide.bind(this)
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

  onChange(index)
  {
    this.setState({index:index})
  }


  componentDidMount() {

  } //end of componentDidMount

  gotoSlide(index) {
    this.carousel.goTo(index , false)
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


  changeTripType(type) {
    let system = this.getReduxDataByID('system')
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

  toggleLegBoard(index=-1) {


    this.props.stepActions.updateItem({id: 'system', focusIndex:-1})

      window.scrollTo(0,0);

    if ((index == -1) ||(index == this.state.priceIndex))
    {
      this.setState({isShowFsrBoard:!this.state.isShowFsrBoard, priceIndex:index})
    }
    else {
      this.setState({isShowFsrBoard:true, priceIndex:index})
      let item = this.props.options.specialPrice[index]

      this.changeTripType(item.Trip_Type)

      this.updateFsr('departure_date', '')
      this.updateFsr('return_date','')
      this.updateFsr('from_city', item.From_City)
      this.updateFsr('to_city', item.To_City)
    }
  }

  updateFsr(key, value) {
    console.log(key, value)
    let legs = this.getReduxDataByID('legs')
    this.props.stepActions.updateArrayItem({
      id:'legs',
      key: key,
      value:value,
      index:0
    })

    let legID = 'leg0'
    this.props.stepActions.updateItem({
      id:legID, fsr:{...this.getReduxDataByID(legID).fsr, ...{[key]:value}}
    })
  }

  formatPricePeriod(item)
  {
    let mon = item.substring(4,6)
    let day = item.substring(6,8)

    return mon+'.'+day
  }

  getPriceHtml(index)
  {
    let isEven = (index % 2 == 0)
    let isPC = this.getReduxDataByID('system').device =='pc'
    let sp = this.props.options.specialPrice
    let spp = this.props.options.specialPricePeriod

    if(index == sp.length)
    {
      return <div></div>
    }

    let item = sp[index]
    let leftClass = isEven?  'bg-blue price-left':'bg-orange price-left'
    let tagClass =  'price-tag-div'

    if (isPC)
    {
      return (
        <div className={tagClass} onClick={this.toggleLegBoard.bind(this, index)}>
        {
          (!this.state.isShowFsrBoard || (this.state.priceIndex != index) || (this.getReduxDataByID('system').focusIndex > -1))
          ?null
          :<div className="ticketd"><i className="fa fa-check-square"></i></div>
        }
        <Row>
          <Col span={12}>
             <div className={leftClass}>
                <div className="citys">{item.From_City} - {item.To_City}</div>
                <div className="price-tag">$ {item.Price}</div>
                <div className="tax-desc text-right">({this.getKeyword('kTaxInclucive')})</div>
             </div>
          </Col>
          <Col span={12}>
          <div className="bg-write price-right">
             <div className="logo-div">
               <img src={util.getAirlineImage(item.Airline)} className="airline-logo" alt={item.Airline} />
             </div>
             <div className="return-type-tag">
                <p>{this.getKeyword('k'+item.Travel_Class)}</p>
                <p>{this.getKeyword('k'+item.Trip_Type)}</p>
                {
                  spp.map((item0, index0) => {
                    if(item0.Special_Price_ID == item.ID)
                      return <li key={index0}>{this.formatPricePeriod(item0.From_Date)} - {this.formatPricePeriod(item0.To_Date)}</li>
                  })
                }
             </div>
          </div>
          </Col>
        </Row>
        </div>
      )
    }
    else {
      return (
        <div className={tagClass+ ' bg-write'} onClick={this.toggleLegBoard.bind(this, index)}>
        <div className="ticketd">
          <div className="logo-div">
            <img src={util.getAirlineImage(item.Airline)} className="airline-logo" alt={item.Airline} />
          </div>
        </div>

        <div className="citys">{item.From_City} - {item.To_City}</div>
        <div className="price-tag">$ {item.Price}</div>
        <div className="tax-desc">({this.getKeyword('kTaxInclucive')})</div>

        <div className="return-type-tag text-center">
                <p>{this.getKeyword('k'+item.Travel_Class)} {this.getKeyword('k'+item.Trip_Type)}</p>
                <p>
                {
                  spp.map((item0, index0) => {
                    if(item0.Special_Price_ID == item.ID)
                      return <i key={index0}>{this.formatPricePeriod(item0.From_Date)} - {this.formatPricePeriod(item0.To_Date)}</i>
                  })
                }
                </p>
        </div>
        </div>
      )
    }

  }

  getArr() {
    var arr=[]
    let sp = this.props.options.specialPrice
    let page = Math.ceil(sp.length/8)
    for (var i=0; i< page; i++)
    {
      arr[i]= i;
    }

    return arr;
  }

  startSearch() {
    this.props.startSearch()
  }

  getLegboardHtml() {
      let system = this.getReduxDataByID('system')

      //
      //?null
      //:<LegBoard legIndex="0" priceIndex={this.state.priceIndex} boardType={1} toggleLegBoard={this.toggleLegBoard.bind(this)} startSearch={this.startSearch.bind(this)}  updateFsr={this.updateFsr.bind(this)} fsrKey="departure_date" inputValue=""/>

      let bShowBoard = (this.state.isShowFsrBoard && (this.state.priceIndex >=0) && (this.getReduxDataByID('system').focusIndex == -1))
      if (system.device =='pc')
      {
        if (!bShowBoard)
        {
          return null
        }
        else {
          return  <LegBoard legIndex="0" priceIndex={this.state.priceIndex} boardType={1} toggleLegBoard={this.toggleLegBoard.bind(this)} startSearch={this.startSearch.bind(this)}  updateFsr={this.updateFsr.bind(this)} fsrKey="departure_date" inputValue=""/>
        }
      }
      else {
        let mbClass = bShowBoard? "left-float-div full-div in": 'left-float-div full-div'
        return (
          <div className={mbClass}>
             <div className="fake-header header-title white-font">
                <table  style={{width:'100%'}}>
                  <tbody>
                    <tr>
                      <td style={{width:'25%', verticalAlign:'top'}}><div className="pad-hor text-left"><i className="fa fa-chevron-left" onClick={this.toggleLegBoard.bind(this, -1)}></i></div></td>
                      <td style={{width:'50%'}}><div className="text-center">{this.getKeyword('kAirlineSpecialPrice')}</div></td>
                      <td style={{width:'25%'}}></td>
                    </tr>
                  </tbody>
                </table>
             </div>
             <LegBoard legIndex="0" priceIndex={this.state.priceIndex} boardType={1} toggleLegBoard={this.toggleLegBoard.bind(this)} startSearch={this.startSearch.bind(this)}  updateFsr={this.updateFsr.bind(this)} fsrKey="departure_date" inputValue=""/>
          </div>
        )
      }
  }

  render() {
      let arr = this.getArr()
      let isPC = this.getReduxDataByID('system').device =='pc'
      let span = isPC? '6':'12'
      let gutter = isPC? 16:8
      let titleClass = isPC? 'home-title':'panel-title'
      return(
        <div className="airlinespecialprice">
          <div className="middle-box">
            <div className="home-title-div">
              <h2 className={titleClass}>{this.getKeyword("kAirlineSpecialPrice")}</h2>
              <div className="carousel-div">
                <Carousel  afterChange={this.onChange.bind(this)} ref={node => (this.carousel = node)}>
                {arr.map((item, index) => {
                   return (
                     <div key={index}>
                     <Row gutter={gutter}>
                      <Col span={span}>{this.getPriceHtml(index*8+0)}</Col>
                      <Col span={span}>{this.getPriceHtml(index*8+1)}</Col>
                      <Col span={span}>{this.getPriceHtml(index*8+2)}</Col>
                      <Col span={span}>{this.getPriceHtml(index*8+3)}</Col>
                     </Row>
                     {
                      isPC
                      ?<div className="price-ver-gap"></div>
                      :null
                     }
                     <Row gutter={gutter}>
                      <Col span={span}>{this.getPriceHtml(index*8+4)}</Col>
                      <Col span={span}>{this.getPriceHtml(index*8+5)}</Col>
                      <Col span={span}>{this.getPriceHtml(index*8+6)}</Col>
                      <Col span={span}>{this.getPriceHtml(index*8+7)}</Col>
                     </Row>
                     </div>
                   )
                })}
                </Carousel>
              </div>
            </div>
            {
              this.getLegboardHtml()
            }
         </div>
        </div>
      )
  }
}

// -------------------redux react --------------------
function mapStateToProps(state) {
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

export default connect(mapStateToProps, mapDispatchToProps)(AirlineSpecialPrice)
