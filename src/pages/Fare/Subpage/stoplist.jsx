import React from 'react'


import Stop from '../../../components/Stop/index'
import util from '../../../util/utility'

class Stoplist extends React.Component {
  constructor(props, context) {
    super(props, context);
    
  }

  render() {
    const data = util.sortByKey(this.props.data, 'id', true)
    return (
      <div>
        <ul className="list-group">
        {data.map((item, index) => {
          return <Stop key={index} data={item}  changeFn={(data)=>{this.onSelected(data)}}/>
        })}
      </ul>
      </div>
    )
  }

  onSelected(data)
  {
    const changeFn = this.props.changeFn
    changeFn(data)
  }
}

export default Stoplist
