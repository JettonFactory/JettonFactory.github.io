/*import { Address } from "ton";
import { jettonDeployController, JettonDeployParams } from "../lib/deploy-controller";

import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";

const DEFAULT_DECIMALS = 9;


  const walletAddress = useTonAddress();
  const [tonconnect] = useTonConnectUI();


    let decimals = data.decimals;


    const params: JettonDeployParams = {
      owner: Address.parse(walletAddress),
      onchainMetaData: {
        name: data.name,
        symbol: data.symbol,
        image: data.tokenImage,
        description: data.description,
        decimals: parseInt(decimals).toFixed(0),
      },
      offchainUri: data.offchainUri,
      amountToMint: toDecimalsBN(data.mintAmount, decimals ?? DEFAULT_DECIMALS),
    };

    async function createJetton () => {
        await jettonDeployController.createJetton(params, tonconnect, walletAddress);
    }*/