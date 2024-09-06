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

const litNodeClient = new LitNodeClient({
  litNetwork: LitNetwork.DatilDev,
  debug: false
});
await litNodeClient.connect();

console.log(LIT_RPC.CHRONICLE_YELLOWSTONE);  // undefined değil ancak sorun çıkarıyor


const ethersWallet = new ethers.Wallet(
  process.env.ETHEREUM_PRIVATE_KEY, // Replace with your private key
  new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
);

const sessionSignatures = await litNodeClient.getSessionSigs({
  chain: "ethereum",
  expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
  resourceAbilityRequests: [
    {
      resource: new LitActionResource("*"),
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
await app.locals.litNodeClient.connect();




const accessControlConditions = [
    {
      contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      standardContractType: 'ERC20',
      chain,
      method: 'balanceOf',
      parameters: [
        ':userAddress'
      ],
      returnValueTest: {
        comparator: '>',
        value: sendAmount
      }
    }
  ]*/
  