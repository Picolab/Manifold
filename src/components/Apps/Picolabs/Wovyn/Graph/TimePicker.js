import React from 'react'
import { Button, ButtonGroup } from 'reactstrap'

const TimePicker = (props) => {
    return (
        <div>
            <ButtonGroup>
                <Button onClick={e => {console.log("Clicked week")}}>Week</Button>
                <Button>Month</Button>
                <Button>Year</Button>
            </ButtonGroup>
        </div>
    )
}

export default TimePicker