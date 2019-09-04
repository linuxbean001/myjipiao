import React from 'react'

import {Link, withRouter} from 'react-router-dom'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as optionsActionCollection from '../../actions/options'
import * as stepActionCollection from '../../actions/step'

import {getPage} from '../../fetch/service'
import util from '../../util/utility'
import MessageDiv from '../../components/MessageDiv'
import SpinDiv from '../../components/SpinDiv'


import {Col, Row, Checkbox, Icon} from 'antd'



class Info extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isDataLoad:false,
      isBusy:false,
      catID:0,
      catalog:[],
      article:[],
      error: ''
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

  componentWillReceiveProps(nextProps) {
  // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.location.id != this.props.location.id)  {
      this.loadData(nextProps.location.id)
    }
  }

  loadData(cid) {
    this.setState({isBusy:true, catalog:[], article:[]})
    const result = getPage({id:cid})
    result.then(res => {
      return res.json()
    }).then(json => {
      // 处理获取的数据
      const data = json
      //console.log("fare price")
      if (data.error === "") {
        if(data.page_catalog.length > 0)
        {
          this.setState({isBusy:false, catID:data.page_catalog[0].ID, error:data.error, isDataLoad:true, catalog:data.page_catalog, article:data.page_article})
        }
        else {
          this.setState({error: "data.error", isBusy:false})
        }

      } else {
        this.setState({error: data.error, isBusy:false})
      }
    })
  }

  componentDidMount() {
    this.loadData(this.props.location.id)
    window.scrollTo(0, 0)
  } //end of componentDidMoun

  changeCatlog(cid){
    this.setState({catID:cid})
  }

  getPageItem() {
    for (var i=0; i< this.props.options.page.length; i++)
    {
      let obj =this.props.options.page[i]
      if(obj.ID == this.props.location.id)
      {
        return obj
      }
    }

    return this.props.options.page[0]
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
       return <div><MessageDiv type="error" keywordFn={(item)=> {return this.getKeyword(item)}} message={this.state.error}/></div>
     }
     else {
       if (!this.state.isDataLoad)
       {
         //console.log("isdataload", this.props.isDataLoad)
         return <div></div>
       }
       else {
             let aPage = this.getPageItem()
             if(this.getReduxDataByID('system').device == 'pc')
             {
               return (
                 <div className="pad-ver">
                 <div className="panel">
                   <div className="panel-heading">{this.getKeyword(aPage.Title)}</div>
                   <div className = "panel-body">
                   <Row>
                      <Col span={6}>

                          <div className="list-group">
                            {
                              this.state.catalog.map((item,index)=> {
                                if(item.ID == this.state.catID)
                                {
                                  return <div key={index}><a className="list-group-item active" href="#">{this.getKeyword(item.Title)}</a></div>
                                }
                                else {
                                  return <div><a className="list-group-item" href="#" onClick={this.changeCatlog.bind(this, item.ID)}>{this.getKeyword(item.Title)}</a></div>
                                }
                              })
                            }
                          </div>
                      </Col>
                      <Col span={18}>
                        <div className="pad-lft">
                        {
                          this.state.article.map((item,index)=> {
                            let content = this.getReduxDataByID('system').language == "cn"? item.Content_Cn:item.COntent_En
                            if(item.CATALOG_ID == this.state.catID)
                            {
                              return <div key={index} dangerouslySetInnerHTML={{__html: content }} ></div>
                            }
                          })
                        }
                        </div>
                      </Col>
                   </Row>
                   </div>
                 </div>
                </div>
               )
             }
             else {
               return (
                 <div className="pad-ver">
                 <div className="panel">
                   <div className="panel-heading">{this.getKeyword(aPage.Title)}</div>
                   <div className = "panel-body">
                          <div className="list-group">
                            {
                              this.state.catalog.map((item,index)=> {

                                  return (
                                    <div>
                                      <div key={index}><a className="list-group-item" href="#">{this.getKeyword(item.Title)}</a></div>
                                      {
                                        this.state.article.map((item0,index0)=> {
                                          let content = this.getReduxDataByID('system').language == "cn"? item0.Content_Cn:item0.COntent_En
                                          if(item0.CATALOG_ID == this.state.catID)
                                          {
                                            return <div key={index0} dangerouslySetInnerHTML={{__html: content }} ></div>
                                          }
                                        })
                                      }
                                    </div>
                                  )
                              })
                            }
                          </div>
                   </div>
                 </div>
                </div>
               )
             }
         //try {

          // }
           //catch(err) {
               //console.log("error", err.message)
               //return <div><MessageDiv keywordFn={(item)=> {return this.getKeyword(item)}} message={err.message}/></div>
           //}
       }
     }
   }
 }

  render() {
    return (
      <div className="page-box">
      {this.getHtml()}
      </div>
    )
  }
}


// -------------------redux react --------------------

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
export default connect(mapStateToProps, mapDispatchToProps)(Info)
