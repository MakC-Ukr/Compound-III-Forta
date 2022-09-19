import { Finding, ethers, Initialize, getEthersProvider, HandleTransaction, TransactionEvent } from "forta-agent";
import { NetworkManager } from "forta-agent-tools";
import { getFindingInstance, APPROVE_FUNC } from "./utils";
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

export function provideHandleTransaction(networkManager: NetworkManager<NetworkDataInterface>): HandleTransaction {
  return async (txEvent: TransactionEvent) => {
    const findings: Finding[] = [];
    const parsedFunctions = txEvent.filterFunction(APPROVE_FUNC, networkManager.get("cometAddr"));
    parsedFunctions.forEach((parsedFunction) => {
      // create a finding
      findings.push(
        getFindingInstance(
          parsedFunction.args.manager,
          parsedFunction.args.asset.toString(),
          parsedFunction.args.amount.toString()
        )
      );
    });

    return findings;
  };
}

export default {
  initialize: provideInitialize(networkManager, getEthersProvider()),
  handleTransaction: provideHandleTransaction(networkManager),
};
