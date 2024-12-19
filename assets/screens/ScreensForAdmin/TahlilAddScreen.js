import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SPACING from "../../config/SPACING";
import COLORS from "../../config/COLORS";
import Entypo from "@expo/vector-icons/Entypo";
import firebase from "../../firebase/firebase";
import "firebase/compat/database";

const TahlilAddScreen = ({ navigation }) => {
  const [tcNo, settcNo] = useState("");
  const [iga, setIgA] = useState("");
  const [iga1, setIgA1] = useState("");
  const [iga2, setIgA2] = useState("");
  const [igg, setIgG] = useState("");
  const [igg1, setIgG1] = useState("");
  const [igg2, setIgG2] = useState("");
  const [igg3, setIgG3] = useState("");
  const [igg4, setIgG4] = useState("");
  const [igm, setIgM] = useState("");

  const handleSave = async () => {
    try {
      const snapshot = await firebase.database().ref("Users").once("value");
      const users = snapshot.val();

      let userFound = false;
      let selectedUserKey = null;

      for (let key in users) {
        if (users[key].TcNo == tcNo) {
          console.log("User bulundu:", users[key]);
          userFound = true;
          selectedUserKey = key;
          break; // Kullanıcı bulunduğunda döngüyü sonlandır
        }
      }

      if (!userFound) {
        alert("KULLANICI BULUNAMADI TC Yİ KONTROL EDİNİZ.");
        return;
      }

      // Tarih formatını oluştur
      const today = new Date();
      const formattedDate = `${today.getDate()}/${
        today.getMonth() + 1
      }/${today.getFullYear()}`;

      // Yeni tahlil verisi oluştur
      const newTahlilData = {
        TcNo: tcNo,
        Tarih: formattedDate,
        IgA: iga,
        IgG: igg,
        IgG1: igg1,
        IgG2: igg2,
        IgG3: igg3,
        IgG4: igg4,
        IgA1: iga1,
        IgA2: iga2,
        IgM: igm,
      };

      // TahlilSonuc alanına yeni veri ekle
      const tahlilSnapshot = await firebase
        .database()
        .ref("TahlilSonuc")
        .once("value");
      const tahlilData = tahlilSnapshot.val();

      // Artan ID oluştur
      let newId = 1; // Varsayılan ID değeri
      if (tahlilData) {
        const ids = Object.keys(tahlilData).map((key) => parseInt(key, 10)); // Mevcut ID'leri al
        newId = Math.max(...ids) + 1; // En büyük ID'yi bir artır
      }

      // Yeni veriyi root altına ekle
      await firebase.database().ref(`TahlilSonuc/${newId}`).set(newTahlilData);

      alert("Tahlil sonucu başarıyla genel yapıya eklendi.");

      navigation.navigate('Tahlil');
    } catch (error) {
      console.error("Hata:", error);
      alert("Bir hata oluştu.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView>
        <SafeAreaView>
          <View>
            <View
              style={{
                position: "absolute",
                top: SPACING * 3,
                left: SPACING * 2,
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: COLORS.light,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: SPACING,
                }}
              >
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                  <Entypo name="menu" size={30} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View
            style={{
              marginHorizontal: SPACING * 2,
              paddingTop: SPACING * 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: SPACING * 1.7,
                fontWeight: "600",
              }}
            >
              Haydi , yeni tahlil sonucu ekleyelim.
            </Text>
            <Text
              style={{
                fontSize: SPACING * 1.7,
                fontWeight: "600",
                paddingVertical: SPACING,
                color: "red",
              }}
            >
              Ig değerlerini mg/dL tipinde giriniz.
            </Text>
          </View>

          {/* Form alanları */}
          <View style={{ paddingHorizontal: SPACING * 2 }}>
            {[
              {
                label: "Hasta Tc Giriniz",
                value: tcNo,
                onChangeText: settcNo,
                placeholder: "Tc No Giriniz",
                keyboardType: "numeric",
              },
              {
                label: "IgA",
                value: iga,
                onChangeText: setIgA,
                placeholder: "IgA Giriniz",
              },
              {
                label: "IgA1",
                value: iga1,
                onChangeText: setIgA1,
                placeholder: "IgA1 Giriniz",
              },
              {
                label: "IgA2",
                value: iga2,
                onChangeText: setIgA2,
                placeholder: "IgA2 Giriniz",
              },
              {
                label: "IgG",
                value: igg,
                onChangeText: setIgG,
                placeholder: "IgG Giriniz",
              },
              {
                label: "IgG1",
                value: igg1,
                onChangeText: setIgG1,
                placeholder: "IgG1 Giriniz",
              },
              {
                label: "IgG2",
                value: igg2,
                onChangeText: setIgG2,
                placeholder: "IgG2 Giriniz",
              },
              {
                label: "IgG3",
                value: igg3,
                onChangeText: setIgG3,
                placeholder: "IgG3 Giriniz",
              },
              {
                label: "IgG4",
                value: igg4,
                onChangeText: setIgG4,
                placeholder: "IgG4 Giriniz",
              },
              {
                label: "IgM",
                value: igm,
                onChangeText: setIgM,
                placeholder: "IgM Giriniz",
              },
            ].map((input, index) => (
              <View
                key={index}
                style={{
                  marginBottom: SPACING,
                }}
              >
                <Text
                  style={{
                    fontSize: SPACING * 1.8,
                    fontWeight: "600",
                    marginBottom: SPACING / 2,
                  }}
                >
                  {input.label}:
                </Text>
                <TextInput
                  style={{
                    textAlign: "center",
                    width: "100%",
                    height: 40,
                    backgroundColor: COLORS.transparent,
                    borderRadius: 20,
                    borderColor: COLORS.dark,
                    color: COLORS.dark,
                    borderWidth: 1,
                  }}
                  placeholder={input.placeholder}
                  placeholderTextColor={COLORS.dark}
                  value={input.value}
                  onChangeText={input.onChangeText}
                  keyboardType={input.keyboardType || "default"}
                />
              </View>
            ))}
          </View>

          {/* Kaydet Butonu */}
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginVertical: SPACING * 2,
            }}
          >
            <TouchableOpacity
              onPress={handleSave}
              style={{
                backgroundColor: COLORS.dark,
                borderRadius: SPACING,
                paddingVertical: SPACING / 2,
                paddingHorizontal: SPACING * 3,
              }}
            >
              <Text
                style={{
                  color: COLORS.light,
                  fontSize: SPACING * 1.8,
                  fontWeight: "600",
                }}
              >
                Kaydet
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default TahlilAddScreen;

const styles = StyleSheet.create({});
