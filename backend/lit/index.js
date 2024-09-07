import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LitNetwork, LIT_RPC } from "@lit-protocol/constants";
import * as ethers from "ethers";
import {
  LitAbility,
  LitActionResource,
  createSiweMessage,
  generateAuthSig,
  LitRLIResource

} from "@lit-protocol/auth-helpers";
import { LocalStorage } from "node-localstorage";
import dotenv from 'dotenv';
//import { LitActions } from "@lit-protocol/lit-js-sdk";

import walletC from "./wallet.json" assert { type: "json" };
import tokenC from "./usdc.json" assert { type: "json" };
import { LitAccessControlConditionResource  } from "@lit-protocol/auth-helpers";
import pkg from '@lit-protocol/auth-helpers';

dotenv.config();

const walletAddress="0xEF43160003bbf15449376D7dc927e0005453a0A2"
const tokenAddress="0x10Fd43ee3312cA637B7020e475865800cD42726A";

async function main() {//connect to lit node
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
  
  const { abi: walletAbi, bytecode: walletBytecode } = walletC;
  const { abi: tokenAbi, bytecode: tokenBytecode } = tokenC;

  try {const accessControlConditions = [
    {
      contractAddress: tokenAddress,
      standardContractType: 'ERC20',
      chain: "sepolia", //bu şüpheli
      method: 'balanceOf',
      parameters: [
        ':userAddress' 
      ],
      returnValueTest: {
        comparator: '>',
        value: 10 
      }
    }
  ]
  
  const accessControlResource= accessControlConditions.toString()


  try {
    const sessionSignatures = await litNodeClient.getSessionSigs({
      chain: "sepolia", //bu yanlış
      expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
      resourceAbilityRequests: [
        {
          resource: new LitActionResource("*"), //conditionlar string olarak atanır
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
    })
  } catch (error) {
    console.error('Error getting session signatures:', error);
  }
  
  
  // buraya kadar authsign ve sessision signature üretildi, actionları execute etmek için bu ikisi gerekli
  //bundan sonra bool olmasına göre gerekli action code imzalanacak
  
  
  
  ;
  const wallet = new ethers.Contract(walletAddress, walletAbi, ethersWallet);
  const token = new ethers.Contract(tokenAddress, tokenAbi, ethersWallet);

  const data = wallet.interface.encodeFunctionData("sendToken", [10]);

  const tx = {
    nonce: ethers.utils.hexlify(await ethersWallet.getTransactionCount()),                
    gasPrice: ethers.utils.hexlify(20000000000),   
    gasLimit: ethers.utils.hexlify(100000),        
    to: wallet.address,                      
    value: ethers.utils.parseEther('0'),           
    data: data,                                  
    chainId: 11155111                                  
  };
  
  
  
  
  const _sendUserlitActionCode = async (receiver,amount) =>  {
    try {
      // approve fonksiyonu gönderilmek istenen amount kadar approve etsin otomatik
      //condition approve edilmiş mi diye kontrol etsin
      //contract çağrısı yapsın
      //imzalasın
      token.connect(ethersWallet).approve(receiver, amount);
      const  sent= await Lit.Actions.callContract("sepolia",
        ethers.utils.serializeTransaction(
          tx,sigShare
        )
      )
  
      //const send= await token.connect(ethersWallet).transferFrom(ethersWallet.address,receiver,amount);
      const sigShare = await LitActions.signEcdsa({
        toSign: sent,
        publicKey,
        sigName: "sendSig",
      });
      const response = await LitActions.setResponse({ response: sent });
  
    } catch (error) {
      LitActions.setResponse({ response: error.message });
      console.error(error);
    }
  };
  
  const sendUserlitActionCode = `(${_sendUserlitActionCode.toString()})();`;
  
  const response = await litNodeClient.executeJs({
    sessionSigs: sessionSignatures,
    code: sendUserlitActionCode,
    jsParams: {
      receiver:"0x2ea745d61Ec841364e89D7635f0f28C605e7f003",
      amount: 10
    }
  });
   
  }
  catch (error) {
    console.log(error);
    console.log("imdat")
  }
  
  }
  

main();

//await litNodeClient.disconnect();




























