import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LitNetwork, LIT_RPC } from "@lit-protocol/constants";
import * as ethers from "ethers";
import {
  LitAbility,
  LitActionResource,
  createSiweMessage,
  generateAuthSig,
} from "@lit-protocol/auth-helpers";
import { LocalStorage } from "node-localstorage";
import dotenv from 'dotenv'

dotenv.config();

const litNodeClient = new LitNodeClient({
  litNetwork: LitNetwork.DatilDev,
  debug: false,
  storageProvider: {
    provider: new LocalStorage("./lit_storage.db"),
}
});
await litNodeClient.connect();


const ethersWallet = new ethers.Wallet(
  process.env.ETHEREUM_PRIVATE_KEY, 
  new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
);


const accessControlConditions = [
  {
    contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    standardContractType: 'ERC20',
    chain: "ethereum",
    method: 'balanceOf',
    parameters: [
      ':userAddress'
    ],
    returnValueTest: {
      comparator: '>',
      value: 10 // bunu nasıl belirteceğim hocam
    }
  }
]

const accessControlResource= accessControlConditions.toString()

const sessionSignatures = await litNodeClient.getSessionSigs({
  chain: "ethereum",
  expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
  resourceAbilityRequests: [
    {
      resource: new LitActionResource(accessControlResource), //conditionlar string olarak atanır
      ability: LitAbility.LitActionExecution,
    },
  ],
  authNeededCallback: async ({
    uri,
    expiration,
    resourceAbilityRequests,
  }) => {
    const toSign = await createSiweMessage({
      uri,
      expiration,
      resources: resourceAbilityRequests,
      walletAddress: await ethersWallet.getAddress(),
      nonce: await litNodeClient.getLatestBlockhash(),
      litNodeClient,
    });

    return await generateAuthSig({
      signer: ethersWallet,
      toSign,
    });
  },
});

// buraya kadar authsign ve sessision signature üretildi, actionları execute etmek için bu ikisi gerekli
//bundan sonra bool olmasına göre gerekli action code imzalanacak


const _approveContractlitActionCode = async () => {
  //
}


const approveContractlitActionCode = `(${_approveContractlitActionCode.toString()})();`;

const _approveUserlitActionCode = async () => {
  //
}


const approveUserlitActionCode = `(${_approveUserlitActionCode.toString()})();`;




await litNodeClient.disconnect();









/*const response = await litNodeClient.executeJs({
  sessionSigs: sessionSignatures,
  code: litActionCode,
  jsParams: {
    receiver: "sdfsdf",
    amount: 1
  }
});  execution için hepsine ayrı yazılacak















/*import * as LitJsSdk from "@lit-protocol/lit-node-client";

import { LitNetwork } from "@lit-protocol/constants";
import { LocalStorage } from "node-localstorage";



litNodeClient = new LitNodeClient({
    litNetwork: LitNetwork.DatilDev,
    // This storageProvider object can be omitted if executing in a browser
    storageProvider: {
        provider: new LocalStorage("./lit_storage.db"),
    },
});

app.locals.litNodeClient = new LitJsSdk.LitNodeClientNodeJs({
  alertWhenUnauthorized: false,
  litNetwork: LitNetwork.Datil,
});
await app.locals.litNodeClient.connect();*/




