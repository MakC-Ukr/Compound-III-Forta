# Compound III Proposal

## Summary

Compound Finance's v3 of the protocol issues overcollateralized loans of a single asset (called the `baseToken`) with collateral of other assets (e.g. ETH, WBTC, LINK, UNI, COMP). The deposited collateral stays in the contract, does not earn a yield, and is not transferred anywhere else until the loan is repaid. Whenever the loan to collateral value falls below a certain ratio (the `liquidationFactor`), the user can be liquidated. 

## Proposed Bots:
- COMP01: Base Token Reserves
- COMP02: Governance Approve 
- COMP03: Buy Collateral Re-entrancy
- COMP04: Proxy Update

## Proposed Solution:
- COMP01: Base Token Reserves
Fetch the amount returned by `getReserves()` function and compare if the amount goes below a preset target reserve amount. 

- COMP02: Governance Approve
Listen for function `approveThis` being called from the [Comet](https://github.com/compound-finance/comet/blob/0f1221967149115f50a09681eea9580879ee7720/contracts/Comet.sol#L1294) contract  

- COMP03: Buy Collateral Re-entrancy
Listen for multiple re-entrancies into the `buyCollateral` function. We can monitor for reentrancy by looking at the transaction event traces as described [here](https://github.com/NethermindEth/Forta-Agents/blob/a5bd20303669d5a1d0e2163c43904627f8999749/reentrancy-counter/src/agent.utils.ts). 

-COMP04: Proxy Update
Listen for the `Updated` event emitted by standard OZ's `TransparentUpgradableProxy` [implementation](https://github.com/compound-finance/comet/blob/0f1221967149115f50a09681eea9580879ee7720/contracts/vendor/proxy/transparent/TransparentUpgradeableProxy.sol).