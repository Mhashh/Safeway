// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values"

// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims"

// Import the ethers library
import { ethers,Wallet } from "ethers";
import Constants  from 'expo-constants';

console.log("HERE!!")
// create your client

//our app server link
export const uri = `http://${Constants.manifest.debuggerHost.split(':').shift()}:3333`;
export const apiGetP = "/getP"
export const apiGetC="/getContractsC"
export const apiGetCC="/getContractsCC"
export const apiAdd = "/addContract"

// 2. Define network configurations
const providerRPC = {
  moonbase: {
    name: 'moonbase-alpha',
    rpc: 'https://rpc.api.moonbase.moonbeam.network',
    chainId: 1287, // 0x507 in hex,
  },
};
// 3. Create ethers provider
const provider = new ethers.providers.JsonRpcProvider(
  providerRPC.moonbase.rpc, 
  {
    chainId: providerRPC.moonbase.chainId,
    name: providerRPC.moonbase.name,
  }
);



export type NewAccount={
    wallet:Wallet,
    memonic:string,
    address:string
}

type getpResponse = {
    retString:string,
    pubString:string
}


export const createNewAccount =  () : NewAccount =>{
    const wallet = Wallet.createRandom();
    return{
        wallet:wallet,
        memonic:wallet.mnemonic.phrase,
        address:wallet.publicKey
    }    
}
export const getBalance =async (address:string):Promise<string> => {
    const balance = await provider.getBalance(address);
    const formatted = ethers.utils.formatEther(balance)
    return formatted;

}

//uses 12 word string as input 
export const getAccountClientM = (memonic:string,accid:string) : Wallet =>{

       const wallet = Wallet.fromMnemonic(memonic);
       return wallet;
    
}

//uses key string as input 
export const getAccountClientP = async (privateKey:string,accid:string) : Promise<Wallet> =>{
    const wallet =new Wallet(privateKey,provider);
    return wallet;
}
  