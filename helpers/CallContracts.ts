// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values"

// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims"

// Import the ethers library
import { BigNumber, ethers,Wallet } from "ethers";
import{Alert} from 'react-native'
import Constants  from 'expo-constants';


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

//our app server link
export const uri = `http://${Constants.manifest.debuggerHost.split(':').shift()}:3333`;
export const apiGetP = "/getP"
export const apiGetC="/getContractsC"
export const apiGetCC="/getContractsCC"
export const apiAdd = "/addContract"


type AddResponse={
    status:boolean,
    contractaddress:string,
    msg:string
}

type CreateResponse = {
    status:boolean,
    mapid:string,
    alertid:string,
    msg:string
}

const error1="Error"
const error2="Failed"
//our compiles for smart contract 
import mainContractCompile from '../ContractCompiles/Safewaydev.json';
import mapContractCompile from '../ContractCompiles/RoadMap.json';
import alertContractCompile from '../ContractCompiles/RoadAlert.json';

const mainContractAdress = Constants.expoConfig.extra.mainContractAddress;
export const mainContract = new  ethers.Contract(mainContractAdress,mainContractCompile.abi,provider);

const createMapContractFactory = (wallet:Wallet):ethers.ContractFactory=>{
    const mapContractFactory = new ethers.ContractFactory(mapContractCompile.abi,mapContractCompile.bytecode,wallet);
    return mapContractFactory;
}

const createAlertContractFactory = (wallet:Wallet):ethers.ContractFactory=>{
    const alertContractFactory = new ethers.ContractFactory(alertContractCompile.abi,alertContractCompile.bytecode,wallet);
    return alertContractFactory;
}

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
                    Alert.alert('You will be automatically sent back to Main After successful creation!!')
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

//main contract cost
export const mainContractCost =async (wallet:Wallet):Promise<BigNumber> => {
    const res = await mainContract.rate();
    return res;
}


//add new map region
  export const addNewMap = async(price:BigNumber,wallet:Wallet):Promise<AddResponse>=>{
    const key = Constants.expoConfig.extra.API
    //dollar to eth value
    const webres = await fetch("https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=ETH"+"&api_key="+key, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    const res= await webres.json();

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
    console.log(res.ETH+" "+dollars.toString()+ "   "+ethamt);
    const factory = createMapContractFactory(wallet);
    const overrides ={
        value:ethers.utils.parseEther(ethamt.toString())
    }
    const transaction = factory.getDeployTransaction(overrides)
    const gasgasgas = await provider.estimateGas(transaction);
    const accept =  await showAlert("Adding new map region","Estimated cost : "+(dollars)+" dollar , twice or more"+gasgasgas+" gas ");
    
    //Sign with the client operator private key to pay for the transaction and submit the query to a Hedera network
    try{
        if(accept){
            const contract = await factory.deploy(overrides);
            const txReceipt:ethers.ContractReceipt= await contract.deployTransaction.wait();
            
            if(txReceipt.status == 1){
                console.log(txReceipt.contractAddress)
                return{
                    status:true,
                    contractaddress:txReceipt.contractAddress,
                    msg:"RoadMap Contract created"
                }
            }
        }
    }
    catch(err){
        console.log("addNewMap : "+err)
        return{
            status:false,
            contractaddress:undefined,
            msg:"RoadMap Contract payment declined"
        }
    }
    return{
        status:false,
        contractaddress:undefined,
        msg:"RoadMap Contract creation failed"
    }
//v2.0.0
}

//add new hit region
export const addNewAlert = async(amount_per_hit:BigNumber,viewcost:BigNumber,wallet:Wallet,):Promise<AddResponse>=>{
    const factory = createAlertContractFactory(wallet);
    
    
    //Sign with the client operator private key to pay for the transaction and submit the query to a Hedera network
    try{
            
        const contract = await factory.deploy(amount_per_hit,viewcost);
        const txReceipt:ethers.ContractReceipt= await contract.deployTransaction.wait();
        
        if(txReceipt.status == 1){
            console.log(txReceipt.contractAddress)
            return{
                status:true,
                contractaddress:txReceipt.contractAddress,
                msg:"RoadAlert Contract created"
            }
        }
        
    }
    catch(err){
        console.log(err)
        return{
            status:false,
            contractaddress:undefined,
            msg:"RoadAlert  Contract payment declined"
        }
    }
    return{
        status:false,
        contractaddress:undefined,
        msg:"RoadAlert  Contract creation failed"
    }
//v2.0.0
}

//add new hit region
export const connectMapandAlert = async(mapcontractaddress:string,alertaddress:string,wallet:Wallet):Promise<string>=>{
    
    const contract = new ethers.Contract(mapcontractaddress,mapContractCompile.abi,wallet);

    
    
    //Sign with the client operator private key to pay for the transaction and submit the query to a Hedera network
    try{
        let tx = await contract.addAlert(alertaddress);
        let txReceipt = await tx.wait();
        if(txReceipt.status ==1){
            return "Success"
        }
    }
    catch(err){
        console.log(err)
        return error1;
    }
    return error2;
//v2.0.0
}

//create new contract
//add new hit region
export const createNewContract = async(viewcost:BigNumber,price:BigNumber,amount_per_hit:BigNumber,wallet:Wallet):Promise<CreateResponse>=>{

   
   console.log("createNewContract")
    
    //Sign with the client operator private key to pay for the transaction and submit the query to a Hedera network
    try{
        const response = await  addNewMap(price,wallet)
        if(!response.status){
            return{
                status:false,
                mapid:undefined,
                alertid:undefined,
                msg:response.msg
            }
        }
        else{
            const secondresponse = await addNewAlert(amount_per_hit,viewcost,wallet);
            if(!secondresponse.status){
                return{
                    status:false,
                    mapid:undefined,
                    alertid:undefined,
                    msg:secondresponse.msg
                }
            }
            else{
                const thirdresponse = await connectMapandAlert(response.contractaddress,secondresponse.contractaddress,wallet);
                if(thirdresponse == error1 || thirdresponse == error2){
                    return{
                        status:false,
                        mapid:undefined,
                        alertid:undefined,
                        msg:thirdresponse
                    }
                }
                else{
                    const mapID = response.contractaddress;
                    const alertID = secondresponse.contractaddress;
                    console.log("IDS : "+mapID+"  : "+alertID)
                    return{
                        status:true,
                        mapid:mapID,
                        alertid:alertID,
                        msg:"success"
                    }
                }
                
            }
        }

    }
    catch(err){
        console.log(err)
        return{
            status:false,
            mapid:undefined,
            alertid:undefined,
            msg:error1
        }
    }
    return{
        status:false,
        mapid:undefined,
        alertid:undefined,
        msg:error1
    }
//v2.0.0
}



