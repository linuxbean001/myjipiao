import React from 'react'

import {Link, withRouter} from 'react-router-dom'

import {Row, Col} from 'antd'

import Box from '../../../components/Box'


class ToolBox extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      data: [
        {
          title: "kRentACar",
          link: "http://www.economycarrentals.com/",
          icon:'fa fa-car'
        }, {
          title: "kShortStay",
          link: "https://www.booking.com/",
          icon: 'fa fa-bed'
        }, {
          title: "kStayLonger",
          link: "https://www.airbnb.com.au/",
          icon:'fa fa-home'
        }, {
          title: "kTrackFlight",
          link: "http://www.flightstats.com/go/Home/home.do",
          icon: 'fa fa-search'
        }, {
          title: "kCheckSeat",
          link: "https://www.seatguru.com/findseatmap/findseatmap.php",
          icon: 'fa fa-tag'
        }, {
          title: "kLatestReview",
          link: "https://www.tripadvisor.com.au",
          icon: 'fa fa-list'
        }, {
          title: "kDestGuide",
          link: "https://www.lonelyplanet.com/",
          icon:"fa fa-hand-o-right"
        }, {
          title: "kInsureTrip",
          link: "https://www.travelinsurancedirect.com.au/",
          icon: 'fa fa-eye'
        }, {
          title: "kTravelAdvice",
          link: "http://smartraveller.gov.au/Pages/default.aspx",
          icon:'fa fa-handshake-o'
        }
      ]
    }
  }

  getDisplayArray(colValue) {
    const data = this.state.data
    const rows = Math.ceil(this.state.data.length / colValue)
    var arr = [];
    for (var i = 0; i < rows; i++) {
      var col = [];
      for (var j = 0; j < colValue; j++) {

        var arrIndex = i * colValue + j;
        if (arrIndex < data.length) {
          col.push(data[arrIndex])
        } else {
          col.push({title: "", link: ""})
        }
      }
      arr.push(col);
    }
    return arr;
  }

  getKeyword(text)
  {
    return this.props.keywordFn(text)
  }

  componentDidMount() {} //end of componentDidMount
  render() {
    const intSpan = this.props.device === 'pc'? 7:12
    const column = this.props.device === 'pc'? 3:2
    const data = this.getDisplayArray(column)
    const total = this.state.data.length
    return (
      <div className="boxes">
        {data.map((rowItem, rowIndex) => {
          return <Row type="flex"  justify="space-between" align="top"  key={rowIndex}>
            {rowItem.map((colItem, colIndex) => {
              const serial = rowIndex*column+colIndex
              if (serial < total) {
              return <Col span={intSpan} key={colIndex}>
                        <Box data={colItem} serial={serial} index={colIndex} device={this.props.device}  keywordFn={(text)=>{return this.getKeyword(text)}}></Box>
                    </Col>
              }
              else {
                return <Col span={intSpan} key={colIndex}></Col>
              }
            })}
          </Row>
        })
      }
      </div>
    )
  }
}

export default ToolBox
