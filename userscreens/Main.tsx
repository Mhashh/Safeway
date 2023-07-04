
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
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthContext, RootStackParamList } from '../helpers/AuthContext';

import { apiGetC, getBalance, uri } from '../helpers/DevClient';


type MainProps = NativeStackScreenProps<RootStackParamList, 'Main'>
type UserContractList = {
  _id:string,
  name:string,
  ownerid:string,
  city:string,
  country:string,
  alertid:string,
  mapid:string,
  nav:NativeStackNavigationProp<RootStackParamList, "Main", undefined>,
}

const UserContractItem = ({_id,name,ownerid,city,country,alertid,mapid,nav}: UserContractList) => (
  <Pressable style={styles.usercontract} onPress={(ev)=>{
      nav.navigate("MapShowContract",{
        name:name,
        mapid:mapid,
        alertid:alertid,
        city:city,
        ownerid:ownerid
      });
    }
  }>
    <Text style={styles.items}>{name}{'\n'}<Text style={styles.inputA}>{mapid}{'\n'}{city},{ country}</Text></Text>
  </Pressable>
);
const MainDisplay = ({route,navigation}:MainProps) => {
  
    const {userclient,userAddress}= React.useContext(AuthContext);
    const [balance,setBalance] = React.useState<string>("0");
    const [userContracts,setUC] = React.useState<UserContractList[]>();

    const getUserContractList =async () => {
      console.log(userAddress)
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
          setBalance(bal)
        });
        getUserContractList()
        
      }
    },[]);

    return (
      <View style={styles.screen} ><View style={styles.topbar}>
          <Text style={styles.inputB}>
            <Text style={styles.inputA}>{userAddress}{'\n'}Balance:{balance}</Text> 
          </Text>
          <Pressable onPress={(ev)=>{
            getUserContractList().then().catch((err)=>{console.log(err)})
            getBalance(userAddress).then( (bal)=>{
              setBalance(balance)
            }).catch((err)=>{
              console.log(err)
            });
          }}><Text style={styles.inputC}>Refresh</Text></Pressable>
      </View>
          
      <View style={styles.middlecontainer}>
      <FlatList
            data={userContracts}
            renderItem={({item}) => <UserContractItem 
                  _id={item._id} 
                  name={item.name}
                  ownerid={item.ownerid} 
                  city={item.city} 
                  country={item.country} 
                  mapid={item.mapid} 
                  alertid={item.alertid}  
                  nav={navigation}/>}
          
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
        flex: 16
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
      fontSize:20,
      textAlignVertical:'center'
    },inputA:{
      fontSize:12
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
      textAlignVertical:'center',
      width:'100%',
      height:'100%',
      backgroundColor:'black',
      fontSize:13,
      color:'white',
      borderLeftWidth:2,
      borderRightWidth:2,
      borderColor:'white'
    }
    
  });
