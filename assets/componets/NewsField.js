import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";

import COLORS from "../config/COLORS";
import SPACING from "../config/SPACING";
import News from "../data/News";

const NewsField = () => {
  return (
    <View
      style={{
        marginHorizontal: SPACING * 2,
        marginVertical: SPACING * 2,
      }}
    >
      <Text
        style={{ fontSize: SPACING * 2, fontWeight: "700", color: COLORS.dark }}
      >
        Son Dakika Haberler
      </Text>
      <View>
        {News.map((item, index) => (
          <View
            key={index}
            style={{
              width: "100%",
              height: 120,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: COLORS.transparent,
              marginTop: SPACING / 2,
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <View
              style={{
                marginLeft: SPACING * 2,
                width: 120,
                height: 100,
              }}
            >
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 20,
                }}
                source={{ uri: item.HaberImage }}
              />
            </View>
            <View
              style={{
                width: 200,
                justifyContent: "center",
                alignItems: "center",
                marginRight: SPACING * 2,
              }}
            >
              <Text
                style={{
                  fontSize: SPACING * 2,
                  fontWeight: "600",
                  color: COLORS.dark,
                }}
                numberOfLines={1}
              >
                {item.HaberTitle}
              </Text>
              <Text numberOfLines={2}>{item.HaberDesc}</Text>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: SPACING * 2,
                  bottom: -SPACING * 1.5,
                }}
                onPress={() => console.log(item.Id)}
              >
                <Text
                  style={{
                    fontSize: SPACING * 1.2,
                    fontWeight: "500",
                    color: COLORS.primary,
                  }}
                >
                  Devamını Oku -{">"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default NewsField;

const styles = StyleSheet.create({});
