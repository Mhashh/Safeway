import { AccountId, Client, ContractCallQuery, ContractExecuteTransaction, ContractFunctionParameters, ContractId, Hbar, Status } from '@hashgraph/sdk';
import {client} from './DevClient';
import { Alert } from 'react-native';
import { BigNumber } from '@hashgraph/sdk/lib/Transfer';

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
     return cost;
}

//add new map region
  export const addNew = async(cost:number,viewcost:number,amount_per_hit:number,country:string,city:string,userClient:Client,price:BigNumber):Promise<string>=>{
    //Create the query
    const query = new ContractExecuteTransaction()
    .setContractId(mainContractId)
    .setGas(100_000_000)
    .setFunction("addRoadAlertContract", new ContractFunctionParameters()
        .addUint256(cost)
        .addUint256(viewcost)
        .addUint256(amount_per_hit)
        .addString(country)
        .addString(city))
    .setPayableAmount(new Hbar(price));

    const accept =  await showAlert("Adding new map region","Estimated cost : "+price.toString()+" hbar and 0.05$");

    //Sign with the client operator private key to pay for the transaction and submit the query to a Hedera network
    try{
        if(accept){
            const response = (await query.execute(userClient));
            const record = await response.getRecord(userClient);
            const result = record.contractFunctionResult.getAddress(0);
            const cont = AccountId.fromSolidityAddress(result);
            return cont.toString();
        }
    }
    catch(err){
        return "transaction failed."
    }
    return "transaction canceled."
//v2.0.0
}




