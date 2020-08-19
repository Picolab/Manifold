import React from 'react';

class AbilityInformation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      details: (this.props.details) ? this.props.details : {}
    };

  }

  componentDidUpdate(prevProps) {
    if (this.props.details !== prevProps.details) {
      this.setState({
        details: this.props.details
      })
    }
  }


  displaySectionList(list) {
    let out = [];
    for (let i in list) {
      out.push(
        <div key={list[i].full_name} className="detailsSectionList">
          {list[i].full_name}
        </div>
      )
    }
    return out;
  }

  render() {
    let details = this.state.details
    return(
      <div>
        <div className="detailsHeader">
          <div className="backButtonContainer" onClick={this.props.toggleDetails}>
            <i className="fa fa-arrow-left returnToConnections" />
            Back
          </div>
          <div className="detailsSectionTitle">
            {details.full_name} Details
          </div>
        </div>
      </div>
    )
  }

}
export default AbilityInformation;
