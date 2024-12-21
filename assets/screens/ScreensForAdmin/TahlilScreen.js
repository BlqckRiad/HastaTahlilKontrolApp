import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SPACING from "../../config/SPACING";
import COLORS from "../../config/COLORS";
import Entypo from "@expo/vector-icons/Entypo";
import firebase from "../../firebase/firebase";
import "firebase/compat/database";
import { useEffect } from "react";

import Feather from "@expo/vector-icons/Feather";

const TahlilScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // Firebase'den verileri çekme
    const loadData = async () => {
      try {
        const snapshot = await firebase
          .database()
          .ref("TahlilSonuc")
          .once("value");
        const tahlils = snapshot.val();
        const tahlilArray = tahlils ? Object.values(tahlils) : []; // Objeyi diziye dönüştür
        setData(tahlilArray);
        
      } catch (error) {
        console.error("Tahlil Sonuçları Gelmiyor:", error);
      }
    };
    
    loadData();
  }, [data]); // navigation bağımlılığı ekleniyor

  const renderItem = ({ item }) => (
    
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        height: 40,
        alignItems: "center",
        marginTop: 16, // SPACING'i varsayılan olarak 16 aldım
      }}
    >
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 16, fontWeight: "700" }}>Tc No</Text>
        <Text style={{ fontSize: 14, fontWeight: "500" }}>{item.TcNo}</Text>
      </View>

      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 16, fontWeight: "700" }}>Tarih</Text>
        <Text style={{ fontSize: 14, fontWeight: "500" }}>{item.Tarih}</Text>
      </View>

      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 16, fontWeight: "700" }}>Detay</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("TahlilDetail", { item })}
        >
          <Feather name="arrow-right" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );

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
              paddingTop: 32, // SPACING * 8 varsayılan olarak 32 aldım
              paddingHorizontal: 10, // SPACING * 2.5 varsayılan olarak 10 aldım
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                paddingTop: SPACING * 3,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "600" }}>
                Tahliller Arasında Araştırma Yapalım
              </Text>
              <TextInput
                placeholder="Ara"
                style={{
                  width: "100%",
                  height: 40,
                  borderRadius: 20,
                  borderWidth: 1,
                  backgroundColor: "transparent",
                  textAlign: "center",
                }}
              />
            </View>

            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()} // Benzersiz bir key kullanın
              renderItem={renderItem}
              nestedScrollEnabled
              style={{
                marginTop: 16, // SPACING * 2
                width: "100%",
              }}
            />
          </View>
        </SafeAreaView>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default TahlilScreen;

const styles = StyleSheet.create({});
