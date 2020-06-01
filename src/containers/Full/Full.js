import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
//import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';
import CardOverview from '../../components/CardOverview/CardOverview';
import CardAppView from '../../components/CardAppView/CardAppView';

import ThingAppOverview from '../../views/Settings/ThingAppOverview';
import NotificationAppView from '../../views/Settings/NotificationAppView';

import Dashboard from '../../views/Dashboard/'
import MyThings from '../../views/MyThings/'
import Communities from '../../views/Communities/Communities'
import Profile from '../../views/Profile/Profile'
import Settings from '../../views/Settings/Settings'
import Feedback from '../../views/Feedback/Feedback'
import Privacy from '../../views/Privacy/Privacy'
//import Help from '../../views/Help/Help'
import Charts from '../../views/Charts/'
import Widgets from '../../views/Widgets/'
import Buttons from '../../views/Components/Buttons/'
import Cards from '../../views/Components/Cards/'
import Forms from '../../views/Components/Forms/'
import Modals from '../../views/Components/Modals/'
import SocialButtons from '../../views/Components/SocialButtons/'
import Switches from '../../views/Components/Switches/'
import Tables from '../../views/Components/Tables/'
import Tabs from '../../views/Components/Tabs/'
import FontAwesome from '../../views/Icons/FontAwesome/'
import SimpleLineIcons from '../../views/Icons/SimpleLineIcons/'

//Error Modal
import ErrorModal from '../../components/Modals/ErrorModal/ErrorModal'

import { connect } from 'react-redux';
import ActionTypes from '../../actions';


class Full extends Component {
  componentWillMount(){
    this.props.dispatch({type: ActionTypes.FETCH_ECI}); //the saga will fetch the eci
  }
  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar {...this.props}/>
          <main className="main">
            <Breadcrumb />
            <div className="container-fluid">
              <Switch>
                <Route path="/dashboard" name="Dashboard" component={Dashboard}/>
                <Route path="/notification-settings/:picoID/:appRid" name="App Notification Settings" component={NotificationAppView}/>
                <Route path="/mythings/:picoID/:appRid" name="Thing App View" component={CardAppView}/>
                <Route path="/mythings/:picoID" name="Card Overview" component={CardOverview}/>
                <Route path="/mythings" name="My Things" component={MyThings}/>
                <Route path="/notification-settings/:picoID" name="ThingAppOverview" component={ThingAppOverview}/>
                <Route path="/communities" name="Communities" component={Communities}/>
                <Route path="/profile" name="Profile" component={Profile}/>
                <Route path="/settings" name="Settings" component={Settings}/>
                <Route path="/feedback" name="Feedback" component={Feedback}/>
                <Route path="/privacy" name="Privacy" component={Privacy}/>
                <Route path="/components/buttons" name="Buttons" component={Buttons}/>
                <Route path="/components/cards" name="Cards" component={Cards}/>
                <Route path="/components/forms" name="Forms" component={Forms}/>
                <Route path="/components/modals" name="Modals" component={Modals}/>
                <Route path="/components/social-buttons" name="Social Buttons" component={SocialButtons}/>
                <Route path="/components/switches" name="Swithces" component={Switches}/>
                <Route path="/components/tables" name="Tables" component={Tables}/>
                <Route path="/components/tabs" name="Tabs" component={Tabs}/>
                <Route path="/icons/font-awesome" name="Font Awesome" component={FontAwesome}/>
                <Route path="/icons/simple-line-icons" name="Simple Line Icons" component={SimpleLineIcons}/>
                <Route path="/widgets" name="Widgets" component={Widgets}/>
                <Route path="/charts" name="Charts" component={Charts}/>
                <Redirect from="/" to="/mythings"/>
              </Switch>
            </div>
          </main>
        </div>
        <Footer />
        <ErrorModal/>
      </div>
    );
  }
}

export default withRouter(
  connect()(Full)//we use connect to get dispatch into props
);
