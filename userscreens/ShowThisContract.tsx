import React from 'react';
import MapView, { LatLng, Marker, Polygon, Region } from 'react-native-maps';
import { StyleSheet, View,Text } from 'react-native';
import { RootStackParamList } from '../helpers/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type MapShowContractProps = NativeStackScreenProps<RootStackParamList, 'MapShowContract'>

export default function ShowThisContract({route,navigation}:MapShowContractProps) {

  //passed when user clicks or buys to view hits a contract from the list in the main or other screen
  const {polygon,hits,contractid,city} = route.params;

  //road obstructions or caution region
  const [markers,setMarkers] = React.useState<LatLng[]>([]);

  
  //region of map where obstructions are mapped
  const [region,setRegion] = React.useState<Region>({latitude:0,longitude:0,latitudeDelta:0,longitudeDelta:0});
  
  //region of map where obstructions are mapped
  const [area,setArea] = React.useState<LatLng[]>([]);
  
  
  React.useEffect(
    ()=>{
      if(hits !== undefined){        
        setMarkers(hits);
      }
      if(polygon!== undefined){
        setArea(polygon);
        let longavg = 0;
        let latavg = 0;
        area.forEach((value:LatLng,index:number)=>{
          longavg = (longavg+(value.longitude/1000000))/2
          latavg = (latavg+(value.latitude/1000000))/2
        })
        setRegion({
          ...region,
          latitude:latavg,
          longitude:longavg
        })
      }
    }    
    ,[])

  
  
  return (
    <View style={styles.container}>
      <View style={styles.infobar}>
        <Text style={styles.info}>
          MapId : {contractid}{'\n'}City: {city}
        </Text>
      </View>
      <MapView style={styles.map} region={region}>
        <Polygon coordinates={area}></Polygon>

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
    flexDirection:'column'
  },
  map: {
    flex:5,
    width: '100%',
    height: '100%'
  },
  infobar:{
    flex:1,
    height:'100%',
    width:'100%'
  },
  info:{
    fontSize:15,
    width:'100%'
  }
});
