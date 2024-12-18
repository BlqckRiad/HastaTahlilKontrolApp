import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import SPACING from "../config/SPACING";
import COLORS from "../config/COLORS";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "firebase/compat/database";
import firebase from "../firebase/firebase"

const ChangePassword = ({ navigation }) => {
  const [oldkey, setOldkey] = useState("");
  const [newkey, setNewkey] = useState("");
  const [newkey2, setNewkey2] = useState("");
  const [oldkeyVisible, setOldkeyVisible] = useState(true);
  const [newkeyVisible, setNewkeyVisible] = useState(true);
  const [newkey2Visible, setNewkey2Visible] = useState(true);

  const toggleOldkeyVisibility = () => setOldkeyVisible(!oldkeyVisible);
  const toggleNewkeyVisibility = () => setNewkeyVisible(!newkeyVisible);
  const toggleNewkey2Visibility = () => setNewkey2Visible(!newkey2Visible);

  const updateUser = async () => {
    try {
      // 1. Get User_ID to identify the user
      const User_ID = await AsyncStorage.getItem("User_ID");
      console.log("User_ID:", User_ID);

      if (!User_ID) {
        console.error("User ID not found.");
        return;
      }

      // 2. Fetch all users from the database
      const snapshot = await firebase.database().ref("Users").once("value");
      const users = snapshot.val();

      // 3. Find the user with the matching User_ID
      const selectedUser = Object.keys(users).find((key) => key === User_ID);

      if (!selectedUser) {
        console.error("User not found in the database.");
        return;
      }
      const selectedUserPass = users[selectedUser].PassWord;
      if (selectedUserPass != oldkey) {
        alert("Hatalı Şifre Girdiniz , Eski Şifreniz Doğru Değil");
        return;
      }
      if (newkey != newkey2) {
        alert("Şifreler Uyuşmuyor");
        return;
      }

      // 4. Prepare updated user data
      const updatedUserData = {
        PassWord: newkey,
      };

      // 5. Update the user data in Firebase
      await firebase.database().ref(`Users/${User_ID}`).update(updatedUserData);

      console.log("User data updated successfully!");

      // Optionally, you can update AsyncStorage as well
      await AsyncStorage.setItem("PassWord", newkey.toString());

      // Provide feedback to the user
      alert("Şifre Başarıyla Güncellendi!");
      navigation.navigate('Home');
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("An error occurred while updating your profile.");
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: SPACING * 7,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Drawer'ı açan özel ikon */}
      <TouchableOpacity
        style={{ position: "absolute", top: SPACING * 5, left: SPACING * 2 }}
        onPress={() => navigation.openDrawer()}
      >
        <MaterialIcons name="menu" size={32} color="black" />
      </TouchableOpacity>

      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{
            fontSize: SPACING * 2,
            color: COLORS.dark,
            fontWeight: "600",
            paddingBottom: SPACING * 1.5,
          }}
        >
          Haydi , Şifreni Değiştirelim
        </Text>

        <View
          style={{
            width: "100%",
            height: 500,
            borderRadius: 50,
            borderColor: COLORS.dark,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Eski Şifre */}
          <View
            style={{
              flexDirection: "row",
              width: SPACING * 30,
              height: SPACING * 4,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: SPACING * 2,
                fontWeight: "bold",
                color: COLORS.dark,
              }}
            >
              Eski Şifreniz :{" "}
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                placeholder="Eski Şifreniz"
                style={{
                  borderRadius: 20,
                  borderColor: COLORS.primary,
                  borderWidth: 2,
                  width: SPACING * 20,
                  textAlign: "center",
                }}
                value={oldkey}
                onChangeText={setOldkey}
                secureTextEntry={oldkeyVisible}
              />
              <TouchableOpacity onPress={toggleOldkeyVisibility}>
                <MaterialIcons
                  name={oldkeyVisible ? "visibility-off" : "visibility"}
                  size={24}
                  color={COLORS.dark}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Yeni Şifre */}
          <View
            style={{
              flexDirection: "row",
              width: SPACING * 25,
              height: SPACING * 4,
              justifyContent: "center",
              alignItems: "center",
              marginTop: SPACING * 2,
            }}
          >
            <Text
              style={{
                fontSize: SPACING * 2,
                fontWeight: "bold",
                color: COLORS.dark,
              }}
            >
              Yeni Şifreniz :{" "}
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                placeholder="Yeni Şifreniz"
                style={{
                  borderRadius: 20,
                  borderColor: COLORS.primary,
                  borderWidth: 2,
                  width: SPACING * 20,
                  textAlign: "center",
                }}
                value={newkey}
                onChangeText={setNewkey}
                secureTextEntry={newkeyVisible}
              />
              <TouchableOpacity onPress={toggleNewkeyVisibility}>
                <MaterialIcons
                  name={newkeyVisible ? "visibility-off" : "visibility"}
                  size={24}
                  color={COLORS.dark}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Yeni Şifre Tekrar */}
          <View
            style={{
              flexDirection: "row",
              width: SPACING * 30,
              height: SPACING * 4,
              justifyContent: "center",
              alignItems: "center",
              marginTop: SPACING * 2,
            }}
          >
            <Text
              style={{
                fontSize: SPACING * 2,
                fontWeight: "bold",
                color: COLORS.dark,
              }}
            >
              Yeni Şifreniz:{" "}
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                placeholder="Yeni Şifre Tekrar"
                style={{
                  borderRadius: 20,
                  borderColor: COLORS.primary,
                  borderWidth: 2,
                  width: SPACING * 20,
                  textAlign: "center",
                }}
                value={newkey2}
                onChangeText={setNewkey2}
                secureTextEntry={newkey2Visible}
              />
              <TouchableOpacity onPress={toggleNewkey2Visibility}>
                <MaterialIcons
                  name={newkey2Visible ? "visibility-off" : "visibility"}
                  size={24}
                  color={COLORS.dark}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Değiştir Butonu */}
          <TouchableOpacity
            style={{
              marginTop: SPACING * 3,
              backgroundColor: newkey === newkey2 ? COLORS.primary : "gray", // Button disabled if passwords don't match
              paddingVertical: SPACING * 1.5,
              paddingHorizontal: SPACING * 6,
              borderRadius: 20,
            }}
            onPress={newkey === newkey2 ? updateUser : null}
          >
            <Text style={{ color: "white", fontSize: SPACING * 2 }}>
              Değiştir
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({});
