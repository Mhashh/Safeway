
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


import * as Location from 'expo-location';


import MyStack from './NavigationView';



function App(): JSX.Element {


  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    fontSize: 24,
    fontWeight: '600',
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };


  const [errorMsg, setErrorMsg] = React.useState<String>();

  

 
  


  React.useEffect(() => {
    
    (async () => {
      try{
        console.log("ONNNNNNNN")
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
        <MyStack ></MyStack>
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
