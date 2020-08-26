import React, { useState } from 'react';
import { Collapse, Input, ListGroupItem, Button } from 'reactstrap';
import { styles } from './styles';

const Intent = ({ intent, signalEvent }) => {
  const [ isOpened, toggleOpen ] = useState(false);
  const [ attrs, setAttrs ] = useState({});

  const getAttrs = () => {
    return intent.attrs.map((x, i) => {
      return (
        <div key={x+i}>
          <div style={styles.attr}>{x}:</div>
          <Input type="text" name={x} id={x} placeholder={x} value={attrs[x]} onChange={(e) => {
            console.log("attrs", attrs)
            let newVal = e.target.value;
            let newAttrs = attrs;
            newAttrs[x] = newVal
            setAttrs(newAttrs)}
          } />
        </div>
      );
    });
  };

  const raiseEvent = () => {
    signalEvent({
      domain: 'community',
      type: 'request_promise',
      attrs: { ...attrs, domain: intent.domain, type: intent.type }
    }).then(() => {
      toggleOpen(!isOpened);
    });
  }

  return (
    <div>
      <ListGroupItem>
        <div onClick={() => {toggleOpen(!isOpened)}}>
          <div style={styles.sidebyside}><b>Domain: </b>{intent.domain}</div><div style={styles.sidebyside}><b>Type: </b>{intent.type}</div>
        </div>
        <Collapse isOpen={isOpened}>
          <div>{getAttrs()}</div>
          <Button style={styles.button} color="primary" onClick={raiseEvent}>Raise Event</Button>
        </Collapse>
      </ListGroupItem>
    </div>
  );
}

export default Intent;
