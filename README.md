# Arda Task

## TASK :
The goal is to 

* Continuously monitor the impermanent loss incurred for a position in Uniswap V3
* And if there is a loss, we need to exit the position

# Monitoring a position

We can use the Uniswap V3's subgraph to know a position's details like tokens, price at the time of providing liquidity, etc. We will also know the current tick in the pool.

We can use the following [Impermanent Loss Calculation](https://github.com/atiselsts/uniswap-v3-liquidity-math/blob/master/subgraph-liquidity-single-position-example.py).

When the loss crosses a threshold (like say 50%), we need to trigger the recovery process.

# Exiting a position

We need to deploy a simple smart contract that wraps around Uniswap V3's LP exiting function and trigger this function when the above monitoring logic is executed. The output of this should result in the wallet having the LP tokens back with the position fuly exited.

## Solution :

Query for fetching Uniswap v3 subgraph pool data :
```javascript
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
  ```

#Steps To run :
## 1. Clone repo

In it's own terminal / command line, run: 

```
git clone https://github.com/SaikrishnaReddy1919/arda-task-frontend.git
cd arda-task-frontend
yarn
```

## 2. Run script
```
yarn run dev
```

## 3. To see the data, connect to metamask goerli testnet.

### Process :
 - When clicked on Collect and Exit button, first the function will go throuhg the Arda's contract function then inside the contract, using UniswapV3PoolManager interface it will make a call to UniswapV3PoolManager contract for collecting fees and then second call is to exit from the pool.

### Link to Contracts repo link : [contracts](https://github.com/SaikrishnaReddy1919/arda-task)
