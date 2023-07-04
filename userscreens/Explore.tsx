
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

import { apiGetCC, getBalance, uri } from '../helpers/DevClient';


type ExploreProps = NativeStackScreenProps<RootStackParamList, 'Explore'>
type UserContractList = {
  _id:string,
  name:string,
  ownerid:string,
  city:string,
  country:string,
  alertid:string,
  mapid:string,
  nav:NativeStackNavigationProp<RootStackParamList, "Explore", undefined>
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
    <Text style={styles.items}>{name}{'\n'}<Text style={styles.inputC}>{mapid}{'\n'}{city},{ country}</Text></Text>
  </Pressable>
);
const Explore = ({route,navigation}:ExploreProps) => {
  
    const {userclient,userAddress}= React.useContext(AuthContext);
    const [balance,setBalance] = React.useState<string>("0");
    const [userContracts,setUC] = React.useState<UserContractList[]>();
    const [city,setCity] = React.useState<string>("");
    const [country,setCountry] = React.useState<string>("");
    const getUserContractList =async () => {
      console.log(userAddress)
      const webres = await fetch(uri+apiGetCC, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          city:city,
          country:country
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
        
      }
    },[]);

    return (
      <View style={styles.screen} ><View style={styles.topbar}>
          <Text style={styles.inputA}>{userAddress}</Text>
      </View><View style={styles.inputcontainer}>
        <TextInput style={styles.inputB} 
          placeholder="city"
          value={city}
          onChangeText={setCity}/>
        <TextInput style={styles.inputB} 
          placeholder="country"
          value={country}
          onChangeText={setCountry}/>
        <Pressable style={styles.textbutton}
          onPress={(ev)=>{
            getUserContractList()
          }}>
          <Text style={styles.txtbuttton}>Search</Text>
        </Pressable>
      </View>

          
      <View style={styles.lowercontainer}>
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
      </View>
      </View>
    );
  }
  
  export default Explore;

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
      justifyContent:'flex-start'
    },
    inputcontainer:{
      backgroundColor:'white',
      flex:1,
      flexDirection:'row',
      height:'100%',
      width:'100%',
      marginTop:5,
      borderWidth:1,
      borderColor:'black'
    },
    lowercontainer:{
       backgroundColor:'white',
       height:'100%',
        width:'100%',
        flex: 14
    },inputA:{
      textAlign:'left',
      textAlignVertical:'center',
      fontSize:13,
      color:'white'
    },
    inputB:{
      flex:4,
      width:'100%',
      paddingLeft:4
    },inputC:{
      textAlign:'left',
      textAlignVertical:'center',
      fontSize:13,
    },

    button:{
      backgroundColor:'grey',
      height:'50%',
      flex:1,
    },
    textbutton:{
      flex:2,
      
    },
    txtbuttton:{
      textAlign:'center',
      textAlignVertical:'center',
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
