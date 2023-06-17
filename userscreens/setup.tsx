
import { Wallet,Client } from '@hashgraph/sdk';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../NavigationView';
import { AuthContext } from '../App'

/*
export interface SetupProps{
  setter:React.Dispatch<React.SetStateAction<string>>,
  setLoadingflag:React.Dispatch<React.SetStateAction<boolean>>
}*/
type SetupProps = NativeStackScreenProps<RootStackParamList, 'Login'>


const provider = Client.forTestnet();
const SetupDisplay = ({route,navigation}:SetupProps) => {

    const [pkey,setPkey] = React.useState<string>("");
    const [pass,setPass] = React.useState<string>("");
    const [userkey,setUserKey] = React.useContext(AuthContext)
    const [loading,setLoadFlag] = React.useState<boolean>(false)
    const [progress,setProgress] = React.useState<number>(0)
    const storeData = async (value:string) => {
      try {
        
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem('SECRET', jsonValue)
        setUserKey(value)
      } catch (e) {
        // saving error
        console.log("setup>storeData>error")
      }
    }
    React.useEffect(()=>{
      console.log("SETUPDISPLAY:"+userkey)
      if(userkey !== "")
      {
        navigation.navigate('Main',{})
      }
    },[userkey])
    
    React.useEffect(()=>{
      (async()=>{await handleLogin()})()
    },[loading])

    const handleLogin =  async ()=>{
        //validate private key and password
        if(loading){
        if(pkey.length !=0 || pass.length<8){
          
          console.log("Loading "+loading)
          const wallet = new hethers.Wallet(pkey,provider)
          
          wallet.encrypt(pass,{scrypt: {
            // The number must be a power of 2 (default: 131072)
            N: 128
          }},(currentProgress:number)=>{
              let rounded  = Number.parseInt(""+(currentProgress*100))
              
                console.log("Encrypting : "+rounded)
                setProgress(rounded)
              
             
          }).then((value:string)=>{
            setProgress(100)
            console.log(value)
            storeData(value)
            setUserKey(value)
            setLoadFlag(false)
          }).catch(()=>{
            setLoadFlag(false)
            console.log("catch handle login")
          })
        
          
          
        }else{
          setLoadFlag(false)
        }}
    }

    return (
      <View style={styles.screen}>
        {loading?
        <View>
            <Text style={{fontSize:20,color:'green'}}>Creating encrypted wallet</Text>
            <Text style={{fontSize:20,color:'green'}}>{progress}</Text>
          <ActivityIndicator size="large" color="#00ff00" />
          </View>
            :
        <View style={styles.uppercontainer}>
          
            <TextInput editable
                  multiline numberOfLines={2}
                  maxLength={64}
                  onChange={text => {
                    console.log(text.nativeEvent.text)
                    setPkey(text.nativeEvent.text)
                  
                  }
                  }
                  style={styles.input}  value={pkey}>

            </TextInput>
            <TextInput  editable
                  multiline numberOfLines={1}
                  maxLength={40}
                  onChange={text => {
                    console.log(text.nativeEvent.text)
                    setPass(text.nativeEvent.text)
                  
                  }}
                  style={styles.input}  value={pass}>
                
            </TextInput>
            <Pressable style={styles.button} onPress={()=>{setLoadFlag(true)}}>
                <Text style={{fontSize:15,padding:5,textAlign:'center',color:'white',}}>
                    Store encrypted key
                </Text>
            </Pressable>
        </View>
                
      }
      </View>
    );
  }
  
  export default SetupDisplay;

  const styles = StyleSheet.create({
    screen: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height:'100%',
        width:'100%',
    },
    uppercontainer:{
      flexDirection:'column',       
      justifyContent: 'center',
      alignItems: 'center',
      width:'100%',
    },
    input:{
      backgroundColor:'black',
      borderWidth:3,
      borderColor:'white',
      width:'100%',
        padding:2,
        fontSize:20
    },
    button:{
      backgroundColor:'grey',
      width:'40%',
      justifyContent:'center'
      ,alignItems:'center'
    }
    
  });

  /*
   {markers.length>0 &&
                markers.map((item,index)=>{
                  console.log(index)
                  return(
                    <Mapbox.MarkerView id={item.id} coordinate={[item.longitude,item.latitude]}>
                      <Image style={styles.marker} source={require('./mark.png')}/>
                    </Mapbox.MarkerView>
                  )
                })
              }
  
  */