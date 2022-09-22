import {
  Finding,
  FindingSeverity,
  FindingType,
  HandleTransaction,
  TransactionEvent,
  TraceAction,
  Trace,
  createTransactionEvent,
} from "forta-agent";
import { TestTransactionEvent } from "forta-agent-tools/lib/test";
import { provideHandleTransaction } from "./agent";
import { createAddress, NetworkManager } from "forta-agent-tools";
import { NetworkDataInterface } from "./network";
import { MONITORED_FUNCS, MONITORED_FUNC_SELECTORS } from "./utils";
import { Interface } from "ethers/lib/utils";
import { Transaction } from "ethers";

// TEST DATA
const MOCK_COMET_ADDR = createAddress("0x39");
const MOCK_EOA = createAddress("0x33");
const TEST_NETWORK_ID = 0;
const iface: Interface = new Interface(MONITORED_FUNCS);
const MOCK_NM_DATA: Record<number, NetworkDataInterface> = {
  [TEST_NETWORK_ID]: {
    cometAddr: MOCK_COMET_ADDR,
  },
};
const networkManagerTest = new NetworkManager(MOCK_NM_DATA, TEST_NETWORK_ID);
let handleTransaction: HandleTransaction = provideHandleTransaction(networkManagerTest, MONITORED_FUNC_SELECTORS);

function testGetFindingInstance(cardinality: string): Finding {
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

const createTrace = (from: string, traceAddress: number[], to: string, input: string): Trace => {
  return {
    action: {
      from,
      to,
      input,
    } as TraceAction,
    traceAddress,
  } as Trace;
};

// Test cases
describe("buyCollateral reentrancy detection test suite ", () => {
  it("returns empty findings for an empty transaction", async () => {
    const txEvent: TestTransactionEvent = new TestTransactionEvent();
    const findings: Finding[] = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([]);
  });

  it("returns empty findings for non-comet contract re-entrancies", async () => {
    const data = {
      from: MOCK_EOA,
      to: MOCK_COMET_ADDR,
    };

    const traces = [
      createTrace(
        MOCK_EOA,
        [],
        createAddress("0x9323"), // random address
        iface.encodeFunctionData("buyCollateral(address,uint,uint,address)", [
          createAddress("0x1234"),
          "333",
          "444",
          createAddress("0x4321"),
        ])
      ),
      createTrace(
        MOCK_EOA,
        [0],
        createAddress("0x9323"), // random address
        iface.encodeFunctionData("buyCollateral(address,uint,uint,address)", [
          createAddress("0x1234"),
          "333",
          "444",
          createAddress("0x4321"),
        ])
      ),
    ];

    const txEvent: TransactionEvent = createTransactionEvent({
      transaction: data as Transaction,
      traces: traces,
    } as any);
    const findings = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([]);
  });

  it("returns empty findings for a single buyCollateral call", async () => {
    const data = {
      from: MOCK_EOA,
      to: MOCK_COMET_ADDR,
    };

    const traces = [
      createTrace(
        MOCK_EOA,
        [],
        MOCK_COMET_ADDR,
        iface.encodeFunctionData("buyCollateral(address,uint,uint,address)", [
          createAddress("0x1234"),
          "111",
          "222",
          createAddress("0x4321"),
        ])
      ),
    ];

    const txEvent: TransactionEvent = createTransactionEvent({
      transaction: data as Transaction,
      traces: traces,
    } as any);
    const findings = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([]);
  });

  it("returns cardinality of one if only one reentrancy occured", async () => {
    const data = {
      from: MOCK_EOA,
      to: MOCK_COMET_ADDR,
    };

    const traces = [
      createTrace(
        MOCK_EOA,
        [],
        MOCK_COMET_ADDR,
        iface.encodeFunctionData("buyCollateral(address,uint,uint,address)", [
          createAddress("0x1234"),
          "111",
          "222",
          createAddress("0x4321"),
        ])
      ),
      createTrace(
        MOCK_EOA,
        [],
        MOCK_COMET_ADDR,
        iface.encodeFunctionData("buyCollateral(address,uint,uint,address)", [
          createAddress("0x1234"),
          "333",
          "444",
          createAddress("0x4321"),
        ])
      ),
      createTrace(
        MOCK_EOA,
        [0],
        MOCK_COMET_ADDR,
        iface.encodeFunctionData("buyCollateral(address,uint,uint,address)", [
          createAddress("0x1234"),
          "333",
          "444",
          createAddress("0x4321"),
        ])
      ),
    ];

    const txEvent: TransactionEvent = createTransactionEvent({
      transaction: data as Transaction,
      traces: traces,
    } as any);
    const findings = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([testGetFindingInstance("1")]);
  });

  it("returns N findings if N reentrancies occured", async () => {
    const data = {
      from: MOCK_EOA,
      to: MOCK_COMET_ADDR,
    };

    const traces = [
      createTrace(
        MOCK_EOA,
        [],
        MOCK_COMET_ADDR,
        iface.encodeFunctionData("buyCollateral(address,uint,uint,address)", [
          createAddress("0x1234"),
          "333",
          "444",
          createAddress("0x4321"),
        ])
      ),
      createTrace(
        MOCK_EOA,
        [0],
        MOCK_COMET_ADDR,
        iface.encodeFunctionData("buyCollateral(address,uint,uint,address)", [
          createAddress("0x1234"),
          "333",
          "444",
          createAddress("0x4321"),
        ])
      ),
      createTrace(
        MOCK_EOA,
        [0, 0],
        MOCK_COMET_ADDR,
        iface.encodeFunctionData("buyCollateral(address,uint,uint,address)", [
          createAddress("0x1234"),
          "333",
          "444",
          createAddress("0x4321"),
        ])
      ),
    ];

    const txEvent: TransactionEvent = createTransactionEvent({
      transaction: data as Transaction,
      traces: traces,
    } as any);
    const findings = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([testGetFindingInstance("1"), testGetFindingInstance("2")]);
  });

  it("returns findings even with other traces", async () => {
    const data = {
      from: MOCK_EOA,
      to: MOCK_COMET_ADDR,
    };

    const traces = [
      createTrace(
        MOCK_EOA,
        [],
        MOCK_COMET_ADDR,
        iface.encodeFunctionData("buyCollateral(address,uint,uint,address)", [
          createAddress("0x6666"),
          "888",
          "999",
          createAddress("0x7777"),
        ])
      ),
      createTrace(
        MOCK_EOA,
        [0],
        MOCK_COMET_ADDR,
        iface.encodeFunctionData("buyCollateral(address,uint,uint,address)", [
          createAddress("0x1234"),
          "333",
          "444",
          createAddress("0x4321"),
        ])
      ),
      createTrace(
        MOCK_EOA,
        [0, 0],
        createAddress("0x2323"),
        iface.encodeFunctionData("buyCollateral(address,uint,uint,address)", [
          createAddress("0x1234"),
          "333",
          "444",
          createAddress("0x4321"),
        ])
      ), // should not return a finding since the non-comet contract is used
      createTrace(
        MOCK_EOA,
        [0, 1],
        MOCK_COMET_ADDR,
        iface.encodeFunctionData("buyCollateral(address,uint,uint,address)", [
          createAddress("0x1234"),
          "333",
          "444",
          createAddress("0x4321"),
        ])
      ),
    ];

    const txEvent: TransactionEvent = createTransactionEvent({
      transaction: data as Transaction,
      traces: traces,
    } as any);
    const findings = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([testGetFindingInstance("1"), testGetFindingInstance("2")]);
  });
});
