import React, { Component} from 'react';
import Autosuggest from 'react-autosuggest';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupDropdown,
  Input,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
 } from 'reactstrap';

class ManifoldSearch extends React.Component {
  constructor() {
    super();
    this.toggleDropDown = this.toggleDropDown.bind(this);
       this.toggleSplit = this.toggleSplit.bind(this);
       this.clearSearch = this.clearSearch.bind(this);
       this.searchOptions = this.searchOptions.bind(this);
       this.state = {
         dropdownOpen: false,
         splitButtonOpen: false,
         value: '',
         suggestions: [],
       };
  }

  clearSearch(){
    this.setState({
      value: ''
    });
    this.props.searchsuggestionClicked('');
  }

  searchOptions(){
    this.props.searchOptionsClicked();
  }

  toggleDropDown() {
   this.setState({
     dropdownOpen: !this.state.dropdownOpen
   });
 }

 toggleSplit() {
   this.setState({
     splitButtonOpen: !this.state.splitButtonOpen
   });
 }

  getSuggestions = value => {
    if (typeof this.props.searchContent != "undefined") {
      if (this.props.searchContent.length > 0){
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] : this.props.searchContent.filter(searchContent =>
          searchContent.toLowerCase().slice(0, inputLength) === inputValue
        );
      }
    }
  };

  onSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    //push up the suggestion so that the MyThings page can update the cards
    this.props.searchsuggestionClicked(suggestion)
  }

  getSuggestionValue = suggestion => suggestion;

  renderInputComponent = inputProps => (

    <InputGroup>
      <Input {...inputProps}/>
      <InputGroupAddon addonType="append">
        <Button onClick={this.searchOptions}><i className="fa fa-navicon"></i></Button>
        <Button onClick={this.clearSearch}><i className="fa fa-times-circle"></i></Button>
      </InputGroupAddon>
    </InputGroup>
  );

  //// Once we are sending in a robust JSON with different kinds of search content we can check by a tag for each pico/community
  //// what kind of object it is and give it an appropriate icon
  renderSuggestion = suggestion => (
    <div>
      <i className="fa fa-bomb float-left fa-lg" />  {suggestion}
    </div>
  );

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;

    const inputProps = {
      placeholder: 'Enter a Pico or Community Name',
      value,
      onChange: this.onChange
    };

    return (
      <div>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionSelected={this.onSuggestionSelected}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
          renderInputComponent={this.renderInputComponent}
        />
    </div>
    );
  }
}

export default ManifoldSearch;
