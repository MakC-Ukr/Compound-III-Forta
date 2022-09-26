import { Finding, FindingSeverity, FindingType, HandleBlock, BlockEvent, HandleTransaction } from "forta-agent";
import { MockEthersProvider, TestBlockEvent, TestTransactionEvent } from "forta-agent-tools/lib/test";
import { provideHandleTransaction } from "./agent";
import { createAddress, NetworkManager } from "forta-agent-tools";
import { NetworkDataInterface } from "./network";
import { COMET_ABI } from "./utils";
import { Interface } from "ethers/lib/utils";

// TEST DATA
const MOCK_COMET_ADDR = createAddress("0x39");
const TEST_NETWORK_ID = 0;
const iface: Interface = new Interface(COMET_ABI);
const MOCK_NM_DATA: Record<number, NetworkDataInterface> = {
  [TEST_NETWORK_ID]: {
    cometAddr: MOCK_COMET_ADDR,
  },
};
const networkManagerTest = new NetworkManager(MOCK_NM_DATA, 0);
let handleTransaction: HandleTransaction = provideHandleTransaction(networkManagerTest);

function testGetFindingInstance(approvedAddress: string, erc20: string, amount: string): Finding {
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
// Test cases
describe("Governance approve monitoring test suite ", () => {
  it("returns empty findings if approveThis is not called on Comet contract", async () => {
    const txEvent: TestTransactionEvent = new TestTransactionEvent();
    const findings: Finding[] = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([]);
  });

  it("returns a finding if the amount of reserves goes less than the threshold", async () => {
    const txEvent: TestTransactionEvent = new TestTransactionEvent().addTraces({
      from: createAddress("0x1"),
      to: MOCK_COMET_ADDR,
      function: iface.getFunction("approveThis"),
      arguments: [createAddress("0x1234"), createAddress("0x4321"), "1000"],
    });

    const findings: Finding[] = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([testGetFindingInstance(createAddress("0x1234"), createAddress("0x4321"), "1000")]);
  });

  it("returns empty findings if approveThis is called not on the Comet contract", async () => {
    const txEvent: TestTransactionEvent = new TestTransactionEvent().addTraces({
      from: createAddress("0x1"),
      to: createAddress("0x2"), // not the COMET contract
      function: iface.getFunction("approveThis"),
      arguments: [createAddress("0x1234"), createAddress("0x4321"), "1000"],
    });

    const findings: Finding[] = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([]);
  });
});
