import React from 'react'


import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {hashHistory, Link} from 'react-router'


import * as optionsActionCollection from '../../actions/options'
import * as stepActionCollection from '../../actions/step'

import { Menu, Dropdown, Icon, Input, Col, Row } from 'antd'

import util from "../../util/utility"


class HomeHeader_MB extends React.Component {
    constructor(props, context) {
        super(props, context);
        
    }

    handleClick (e)  {

      for (var i=0; i< this.props.data.languageList.length; i++)
      {
        if (e.key === this.props.data.languageList[i])
        {
            this.props.changeFn('language', e.key)
        }
      }

      for (var i=0; i< this.props.data.currencyList.length; i++)
      {
        if (e.key === this.props.data.currencyList[i])
        {
          this.props.changeFn('currency', e.key)
        }
      }
    }






    getMenu() {
      const SubMenu = Menu.SubMenu
      const MenuItemGroup = Menu.ItemGroup
      return <Menu
          onClick={this.handleClick.bind(this)}
          style={{ width: 160, marginRight:10, padding:10}}
        >
        <MenuItemGroup key="currency" title="Currency">
          {this.props.data.currencyList.map(item =>{
            return  <Menu.Item key={item}>
                    {item}
                    </Menu.Item>
          })
        }
          </MenuItemGroup>
        </Menu>
    }

    searchByText(value) {
      //console.log(value)
    }

    render() {
        const allMenu = this.getMenu()
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
                    <Col span={24}>
                      <Dropdown key="cur" overlay={allMenu} trigger={['click']}>
                         <div className="h-drop">{this.props.data.currency} <Icon type="down" /></div>
                     </Dropdown>
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
export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader_MB)
