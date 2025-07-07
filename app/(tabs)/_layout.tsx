import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#001F3F',
          borderTopColor: '#ffffff20',
        },
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#ffffff80',
        headerStyle: {
          backgroundColor: '#001F3F',
        },
        headerTitleStyle: {
          fontFamily: 'Inter_600SemiBold',
          color: '#ffffff',
        },
        headerShadowVisible: false,
        tabBarLabelStyle: {
          fontWeight: 'bold',
          fontSize: 12,
        },
      }}
      initialRouteName="dashboard">
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="ask"
        options={{
          title: 'Ask',
          tabBarIcon: ({ color, size }) => <Ionicons name="location" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="news"
        options={{
          title: 'News',
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble" size={size} color={color} />,
        }}
      />
    
    </Tabs>
  );
}
