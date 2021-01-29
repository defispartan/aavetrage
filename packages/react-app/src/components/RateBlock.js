import React from "react";
import { Card, CardText, CardBody, CardTitle, CardSubtitle } from "reactstrap"

const RateBlock = (props) => {
    return (<Card>
        <CardBody>
            <CardTitle tag="h5">AAVE V2 Market</CardTitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted">USDC</CardSubtitle>
            <CardText>        <p className='rbtext'>3.16% Variable</p> </CardText>
        </CardBody>

    </Card>)
}

export default RateBlock

