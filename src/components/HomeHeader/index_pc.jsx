import React from 'react'


import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {hashHistory, Link} from 'react-router'


import * as optionsActionCollection from '../../actions/options'
import * as stepActionCollection from '../../actions/step'

import { Menu, Dropdown, Icon, Input, Col, Row } from 'antd'

import util from "../../util/utility"

class HomeHeader_PC extends React.Component {
    constructor(props, context) {
        super(props, context);
        
        this.state = {


        }
    }

    onLanguageClick(item, event)
    {
      event.preventDefault();
      const data = this.props.data
      if (data.language !== item)
      {
        this.props.changeFn('language', item)
      }
    }

    onCurrencyClick(item, event)
    {
      event.preventDefault();
        const data = this.props.data
      if (data.currency !== item)
      {
        this.props.changeFn('currency', item)
      }
    }

    getLanguageMenu() {
      const languageList = this.props.data.languageList
      return (
        <Menu>
          {languageList.map(item =>{
            const title = item =='Chinese'? '中文':item
            return  <Menu.Item key={item}>
                      <a href="#" onClick={this.onLanguageClick.bind(this,item)}>{title}</a>
                    </Menu.Item>
          })
        }
        </Menu>
      )
    }

    getCurrencyMenu() {
      const currencyList = this.props.data.currencyList
      return (
          <Menu>
            {currencyList.map(item =>{
              return  <Menu.Item key={item}>
                        <a href="#" onClick={this.onCurrencyClick.bind(this,item)}>{item}</a>
                      </Menu.Item>
            })
          }
          </Menu>
      )
    }

    searchByText(value) {
      //console.log(value)
    }

    render() {
        const data = this.props.data
        const languageMenu = this.getLanguageMenu()
        const currencyMenu = this.getCurrencyMenu()
        const Search = Input.Search
        const logoUrl = this.props.device === 'pc'? util.getImageUrl("logo_header.png"):util.getImageUrl("logo_header_mb.png")
        return (
          <div className="header-div">
            <Row type="flex" justify="center" align="middle">
              <Col span={16}>
                <div className="logo-div">
                  <img src={logoUrl}/>
                </div>
              </Col>
              <Col span={8}>
                <div className="header-control">
                  <Row type="flex" justify="center" align="middle">
                    <Col span={6}>
                      <Dropdown key="cur" overlay={currencyMenu} trigger={['click']}>
                         <div className="h-drop">{data.currency}</div>
                     </Dropdown>
                    </Col>
                    <Col span={6} style={{display:"none"}}>
                      <Dropdown key="lang" overlay={languageMenu} trigger={['click']}>
                         <div className="h-drop">{data.language}</div>
                       </Dropdown>
                    </Col>
                    <Col span={8}>
                      <Search
                        placeholder=""
                        style={{ width:"90%", margin:"0 AUTO" }}
                        onSearch={(value) => {this.searchByText(value)}}
                      />
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
        )
    }
}

// -------------------redux react--------------------

function mapStateToProps(state) {
  return {
    options: state.options,
    step: state.step
  }
}

function mapDispatchToProps(dispatch) {
  return {
    optionsActions: bindActionCreators(optionsActionCollection, dispatch),
    stepActions: bindActionCreators(stepActionCollection, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader_PC)
