import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 메인 화면 관련 컴포넌트
import Home from '../main/Home';
import SelectRegion from '../main/SelectRegion';
import SelectAge from '../main/SelectAge';
import DiceFriendsDs from '../main/DiceFriendsDs';
import hihihi from '../main/hihihi';

const Stack = createNativeStackNavigator();

export default function MainNavigator({ route }) {
  // route.params가 있을 경우, 인증 정보를 추출
  const initialParams = route?.params || {};

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name='Home' 
        component={Home} 
        initialParams={initialParams}
      />
      <Stack.Screen name='SelectRegion' component={SelectRegion} />
      <Stack.Screen name='SelectAge' component={SelectAge} />
      <Stack.Screen name='DiceFriendsDs' component={DiceFriendsDs} />
      <Stack.Screen name='hihihi' component={hihihi} />
    </Stack.Navigator>
  );
} 