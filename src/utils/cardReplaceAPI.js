import React from 'react';
import TestForm from '../views/MyThings/testForm';
import { Chart } from 'react-google-charts';
import domToReact from 'html-react-parser/lib/dom-to-react';

const CardReplace = function(domNode){
  console.log("Another check!!", domNode);
  if(domNode.name === 'testform'){//everything is lowercased when returned
    return <TestForm />
  }else if(domNode.name === 'chart'){
    const attrs = domNode.attribs;
    console.log("attrs", attrs);
    if(attrs.charttype, attrs.data, attrs.options, attrs.graph_id, attrs.width, attrs.height){
      return (
        <Chart chartType={attrs.charttype}
                data={[['Age', 'Weight'], [8, 12], [4, 5.5]]}
                options={attrs.options}
                graph_id={attrs.graph_id}
                width={attrs.width}
                height={attrs.height}>

        </Chart>
      )
    }else{
      return (
        <div>FAILURE DECODING CHART COMPONENT!</div>
      )
    }
  }
}

export default CardReplace;
