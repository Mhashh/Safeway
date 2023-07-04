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
                    Alert.alert('May take 2-3 mins..')
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
            cancelable: true,
            },
        );}
    )
}

type Earned = {
    value:string,
    status:boolean
}

//alert
export const viewcost = async(contractAddress:string,wallet:Wallet):Promise<BigNumber>=>{
    console.log("view");
    //new contact
    const contract = new  ethers.Contract(contractAddress,alertContractCompile.abi,provider);
    try{
        const value = await contract.viewcost();
        console.log(value);
        return value;
    }
    catch(err){
        console.log(err)
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

// can be used for both map and alert count of map polygon or road alerts
export const hitsA= async(contractAddress:string,wallet:Wallet):Promise<number>=>{
    console.log("hitsA"+contractAddress);
    //new contact
    const contract = new  ethers.Contract(contractAddress,alertContractCompile.abi,provider);
    try{
        const value = await contract.hits();
        console.log(value);
        return value;
    }
    catch(err){
        console.log(err)
        return 0;
    }
}

  
//send hits location to contracts
export const detected = async(contractAddress:string,longitude:number,latitude:number,wallet:Wallet):Promise<boolean>=>{

    //new contact
    const contract = new  ethers.Contract(contractAddress,alertContractCompile.abi,wallet);
    try{
        let ln  = longitude*1000000;
        let lt = latitude*1000000;
        ln = Number.parseInt(ln.toFixed(0))
        lt = Number.parseInt(lt.toFixed(0))
        const overrides={
            gasLimit:100000
        }
        const tx:ethers.providers.TransactionResponse= await contract.detected(ln,lt,overrides);
        const txR:ethers.providers.TransactionReceipt = await tx.wait();
        console.log("detected : "+txR.status)
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
    const contract = new  ethers.Contract(contractAddress,mapContractCompile.abi,wallet);
    try{
        let ln  = longitude*1000000;
        let lt = latitude*1000000;
        ln = Number.parseInt(ln.toFixed(0))
        lt = Number.parseInt(lt.toFixed(0))
        const overrides={
            gasLimit:100000
        }

        const tx:ethers.providers.TransactionResponse= await contract.addToPolygon(ln,lt,overrides);
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
    const contract = new  ethers.Contract(contractAddress,alertContractCompile.abi,wallet);
    try{
        const res= await contract.getMarker(index);
       console.log(res)
           return{
               longitude:res[0]/1000000,
               latitude:res[1]/1000000
           }
        
    }
    catch(err){
       console.log(err)
    }


   return undefined;
}


//view alert points  payment by user other than owner
export const viewMarkers = async(contractAddress:string,price:BigNumber,wallet:Wallet):Promise<boolean>=>{
    try{
        console.log("viewMarkers")
        const key = Constants.expoConfig.extra.API
        //dollar to eth value
        const webres = await fetch("https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=ETH"+"&api_key="+key, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
        })
        const res:{ETH:number}= await webres.json();

        let dollars;
        const power = BigNumber.from("1000000000000000000")
        if(price.lt(power)){
            const exp = power.div(price).toNumber();
            dollars = 1/exp;
        }else{
            const exp = price.div(power).toNumber();
            dollars =  exp;
        }
        const ethamt = dollars*res.ETH;
        //new contact
        const contract = new  ethers.Contract(contractAddress,alertContractCompile.abi,wallet);
        console.log(dollars+"  "+price+" "+ethamt)
        const overrides={
            value:ethers.utils.parseEther(ethamt.toFixed(8))
        }

        const accept =  await showAlert("Subscribing for one day to view  hits","Estimated cost : "+dollars+"  dollars, Pay?");
        if(accept){
            const tx:ethers.providers.TransactionResponse= await contract.viewMarkers(overrides);
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
    const contract = new  ethers.Contract(contractAddress,alertContractCompile.abi,wallet);
    try{
        const res= await contract.viewMarker(index);
        
           return{
               longitude:res[0]/1000000,
               latitude:res[1]/1000000
           }
        
    }
    catch(err){
       console.log(err);
    }


    return undefined;
}

//withdraw from map contract
export const withdraw = async(contractAddress:string,wallet:Wallet):Promise<boolean>=>{

    //new contact
    const contract = new  ethers.Contract(contractAddress,mapContractCompile.abi,wallet);
    try{

        const accept =  await showAlert("Withdraw","Withdrawing will remove the current contract, continue ?");
        if(accept){
            const tx:ethers.providers.TransactionResponse= await contract.withdraw();
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

//withdraw from alert contract
export const withdrawA = async(contractAddress:string,wallet:Wallet):Promise<boolean>=>{

    //new contact
    const contract = new  ethers.Contract(contractAddress,alertContractCompile.abi,wallet);
    try{

        const accept =  await showAlert("Withdraw","Withdrawing will remove the current contract, continue ?");
        if(accept){
            const tx:ethers.providers.TransactionResponse= await contract.withdraw();
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

//add fund to alert contract
export const addFund = async(contractAddress:string,amount:string,wallet:Wallet):Promise<boolean>=>{

    
    try{

        const accept =  await showAlert("Add amount "+amount+"eth"," continue ?");
        if(accept){
            const tx={
                to:contractAddress,
                value:ethers.utils.parseEther(amount)
            }
            const res = await wallet.sendTransaction(tx);
            const rec = await res.wait();
            if(rec.status==0){
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