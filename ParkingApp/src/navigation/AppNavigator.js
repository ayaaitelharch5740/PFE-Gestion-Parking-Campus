import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { NavigationContainer }           from '@react-navigation/native'
import { createBottomTabNavigator }      from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useAuth }  from '../context/AuthContext.js'
import { useTheme } from '../context/ThemeContext.js'

import LoginScreen          from '../screens/LoginScreen.js'
import RegisterScreen       from '../screens/RegisterScreen.js'
import SlotsScreen          from '../screens/SlotsScreen.js'
import ReservationScreen    from '../screens/ReservationScreen.js'
import MyReservationsScreen from '../screens/MyReservationsScreen.js'
import VehiclesScreen       from '../screens/VehiclesScreen.js'

const Tab        = createBottomTabNavigator()
const AuthStack  = createNativeStackNavigator()
const SlotsStack = createNativeStackNavigator()
const MainStack  = createNativeStackNavigator()

function AuthNavigator() {
  return React.createElement(AuthStack.Navigator,
    { screenOptions: { headerShown: false } },
    React.createElement(AuthStack.Screen, { name: 'Login',    component: LoginScreen }),
    React.createElement(AuthStack.Screen, { name: 'Register', component: RegisterScreen })
  )
}

function SlotsNavigator() {
  return React.createElement(SlotsStack.Navigator,
    { screenOptions: { headerShown: false } },
    React.createElement(SlotsStack.Screen, { name: 'SlotsList',   component: SlotsScreen }),
    React.createElement(SlotsStack.Screen, { name: 'Reservation', component: ReservationScreen })
  )
}

function TabNavigator() {
  const { colors } = useTheme()

  const TAB_ICONS = {
    SlotsTab:       '🅿',
    MyReservations: '📋',
    Vehicles:       '🚗',
  }

  return React.createElement(Tab.Navigator,
    {
      screenOptions: ({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor:  colors.tabBorder,
          borderTopWidth:  1,
          height:          62,
          paddingBottom:   8,
          paddingTop:      4,
        },
        tabBarActiveTintColor:   colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700' },
        tabBarIcon: ({ focused }) =>
          React.createElement(View, {
            style: {
              width: 34, height: 34,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: focused ? colors.primaryLight : 'transparent',
            }
          },
            React.createElement(Text, { style: { fontSize: 17 } },
              TAB_ICONS[route.name] ?? '•'
            )
          )
      })
    },
    React.createElement(Tab.Screen, {
      name: 'SlotsTab',
      component: SlotsNavigator,
      options: { tabBarLabel: 'Places' }
    }),
    React.createElement(Tab.Screen, {
      name: 'MyReservations',
      component: MyReservationsScreen,
      options: { tabBarLabel: 'Réservations' }
    }),
    React.createElement(Tab.Screen, {
      name: 'Vehicles',
      component: VehiclesScreen,
      options: { tabBarLabel: 'Véhicules' }
    })
  )
}

export default function AppNavigator() {
  const { user, loading } = useAuth()
  const { colors }        = useTheme()

  if (loading) return React.createElement(View,
    { style: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg } },
    React.createElement(ActivityIndicator, { size: 'large', color: colors.primary })
  )

  return React.createElement(NavigationContainer, null,
    user
      ? React.createElement(TabNavigator)
      : React.createElement(AuthNavigator)
  )
}