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

In order to verify the Proof of Concept transactions on Goerli the appropriate `jsonRpcUrl` shall be set in `./forta.config.json`

- [0xcad4404cfcc3368487f616257e94dc083d5c475e872fd4085a2c2062fdcc1ba1](https://goerli.etherscan.io/tx/0xcad4404cfcc3368487f616257e94dc083d5c475e872fd4085a2c2062fdcc1ba1)  (1 finding - the `Comet` contract was upgraded)
- [0xfdfcf5a405a176d13b765e1c0b9ab716b46e928bda10000c04b83f5ab8f4cd1c](https://goerli.etherscan.io/tx/0xfdfcf5a405a176d13b765e1c0b9ab716b46e928bda10000c04b83f5ab8f4cd1c) (1 finding - the `Configurator` contract was upgraded)
