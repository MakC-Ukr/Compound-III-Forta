# Compound III Proposal

## Summary

Compound Finance's v3 of the protocol issues overcollateralized loans of a single asset (called the `baseToken`) with collateral of other assets (e.g. ETH, WBTC, LINK, UNI, COMP). The deposited collateral stays in the contract, does not earn a yield, and is not transferred anywhere else until the loan is repaid. Whenever the loan to collateral value falls below a certain ratio (the `liquidationFactor`). 

## Proposed Bots:
- COMP01: Base Token Reserves
- COMP02: Governance Approve 
- COMP03: Buy Collateral Re-entrancy
- COMP04: Proxy Update

## Proposed Solution:
- COMP01: Base Token Reserves
    - Detailed instructions
    - on how to build bot
- COMP02: Bot Name
    - Detailed instructions
    - on how to build bot
    - COMP03: Bot Name
    - Detailed instructions
    - on how to build bot