import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
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
  const [loading, setLoading] = useState(false); // Yükleme durumu için state

  // Yaş ve aylık hesaplama fonksiyonu
  const calculateAgeAndMonths = (dogumTarihi) => {
    const today = new Date();
    const dogumTarihiParts = dogumTarihi.split("."); // 18.11.2003 formatını ayırıyoruz
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

    const age = years;
    const remainingMonths = months < 0 ? 12 + months : months;

    return { age, remainingMonths, ageInMonths };
  };

  useEffect(() => {
    const tarih = data.DogumTarihi;
    const { age, remainingMonths, ageInMonths } = calculateAgeAndMonths(tarih);
    setigdata(key);
    setAy(ageInMonths); // Ay olarak yaşı setliyoruz

    const loadData = async () => {
      setLoading(true); // Yükleme göstergesini aç
      try {
        const snapshot = await firebase
          .database()
          .ref("KlavuzVeri")
          .once("value");

        const klavuzlar = snapshot.val();

        for (let key in klavuzlar) {
          const klavuz = klavuzlar[key];

          // AylıkMi 0 ise, MinYas ve MaxYas'ı ay cinsinden hesaplayacağız
          let calculatedMinay = klavuz.MinYas;
          let calculatedMaxay = klavuz.MaxYas;

          if (klavuz.AylikMi === 0) {
            calculatedMinay *= 12; // Yıl -> Ay
            calculatedMaxay *= 12; // Yıl -> Ay
          }

          // Set ediyorum min ve max ayları
          setminay(calculatedMinay);
          setmaxay(calculatedMaxay);
          
          // Kişinin yaşı (ay olarak) ile karşılaştırma yapıyoruz
          if (ay >= calculatedMinay && ay <= calculatedMaxay) {

            const datas = {
                IgA : klavuz.IgA,
                IgA1 : klavuz.IgA1,
                IgA2 : klavuz.IgA2,
            }
            var minIg = 'Min'+igdata;
            var maxIg = 'Max'+igdata;
            console.log();
            console.log(`Min ${igdata} : ${klavuz[minIg]}`);
            console.log(`Max ${igdata} : ${klavuz[maxIg]}`);
            
          }
        }
      } catch (error) {
        console.error("Tahlil Sonuçları Gelmiyor:", error);
      } finally {
        setLoading(false); // İşlem tamamlandığında yükleme göstergesini kapat
      }
    };

    loadData();
  }, [ay]); // `ay` değiştiğinde bu `useEffect` çalışacak

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
        <Text style={styles.contentText}>Veri başarıyla yüklendi.</Text>
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
  contentText: {
    fontSize: 16,
    color: COLORS.black,
    textAlign: "center",
    marginTop: SPACING * 2,
  },
});
