import ethers from "ethers";
import dotenv from "dotenv";
dotenv.config();

import walletC from "./lit/wallet.json" assert { type: "json" };
import tokenC from "./lit/usdc.json" assert { type: "json" };



const { abi: walletAbi, bytecode: walletBytecode } = walletC;
const { abi: tokenAbi, bytecode: tokenBytecode } = tokenC;
const ethersWallet = new ethers.Wallet(
  process.env.ETHEREUM_PRIVATE_KEY, 
  new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_PROVIDER_URL)
);
//doeploy necessary contracts
const Token= new ethers.ContractFactory(tokenAbi,tokenBytecode,ethersWallet);
const token= await Token.connect(ethersWallet).deploy("USDC","USDC");


const Wallet= new ContractFactory(walletAbi,walletBytecode,ethersWallet);
const wallet= await Wallet.connect(ethersWallet).deploy(token.address);

wallet.connect(ethersWallet).claim(ethersWallet.address,10);