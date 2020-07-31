import React from 'react';

class ProfeciencyChoice extends React.Component {
  constructor(props) {
    super(props);
    let choices = this.props.choices
    this.state = {
      isActive: true,
      choiceNumber: choices.choice,
      choices: {}
    };

  }

  choiceHandler(proficiency) {
    let name = proficiency.name
    let value = proficiency
    if(this.state.choices[name]) {

    }
    else {
      this.state.choices[name] = proficiency
    }
  }

  displaySectionList(list) {
    let out = [];
    for (let i in list) {
      out.push(
        <div key={list[i].name}>
          <input type="radio" className="profeciencyChoice" />{' '}{list[i].name}
        </div>
      )
    }
    return out;
  }

  render() {
    let choices = this.state.choices
    
    return(
      <div>
        <div className="detailsSection">
          Profeciency Choice: (Choose {choices.choose})
          {this.displaySectionList(choices.from)}
        </div>
      </div>
    )
  }

}
export default ProfeciencyChoice;
