import Mapbox from '@rnmapbox/maps';
import { Position } from '@rnmapbox/maps/lib/typescript/types/Position';
import React from 'react';
import {NativeStackNavigationProp,} from '@react-navigation/native-stack';
import {
  Button,
  GestureResponderEvent,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../NavigationView';
import * as Location from 'expo-location';
Mapbox.setWellKnownTileServer('Mapbox');
Mapbox.setAccessToken('pk.eyJ1IjoiNG1haHNoIiwiYSI6ImNsaTR2dnFodzBzOGwzZm85bjVuaXE1aXgifQ.agRRGDJNR4PR49RIQ3nmWg');


export interface MarkerProps{
  id:string,
  longitude:number,
  latitude:number,
}

type MapProps = NativeStackScreenProps<RootStackParamList, 'Map'>

  const MapDisplay = ({route,navigation}:MapProps) => {
  
  const [markers,setMarkers] = React.useState<MarkerProps[]>([]);
  const [id,setId] = React.useState<number>(0);
  const map = React.useRef<Mapbox.MapView>(null);
  const camera = React.useRef<Mapbox.Camera>(null);

  const [location, setLocation] = React.useState<Location.LocationObject>();
  const [errorMsg, setErrorMsg] = React.useState<String>();
  const [userLongitude,setUserLongitude] = React.useState<number>(63.506144);
  const [userLatitude,setUserLatitude] = React.useState<number>(9.20091);

  

  React.useEffect(()=>{
    (async ()=>{
      let newlocation = await Location.getCurrentPositionAsync({});
      console.log(newlocation.coords.latitude)
      setLocation(newlocation);
    }
  )()},[])

  React.useEffect(()=>{
    if(location!== undefined){
      setUserLongitude(location.coords.longitude);
      setUserLatitude(location.coords.latitude);
    }
  },[location])
  
  React.useEffect(()=>{
    camera.current?.setCamera({
      zoomLevel:10,
      centerCoordinate : [userLongitude,userLatitude],
    })
    },[userLongitude,userLatitude]);

    
    const someOneMarked = async (ev:GestureResponderEvent)=>{
      
      const locx =Math.round(ev.nativeEvent.locationX);
      const locy = Math.round(ev.nativeEvent.locationY);
      console.log("TOUCH : ")
      try{
        let coord:Position|undefined = await map.current?.getCoordinateFromView([locx,locy]);
        if(coord !== undefined){
          setMarkers([...markers,{id:"id"+id,longitude:coord[0],latitude:coord[1]}])
          let newId = id+1;
          setId( newId);
          console.log("TOUCH : "+coord[0]+" , "+coord[1])
        }else{
          console.log("NO TOUCH : ")
        }
      
      }
      catch{
        
      }
      
    }

    return (
      <TouchableOpacity activeOpacity={1} onLongPress={someOneMarked}>
      <View style={styles.page}>
        <View style={styles.container}>
          
            <Mapbox.MapView ref={map} style={styles.map}>
              
              <Mapbox.Camera ref={camera} minZoomLevel={8} maxZoomLevel={15} />
              <Mapbox.MarkerView id="userLoc" coordinate={[userLongitude,userLatitude]}>
                <Image style={styles.marker} source={require('./loc.png')}/>
              </Mapbox.MarkerView>
              {
                markers.map((item,index)=>{
                  console.log(index)
                  return(
                    <Mapbox.MarkerView key={item.id} id={item.id} coordinate={[item.longitude,item.latitude]}>
                      <Image style={styles.marker} source={require('./mark.png')}/>
                    </Mapbox.MarkerView>
                  )
                })
              }
            </Mapbox.MapView>
            <View style={styles.control}>
            <TouchableOpacity style={styles.trigger} onPress={(ev)=>{}}>
              <Text>Clear last</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.trigger} onPress={
              (ev)=>{
                
                camera.current?.setCamera(
                {
                  centerCoordinate : [userLongitude,userLatitude],
                }
            )
            console.log("center ")}}>
              <Text>Center</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.trigger} onPress={(ev)=>{ 
                setId(0)
                setMarkers([])
              }}>
              <Text>Clear All</Text>
            </TouchableOpacity>
           
        </View>
        </View>
        
        
      </View >
      </TouchableOpacity>
    );
  }
  
  export default MapDisplay;

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      height: "100%",
      width: "100%",
    },
    control: {
      flex:1,
      flexDirection: 'row',
      backgroundColor:'black',
      height: "100%",
      width: "100%",
    },
    trigger: {
      flex:1,
      padding:5,
      height: "100%",
      width: "100%",
      fontSize:15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    map: {
      flex: 8
    },
    marker:{
    height:25,
    width:15,
    }
  });

  /*
   {markers.length>0 &&
                markers.map((item,index)=>{
                  console.log(index)
                  return(
                    <Mapbox.MarkerView id={item.id} coordinate={[item.userLongitude,item.userLatitude]}>
                      <Image style={styles.marker} source={require('./mark.png')}/>
                    </Mapbox.MarkerView>
                  )
                })
              }
  
  */