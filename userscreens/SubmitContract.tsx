import React from 'react';
import MapView, { LatLng, Marker, Polygon, Region } from 'react-native-maps';
import { Pressable, StyleSheet, View,Text, TextInput, Alert } from 'react-native';
import { AuthContext, RootStackParamList } from '../helpers/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createNewContract,mainContractCost} from '../helpers/CallContracts';

import { apiAdd, apiGetP, uri } from '../helpers/DevClient';
import { addToPolygon } from '../helpers/CallUserContracts';
import { ethers,BigNumber } from 'ethers';

type SubmitContractProps = NativeStackScreenProps<RootStackParamList,"SubmitContract">

//dialog box 
const showAlert = (header:string,detail:string) : Promise<boolean>=>{
  return new Promise((resolve,reject)=>{
      Alert.alert(
          header,
          detail,
          [
            {
              text: 'ok',
              onPress: () =>{
                  
                  resolve(true)
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

export default function SubmitContract({route,navigation}:SubmitContractProps) {

  //passed when user clicks or buys to view hits a contract from the list in the main or other screen
  const {userclient,userAddress}= React.useContext(AuthContext);
  const {polygon} = route.params
  const [a,setInputa] = React.useState<string>("")
  const [c,setInputc] = React.useState<string>("")
  const [b,setInputb] = React.useState<string>("")
  const [d,setInputd] = React.useState<string>("")
  const [e,setInpute] = React.useState<string>("")

  const addPol = async(contractid:string)=>{
    for(let i = 0;i<polygon.length;i++){
      let success = await addToPolygon(contractid,polygon[i].longitude,polygon[i].latitude,userclient);

      if(success){
        console.log(true)
      }
    }
  }

  const addCon = async()=>{
    //cost to dev
    const cost = await mainContractCost(userclient);
    console.log(a+" "+c+" "+cost);
    const vcost = Number.parseFloat(a)*100;
    const acost = Number.parseFloat(c)*100;
    const power = BigNumber.from("10000000000000000")//10^16

    const res = await createNewContract(power.mul(vcost),cost,power.mul(acost),userclient);

    console.log(res);
    //success
    if(res.status){
      await addPol(res.mapid);
      const webres =await fetch(uri+apiAdd, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name:b,
          mid:res.mapid,
          aid:res.alertid,
          owner:userAddress,
          city:d,
          country:e
        }),
      })
      
      console.log(webres.json());
      navigation.reset({
        routes: [{ name: 'Main', params: {  } },]
      })
    }else{
      await showAlert("Contract creation failed","transaction reverted.");
       navigation.reset({
        routes: [{ name: 'Main', params: {  } },]
      })
    }
  }
  React.useEffect(
    ()=>{
    }    
    ,[])

  
  
  return(
    <View style={styles.container}>
           
      <View style={styles.inputs}>
            <TextInput keyboardType='numeric' style={styles.input} placeholder='View cost(dollar)' onChangeText={(newtext)=>setInputa(newtext)} value={a}/>
            <TextInput keyboardType='numeric' style={styles.input} placeholder='Hit cost(dollar)' onChangeText={(newtext)=>setInputc(newtext)} value={c}/>
            <TextInput style={styles.input} placeholder='Nickname' onChangeText={(newtext)=>setInputb(newtext)} value={b}/>
            <TextInput style={styles.input} placeholder='City' onChangeText={(newtext)=>setInputd(newtext)} value={d}/>
            <TextInput style={styles.input} placeholder='Country' onChangeText={(newtext)=>setInpute(newtext)} value={e}/>
          
      </View>
      <View style={styles.buttons}>
      <Pressable onPress={(ev)=>{
        addCon();
      }}><Text style={styles.textbutton}>Add New Contract</Text></Pressable>
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

