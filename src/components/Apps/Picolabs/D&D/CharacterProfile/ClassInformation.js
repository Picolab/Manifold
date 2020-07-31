import React from 'react';

class RaceInformation extends React.Component {
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

  displaySavingThrows() {
    let out = []
    let saving = this.state.details.saving_throws
    for (let i in saving) {
      out.push(
        <div key={saving[i].name} className="detailsSectionList">
          {this.props.abilities[saving[i].name].full_name}
        </div>
      )
    }
    return out;
  }

  displaySectionList(list) {
    let out = [];
    for (let i in list) {
      out.push(
        <div key={list[i].name} className="detailsSectionList">
          {list[i].name}
        </div>
      )
    }
    return out;
  }

  displayProficiencies() {
    let out =[]
    let choices = this.state.details.proficiency_choices[0].from
    for (let i in choices) {
      out.push(
        <div key={choices[i].name} className="detailsSectionList">
          {choices[i].name.split(":")[1]}
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
            {details.name} Details
          </div>
        </div>
        <div className="detailsSection">
          Hit Die:
          d{details.hit_die}
        </div>
        <div className="detailsSection">
          Proficiency Choices: (Choose {details.proficiency_choices[0].choose})
          {this.displayProficiencies()}
        </div>
        <div className="detailsSection">
          Proficiencies:
          {this.displaySectionList(details.proficiencies)}
        </div>
          Saves:
          {this.displaySavingThrows()}
      </div>
    )
  }

}
export default RaceInformation;
