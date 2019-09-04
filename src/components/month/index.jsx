import React from 'react'


class Month extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  daysInMonth (month, year) {
    if (month == 11)
    {
      return new Date(year+1, 1, 0).getDate();
    }
    else {
      return new Date(year, month+1, 0).getDate();
    }
  }

  clickDay(item)
  {
    this.props.onSelectDate(this.props.year, this.props.month, item);
  }

  prevMonth() {
    this.props.prevMonthFn()
  }

  nextMonth() {
    this.props.nextMonthFn()
  }

  getMonthFormat(item) {
    let arr = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    return arr[item];
  }

  getIntOfDate(strDate, defaultValue=0){
    if ((strDate !=null) && (strDate !=''))
    {
      let tempDate = new Date(strDate);
      return tempDate.getFullYear()*10000+ (tempDate.getMonth()+1)*100+ tempDate.getDate();
    }
    else {
      return defaultValue;
    }
  }

  getNavegatorHtml() {
    if (this.props.device == 'pc')
    {
      return (
        <ul>
          {
            this.props.position== 0
            ?<li className ="prev" onClick={this.prevMonth.bind(this)}>&#10094;</li>
            :<li className ="next" onClick={this.nextMonth.bind(this)}>&#10095;</li>
          }
          <li>
              {this.props.year} {this.getMonthFormat(this.props.month)}
          </li>
        </ul>
      )
    }
    else {
      return (
        <ul>
            <li className ="prev" onClick={this.prevMonth.bind(this)}>&#10094;</li>
            <li className ="next" onClick={this.nextMonth.bind(this)}>&#10095;</li>

          <li>
              {this.props.year} {this.getMonthFormat(this.props.month)}
          </li>
        </ul>
      )
    }
  }

  isValidDay(item) {
    for (var i=0; i< this.props.period.length; i++)
    {
      let pe = this.props.period[i]

      if( (item >= pe.From_Date*1) && (item <= pe.To_Date *1))
      {
        return false
      }
    }

    return true
  }

  render() {
    let fDay = new Date(this.props.year, this.props.month)
    let fWeekDay = fDay.getDay()
    let emptyCount = fWeekDay == 0? 7:fWeekDay;
    let days =[]
    for (var i=0; i< emptyCount-1; i++)
    {
      days.push(0)
    }

    for (var i=0; i< this.daysInMonth(this.props.month, this.props.year); i++)
    {
      days.push(i+1)
    }

    let toDay = new Date()
    let intToday = toDay.getFullYear()*10000+ (toDay.getMonth()+1)*100+toDay.getDate()
    let intMinDay = this.getIntOfDate(this.props.min, intToday);
    let intMaxDay = this.getIntOfDate(this.props.max,30000000);
    let intValueDay = this.getIntOfDate(this.props.value);

    let intBase = this.props.year * 10000+ (this.props.month+1)*100;

    return (
      <div className="ca">
        <div className ="month">
        { this.getNavegatorHtml()}
        </div>
        <ul className ="weekdays">
          <li>Mo</li>
          <li>Tu</li>
          <li>We</li>
          <li>Th</li>
          <li>Fr</li>
          <li>Sa</li>
          <li>Su</li>
        </ul>

        <ul className ="days">
          {
            days.map((item, index) =>{
              let intShowDay = intBase+item;
              let isValidDate = this.isValidDay(intShowDay)
              if(item == 0)
              {
                return <li key={index} className="empty-cell"></li>
              }
              else {
                if (intShowDay ==  intValueDay)
                {
                  if (isValidDate)
                  {
                    return <li  key={index}><span className ="active-disabled">{item}</span></li>
                  }
                  else {
                    return <li  key={index}  onClick={this.clickDay.bind(this, item)}><span className ="active">{item}</span></li>
                  }
                }
                else {
                  if (intShowDay == intToday)
                  {
                    return <li  key={index}><span className ="right-active">{item}</span></li>
                  }
                  else {
                    if (isValidDate)
                    {
                      return <li  key={index}><span className ="disabled">{item}</span></li>
                    }
                    else {
                      return <li  key={index} className="normal" onClick={this.clickDay.bind(this, item)}>{item}</li>
                    }
                  } //end of not value day
                }//end of  not today
              }
            })
          }
        </ul>
        </div>
    )
  }
}

export default Month
