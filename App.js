import React from "react";
import LoginScreen from "./assets/screens/LoginScreen";
import RegisterScreen from "./assets/screens/RegisterScreen";

import HomeScreen from "./assets/screens/ScreensForUser/HomeScreen";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import COLORS from "./assets/config/COLORS";

import Entypo from "@expo/vector-icons/Entypo";
import SettingScreen from "./assets/screens/ScreensForUser/SettingScreen";

import CustomDrawerContent from "./assets/DrawerContent/CustomDrawerContent ";
import ChangePassword from "./assets/screens/ChangePassword";
import SThreeScreen from "./assets/screens/SThreeScreen";
import AntDesign from "@expo/vector-icons/AntDesign";




const Drawer = createDrawerNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false, // Tüm ekranlar için header'ı kaldırır
          drawerActiveTintColor: COLORS.dark, // Aktif menü yazı rengi
          drawerActiveBackgroundColor: COLORS.primary, // Aktif menü arkaplan rengi
        }}
      >
        <Drawer.Screen
          name="Login"
          component={LoginScreen}
          options={{
            drawerIcon: () => <Entypo name="cog" size={24} color="black" />,
          }}
        />
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{
            drawerIcon: () => <Entypo name="home" size={24} color="black" />,
          }}
        />
        <Drawer.Screen
          name="Settings"
          component={SettingScreen}
          options={{
            drawerIcon: () => <Entypo name="cog" size={24} color="black" />,
          }}
        />
        <Drawer.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={{
            drawerIcon: () => (
              <AntDesign name="question" size={24} color="black" />
            ),
          }}
        />
        <Drawer.Screen
          name="S3"
          component={SThreeScreen}
          options={{
            drawerIcon: () => <Entypo name="cog" size={24} color="black" />,
          }}
        />

        <Drawer.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            drawerIcon: () => <Entypo name="cog" size={24} color="black" />,
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;