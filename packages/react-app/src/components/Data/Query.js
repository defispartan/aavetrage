import gql from "graphql-tag";

export const RESERVES = gql`
{
    reserves{
      id 
      symbol
      liquidityRate
      variableBorrowRate
      stableBorrowRate
      
    }
  }
`;