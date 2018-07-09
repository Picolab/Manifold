import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import lockIcon from '../AppIcons/lock.png';
import { Media, UncontrolledTooltip } from 'reactstrap';
import './CardOverview.css';

class AppList extends Component {
  constructor(props) {
    super(props);

    this.handleIconClick = this.handleIconClick.bind(this);
  }

  handleIconClick() {
    console.log("You clicked an icon! Congratulations!");
  }

  renderIcons() {
    let icons = [];
    //loop through an array of installed apps
    icons.push(
      <div key="testing">
        <Media className="appIcon" id="testTooltip" object src={lockIcon} alt="App Icon" onClick={this.handleIconClick}/>
        <UncontrolledTooltip placement="bottom" delay={300} target="testTooltip">
          Safe and Mine
        </UncontrolledTooltip>
      </div>
    )
    return icons
  }

  render(){
    return (
      <div className="appListContainer">
        {this.renderIcons()}
      </div>
    );
  }
}

//pass in an array of apps that meet a certain criteria in order to display everything.
//This could be passed in from the parent, or better yet, from the redux store
AppList.propTypes = {
  //picoID: PropTypes.string.isRequired,
  //apps: PropTypes.array.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {}
}


export default connect(mapStateToProps)(AppList);
