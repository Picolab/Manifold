import React, { Component } from 'react';
//import PropTypes from 'prop-types';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

export class SafeAndMineApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      phone: "",
      message: ""
    }

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    console.log(this.state.bob);
    //get state
    //make api/event call
  }

  onChange(stateKey) {
    return (event) => {
      this.setState({
        [stateKey]: event.target.value
      })
    }
  }

  render() {
    return(
      <div>
        <h1>Safe and Mine</h1>
        <p>Use safe and mine to help find lost things! Attach a tag to anything you want to keep safe. If you lose that item and someone scans the tag, they will see a custom message just from you. Below is a preview of what your message looks like. You can modify this message below.</p>

        {/*add preview*/}

        <Form onSubmit={this.onSubmit} >
          <FormGroup>
            <Label for="Name">Your Name</Label>
            <Input type="text" name="name" id="Name" placeholder="Brigham Young" value={this.state.name} onChange={this.onChange('name')} />
          </FormGroup>
          <FormGroup>
            <Label for="Email">Email</Label>
            <Input type="text" name="email" id="Email" placeholder="brigham.young@byu.edu" value={this.state.email} onChange={this.onChange('email')} />
          </FormGroup>
          <FormGroup>
            <Label for="Phone">Phone</Label>
            <Input type="text" name="phone" id="Phone" placeholder="801-123-4567" value={this.state.phone} onChange={this.onChange('phone')} />
          </FormGroup>
          <Button>Save</Button>
        </Form>



      </div>
    )
  }
}

SafeAndMineApp.propTypes = {
}

export default SafeAndMineApp;
