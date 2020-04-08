import React from "react";
import "./ViaRouterSwitch.css"

class ViaRouterSwitch extends React.Component {

  constructor ( props ) {
      super( props );

  	this.state = {
  		isChecked: this.props.isChecked
  	}

    this.handleChange = this.handleChange.bind(this);
  }

	componentWillMount () {
		this.setState( { isChecked: this.props.isChecked } );
	}

  componentWillReceiveProps(newProps) {
      this.setState({
        isChecked: newProps.isChecked
      })
  }

  handleChange () {

  }

  action() {
    return (event) => {
      this.props.action();
    };
  }

  render () {
      return(
          <div className="component-container" style={{"width": "100px", "height":"22px", "float": "right"}}>
            <div className="switch-container" style={{"float": "left"}} >
                <label className="label-switch">
                    <input ref="switch" checked={ this.state.isChecked } onClick={this.props.action} onChange={ this.handleChange } className="switch" type="checkbox" />
                      <div>
                        <div></div>
                      </div>
                </label>
            </div>
            <span className="component-text" style={{"marginLeft": "-30px"}}>{this.props.text}</span>
          </div>
        );
    }

}
export default ViaRouterSwitch;
