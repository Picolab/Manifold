import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class CameraModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    // this.cameraAccess()
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  cameraAccess() {
    // this.toggle();
    // const constraints = {
    //   video: true
    // };
    //
    // const video = document.querySelector('video');
    //
    // navigator.mediaDevices.getUserMedia(constraints).
    // then((stream) => {video.srcObject = stream});
    window.onload = function() {

  // Normalize the various vendor prefixed versions of getUserMedia.
  navigator.getUserMedia = (navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.msGetUserMedia);

                            if (navigator.getUserMedia) {
                                                  // Request the camera.
                                navigator.getUserMedia({
                                  video: true
                                },
                                function(localMediaStream) {
                                  // Get a reference to the video element on the page.
var vid = document.getElementById('camera-stream');

// Create an object URL for the video stream and use this
// to set the video source.
vid.srcObject = localMediaStream;
                                },
                                // Error Callback
                                function(err) {
                                                      // Log the error to the console.
                                  console.log('The following error occurred when trying to use getUserMedia: ' + err);
                                  }
                                );

                              } else {
                              alert('Sorry, your browser does not support getUserMedia');
                            }
                          }


  }


  render() {
    return (
      <div>
        <Button color="danger" onClick={this.toggle}>Scan</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
          <ModalBody>
          <div id="video-container">
    <video id="camera-stream" width="500" autoplay></video>
  </div>
  {this.cameraAccess()}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggle}>Do Something</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default CameraModal;
