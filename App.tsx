import React, {  SetStateAction } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {
  Accelerometer,
} from 'expo-sensors';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Subscription } from 'expo-sensors/build/Pedometer';

import * as Location from 'expo-location';


// Import the hethers library
import { hethers } from '@hashgraph/hethers';

import MyStack from './NavigationView';

export interface GlobalState{
  account:string,
  signedIn:boolean,
}
 
export const AuthContext = React.createContext<[userKey:string,
  setUserKey: React.Dispatch<SetStateAction<string>> ,
  wallet:ethers.Wallet|undefined,
  setWallet:React.Dispatch<SetStateAction<ethers.Wallet|undefined>>]>(['',()=>undefined,undefined,()=>undefined]);
function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    fontSize: 24,
    fontWeight: '600',
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  //provider and signer
  
  
  
  let text : String = 'Waiting..';

  //check local db for credentials
  const getData = async () :Promise<string |null  | undefined> => {
    try {
      const jsonValue = await AsyncStorage.getItem('SECRET')
      console.log(jsonValue)
      return jsonValue != null ? jsonValue : null;
    } catch(e) {
      // error reading value
    }
  }


  
  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener(setAccelerationData)
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(undefined);
    setAccelerationData({x:0,y:0,z:0})
  };

 const [wallet,setWallet] = React.useState<hethers.Wallet|undefined>()
 const [userKey,setUserKey] = React.useState<string>("")

  const [errorMsg, setErrorMsg] = React.useState<String>();

  const [ { x, y, z } ,setAccelerationData ] = React.useState({
    x:0,
    y:0,
    z:0,
  })

 
  const [subscription, setSubscription] = React.useState<Subscription>();


  React.useEffect(()=>{
    console.log("APP>START>useeffect")
     getData().then((value)=>{
      console.log(",[encryptedWallet ] : "+value)
        if(value!== undefined && value!= null){
          setUserKey(value);
        }
     })
  },[])

  React.useEffect(() => {
    (async () => {
      try{
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log("STATUS : "+status)
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
        
      }
      catch(exception){
        console.log("ERROR")
      }
      
    })();
  }, []);


  return (
    <AuthContext.Provider  value={[userKey,setUserKey,wallet,setWallet]}>
        <MyStack ></MyStack>
    </AuthContext.Provider>
        
  );
}

/*
<StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View>
        <TouchableOpacity onPress={subscription===undefined ?_subscribe : _unsubscribe}>
          <Text style={styles.controlButton} >
          {subscription===undefined ?"Acclerator off " : "Acclerator on " }
          </Text>
          </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>
        X : {x.toFixed(4)} m/s2
      </Text>
      <Text style={styles.sectionTitle}>
        Y : {y.toFixed(4)}  m/s2
      </Text>
      <Text style={styles.sectionTitle}>
        Z : {z.toFixed(4)}  m/s2
      </Text>
      <Text style={styles.sectionTitle}>
        Location  thissss : { text }  m/s2
      </Text>

      <MapDisplay longitude={userLongitude} latitude={userLatitude} ></MapDisplay>
*/



const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  controlButton:{
    fontSize:40
  }
});

export default App;
