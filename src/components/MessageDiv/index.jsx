import React from 'react'



class MessageDiv extends React.Component {
  constructor(props, context) {
    super(props, context);

  }

  render() {
    const getKeyword = this.props.keywordFn

    const message = this.props.message ==null? "":this.props.message.indexOf("k")==0? getKeyword(this.props.message):this.props.message
    const strClass = this.props.type === 'error'? "alert alert-danger":"alert alert-warning"
    const strTitle = this.props.type === 'error'? getKeyword("kError"):getKeyword("kMessage")
    return (
      <div className="panel" style={{marginTop:15}}>
					<div className="panel-heading">
						<h3 className="panel-title"><i className="fa fa-bell" aria-hidden="true">&nbsp;</i>{strTitle}</h3>
					</div>
					<div className="panel-body">
            <div className={strClass}>
							<strong><i className="fa fa-exclamation-triangle" aria-hidden="true"></i></strong> {message}
						</div>
					</div>
      </div>
    )
  }
}

export default MessageDiv
