import {
  FindingType,
  FindingSeverity,
  Finding,
  HandleTransaction,
} from "forta-agent";
import {
  TestTransactionEvent,
} from "forta-agent-tools/lib/test";
import { UPGRADE_EVENT_SIGNATURE } from "./constants";
import { provideHandleTransaction } from "./agent";
import { NetworkDataInterface } from "./network";
import { createAddress, NetworkManager } from "forta-agent-tools";

const MOCK_COMET_ADDR = createAddress("0x39");
const MOCK_CONFIGURATOR_ADDR = createAddress("0x40");
const TEST_NETWORK_ID = 0;
const TEST_EVENT_SIGNATURE = "event Test()";
const MOCK_NM_DATA: Record<number, NetworkDataInterface> = {
  [TEST_NETWORK_ID]: {
    cometAddr: MOCK_COMET_ADDR,
    configuratorAddr: MOCK_CONFIGURATOR_ADDR,
  },
};

const networkManagerTest = new NetworkManager(MOCK_NM_DATA, 0);
let handleTransaction: HandleTransaction =
  provideHandleTransaction(networkManagerTest);

function testGetFindingInstance(adr: string, _isComet: string): Finding {
  return Finding.fromObject({
    name: "Compound Proxy Upgrade",
    description: `Compound Proxy contract updated`,
    alertId: "COMP-4",
    type: FindingType.Info,
    severity: FindingSeverity.High,
    metadata: {
      newImplementation: adr,
      isComet: _isComet,
    },
  });
}

describe("Proxy Update agent", () => {
  it("returns empty findings if no Updated event is emitted", async () => {
    const txEvent: TestTransactionEvent = new TestTransactionEvent();
    const findings: Finding[] = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([]);
  });

  it("returns empty finding if the Updated event is emitted but not from the Comet or Configurator address", async () => {
    const txEvent: TestTransactionEvent =
      new TestTransactionEvent().addEventLog(
        UPGRADE_EVENT_SIGNATURE,
        createAddress("0x32"),
        [createAddress("0x09")]
      );

    const findings: Finding[] = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([]);
  });

  it("returns empty finding if the some other event is emitted from the Comet address", async () => {
    const txEvent: TestTransactionEvent =
      new TestTransactionEvent().addEventLog(
        TEST_EVENT_SIGNATURE,
        createAddress("0x32")
      );

    const findings: Finding[] = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([]);
  });

  it("returns a finding if the Comet's proxy contract is updated", async () => {
    const txEvent: TestTransactionEvent =
      new TestTransactionEvent().addEventLog(
        UPGRADE_EVENT_SIGNATURE,
        MOCK_COMET_ADDR,
        [createAddress("0x09")]
      );

    const findings: Finding[] = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([
      testGetFindingInstance(createAddress("0x09"), "true"),
    ]);
  });

  it("returns a finding if the Configurator's proxy contract is updated", async () => {
    const txEvent: TestTransactionEvent =
      new TestTransactionEvent().addEventLog(
        UPGRADE_EVENT_SIGNATURE,
        MOCK_CONFIGURATOR_ADDR,
        [createAddress("0x09")]
      );

    const findings: Finding[] = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([
      testGetFindingInstance(createAddress("0x09"), "false"),
    ]);
  });

  it("returns a finding each if both Comet's and Configurator's proxy contract is updated", async () => {
    const txEvent: TestTransactionEvent = new TestTransactionEvent()
      .addEventLog(UPGRADE_EVENT_SIGNATURE, MOCK_CONFIGURATOR_ADDR, [
        createAddress("0x09"),
      ])
      .addEventLog(UPGRADE_EVENT_SIGNATURE, MOCK_COMET_ADDR, [
        createAddress("0x10"),
      ]);

    const findings: Finding[] = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([
      testGetFindingInstance(createAddress("0x09"), "false"),
      testGetFindingInstance(createAddress("0x10"), "true"),
    ]);
  });
});
