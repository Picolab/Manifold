import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { UncontrolledTooltip } from 'reactstrap';
import { Link } from 'react-router-dom';
import './Buttons.css';

class OpenCardButton extends Component {
  constructor(props) {
    super(props);
    let params = (window.location.href.indexOf('?') !== -1) ? window.location.href.slice(window.location.href.indexOf('?')) : "";
    this.state = {
      params
    }
  }

  render() {
    const viewMoreID = "ViewThing" + this.props.picoID;
    return(
      <div className="inline">
        <Link to={"/mythings/" + this.props.picoID + "/" + this.props.rid + this.state.params}>
          <i id={viewMoreID} className="fa fa-sign-in float-right fa-lg manifoldDropdown" />
        </Link>
        <UncontrolledTooltip placement="bottom" delay={300} target={viewMoreID}>
          Open Card
        </UncontrolledTooltip>
      </div>
    );
  }
}

OpenCardButton.propTypes = {
  picoID: PropTypes.string.isRequired
}


export default OpenCardButton;
