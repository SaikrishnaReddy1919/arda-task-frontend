import { useQuery } from "@apollo/client"
import calcImpermanentLoss from "../f"
import { abi, contractAddresses, POSITIONS } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()
    const { loading, error, data } = useQuery(POSITIONS)

    const { runContractFunction } = useWeb3Contract()

    async function collectFeesAndExit(data) {
        console.log("Collecting fees...")

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
        <div className="mt-10 flex  content-center w-full">
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
                                            <tr className="flex items-center p-5">
                                                <button
                                                    onClick={collectFeesAndExit}
                                                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                >
                                                    Collect & Exit
                                                </button>
                                            </tr>
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
