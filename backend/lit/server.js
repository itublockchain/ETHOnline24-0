import express from 'express';

import bodyParser from 'body-parser';

import dotenv from 'dotenv';

import { ethers } from 'ethers';

import { LitNodeClient, LitNetwork, LitAccessControlConditionResource, newSessionCapabilityObject, LitAbility, createSiweMessage, generateAuthSig } from '@lit-protocol/lit-node-client';

dotenv.config();

const app = express();

app.use(bodyParser.json());

const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_RPC_URL);

const signer = new ethers.Wallet(process.env.ETHEREUM_PRIVATE_KEY, provider);

const litNodeClient = new LitNodeClient({

litNetwork: LitNetwork.DatilDev,

debug: false,

});

await litNodeClient.connect();

const walletAddress = "0xEF43160003bbf15449376D7dc927e0005453a0A2";

const tokenAddress = "0x10Fd43ee3312cA637B7020e475865800cD42726A";

app.post('/send', async (req, res) => {

try {

const { receiver, amount } = req.body;

const sessionCapabilityObject = newSessionCapabilityObject();

const litResource = new LitAccessControlConditionResource([

{

contractAddress: tokenAddress,

standardContractType: 'ERC20',

chain: 'sepolia',

method: 'balanceOf',

parameters: [':userAddress'],

returnValueTest: {

comparator: '>',

value: 10,

},

},

]);

sessionCapabilityObject.addAllCapabilitiesForResource(litResource, [LitAbility.LitActionExecution]);

const sessionSignatures = await litNodeClient.getSessionSigs({

chain: 'sepolia',

expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(),

resourceAbilityRequests: [{ resource: litResource, ability: LitAbility.LitActionExecution }],

authNeededCallback: async ({ uri, expiration, resourceAbilityRequests }) => {

const toSign = await createSiweMessage({

uri,

expiration,

resources: resourceAbilityRequests,

walletAddress: signer.address,

nonce: await litNodeClient.getLatestBlockhash(),

litNodeClient,

});

return await generateAuthSig({

signer,

toSign,

});

},

});

const data = new ethers.utils.Interface(walletAbi).encodeFunctionData('sendToken', [amount]);

const tx = {

nonce: await signer.getTransactionCount(),

gasPrice: ethers.utils.parseUnits('20', 'gwei'),

gasLimit: 100000,

to: walletAddress,

value: ethers.utils.parseEther('0'),

data: data,

chainId: 11155111, // Sepolia chain ID

};

const sent = await Lit.Actions.callContract('sepolia', ethers.utils.serializeTransaction(tx));

const sigShare = await Lit.Actions.signEcdsa({

toSign: sent,

publicKey: '0xf87B527E48Fa650b802076d3be28cce4Fa499Ebe',

sigName: 'sendSig',

});

await Lit.Actions.setResponse({ response: sigShare });

res.status(200).json({ message: 'Transaction sent successfully' });

} catch (error) {

res.status(500).json({ error: error.message });

}

});

app.listen(3000, () => {

console.log('Server running on port 3000');

});