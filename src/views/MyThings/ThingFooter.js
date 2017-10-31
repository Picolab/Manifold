import React, { Component} from 'react';
import ThingFooterItem from './ThingFooterItem';

class ThingFooter extends Component{
  handleDotClick(title){
    this.props.dotClicked(title);
  }

  render(){
    let footerItems;
    if(this.props.installedApps){
      footerItems = this.props.installedApps.map(app => {
        return(
          <ThingFooterItem onDotClick={this.handleDotClick.bind(this)} key={app.title} app={app}/>
        );
      });
    }


    return(
      <div className="card-footer" style={{overflow:"hidden",  textAlign: "center"}}>
        <span>
          {footerItems}
        </span>
      </div>
    );
  }
}

export default ThingFooter;
