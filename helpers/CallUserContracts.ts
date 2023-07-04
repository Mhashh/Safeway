// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values"

// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims"

// Import the ethers library
import { BigNumber, Contract, ethers,Wallet } from "ethers";
import{Alert} from 'react-native'
import { LatLng } from 'react-native-maps';
import Constants  from 'expo-constants';
import mapContractCompile from '../ContractCompiles/RoadMap.json';
import alertContractCompile from '../ContractCompiles/RoadAlert.json';

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


//dialog box before any query showing cost
const showAlert = (header:string,detail:string) : Promise<boolean>=>{
    return new Promise((resolve,reject)=>{
        Alert.alert(
            header,
            detail,
            [
            {
                text: 'Pay',
                onPress: () =>{
                    Alert.alert('Transaction proceeds..')
                    resolve(true)
                    },
                style: 'default',
            },
            {
                text: 'Cancel',
                onPress: () => {
                    Alert.alert('Transaction canceled');
                        resolve(false);
                    },
                style: 'default',
            }
            ],
            {
            cancelable: false,
            },
        );}
    )
}

type Earned = {
    value:string,
    status:boolean
}

export const viewcost = async(contractAddress:string,wallet:Wallet):Promise<BigNumber>=>{

    //new contact
    const contract = new  ethers.Contract(contractAddress,mapContractCompile.abi,provider);
    try{
        const value = await contract.viewcost();
        return value;
    }
    catch(err){
        const errValue =  BigNumber.from(-1);
        return errValue;
    }
}

// can be used for both map and alert count of map polygon or road alerts
export const hits = async(contractAddress:string,wallet:Wallet):Promise<number>=>{

    //new contact
    const contract = new  ethers.Contract(contractAddress,mapContractCompile.abi,provider);
    try{
        const value = await contract.hits();
        return value;
    }
    catch(err){
        return 0;
    }
}

  
//send hits location to contracts
export const detected = async(contractAddress:string,longitude:number,latitude:number,wallet:Wallet):Promise<boolean>=>{

    //new contact
    const contract = new  ethers.Contract(contractAddress,mapContractCompile.abi,provider);
    try{
        const tx:ethers.providers.TransactionResponse= await contract.detected(longitude*1000000,latitude);
        const txR:ethers.providers.TransactionReceipt = await tx.wait();
        if(txR.status==0){
            return false
        }
        return true
    }
    catch(err){
        console.log(err)
    }
   return false;
}


//add map region points
export const addToPolygon = async(contractAddress:string,longitude:number,latitude:number,wallet:Wallet):Promise<boolean>=>{

    //new contact
    const contract = new  ethers.Contract(contractAddress,mapContractCompile.abi,provider);
    try{
        const tx:ethers.providers.TransactionResponse= await contract.addToPolygon(longitude*1000000,latitude*1000000);
        const txR:ethers.providers.TransactionReceipt = await tx.wait();
        if(txR.status==0){
            return false
        }
        return true
    }
    catch(err){
        console.log(err)
    }
   return false;
}

//view polygon 
export const polygon = async(contractAddress:string,index:number,wallet:Wallet):Promise<LatLng|undefined>=>{

     //new contact
     const contract = new  ethers.Contract(contractAddress,mapContractCompile.abi,provider);
     try{
         const res= await contract.polygon(index);
         if(res.longitude !== undefined){
            return{
                longitude:res[0]/1000000,
                latitude:res[1]/1000000
            }
         }
     }
     catch(err){
        console.log(err)
     }


    return undefined;
}

//view alert points  for owner
export const getMarker = async(contractAddress:string,index:number,wallet:Wallet):Promise<LatLng|undefined>=>{

    //new contact
    const contract = new  ethers.Contract(contractAddress,mapContractCompile.abi,provider);
    try{
        const res= await contract.getMarker(index);
        if(res.longitude !== undefined){
           return{
               longitude:res[0],
               latitude:res[1]
           }
        }
    }
    catch(err){
       console.log(err)
    }


   return undefined;
}


//view alert points  payment by user other than owner
export const viewMarkers = async(contractAddress:string,price:BigNumber,wallet:Wallet):Promise<boolean>=>{

    //new contact
    const contract = new  ethers.Contract(contractAddress,mapContractCompile.abi,provider);
    try{
        const overrides={
            value:price,
            gasLimit:100000
        }

        const accept =  await showAlert("Subscribing for one day to view  hits","Estimated cost : "+(overrides.value)+"  wei, Pay?");
        if(accept){
            const tx:ethers.providers.TransactionResponse= await contract.detected(overrides);
            const txR:ethers.providers.TransactionReceipt = await tx.wait();
            if(txR.status==0){
                return false
            }
            return true
        }
    }
    catch(err){
        console.log(err)
    }
   return false;
}


//view  alert points for others
export const viewMarker = async(contractAddress:string, index :number,wallet:Wallet):Promise<LatLng|undefined>=>{

    //new contact
    const contract = new  ethers.Contract(contractAddress,alertContractCompile.abi,provider);
    try{
        const res= await contract.viewMarker(index);
        if(res.longitude !== undefined){
           return{
               longitude:res[0],
               latitude:res[1]
           }
        }
    }
    catch(err){
       console.log(err);
    }


    return undefined;
}