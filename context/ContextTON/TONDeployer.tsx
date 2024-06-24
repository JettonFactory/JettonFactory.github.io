import { Address } from "ton";
import { jettonDeployController, JettonDeployParams } from "./lib/deploy-controller";
import WalletConnection from "./services/wallet-connection";
import { createDeployParams } from "./lib/utils";
import { ContractDeployer } from "./lib/contract-deployer";
import { toDecimalsBN } from "./utils";

const DEFAULT_DECIMALS = 9;

  const deployContract = async (walletAddress: any, tonconnect: any, data:any) => {

    let decimals = "8";

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
    const deployParams = createDeployParams(params, data.offchainUri);
    const contractAddress = new ContractDeployer().addressForContract(deployParams);
    const isDeployed = await WalletConnection.isContractDeployed(contractAddress);
    if (isDeployed) { console.log("contract already deployed")
      return;
    }

    const result = await jettonDeployController.createJetton(params, tonconnect, walletAddress);
      
    console.log("Contract Address:", result.contractAddr);
    console.log("Owner Jetton Wallet Address:", result.ownerJWalletAddr);


    return result;
  }

  const DetailsToken = async (walletAddress:any, tonconnect:any, contractAddress:any, data:any, fromAddress:any, amount:any, ownerJettonWallet:any) => {
    const tx_hash = await jettonDeployController.upMetaBurnAdm( contractAddress, 
      tonconnect,
      walletAddress,
      fromAddress,
      toDecimalsBN(amount, DEFAULT_DECIMALS),
      ownerJettonWallet,
      data 
    )
      console.log('Admin renunciado correctamente:');
    return tx_hash;
  }
export { deployContract, DetailsToken };




