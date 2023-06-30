import {AccountId,PrivateKey,Client, Mnemonic, AccountCreateTransaction, Hbar, AccountBalanceQuery, AccountBalance, PublicKey} from '@hashgraph/sdk'
  
import Constants  from 'expo-constants';

console.log("HERE!!")
// create your client
const myAccountId = AccountId.fromString(Constants.expoConfig.extra.REACT_APP_MY_ACCOUNT_ID);
const myPrivateKey = PrivateKey.fromString(Constants.expoConfig.extra.REACT_APP_MY_PRIVATE_KEY);

//our app server link
export const uri = `http://${Constants.manifest.debuggerHost.split(':').shift()}:3333`;
export const apiGetP = "/getP"
export const apiGetC="/getContractsC"
export const apiGetCC="/getContractsCC"
export const apiAdd = "/addContract"
console.log("Acc "+myAccountId);
console.log("Pri "+myPrivateKey);
export const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

//Set the default maximum transaction fee (in Hbar)
client.setDefaultMaxTransactionFee(new Hbar(100));

//Set the maximum payment for queries (in Hbar)
client.setMaxQueryPayment(new Hbar(100));


export interface NewAccount {
    keystring:string,
    privatekey:string,
    accid:string,
    address:string
}

export interface OldAccount {
    newclient:Client,
    address:string
}

type getpResponse = {
    retString:string,
    pubString:string
}


export const createNewAccount =  async() : Promise<NewAccount> =>{
    let stringKey = "";
    let userKey="";
    let addr = "";
    return Mnemonic.generate12().then((value:Mnemonic)=>{
        stringKey  = value.toString();
        return Promise.resolve(stringKey)

        
    }).then((str)=>{
        const res = fetch(uri+apiGetP, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              normalString: `${str}`,
            }),
          })
          return res;
    }).then((res)=>{
        return res.json()
    }).then((data:getpResponse)=>{
        console.log("OKAY")
        let privateKey = PrivateKey.fromString(data.retString)
        let publicKey = PublicKey.fromString(data.pubString)
        userKey=data.retString;
        addr=data.pubString;
        console.log("createNewAccount "+userKey)
        //Create the transaction
        const transaction = new AccountCreateTransaction()
        .setKey(publicKey)
        .setInitialBalance(new Hbar(120));

        //Sign the transaction with the client operator private key and submit to a Hedera network
        
        return transaction.execute(client);

        
    }).then((txResponse)=>{
        //Request the receipt of the transaction
        return txResponse.getReceipt(client);

       
    }).then((receipt)=>{
         //Get the account ID
         const newAccountId = receipt.accountId;
         let user = {keystring:stringKey,
             privatekey:userKey,
             accid:newAccountId.toString(),
            address:addr};
             
         return user
    }).catch((error)=>{
        console.log("createNewAccount "+error);
        throw new Error("New Key generation failed")
    })
    
}
export const getBalance =async (accid:string):Promise<AccountBalance> => {
    const query = new AccountBalanceQuery().setAccountId(accid);
    
    return query.execute(client).then((balance)=>{
        return balance;
    }).catch((err)=>{
        throw err
    });

}

//uses 12 word string as input 
export const getAccountClientM = async (memonic:string,accid:string) : Promise<OldAccount> =>{

       return fetch(uri+apiGetP, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          normalString: `${memonic}`,
        }),
        }).then((res)=>{
            return res.json()
        }).then((data:getpResponse)=>{
                
                let userClient = Client.forTestnet();
                userClient.setOperator(accid,data.retString);
                
                return {newclient:userClient,address:data.pubString};
            }).catch((error)=>{
            throw new Error("Client generation failed.");
        })

    
}

//uses key string as input 
export const getAccountClientP = async (privateKey:string,accid:string) : Promise<Client> =>{
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
  