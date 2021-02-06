import { aavev1client } from "./aavev1client.js"
import { aavev2client } from "./aavev2client"
import { V1_RESERVES, V2_RESERVES, V1_USER_RESERVES, V2_USER_RESERVES } from './Query.js'

import { v1, v2 } from '@aave/protocol-js';


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

        let usdPriceEth = (1 / ethPrice) * 1000000000000000000


        let v1UserSummary = v1.formatUserSummaryData(v1Reserves.data.reserves, v1UserReserves.data.userReserves, lowerAddress, usdPriceEth, Math.floor(Date.now() / 1000))
        let v2UserSummary = v2.formatUserSummaryData(v2Reserves.data.reserves, v2UserReserves.data.userReserves, lowerAddress, usdPriceEth, Math.floor(Date.now() / 1000))
        return ([v1UserSummary, v2UserSummary])
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