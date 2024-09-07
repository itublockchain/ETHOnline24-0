import {
    LitAbility,
    LitAccessControlConditionResource,
    createSiweMessage,
    generateAuthSig,
  } from "@lit-protocol/auth-helpers";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LitNetwork, LIT_RPC } from "@lit-protocol/constants";
import { ethers } from "ethers";
import { LocalStorage } from "node-localstorage";
import dotenv from "dotenv";
dotenv.config();

import walletC from "./wallet.json" assert { type: "json" };
import tokenC from "./usdc.json" assert { type: "json" };

const walletAddress="0xEF43160003bbf15449376D7dc927e0005453a0A2";
const tokenAddress="0x10Fd43ee3312cA637B7020e475865800cD42726A";


const litNodeClient = new LitNodeClient({
    litNetwork: LitNetwork.DatilDev,
    debug: false,
    storageProvider: {
      provider: new LocalStorage("./lit_storage.db"),
  }
  });
  await litNodeClient.connect();
  
  const ethersSigner = new ethers.Wallet(
    process.env.ETHEREUM_PRIVATE_KEY, 
    new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
  );



  
  try{
    const sessionSignatures = await litNodeClient.getSessionSigs({
        chain: "sepolia",
        expiration: new Date(Date.now() + 1000 * 60 * 10 ).toISOString(), // 10 minutes
       // capabilityAuthSigs: [capacityDelegationAuthSig], // Unnecessary on datil-dev
        resourceAbilityRequests: [
          {
            resource: new LitAccessControlConditionResource("*"),
            ability: LitAbility.AccessControlConditionDecryption,
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
            walletAddress: ethersSigner.address,
            nonce: await litNodeClient.getLatestBlockhash(),
            litNodeClient,
          });
      
          return await generateAuthSig({
            signer: ethersSigner,
            toSign,
          });
        },
      });
      console.log(sessionSignatures)

        const { abi: walletAbi, bytecode: walletBytecode } = walletC;
        const { abi: tokenAbi, bytecode: tokenBytecode } = tokenC;

        const wallet = new ethers.Contract(walletAddress, walletAbi, ethersSigner);
        const token = new ethers.Contract(tokenAddress, tokenAbi, ethersSigner);

        const data = wallet.interface.encodeFunctionData("sendToken", [10]);

        const tx = {
            nonce: ethers.utils.hexlify(await ethersSigner.getTransactionCount()),                
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
              token.connect(ethersSigner).approve(receiver, amount);
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

          try{
            const response = await litNodeClient.executeJs({
              sessionSigs: sessionSignatures,
              code: sendUserlitActionCode,
              jsParams: {
                receiver:"0x2ea745d61Ec841364e89D7635f0f28C605e7f003",
                amount: 10
              }
            });
            console.log(response)
          }
          catch(error){
            console.log(error);
          }
          


  }
  catch(error){
   // console.log(error);
   
  }