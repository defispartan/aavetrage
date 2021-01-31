import React from 'react';
import { Table } from 'reactstrap';

const RateTable = (props) => {
    let rates = props.rates
    return (
        <Table dark striped bordered hover>
            <thead>
                <tr>
                    <th></th>
                    <th colSpan="3">AAVE V1 Market</th>
                    <th colSpan="3">AAVE V2 Market</th>

                </tr>
                <tr>
                    <th></th>
                    <th>Deposit</th>
                    <th colSpan="2">Borrow</th>
                    <th>Deposit</th>
                    <th colSpan="2">Borrow</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">USDC</th>
                    <td className="variable">{rates.usdc[0][0]} %</td>
                    <td className="variable">{rates.usdc[0][1]} %</td>
                    <td className="stable">{rates.usdc[0][2]} %</td>
                    <td className="variable">{rates.usdc[1][0]} %</td>
                    <td className="variable">{rates.usdc[1][1]} %</td>
                    <td className="stable">{rates.usdc[1][2]} %</td>
                </tr>
                <tr>
                    <th scope="row">USDT</th>
                    <td className="variable">{rates.usdt[0][0]} %</td>
                    <td className="variable">{rates.usdt[0][1]} %</td>
                    <td className="stable">{rates.usdt[0][2]} %</td>
                    <td className="variable">{rates.usdt[1][0]} %</td>
                    <td className="variable">{rates.usdt[1][1]} %</td>
                    <td className="stable">{rates.usdt[1][2]} %</td>

                </tr>
                <tr>
                    <th scope="row">DAI</th>
                    <td className="variable">{rates.dai[0][0]} %</td>
                    <td className="variable">{rates.dai[0][1]} %</td>
                    <td className="stable">{rates.dai[0][2]} %</td>
                    <td className="variable">{rates.dai[1][0]} %</td>
                    <td className="variable">{rates.dai[1][1]} %</td>
                    <td className="stable">{rates.dai[1][2]} %</td>

                </tr>
                <tr>
                    <th scope="row">TUSD</th>
                    <td className="variable">{rates.tusd[0][0]} %</td>
                    <td className="variable">{rates.tusd[0][1]} %</td>
                    <td className="stable">{rates.tusd[0][2]} %</td>
                    <td className="variable">{rates.tusd[1][0]} %</td>
                    <td className="variable">{rates.tusd[1][1]} %</td>
                    <td className="stable">{rates.tusd[1][2]} %</td>

                </tr>
                <tr>
                    <th scope="row">sUSD</th>
                    <td className="variable">{rates.susd[0][0]} %</td>
                    <td className="variable">{rates.susd[0][1]} %</td>
                    <td className="stable">{rates.susd[0][2]} %</td>
                    <td className="variable">{rates.susd[1][0]} %</td>
                    <td className="variable">{rates.susd[1][1]} %</td>
                    <td className="stable">-</td>

                </tr>
                <tr>
                    <th scope="row">BUSD</th>
                    <td className="variable">{rates.busd[0][0]} %</td>
                    <td className="variable">{rates.busd[0][1]} %</td>
                    <td className="stable">{rates.busd[0][2]} %</td>
                    <td className="variable">{rates.busd[1][0]} %</td>
                    <td className="variable">{rates.busd[1][1]} %</td>
                    <td className="stable">-</td>

                </tr>
                <tr>
                    <th scope="row">GUSD</th>
                    <td className="variable">-</td>
                    <td className="variable">-</td>
                    <td className="stable">-</td>
                    <td className="variable">{rates.gusd[1][0]} %</td>
                    <td className="variable">{rates.gusd[1][1]} %</td>
                    <td className="stable">{rates.gusd[1][2]} %</td>

                </tr>
            </tbody>
        </Table>
    )
}

export default RateTable;