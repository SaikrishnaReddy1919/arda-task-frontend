import { gql } from "@apollo/client"

const POSITIONS = gql`
    {
    positions(where: { id: 100 }) {
      liquidity
      tickLower {
        tickIdx
      }
      tickUpper {
        tickIdx
      }
      pool {
        id
      }
      token0 {
        symbol
        decimals
      }
      token1 {
        symbol
        decimals
      }
    }
  }
`
export default POSITIONS
