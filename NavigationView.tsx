import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
//import MapDisplay from './userscreens/MapDisplay';

import MainDisplay from './userscreens/Main';
import Login from './userscreens/Login';
import ShowThisContract from './userscreens/ShowThisContract';
import { Client } from '@hashgraph/sdk';
import { AuthContext, RootStackParamList } from './helpers/AuthContext';



const Stack = createNativeStackNavigator<RootStackParamList>();
 

const MyStack = () => {

  const [client,setClient] = React.useState<Client>(undefined);
  const [useracc,setUserAcc] = React.useState<string>("");   
  return (
    <AuthContext.Provider  value={{client:client,setClient:setClient,useracc,setUserAcc}}>
    <NavigationContainer>

      {client === undefined?
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