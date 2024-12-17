import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import { ScrollView } from "react-native-gesture-handler";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import COLORS from "../config/COLORS";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const CustomDrawerContent = ( props) => {
  const [ad, setAd] = useState(""); 
  const [soyad, setSoyad] = useState(""); 

  // State güncelleme fonksiyonu
  const updateUserInfo = async () => {
    try {
      const storedAd = await AsyncStorage.getItem("Ad");
      const storedSoyad = await AsyncStorage.getItem("Soyad");
      if (storedAd !== null) {
        setAd(storedAd); // State'i güncelle
      }
      if (storedSoyad !== null) {
        setSoyad(storedSoyad); // State'i güncelle
      }
    } catch (error) {
      console.error("Error fetching Ad from AsyncStorage", error);
    }
  };

  updateUserInfo();
  return (
    
    <ScrollView style={styles.drawerContainer}>
      {/* Avatar Resmi */}
      <Image source={require("../image/avatar.png")} style={styles.avatar} />

      {/* İsim Soyisim */}
    
      <Text style={styles.name}>
        {ad} {soyad}
      </Text>

      {/* Altındaki Çizgi */}
      <View style={styles.separator} />

      {/* Menü Elemanları */}
      <View style={styles.menuContainer}>
        {/* Drawer'dan navigasyon */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => props.navigation.navigate("Home")}
        >
          <Entypo name="home" size={24} color="black" />
          <Text style={styles.menuText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => props.navigation.navigate("Settings")}
        >
          <Entypo name="cog" size={24} color="black" />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => props.navigation.navigate("S3")}
        >
          <AntDesign name="question" size={24} color="black" />
          <Text style={styles.menuText}>Sık Sorulan Sorular</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            AsyncStorage.clear();
           
            props.navigation.navigate("Login");
          }}
        >
          <MaterialIcons name="logout" size={24} color="black" />
          <Text style={styles.menuText}>Çıkış Yap</Text>
        </TouchableOpacity>

        <View style={styles.separator} />
        <View style={styles.avatar}>
          <FontAwesome
            style={{
              paddingLeft: 8,
            }}
            name="hospital-o"
            size={100}
            color="black"
          />
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: 1,
          }}
        >
          <Text
            style={{
              paddingTop: 30,
              color: COLORS.dark,
              fontSize: 24,
              fontWeight: "bold",
            }}
          >
            HOŞGELDİNİZ
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "black",
    marginVertical: 15,
  },
  menuContainer: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 5, // Menü öğeleri arasında boşluk
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
    color: "black",
  },
});
