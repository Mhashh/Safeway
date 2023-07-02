import { Wallet } from "ethers";
import * as React from "react";
import { LatLng } from "react-native-maps";

export type GlobalState = {
    userclient:Wallet,
    setClient:React.Dispatch<React.SetStateAction<Wallet>>,
    userAddress:string,
    setAddr:React.Dispatch<React.SetStateAction<string>>
  }

  export type RootStackParamList = {
    Main: {
    },
    MapShowContract:{
      mapid:string,
      alertid:string,
      city:string
    },
    DetectHits:{
      polygon:LatLng,
      contractid:string,
      cost:number
    },
    AddContracts:{
      
    },
    SubmitContract:{
      polygon:LatLng[]
    },
    Login:{
  
    },
    Explore:{
      
    }
  };

export const AuthContext = React.createContext<GlobalState>(undefined);