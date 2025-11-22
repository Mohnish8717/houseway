import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import auth screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import GuestScreen from '../screens/guest/GuestScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
<<<<<<< HEAD
      initialRouteName="Login"
=======
      initialRouteName="Login"  // Changed from "Guest" to "Login"
>>>>>>> 60c78fb01d377ad30a455a09ac3e87b622bd5f70
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
<<<<<<< HEAD
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Houseway Login',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Register' }}
      />
      <Stack.Screen
        name="Guest"
        component={GuestScreen}
        options={{
          title: 'Houseway - House Design Company',
          headerShown: false,
        }}
=======
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ title: 'Login' }} 
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{ title: 'Register' }} 
>>>>>>> 60c78fb01d377ad30a455a09ac3e87b622bd5f70
      />
      <Stack.Screen 
        name="Guest" 
        component={GuestScreen} 
        options={{ 
          title: 'Houseway - House Design Company',
          headerShown: false,
        }} 
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;