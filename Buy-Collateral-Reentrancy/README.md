# Base Token Reserves monitoring bot

## Description

This bot monitors for reentancy calls in the `buyCollateral` function of the `Comet` (contract)[https://etherscan.io/address/0xc3d688B66703497DAA19211EEdff47f25384cdc3].
## Supported Chains
- Mainnet
  
## Alerts

- COMP-2
  - Fired whenever a reentrant `buyCollateral` call takes place in the Comet contract.
  - Severity is always set to "medium" 
  - Type is always set to "Suspicious"
  - Metadata :
    - cardinality - the depth of reentrancy (i.e. the number of times the function has been reentered into)