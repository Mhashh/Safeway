import { AccountId, Client, ContractCallQuery, ContractExecuteTransaction, ContractFunctionParameters, ContractId, Hbar, HbarUnit, Status } from '@hashgraph/sdk';
import {client} from './DevClient';
import { Alert } from 'react-native';
import { BigNumber } from '@hashgraph/sdk/lib/Transfer';
import { LatLng } from 'react-native-maps';

const mainContractId = "";

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

export const viewcost = async(newContractId:string,userClient:Client):Promise<string>=>{

    //Create the contract query
    const query = new ContractCallQuery()
    .setContractId(newContractId)
    .setGas(100_000_000)
    .setFunction("viewcost");

    //Sign with the client operator private key to pay for the transaction and submit the query to a Hedera network
    const response = await query.execute(userClient);


    //Get the transaction consensus status
    const amt = response.getUint256(0);
    const amth = Hbar.from(amt,HbarUnit.Tinybar).toString();
    return amth;
}

export const hits = async(newContractId:string,userClient:Client):Promise<number>=>{

    //Create the contract query
    const query = new ContractCallQuery()
    .setContractId(newContractId)
    .setGas(100_000_000)
    .setFunction("hits");

    //Sign with the client operator private key to pay for the transaction and submit the query to a Hedera network
    const response = await query.execute(userClient);


    //Get the transaction consensus status
    const amt = response.getUint32(0);
    return amt;
}

  
//send hits location to contracts
export const detected = async(newContractId:string,longitude:number,latitude:number,userClient:Client):Promise<string>=>{

    //Create the contract query
    const query = new ContractCallQuery()
    .setContractId(newContractId)
    .setGas(100_000_000)
    .setFunction("detected", new ContractFunctionParameters()
        .addInt32(longitude*1000000)
        .addInt32(latitude*1000000));

    //Sign with the client operator private key to pay for the transaction and submit the query to a Hedera network
    const response = await query.execute(userClient);


    //Get the transaction consensus status
    const transactionStatus = response.logs.toString();
    return transactionStatus;
}


//add map region points
export const addToPolygon = async(newContractId:string,longitude:number,latitude:number,userClient:Client):Promise<string>=>{

    //Create the contract query
    const query = new ContractCallQuery()
    .setContractId(newContractId)
    .setGas(100_000_000)
    .setFunction("addToPolygon", new ContractFunctionParameters()
        .addInt32(longitude)
        .addInt32(latitude));

    //Sign with the client operator private key to pay for the transaction and submit the query to a Hedera network
    const response = await query.execute(userClient);


    //Get the transaction consensus status
    const transactionStatus = response.logs.toString();
    return transactionStatus;
}

//view hits for owner
export const polygon = async(newContractId:string,index:number,userClient:Client):Promise<LatLng|undefined>=>{

    //Create the contract query
    const query = new ContractCallQuery()
    .setContractId(newContractId)
    .setGas(100_000_000)
    .setFunction("polygon",new ContractFunctionParameters()
        .addUint32(index));

    //Sign with the client operator private key to pay for the transaction and submit the query to a Hedera network
    const response = await query.execute(userClient);

    if(response.errorMessage.length!=0){
        return undefined;
    }
    //Get the transaction consensus status
    const longitude = response.getInt32(0)/1000000;
    const latitude = response.getInt32(1)/1000000;


    return {
        latitude:latitude,
        longitude:longitude
    };
}

//view hits for owner
export const getMarker = async(newContractId:string,index:number,userClient:Client):Promise<LatLng|undefined>=>{

    //Create the contract query
    const query = new ContractCallQuery()
    .setContractId(newContractId)
    .setGas(100_000_000)
    .setFunction("getMarker",new ContractFunctionParameters()
        .addUint32(index));

    //Sign with the client operator private key to pay for the transaction and submit the query to a Hedera network
    const response = await query.execute(userClient);

    if(response.errorMessage.length!=0){
        return undefined;
    }
    //Get the transaction consensus status
    const longitude = response.getInt32(0)/1000000;
    const latitude = response.getInt32(1)/1000000;


    return {
        latitude:latitude,
        longitude:longitude
    };
}


//view hits payment
export const viewMarkers = async(newContractId:string,price:number,userClient:Client):Promise<string>=>{

    //Create the query
    const query = new ContractExecuteTransaction()
    .setContractId(mainContractId)
    .setGas(100_000_000)
    .setFunction("set_message")
    .setPayableAmount(new Hbar(price));

    const accept =  await showAlert("Adding new map region","Estimated cost : "+price.toString()+" hbar and 0.05$");

    //Sign with the client operator private key to pay for the transaction and submit the query to a Hedera network
    try{
        if(accept){
            const response = (await query.execute(userClient));
            const rec = await response.getReceipt(userClient);
            return rec.status.toString();
        }
    }
    catch(err){
        return "transaction failed."
    }
    return "transaction canceled."
}

//view hits for others
export const viewMarker = async(newContractId:string,userClient:Client):Promise<LatLng|undefined>=>{

    //Create the contract query
    const query = new ContractCallQuery()
    .setContractId(newContractId)
    .setGas(100_000_000)
    .setFunction("viewMarker");

    //Sign with the client operator private key to pay for the transaction and submit the query to a Hedera network
    const response = await query.execute(userClient);

    if(response.errorMessage.length!=0){
        return undefined;
    }
    //Get the transaction consensus status
    const longitude = response.getInt32(0)/1000000;
    const latitude = response.getInt32(1)/1000000;


    return {
        latitude:latitude,
        longitude:longitude
    };
}