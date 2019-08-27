import React from "react";
import EmailModal from './EmailModal';
import "./SettingsSwitch.css";

class EmailSwitch extends React.Component {

  constructor ( props ) {
      super( props );

  	this.state = {
  		isChecked: this.props.isChecked
  	}

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidUpdate() {
    if(this.props.isChecked !== this.state.isChecked) {
    	this.setState( { isChecked: this.props.isChecked } );
    }
  }

	componentWillMount () {
		this.setState( { isChecked: this.props.isChecked } );
	}

  handleChange () {
      this.setState( { isChecked: !this.state.isChecked } );
  }

  action() {
    return (event) => {
      this.props.action(this.props.param);
    };
  }

  render () {
      return(
          <div className="component-container">
            <div className="component-text">{this.props.text}</div>{' '}
            <EmailModal/>
            <div className="switch-container">
                <label className="label-switch">
                    <input ref="switch" checked={ this.state.isChecked } onClick={this.action()} onChange={ this.handleChange } className="switch" type="checkbox" />
                      <div>
                        <div></div>
                      </div>
                </label>
            </div>
          </div>
        );
    }

}
export default EmailSwitch;
