import React from 'react'


import Carrier from '../../../components/Carrier/index'

class Carrierlist extends React.Component {
  constructor(props, context) {
    super(props, context);
    
  }

  render() {
    const data = this.props.data
    return (
      <div>
        <ul className="list-group">
        {data.map((item, index) => {
          return <Carrier key={index} data={item}  changeFn={(data)=>{this.onSelected(data)}}/>
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

export default Carrierlist
