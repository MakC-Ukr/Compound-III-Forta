import { Finding, HandleTransaction, TransactionEvent, Trace, FindingSeverity } from "forta-agent";
import { Counter, reentracyLevel, createFinding } from "./agent.utils";

export const thresholds: [number, FindingSeverity][] = [
  [3, FindingSeverity.Info],
  [5, FindingSeverity.Low],
  [7, FindingSeverity.Medium],
  [9, FindingSeverity.High],
  [11, FindingSeverity.Critical],
];

const handleTransaction: HandleTransaction = async (txEvent: TransactionEvent) => {
  const findings: Finding[] = [];

  const maxReentrancyNumber: Counter = {};
  const currentCounter: Counter = {};

  // Add the addresses to the counters
  const addresses: string[] = [];
  txEvent.traces.forEach((trace: Trace) => {
    addresses.push(trace.action.to);
  });
  addresses.forEach((addr: string) => {
    maxReentrancyNumber[addr] = 1;
    currentCounter[addr] = 0;
  });

  const stack: string[] = [];

  // Review the traces stack
  txEvent.traces.forEach((trace: Trace) => {
    const curStack: number[] = trace.traceAddress;
    while (stack.length > curStack.length) {
      // @ts-ignore
      const last: string = stack.pop();
      currentCounter[last] -= 1;
    }
    const to: string = trace.action.to;
    currentCounter[to] += 1;
    maxReentrancyNumber[to] = Math.max(maxReentrancyNumber[to], currentCounter[to]);
    stack.push(to);
  });

  // Create findings if needed
  for (const addr in maxReentrancyNumber) {
    const maxCount: number = maxReentrancyNumber[addr];
    const [report, severity] = reentracyLevel(maxCount, thresholds);
    if (report) findings.push(createFinding(addr, maxCount, severity));
  }

  return findings;
};

// export default {
//   handleTransaction,
// };


// import { getEthersProvider } from "forta-agent";
// import { HandleTransaction, TransactionEvent, Finding } from "forta-agent";
// import { createFinding } from "./finding";
// import MarketsFetcher from "./markets.fetcher";
// import NetworkData from "./network";
// import { FUNCTIONS_MAP, MARKET_UPDATE_ABIS } from "./utils";

// const networkManager = new NetworkData();
// const marketsFetcher = new MarketsFetcher(getEthersProvider());
// const sighashes = Array.from(FUNCTIONS_MAP.keys());

// const provideInitialize = (marketsFetcher: MarketsFetcher) => async () => {
//   const { chainId } = await marketsFetcher.provider.getNetwork();
//   networkManager.setNetwork(chainId);

//   // set joeTroller contract address
//   marketsFetcher.setJoeTrollerContract(networkManager.joeTroller);

//   // fetch Markets from joeTroller
//   await marketsFetcher.getMarkets("latest");
// };

// export const provideHandleTransaction =
//   (networkManager: NetworkData, marketsFetcher: MarketsFetcher): HandleTransaction =>
//   async (txEvent: TransactionEvent): Promise<Finding[]> => {
//     const findings: Finding[] = [];
//     // Update the markets list.
//     txEvent.filterLog(MARKET_UPDATE_ABIS, networkManager.joeTroller).forEach((log) => {
//       marketsFetcher.updateMarkets(log.name, log.args.jToken.toString());
//     });

//     const monitoredContracts = [
//       Array.from(marketsFetcher.markets).map((market) => market.toLowerCase()),
//       networkManager.sJoeStaking,
//       networkManager.masterChefV2,
//       networkManager.moneyMaker,
//     ].flat();

//     //  look for re-entrant calls.
//     for (let i = 0; i < txEvent.traces.length; i++) {
//       const selector = txEvent.traces[i].action.input.slice(0, 10);

//       // If the trace is a call on a monitored contract, look into sub-traces.
//       if (monitoredContracts.includes(txEvent.traces[i].action.to.toLowerCase()) && sighashes.includes(selector)) {
//         const depth = txEvent.traces[i].traceAddress.length;
//         // Loop over sub-traces.
//         let j; // j is used to explore the sub-tree of traces[i].
//         for (j = i + 1; j < txEvent.traces.length; j++) {
//           if (txEvent.traces[j].traceAddress.length <= depth) {
//             break;
//           }
//           // check if a call to the same contract happened in sub-traces.
//           if (txEvent.traces[j].action.to.toLowerCase() === txEvent.traces[i].action.to.toLowerCase()) {
//             const reentrantSelector = txEvent.traces[j].action.input.slice(0, 10);
//             // create a finding
//             findings.push(
//               createFinding(
//                 txEvent.from,
//                 txEvent.traces[i].action.to,
//                 txEvent.traces[i].action.from,
//                 selector,
//                 reentrantSelector
//               )
//             );
//           }
//         }
//         i = j - 1;
//       }
//     }
//     return findings;
//   };
// export default {
//   initialize: provideInitialize(marketsFetcher),
//   handleTransaction: provideHandleTransaction(networkManager, marketsFetcher),
// };
