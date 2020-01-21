import React from 'react'
import {Row, Col} from 'antd'
import Month from '../month'

class Calendar extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = this.getNewState(this.props);

  }

  getIntOfDate(tempDate){
      return tempDate.getFullYear()*10000+ tempDate.getMonth()*100+ tempDate.getDate();
  }

  getNewState(props) {

    let min = props.period[0].From_Date
    let startDate = new Date(min.substring(0,4)*1, min.substring(4,6)*1-1, min.substring(6,8)*1);
    let nextMonth = new Date(startDate.getFullYear(), startDate.getMonth()+1, 1);
    this.handleClick = this.handleClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);

    return  {
        startYear: startDate.getFullYear(),
        startMonth: startDate.getMonth(),
        endYear:nextMonth.getFullYear(),
        endMonth: nextMonth.getMonth(),
        value:this.props.value,
        isShowCalendar: true
    }
  }

  componentWillReceiveProps(nextProps) {
  // You don't have to do this check first, but it can help prevent an unneeded render
    if ((nextProps.value != this.props.value) || (JSON.stringify(nextProps.period) != JSON.stringify(this.props.period))) {
      let newState = this.getNewState(nextProps);
      this.setState({
        ...newState
      })
    }
  }

  handleClick() {
   if (!this.state.isShowCalendar) {
     // attach/remove event handler
     document.addEventListener('click', this.handleOutsideClick, false);
   } else {
     document.removeEventListener('click', this.handleOutsideClick, false);
   }

   this.setState({
     isShowCalendar:!this.state.isShowCalendar
   });
 }

 handleOutsideClick(e) {
    // ignore clicks on the component itself
    if (this.node.contains(e.target)) {
      return;
    }
    this.handleClick();
  }

 onChange() {

 }

  goPrevMonth() {
    if(this.state.startMonth==0)
    {
      this.setState({
        startYear:this.state.startYear-1,
        startMonth: 11,
        endMonth: this.state.endMonth-1
      })
    }
    else {
      if(this.state.endMonth==0)
      {
        this.setState({
          startMonth: this.state.startMonth-1,
          endYear:this.state.endYear-1,
          endMonth: 11
        })
      }
      else {
        this.setState({
          startMonth: this.state.startMonth-1,
          endMonth: this.state.endMonth-1
        })
      }
    }
  }

  goNextMonth() {
    if(this.state.endMonth==11)
    {
      this.setState({
        endYear:this.state.endYear+1,
        startMonth: 11,
        endMonth: 0
      })
    }
    else {
      if(this.state.startMonth==11)
      {
        this.setState({
          startYear:this.state.startYear+1,
          startMonth: 0,
          endMonth: this.state.endMonth+1
        })
      }
      else {
        this.setState({
          startMonth: this.state.startMonth+1,
          endMonth: this.state.endMonth+1
        })
      }
    }
  }

  formatNumber(item)
  {
    return item <10? '0'+item:item
  }

  selectDate(year,month, day) {
    this.props.selectFn(this.props.attr, year+'-'+ this.formatNumber(month+1)+'-'+this.formatNumber(day))
    this.handleClick();
    //this.setState({isShowCalendar:false})
    //console.log('day select:', this.props.key+' '+ year+'-'+ this.formatNumber(month+1)+'-'+this.formatNumber(day));
  }

  getMonthHtml() {
    if (this.state.isShowCalendar == true)
    {
      if (this.props.device == 'pc')
      {
        return(
          <div className="callendar-div">
            <table className="tin-callendar-month">
                <tbody>
                  <tr>
                    <td>
                       <Month device={this.props.device} value={this.props.value} year={this.state.startYear} month={this.state.startMonth}  period={this.props.period} max={this.props.max} position="0" prevMonthFn={this.goPrevMonth.bind(this)} nextMonthFn={this.goNextMonth.bind(this)} onSelectDate={this.selectDate.bind(this)}/>
                    </td>
                    <td className="callendar-seprator"></td>
                    <td>
                       <Month device={this.props.device} value={this.props.value} year={this.state.endYear} month={this.state.endMonth}  period={this.props.period} max={this.props.max} position="1"   prevMonthFn={this.goPrevMonth.bind(this)} nextMonthFn={this.goNextMonth.bind(this)}  onSelectDate={this.selectDate.bind(this)}/>
                    </td>
                  </tr>
                </tbody>
              </table>
          </div>
        )
      }
      else {
            let monthArr = [0,1,2,3,4,5,6,7,8,9,10,11]
            return (
              <div>
              <table className="tin-callendar-mb">
                  <tbody>
                    {
                      monthArr.map((item,index)=>{
                        let month = this.state.startMonth + index
                        let startMonth = month < 12? month: month-12
                        let startYear = month < 12? this.state.startYear: this.state.startYear+1
                        return (
                          <tr>
                            <td>
                               <Month device={this.props.device} value={this.props.value} year={startYear} month={startMonth}  period={this.props.period} max={this.props.max} position="0"  prevMonthFn={this.goPrevMonth.bind(this)} nextMonthFn={this.goNextMonth.bind(this)}  onSelectDate={this.selectDate.bind(this)}/>
                            </td>
                          </tr>
                        )
                      })
                    }

                  </tbody>
                </table>
              </div>
            )
        }
    }
    else {
      return <div></div>
    }
  }

  render() {
    let displayValue = this.props.value == null? '':this.props.value
    let displayPlaceHolder = this.props.placeHolder == null? '':this.props.placeHolder
    return (
     <div className="tin-callendar" ref={node => {this.node = node;}}>
       {this.getMonthHtml()}
    </div>
    )
  }
}

export default Calendar
