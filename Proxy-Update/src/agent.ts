import {
  Finding,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity,
  FindingType,
  ethers,
  Initialize,
  getEthersProvider,
} from "forta-agent";
import { UPGRADE_EVENT_SIGNATURE } from "./utils";
import { NetworkDataInterface, NM_DATA } from "./network";
import { NetworkManager } from "forta-agent-tools";

const networkManager = new NetworkManager(NM_DATA, 1);

export function provideInitialize(
  networkManager: NetworkManager<NetworkDataInterface>,
  provider: ethers.providers.Provider
): Initialize {
  return async () => {
    await networkManager.init(provider);
  };
}

export function provideHandleTransaction(
  networkManager: NetworkManager<NetworkDataInterface>
): HandleTransaction {
  return async (txEvent: TransactionEvent) => {
    const findings: Finding[] = [];

    const upgradeEvents = txEvent.filterLog(UPGRADE_EVENT_SIGNATURE, [
      networkManager.get("cometAddr"),
      networkManager.get("configuratorAddr"),
    ]);

    if (!upgradeEvents.length) return findings;
    upgradeEvents.forEach((event) => {
      const _newImpl = event.args[0];
      findings.push(
        Finding.fromObject({
          name: "Compound Proxy Upgrade",
          description: `Compound Proxy contract updated`,
          alertId: "COMP-4",
          type: FindingType.Info,
          severity: FindingSeverity.High,
          metadata: {
            newImplementation: _newImpl,
            isComet: (
              event.address === networkManager.get("cometAddr")
            ).toString(),
          },
        })
      );
    });
    return findings;
  };
}

export default {
  initialize: provideInitialize(networkManager, getEthersProvider()),
  handleTransaction: provideHandleTransaction(networkManager),
};
