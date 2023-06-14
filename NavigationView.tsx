import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MapDisplay from './userscreens/MapDisplay';
import SetupDisplay from './userscreens/setup';
import { AuthContext } from './App';
import MainDisplay from './userscreens/Main';

export type RootStackParamList = {
  Main: {
  },
  Map:{

  },
  Login:{

  }
};

const Stack = createNativeStackNavigator<RootStackParamList>();
 

const MyStack = () => {
  const [userkey,setUserKey,loading,setLoadFlag] = React.useContext(AuthContext)
  return (
    <NavigationContainer>
      
        {userkey === '' ?
        <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={SetupDisplay}
          initialParams={{  }}
        /></Stack.Navigator>
        :
        <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={MainDisplay}
          initialParams={{  }}
        />
        <Stack.Screen
          name="Map"
          component={MapDisplay}
          initialParams={{  }}
        />

        </Stack.Navigator>
        }
        
      
    </NavigationContainer>
    
  );
};

export default MyStack;