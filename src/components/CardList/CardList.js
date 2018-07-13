import React, { Component } from 'react';
import { ListGroup } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ListItem from './ListItem';
import './List.css';

class CardList extends Component {

  displayList() {
    let list = [];

    this.props.idList.forEach((picoID) => {
      list.push(
        <ListItem key={"ListItem" + this.props.picoID} picoID={picoID}/>
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

CardList.propTypes = {
  idList: PropTypes.array.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {

  }
}

export default connect(mapStateToProps)(CardList);
