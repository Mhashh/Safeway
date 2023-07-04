import React from 'react';
import { Pressable, StyleSheet, View,Text, TextInput } from 'react-native';
import { AuthContext, RootStackParamList } from '../helpers/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createNewContract,mainContractCost} from '../helpers/CallContracts';
import Constants from 'expo-constants';
import { addFund } from '../helpers/CallUserContracts';


type AddFundProps = NativeStackScreenProps<RootStackParamList,"AddFund">

export default function AddFund({route,navigation}:AddFundProps) {

  //passed when user clicks or buys to view hits a contract from the list in the main or other screen
  const {userclient,userAddress}= React.useContext(AuthContext);
  const {contractid} = route.params
  const [a,setInputa] = React.useState<string>("")


  const addFundsToThis = async()=>{
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
    if(res.ETH !== undefined){
      const amount = Number.parseFloat(a)*(res.Eth);
      const paid = await addFund(contractid,amount.toString(),userclient);
      console.log(paid);
    }
    
  }
  React.useEffect(
    ()=>{
    }    
    ,[])

  
  
  return(
    <View style={styles.container}>
           
      <View style={styles.inputs}>
            <TextInput keyboardType='numeric' style={styles.input} placeholder='amount (dollars)' onChangeText={(newtext)=>setInputa(newtext)} value={a}/>
          
      </View>
      <View style={styles.buttons}>
      <Pressable onPress={(ev)=>{
        addFundsToThis();
      }}><Text style={styles.textbutton}>Add Funds </Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:'column',
    width:'100%',
    height:'100%',
    padding:10
  },
  inputs:{
    flexDirection:'column',
    flex:2,
    width: '100%',
    height: '100%',
  },
  buttons:{
    flex:1,
    width: '100%',
    height: '100%',
    padding:10
  },
  textbutton:{
    backgroundColor:'black',
    fontSize:16,
    textAlignVertical:'center',
    textAlign:'center',
    color:'white',
    width: '100%',
    height: '50%',
    borderWidth:2,
    borderRadius:7
  },
  input:{
    flex:1,
    borderBottomColor:'black',
    margin:10,
    fontSize:12,
    borderBottomWidth:2,
    textAlign:'center'
  }
});

