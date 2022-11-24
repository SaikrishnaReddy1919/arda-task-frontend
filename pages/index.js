import { useMoralisQuery, useMoralis } from 'react-moralis'
import GET_ACTIVE_ITEMS from '../constants/subgraphQueries'
import { useQuery } from '@apollo/client'

export default function Home() {
  const { isWeb3Enabled, chainId } = useMoralis()

  const { loading, error, data } = useQuery(GET_ACTIVE_ITEMS)

  return (
    <div className="mt-10 flex  content-center w-full">
      <div>
        {isWeb3Enabled ? (
          loading || !data ? (
            <div>Loading...</div>
          ) : (
            <table className="table-auto border-collapse border border-slate-500 border-spacing-2">
              <thead>
                <tr>
                  <th className="border border-slate-600 p-3">liquidity</th>
                  <th className="border border-slate-600">tickLower</th>
                  <th className="border border-slate-600">tickUpper</th>
                  <th className="border border-slate-600">Pool Id</th>
                  <th className="border border-slate-600">Token A</th>
                  <th className="border border-slate-600">Token B</th>
                </tr>
              </thead>
              <tbody>
                {data.positions.map((position) => {
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
                    <tr key={pool.id}>
                      <td className="border border-slate-700 p-3">{liquidity}</td>
                      <td className="border border-slate-700">
                        {tickLower.tickIdx}
                      </td>
                      <td className="border border-slate-700">
                        {tickUpper.tickIdx}
                      </td>
                      <td className="border border-slate-700">{pool.id}</td>
                      <td className="border border-slate-700">
                        {token0.symbol}
                      </td>
                      <td className="border border-slate-700">
                        {token1.symbol}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )
        ) : (
          <div>Web3 Currently Not Enabled</div>
        )}
      </div>
    </div>
  )
}
