import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LogBox } from 'react-native';

// Import Firebase config
import './firebaseConfig'; // Ensure this is executed so Firebase is initialized

// Import your screens
import FacultyLoginScreen from './screens/FacultyloginScreen';
import StudentLoginScreen from './screens/StudentLoginScreen';
import GenerateClassIdScreen from './screens/GenerateClassIdScreen';
import MarkAttendanceScreen from './screens/MarkAttendanceScreen';
import AttendanceListScreen from './screens/AttendanceListScreen'; // Optional
import UserTypeSelectionScreen from './screens/usertype';

// Ignore specific warnings
LogBox.ignoreLogs(['DebuggingOverlay']);

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="UserTypeSelectionScreen">
        <Stack.Screen name="UserTypeSelectionScreen" component={UserTypeSelectionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="FacultyLogin" component={FacultyLoginScreen} />
        <Stack.Screen name="StudentLogin" component={StudentLoginScreen} />
        <Stack.Screen name="GenerateClassId" component={GenerateClassIdScreen} />
        <Stack.Screen name="MarkAttendance" component={MarkAttendanceScreen} />
        <Stack.Screen name="AttendanceList" component={AttendanceListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
