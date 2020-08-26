import React, { useEffect, useState } from 'react';
import { ListGroup } from 'reactstrap';
import Member from './Member';
import Intent from './Intent';
import { styles } from './styles';

const CommunitiesApp = (props) => {
  const [ members, setMembers ] = useState([]);
  const [ intents, setIntents ] = useState([]);

  const fetchMembers = () => {
    props.manifoldQuery({
      rid: 'io.picolabs.community',
      funcName: 'getCommunityMembers'
    }).then((resp) => {
      setMembers(resp.data);
    });
  };

  const fetchIntents = () => {
    props.manifoldQuery({
      rid: 'io.picolabs.community',
      funcName: 'getPublishedIntents'
    }).then((resp) => {
      setIntents(resp.data);
    })
  }

  useEffect(() => {
    fetchMembers();
    fetchIntents();
    }, []);

  const listMembers = () => {
    return members.map((x, i) => {
      return (
        <Member name={x.name} icon={x.icon} id={x.picoID} key={i} fetchMembers={fetchMembers} fetchIntents={fetchIntents} commDID={props.DID} />
      )
    })
  }

  const listIntents = () => {
    return intents.map((x, i) => {
      return (
        <Intent key={i} intent={x} signalEvent={props.signalEvent} />
      )
    })
  }

  return (
    <div className="shortenedWidth">
      <ListGroup>
        <div>
          {members.length > 0 && <div style={styles.title} >Community Members:</div>}
          {members.length === 0 && <div>This community has no members</div>}
          {listMembers()}
        </div>
        <div>
          {intents.length > 0 && <div style={{...styles.title, ...styles.upperMargin}}>Events:</div>}
          {listIntents()}
        </div>
      </ListGroup>
    </div>
  );
}

export default CommunitiesApp;
/*
{
  funcArgs: {
    key1: value1 //put key value argument pairings here
  }, OPTIONAL
  rid: <string>,
  funcName: <string>
}
*/
