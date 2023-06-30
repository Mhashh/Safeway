import React from 'react';
import MapView, { LatLng, Marker, Polygon, Region } from 'react-native-maps';
import { Pressable, StyleSheet, View,Text, TextInput } from 'react-native';
import { AuthContext, RootStackParamList } from '../helpers/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Location from 'expo-location'
type AddContractProps = NativeStackScreenProps<RootStackParamList, 'AddContracts'>

export default function AddContract({route,navigation}:AddContractProps) {

  //passed when user clicks or buys to view hits a contract from the list in the main or other screen
  const {userclient,useracc,userAddress}= React.useContext(AuthContext);
  const [location, setLocation] = React.useState<Location.LocationObject>(null);
  const [cover,setCovers] = React.useState<LatLng[]>([]);

  //region of map where obstructions are mapped
  const [region,setRegion] = React.useState<Region>({
    latitude:47,
    latitudeDelta:78,
    longitude:0,
    longitudeDelta:0,
  });
  const addCon = ()=>{
    navigation.navigate("SubmitContract",{polygon:cover})
  }

  const getLocation = async()=>{
        
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    setRegion({
      ...region,
      longitude:location.coords.longitude,
      latitude:location.coords.latitude
    })
    }
  React.useEffect(
    ()=>{
      getLocation()
    }    
    ,[])

  
  
  return (
    <View style={styles.container}>
        <MapView  style={styles.mapbox} region={region} showsUserLocation={true} onLongPress={(ev)=>{
          console.log(ev.nativeEvent.coordinate)
          console.log(cover)
          ev.persist()
          setCovers((prev)=>{
            let newcover = prev.map((value,i)=>value)
            newcover.push(ev.nativeEvent.coordinate)
            return newcover;
          })
        }}>{
          cover.length>2 &&
          <Polygon fillColor='rgba(0,25,25,0.2)' coordinates={cover}></Polygon>
        }{cover.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker}
          />
        ))}
        </MapView>
      <View style={styles.buttons}>
      <Pressable style={styles.textbutton} onPress={(ev)=>{
        
        addCon();
      }}><Text style={styles.action}>Continue</Text></Pressable>
      <Pressable style={styles.textbutton} onPress={(ev)=>{if(cover.length >0 ){
        setCovers((prev)=>{
          let newcover = prev.map((value,i)=>value)
          newcover.pop()
          return newcover;
        })
      }}}><Text style={styles.action}>Remove Marker</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:'column',
    width:'100%',
    height:'100%'
  },
  mapbox: {
    flex:9,
    width: '100%',
    height: '100%',
  },
  map: {
    flex:1,
    width: '100%',
    height: '100%',
  },
  inputs:{
    flexDirection:'column',
    flex:2,
    width: '100%',
    height: '100%',
  },
  inputbox:{
    flexDirection:'row',
    flex:1,
    width:'100%',
    height:'100%'
  },
  buttons:{
    flexDirection:'row',
    flex:1,
    width: '100%',
    height: '100%',
  },
  textbutton:{
    flex:1,
    width: '100%',
    height: '100%',
    alignItems:'center',
    padding:2
  },
  action:{
    backgroundColor:'black',
    fontSize:15,
    textAlign:'center',
    textAlignVertical:'center',
    color:'white',
    width: '100%',
    height: '100%',
    borderRadius:2,
    borderColor:'grey'
  },
  input:{
    flex:1,
    borderColor:'black',
    margin:10,
    fontSize:12,
    borderWidth:2,
    textAlign:'center'
  }
});
