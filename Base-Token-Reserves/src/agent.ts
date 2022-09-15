import {
  Finding,
  HandleTransaction,
  ethers,
  Initialize,
  TransactionEvent,
  getEthersProvider,
  HandleBlock,
  BlockEvent,
  getJsonRpcUrl,
} from "forta-agent";
import { NetworkManager } from "forta-agent-tools";
import { COMET_ABI, getFindingInstance } from "./utils";
import { NetworkDataInterface, NM_DATA } from "./network";

const networkManager = new NetworkManager(NM_DATA, 1);

export function provideInitialize(
  networkManager: NetworkManager<NetworkDataInterface>,
  provider: ethers.providers.Provider
): Initialize {
  return async () => {
    await networkManager.init(provider);
  };
}

export function provideHandleBlock(networkManager: NetworkManager<NetworkDataInterface>, provider: ethers.providers.Provider): HandleBlock {
  // let provider = new ethers.providers.JsonRpcProvider(getJsonRpcUrl());
  let cometContract = new ethers.Contract(networkManager.get("cometAddr"), COMET_ABI, provider);

  return async (_: BlockEvent) => {
    const findings: Finding[] = [];
    console.log(cometContract.address);
    console.log("Promise:", (await cometContract.getReserves()));
    const tokenReserves: string = (await cometContract.getReserves()).toString();
    console.log(tokenReserves);
    if (tokenReserves < networkManager.get("targetReserves")) {
      findings.push(getFindingInstance(tokenReserves, networkManager.get("targetReserves")));
    }
    return findings;
  };
}

export default {
  initialize: provideInitialize(networkManager, getEthersProvider()),
  handleBlock: provideHandleBlock(networkManager, getEthersProvider()),
};
