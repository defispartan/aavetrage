import { aavev1client } from "./aavev1client.js"
import { aavev2client } from "./aavev2client"
import { V1_RESERVES, V2_RESERVES, V1_USER_RESERVES, V2_USER_RESERVES } from './Query.js'

import { v1, v2 } from '@aave/protocol-js';



const parseRay = (input) => {
    return input / 10000000000000000000000000
}

const round = (value, decimals) => {
    return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
}


export async function getPortfolio(address, ethPrice) {
    let lowerAddress = address.toLowerCase()
    try {
        //Fetch Reserves for v1 and v2
        const v1Reserves = await aavev1client.query({
            query: V1_RESERVES,
            fetchPolicy: "cache-first",
        });

        const v2Reserves = await aavev2client.query({
            query: V2_RESERVES,
            fetchPolicy: "cache-first",
        });



        //Fetch User Reserves for v1 and v2
        const v1UserReserves = await aavev1client.query({
            query: V1_USER_RESERVES,
            variables: {
                id: lowerAddress,
            },
            fetchPolicy: "cache-first",
        });

        const v2UserReserves = await aavev2client.query({
            query: V2_USER_RESERVES,
            variables: {
                id: lowerAddress,
            },
            fetchPolicy: "cache-first",
        });

        console.log("RESERVES")
        console.log(v1Reserves)
        console.log("USER RESERVES")
        console.log(v1UserReserves)
        console.log("ADDRESS")
        console.log(lowerAddress)
        console.log("ETH Price")
        console.log(ethPrice)


        let v1UserSummary = v1.formatUserSummaryData(v1Reserves.data.reserves, v1UserReserves.data.userReserves, lowerAddress, ethPrice, Date.now())
        let v2UserSummary = v2.formatUserSummaryData(v2Reserves.data.reserves, v2UserReserves.data.userReserves, lowerAddress, ethPrice, Date.now())
        console.log("V1 USER SUMMARY")
        console.log(v1UserSummary)
    }
    catch (error) {
        let errorMessage = ""
        if (error.response) {
            errorMessage = "Received " + error.response.status + " error in AAVE Graph API response. Try refreshing data again."
        } if (error.request) {
            errorMessage = "Received no response from AAVE Graph API request. Try refreshing data again."
        }
        else {
            errorMessage = "AAVE Graph API Error, try refreshing data again. Message: " + error.message
        }
        return [true, errorMessage]
    }
}