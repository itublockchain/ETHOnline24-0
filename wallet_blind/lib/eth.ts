import {ethers} from 'ethers';
import {MMKV} from 'react-native-mmkv';

// ABI's
import WalletABI from '../constants/walletContractABI.json';
import TokenABI from '../constants/tokenContractABI.json';

const storage = new MMKV();

// 1. Provider oluştur
const provider = new ethers.providers.JsonRpcProvider(
  'https://sepolia.infura.io/v3/9d644397ec404822b9226dce044da916',
);

// 2. Private key ile bir cüzdan oluştur ve provider'a bağla
const privateKey = storage.getString('walletAddress'); // Senin private key'in
const wallet = new ethers.Wallet(privateKey as any, provider);

// 3. Kontratın adresi ve ABI'si
const walletContractAddress = '0x17EaB932414d51C861980b3286F9473CF7c69297';
const walletContractABI = WalletABI;
const tokenContractAddress = '0xeF6D72C26aE688D4B3f70868374D717aaFFa34bE';
const tokenContractABI = TokenABI;

// 4. Kontratı bağla
const contract = new ethers.Contract(
  walletContractAddress,
  walletContractABI,
  wallet,
);

const token = new ethers.Contract(
  tokenContractAddress,
  tokenContractABI,
  wallet,
);

// 5. İşlem oluştur ve gönder
async function sendTransaction(amount: number) {
  try {
    // Approve token
    console.log('Approve token start');

    const approveTx = await token.approve(walletContractAddress, amount, {
      gasLimit: ethers.utils.hexlify(100000), // Gas limitini manuel olarak belirledik
    });
    await approveTx.wait();

    console.log('Approve token bitiş');
    console.log('Send mani');

    // Kontratın fonksiyonunu çağır (Örneğin: 'yourFunctionName')
    const txResponse = await contract.sendToken(amount, {
      gasLimit: ethers.utils.hexlify(100000), // Gas limitini manuel olarak belirledik
    }); // Örnek işlem

    console.log('Transaction hash:', txResponse.hash);

    // İşlemin onaylanmasını bekle
    const receipt = await txResponse.wait();
    console.log('Transaction was mined in block:', receipt.blockNumber);
  } catch (error) {
    console.error('Transaction failed:', error);
  }
}

async function claimToken() {}

export {sendTransaction, claimToken};
