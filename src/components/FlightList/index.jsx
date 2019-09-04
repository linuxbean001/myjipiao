import React from 'react'



class FlightList extends React.Component {
  constructor(props, context) {
    super(props, context);

  }

  render() {
    const data = this.props.data;
    const depUrl = 'https://www.flightsb2b.com/images/airlines/other/departure0.png';
    const arrUrl = 'https://www.flightsb2b.com/images/airlines/other/arrival0.png';
    const seatUrl = 'https://www.flightsb2b.com/images/airlines/other/airplaneseat.png';

    return (
      <div className="flightListContainer">
      <table>
        <tbody>
          {
            data.map((item,index) =>{
                const url = 'https://www.flightsb2b.com/images/airlines/png/' + item.CarrierCode + '.png';

                return   <tr key={index}>
                      <td><img src={url} className="logo"/></td>
                      <td >{data.CarrierCode}</td>
                      <td><img src={depUrl}/></td>
                      <td >{data.FromCode}</td>
                      <td className="text-info">
                        <i className="fa fa-calendar " aria-hidden="true"></i>
                        {data.FromDate}</td>
                      <td className="text-danger">
                        <i className="fa fa-clock-o" aria-hidden="true"></i>
                        {data.FromTime}</td>
                      <td><img src={arrUrl}/></td>
                      <td >{data.ToCode}</td>
                      <td className="text-info">
                        <i className="fa fa-calendar " aria-hidden="true"></i>
                        {data.ToDate}</td>
                      <td className="text-danger">
                        <i className="fa fa-clock-o" aria-hidden="true"></i>
                        {data.ToTime}</td>
                    </tr>
            })
          }
        </tbody>
      </table>
      </div>
    )
  }
}

export default FlightList
