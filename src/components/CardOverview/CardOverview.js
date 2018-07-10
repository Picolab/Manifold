import React, { Component } from 'react';
import { connect } from 'react-redux';
//import PropTypes from 'prop-types';
import { Button, UncontrolledTooltip } from 'reactstrap';
import AppList from './AppList';
import './CardOverview.css';

class CardOverview extends Component {
  render(){
    return (
      <div>
        <h1 className="centered">Test</h1>
        <h3 className="overviewHeader">Apps</h3>
        <Button id="appAdd" className="appAddButton" color="primary" size="sm">+</Button>
        <UncontrolledTooltip placement="bottom" delay={300} target="appAdd">
          Install An App
        </UncontrolledTooltip>
        <hr className="overviewUnderline"></hr>
        <AppList picoID={this.props.match.params.picoID}/>
      </div>
    );
  }
}

CardOverview.propTypes = {
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}


export default connect(mapStateToProps)(CardOverview);
