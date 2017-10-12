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
    if(attrs.charttype, attrs.data, attrs.options, attrs.graph_id, attrs.width, attrs.height){
      const stringToParse = attrs.data.replace(/'/g, "\"");
      console.log("string to parse:", stringToParse);
      const dataArray = JSON.parse(stringToParse);
      console.log("dataArray", dataArray);
      //const options = JSON.parse(attrs.options);
      return (
        <Chart chartType={attrs.charttype}
                data={dataArray}
                options={{}}
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
