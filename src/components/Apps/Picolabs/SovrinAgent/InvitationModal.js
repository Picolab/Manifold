import React from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter, Button, Table} from 'reactstrap';

class InvitationModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false
    };
    this.modalToggle = this.modalToggle.bind(this);
  }
  componentDidMount() {
  }

  modalToggle() {
    console.log("toggle", "I was hit");
   this.setState(prevState => ({
     modal: !prevState.modal
   }));
  }

  render() {
    return (
      <div>
        <Button className="inviteItem" onClick={this.modalToggle}>{this.props.buttonLabel}</Button>
        <Modal size="lg" isOpen={this.state.modal} toggle={this.modalToggle} className={this.props.className}>
          <ModalHeader toggle={this.modalToggle}>Invite from {this.props.buttonLabel}</ModalHeader>
          <ModalBody>
          <Table>
             <thead>
               <tr>
                 <th>#</th>
                 <th>Title</th>
                 <th>Status</th>
                 <th>History</th>
                 <th>Actions</th>
               </tr>
             </thead>
             <tbody>
               <tr>
                 <th scope="row">1</th>
                 <td>Join our Club!</td>
                 <td>Pending</td>
                 <td>Received</td>
                 <td>
                  <button className="btn-success"> Accept </button>{' '}
                  <button className="btn-danger"> Reject </button>
                 </td>
               </tr>
             </tbody>
           </Table>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.modalToggle}>Do Something</Button>{' '}
            <Button color="secondary" onClick={this.modalToggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
export default InvitationModal;
