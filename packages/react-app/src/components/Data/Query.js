import gql from "graphql-tag";

export const V1_RESERVES = gql`
{
    reserves{
      id
      underlyingAsset
      name
      symbol
      decimals
      isActive
      isFreezed
      usageAsCollateralEnabled
      borrowingEnabled
      stableBorrowRateEnabled
      baseLTVasCollateral
      optimalUtilisationRate
      averageStableBorrowRate
      stableRateSlope1
      stableRateSlope2
      baseVariableBorrowRate
      variableRateSlope1
      variableRateSlope2
      liquidityIndex
      reserveLiquidationThreshold
      variableBorrowIndex
      aToken {
        id
      }
      availableLiquidity
      stableBorrowRate
      liquidityRate
      totalBorrows
      totalBorrowsStable
      totalBorrowsVariable
      totalLiquidity
      utilizationRate
      reserveLiquidationBonus
      variableBorrowRate
      price {
        priceInEth
      }
      lastUpdateTimestamp    
    }
  }
`;

export const V2_RESERVES = gql`
{
  reserves {
    id
    underlyingAsset
    name
    symbol
    decimals
    isActive
    isFrozen
    usageAsCollateralEnabled
    borrowingEnabled
    stableBorrowRateEnabled
    baseLTVasCollateral
    optimalUtilisationRate
    averageStableRate
    stableRateSlope1
    stableRateSlope2
    baseVariableBorrowRate
    variableRateSlope1
    variableRateSlope2
    variableBorrowIndex
    variableBorrowRate
    totalScaledVariableDebt
    liquidityIndex
    reserveLiquidationThreshold
    aToken {
      id
    }
    vToken {
      id
    }
    sToken {
      id
    }
    availableLiquidity
    stableBorrowRate
    liquidityRate
    totalPrincipalStableDebt
    totalLiquidity
    utilizationRate
    reserveLiquidationBonus
    price {
      priceInEth
    }
    lastUpdateTimestamp
    stableDebtLastUpdateTimestamp
    reserveFactor
  }
}
`;


export const V1_USER_RESERVES = gql`
query userReserves($id: ID!) {
  userReserves(where: { user: $id}) {
    principalATokenBalance
    userBalanceIndex
    redirectedBalance
    interestRedirectionAddress
    reserve{
      id
      underlyingAsset
      name
      symbol
      decimals
      liquidityRate
      reserveLiquidationBonus
      lastUpdateTimestamp
      aToken {
        id
      }
    }
    usageAsCollateralEnabledOnUser
    borrowRate
    borrowRateMode
    originationFee
    principalBorrows
    variableBorrowIndex
    lastUpdateTimestamp
  }
}
`;

export const V2_USER_RESERVES = gql`
query userReserves($id: ID!) {
  userReserves(where: { user: $id}) {
    scaledATokenBalance
    reserve {
      id
      underlyingAsset
      name
      symbol
      decimals
      liquidityRate
      reserveLiquidationBonus
      lastUpdateTimestamp
      aToken {
        id
      }
    }
    usageAsCollateralEnabledOnUser
    stableBorrowRate
    stableBorrowLastUpdateTimestamp
    principalStableDebt
    scaledVariableDebt
    variableBorrowIndex
    lastUpdateTimestamp
  }

}
`;


