import React, { Component} from 'react';
import FooterItem from './FooterItem';
import PropTypes from 'prop-types';

class CardFooter extends Component{
  constructor(props){
    super(props);

    this.handleDotClick = this.handleDotClick.bind(this);
  }

  componentDidMount() {
    if (this.props.cardType === 'Community') {
      console.log(this.props.allApps);
    }
  }

  handleDotClick(index) {
    this.props.dotClicked(index);
  }

  renderFooterApps() {
    let footers = [];
    for(let i = 0; i < this.props.totalApps; i++){
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
        {this.renderFooterApps()}
      </span>
    );
  }
}

CardFooter.propTypes = {
  picoID: PropTypes.string.isRequired,
  cardType: PropTypes.string.isRequired,
  dotClicked: PropTypes.func.isRequired,
  totalApps: PropTypes.number.isRequired,
  currentApp: PropTypes.number.isRequired
}

export default CardFooter;
