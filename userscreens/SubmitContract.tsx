import React from 'react';
import MapView, { LatLng, Marker, Polygon, Region } from 'react-native-maps';
import { Pressable, StyleSheet, View,Text, TextInput } from 'react-native';
import { AuthContext, RootStackParamList } from '../helpers/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createNewContract,mainContractCost} from '../helpers/CallContracts';

import { apiAdd, apiGetP, uri } from '../helpers/DevClient';
import { addToPolygon } from '../helpers/CallUserContracts';

import { Hbar,HbarUnit } from '@hashgraph/sdk';

type SubmitContractProps = NativeStackScreenProps<RootStackParamList,"SubmitContract">

export default function SubmitContract({route,navigation}:SubmitContractProps) {

  //passed when user clicks or buys to view hits a contract from the list in the main or other screen
  const {userclient,useracc}= React.useContext(AuthContext);
  const {polygon} = route.params
  const [a,setInputa] = React.useState<string>()
  const [c,setInputc] = React.useState<string>()
  const [d,setInputd] = React.useState<string>("")
  const [e,setInpute] = React.useState<string>("")

  const addPol = async(contractid)=>{
    polygon.forEach(async (value,i)=>{
      await addToPolygon(contractid,value.longitude*1000000,value.latitude*1000000,userclient);
    })
  }

  const addCon = async()=>{
    //cost to dev
    const cost = await mainContractCost(userclient);
    const res = await createNewContract(new Hbar(a)._valueInTinybar,cost,new Hbar(c)._valueInTinybar,userclient)

    console.log(res);
    //success
    if(res.status){
      await addPol(res);
      const webres =await fetch(uri+apiAdd, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mid:res.mapid,
          aid:res.alertid,
          owner:useracc,
          city:d,
          country:e
        }),
      })
      
      console.log(webres.json());
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
            <TextInput keyboardType='numeric' style={styles.input} placeholder='View cost' onChangeText={(newtext)=>setInputa(newtext)} value={a}/>
            <TextInput keyboardType='numeric' style={styles.input} placeholder='Hit cost' onChangeText={(newtext)=>setInputc(newtext)} value={c}/>
          
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

