import { Finding, FindingSeverity, FindingType } from "forta-agent";
import { utils } from "ethers";

export const MAINNET_COMET = "0xc3d688B66703497DAA19211EEdff47f25384cdc3";
export const GOERLI_COMET = "0x2801604060f3A819730Aa022b42f6bC005136492";
export const APPROVE_FUNC = "function approveThis(address manager, address asset, uint amount)";
export const COMET_ABI = [APPROVE_FUNC];

export function getFindingInstance(approvedAddress: string, erc20: string, amount: string): Finding {
  return Finding.fromObject({
    name: "Governance Approved Tokens",
    description: "The governance contract has approved an address to transfer assets out of the protocol",
    alertId: "COMP-2",
    severity: FindingSeverity.Medium,
    type: FindingType.Suspicious,
    protocol: "COMP",
    metadata: {
      approvedAddress,
      erc20,
      amount,
    },
  });
}
