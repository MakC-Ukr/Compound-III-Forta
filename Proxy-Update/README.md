# Large Tether Transfer Agent

## Description

This agent detects if the `Comet` or `Configurator` contracts' proxy implementation is upgraded and emits an alert.

## Supported Chains

- Ethereum

## Alerts

Types of alerts fired by this bot:

- COMP-4
  - Fired when a the `Updated` event is emitted by the Comet/Configurator contract (i.e. the implementation contract is updated)
  - Severity is always set to "high"
  - Type is always set to "info"
  - metadata:
    - isComet - returns "true" if the implementation for `Comet` contract changed and "false" if implementation for `Configurator` contract changed
    - newImplementation - address for the new implementation contract

## Test Data

The agent behaviour can be verified with the following transactions:

<!-- - 0x3a0f757030beec55c22cbc545dd8a844cbbb2e6019461769e1bc3f3a95d10826 (15,000 USDT) -->

 ### Goerli Testnet (PoC)

In order to verify the Proof of Concept transactions on Goerli the appropriate `jsonRpcUrl` shall be set in `./forta.config.json`

- [0x14a3f1e07e037d49db44b4cac7eba83df4a7ae3e2cb903623c8b719bb2b7b3a3](https://goerli.etherscan.io/tx/0x14a3f1e07e037d49db44b4cac7eba83df4a7ae3e2cb903623c8b719bb2b7b3a3)  (1 finding - the `Comet` contract was upgraded)
- [0x163e08ee3a3d4a78fc67ea9368bbe073fbc4b55abd0da24b6b0c96a0a145e501](https://goerli.etherscan.io/tx/0x163e08ee3a3d4a78fc67ea9368bbe073fbc4b55abd0da24b6b0c96a0a145e501) (1 finding - the `Configurator` contract was upgraded)
