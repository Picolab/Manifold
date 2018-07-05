import React, { Component } from 'react';
import { connect } from 'react-redux';
//import PropTypes from 'prop-types';
import './CardAppView.css';

class CardAppView extends Component {
  render(){
    return (
      <div>
        test app view
      </div>
    );
  }
}

CardAppView.propTypes = {
}

const mapStateToProps = (state, ownProps) => {
  return {}
}


export default connect(mapStateToProps)(CardAppView);
