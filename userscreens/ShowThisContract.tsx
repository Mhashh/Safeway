import React from 'react';
import MapView, { LatLng, Marker, Polygon, Region } from 'react-native-maps';
import { StyleSheet, View,Text } from 'react-native';
import { AuthContext, RootStackParamList } from '../helpers/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { hits, polygon } from '../helpers/CallUserContracts';

type MapShowContractProps = NativeStackScreenProps<RootStackParamList, 'MapShowContract'>

export default function ShowThisContract({route,navigation}:MapShowContractProps) {

  const {userclient} = React.useContext(AuthContext);


  //passed when user clicks or buys to view hits a contract from the list in the main or other screen
  const {mapid,alertid,city} = route.params;

  //road obstructions or caution region
  const [markers,setMarkers] = React.useState<LatLng[]>([]);

  
  //region of map where obstructions are mapped
  const [region,setRegion] = React.useState<Region>({latitude:0,longitude:0,latitudeDelta:0,longitudeDelta:0});
  
  //region of map where obstructions are mapped
  const [area,setArea] = React.useState<LatLng[]>([]);
  
  const getPolygon = async()=>{
    const totalpoints =  await hits(mapid,userclient);
    if(totalpoints >0){
      let mappolygon:LatLng[]=[];
      for(let i = 0;i<totalpoints;i++){
        const coord = await polygon(mapid,i,userclient);
        if(coord!=undefined)
        {
          mappolygon.push(coord);
        }
      }
      setMarkers(mappolygon);
    }
  }
  
  React.useEffect(
    ()=>{
      getPolygon();
    }    
    ,[])

  
  
  return (
    <View style={styles.container}>
      <View style={styles.infobar}>
        <Text style={styles.info}>
          MapId : {mapid}{'\n'}City: {city}
        </Text>
      </View>
      <MapView style={styles.map} region={region}> showsUserLocation={true}
        {
          area.length>2 &&<Polygon coordinates={area}></Polygon>
        }
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
    flex:8,
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
