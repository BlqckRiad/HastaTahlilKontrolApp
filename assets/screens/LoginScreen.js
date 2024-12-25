import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  Alert,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import firebase from "../firebase/firebase";
import "firebase/compat/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Keyboard } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import COLORS from "../config/COLORS";

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const [tcNo, setTcNo] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedAd = await AsyncStorage.getItem("Ad");
        if (storedAd !== null && storedAd !== "") {
          navigation.navigate("Home");
        }
      } catch (error) {
        console.error("AsyncStorage okuma hatası:", error);
      }
    };
    loadData();
  }, [navigation]);

  const handleLogin = async () => {
    if (!tcNo || !password) {
      Alert.alert("Uyarı", "Lütfen tüm alanları doldurun!");
      return;
    }

    setIsLoading(true);
    try {
      const snapshot = await firebase.database().ref("Users").once("value");

      if (snapshot.exists()) {
        const users = snapshot.val();
        let foundUser = null;
        let userId = null;

        Object.keys(users).forEach((key) => {
          const user = users[key];
          if (user.TcNo.toString() === tcNo.toString()) {
            foundUser = user;
            userId = key;
          }
        });
        
        if (foundUser) {
          if (foundUser.PassWord.toString() === password.toString()) {
            await AsyncStorage.setItem("User_ID", userId);
            await AsyncStorage.setItem("Ad", foundUser.Ad);
            await AsyncStorage.setItem("Soyad", foundUser.Soyad);
            await AsyncStorage.setItem("TcNo", foundUser.TcNo.toString());
            await AsyncStorage.setItem("TelNo", foundUser.TelNo.toString());
            await AsyncStorage.setItem("Rol", foundUser.Rol);
            await AsyncStorage.setItem("Cinsiyet", foundUser.Cinsiyet);
            await AsyncStorage.setItem("DogumTarihi", foundUser.DogumTarihi);
            await AsyncStorage.setItem("PassWord", foundUser.PassWord.toString());

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <LinearGradient
          colors={['#487DD2', '#2196F3', '#64B5F6']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.formContainer}
          >
            <View style={styles.iconContainer}>
              <FontAwesome5 name="hand-holding-medical" size={50} color={COLORS.primary} />
            </View>

            <Text style={styles.title}>Hoş Geldiniz</Text>
            <Text style={styles.subtitle}>Sağlık bilgilerinize erişmek için giriş yapın</Text>

            <View style={styles.inputContainer}>
              <FontAwesome5 name="id-card" size={20} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="TC Kimlik No"
                placeholderTextColor="#666"
                keyboardType="numeric"
                value={tcNo}
                onChangeText={setTcNo}
                maxLength={11}
              />
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome5 name="lock" size={20} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Şifre"
                placeholderTextColor="#666"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
              </Text>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Hesabınız yok mu?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.registerLink}>Kayıt Olun</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </LinearGradient>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    width: width,
    height: height,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  iconContainer: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "100%",
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    marginBottom: 15,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: COLORS.dark,
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  loginButtonText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
  registerContainer: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },
  registerText: {
    fontSize: 16,
    color: '#fff',
    marginRight: 5,
  },
  registerLink: {
    fontSize: 16,
    color: '#fff',
    fontWeight: "bold",
  },
});

export default LoginScreen;
