import { Finding, FindingSeverity, FindingType } from "forta-agent";

export const MAINNET_COMET = "0xc3d688B66703497DAA19211EEdff47f25384cdc3";
export const GOERLI_COMET = "0x2801604060f3A819730Aa022b42f6bC005136492";
export const MONITORED_FUNCS = [
  "function buyCollateral(address asset, uint minAmount, uint baseAmount, address recipient)",
];
export const MONITORED_FUNC_SELECTORS = [
  "0xe4e6e779", // selector for buyCollateral
];

export function getFindingInstance(cardinality: string): Finding {
  return Finding.fromObject({
    name: "Buy Collateral Reentrancy detected",
    description: "The buyCollateral function was re-entered in the transaction",
    alertId: "COMP-3",
    severity: FindingSeverity.Low,
    type: FindingType.Info,
    protocol: "COMP",
    metadata: {
      cardinality,
    },
  });
}
