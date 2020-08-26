import React from 'react';
import { ListGroupItem } from 'reactstrap';
import { removeFromCommunity } from '../../../../utils/manifoldSDK';
import { styles } from './styles'

const Member = ({ name, icon, id, commDID, fetchMembers, fetchIntents }) => {
  const removeMember = () => {
    removeFromCommunity(commDID, id).then((resp) => {
      fetchMembers();
      fetchIntents();
    });
  }

  return (
    <div>
      <ListGroupItem>
          <div style={styles.sidebyside}><img style={styles.icon} src={icon} alt={'member icon'} /></div>
          <div style={styles.sidebyside}>{name}</div>
          <i id={"delete" + name} className="fa fa-minus float-right fa-lg manifoldDropdown" onClick={removeMember}/>
      </ListGroupItem>
    </div>
  );
}

export default Member;
