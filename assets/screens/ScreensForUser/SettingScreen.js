import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

import SPACING from "../../config/SPACING";
import COLORS from "../../config/COLORS";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-gesture-handler";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import firebase from "../../firebase/firebase";
import "firebase/compat/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

const SettingScreen = ({ navigation }) => {
  const [ad, setAd] = useState("");
  const [soyad, setSoyad] = useState("");
  const [tcNo, setTcNo] = useState("");
  const [telNo, setTelNo] = useState("");
  const [sex, setSexs] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    // Sayfa açıldığında AsyncStorage'dan verileri alıp useState'lere atama
    const loadData = async () => {
      try {
        // AsyncStorage'dan verileri alıyoruz
        const storedAd = await AsyncStorage.getItem("Ad");
        const storedSoyad = await AsyncStorage.getItem("Soyad");
        const storedTcNo = await AsyncStorage.getItem("TcNo");
        const storedTelNo = await AsyncStorage.getItem("TelNo");
        const storedSex = await AsyncStorage.getItem("Cinsiyet");
        const storedDate = await AsyncStorage.getItem("DogumTarihi");
        // Verileri useState'lere atıyoruz
        if (storedAd) setAd(storedAd);
        if (storedSoyad) setSoyad(storedSoyad);
        if (storedTcNo) setTcNo(storedTcNo);
        if (storedTelNo) setTelNo(storedTelNo);
        if (storedSex) setSexs(storedSex);
        if (storedDate) setDate(storedDate);
      } catch (error) {
        console.error("AsyncStorage okuma hatası:", error);
      }
    };

    loadData();
  }, []); // Sadece component mount olduğunda çalışacak

  const updateUser = async () => {
    try {
      // Get User_ID to identify the user (optional, depends on your use case)
      const User_ID = await AsyncStorage.getItem("User_ID");
      console.log(User_ID);

      const snapshot = await firebase.database().ref("Users").once("value");
      const users = snapshot.val();
      console.log(users);

      console.log("Veriler başarıyla kaydedildi.");
    } catch (error) {
      console.error("AsyncStorage kaydetme hatası:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: SPACING * 7 }}>
      {/* Drawer'ı açan özel ikon */}
      <TouchableOpacity
        style={{ position: "absolute", top: SPACING * 5, left: SPACING * 2 }}
        onPress={() => navigation.openDrawer()}
      >
        <MaterialIcons name="menu" size={32} color="black" />
      </TouchableOpacity>
      <View style={{}}>
        <View
          style={{
            width: "100%",
            height: 200,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={{
              width: 200,
              height: 200,
              borderRadius: 100,
              borderColor: COLORS.primary,
              borderWidth: 2,
            }}
            source={require("../../image/avatar.png")}
          />
          <View>
            <Text
              style={{
                color: COLORS.dark,
                fontSize: SPACING * 2.5,
                fontWeight: "700",
              }}
            >
              Merhaba, Enes Özbuğanlı
            </Text>
          </View>
        </View>

        <View
          style={{
            marginTop: SPACING * 5,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                marginLeft: SPACING * 2,
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontSize: SPACING * 2,
                  fontWeight: "700",
                  color: COLORS.dark,
                }}
              >
                Adınız
              </Text>
              <TextInput
                placeholder="Adınız"
                style={{
                  width: "80%",
                  height: SPACING * 4,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: COLORS.dark,
                  marginTop: SPACING,
                  textAlign: "center",
                  fontSize: SPACING * 1.5,
                  fontWeight: "bold",
                }}
                value={ad}
                onChangeText={(item) => setAd(item)}
              />
            </View>
            <View
              style={{
                marginRight: SPACING * 2,
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontSize: SPACING * 2,
                  fontWeight: "700",
                  color: COLORS.dark,
                }}
              >
                Soyadınız
              </Text>
              <TextInput
                placeholder="Soy Adınız"
                style={{
                  width: "80%",
                  height: SPACING * 4,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: COLORS.dark,
                  marginTop: SPACING,
                  textAlign: "center",
                  fontSize: SPACING * 1.5,
                  fontWeight: "bold",
                }}
                value={soyad}
                onChangeText={(item) => setsoyad(item)}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                marginTop: SPACING * 2,
              }}
            >
              <Text
                style={{
                  fontSize: SPACING * 2,
                  fontWeight: "700",
                  color: COLORS.dark,
                }}
              >
                Tc Kimlik Numaranız
              </Text>
              <TextInput
                placeholder="Tc Kimlik Numaranız"
                style={{
                  width: "80%",
                  height: SPACING * 4,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: COLORS.dark,
                  marginTop: SPACING,
                  textAlign: "center",
                  fontSize: SPACING * 1.5,
                  fontWeight: "bold",
                }}
                keyboardType="numeric"
                value={tcNo}
                onChangeText={(item) => setTcNo(item)}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                marginTop: SPACING * 2,
              }}
            >
              <Text
                style={{
                  fontSize: SPACING * 2,
                  fontWeight: "700",
                  color: COLORS.dark,
                }}
              >
                Telefon Numaranız
              </Text>
              <TextInput
                placeholder="Telefon Numaranız"
                style={{
                  width: "80%",
                  height: SPACING * 4,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: COLORS.dark,
                  marginTop: SPACING,
                  textAlign: "center",
                  fontSize: SPACING * 1.5,
                  fontWeight: "bold",
                }}
                keyboardType="numeric"
                value={telNo}
                onChangeText={(item) => settelNo(item)}
              />
            </View>
          </View>

          <View
            style={{
              marginTop: SPACING * 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                marginLeft: SPACING * 2,
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontSize: SPACING * 2,
                  fontWeight: "700",
                  color: COLORS.dark,
                }}
              >
                Cinsiyetiniz
              </Text>
              {/* Picker component for gender selection */}
              <Picker
                selectedValue={sex}
                onValueChange={(itemValue) => setSexs(itemValue)} // Correctly update the gender selection
                style={{
                  width: "80%",
                  height: SPACING * 5,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: COLORS.dark,
                  marginTop: SPACING,
                  textAlign: "center",
                  fontSize: SPACING * 1.5,
                  fontWeight: "bold",
                }}
              >
                <Picker.Item label="Erkek" value="Erkek" />
                <Picker.Item label="Kadın" value="Kadın" />
                <Picker.Item label="Diğer" value="Diğer" />
              </Picker>
            </View>
            <View
              style={{
                marginRight: SPACING * 2,
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontSize: SPACING * 2,
                  fontWeight: "700",
                  color: COLORS.dark,
                }}
              >
                Doğum Tarihiniz
              </Text>
              <TextInput
                placeholder="Doğum Tarihiniz"
                style={{
                  width: "80%",
                  height: SPACING * 4,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: COLORS.dark,
                  marginTop: SPACING,
                  textAlign: "center",
                  fontSize: SPACING * 1.5,
                  fontWeight: "bold",
                }}
                value={date}
                onChangeText={(item) => setDate(item)}
              />
            </View>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: SPACING * 4,
            }}
          >
            <TouchableOpacity
              style={{
                width: SPACING * 18,
                height: SPACING * 4,
                backgroundColor: "#00a500",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: SPACING * 2,
                borderWidth: 2,
                borderColor: COLORS.primary,
              }}
              onPress={() => updateUser()}
            >
              <Text
                style={{
                  fontSize: SPACING * 2,
                  fontWeight: "bold",
                  color: COLORS.white,
                }}
              >
                {" "}
                KAYDET{" "}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => navigation.navigate("ChangePassword")}
            >
              <Text
                style={{
                  marginTop: SPACING * 3,
                  color: COLORS.dark,
                  fontSize: SPACING * 2,
                  fontWeight: "600,",
                }}
              >
                Şifreni mi Değiştirmeye Geldin ?
              </Text>
              <Text
                style={{
                  color: COLORS.primary,
                  fontSize: SPACING * 2,
                  fontWeight: "600,",
                }}
              >
                Tıkla ve Değiştirelim :)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SettingScreen;
