import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "react-native";

import DashboardScreen       from "../screens/DashboardScreen";
import MissionsScreen        from "../screens/MissionsScreen";
import LeaderboardScreen     from "../screens/LeaderboardScreen";
import ProfileScreen         from "../screens/ProfileScreen";
import PhishingMissionScreen from "../screens/PhishingMissionScreen";

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabIcon = ({ icon, focused }) => (
  <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{icon}</Text>
);

function MissionsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MissionsList"    component={MissionsScreen} />
      <Stack.Screen name="PhishingMission" component={PhishingMissionScreen} />
    </Stack.Navigator>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#161B22",
          borderTopColor: "#30363D",
          borderTopWidth: 1,
          height: 85,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarActiveTintColor:   "#06B6D4",
        tabBarInactiveTintColor: "#8B949E",
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tab.Screen name="Home"        component={DashboardScreen}   options={{ tabBarLabel: "Dashboard",   tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} /> }} />
      <Tab.Screen name="Missions"    component={MissionsStack}     options={{ tabBarLabel: "Missions",    tabBarIcon: ({ focused }) => <TabIcon icon="🎯" focused={focused} /> }} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} options={{ tabBarLabel: "Leaderboard", tabBarIcon: ({ focused }) => <TabIcon icon="🏆" focused={focused} /> }} />
      <Tab.Screen name="Profile"     component={ProfileScreen}     options={{ tabBarLabel: "Profile",     tabBarIcon: ({ focused }) => <TabIcon icon="👤" focused={focused} /> }} />
    </Tab.Navigator>
  );
}
