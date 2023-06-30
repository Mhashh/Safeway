import { AccountId, Client, ContractCallQuery, ContractCreateTransaction, ContractFunctionParameters, ContractId, Hbar,  } from '@hashgraph/sdk';
import {client} from './DevClient';
import { Alert } from 'react-native';
import { BigNumber } from '@hashgraph/sdk/lib/Transfer';
import Constants from 'expo-constants';

const mainContractId = Constants.expoConfig.extra.mainContractId
const roadMapFileId= Constants.expoConfig.extra.roadMapFileId
const roadAlertFileId= Constants.expoConfig.extra.roadAlertFileId

const error1 = "transaction failed";
const error2 = "transaction cancelled";

export type AddResponse = {
    status:boolean,
    contractid:ContractId|undefined,
    contractaddress:string|undefined,
    msg:string
}


export type CreateResponse = {
    status:boolean,
    mapid:string|undefined,
    alertid:string|undefined,
    msg:string
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

export const mainContractCost = async(userclient:Client):Promise<BigNumber> =>{
    
     //Create the contract query
     const query = new ContractCallQuery()
     .setContractId(mainContractId)
     .setGas(100_000)
     .setFunction("rate");
    
     //Sign with the client operator private key to pay for the transaction and submit the query to a Hedera network
     const response = await query.execute(userclient);
     
     
     //Get the transaction consensus status
     const cost = response.getUint256(0);
     const amt = Hbar.fromTinybars(cost);
     return amt.toBigNumber();
}

//add new map region
  export const addNewMap = async(viewcost:BigNumber,price:BigNumber,userClient:Client):Promise<AddResponse>=>{
    //Create the query
    const query = new ContractCreateTransaction()
    .setBytecodeFileId(roadMapFileId)
    .setGas(10_000_000)
    .setConstructorParameters(new ContractFunctionParameters()
        .addUint256(viewcost))
    .setInitialBalance(price);

    const accept =  await showAlert("Adding new map region","Estimated cost : "+price.toString()+" hbar plus 11 hbar");
    
    //Sign with the client operator private key to pay for the transaction and submit the query to a Hedera network
    try{
        if(accept){
            const response = (await query.execute(userClient));
            console.log("RESPONSE addNewMap tid : "+response.transactionId.toString())
            const reciept = await response.getReceipt(userClient);
            
            
            return{
                status:true,
                contractid:reciept.contractId,
                contractaddress:reciept.contractId.toSolidityAddress(),
                msg:"RoadMap Contract created"
            }
        }
    }
    catch(err){
        console.log(err)
        return{
            status:false,
            contractid:undefined,
            contractaddress:undefined,
            msg:"RoadMap Contract payment declined"
        }
    }
    return{
        status:false,
        contractid:undefined,
        contractaddress:undefined,
        msg:"RoadMap Contract creation failed"
    }
//v2.0.0
}

//add new hit region
export const addNewAlert = async(amount_per_hit:BigNumber,userClient:Client,):Promise<AddResponse>=>{
    //Create the query
    const query = new ContractCreateTransaction()
    .setBytecodeFileId(roadAlertFileId)
    .setGas(10_000_000)
    .setConstructorParameters(new ContractFunctionParameters()
        .addUint256(amount_per_hit));

   
    
    //Sign with the client operator private key to pay for the transaction and submit the query to a Hedera network
    try{
            const response = (await query.execute(userClient));
            console.log("RESPONSE addNewAlert  tid : "+response.transactionId.toString())
            const reciept = await response.getReceipt(userClient);

            return{
                status:true,
                contractid:reciept.contractId,
                contractaddress:reciept.contractId.toSolidityAddress(),
                msg:"RoadAlert Contract created"
            }
    }
    catch(err){
        console.log(err)
        return{
            status:false,
            contractid:undefined,
            contractaddress:undefined,
            msg:"RoadAlert Contract creation failed"
        }
    }
    return{
        status:false,
        contractid:undefined,
        contractaddress:undefined,
        msg:"RoadAlert Contract creation failed"
    }
//v2.0.0
}

//add new hit region
export const connectMapandAlert = async(mapcontractid:ContractId|string,address:string,userClient:Client,):Promise<string>=>{
    //Create the query
    const query = new ContractCallQuery()
    .setContractId(mapcontractid)
    .setGas(10_000_000)
    .setFunction("addAlert",new ContractFunctionParameters()
        .addAddress("0x"+address));

   
    
    //Sign with the client operator private key to pay for the transaction and submit the query to a Hedera network
    try{
            const response = (await query.execute(userClient));
            console.log("RESPONSE connectMapandAlert  gas used : "+response.gasUsed.toString())
            return "Success"
    }
    catch(err){
        console.log(err)
        return error1
    }
    return error2
//v2.0.0
}

//create new contract
//add new hit region
export const createNewContract = async(viewcost:BigNumber,price:BigNumber,amount_per_hit:BigNumber,userClient:Client):Promise<CreateResponse>=>{
    
   
    
    //Sign with the client operator private key to pay for the transaction and submit the query to a Hedera network
    try{
        const response = await  addNewMap(viewcost,price,userClient)
        if(!response.status){
            return{
                status:false,
                mapid:undefined,
                alertid:undefined,
                msg:response.msg
            }
        }
        else{
            const secondresponse = await addNewAlert(amount_per_hit,userClient);
            if(!secondresponse.status){
                return{
                    status:false,
                    mapid:undefined,
                    alertid:undefined,
                    msg:secondresponse.msg
                }
            }
            else{
                const thirdresponse = await connectMapandAlert(response.contractid,secondresponse.contractaddress,userClient);
                if(thirdresponse == error1 || thirdresponse == error2){
                    return{
                        status:false,
                        mapid:undefined,
                        alertid:undefined,
                        msg:thirdresponse
                    }
                }
                else{
                    const mapID = response.contractid.toStringWithChecksum(userClient).split("-")[0];
                    const alertID = secondresponse.contractid.toStringWithChecksum(userClient).split("-")[0];
                    console.log("IDS : "+mapID+"  : "+alertID)
                    return{
                        status:false,
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



