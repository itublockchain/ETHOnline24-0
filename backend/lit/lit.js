import {

    LitAbility,
    
    LitAccessControlConditionResource,
    
    createSiweMessage,
    
    generateAuthSig,
    
    newSessionCapabilityObject
    
    } from "@lit-protocol/auth-helpers";
    
    import { disconnectWeb3, LitNodeClient } from "@lit-protocol/lit-node-client";
    
    import { LitNetwork, LIT_RPC } from "@lit-protocol/constants";
    
    import { ethers } from "ethers";
    
    import { LocalStorage } from "node-localstorage";
    
    import dotenv from "dotenv";
    
    dotenv.config();
    
    import { PinataSDK } from "pinata";
    
    const pinata = new PinataSDK({
    
    pinataJwt: process.env.PINATA_JWT,
    
    pinataGateway: "https://aquamarine-tropical-armadillo-804.mypinata.cloud/",
    
    });
    
    const file = await pinata.gateways.get(process.env.LIT_ACTION_IPFS_CID);
    
    let sendID=0;
    
    import walletC from "./wallet.json" assert { type: "json" };
    
    import tokenC from "./usdc.json" assert { type: "json" };
    
    const walletAddress="0xEF43160003bbf15449376D7dc927e0005453a0A2";
    
    const tokenAddress="0x10Fd43ee3312cA637B7020e475865800cD42726A";
    
    const litNodeClient = new LitNodeClient({
    
    litNetwork: LitNetwork.DatilDev,
    
    debug: false,
    
    });
    
    await litNodeClient.connect();
    
    const ethersSigner = new ethers.Wallet(
    
    process.env.ETHEREUM_PRIVATE_KEY,
    
    new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
    
    );
    
    console.log(ethersSigner.address);
    
    try{
    
    const sessionCapabilityObject = newSessionCapabilityObject();
    
    const litResource = new LitAccessControlConditionResource([
    
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
    
    ]);
    
    console.log("Resource: ", litResource);
    
    sessionCapabilityObject.addAllCapabilitiesForResource(litResource, [
    
    LitAbility.LitActionExecution,
    
    ]);
    
    // Access the resourceAbilityRequests directly
    
    const resourceAbilityRequests =
    
    sessionCapabilityObject.resourceAbilityRequests;
    
    console.log("Resource Ability Requests: ", resourceAbilityRequests);
    
    if (!resourceAbilityRequests) {
    
    throw new Error("Resource Ability Requests is undefined.");
    
    }
    
    console.log("try")
    
    const sessionSignatures = await litNodeClient.getSessionSigs({
    
    chain: "sepolia",
    
    expiration: new Date(Date.now() + 1000 * 60 * 10 ).toISOString(), // 10 minutes
    
    // capabilityAuthSigs: [capacityDelegationAuthSig], // Unnecessary on datil-dev
    
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
    
    console.log("authNeededCallback")
    
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
    
    const _sendUserlitActionCode = async (receiver, amount) => {
    
    try {
    
    // Approve işlemini yaparken await kullanın
    
    await token.connect(ethersSigner).approve(receiver, amount);
    
    // Contract çağrısını yapın (tx burada tanımlı olmalı)
    
    const tx = {
    
    nonce: ethers.utils.hexlify(await ethersSigner.getTransactionCount()),
    
    gasPrice: ethers.utils.hexlify(20000000000),
    
    gasLimit: ethers.utils.hexlify(100000),
    
    to: wallet.address,
    
    value: ethers.utils.parseEther('0'),
    
    data: data,
    
    chainId: 11155111
    
    };
    
    const sent = await Lit.Actions.callContract(
    
    "sepolia",
    
    ethers.utils.serializeTransaction(tx) // sigShare burada gerekmez
    
    );
    
    const sigShare = await LitActions.signEcdsa({
    
    toSign: sent,
    
    publicKey:"0xf87B527E48Fa650b802076d3be28cce4Fa499Ebe", // Bu publicKey daha önce tanımlanmış olmalı
    
    sigName: "sendSig",
    
    });
    
    const response = await LitActions.setResponse({ response: sigShare });
    
    } catch (error) {
    
    await LitActions.setResponse({ response: error.message });
    
    console.error(error);
    
    }
    
    };
    
    const sendUserlitActionCode = `(${_sendUserlitActionCode.toString()})();`;
    
    try{
    
    await litNodeClient.executeJs({
    
    sessionSigs: sessionSignatures,
    
    code: sendUserlitActionCode,
    
    jsParams: {
    
    receiver:"0x2ea745d61Ec841364e89D7635f0f28C605e7f003",
    
    amount: 10
    
    },
    
    ipfsId:process.env.LIT_ACTION_IPFS_CID,
    
    });
    
    console.log(response)
    
    }
    
    catch(error){
    
    console.log(error);
    
    }
    
    async function claim(address){
    
    await walletContract.claim(address,sendID);
    
    }
    
    }
    
    catch(error){
    
    // console.log(error);
    
    }
    
    /*[
    
    {
    
    resource: new LitActionResource('QmXSRNe8jH97UTXuM4YGw9z4fzQbACeoQhWvqkb45iDcFx'),
    
    ability: LitAbility.LitActionExecution,
    
    },
    
    {
    
    resource: new LitAccessControlConditionResource(accsResourceString),
    
    ability: LitAbility.AccessControlConditionDecryption,
    
    }
    
    ]*/