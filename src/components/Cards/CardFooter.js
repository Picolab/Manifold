import React, { Component} from 'react';
import FooterItem from './FooterItem';
import PropTypes from 'prop-types';

class CardFooter extends Component{
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
        <FooterItem
          onDotClick={this.handleDotClick}
          key={i}
          index={i}
          currentApp={this.props.currentApp}
          allApps={this.props.allApps}
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

CardFooter.propTypes = {
  dotClicked: PropTypes.func.isRequired,
  totalApps: PropTypes.number.isRequired,
  currentApp: PropTypes.number.isRequired
}

export default CardFooter;
