import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import TutorialModal from '../Modals/TutorialModal';

class Sidebar extends Component {

  constructor(props){
    super(props);

    console.log("SIDEBAR PROPS: ", this.props);

    this.state = {
      tutorialOpen : false
    }

    this.toggleTutorial = this.toggleTutorial.bind(this);
    this.helpClick = this.helpClick.bind(this);
  }

  toggleTutorial() {
    this.setState({
      tutorialOpen : !this.state.tutorialOpen
    })
  }

  handleClick(e) {
    e.preventDefault();
    e.target.parentElement.classList.toggle('open');
  }

  activeRoute(routeName) {
    if(this.props.location)//oauth redirect causes this to be null
      return this.props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';
    return 'nav-item nav-dropdown'
  }

  // secondLevelActive(routeName) {
  //   return this.props.location.pathname.indexOf(routeName) > -1 ? "nav nav-second-level collapse in" : "nav nav-second-level collapse";
  // }
  closeSidebar() {
    //this one toggles desktop version: document.body.classList.toggle('sidebar-hidden');
    document.body.classList.toggle('sidebar-mobile-show');
  }

  helpClick(e){
    e.preventDefault();
    this.closeSidebar();
    this.toggleTutorial();
  }

  render() {
    return (
      <div className="sidebar">
        <nav className="sidebar-nav">
          <ul className="nav">
            <li className="nav-item">
              {/*<NavLink to={'/dashboard'} className="nav-link" activeClassName="active"><i className="icon-speedometer"></i> Dashboard </NavLink>*/}
              <NavLink to={'/mythings'} className="nav-link" activeClassName="active"><div onClick={this.closeSidebar}><i className="fa fa-home"></i>My Things </div></NavLink>
              {/*<NavLink to={'/communities'} className="nav-link" activeClassName="active"><i className="fa fa-users"></i>Communities <span className="badge badge-info">NEW</span></NavLink>*/}
            </li>
            <li className="nav-item">
              <NavLink to={'/feedback'} className="nav-link" activeClassName="active"><div onClick={this.closeSidebar}><i className="fa fa-envelope"></i>Feedback </div></NavLink>
            </li>
            <li className="nav-item">
              <NavLink to={'/privacy'} className="nav-link" activeClassName="active"><div onClick={this.closeSidebar}><i className="fa fa-lock"></i>Privacy Policy </div></NavLink>
            </li>
            <li className="nav-item">
              <div onClick={this.helpClick} className="nav-link"><i className="fa fa-info-circle"></i>Tutorial </div>
              <TutorialModal modalOn={this.state.tutorialOpen} toggleFunc={this.toggleTutorial} />
            </li>
            {/*<li className="nav-title">
              UI Elements
            </li>
            <li className={this.activeRoute("/components")}>
              <a className="nav-link nav-dropdown-toggle" href="/" onClick={this.handleClick.bind(this)}><i className="icon-puzzle"></i> Components</a>
              <ul className="nav-dropdown-items">
                <li className="nav-item">
                  <NavLink to={'/components/buttons'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Buttons</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/components/social-buttons'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Social Buttons</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/components/cards'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Cards</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/components/forms'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Forms</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/components/modals'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Modals</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/components/switches'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Switches</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/components/tables'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Tables</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/components/tabs'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Tabs</NavLink>
                </li>
              </ul>
            </li>
            <li className={this.activeRoute("/icons")}>
              <a className="nav-link nav-dropdown-toggle" href="/" onClick={this.handleClick.bind(this)}><i className="icon-star"></i> Icons</a>
              <ul className="nav-dropdown-items">
                <li className="nav-item">
                  <NavLink to={'/icons/font-awesome'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Font Awesome</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/icons/simple-line-icons'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Simple Line Icons</NavLink>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <NavLink to={'/widgets'} className="nav-link" activeClassName="active"><i className="icon-calculator"></i> Widgets <span className="badge badge-info">NEW</span></NavLink>
            </li>
            <li className="nav-item">
              <NavLink to={'/charts'} className="nav-link" activeClassName="active"><i className="icon-pie-chart"></i> Charts</NavLink>
            </li>
            <li className="divider"></li>
            <li className="nav-title">
              Extras
            </li>
            <li className="nav-item nav-dropdown">
              <a className="nav-link nav-dropdown-toggle" href="/" onClick={this.handleClick.bind(this)}><i className="icon-star"></i> Pages</a>
              <ul className="nav-dropdown-items">
                <li className="nav-item">
                  <NavLink to={'/login'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Login</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/register'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Register</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/404'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Error 404</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/500'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Error 500</NavLink>
                </li>
              </ul>
            </li>*/}
          </ul>
        </nav>
      </div>
    )
  }
}

export default Sidebar;
