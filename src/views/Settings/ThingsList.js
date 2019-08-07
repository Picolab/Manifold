import React, { Component } from 'react';
import { ListGroup } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ListThing from './ListThing';
import './ThingsList.css';

class ThingsList extends Component {

  displayList() {
    let list = [];

    this.props.idList.forEach((picoID) => {
      list.push(
        <ListThing key={picoID} picoID={picoID}/>
      )
    });

    return list;
  }

  render() {
    return (
      <ListGroup className="list-padding">
        {this.displayList()}
      </ListGroup>
    );
  }
}

ThingsList.propTypes = {
  idList: PropTypes.array.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {

  }
}

export default connect(mapStateToProps)(ThingsList);
