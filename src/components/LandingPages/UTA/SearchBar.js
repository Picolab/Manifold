import React, { Component } from 'react';
import { Button } from 'reactstrap';

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = { input: '' };
  }

  render() {
    return (
      <div className="search-bar">
        <input className="Bar" value={this.state.input} onChange={(e) => {this.setState({input: e.target.value})}} />
        <Button className="Button" variant="contained"  type="button" onClick={(e) => {
          e.preventDefault();
          this.props.search(this.state.input);
        }}>Search</Button>
      </div>
    );
  }
}

export default SearchBar;
