import { useQuery, gql } from '@apollo/client'

//get active items where there is no buyer
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

export default function GraphExample() {
  const { loading, error, data } = useQuery(POSITIONS)
  console.log(data)
  return <div>TEST</div>
}
