import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { FinanceProvider } from './src/context/FinanceContext';
import DashboardScreen from './src/screens/DashboardScreen';
import TransactionsScreen from './src/screens/TransactionsScreen';
import GoalsScreen from './src/screens/GoalsScreen';
import ChatScreen from './src/screens/ChatScreen';

const Tab = createBottomTabNavigator();

const COLORS = {
  bg: '#080E15',
  card: '#0F1923',
  primary: '#00E5C3',
  textMuted: 'rgba(255,255,255,0.4)',
  border: 'rgba(255,255,255,0.06)',
};

const TAB_ICONS = {
  Dashboard: '📊',
  Transactions: '🧾',
  Goals: '🎯',
  'AI Chat': '🧠',
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <FinanceProvider>
          <NavigationContainer>
            <StatusBar barStyle="light-content" backgroundColor="#080E15" />
            <Tab.Navigator
              screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                  backgroundColor: COLORS.card,
                  borderTopColor: COLORS.border,
                  borderTopWidth: 1,
                  paddingBottom: 8,
                  paddingTop: 8,
                  height: 70,
                },
                tabBarLabel: route.name,
                tabBarLabelStyle: {
                  fontSize: 11,
                  fontWeight: '500',
                  marginTop: 2,
                },
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textMuted,
                tabBarIcon: ({ focused }) => {
                  const icon = TAB_ICONS[route.name] || '●';
                  return (
                    <React.Fragment>
                      <StatusBar barStyle="light-content" />
                      {/* Icon as emoji for simplicity */}
                    </React.Fragment>
                  );
                },
              })}
            >
              <Tab.Screen name="Dashboard" component={DashboardScreen} />
              <Tab.Screen name="Transactions" component={TransactionsScreen} />
              <Tab.Screen name="Goals" component={GoalsScreen} />
              <Tab.Screen name="AI Chat" component={ChatScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        </FinanceProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
