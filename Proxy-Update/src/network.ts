import { Network } from "forta-agent";

import {
  MAINNET_COMET,
  GOERLI_COMET,
  MAINNET_CONFIGURATOR,
  GOERLI_CONFIGURATOR,
} from "./utils";

export interface NetworkDataInterface {
  cometAddr: string;
  configuratorAddr: string;
}

export const NM_DATA: Record<number, NetworkDataInterface> = {
  [Network.MAINNET]: {
    cometAddr: MAINNET_COMET,
    configuratorAddr: MAINNET_CONFIGURATOR,
  },
  [Network.GOERLI]: {
    cometAddr: GOERLI_COMET,
    configuratorAddr: GOERLI_CONFIGURATOR,
  },
};
