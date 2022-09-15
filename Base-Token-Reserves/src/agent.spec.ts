import { Finding, FindingSeverity, FindingType, HandleBlock, BlockEvent } from "forta-agent";
import { MockEthersProvider, TestBlockEvent } from "forta-agent-tools/lib/test";
import { provideHandleBlock } from "./agent";
import { createAddress, NetworkManager } from "forta-agent-tools";
import { NetworkDataInterface } from "./network";

// TEST DATA
const RANDOM_ADDRESS_1 = createAddress("0x12");
const RANDOM_ADDRESS_2 = createAddress("0x56");
const RANDOM_EVENT_ABI = "event Transfer(address,uint)";
const MOCK_COMET_ADDR = createAddress("0x39");
const TEST_BLOCK_NUMBER = 10000;
const TEST_NETWORK_ID = 1001;

const MOCK_NM_DATA: Record<number, NetworkDataInterface> = {
  [TEST_NETWORK_ID]: {
    targetReserves: "1000000000000",
    cometAddr: MOCK_COMET_ADDR,
  },
};
const networkManagerTest = new NetworkManager(MOCK_NM_DATA, 0);

function testGetFindingInstance(actualReserves: string, targetReserves: string) {
  return Finding.fromObject({
    name: "Token Reserves Low",
    description: "The base token reserves have gone below the target threshold",
    alertId: "COMP-1",
    severity: FindingSeverity.Low,
    type: FindingType.Info,
    protocol: "COMP",
    metadata: {
      actualReserves,
      targetReserves,
    },
  });
}
// Test cases
describe("Base Token Reserves monitoring test suite ", () => {
  let mockProvider_l1 = new MockEthersProvider();
  mockProvider_l1.setNetwork(TEST_NETWORK_ID);
  mockProvider_l1.setLatestBlock(TEST_BLOCK_NUMBER);

  // mockProvider_l1
  // .addCallTo(MOCK_DAI_L1_ADDR, TEST_BLOCK_NUMBER, iface, "balanceOf", {
  //   inputs: [MOCK_L1_ESCROW_OP],
  //   outputs: [L2_ESCROW_BALANCES_ARR[0]], // = 500, meanwhile the MOCK_FETCHER will return 456, so shouldn't emit an alert
  // })

  let handleBlock: HandleBlock = provideHandleBlock(networkManagerTest);

  it("returns empty findings if the block is empty", async () => {
    const blockEvent: BlockEvent = new TestBlockEvent().setNumber(TEST_BLOCK_NUMBER).setTimestamp(100000000);
    const findings = await handleBlock(blockEvent);
    expect(findings).toStrictEqual([]);
  });

  // it("doesn't return a finding if a large amount of specified tokens are bridged via a contract other than the official SpokePool", async () => {
  //   const txEvent: BlockEvent = new TestBlockEvent()
  //     .setFrom(RANDOM_ADDRESSES[1])
  //     .addEventLog(
  //       FILLED_RELAY_EVENT,
  //       RANDOM_ADDRESSES[0],
  //       passParams(MOCK_THRESHOLD_ERC20.toString(), MOCK_ERC20_ADDR)
  //     );

  //   const findings = await HandleBlock(txEvent);
  //   expect(findings).toStrictEqual([]);
  // });

  // it("doesn't return a finding if an irrelevant event is emitted from the SpokePool", async () => {
  //   const txEvent: BlockEvent = new TestBlockEvent()
  //     .setFrom(RANDOM_ADDRESSES[0])
  //     .addEventLog(RANDOM_EVENT_ABI, TEST_SPOKEPOOL_ADDR, [RANDOM_ADDRESSES[0], "120"]);
  //   const findings = await HandleBlock(txEvent);
  //   expect(findings).toStrictEqual([]);
  // });

  // it("doesn't return a finding if a small (less than threshold) amount of non-specified tokens are bridged via official SpokePool", async () => {
  //   const txEvent: BlockEvent = new TestBlockEvent()
  //     .setFrom(RANDOM_ADDRESSES[0])
  //     .addEventLog(FILLED_RELAY_EVENT, TEST_SPOKEPOOL_ADDR, passParams("21", RANDOM_ADDRESSES[2]));
  //   const findings = await HandleBlock(txEvent);
  //   expect(findings).toStrictEqual([]);
  // });

  // it("doesn't return a finding if a small (less than threshold) amount of specified tokens are bridged via official SpokePool", async () => {
  //   const txEvent: BlockEvent = new TestBlockEvent()
  //     .setFrom(RANDOM_ADDRESSES[0])
  //     .addEventLog(FILLED_RELAY_EVENT, TEST_SPOKEPOOL_ADDR, passParams("21", MOCK_ERC20_ADDR));
  //   const findings = await HandleBlock(txEvent);
  //   expect(findings).toStrictEqual([]);
  // });

  // it("doesn't return a finding if a large amount of non-specified tokens are bridged via official SpokePool", async () => {
  //   const txEvent: BlockEvent = new TestBlockEvent()
  //     .setFrom(RANDOM_ADDRESSES[0])
  //     .addEventLog(
  //       FILLED_RELAY_EVENT,
  //       TEST_SPOKEPOOL_ADDR,
  //       passParams(MOCK_THRESHOLD_ERC20.toString(), RANDOM_ADDRESSES[0])
  //     );
  //   const findings = await HandleBlock(txEvent);
  //   expect(findings).toStrictEqual([]);
  // });

  // it("returns a finding if a large amount of specified tokens are bridged via official SpokePool", async () => {
  //   const txEvent: BlockEvent = new TestBlockEvent()
  //     .setFrom(RANDOM_ADDRESSES[0])
  //     .addEventLog(
  //       FILLED_RELAY_EVENT,
  //       TEST_SPOKEPOOL_ADDR,
  //       passParams(MOCK_THRESHOLD_ERC20.toString(), MOCK_ERC20_ADDR)
  //     );

  //   const findings = await HandleBlock(txEvent);
  //   expect(findings).toStrictEqual([expectedFinding(MOCK_THRESHOLD_ERC20.toString(), MOCK_ERC20_ADDR)]);
  // });

  // it("returns N findings when N large relays occurs from the official SpokePool address", async () => {
  //   const txEvent: BlockEvent = new TestBlockEvent()
  //     .setFrom(RANDOM_ADDRESSES[0])
  //     .addEventLog(
  //       FILLED_RELAY_EVENT,
  //       TEST_SPOKEPOOL_ADDR,
  //       passParams(MOCK_THRESHOLD_ERC20.toString(), MOCK_ERC20_ADDR)
  //     )
  //     .addEventLog(
  //       FILLED_RELAY_EVENT,
  //       TEST_SPOKEPOOL_ADDR,
  //       passParams(MOCK_THRESHOLD_ERC20.toString(), MOCK_ERC20_ADDR_2)
  //     )
  //     .addEventLog(RANDOM_EVENT_ABI, TEST_SPOKEPOOL_ADDR, [RANDOM_ADDRESSES[0], "120"]) // Irrelavant events emitted from the official SpokePool must be ignored
  //     .addEventLog(
  //       FILLED_RELAY_EVENT,
  //       TEST_SPOKEPOOL_ADDR,
  //       passParams(MOCK_THRESHOLD_ERC20.sub(BigNumber.from("1")).toString(), MOCK_ERC20_ADDR_2)
  //     ); // Amounts of tokens less than threshold shall not be in the findings

  //   const findings = await HandleBlock(txEvent);
  //   expect(findings).toStrictEqual([
  //     expectedFinding(MOCK_THRESHOLD_ERC20.toString(), MOCK_ERC20_ADDR),
  //     expectedFinding(MOCK_THRESHOLD_ERC20.toString(), MOCK_ERC20_ADDR_2),
  //   ]);
  // });
});
