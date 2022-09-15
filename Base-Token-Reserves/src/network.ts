import { Network } from "forta-agent";
import { MAINNET_TARGET_RESERVES, GOERLI_TARGET_RESERVES } from "./utils";

import { MAINNET_COMET, GOERLI_COMET } from "./utils";

export interface NetworkDataInterface {
  targetReserves: string;
  cometAddr: string;
}

export const NM_DATA: Record<number, NetworkDataInterface> = {
  [Network.MAINNET]: {
    targetReserves: MAINNET_TARGET_RESERVES,
    cometAddr: MAINNET_COMET,
  },
  [Network.GOERLI]: {
    targetReserves: GOERLI_TARGET_RESERVES,
    cometAddr: GOERLI_COMET,
  },
};
