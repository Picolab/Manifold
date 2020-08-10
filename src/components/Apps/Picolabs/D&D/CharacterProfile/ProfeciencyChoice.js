import React from 'react';

class ProfeciencyChoice extends React.Component {
  constructor(props) {
    super(props);
    console.log(localStorage.getItem("profeciencies"));

    let profeciencies = localStorage.getItem("profeciencies") === null ? {} : JSON.parse(localStorage.getItem("profeciencies"))
    this.state = {
      isActive: true,
      choices: this.props.choices,
      choose: this.props.choices.choose,
      chosen: profeciencies,
      chosenNumber: 0,
      isActive: true
    };

  }

  choiceHandler(proficiency) {
    let name = proficiency.name
    let value = proficiency
    if(this.state.chosen[name]) {
      let map = this.state.chosen
      delete map[name]
      this.setState({
        chosen: map,
        chosenNumber: map.size,
        isActive: true
      })
      this.props.buildCharacter("profeciencies", map)
      localStorage.setItem("profeciencies", JSON.stringify(map));
    }
    else {
      if(this.state.isActive) {
        let map = this.state.chosen
        map[name] = value
        let chosenNumber = Object.keys(map).length;
        this.setState({
          chosen: map,
          chosenNumber: chosenNumber,
          isActive: chosenNumber === this.state.choose ? false : true
        })
        this.props.buildCharacter("profeciencies", map)
        localStorage.setItem("profeciencies", JSON.stringify(map));
      }
    }
  }

  displaySectionList(list) {
    let out = [];
    for (let i in list) {
      let checked = this.state.chosen[list[i].name] ? true : false
      let disabled =  !checked && !this.state.isActive ? true : false
      out.push(
        <div key={list[i].name}>
          {checked && <input type="checkbox" className="profeciencyChoice" onClick={()=>{this.choiceHandler(list[i]);}} defaultChecked/>}
          {!checked && !disabled && <input type="checkbox" className="profeciencyChoice" onClick={()=>{this.choiceHandler(list[i]);}}/>}
          {disabled && <input type="checkbox" className="profeciencyChoice" disabled/>}
          {' '}{list[i].name.split(":")[1]}
        </div>
      )
    }
    return out;
  }

  render() {
    let choices = this.state.choices
    let choose = this.state.choose

    return(
      <div>
        <div className="detailsSection">
          Profeciency Choice: (Choose {choose})
          {this.displaySectionList(choices.from)}
        </div>
      </div>
    )
  }

}
export default ProfeciencyChoice;
