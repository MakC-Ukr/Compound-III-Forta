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

The bot behaviour can be verified with the following transactions by running `npm run tx <TX_HASH>`:

### Ethereum Mainnet
<!-- - [0x51fa8f3cabfe44033bfd4729a60eb6d8c57c54a3097463207e33e218b9a91d35](https://etherscan.io/tx/0x51fa8f3cabfe44033bfd4729a60eb6d8c57c54a3097463207e33e218b9a91d35) (1 finding - `FilledRelay` was emitted 1 time with an amount of 3.87 WETH relayed)
- [0x396c794b8a41e6e365a0fc52235739c6e82751b977d3f803d622c9463713e1d9](https://etherscan.io/tx/0x396c794b8a41e6e365a0fc52235739c6e82751b977d3f803d622c9463713e1d9) (2 findings - `FilledRelay` was emitted 2 times with different parameters) -->

 ### Goerli Testnet (PoC)

In order to verify the Proof of Concept transactions on Goerli the appropriate `jsonRpcUrl` shall be set in `./forta.config.json`

<!-- - [0x303eb0de6ee501217858ed30b9d708101dfe0d4f19024adf7c0267c33f89ee4d](https://goerli.etherscan.io/tx/0x303eb0de6ee501217858ed30b9d708101dfe0d4f19024adf7c0267c33f89ee4d) (1 finding - `FilledRelay` was emitted 1 time with an amount of 2 Goerli WETH relayed) -->
