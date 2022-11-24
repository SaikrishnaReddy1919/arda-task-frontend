import { gql } from '@apollo/client'

const POSITIONS = gql`
  {
    positions(where: { id: 10 }) {
      liquidity
      tickLower {
        tickIdx
      }
      tickUpper {
        tickIdx
      }
      pool {
        id
        volumeToken0
        volumeToken1
      }
      token0 {
        symbol
        decimals
        volume
      }
      token1 {
        symbol
        decimals
        volume
      }
    }
  }
`
export default POSITIONS
