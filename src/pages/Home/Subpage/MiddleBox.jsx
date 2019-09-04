import React from 'react'

import {Link, withRouter} from 'react-router-dom'

import util from "../../../util/utility"

import TipNode from "../../../components/TipNode/index"

import {Row, Col} from 'antd'

class MiddleBox extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {

  } //end of componentDidMount
  render() {

    const data = this.props.data
    return (
      <div className="row" id="bestfare">
        <div className="eq-height">
           <div className="col-md-6 col-lg-4 eq-box-lg">
             <div className="panel">
               <div className="panel-heading">
                 <h3 className="panel-title">Best Fares</h3>
               </div>
               <div className="panel-body">
                 <table>
                   <tbody>
                   {
                     this.props.data.map((item,index) =>{
                       return  <tr key={index}>
                         <td><TipNode code={item.From_City} type="city"/></td>
                         <td><i className="fa fa-plane fa-rotate-45"></i></td>
                         <td><TipNode code={item.To_City} type="city"/></td>
                         <td><TipNode code={item.Carrier} type="airline"/></td>
                         <td className="text-right price">${item.Total}</td>
                         </tr>
                     })
                   }
                   </tbody>
                 </table>
               </div>
             </div>
           </div>
           <div className="col-md-6 col-lg-4 eq-box-lg">
             <div className="panel">
               <div className="panel-heading">
                 <div className="panel-control">
                   <a className="fa fa-external-link pad-top" target="_blank" href="https://www.seatguru.com/airlines/Singapore_Air/information.php">SQ</a>
                 </div>
                 <h3 className="panel-title">Focus on airline</h3>
               </div>
               <div className="panel-body mar-top">
                   <h4>Airline Overview</h4>
                 <img src="https://cdn.seatguru.com/en_US/img/10087/seatguru/airline_logos/SQ.jpg"/>
                  <p>The country's flag carrier, Singapore Airlines (SQ) was founded in 1947. It operates from a hub at Singapore Changi Airport (SIN). Singapore Airlines flies to about 65 destinations in 35 countries. It is one of just several airlines that fly to all six inhabited continents. A member of the Star Alliance, Singapore Airlines also has codeshare agreements with 10 airlines that are not part of its alliance. The carrier has five classes of service: Singapore Airlines Suites, First Class, Business Class, Premium Economy Class and Economy Class. However, not every plane in the airline's fleet of 108 aircraft includes each class of service. Singapore Airlines owns several subsidiaries, including Scoot Airlines (TZ), SilkAir (MI) and Tigerair (TR).</p>
               </div>
             </div>
           </div>
           <div className="col-md-12 col-lg-4 eq-box-lg">
             <div className="panel">
               <div className="panel-heading">
                 <div className="panel-control">
                   Price: $500
                 </div>
                 <h3 className="panel-title">Destination this week</h3>
               </div>
               <div className="panel-body">
                 {/*<!--Link Items-->*/}
                 <iframe width="100%" height="315"
 src="https://www.youtube.com/embed/pKuGqKYk3pQ">
 </iframe>
               </div>
             </div>
           </div>
        </div>
         </div>
    )
  }
}

export default MiddleBox
