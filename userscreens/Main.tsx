
import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthContext, RootStackParamList } from '../helpers/AuthContext';

import { apiGetC, getBalance, uri } from '../helpers/DevClient';


type MainProps = NativeStackScreenProps<RootStackParamList, 'Main'>
type UserContractList = {
  _id:string,
  ownerid:string,
  city:string,
  country:string,
  alertid:string,
  mapid:string,
}

const UserContractItem = ({_id,ownerid,city,country,alertid,mapid}: UserContractList) => (
  <View style={styles.usercontract}>
    <Text style={styles.items}>{mapid} {alertid} {city} { country}</Text>
  </View>
);
const MainDisplay = ({route,navigation}:MainProps) => {
  
    const {userclient,userAddress}= React.useContext(AuthContext);
    const [balance,setBalance] = React.useState<string>("0");
    const [userContracts,setUC] = React.useState<UserContractList[]>();

    const getUserContractList =async () => {
      const webres = await fetch(uri+apiGetC, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          owner:userAddress
        }),
      })
      const res= await webres.json();

      setUC(res.result);
      console.log(userContracts)
    }
    React.useEffect(()=>{
      if(userAddress!=="" ){
        getBalance(userAddress).then((bal)=>{
          setBalance(balance)
        });
        getUserContractList()
        
      }
    },[]);

    return (
      <View style={styles.screen} ><View style={styles.topbar}>
          <Text style={styles.inputB}>
            Balance : {balance}{'\n'}<Text style={styles.inputA}>Address: {userAddress}</Text> 
          </Text>
          <Pressable onPress={(ev)=>{
            getUserContractList();
            getBalance(userAddress).then((bal)=>{
              setBalance(balance)
            });
          }}><Text style={styles.inputC}>Refresh</Text></Pressable>
      </View>
          
      <View style={styles.middlecontainer}>
      <FlatList
            data={userContracts}
            renderItem={({item}) => <UserContractItem _id={item._id} ownerid={item.ownerid} city={item.city} country={item.country} mapid={item.mapid} alertid={item.alertid}  />}
          
            keyExtractor={item => item._id}
          ></FlatList>
      </View><View style={styles.lowercontainer}>
      <Pressable  style={styles.textbutton} onPress={(ev)=>{navigation.navigate("AddContracts")}}><Text  style={styles.txtbuttton}>Add new map</Text></Pressable>
      <Pressable  style={styles.textbutton} onPress={(ev)=>{navigation.navigate("Explore")}}><Text style={styles.txtbuttton}>See other</Text></Pressable></View>
        
        
      </View>
    );
  }
  
  export default MainDisplay;

  const styles = StyleSheet.create({
    screen: {
      flexDirection:'column',
      backgroundColor:'white',
      height:'100%',
        width:'100%',
        
    },
    usercontract:{
      flex:1,
      height:'100%',
      width:'100%',
      borderBottomColor:'black',
      borderLeftColor:'black',
      borderWidth:2,
      padding:6
    },
    items:{
      width:'100%',
      height:'100%',
      color:'black',
      fontSize:15
    },
    topbar:{
      flexDirection:"row",
      flex:1,
      width:'100%',
      height:'100%',
      backgroundColor:'black',
      justifyContent:'center'
    },
    passcontainer:{
      backgroundColor:'white',
        
        flexDirection:'row',
        height:'20%',
        width:'100%',
    },
    middlecontainer:{
       backgroundColor:'white',
       height:'100%',
        width:'100%',
        flex: 9
    },
    lowercontainer:{
       flex: 1,
       flexDirection:'row'
   },
   inputC:{
    flex:1,
    width:'100%',
    backgroundColor:'black',
    color:'white',
    fontSize:10,
    textAlignVertical:'center',
    textAlign:'center',
    padding:5,
    borderLeftColor:'white',
    borderLeftWidth:2
  },
    inputB:{
      flex:5,
      backgroundColor:'black',
      color:'white',
      fontSize:20
    },inputA:{
      fontSize:15
    },
    button:{
      backgroundColor:'grey',
      height:'50%',
      flex:1,
    },
    textbutton:{
      flex:1,
      
    },
    txtbuttton:{
      textAlign:'center',
      width:'100%',
      height:'100%',
      backgroundColor:'black',
      fontSize:16,
      color:'white',
      borderLeftWidth:2,
      borderRightWidth:2,
      borderColor:'white'
    }
    
  });
