# Base Token Reserves monitoring bot

## Description

This bot monitors for the amount of base token reserves stored in the [Compound](https://compound.finance/) III's `Comet` (contract)[https://etherscan.io/address/0xc3d688B66703497DAA19211EEdff47f25384cdc3].
## Supported Chains
- Mainnet
  
## Alerts

- COMP-1
  - Fired whenever the amount of base token reserves on the COmet contract goes below the thresholds set in utils.ts
  - Severity is always set to "low" 
  - Type is always set to "info"
  - Metadata :
    - actualReserves - the actual amount of base token reserves
    - targetReserves - the target amount of base token reserves

## Test Data

In order to verify the Proof of Concept transactions on Goerli the appropriate `jsonRpcUrl` shall be set in `./forta.config.json`

- [7597753](https://goerli.etherscan.io/block/7597753) (0 findings - the reserve token balance of 110 tokens was more than the threshold of 100 tokens )
- [7597722](https://goerli.etherscan.io/block/7597722) (1 finding - the reserve token balance of 90 tokens was less than the threshold of 100 tokens )
