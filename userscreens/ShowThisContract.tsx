import React from 'react';
import MapView, { LatLng, Marker, Polygon } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { RootStackParamList } from '../NavigationView';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type MapShowContractProps = NativeStackScreenProps<RootStackParamList, 'MapShowContract'>

export default function ShowThisContract({route,navigation}:MapShowContractProps) {

  //passed when user clicks or buys to view hits a contract from the list in the main or other screen
  const {polygon,hits} = route.params;

  //road obstructions or caution region
  const [markers,setMarkers] = React.useState<LatLng[]>([]);

  //region of map where obstructions are mapped
  const [region,setRegion] = React.useState<LatLng[]>([]);
  
  
  React.useEffect(
    ()=>{
      if(hits !== undefined){
        
        setMarkers(hits);
      }
      setRegion(region);
    }    
    ,[])

  
  
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
