import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SPACING from "../config/SPACING";
import COLORS from "../config/COLORS";

import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { Dimensions } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";

// Ekran genişliğini almak
const WIDTH = Dimensions.get("window").width;

// Validation Schema
const validationSchema = Yup.object().shape({
  tcNo: Yup.string()
    .required("TC KİMLİK ALANI BOŞ OLAMAZ")
    .length(11, "TC KİMLİK 11 KARAKTERLİ OLMALIDIR"),
  password: Yup.string().required("ŞİFRE ALANI BOŞ OLAMAZ"),
});

const LoginScreen = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Şifre görünürlüğünü değiştiren fonksiyon
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView
        style={{
          paddingHorizontal: SPACING * 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Formik
          initialValues={{ tcNo: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log(values);
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
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="person" size={46} color="black" />
                <Text
                  style={{
                    color: COLORS.dark,
                    fontSize: SPACING * 2,
                    fontWeight: "bold",
                  }}
                >
                  GİRİŞ YAP
                </Text>
              </View>
              <View style={{ padding: SPACING * 2 }}>
                <TextInput
                  style={{
                    width: WIDTH - SPACING * 8,
                    height: 50,
                    backgroundColor: "#eaeaea",
                    borderRadius: 30,
                    paddingHorizontal: SPACING,
                  }}
                  placeholder="TC KİMLİK GİRİNİZ"
                  value={values.tcNo}
                  onChangeText={handleChange("tcNo")}
                  onBlur={handleBlur("tcNo")}
                  keyboardType="numeric"
                />
                {touched.tcNo && errors.tcNo && (
                  <Text style={{ color: "red", fontSize: 12 }}>
                    {errors.tcNo}
                  </Text>
                )}

                <View style={{ position: "relative", paddingTop: SPACING }}>
                  <TextInput
                    style={{
                      width: WIDTH - SPACING * 8,
                      height: 50,
                      backgroundColor: "#eaeaea",
                      borderRadius: 30,
                      paddingHorizontal: SPACING,
                    }}
                    placeholder="ŞİFRE GİRİNİZ"
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    secureTextEntry={!isPasswordVisible}
                  />
                  <TouchableOpacity
                    onPress={togglePasswordVisibility}
                    style={{
                      position: "absolute",
                      right: SPACING * 2,
                      top: "50%",
                    }}
                  >
                    <Ionicons
                      name={isPasswordVisible ? "eye" : "eye-off"}
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
                {touched.password && errors.password && (
                  <Text style={{ color: "red", fontSize: 12 }}>
                    {errors.password}
                  </Text>
                )}
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: 200,
                  height: 60,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "#2196F3", // Buton rengi
                    width: "90%",
                    height: "90%",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 30, // Kenar yuvarlama
                  }}
                  onPress={handleSubmit}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: SPACING * 2, // Yazı boyutu
                      fontWeight: "bold", // Kalın yazı
                    }}
                  >
                    Giriş Yap
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  paddingTop: SPACING * 2,
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    borderRadius: 30,
                    borderWidth: 1,
                    borderColor: COLORS.dark,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: SPACING * 0.7,
                    marginHorizontal: SPACING * 1,
                  }}
                >
                  <AntDesign name="google" size={40} color="#db4a39" />
                </View>
                <View
                  style={{
                    borderRadius: 30,
                    borderWidth: 1,
                    borderColor: COLORS.dark,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: SPACING * 0.7,
                    marginHorizontal: SPACING * 1,
                  }}
                >
                  <Entypo name="mail" size={40} color="black" />
                </View>
                <View
                  style={{
                    borderRadius: 30,
                    borderWidth: 1,
                    borderColor: COLORS.dark,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: SPACING * 0.7,
                    marginHorizontal: SPACING * 1,
                  }}
                >
                  <FontAwesome
                    name="facebook-official"
                    size={40}
                    color="#3b5998"
                  />
                </View>
              </View>

              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  paddingTop: SPACING * 2,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    console.log("Kayit Sayfasına Git");
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.primary,
                      fontSize: SPACING * 1.5,
                      fontWeight: "600",
                    }}
                  >
                    Hesabınız Yok Mu ?
                  </Text>
                  <Text
                    style={{
                      left: 15,
                      color: COLORS.primary,
                      fontSize: SPACING * 1.5,
                      fontWeight: "600",
                      top: 5,
                    }}
                  >
                    Haydi Kayıt OL
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
        <View></View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
