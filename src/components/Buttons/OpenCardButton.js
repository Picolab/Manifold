import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { UncontrolledTooltip } from 'reactstrap';
import { Link } from 'react-router-dom';
import './Buttons.css';

class OpenCardButton extends Component {
  render() {
    const viewMoreID = "ViewThing" + this.props.picoID;
    return(
      <div className="inline">
        <Link to={"/mythings/" + this.props.picoID}>
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
