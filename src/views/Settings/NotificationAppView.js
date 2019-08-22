import React from 'react';
import { Input, Form, FormGroup, Label } from 'reactstrap';
import {customEvent, customQuery} from '../../utils/manifoldSDK';
import {getManifoldECI} from '../../utils/AuthService';
import SettingsSwitch from './SettingsSwitch';
import TwilioSwitch from './TwilioSwitch';
import ProwlSwitch from './ProwlSwitch';
import EmailSwitch from './EmailSwitch';
import TextMessageSwitch from './TextMessageSwitch';

class NotificationAppView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false
    }
    this.setSettings = this.setSettings.bind(this);
  }

  componentDidMount() {
      this.setSettings();
  }

  setSettings() {
    var url = window.location.href;
    var rid = url.split("/");
    var id = rid[rid.length-2];
    var app_name = rid[rid.length-1];

    let promise = customQuery(getManifoldECI(),"io.picolabs.notifications", "getSettings", {id, app_name});

    promise.then((resp) => {
        this.setState({
          manifold: resp.data.Manifold,
          twilio: resp.data.Twilio,
          prowl: resp.data.Prowl,
          email: resp.data.Email,
          text: resp.data.Text
        });
    })
  }

  changeSetting = (option) => {
    var url = window.location.href;
    var rid = url.split("/");
    var id = rid[rid.length-2];
    var app_name = rid[rid.length-1];
    const promise = customEvent( getManifoldECI(), "manifold", "change_notification_setting", {"id": id, "app_name": app_name, "option": option}, 'notification_change');
    promise.then((resp) => {
      this.setSettings();
    });
  }

  // displayForm() {
  //   return (
  //     <Form>
  //       <FormGroup>
  //         <Label for="exampleEmail">Twilio Number</Label>
  //         <Input type="twilioNumber" name="twilioNumber" id="twilioNumber"  />
  //       </FormGroup>
  //       <FormGroup>
  //         <Label for="examplePassword">To Phone</Label>
  //         <Input type="toPhone" name="toPhone" id="toPhone" />
  //       </FormGroup>
  //     </Form>
  //   );
  // }
  //
  // displayFadedForm() {
  //   return(
  //     <Form style={{"opacity": "0.5"}}>
  //       <FormGroup>
  //         <Label for="exampleEmail">Twilio Number</Label>
  //         <Input type="twilioNumber" name="twilioNumber" id="twilioNumber" disabled />
  //       </FormGroup>
  //       <FormGroup>
  //         <Label for="examplePassword" >To Phone</Label>
  //         <Input type="toPhone" name="toPhone" id="toPhone" disabled/>
  //       </FormGroup>
  //     </Form>
  //   );
  // }


  render() {
    return (
      <div style={{"backgroundColor": "#fff", "width": "600px"}}>
        <h1 style={{"paddingLeft": "5px", "textAlign": "center"}}>Notification Settings</h1>
        <hr className="my-2" />
        <SettingsSwitch
            isChecked={this.state.manifold}
            text = "Notifications Through Manifold"
            param = "Manifold"
            action = {this.changeSetting}
        />
        <hr className="my-2" />
        <TwilioSwitch
            isChecked={this.state.twilio}
            text = "Notifications Through Twilio"
            param = "Twilio"
            action = {this.changeSetting}
        />
        <hr className="my-2" />
        <ProwlSwitch
            isChecked={this.state.prowl}
            text = "Notifications Through Prowl"
            param = "Prowl"
            action = {this.changeSetting}
        />
        <hr className="my-2" />
        <EmailSwitch
            isChecked={this.state.email}
            text = "Notifications Through Email"
            param = "Email"
            action = {this.changeSetting}
        />
        <hr className="my-2" />
        <TextMessageSwitch
            isChecked={this.state.text}
            text = "Notifications Through Text Message"
            param = "Text"
            action = {this.changeSetting}
        />
        <hr className="my-2" />
      </div>
    );
  }
};
export default NotificationAppView;
