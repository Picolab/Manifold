import React, { Component } from 'react';
import {Button, NavLink} from 'reactstrap';

//const brandPrimary =  '#20a8d8';
//const brandSuccess =  '#4dbd74';
//const brandInfo =     '#63c2de';
//const brandDanger =   '#f86c6b';

class Feedback extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    
  render(){
    return (
        <div style={{"maxWidth":"550px"}}>
            <h1> Feedback</h1>
            <hr className="my-2" style={{"paddingBottom":"5px"}}/>
            <h2> Give us feedback on Manifold </h2>
            <p style={{"fontSize":"large"}}>
                What do you think about Manifold so far? Hate it? Love it? Our goal with Manifold is to help you manage your stuff. If there's anything stopping you from doing that, or if you think of any good ideas, let us know! Questions are also welcome.
            </p>
            <Button href="mailto:picolabsbyu@gmail.com" size="lg" block>
                Email Us!
            </Button>
            <p style={{"fontSize":"medium", "paddingTop":"5px"}}>
                Not working? Email us directly at: picolabsbyu@gmail.com
            </p>
        </div>
    );
  }
}

export default Feedback;