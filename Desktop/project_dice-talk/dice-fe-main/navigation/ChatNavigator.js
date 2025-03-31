import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 채팅 관련 컴포넌트
import Chat from '../chat/Chat';
import ChatReport from '../chat/ChatReport';
import ChatMain from '../chat/ChatMain';
import LetterEventScreen from '../loveEvent/LetterEventScreen';

const Stack = createNativeStackNavigator();

export default function ChatNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name='ChatMain' 
        component={ChatMain} 
        options={{ headerShown: false }}
      />
      <Stack.Screen name='Chat' component={Chat} />
      <Stack.Screen name='ChatReport' component={ChatReport} />
      <Stack.Screen name='LetterEventScreen' component={LetterEventScreen} />
    </Stack.Navigator>
  );
} 