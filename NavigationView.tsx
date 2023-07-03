import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
//import MapDisplay from './userscreens/MapDisplay';

import MainDisplay from './userscreens/Main';
import Login from './userscreens/Login';
import ShowThisContract from './userscreens/ShowThisContract';
import { AuthContext, RootStackParamList } from './helpers/AuthContext';
import AddContract from './userscreens/AddContract';
import SubmitContract from './userscreens/SubmitContract';
import Explore from './userscreens/Explore';
import { Wallet } from 'ethers';
import DetectHits from './userscreens/DetectHits';



const Stack = createNativeStackNavigator<RootStackParamList>();
 

const MyStack = () => {

  const [userclient,setClient] = React.useState<Wallet>(undefined);
  const [useradd,setUserAdd] = React.useState<string>("");   
  return (
    <AuthContext.Provider  value={{userclient:userclient,setClient:setClient,userAddress:useradd,setAddr:setUserAdd}}>
    <NavigationContainer>
      {userclient === undefined?
        <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          initialParams={{  }}
        />
        </Stack.Navigator>
      :
        <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={MainDisplay}
          initialParams={{  }}
          
        />
        <Stack.Screen
          name="MapShowContract"
          component={ShowThisContract}
          initialParams={{  }}
        />
        <Stack.Screen
          name="AddContracts"
          component={AddContract}
          initialParams={{  }}
        />
        <Stack.Screen
          name="SubmitContract"
          component={SubmitContract}
          initialParams={{  }}
        />
        <Stack.Screen
          name="Explore"
          component={Explore}
          initialParams={{  }}
        />
        <Stack.Screen
          name="DetectHits"
          component={DetectHits}
          initialParams={{  }}
        />
        </Stack.Navigator>
      }       
    </NavigationContainer>
    </AuthContext.Provider>    
  );
};

export default MyStack;

/*
{
          <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            initialParams={{  }}
          />
  
          </Stack.Navigator>

      }else 
      
      */