import { useMoralisQuery, useMoralis } from 'react-moralis'
import GET_ACTIVE_ITEMS from '../constants/subgraphQueries'
import { useQuery } from '@apollo/client'

export default function Home() {
  const { isWeb3Enabled, chainId } = useMoralis()

  const { loading, error, data } = useQuery(GET_ACTIVE_ITEMS)

  return (
    <div className="container flex items-center content-center">
      <div>
        {isWeb3Enabled ? (
          loading || !data ? (
            <div>Loading...</div>
          ) : (
            data.positions.map((position) => {
              console.log(position)
              const {
                liquidity,
                tickLower,
                tickUpper,
                pool,
                token0,
                token1,
              } = position
              return (
                <table className="table-fixed" key={pool.id}>
                  <thead>
                    <tr>
                      <th>liquidity</th>
                      <th>tickLower</th>
                      <th>tickUpper</th>
                      <th>Pool Id</th>
                      <th>Token A</th>
                      <th>Token B</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{liquidity}</td>
                      <td>{tickLower.tickIdx}</td>
                      <td>{tickUpper.tickIdx}</td>
                      <td>{pool.id}</td>
                      <td>{token0.symbol}</td>
                      <td>{token1.symbol}</td>
                    </tr>
                  </tbody>
                </table>
              )
            })
          )
        ) : (
          <div>Web3 Currently Not Enabled</div>
        )}
      </div>
    </div>
  )
}
