import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Alert,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import firebase from "../firebase/firebase";
import "firebase/compat/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Keyboard } from "react-native";
import { useEffect } from "react";
const LoginScreen = () => {
  const [tcNo, setTcNo] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    // Sayfa açıldığında AsyncStorage'dan verileri alıp useState'lere atama
    const loadData = async () => {
      try {
        // AsyncStorage'dan verileri alıyoruz
        const storedAd = await AsyncStorage.getItem("Ad");

        // Ad değeri boş değilse Home ekranına yönlendirme
        if (storedAd !== null && storedAd !== "") {
          console.log('Home Screen e gidiyoruz');
          navigation.navigate("Home");
        }
      } catch (error) {
        console.error("AsyncStorage okuma hatası:", error);
      }
    };

    loadData();
  }, [navigation]); // navigation bağımlılığı ekleniyor

  const handleLogin = async () => {
    try {
      const snapshot = await firebase.database().ref("Users").once("value");

      if (snapshot.exists()) {
        const users = snapshot.val();
        let foundUser = null;
        let userId = null;

        // Veritabanındaki tüm kullanıcıları kontrol et
        Object.keys(users).forEach((key) => {
          const user = users[key];

          // TcNo'nun string olarak karşılaştırılması
          if (user.TcNo.toString() === tcNo.toString()) {
            foundUser = user;
            userId = key; // Kullanıcının User_ID'sini alıyoruz
          }
        });

        if (foundUser) {
          if (foundUser.PassWord.toString() === password.toString()) {
            // Kullanıcıyı AsyncStorage'a tek tek kaydediyoruz
            await AsyncStorage.setItem("User_ID", userId); // User_ID'yi kaydediyoruz
            await AsyncStorage.setItem("Ad", foundUser.Ad); // Ad'ı kaydediyoruz
            await AsyncStorage.setItem("Soyad", foundUser.Soyad); // Soyad'ı kaydediyoruz
            await AsyncStorage.setItem("TcNo", foundUser.TcNo.toString()); // TcNo'yu kaydediyoruz
            await AsyncStorage.setItem("TelNo", foundUser.TelNo.toString()); // TelNo'yu kaydediyoruz
            await AsyncStorage.setItem("Rol", foundUser.Rol); // Rol'ü kaydediyoruz
            await AsyncStorage.setItem("Cinsiyet", foundUser.Cinsiyet); // Cinsiyet'i kaydediyoruz
            await AsyncStorage.setItem("DogumTarihi", foundUser.DogumTarihi); // DogumTarihi'ni kaydediyoruz
            await AsyncStorage.setItem(
              "PassWord",
              foundUser.PassWord.toString()
            ); // PassWord'ü kaydediyoruz

            navigation.navigate("Home");
          } else {
            Alert.alert("Hata", "Şifre yanlış!");
          }
        } else {
          Alert.alert("Hata", "Kullanıcı bulunamadı!");
        }
      } else {
        Alert.alert("Hata", "Kullanıcı verisi bulunamadı!");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Hata", "Giriş işlemi sırasında bir hata oluştu!");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.title}>Giriş Yap</Text>

        <TextInput
          style={styles.input}
          placeholder="TC Kimlik No"
          keyboardType="numeric"
          value={tcNo}
          onChangeText={setTcNo}
        />

        <TextInput
          style={styles.input}
          placeholder="Şifre"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Button title="Giriş Yap" onPress={handleLogin} />

        <Text style={styles.registerText}>
          Hesabınız yok mu?{" "}
          <Text
            style={styles.registerLink}
            onPress={() => navigation.navigate("Register")}
          >
            Kayıt Olun
          </Text>
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginBottom: 16,
    paddingHorizontal: 8,
    width: "100%",
    backgroundColor: "#fff",
  },
  registerText: {
    marginTop: 20,
    fontSize: 16,
  },
  registerLink: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});

export default LoginScreen;
