import React from 'react';
import { Input } from 'reactstrap';
import icon from '../D&D.png';

class Other extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      image: icon,
      name: "",
      descripton: ""
    };
    this.setImage = this.setImage.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  setImage(image) {
    this.setState({
      image: image
    })
  }

  toBase64(file) {
     var reader = new FileReader();
     reader.readAsDataURL(file);
     reader.onload = () => { this.props.buildCharacter("image",reader.result); }
     reader.onerror = function (error) {
       console.log('Error: ', error);
     };
  }

  async handleChange(event) {
    let image = URL.createObjectURL(event.target.files[0])
    this.setImage(image);
    await this.toBase64(event.target.files[0])
  }

  onChange(event) {
    let id = event.target.id;
    let value = event.target.value;

    this.setState({
      [id]: value
    })

    this.props.buildCharacter(id, value);
  }

  render() {
    return(
      <div>
        <div className="otherContainer">
          <img src={this.state.image} alt="Smiley Face" className="imagePreview" />
          <input type="file" name="photo" id="upload-photo" accept="image/*" onChange={this.handleChange} className="imageInput"/>
        </div>
        <div for="bane">Name: </div>
        <input type="text" name="name" id="name" placeholder="Character Name" value={this.state.name} onChange={this.onChange} />
        <div className="descriptionHeader">
          <div for="descripton">Descripton: </div>
          <div>{this.state.descripton.length}/300</div>
        </div>
        <Input type="textarea" name="descripton" id="descripton" maxlength="300" placeholder="Add a description for your character." value={this.state.descripton} onChange={this.onChange}/>
      </div>
    )
  }

}
export default Other;
