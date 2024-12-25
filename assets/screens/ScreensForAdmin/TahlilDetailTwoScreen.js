import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../../config/COLORS";
import SPACING from "../../config/SPACING";
import AntDesign from "@expo/vector-icons/AntDesign";
import firebase from "../../firebase/firebase";
import "firebase/compat/database";

const TahlilDetailTwoScreen = ({ route, navigation }) => {
  const { data, item, key } = route.params;
  const [ay, setAy] = useState(0);
  const [minay, setminay] = useState(0);
  const [maxay, setmaxay] = useState(0);
  const [igdata, setigdata] = useState("");
  const [loading, setLoading] = useState(true); // Başlangıçta loading true olarak ayarlanıyor
  const [logDataArray, setLogDataArray] = useState([]);

  // Yaş ve aylık hesaplama fonksiyonu
  const calculateAgeAndMonths = (dogumTarihi) => {
    const today = new Date();
    const dogumTarihiParts = dogumTarihi.split(".");
    const birthDate = new Date(
      dogumTarihiParts[2],
      dogumTarihiParts[1] - 1,
      dogumTarihiParts[0]
    );

    const years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();

    let ageInMonths = years * 12 + months;

    if (months < 0) {
      ageInMonths -= 1;
    }

    return ageInMonths;
  };

  useEffect(() => {
    let isMounted = true; // Component mount durumunu kontrol etmek için

    const loadData = async () => {
      if (!isMounted) return; // Component unmount olduysa işlemi durdur
      
      setLoading(true);
      try {
        const tarih = data.DogumTarihi;
        const ageInMonths = calculateAgeAndMonths(tarih);
        
        if (isMounted) {
          setigdata(key);
          setAy(ageInMonths);
        }

        const snapshot = await firebase
          .database()
          .ref("KlavuzVeri")
          .once("value");

        const klavuzlar = snapshot.val();
        let newLogDataArray = [];

        for (let klavuzKey in klavuzlar) {
          const klavuz = klavuzlar[klavuzKey];
          let calculatedMinay = klavuz.MinYas;
          let calculatedMaxay = klavuz.MaxYas;

          if (klavuz.AylikMi === 0) {
            calculatedMinay *= 12;
            calculatedMaxay *= 12;
          }

          if (isMounted) {
            setminay(calculatedMinay);
            setmaxay(calculatedMaxay);
          }

          if (ageInMonths >= calculatedMinay && ageInMonths <= calculatedMaxay) {
            const minIg = "Min" + key;
            const maxIg = "Max" + key;
            const ekveriIg = "EkVeri" + key;

            const snapshot2 = await firebase
              .database()
              .ref("Klavuzlar")
              .once("value");
            const klavuzclass = snapshot2.val();
            
            const klavuzAd = klavuzclass[klavuz.KlavuzAlinanID]?.Ad || "Bilinmiyor";

            if (klavuz[minIg] !== undefined && klavuz[maxIg] !== undefined) {
              newLogDataArray.push({
                IgTipi: klavuz.IgTipi,
                MinData: minIg,
                MinDataVal: klavuz[minIg],
                MaxData: maxIg,
                MaxDataVal: klavuz[maxIg],
                KişiIgVal: data[key],
                DataNow: key,
                KlavuzID: klavuz.KlavuzAlinanID,
                KlavuzAd: klavuzAd,
                Ekveri: klavuz[ekveriIg] || "",
              });
            }
          }
        }

        if (isMounted) {
          setLogDataArray(newLogDataArray);
          setLoading(false);
        }
      } catch (error) {
        console.error("Tahlil Sonuçları Gelmiyor:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [data, key]); // item dependency'sini kaldırdık

  return (
    <SafeAreaView
      style={{
        marginHorizontal: SPACING * 2,
        marginVertical: SPACING * 5,
      }}
    >
      <View>
        <TouchableOpacity
          onPress={() => navigation.navigate("TahlilDetail", { item })}
        >
          <AntDesign name="caretleft" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={logDataArray}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.logDataContainer}>
              <Text
                style={{
                  fontSize: SPACING * 2,
                  fontWeight: "600",
                }}
              >{`${item.KlavuzAd} İsimli Klavuza Göre : `}</Text>
              <Text style={{ fontSize: SPACING * 1.6, fontWeight: "500" }}>
                Olması Gereken{" "}
                <Text style={{ fontSize: SPACING * 2, fontWeight: "700" }}>
                  {item.DataNow}
                </Text>{" "}
                Değeri :
              </Text>

              <Text
                style={{
                  fontSize: SPACING * 1.7,
                  fontWeight: "600",
                }}
              >{`Ig Tipi: ${item.IgTipi}`}</Text>
              <Text
                style={{
                  fontSize: SPACING * 1.7,
                  fontWeight: "600",
                }}
              >{`Min Değer: ${item.MinDataVal}`}</Text>
              <Text
                style={{
                  fontSize: SPACING * 1.7,
                  fontWeight: "600",
                }}
              >{`Max Değer: ${item.MaxDataVal}`}</Text>
              <Text
                style={{
                  fontSize: SPACING * 1.7,
                  fontWeight: "600",
                  paddingTop: SPACING / 2,
                }}
              >{`Hastanın ${item.DataNow} Değeri: ${item.KişiIgVal}`}</Text>
              <Text
                style={{
                  fontSize: SPACING * 1.7,
                  fontWeight: "600",
                  paddingTop: SPACING / 2,
                }}
              > {`Ek Veri : ${item.Ekveri}`} </Text>
              <Text
                style={{
                  fontSize: SPACING * 1.7,
                  fontWeight: "600",
                  paddingTop: SPACING / 2,
                }}
              >
                Hastanın Tahlile Göre Durum :{" "}
                {item.KişiIgVal >= item.MinDataVal &&
                item.KişiIgVal <= item.MaxDataVal ? (
                  <AntDesign name="caretup" size={24} color="green" />
                ) : (
                  <AntDesign name="caretdown" size={24} color="red" />
                )}
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default TahlilDetailTwoScreen;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logDataContainer: {
    marginBottom: SPACING * 2,
    padding: SPACING,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
  },
  logDataText: {
    fontSize: 16,
    color: COLORS.black,
    marginBottom: SPACING / 2,
  },
  contentText: {
    fontSize: 16,
    color: COLORS.black,
    textAlign: "center",
    marginTop: SPACING * 2,
  },
});
