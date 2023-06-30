import { Client } from "@hashgraph/sdk";
import React from "react";
import { LatLng } from "react-native-maps";

export type GlobalState = {
    userclient:Client,
    setClient:React.Dispatch<React.SetStateAction<Client>>,
    useracc:string,
    setUserAcc:React.Dispatch<React.SetStateAction<string>>,
    userAddress:string,
    setAddr:React.Dispatch<React.SetStateAction<string>>
  }

  export type RootStackParamList = {
    Main: {
    },
    MapShowContract:{
      polygon:LatLng[],
      hits:LatLng[]|undefined,
      contractid:string,
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