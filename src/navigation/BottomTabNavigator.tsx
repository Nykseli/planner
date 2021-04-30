/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import { Ionicons } from '@/components/Themed';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import MonthlyViewScreen from '@/screens/MonthlyViewScreen';
import DailyViewScreen from '@/screens/DailyViewScreen';
import { BottomTabParamList, MonthlyViewParamList, DailyViewParamList } from '@/types';
import NavigationHeader from '@/components/NavigationHeader';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="DailyView"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
      <BottomTab.Screen
        name="DailyView"
        component={DailyViewNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="MonthlyView"
        component={MonthlyViewNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
const TabBarIcon = (props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) => {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const MonthlyViewStack = createStackNavigator<MonthlyViewParamList>();

const MonthlyViewNavigator = () => {
  return (
    <MonthlyViewStack.Navigator>
      <MonthlyViewStack.Screen
        name="MonthlyViewScreen"
        component={MonthlyViewScreen}
        options={{ headerTitle: () => <NavigationHeader text="Monthly View" /> }}
      />
    </MonthlyViewStack.Navigator>
  );
}

const DailyViewStack = createStackNavigator<DailyViewParamList>();

const DailyViewNavigator = () => {
  return (
    <DailyViewStack.Navigator>
      <DailyViewStack.Screen
        name="DailyViewScreen"
        component={DailyViewScreen}
        options={{ headerTitle: () => <NavigationHeader text="Daily View" /> }}
      />
    </DailyViewStack.Navigator>
  );
}


export default BottomTabNavigator;
