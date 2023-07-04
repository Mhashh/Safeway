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
      name:string,
      mapid:string,
      alertid:string,
      ownerid:string,
      city:string,
    },
    DetectHits:{
      polygon:LatLng[],
      contractid:string,
      ownerid:string
    },
    AddContracts:{
      
    },
    SubmitContract:{
      polygon:LatLng[]
    },
    Login:{
  
    },
    Explore:{
      
    },
    AddFund:{
      contractid:string
    }
  };

export const AuthContext = React.createContext<GlobalState>(undefined);