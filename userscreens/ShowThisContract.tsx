import React from 'react';
import MapView, { Camera, LatLng, Marker, Polygon, Region } from 'react-native-maps';
import { StyleSheet, View,Text, Pressable } from 'react-native';
import { AuthContext, RootStackParamList } from '../helpers/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getMarker, hits, hitsA, polygon, viewMarker, viewMarkers, viewcost } from '../helpers/CallUserContracts';

type MapShowContractProps = NativeStackScreenProps<RootStackParamList, 'MapShowContract'>

export default function ShowThisContract({route,navigation}:MapShowContractProps) {

  const {userclient,userAddress} = React.useContext(AuthContext);


  //passed when user clicks or buys to view hits a contract from the list in the main or other screen
  const {name,mapid,alertid,city,ownerid} = route.params;

  //road obstructions or caution region
  const [markers,setMarkers] = React.useState<LatLng[]>([]);

  
  //region of map where camera should point
  const [region,setRegion] = React.useState<Camera>({center:{latitude:0,longitude:0},heading:0,zoom:14,pitch:0,altitude:undefined});
  
  //region of map cover
  const [area,setArea] = React.useState<LatLng[]>([]);
  
  //road issue points
  const [points,setPoints] = React.useState<LatLng[]>([]);

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

  const getHits = async()=>{
    const noofpoints = await hitsA(alertid,userclient);
    const price = await viewcost(alertid,userclient);
    console.log(price+"   "+noofpoints);
    if(ownerid === userAddress){
      let ans : LatLng[]= []
      for(let i = 0;i<noofpoints;i++){
        const coord = await getMarker(alertid,i,userclient);
        if(coord!== undefined){
          ans.push(coord)
        }
      }
      setPoints(ans);
    }
    else{
      let ans : LatLng[]= []
      for(let i = 0;i<noofpoints;i++){
        //get ith coordinate
        const coord = await viewMarker(alertid,i,userclient);

        
        if(coord!== undefined){
          ans.push(coord)
        }else{
          
          //can't get ith coordinate "not subscribed" show payment prompt
          const paid = await viewMarkers(alertid,price,userclient);
          if(paid){
            i--;
          }
          else{
            break;
          }
        }
      }
      setPoints(ans);
    }
  }
  
  React.useEffect(
    ()=>{
      getPolygon();
    }    
    ,[])

  
  return (
    <View style={styles.container}>
      <View style={styles.infobar}><Text style={styles.info}>MapName : {name}{'\n'}City: {city}</Text></View>
      <MapView style={styles.map} camera={region} showsUserLocation={true}>
        {
          area.length>2 &&<Polygon coordinates={area}></Polygon>
        }{area.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker}
          />
        ))}
        {points.length >0 && points.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker}
          />
        ))}
      </MapView>
      <View style={styles.buttons}>
      <Pressable style={styles.textbutton} onPress={(ev)=>{
          
          getHits().then().catch((err)=>{console.log(err)})
        }}
      ><Text style={styles.action}>View alerts </Text></Pressable>
      <Pressable style={styles.textbutton} onPress={(ev)=>{
          if(polygon.length>2){
            navigation.navigate("DetectHits",{
              polygon:area,
              contractid:alertid,
              ownerid:userAddress
            })
          }
        }}
      ><Text style={styles.action}>Detect/Report road issues </Text></Pressable>
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
  map: {
    flex:10,
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
  },buttons:{
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
  }
});
