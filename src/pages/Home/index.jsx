import React from 'react'
import {withRouter} from "react-router-dom";
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {getOptions} from '../../fetch/service'


import util from '../../util/utility.js'


import Pax from '../../components/Pax/index'
import SearchPanel from './Subpage/SearchPanel'
import AirlineSpecialPrice from './Subpage/AirlineSpecialPrice'
import RecentSpecialPrice from './Subpage/RecentSpecialPrice'
import OzLocal from './Subpage/OzLocal'

import MessageDiv from '../../components/MessageDiv'
import SpinDiv from '../../components/SpinDiv'

import * as optionsActionCollection from '../../actions/options'
import * as stepActionCollection from '../../actions/step'

import {Row, Col} from 'antd';

class Home extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isBusy:false,
      isDataLoad:false,
      isDisabled:false,
      pageIndex: 100,
      pageName: 'main',
      error:'',
      fsrArr: [1,2,3,4,5],
      fsrIndex:0,
      green_box: [{title:"best airfares", icon:'f1.png'}, {title:"focus on airline", icon:'f2.png'},{title:"destination this week", icon:'f3.png'}]
    }
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

  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
  }


  componentDidMount() {
    this.props.stepActions.updateItem({
      id:'system',
      heading:'kMYJIPIAO'
    })

    let airlines = this.props.options.airline
    if (airlines != null) {
       // go back actions
       this.setState({isDataLoad: true})
       for (var i=0;i< this.getReduxDataByID('legs').length; i++)
       {
         let aLeg = this.getReduxDataByID('leg'+i)
         if (aLeg.isFareTableLoad!=null)
         {
           this.props.stepActions.updateItem({
             id: 'leg'+i,
             fsr:aLeg.fsr,
             isFareTableLoad:false
           })
         }
       }
     } else {
       if (!this.props.isDataLoad) {
           this.setState({isBusy:true})
           const result = getOptions({})
           result.then(res => {
             return res.json()
           }).then(json => {
             const data = json
             if(json.error==='')
             {
               this.props.optionsActions.update({...this.props.options, ...data})
             }
             this.setState({error:json.error, isBusy:false, isDataLoad:true})
           })
       }
       else {
         this.setState({isDataLoad: true})
       }
     }
    //this.props.stepActions.updateItem({pageIndex: this.state.pageIndex})
  } //end of componentDidMount

  getKeyword(text)
  {
    return util.getKeyword(text, this.props.options.keywords, this.getReduxDataByID('system').language)
  }

  startSearch() {
    this.props.stepActions.updateItem({id:'system', searchIndex:util.getTime()})
    this.props.history.push("/Fare")
  }



  getHtml() {
    const state = this.state
    let isPC = this.getReduxDataByID('system').device =='pc'
    const BGImage = `${process.env.PUBLIC_URL}/images/bg.png`;
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
        if (state.isDataLoad)
        {
          let divClass = state.isDisabled? 'home-page page-disabled':'home-page'
          return (
            <React.Fragment>
              <section id="middle-content-main" className={divClass}>
                  <div>
                      <div className= 'main-div-pc'>
                      {
                        isPC
                        ?  <div className="slogan-container" style={{clear:'both'}}>
                            <p className='text-center slogan'>{this.getKeyword("kWorldTouch")}</p>
                            <p className='text-center slogan'>{this.getKeyword("kMJPForYou")}</p>
                          </div>
                        : <div></div>
                      }

                          <div>
                             <SearchPanel startSearch={this.startSearch.bind(this)}/>
                          </div>

                          <AirlineSpecialPrice startSearch={this.startSearch.bind(this)}/>
                      </div>{/* end of main-div-pc*/}

                    </div>
              </section>
            </React.Fragment>
          )
        }
        else {
          return <div></div>
        }
      }
    }
  }


  render() {
    let system = this.getReduxDataByID('system')
    let divClass = system.device == 'pc'? 'center-content':'center-content mb'

    return (
      <div className={divClass}>
      {this.getHtml()}
      </div>
    )
  }
}

// -------------------redux react --------------------

function mapStateToProps(state) {
  return {
    options: state.options,
    step: state.step,
    isMobile: false
  }
}

function mapDispatchToProps(dispatch) {
  return {
    optionsActions: bindActionCreators(optionsActionCollection, dispatch),
    stepActions: bindActionCreators(stepActionCollection, dispatch)
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home))
