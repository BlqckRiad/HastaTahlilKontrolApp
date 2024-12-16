import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SPACING from "../config/SPACING";
import COLORS from "../config/COLORS";
import { Dimensions } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import firebase from "../firebase/firebase.js"; // Firebase import
import AsyncStorage from "@react-native-async-storage/async-storage";

// Ekran genişliğini almak
const WIDTH = Dimensions.get("window").width;

// Validation Schema
const validationSchema = Yup.object().shape({
  tcNo: Yup.string()
    .required("TC Kimlik numarası boş olamaz")
    .length(6, "TC Kimlik numarası 6 haneli olmalıdır"),
  firstName: Yup.string().required("İsim boş olamaz"),
  lastName: Yup.string().required("Soyisim boş olamaz"),
  password: Yup.string().required("Şifre boş olamaz"),
});

const RegisterScreen = ({ navigation }) => {
  // Kullanıcıyı Firebase'e ekleyen fonksiyon
  const addUserToDatabase = async (userData) => {
    try {
      const userRef = firebase.database().ref("Users");

      // Kullanıcıları al
      const snapshot = await userRef.once("value");
      const users = snapshot.val();

      // Mevcut kullanıcı ID'leri arasında en yüksek olanı bul
      const userIds = users ? Object.keys(users) : [];
      const maxUserId =
        userIds.length > 0 ? Math.max(...userIds.map((id) => parseInt(id))) : 0;

      // Yeni kullanıcı için artan ID
      const newUserId = maxUserId + 1;

      // Yeni kullanıcıyı veritabanına ekle
      await userRef.child(newUserId.toString()).set({
        ...userData,
        Rol: "User", // Role olarak "User" ekliyoruz
        TelNo: 0,
        DogumTarihi: "",
        Cinsiyet: "",
      });

      navigation.navigate("Login"); // Kayıt sonrası login ekranına yönlendir
    } catch (error) {
      console.error("Kullanıcı eklerken hata oluştu: ", error);
      Alert.alert("Hata", "Kullanıcı eklenirken bir hata oluştu.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView
        style={{
          marginHorizontal: SPACING * 2,
          marginTop: SPACING * 5,
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <FontAwesome5
            name="hand-holding-medical"
            size={44}
            color={COLORS.dark}
          />
          <Text
            style={{
              color: COLORS.dark,
              fontSize: SPACING * 2,
              fontWeight: "600",
              top: SPACING,
            }}
          >
            KAYIT OL
          </Text>
        </View>

        {/* Formik Form */}
        <Formik
          initialValues={{
            TcNo: "",
            Ad: "",
            Soyad: "",
            PassWord: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            const userData = {
              TcNo: values.tcNo,
              Ad: values.firstName,
              Soyad: values.lastName,
              PassWord: values.password,
            };
            addUserToDatabase(userData); // Firebase'e kullanıcıyı ekle
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View
              style={{
                width: WIDTH - SPACING * 8,
                top: SPACING * 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* TC No Input */}
              <TextInput
                style={styles.input}
                placeholder="TC NO GİRİNİZ"
                value={values.tcNo}
                onChangeText={handleChange("tcNo")}
                onBlur={handleBlur("tcNo")}
                keyboardType="numeric"
              />
              {touched.tcNo && errors.tcNo && (
                <Text style={styles.errorText}>{errors.tcNo}</Text>
              )}

              {/* First Name Input */}
              <TextInput
                style={styles.input}
                placeholder="İsim"
                value={values.firstName}
                onChangeText={handleChange("firstName")}
                onBlur={handleBlur("firstName")}
              />
              {touched.firstName && errors.firstName && (
                <Text style={styles.errorText}>{errors.firstName}</Text>
              )}

              {/* Last Name Input */}
              <TextInput
                style={styles.input}
                placeholder="Soyisim"
                value={values.lastName}
                onChangeText={handleChange("lastName")}
                onBlur={handleBlur("lastName")}
              />
              {touched.lastName && errors.lastName && (
                <Text style={styles.errorText}>{errors.lastName}</Text>
              )}

              {/* Password Input */}
              <TextInput
                style={styles.input}
                placeholder="Şifre"
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                secureTextEntry
              />
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              {/* Submit Button */}
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Kayıt Ol</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>

        {/* Navigate to Login Screen */}
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            paddingTop: SPACING * 3,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Login");
            }}
          >
            <Text
              style={{
                color: COLORS.primary,
                fontSize: SPACING * 1.5,
                fontWeight: "600",
              }}
            >
              Hesabınız Var Mı ?
            </Text>
            <Text
              style={{
                left: 8,
                color: COLORS.primary,
                fontSize: SPACING * 1.5,
                fontWeight: "600",
                top: 5,
              }}
            >
              Haydi Giriş Yap
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: SPACING,
    marginBottom: SPACING * 1.5,
    color: COLORS.dark,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: SPACING * 1.5,
  },
  button: {
    backgroundColor: "#2196F3",
    width: "90%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  buttonText: {
    color: "white",
    fontSize: SPACING * 2,
    fontWeight: "bold",
  },
});

export default RegisterScreen;
