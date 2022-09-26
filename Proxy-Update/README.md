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
