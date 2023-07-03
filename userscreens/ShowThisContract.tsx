import React from 'react';
import MapView, { Camera, LatLng, Marker, Polygon, Region } from 'react-native-maps';
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
  const [region,setRegion] = React.useState<Camera>({center:{latitude:0,longitude:0},heading:0,zoom:14,pitch:0,altitude:undefined});
  
  //region of map where obstructions are mapped
  const [area,setArea] = React.useState<LatLng[]>([]);
  
  const getPolygon = async()=>{
    const totalpoints =  await hits(mapid,userclient);
    
    console.log("hits:" + totalpoints)
    if(totalpoints >0){
      let mappolygon:LatLng[]=[];
      for(let i = 0;i<totalpoints;i++){
        const coord = await polygon(mapid,i,userclient);
        console.log(coord)
        if(coord!=undefined)
        {
          
          mappolygon.push(coord);
        }
      }
      setRegion({
        ...region,
        center:{
          latitude:mappolygon[0].latitude,
          longitude:mappolygon[0].longitude
        }
      })
      setArea(mappolygon);
    }
  }
  
  React.useEffect(
    ()=>{
      getPolygon();
    }    
    ,[])

  const onRegionChanges=(reg:Camera)=>{
    setRegion(reg)
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.infobar}><Text style={styles.info}>MapId : {mapid}{'\n'}City: {city}</Text></View>
      <MapView style={styles.map} camera={region} showsUserLocation={true}>
        {
          area.length>2 &&<Polygon coordinates={area}></Polygon>
        }{area.map((marker, index) => (
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
    flexDirection:'column',
    width:'100%',
    height:'100%'
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
