import React, { Component} from 'react';
import ThingFooterItem from './ThingFooterItem';
import PropTypes from 'prop-types';

class ThingFooter extends Component{
  constructor(props){
    super(props);

    this.handleDotClick = this.handleDotClick.bind(this);
  }

  handleDotClick(index) {
    this.props.dotClicked(index);
  }

  renderFooterItems() {
    let footers = [];
    for(var i = 0; i < this.props.totalApps; i++){
      footers.push(
        <ThingFooterItem
          onDotClick={this.handleDotClick}
          key={i}
          index={i}
          currentApp={this.props.currentApp}
        />
      )
    }
    return footers;
  }

  render(){
    return(
      <span>
        {this.renderFooterItems()}
      </span>
    );
  }
}

ThingFooter.propTypes = {
  dotClicked: PropTypes.func.isRequired,
  totalApps: PropTypes.number.isRequired,
  currentApp: PropTypes.number.isRequired
}

export default ThingFooter;
