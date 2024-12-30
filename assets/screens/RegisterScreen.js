import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SPACING from "../config/SPACING";
import COLORS from "../config/COLORS";
import { LinearGradient } from 'expo-linear-gradient';
import { Formik } from "formik";
import * as Yup from "yup";
import { FontAwesome5 } from "@expo/vector-icons";
import firebase from "../firebase/firebase.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

// Validation Schema
const validationSchema = Yup.object().shape({
  tcNo: Yup.string()
    .required("TC Kimlik numarası boş olamaz")
    .length(11, "TC Kimlik numarası 11 haneli olmalıdır"),
  firstName: Yup.string()
    .required("İsim boş olamaz")
    .min(2, "İsim en az 2 karakter olmalıdır"),
  lastName: Yup.string()
    .required("Soyisim boş olamaz")
    .min(2, "Soyisim en az 2 karakter olmalıdır"),
  password: Yup.string()
    .required("Şifre boş olamaz")
    .min(6, "Şifre en az 6 karakter olmalıdır"),
});

const RegisterScreen = ({ navigation }) => {
  const addUserToDatabase = async (userData) => {
    try {
      // Validate required fields
      if (!userData.TcNo || !userData.firstName || !userData.lastName || !userData.password) {
        Alert.alert("Hata", "Lütfen tüm alanları doldurun!");
        return;
      }
  
      const snapshot = await firebase.database().ref("Users").once("value");
      const users = snapshot.val() || {};
  
      console.log("Fetched users from database:", users);
  
      const userTcNoString = userData.TcNo ? userData.TcNo.toString() : "";
      const userExists = Object.values(users).some(
        (user) => user?.TcNo?.toString() === userTcNoString
      );
  
      if (userExists) {
        Alert.alert("Hata", "Bu TC Kimlik numarası ile kayıtlı bir kullanıcı zaten var!");
        return;
      }
  
      const newUserRef = firebase.database().ref("Users").push();
      await newUserRef.set({
        TcNo: userData.TcNo.toString(), // Ensure TcNo is a string
        Ad: userData.firstName,
        Soyad: userData.lastName,
        PassWord: userData.password,
        Rol: "User",
      });
  
      Alert.alert(
        "Başarılı",
        "Kayıt işlemi başarıyla tamamlandı!",
        [
          {
            text: "Tamam",
            onPress: () => navigation.navigate("Login"),
          },
        ]
      );
    } catch (error) {
      console.error("Kayıt hatası:", error);
      Alert.alert("Hata", "Kayıt işlemi sırasında bir hata oluştu!");
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
              <FontAwesome5 name="user-plus" size={40} color={COLORS.primary} />
            </View>

            <Text style={styles.title}>Kayıt Ol</Text>
            <Text style={styles.subtitle}>Yeni bir hesap oluşturun</Text>

            <Formik
              initialValues={{
                tcNo: "",
                firstName: "",
                lastName: "",
                password: "",
              }}
              validationSchema={validationSchema}
              onSubmit={addUserToDatabase}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View style={styles.form}>
                  <View style={styles.inputContainer}>
                    <FontAwesome5 name="id-card" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="TC Kimlik No"
                      placeholderTextColor="#666"
                      value={values.tcNo}
                      onChangeText={handleChange("tcNo")}
                      onBlur={handleBlur("tcNo")}
                      keyboardType="numeric"
                      maxLength={11}
                    />
                  </View>
                  {touched.tcNo && errors.tcNo && (
                    <Text style={styles.errorText}>{errors.tcNo}</Text>
                  )}

                  <View style={styles.inputContainer}>
                    <FontAwesome5 name="user" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="İsim"
                      placeholderTextColor="#666"
                      value={values.firstName}
                      onChangeText={handleChange("firstName")}
                      onBlur={handleBlur("firstName")}
                    />
                  </View>
                  {touched.firstName && errors.firstName && (
                    <Text style={styles.errorText}>{errors.firstName}</Text>
                  )}

                  <View style={styles.inputContainer}>
                    <FontAwesome5 name="user" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Soyisim"
                      placeholderTextColor="#666"
                      value={values.lastName}
                      onChangeText={handleChange("lastName")}
                      onBlur={handleBlur("lastName")}
                    />
                  </View>
                  {touched.lastName && errors.lastName && (
                    <Text style={styles.errorText}>{errors.lastName}</Text>
                  )}

                  <View style={styles.inputContainer}>
                    <FontAwesome5 name="lock" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Şifre"
                      placeholderTextColor="#666"
                      value={values.password}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      secureTextEntry
                    />
                  </View>
                  {touched.password && errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}

                  <TouchableOpacity style={styles.registerButton} onPress={handleSubmit}>
                    <Text style={styles.registerButtonText}>Kayıt Ol</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Zaten hesabınız var mı?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginLink}>Giriş Yap</Text>
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
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 40,
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
  form: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "100%",
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    marginBottom: 8,
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
  errorText: {
    color: '#FFB6C1',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 15,
  },
  registerButton: {
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
  registerButtonText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },
  loginText: {
    fontSize: 16,
    color: '#fff',
    marginRight: 5,
  },
  loginLink: {
    fontSize: 16,
    color: '#fff',
    fontWeight: "bold",
  },
});

export default RegisterScreen;
