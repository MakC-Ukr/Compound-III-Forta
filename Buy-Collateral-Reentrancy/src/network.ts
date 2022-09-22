import { Network } from "forta-agent";

import { MAINNET_COMET, GOERLI_COMET } from "./utils";

export interface NetworkDataInterface {
  cometAddr: string;
}

export const NM_DATA: Record<number, NetworkDataInterface> = {
  [Network.MAINNET]: {
    cometAddr: MAINNET_COMET,
  },
  [Network.GOERLI]: {
    cometAddr: GOERLI_COMET,
  },
};
