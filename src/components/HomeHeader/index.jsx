import React from 'react'
import {Link, withRouter} from 'react-router-dom'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import * as optionsActionCollection from '../../actions/options'
import * as stepActionCollection from '../../actions/step'


import util from "../../util/utility"
import {Row, Col, Icon, Menu, Button, Dropdown} from 'antd';

class HomeHeader extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
          width: window.innerWidth
        }
    }

    getMenu(title)
    {
      let arr = this.props.options.menu_list
      for (var i=0; i< arr.length; i++)
      {
        if (title == arr[i].title)
        {
          return arr[i]
        }
      }

      return null
    }

    getKeyword(text)
    {
      let system = this.getReduxDataByID('system')
      return util.getKeyword(text, this.props.options.keywords, system.language)
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

    componentWillMount() {
      window.addEventListener('resize', this.handleWindowSizeChange.bind(this));
    }

    componentDidMount() {
      this.props.stepActions.updateItem({
        id:'system',
        device: window.innerWidth <=600? 'mb':'pc'    //'pc'
      })
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleWindowSizeChange.bind(this));
    }

    handleWindowSizeChange ()  {
      this.props.stepActions.updateItem({
        id:'system',
        device: window.innerWidth <=600? 'mb': 'pc' //  'pc'
      })

      this.setState({width:window.innerWidth})
    }

   handleMenuClick ( key,e)  {

     let arr = key=='language'? this.props.options.languageList:this.props.options.currencyList
     let value = arr[e.key]
     let obj = key =='language'? {language: value=='English'? 'en':'cn', languageDisplay:value} :{currency:value}
     this.props.stepActions.updateItem({
       id:'system',
       ...obj
     })

     this.refreshLegData(key, value)
  }

  goHome(){
    this.props.history.push("/")
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

  getDropDownMenu(key) {
      let arr = key=='language'? this.props.options.languageList:this.props.options.currencyList
      return (
        <div>
        <Menu onClick={this.handleMenuClick.bind(this,key)}>
          {
            arr.map((item, index)=>{
              return(
                <Menu.Item key={index}>
                  <div>{item}</div>
                </Menu.Item>
              )
            })
          }
          </Menu>
        </div>
      )
    }

    render() {
        let system = this.getReduxDataByID('system')
        if (system.device == 'pc')
        {
          return (
            <div className="pc-header">
              <div className = "top-header">

              </div>
              <div className = "sub-header">
                     <table cellpadding="0px" cellspacing="0px">
                       <tr>
                         <td width="33%"></td>
                         <td align="left" valign="top">
                              <img src='/images/myjipiaologo.jpg'/>
                          </td>
                          <td className= "post-left">
                              <nav className="navbar navbar-mjp">
                              <div className="container-fluid">
                                <div className="collapse navbar-collapse">
                                  <ul className="nav navbar-nav">
                                  {
                                      this.props.options.menu_normal.map((item,index)=>{
                                        let obj = this.getMenu(item)
                                        //console.log(item, obj)
                                        if (obj != null)
                                        {
                                          if(index == 0)
                                          {
                                            return <li className="mjp-nav-item" key={index} onClick={this.goHome.bind(this)}>
                                                   <Icon type={obj.icon} />{this.getKeyword(obj.title)}
                                                  </li>
                                          }
                                          else {
                                            return <li className="mjp-nav-item"  key={index}>
                                                   <img src={'/images/icon/'+obj.icon+'.png'} />{this.getKeyword(obj.title)}
                                                  </li>
                                          }
                                        }
                                      })
                                    }
                                    </ul>
                                  </div>
                                </div>
                                </nav>
                           </td>
                           <td></td>
                       </tr>
                    </table>
              </div>
            </div>
          )
        }
        else {
          let dMenu = (
            <Menu>
            {
              this.props.options.menu_normal.map((item,index)=>{
                let obj = this.getMenu(item)
                //console.log(item, obj)
                if (obj != null)
                {
                  if(index == 0)
                  {
                    return   <Menu.Item key={index}>
                              <a href="#"><Icon type={obj.icon} />{this.getKeyword(obj.title)}</a>
                            </Menu.Item>
                  }
                  else {
                    return   <Menu.Item key={index}>
                              <a href="#"><img src={'/images/icon/'+obj.icon+'.png'} />{this.getKeyword(obj.title)}</a>
                            </Menu.Item>
                  }
                }
              })
            }
           </Menu>
          )
          return (
            <div className="pc-header mb">
              <div className = "sub-header header-title white-font">
              <table  style={{width:'100%'}}>
                <tbody>
                  <tr>
                    <td style={{width:'25%'}}>
                      {
                        system.heading =='kMYJIPIAO'
                        ?<Dropdown overlay={dMenu} placement="bottomLeft"><Button><i className="fa fa-bars"/></Button></Dropdown>
                        :null
                      }
                    </td>
                    <td style={{width:'50%'}}><div className="text-center">{this.getKeyword(system.heading)}</div></td>
                    <td style={{width:'25%'}}></td>
                  </tr>
                </tbody>
              </table>
              </div>
            </div>
          )
        }
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader))
