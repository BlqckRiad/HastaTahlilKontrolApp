import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import React from "react";
import SPACING from "../../config/SPACING";
import COLORS from "../../config/COLORS";
import { SafeAreaView } from "react-native-safe-area-context";

import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import firebase from "../../firebase/firebase";
import "firebase/compat/database";
import avatarImage from "../../image/avatar.png";

const UsersScreen = ({navigation}) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const snapshot = await firebase.database().ref("Users").once("value");
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const usersList = Object.keys(usersData).map((id) => ({
            id,
            ...usersData[id], // Assuming each user has 'Role' and 'TcNo'
          }));
          setUsers(usersList);
        }
      } catch (error) {
        console.error("AsyncStorage okuma hatası:", error);
      }
    };

    loadData();
  }, []); // Empty dependency array to load data once when the component mounts

  const changeRole = async (id) => {
    try {
      const snapshot = await firebase.database().ref("Users").once("value");
      const usersDb = snapshot.val();
      console.log(id); // Log the id to ensure it's correct
  
      // Find the user with the matching ID
      const selectedUser = usersDb[id];
  
      if (!selectedUser) {
        console.error("User not found in the database.");
        return;
      }
  
      // Toggle the role between "Admin" and "User"
      const newRole = selectedUser.Rol === "Admin" ? "User" : "Admin";
  
      const updatedUserData = {
        Rol: newRole,
      };
  
      // Update the user data in Firebase
      await firebase.database().ref(`Users/${id}`).update(updatedUserData);
      console.log(`User ${id} role updated to ${newRole}`);
  
      // Update the role in state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, Rol: newRole } : user
        )
      );
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };
  
  

  const renderItem = ({ item }) => (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        width: "100%",
        height: 80,
      }}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 18, fontWeight: "500" }}>
          {item.TcNo} {/* Display TcNo */}
        </Text>
      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 18, fontWeight: "500" }}>
          {item.Rol} {/* Display Role */}
        </Text>
      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity onPress={() => changeRole(item.id)}>
          <MaterialIcons name="change-circle" size={36} color="green" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView>
      <SafeAreaView
        style={{
          paddingVertical: SPACING * 4,
          paddingHorizontal: SPACING * 2,
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
            <TouchableOpacity
              style={{}}
              onPress={() => navigation.openDrawer()}
            >
              <Entypo name="menu" size={30} color="black" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: 40,
              height: 40,
              backgroundColor: COLORS.primary,
              borderRadius: 20,
              marginRight: SPACING * 4,
            }}
          >
            <TouchableOpacity>
              <Image
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: SPACING * 2,
                }}
                source={avatarImage}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: SPACING * 1.8,
              fontWeight: "600",
              color: COLORS.dark,
              marginBottom: SPACING,
            }}
          >
            Merhaba , Hadi Kullanıcı Arayalım
          </Text>
          <TextInput
            style={{
              backgroundColor: COLORS.transparent,
              width: 200,
              textAlign: "center",
              borderRadius: 20,
              color: COLORS.dark,
              height: 40,
            }}
            placeholder="Hadi Ara"
          />
        </View>
        <View
          style={{
            width: "100%",
            height: 1,
            marginTop: SPACING * 2,
            backgroundColor: COLORS.dark,
          }}
        ></View>

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: 140,
          }}
        >
          <Entypo name="users" size={56} color="black" />
          <Text
            style={{
              color: COLORS.dark,
              fontSize: SPACING * 2,
              fontWeight: "700",
            }}
          >
            KULLANICILAR
          </Text>
        </View>
        <View
          style={{
            width: "100%",
            height: 1,
            marginTop: SPACING * 2,
            backgroundColor: COLORS.dark,
          }}
        ></View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: 80,
            flexDirection: "row",
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: SPACING * 2,
                fontWeight: "600",
              }}
            >
              Tc Kimlik No
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: SPACING * 2,
                fontWeight: "600",
              }}
            >
              Rol
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: SPACING * 2,
                fontWeight: "600",
              }}
            >
              Değiştir
            </Text>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            height: 1,
            backgroundColor: COLORS.dark,
          }}
        ></View>

        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
    </ScrollView>
  );
};

export default UsersScreen;

const styles = StyleSheet.create({});
