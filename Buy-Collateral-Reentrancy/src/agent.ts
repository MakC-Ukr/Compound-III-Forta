import { Finding, HandleTransaction, TransactionEvent, ethers, Initialize, getEthersProvider } from "forta-agent";
import { NetworkDataInterface, NM_DATA } from "./network";
import { NetworkManager } from "forta-agent-tools";
import { getFindingInstance, MONITORED_FUNC_SELECTORS } from "./utils";

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
  networkManager: NetworkManager<NetworkDataInterface>,
  monitoredFuncSelectors: string[]
): HandleTransaction {
  return async (txEvent: TransactionEvent) => {
    const findings: Finding[] = [];
    for (let i = 0; i < txEvent.traces.length; i++) {
      // console.log(txEvent.traces[i]);
      const selector = txEvent.traces[i].action.input.slice(0, 10);
      if (
        networkManager.get("cometAddr") === txEvent.traces[i].action.to.toLowerCase() &&
        monitoredFuncSelectors.includes(selector)
      ) {
        const depth = txEvent.traces[i].traceAddress.length;
        let cardinality = 1;
        let j = i + 1;
        for (; j < txEvent.traces.length; j++) {
          // console.log(txEvent.traces[j]);

          if (txEvent.traces[j].traceAddress.length <= depth) {
            break;
          }
          if (
            txEvent.traces[j].action.to.toLowerCase() === txEvent.traces[i].action.to.toLowerCase() &&
            monitoredFuncSelectors.includes(txEvent.traces[j].action.input.slice(0, 10))
          ) {
            // console.log("HEYYY");
            findings.push(getFindingInstance(cardinality.toString()));
          }
          cardinality += 1;
        }
        i = j - 1;
      }
    }

    return findings;
  };
}

export default {
  initialize: provideInitialize(networkManager, getEthersProvider()),
  handleTransaction: provideHandleTransaction(networkManager, MONITORED_FUNC_SELECTORS),
};
