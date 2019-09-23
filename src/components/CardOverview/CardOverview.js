import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import InstallModal from '../Modals/InstallModal';
import AppList from './AppList';

import { getName } from '../../reducers';
import './CardOverview.css';

class CardOverview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      installOpen: false
    }
    this.handleClick = this.handleClick.bind(this);
    this.toggleInstall = this.toggleInstall.bind(this);
  }

  handleClick() {
    this.toggleInstall();
  }

  toggleInstall() {
    this.setState({
      installOpen: !this.state.installOpen
    })
  }

  render() {
    return (
      <div>
        <h1 className="centered">
          {this.props.name ? this.props.name : "Loading..."}
        </h1>
        <h3 className="overviewHeader">Apps</h3>
        <Button id="appAdd" className="appAddButton" color="primary" size="sm" onClick={this.handleClick}><i className="fa fa-plus-circle"></i>{' '}Install an App</Button>
        <InstallModal modalOn={this.state.installOpen} toggleFunc={this.toggleInstall} picoID={this.props.picoID}/>
        <hr className="overviewUnderline"></hr>
        <AppList picoID={this.props.picoID}/>
      </div>
    );
  }
}

CardOverview.propTypes = {
  picoID: PropTypes.string.isRequired,
  name: PropTypes.string
}

const mapStateToProps = (state, ownProps) => {
  const picoID = ownProps.match.params.picoID;
  return {
    picoID,
    name: getName(state, picoID)
  }
}


export default connect(mapStateToProps)(CardOverview);
