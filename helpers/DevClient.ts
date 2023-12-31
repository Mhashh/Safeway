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
export const uri = `http://${Constants.expoConfig.extra.URL}`;
export const apiGetP = "/getP"
export const apiGetC="/getContracts"
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
    let wallet = Wallet.createRandom();
    wallet = wallet.connect(provider);
    return{
        wallet:wallet,
        memonic:wallet.mnemonic.phrase,
        address:wallet.publicKey
    }    
}
export const getBalance =async (address:string):Promise<string> => {
  console.log("getBalance( "+address+" )")
    try{
      const balance = await provider.getBalance(address);
      console.log("getBalance( "+address+" ) : "+balance)
      const formatted = ethers.utils.formatEther(balance)
      return formatted;
    }
    catch(err){
      console.log(err)
    }
    return "unable to load";  

}

//uses 12 word string as input 
export const getAccountClientM = async(memonic:string) : Promise<Wallet> =>{

       let wallet = Wallet.fromMnemonic(memonic);
       wallet = wallet.connect(provider);
      console.log("middle")
       return wallet;
    
}

//uses key string as input 
export const getAccountClientP = async (privateKey:string) : Promise<Wallet> =>{
    const wallet =new Wallet(privateKey,provider);
    return wallet;
}
  