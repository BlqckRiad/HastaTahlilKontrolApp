import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import doktorImage from "../../image/doktor.jpg";
import avatarImage from "../../image/avatar.png";
import COLORS from "../../config/COLORS";
import SPACING from "../../config/SPACING";
import SearchField from "../../componets/SearchField";
import { Dimensions } from "react-native";
import NewsField from '../../componets/NewsField.js'
import Entypo from "@expo/vector-icons/Entypo";
import { BlurView } from "expo-blur";

const HEIGHT = Dimensions.get("window").height;

const HomeScreen = ({ navigation }) => {
  // State değişkeni, sayfa reload yapıldığında trigger edecek

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Image
            style={{
              width: "100%",
              height: HEIGHT / 2 + SPACING * 3.2,
            }}
            source={doktorImage}
          />
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

          {/*BlurView*/}

          <View
            style={{
              position: "absolute",
              width: "100%",
              height: 140,
              bottom: 0,
              borderTopLeftRadius: 30, // Üst köşeler için radius
              borderTopRightRadius: 30,
              overflow: "hidden", // BorderRadius'ın etkili olması için gerekli
            }}
          >
            <BlurView
              tint="dark"
              intensity={100}
              style={{
                width: "100%",
                height: "100%",
                padding: SPACING * 2,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: COLORS.light,
                  fontSize: SPACING * 2.3,
                  fontWeight: "bold",
                  marginBottom: SPACING / 2,
                }}
              >
                Hoşgeldin, ne aramak istersin?
              </Text>
              <SearchField />
            </BlurView>
          </View>
        </View>
        {/* Haber Alanı */}
        <View>
          <NewsField />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
