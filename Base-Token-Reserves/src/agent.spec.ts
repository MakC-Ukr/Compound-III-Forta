import { Finding, FindingSeverity, FindingType, HandleBlock, BlockEvent } from "forta-agent";
import { MockEthersProvider, TestBlockEvent } from "forta-agent-tools/lib/test";
import { provideHandleBlock } from "./agent";
import { createAddress, NetworkManager } from "forta-agent-tools";
import { NetworkDataInterface } from "./network";
import { ethers, utils } from "ethers";
import { COMET_ABI } from "./utils";

// TEST DATA
const RANDOM_ADDRESS_1 = createAddress("0x12");
const RANDOM_ADDRESS_2 = createAddress("0x56");
const RANDOM_EVENT_ABI = "event Transfer(address,uint)";
const MOCK_COMET_ADDR = createAddress("0x39");
const TEST_BLOCK_NUMBER = 10000;
const TEST_NETWORK_ID = 0;
const TEST_TARGET_RESERVES = "1000000000000";
const LT_TARGET_RESERVES = "1000000000000";
const GT_TARGET_RESERVES = 1100000000000;
const iface: utils.Interface = new utils.Interface(COMET_ABI);

const MOCK_NM_DATA: Record<number, NetworkDataInterface> = {
  [TEST_NETWORK_ID]: {
    targetReserves: TEST_TARGET_RESERVES,
    cometAddr: MOCK_COMET_ADDR,
  },
};

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
  mockProvider_l1
  .addCallTo(MOCK_COMET_ADDR, TEST_BLOCK_NUMBER, iface, "getReserves", {
    inputs: [],
    outputs: [ethers.BigNumber.from(TEST_BLOCK_NUMBER)]
  })
  it("returns empty findings if the block is empty", async () => {

    const networkManagerTest = new NetworkManager(MOCK_NM_DATA, 0);
    let handleBlock: HandleBlock = provideHandleBlock(networkManagerTest, mockProvider_l1 as any);
  
    const blockEvent: BlockEvent = new TestBlockEvent().setNumber(TEST_BLOCK_NUMBER).setTimestamp(100000000);
    const findings = await handleBlock(blockEvent);
    expect(findings).toStrictEqual([]);
  });
});
