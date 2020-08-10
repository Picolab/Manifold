import React from 'react';
import { Collapse, CardBody, Card } from 'reactstrap';
import ClassInformation from './ClassInformation';
import ProfeciencyChoice from './ProfeciencyChoice';

class ClassSelection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      classes: this.props.classes,
      classInformation: { toggle: false, details: null }
    };

  }

  componentDidUpdate(prevProps) {
    if (this.props.classes !== prevProps.classes) {
      this.setState({
        classes: this.props.classes
      })
    }
  }

  toggleDetails(details) {
    this.setState({
      classInformation: {
        toggle: !this.state.classInformation.toggle,
        details: details
      }
    })
  }

  handleClassChoice(classChoice) {
    this.setState({
      classChoice: classChoice.name
    })
    this.props.buildCharacter("class", classChoice)
  }

  displayClasses() {
    let classes = this.state.classes
    let out = []
    for(let i in classes) {
      out.push(
        <div key={classes[i].name}>
          <div className="selectionListItem">
            <input className="selectionRadioButton" type="radio" name="class" id={classes[i].name} value={classes[i].name} onClick={()=>{this.handleClassChoice(classes[i]);}} defaultChecked={this.state.classChoice === classes[i].name}/> {classes[i].name}
            <div className="selectionDetails" onClick={()=>{this.toggleDetails(classes[i]);}}>Details</div>
          </div>
          <Collapse isOpen={this.state.classChoice === classes[i].name}>
            <Card className="classCard">
              <CardBody className="classCollapse">
                <ProfeciencyChoice
                  choices={classes[i].proficiency_choices[0]}
                  buildCharacter={this.props.buildCharacter}
                />
              </CardBody>
            </Card>
          </Collapse>
        </div>
      )
    }
    return out;
  }


  render() {
    if(this.state.classes) {
      if(!this.state.classInformation.toggle) {
        return(
          <div>
            {this.displayClasses()}
          </div>
        )
      }
      return(
        <ClassInformation
          details={this.state.classInformation.details}
          abilities={this.props.abilities}
          toggleDetails={()=>{this.toggleDetails(null);}}
        />
      )
    }
    return(
      <div>
        Loading...
      </div>
    )
  }

}
export default ClassSelection;
