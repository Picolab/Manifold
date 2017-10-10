import React from 'react';
import TestForm from '../views/MyThings/testForm';

const CardReplace = function(domNode){
  if(domNode.name === 'testform'){//everything is lowercased when returned
    console.log("CHECK THIS", domNode);
    return <TestForm />
  }
}

export default CardReplace;
