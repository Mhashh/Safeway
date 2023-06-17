
import { BigNumber, hethers } from '@hashgraph/hethers';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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
type MainProps = NativeStackScreenProps<RootStackParamList, 'Main'>

const provider =  hethers.providers.getDefaultProvider('testnet');
const MainDisplay = ({route,navigation}:MainProps) => {

    const [userkey,setUserKey,wallet,setWallet] = React.useContext(AuthContext);
    const [balance,setBalance] = React.useState<BigNumber>(hethers.BigNumber.from(0));
    const [needPassword,setPassFlag] = React.useState<boolean>(true);
    const [pass,setPass] = React.useState<string>("")
    const [update,setUpdateFlag] = React.useState<boolean>(false)

    console.log("MAIN : "+userkey)
    React.useEffect(()=>{
      fetchDetail().then(()=>{
        console.log("DONE")
      })
    },[update])

  const fetchDetail =async ()=>{
      if(update){
        hethers.Wallet.fromEncryptedJson(userkey,
          pass,
          (currentProgress:number)=>{
              let rounded = Number.parseInt(""+(currentProgress*100))
            
              console.log("Decrypting : "+rounded)
            }
          
        ).then((newwallet:hethers.Wallet)=>{
          setWallet(newwallet)
          //wallet created
          setPassFlag(false)
        wallet?.getBalance().then((value:BigNumber)=>{
          //account balance
          setUpdateFlag(false)
          setBalance(value);

        }).catch(()=>{
          //unable to fetch balance
          Alert.alert('View Transaction failed', 'unable to get', [
            {
              text: 'ok',
              onPress: () => {
              }
            }
          ]);
        }
          
        )
      }).catch(()=>{
        //wrong password
        Alert.alert('Wrong password', 'please try again!', [
          {
            text: 'ok',
            onPress: () => {
              setPass('')
              setUpdateFlag(false)
            }
          }
        ]);
      })
    }
  }

    const verifyAndUpdate = ()=>{
      setUpdateFlag(true)
    }

    return (
      <View style={styles.screen}>
        {needPassword?
          <View style={styles.passcontainer}>
          <TextInput editable
          multiline numberOfLines={1}
                  maxLength={16}
                  onChange={text => {
                    
                    setPass(text.nativeEvent.text)
                  
                  }
                  }
                  style={styles.inputP}  value={pass}
        ></TextInput>
        <TouchableOpacity style={styles.button} onPress={ verifyAndUpdate}>
        <Text>Press Here</Text>
      </TouchableOpacity></View>
        :  
        <Text style={styles.input}>
          Address : {balance.toString()}
        </Text>
        
      }
      </View>
    );
  }
  
  export default MainDisplay;

  const styles = StyleSheet.create({
    screen: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:'white',
      height:'100%',
        width:'100%',
    },
    passcontainer:{
      backgroundColor:'white',
        
        flexDirection:'row',
        height:'20%',
        width:'100%',
    },
    lowercontainer:{
       backgroundColor:'red',
       height:'100%',
        width:'100%',
        flex: 1,
    },
    input:{
      backgroundColor:'black',
      borderWidth:3,
      borderColor:'white',
        padding:2,
    },
    inputP:{
      backgroundColor:'black',
      borderWidth:3,
      borderColor:'white',
      height:'50%',
        padding:2,
        flex:3,
    },
    button:{
      backgroundColor:'grey',
      height:'50%',
      flex:1,
    }
    
  });
