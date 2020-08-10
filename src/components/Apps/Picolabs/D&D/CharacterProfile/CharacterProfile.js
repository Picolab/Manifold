import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import './CharacterProfile.css';
import { displayError } from '../../../../../utils/manifoldSDK';
import { styles } from './CharacterProfileStyles';
import RaceSelection from './RaceSelection';
import ClassSelection from './ClassSelection';
import AbilitySelection from './AbilitySelection'
import CharacterDisplay from './CharacterDisplay';


class CharacterProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      races: null,
      classes: null,
      abilities: null,
      character: {}
    };
    this.toggle = this.toggle.bind(this);
    this.getCharacterCreationData = this.getCharacterCreationData.bind(this);
    this.buildCharacter = this.buildCharacter.bind(this);
  }

  buildCharacter(key, value) {
    let map = this.state.character
    map[key] = value
    this.setState({
      character: map
    })
    console.log("character",map);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
      activeTab: '1'
    }));
  }

  tabToggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  getCharacterCreationData() {
    if(!(this.state.races && this.state.classes && this.state.abilities)) {
      const promise = this.props.manifoldQuery({
        rid: "D-D_Character_Profile",
        funcName: "getCharacterCreationData"
      });
      promise.then((resp) => {
        let results = resp.data

        this.setState({
          races: results.races,
          classes: results.classes,
          abilities: results.abilities
        });
      }).catch((e) => {
          displayError(true, "Error getting Character Creation Data.", 404);
      });
    }
  }

  displayProfile() {
    if(this.state.profile) {
      return(
        <div style={{ "marginTop": "5%"}}>
          <CharacterDisplay />
          <button className="D-DButton" onClick={()=>{this.getCharacterCreationData(); this.toggle();}}> Create New Character </button>
        </div>
      )
    }
    else {
      return(
        <div className="center-container">
          No Character Created
          <button className="D-DButton" onClick={()=>{this.getCharacterCreationData(); this.toggle();}}> Create Character </button>
        </div>
      )
    }
  }

  render() {
    return(
      <div className="profile-container">
        {this.displayProfile()}
        <Modal style={{"border": "1px solid red", "borderColor": "red"}} isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader style={styles.modalContent} toggle={this.toggle}>Character Creation</ModalHeader>
          <ModalBody style={styles.modalContent}>
            <div>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    style={(this.state.activeTab === '1') ? styles.navLink : {}}
                    onClick={() => { this.tabToggle('1'); }}
                  >
                    Races
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={(this.state.activeTab === '2') ? styles.navLink : {}}
                    onClick={() => { this.tabToggle('2'); }}
                  >
                    Classes
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={(this.state.activeTab === '3') ? styles.navLink : {}}
                    onClick={() => { this.tabToggle('3'); }}
                  >
                    Abilities
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent style={styles.tabContent} activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                  <RaceSelection
                    races={this.state.races}
                    abilities={this.state.abilities}
                    buildCharacter={this.buildCharacter}
                  />
                </TabPane>
                <TabPane tabId="2">
                  <ClassSelection
                    classes={this.state.classes}
                    abilities={this.state.abilities}
                    buildCharacter={this.buildCharacter}
                  />
                </TabPane>
                <TabPane tabId="3">
                  <AbilitySelection
                    abilities={this.state.abilities}
                  />
                </TabPane>
              </TabContent>
            </div>
          </ModalBody>
          <ModalFooter style={styles.modalFooter}>
            <button className="D-DButton" onClick={this.toggle}>Create</button>{' '}
          </ModalFooter>
        </Modal>
      </div>
    );
  }

}
export default CharacterProfile;
