import { useQuery } from "@apollo/client"
import { abi, POSITIONS } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useNotification } from "web3uikit"

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()
    const { loading, error, data } = useQuery(POSITIONS)
    const { runContractFunction } = useWeb3Contract()
    const dispatch = useNotification()

    const futurePriceRatio = 0.01727 //assume tokenB doubles its price

    const calcImpermanentLoss = (baseQty, tokenQty) => {
        baseQty = parseInt(baseQty)
        tokenQty = parseInt(tokenQty)

        const productConstant = baseQty * tokenQty // x * y = k
        const hodlStrategy = tokenQty * futurePriceRatio + baseQty
        const lpStrategy =
            Math.sqrt(productConstant / futurePriceRatio) * futurePriceRatio +
            Math.sqrt(productConstant * futurePriceRatio)
        const impermanentLoss = ((hodlStrategy - lpStrategy) / hodlStrategy) * 100
        console.log(impermanentLoss, "ILLLL")
        return impermanentLoss
    }

    async function collectFeesAndExit() {
        const collectFeesOptions = {
            abi: abi, // arda contract abi
            contractAddress: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9", //load it from file when to make it automatic
            functionName: "collectFees",
            params: {},
        }

        await runContractFunction({
            params: collectFeesOptions,
            onSuccess: (tx) => handleCollectFeeSuccess(tx),
            onError: (error) => {
                console.log(error)
            },
        })
    }

    async function handleCollectFeeSuccess(tx) {
        await tx.wait()
        const exitOptions = {
            abi: abi,
            contractAddress: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
            functionName: "exitPool",
            params: {},
        }

        await runContractFunction({
            params: exitOptions,
            onSuccess: () => handleListSuccess(),
            onError: (error) => console.log(error),
        })
    }

    async function handleListSuccess() {
        dispatch({
            type: "success",
            message: "Fee collected and exited from pool.",
            title: "Done✅",
            position: "topR",
        })
    }

    return (
        <div>
            <span class="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 w-full">
                If IL is more than 50%, then 'Collect & Exit' will be enabled.
            </span>

            <div className="mt-10 flex  items-center w-full">
                <div>
                    {isWeb3Enabled ? (
                        loading || !data ? (
                            <div>Loading...</div>
                        ) : (
                            <table className="table-auto border-collapse border border-slate-500 border-spacing-2">
                                <thead>
                                    <tr>
                                        <th className="border border-slate-600 p-2">tickLower</th>
                                        <th className="border border-slate-600">tickUpper</th>
                                        <th className="border border-slate-600">Pool Id</th>
                                        <th className="border border-slate-600">Token A</th>
                                        <th className="border border-slate-600">Token B</th>
                                        <th className="border border-slate-600">IL</th>
                                        <th className="border border-slate-600">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.positions.map((position) => {
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
                                                <td className="border border-slate-70 p-5">
                                                    {tickLower.tickIdx}
                                                </td>
                                                <td className="border border-slate-700 p-5">
                                                    {tickUpper.tickIdx}
                                                </td>
                                                <td className="border border-slate-700 p-5">
                                                    {pool.id}
                                                </td>
                                                <td className="border border-slate-700 p-5">
                                                    {token0.symbol}
                                                </td>
                                                <td className="border border-slate-700 p-5">
                                                    {token1.symbol}
                                                </td>
                                                <td className="border border-slate-700 p-5">
                                                    {calcImpermanentLoss(
                                                        pool.volumeToken0,
                                                        pool.volumeToken1
                                                    )}
                                                </td>
                                                <td className="flex items-center p-5">
                                                    <button
                                                        onClick={collectFeesAndExit}
                                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-300"
                                                        disabled={
                                                            calcImpermanentLoss(
                                                                pool.volumeToken0,
                                                                pool.volumeToken1
                                                            ) < 50
                                                        }
                                                    >
                                                        Collect & Exit
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        )
                    ) : (
                        <div>Connect to Metamask - Goerli testnet works.</div>
                    )}
                </div>
            </div>
        </div>
    )
}
