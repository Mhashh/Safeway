
import * as React from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthContext, RootStackParamList } from '../helpers/AuthContext';

import { apiGetC, getBalance, uri } from '../helpers/DevClient';


type ExploreProps = NativeStackScreenProps<RootStackParamList, 'Explore'>
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
const Explore = ({route,navigation}:ExploreProps) => {
  
    const {userclient,useracc,userAddress}= React.useContext(AuthContext);
    const [city,setCity] = React.useState<string>()
    const [country,setCountry] = React.useState<string>()
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
          city:useracc,
          country:country
        }),
      })
      const res= await webres.json();

      setUC(res.result);
      console.log(userContracts)
    }
    React.useEffect(()=>{
      if(useracc!=="" ){
        getBalance(useracc).then((bal)=>{
          setBalance(bal.hbars.toBigNumber().toString()+" hbars")
        });
        getUserContractList()
        
      }
    },[]);

    return (
      <View style={styles.screen}><View style={styles.topbar}>
          <Text style={styles.inputB}>
            Balance : {balance}{'\n'}<Text style={styles.inputA}>Address: {useracc}</Text> 
          </Text>
          <Pressable onPress={(ev)=>{
            getUserContractList();
            getBalance(useracc).then((bal)=>{
              setBalance(bal.hbars.toBigNumber().toString()+" hbars")
            });
          }}><Text style={styles.inputC}>Refresh</Text></Pressable>
      </View><View style={styles.lowercontainer}><View style={styles.inputB}>
             <TextInput style={styles.inputbox}
                placeholder="city name"
                value={city}
                onChangeText={setCity}
            />
          <TextInput style={styles.inputbox}
                placeholder="country name"
                value={country}
                onChangeText={setCountry}
            />
            </View>
          <Pressable 
            style={styles.inputC}
            onPress={()=>{
                getUserContractList();
                }
            }  ><Text >
                search
            </Text>
          </Pressable>
        </View>
          
      <View style={styles.middlecontainer}>
      <FlatList
            data={userContracts}
            renderItem={({item}) => <UserContractItem _id={item._id} ownerid={item.ownerid} city={item.city} country={item.country} mapid={item.mapid} alertid={item.alertid}  />}
          
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
      justifyContent: 'center',
      alignItems: 'center',
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
    inputbox:{
        flex:3,
        width:'100%',
        color:'white',
        backgroundColor:'black',
        borderBottomWidth:2,
        borderLeftWidth:2,
        borderRightWidth:2,
        borderColor:'white',
        fontSize:16
    },
    inputbutton:{
        flex:1,
        borderLeftWidth:2,
        color:'white',
        backgroundColor:'black',
        borderColor:'white',
        fontSize:12
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
        flex: 8
    },
    lowercontainer:{
      height:'100%',
       width:'100%',
       flex: 1,
       flexDirection:'column'
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
      width:'100%',
      height:'100%',
      backgroundColor:'black',
      fontSize:16,
      color:'white'
    }
    
  });
