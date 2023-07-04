import React from 'react';
import MapView, { Camera, LatLng, Marker, Polygon } from 'react-native-maps';
import { StyleSheet, View,Text, Pressable, Alert } from 'react-native';
import { AuthContext, RootStackParamList } from '../helpers/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import {
  Accelerometer,
} from 'expo-sensors';

import { Subscription } from 'expo-sensors/build/Pedometer';
import { addFund, detected, withdrawA } from '../helpers/CallUserContracts';

type DetectHitsProps = NativeStackScreenProps<RootStackParamList, 'DetectHits'>
type AccelerationData = {x:number,y:number,z:number}

function calculateMagnitude(data:AccelerationData){
  return Math.sqrt((data.x * data.x)+(data.y * data.y)+(data.z * data.z));
}

//dialog box to alert
const showAlert = (header:string,detail:string) : Promise<boolean>=>{
  return new Promise((resolve,reject)=>{
      Alert.alert(
          header,
          detail,
          [
            {
              text: 'submit',
              onPress: () =>{
                  
                  resolve(true)
                  },
              style: 'default',
            },
            {
              text: 'cancel',
              onPress: () =>{
                  
                  resolve(false)
                  },
              style: 'default',
            }
          ],
          {
          cancelable: true,
          },
      );}
  )
}

export default function DetectHits({route,navigation}:DetectHitsProps) {


  const {userclient,userAddress} = React.useContext(AuthContext);
  //passed when user clicks or buys to view hits a contract from the list in the main or other screen
  const {polygon,contractid,ownerid} = route.params;
  
  let runningAverage:number = 0;
  //road obstructions or caution region
  const [markers,setMarkers] = React.useState<LatLng[]>([]);

  //region of map where obstructions are mapped
  const [area,setArea] = React.useState<LatLng[]>([]);

   //region of map where camera should point
   const [region,setRegion] = React.useState<Camera>({center:{latitude:0,longitude:0},heading:0,zoom:14,pitch:0,altitude:undefined});
  
   //event listener for acceleration data
  const [subscription, setSubscription] = React.useState<Subscription>();

  //location for passing to detect
  const [gps, setLocation] = React.useState<Location.LocationObject>(undefined);
  
  //acceleration
  const [ accl ,setAccl ] = React.useState<AccelerationData>({
    x:0,
    y:0,
    z:0,
  })

  const locationInit =async () => {
      
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  }
  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener(setAccl)
    );
  };

  //after a hit check if the coordinate lies inside the region
  const polygonInside = ():boolean=>{
    const lat = gps.coords.latitude;
    const lon = gps.coords.longitude;
    let intersect = 0;
    const n = polygon.length;
    for(let i = 0;i<n;i++){
      if(polygon[i].latitude >= lat  && polygon[(i+1)%n].latitude >= lat ){
        if(polygon[i].longitude <= lon  && polygon[(i+1)%n].longitude >= lon || polygon[(i+1)%n].longitude >= lon  && polygon[i].longitude <=lon ){
          intersect++;
        }
      }
    }
    if(intersect%2==0)
      return false;
    else
      return true;
  }

  const _unsubscribe = () => {
    subscription && subscription.remove();
    Accelerometer.removeAllListeners()
    setSubscription(undefined);
    setAccl({x:0,y:0,z:0})
  };

  
  
  React.useEffect(
    ()=>{
      setArea(polygon);
      if(polygon.length>0){
        setRegion({
          ...region,
          center:{
            latitude:polygon[0].latitude,
            longitude:polygon[0].longitude
          }
        })
      }
      _subscribe();
      locationInit();
    }    
    ,[])

    //to replace with some algo or ml model to detect abrupt speed changes
    //currently using running average ¯\_(ツ)_/¯
    React.useEffect(()=>{
      const curr = calculateMagnitude(accl);
      if(gps!==undefined && Math.abs(curr-runningAverage)>=1.9){
        //call smart contract
        _unsubscribe();
        if(polygonInside()){
          showAlert("Road issue detected","submit?").then(()=>{
            detected(contractid,gps.coords.longitude,gps.coords.latitude,userclient).then((res)=>{
              if(res)
                console.log("progress : "+"yes")
              else
                console.log("progress : "+"no")
              _subscribe()
            }).catch((err)=>{
              _subscribe()
            })
          }).catch((err)=>{
            _subscribe();
          })
        }else{
          Alert.alert("outside the area.")
          _subscribe();
        }
        

      }
      
      runningAverage = (curr+runningAverage)/2;
    }
      ,[accl])

  
  
  return (
    <View style={styles.container}>
      <View style={styles.display}><Text style={styles.textbox}>{accl.x} {accl.y} {accl.z}</Text>
      </View>
      <MapView style={styles.map} camera={region} showsUserLocation={true}>
        {
          area.length>2 && <Polygon coordinates={area}></Polygon>
        }

        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker}
          />
        ))}
      </MapView>
      {(ownerid == userAddress)&&<View style={styles.buttons}>
        <Pressable style={styles.textbutton} onPress={(ev)=>{
             
             if(gps!==undefined && polygonInside()){
              _unsubscribe();
               showAlert("Road issue detected","submit?").then(()=>{
                 detected(contractid,gps.coords.longitude,gps.coords.latitude,userclient).then((res)=>{
                   _subscribe()
                 }).catch((err)=>{
                   _subscribe()
                 })
               }).catch((err)=>{
                 _subscribe();
               })
             }else{
               Alert.alert("outside the area.")
               _subscribe();
             }
        }}
      ><Text style={styles.action}>Add New Alert</Text></Pressable>
      <Pressable style={styles.textbutton} onPress={(ev)=>{
          navigation.navigate("AddFund",{
            contractid:contractid,
          })
        }}
      ><Text style={styles.action}>Add funds </Text></Pressable>
      <Pressable style={styles.textbutton} onPress={(ev)=>{
          withdrawA(contractid,userclient).then((paid)=>{
            Alert.alert(paid?"Amount returned to owner.":"Withdraw failed")
          }).catch((err)=>{
            Alert.alert("Withdraw failed")
          })
        }}
      ><Text style={styles.action}>Withdraw funds </Text></Pressable>
      </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:'100%',
    height:'100%',
    flexDirection:'column'
  },
  display:{
    flex:1,
    width:'100%',
    height:'100%',
  },
  textbox:{
    width:'100%',
    height:'100%',
    fontSize:15,

  },
  map: {
    flex:10,
    width: '100%',
    height: '100%',
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
  }
});
