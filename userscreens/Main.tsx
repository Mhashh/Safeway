
import * as React from 'react';
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
import { connectToMetaMask } from '../helpers/ChainHelpers';

/*
export interface SetupProps{
  setter:React.Dispatch<React.SetStateAction<string>>,
  setLoadingflag:React.Dispatch<React.SetStateAction<boolean>>
}*/
type MainProps = NativeStackScreenProps<RootStackParamList, 'Main'>

const MainDisplay = ({route,navigation}:MainProps) => {

    const client= React.useContext(AuthContext);
    const [balance,setBalance] = React.useState<Number>(0);
    const [update,setUpdateFlag] = React.useState<boolean>(false)

    React.useEffect(()=>{
      connectToMetaMask().then((value)=>{
        console.log(value);



        
      }).catch((err)=>{
        console.log(err);
      });
    },[])

  

    const verifyAndUpdate = ()=>{
      setUpdateFlag(true)
    }

    return (
      <View style={styles.screen}>
        
        <Text style={styles.input}>
          Address : {balance.toString()}
        </Text>
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
