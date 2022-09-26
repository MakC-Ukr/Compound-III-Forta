# Base Token Reserves monitoring bot

## Description

This bot monitors for the governance contract calling the `approveThis` function in the [Compound](https://compound.finance/) v2 `Comet` (contract)[https://etherscan.io/address/0xc3d688B66703497DAA19211EEdff47f25384cdc3]. The function can potentially increase the allowance for any address to transfer base and collateral assets out of the Comet contract. 
## Supported Chains
- Mainnet
  
## Alerts

- COMP-2
  - Fired whenever the amount of base token reserves on the COmet contract goes below the thresholds set in utils.ts
  - Severity is always set to "medium" 
  - Type is always set to "suspicious"
  - Metadata :
    - approvedAddress - the address that was approved to spend the tokens
    - erc20 - the erc20 token address
    - amount - amount approved

## Test Data

The bot behaviour can be verified with the Proof of Concept transactions on Goerli (the appropriate `jsonRpcUrl` shall be set in `./forta.config.json`)

- [0x6e99a3c432944e112ed1d35fabc55ded983f34f565bf97fcb2cc093a89d298a7](https://goerli.etherscan.io/tx/0x6e99a3c432944e112ed1d35fabc55ded983f34f565bf97fcb2cc093a89d298a7) (1 finding - `approveThis` was called on the Goerli Comet PoC contract)
