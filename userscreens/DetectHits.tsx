import React from 'react';
import MapView, { LatLng, Marker, Polygon } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { RootStackParamList } from '../NavigationView';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  Accelerometer,
} from 'expo-sensors';

import { Subscription } from 'expo-sensors/build/Pedometer';
import { hitDetected } from '../helpers/CallContracts';

type MapShowContractProps = NativeStackScreenProps<RootStackParamList, 'DetectHits'>
type AccelerationData = {x:number,y:number,z:number}

function calculateMagnitude(data:AccelerationData){
  return Math.sqrt((data.x * data.x)+(data.y * data.y)+(data.z * data.z));
}


export default function ShowThisContract({route,navigation}:MapShowContractProps) {

  //passed when user clicks or buys to view hits a contract from the list in the main or other screen
  const {polygon,contractid} = route.params;
  let runningAverage:number = 0;
  //road obstructions or caution region
  const [markers,setMarkers] = React.useState<LatLng[]>([]);

  //region of map where obstructions are mapped
  const [region,setRegion] = React.useState<LatLng[]>([]);

  //event listener for acceleration data
  const [subscription, setSubscription] = React.useState<Subscription>();
  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener(setAccl)
    );
  };

  

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(undefined);
    setAccl({x:0,y:0,z:0})
  };

  const [ accl ,setAccl ] = React.useState<AccelerationData>({
    x:0,
    y:0,
    z:0,
  })
  
  React.useEffect(
    ()=>{
      setRegion(region);
      _subscribe();
    }    
    ,[])

    //our main algo or ml model to detect abrupt speed changes
    //currently using running average ¯\_(ツ)_/¯
    React.useEffect(()=>{
      const curr = calculateMagnitude(accl);
      if(Math.abs(curr-runningAverage)>=2){
        //call smart contract
        

      }
      
      runningAverage = (curr+runningAverage)/2;
    }
      ,[accl])

  
  
  return (
    <View style={styles.container}>
      <MapView style={styles.map} >
        <Polygon coordinates={region}></Polygon>

        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
