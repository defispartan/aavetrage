import React from 'react';
import { Table } from 'reactstrap';

const RateTable = () => {
    return (
        <Table dark striped bordered hover>
            <thead>
                <tr>
                    <th></th>
                    <th colspan="3">AAVE V1 Market</th>
                    <th colspan="3">AAVE V2 Market</th>

                </tr>
                <tr>
                    <th></th>
                    <th>Deposit</th>
                    <th colspan="2">Borrow</th>
                    <th>Deposit</th>
                    <th colspan="2">Borrow</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">USDC</th>
                    <td className="variable">1.00 %</td>
                    <td className="variable">1.00 %</td>
                    <td className="stable">1.00 %</td>
                    <td className="variable">1.00 %</td>
                    <td className="variable">1.00 %</td>
                    <td className="stable">1.00 %</td>
                </tr>
                <tr>
                    <th scope="row">USDT</th>
                    <td className="variable">1.00 %</td>
                    <td className="variable">1.00 %</td>
                    <td className="stable">1.00 %</td>
                    <td className="variable">1.00 %</td>
                    <td className="variable">1.00 %</td>
                    <td className="stable">1.00 %</td>

                </tr>
                <tr>
                    <th scope="row">DAI</th>
                    <td className="variable">1.00 %</td>
                    <td className="variable">1.00 %</td>
                    <td className="stable">1.00 %</td>
                    <td className="variable">1.00 %</td>
                    <td className="variable">1.00 %</td>
                    <td className="stable">1.00 %</td>

                </tr>
                <tr>
                    <th scope="row">TUSD</th>
                    <td className="variable">1.00 %</td>
                    <td className="variable">1.00 %</td>
                    <td className="stable">1.00 %</td>
                    <td className="variable">1.00 %</td>
                    <td className="variable">1.00 %</td>
                    <td className="stable">1.00 %</td>

                </tr>
                <tr>
                    <th scope="row">sUSD</th>
                    <td className="variable">1.00 %</td>
                    <td className="variable">1.00 %</td>
                    <td className="stable">1.00 %</td>
                    <td className="variable">1.00 %</td>
                    <td className="variable">1.00 %</td>
                    <td className="stable">1.00 %</td>

                </tr>
                <tr>
                    <th scope="row">BUSD</th>
                    <td className="variable">1.00 %</td>
                    <td className="variable">1.00 %</td>
                    <td className="stable">1.00 %</td>
                    <td className="variable">1.00 %</td>
                    <td className="variable">1.00 %</td>
                    <td className="stable">1.00 %</td>

                </tr>
                <tr>
                    <th scope="row">GUSD</th>
                    <td className="variable">1.00 %</td>
                    <td className="variable">1.00 %</td>
                    <td className="stable">1.00 %</td>
                    <td className="variable">1.00 %</td>
                    <td className="variable">1.00 %</td>
                    <td className="stable">1.00 %</td>

                </tr>
            </tbody>
        </Table>
    )
}

export default RateTable;