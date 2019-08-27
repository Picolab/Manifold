import React from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import './TagPage.css';

class PicoTagPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tagId: "",
      validated: false,
      isValid: false,
      redirect: false
    };
  }

  handleChange = (event) => {
    var { value, id } = event.target;
    value = value.toUpperCase();

    this.setState({
      [id]: value
    });
  }
  handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    this.setState({ validated: true })
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }

    this.setState({ isValid: true, redirect: true });
    window.location.href=`http://tag.picolabs.io/${this.state.tagId}`
  }
  render() {
    return (
      <div className="TagPage">
        <Form
          noValidate
          validated={this.state.validated.toString()}
          onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="tagId" size="lg">Enter A Tag ID</Label>
            <Input
              required
              type="text"
              name="tagId"
              id="tagId"
              size="lg"
              value={this.state.tagId}
              onChange={this.handleChange}
              placeholder="ABC123"
              pattern="[a-zA-Z0-9]*"/>
            {this.state.validated && !this.state.isValid &&
              <div className="form-feedback invalid">
                Please enter a valid tag ID
              </div>}
          </FormGroup>
          <Button block color="primary" type="submit" size="lg">
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

export default PicoTagPage;
