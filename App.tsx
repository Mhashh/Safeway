import './shim.js';
import Constants  from 'expo-constants';
import * as React from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import {
  Accelerometer,
} from 'expo-sensors';

import { Subscription } from 'expo-sensors/build/Pedometer';

import * as Location from 'expo-location';


// Import the hethers library
import { Wallet,AccountId,PrivateKey,Client } from '@hashgraph/sdk';

import MyStack from './NavigationView';

export interface GlobalState{
  account:string,
  signedIn:boolean,
}
 
export const AuthContext = React.createContext<Client>(undefined);


function App(): JSX.Element {

  // create your client
  const myAccountId = AccountId.fromString(Constants.expoConfig.extra.REACT_APP_MY_ACCOUNT_ID);
  const myPrivateKey = PrivateKey.fromString(Constants.expoConfig.extra.REACT_APP_MY_PRIVATE_KEY);

  const client = Client.forTestnet();
  client.setOperator(myAccountId, myPrivateKey);
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    fontSize: 24,
    fontWeight: '600',
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  //provider and signer
  
  
  
  let text : String = 'Waiting..';

  


  
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


  const [errorMsg, setErrorMsg] = React.useState<String>();

  const [ { x, y, z } ,setAccelerationData ] = React.useState({
    x:0,
    y:0,
    z:0,
  })

 
  const [subscription, setSubscription] = React.useState<Subscription>();


  React.useEffect(() => {
    (async () => {
      try{
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log("STATUS : "+status)
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      _subscribe();
        
      }
      catch(exception){
        console.log("ERROR")
      }
      
    })();
  }, []);


  return (
    
    <AuthContext.Provider  value={client}>
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
