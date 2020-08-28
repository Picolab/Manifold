import React from 'react';
import { Button } from 'reactstrap'

const Switch = ({active, setActive}) => {
  return (
    <div>
      <Button style={active ? activeButton : inactiveButton} onClick={() => setActive(true)}>Add</Button>
      <Button style={!active ? activeButton : inactiveButton} onClick={() => setActive(false)}>Move</Button>
    </div>
  );
}

const inactiveButton = {
  backgroundColor: '#aaa9a8',
  paddingTop: 3,
  paddingBottom: 3,
  paddingLeft: 5,
  paddingRight: 5
}

const activeButton = {
  paddingTop: 5,
  paddingBottom: 5,
  paddingLeft: 5,
  paddingRight: 5
}

export default Switch;
