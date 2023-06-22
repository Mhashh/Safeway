import {AccountId,PrivateKey,Client, Mnemonic, AccountCreateTransaction, Hbar, AccountBalanceQuery, AccountBalance} from '@hashgraph/sdk'
  
import Constants  from 'expo-constants';

// create your client
const myAccountId = AccountId.fromString(Constants.;
const myPrivateKey = PrivateKey.fromString(Constants.expoConfig.extra.REACT_APP_MY_PRIVATE_KEY);

const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

export interface NewAccount {
    keystring:string,
        privatekey:string,
        accid:string,
}


exports .createNewAccount = async () : Promise<NewAccount> =>{
let stringKey = "";
Mnemonic.generate12().then((value:Mnemonic)=>{
    stringKey  = value.toString();
    const privateKey = await value.toStandardEd25519PrivateKey();


    //Create the transaction
    const transaction = new AccountCreateTransaction()
        .setKey(privateKey.publicKey)
        .setInitialBalance(new Hbar(300));

    //Sign the transaction with the client operator private key and submit to a Hedera network
    const txResponse = await transaction.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the account ID
    const newAccountId = receipt.accountId;
    let user = {keystring:stringKey,
        privatekey:privateKey,
        accid:newAccountId.toString()};
        
    return user;
    

    
    }).catch((error)=>{
        throw new Error("Key generation failed.");
    })
throw new Error("Key generation failed.");
}
exports.getBalance =async (accid:string):Promise<AccountBalance> => {
    const query = new AccountBalanceQuery().setAccountId(accid);

    const balance = await query.execute(client);
    return balance;
}

exports .getAccountClient = async (privateKey:string,accid:string) : Promise<Client> =>{
    try{  
        let userClient = Client.forTestnet();
        userClient.setOperator(accid,privateKey);
        
        return userClient;
    
    //v2.0.5
    }
    catch(error){
        throw new Error("Client generation failed.");
    }
    }

  exports.client = client;
  