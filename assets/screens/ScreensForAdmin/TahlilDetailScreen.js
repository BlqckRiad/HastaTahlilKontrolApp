import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import firebase from "../../firebase/firebase";
import "firebase/compat/database";
import SPACING from "../../config/SPACING";
import COLORS from "../../config/COLORS";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import Entypo from "@expo/vector-icons/Entypo";

const TahlilDetailScreen = ({ route, navigation }) => {
  const { item } = route.params; // Gönderilen veriyi alıyoruz
  const [foundUser, setFoundUser] = useState(null); // Kullanıcıyı durum olarak tutuyoruz
  const [FilteredTahlils, setFilteredTahlils] = useState(null); // Kullanıcıyı durum olarak tutuyoruz

  useEffect(() => {
    const loadData = async () => {
      try {
        // Firebase'den Users ve TahlilSonuc verilerini çek
        const snapshot = await firebase.database().ref("Users").once("value");
        const users = snapshot.val();

        const snapshot2 = await firebase
          .database()
          .ref("TahlilSonuc")
          .once("value");
        const hastatahlils = snapshot2.val();
        console.log(hastatahlils);
        // Kullanıcıları diziye dönüştür ve eşleşen TcNo'yu bul
        const matchedUser = Object.values(users).find(
          (user) => user.TcNo === item.TcNo
        );

        if (matchedUser) {
          // Tahlilleri matchedUser.TcNo ile filtrele
          const filteredTahlils = Object.values(hastatahlils).filter(
            (tahlil) => tahlil.TcNo === matchedUser.TcNo
          );

          // State'leri güncelle
          setFoundUser(matchedUser);
          setFilteredTahlils(filteredTahlils); // Filtrelenen tahlilleri kaydet
        } else {
          setFoundUser(null);
          setFilteredTahlils([]); // Eğer eşleşen yoksa boş bir dizi ayarla
        }
      } catch (error) {
        console.error("Tahlil Sonuçları Gelmiyor:", error);
      }
    };

    loadData();
  }, [item]); // Sadece item.TcNo değişirse yeniden çalışır

  return (
    <SafeAreaView
      style={{
        paddingHorizontal: SPACING * 2,
        paddingVertical: SPACING * 6,
      }}
    >
      <View
        style={{
          position: "absolute",
          top: SPACING * 5,
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
          <TouchableOpacity style={{}} onPress={() => navigation.openDrawer()}>
            <Entypo name="menu" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {foundUser ? (
          <View>
            <Text
              style={{
                fontWeight: "700",
                fontSize: SPACING * 1.6,
              }}
            >
              Hasta Bilgileri{" "}
            </Text>
            <View
              style={{
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: SPACING * 1.6,
                }}
              >
                Adı ve Soyadı : {foundUser.Ad} {foundUser.Soyad}{" "}
              </Text>

              <Text
                style={{
                  fontWeight: "700",
                  fontSize: SPACING * 1.6,
                }}
              >
                Tc No : {foundUser.TcNo}
              </Text>
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: SPACING * 1.6,
                }}
              >
                Telefon No : +90 {foundUser.TelNo}
              </Text>
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: SPACING * 1.6,
                }}
              >
                Doğum Tarihi : {foundUser.DogumTarihi}
              </Text>
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: SPACING * 1.6,
                }}
              >
                Cinsiyet : {foundUser.Cinsiyet}
              </Text>
            </View>

            <View
              style={{
                width: "100%",
                height: 2,
                borderRadius: 1,
                borderWidth: 1,
                borderColor: COLORS.dark,
                marginTop: SPACING,
              }}
            ></View>
          </View>
        ) : (
          <Text
            style={{
              textAlign: "center",
              fontSize: SPACING * 1.8,
              fontWeight: "600",
            }}
          >
            Veriler Yükleniyor...
          </Text>
        )}
        <View>
          <Text
            style={{
              fontSize: SPACING * 1.8,
              fontWeight: "600",
              marginTop: SPACING * 2,
              marginBottom: SPACING,
            }}
          >
            Hasta Ig Değerleri
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {Object.entries(item).map(([key, value]) => {
              // Sadece "Ig" ile başlayan değerleri gösteriyoruz
              if (key.startsWith("Ig")) {
                return (
                  <TouchableOpacity
                    key={key}
                    style={{
                      width: "45%",
                      margin: SPACING * 0.5,
                      padding: SPACING,
                      borderWidth: 1,
                      borderColor: COLORS.dark,
                      borderRadius: SPACING * 0.5,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => {
                      // Buraya tıklama olayını işlemek için bir fonksiyon ekleyin

                      const data = {
                        [key]: item[key], // Dinamik olarak key'in değerini nesne anahtarı olarak kullanıyoruz
                        DogumTarihi: foundUser.DogumTarihi,
                        TcNo: foundUser.TcNo,
                      };

                      navigation.navigate("TahlilDetailTwo", {
                        data,
                        item,
                        key,
                      });
                    }}
                  >
                    <Text
                      style={{
                        fontSize: SPACING * 1.4,
                        fontWeight: "600",
                      }}
                    >
                      {key}
                    </Text>
                    <Text
                      style={{
                        fontSize: SPACING * 1.6,
                        fontWeight: "700",
                        marginTop: SPACING * 0.5,
                      }}
                    >
                      {value}
                    </Text>
                  </TouchableOpacity>
                );
              }
            })}
          </View>
          <View
            style={{
              width: "100%",
              height: 2,
              borderRadius: 1,
              borderWidth: 1,
              borderColor: COLORS.dark,
              marginTop: SPACING,
            }}
          ></View>
        </View>
        <View>
          <Text
            style={{
              fontSize: SPACING * 2.2, // Daha büyük yazı boyutu
              fontWeight: "bold",
            }}
          >
            Hasta İle İlgili Klavuzlar
          </Text>
          {FilteredTahlils &&
            FilteredTahlils.length > 0 &&
            Object.keys(item).map((key) => {
              if (key.startsWith("Ig")) {
                const currentValue = parseFloat(item[key]);
                const averageValue =
                  FilteredTahlils.reduce(
                    (sum, tahlil) => sum + parseFloat(tahlil[key] || 0),
                    0
                  ) / FilteredTahlils.length;
                const status =
                  currentValue > averageValue
                    ? "Artmış"
                    : currentValue < averageValue
                    ? "Azalmış"
                    : "Normal";
                const color =
                  status === "Artmış"
                    ? "green"
                    : status === "Azalmış"
                    ? "red"
                    : "black";
                const direction =
                  status === "Artmış"
                    ? "\u2191" // Yukarı ok
                    : status === "Azalmış"
                    ? "\u2193" // Aşağı ok
                    : "-";

                return (
                  <View key={key} style={{ marginVertical: 10 }}>
                    <Text
                      style={{ fontSize: SPACING * 1.8, fontWeight: "600" }}
                    >
                      {key}: Şuanki Değer: {currentValue}, Ortalama Değer:{" "}
                      {averageValue.toFixed(2)}, Durum: {status}{" "}
                      <Text style={{ color }}>{direction}</Text>
                    </Text>
                    <View
                      style={{
                        height: 2,
                        backgroundColor: "blue",
                        marginVertical: 8,
                      }}
                    />
                  </View>
                );
              }
              return null;
            })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TahlilDetailScreen;
