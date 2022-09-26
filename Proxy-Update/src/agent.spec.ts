import {
  FindingType,
  FindingSeverity,
  Finding,
  HandleTransaction,
  TransactionEvent,
} from "forta-agent";
import {
  MockEthersProvider,
  TestTransactionEvent,
} from "forta-agent-tools/lib/test";
import { UPGRADE_EVENT_SIGNATURE } from "./utils";
import agent, { provideHandleTransaction } from "./agent";
import { NetworkDataInterface } from "./network";
import { createAddress, NetworkManager } from "forta-agent-tools";

const MOCK_COMET_ADDR = createAddress("0x39");
const TEST_NETWORK_ID = 0;
const TEST_EVENT_SIGNATURE = "event Test()";
const MOCK_NM_DATA: Record<number, NetworkDataInterface> = {
  [TEST_NETWORK_ID]: {
    cometAddr: MOCK_COMET_ADDR,
  },
};

const networkManagerTest = new NetworkManager(MOCK_NM_DATA, 0);
let handleTransaction: HandleTransaction =
  provideHandleTransaction(networkManagerTest);

function testGetFindingInstance() {
  return Finding.fromObject({
    name: "Comet Proxy Upgrade",
    description: `Comet Proxy contract updated`,
    alertId: "COMP-4",
    type: FindingType.Suspicious,
    severity: FindingSeverity.High,
    metadata: {
      // proxy: ""
    },
  });
}

describe("Root Bundle Disputed agent", () => {
  it("returns empty findings if approveThis is not called on Comet contract", async () => {
    const txEvent: TestTransactionEvent = new TestTransactionEvent();
    const findings: Finding[] = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([]);
  });

  it("returns a finding if the proxy contract is updated", async () => {
    const txEvent: TestTransactionEvent =
      new TestTransactionEvent().addEventLog(
        UPGRADE_EVENT_SIGNATURE,
        MOCK_COMET_ADDR,
        [createAddress("0x09")]
      );

    const findings: Finding[] = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([testGetFindingInstance()]);
  });

  it("returns empty finding if the Updated event is emitted but not from the Comet address", async () => {
    const txEvent: TestTransactionEvent =
      new TestTransactionEvent().addEventLog(
        UPGRADE_EVENT_SIGNATURE,
        createAddress("0x32"),
        [createAddress("0x09")]
      );

    const findings: Finding[] = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([]);
  });

  it("returns empty finding if the some other event is eitted from the Comet address", async () => {
    const txEvent: TestTransactionEvent =
      new TestTransactionEvent().addEventLog(
        TEST_EVENT_SIGNATURE,
        createAddress("0x32")
      );

    const findings: Finding[] = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([]);
  });
});
