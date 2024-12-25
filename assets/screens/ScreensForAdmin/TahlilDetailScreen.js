import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import firebase from "../../firebase/firebase";
import "firebase/compat/database";
import SPACING from "../../config/SPACING";
import COLORS from "../../config/COLORS";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get("window");

const TahlilDetailScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const [foundUser, setFoundUser] = useState(null);
  const [FilteredTahlils, setFilteredTahlils] = useState(null);
  const [loading, setLoading] = useState(true);
  const [igValues, setIgValues] = useState([]);
  const [guideValues, setGuideValues] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const snapshot = await firebase.database().ref("Users").once("value");
        const users = snapshot.val();

        const snapshot2 = await firebase
          .database()
          .ref("TahlilSonuc")
          .once("value");
        const hastatahlils = snapshot2.val();
        
        const matchedUser = Object.values(users).find(
          (user) => user.TcNo === item.TcNo
        );

        if (matchedUser) {
          const filteredTahlils = Object.values(hastatahlils).filter(
            (tahlil) => tahlil.TcNo === matchedUser.TcNo
          );

          setFoundUser(matchedUser);
          setFilteredTahlils(filteredTahlils);

          // Ig değerlerini hazırla
          const igValuesArray = Object.entries(item)
            .filter(([key, value]) => key.startsWith("Ig") && value !== 0 && value !== "0")
            .map(([key, value]) => ({ key, value }));
          setIgValues(igValuesArray);

          // Kılavuz değerlerini hazırla
          const guideValuesArray = Object.keys(item)
            .filter(key => key.startsWith("Ig") && item[key] !== 0 && item[key] !== "0")
            .map(key => {
              const currentValue = parseFloat(item[key]);
              const validTahlils = filteredTahlils.filter(tahlil => 
                tahlil[key] && parseFloat(tahlil[key]) !== 0
              );
              const averageValue = validTahlils.length > 0 ?
                validTahlils.reduce(
                  (sum, tahlil) => sum + parseFloat(tahlil[key] || 0),
                  0
                ) / validTahlils.length : 0;

              const status =
                currentValue > averageValue
                  ? "Artmış"
                  : currentValue < averageValue
                  ? "Azalmış"
                  : "Normal";
              const color =
                status === "Artmış"
                  ? "#4CAF50"
                  : status === "Azalmış"
                  ? "#F44336"
                  : "#2196F3";

              return {
                key,
                currentValue,
                averageValue,
                status,
                color
              };
            });
          setGuideValues(guideValuesArray);
        } else {
          setFoundUser(null);
          setFilteredTahlils([]);
        }
      } catch (error) {
        console.error("Tahlil Sonuçlar Gelmiyor:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [item]);

  const renderIgValue = ({ item: { key, value } }) => (
    <TouchableOpacity
      key={key}
      style={styles.igValueCard}
      onPress={() => {
        const data = {
          [key]: value,
          DogumTarihi: foundUser.DogumTarihi,
          TcNo: foundUser.TcNo,
        };
        navigation.navigate("TahlilDetailTwo", {
          data: data,
          item: {...item},
          key: key,
        });
      }}
    >
      <Text style={styles.igValueTitle}>{key}</Text>
      <Text style={styles.igValue}>{value}</Text>
    </TouchableOpacity>
  );

  const renderGuideValue = ({ item }) => (
    <View key={item.key} style={styles.guideCard}>
      <View style={styles.guideHeader}>
        <Text style={styles.guideTitle}>{item.key}</Text>
        <View style={[styles.statusBadge, { backgroundColor: item.color }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.guideValues}>
        <Text style={styles.guideText}>Mevcut: {item.currentValue}</Text>
        <Text style={styles.guideText}>Ortalama: {item.averageValue.toFixed(2)}</Text>
      </View>
    </View>
  );

  const ListHeaderComponent = () => (
    <>
      <View style={styles.userInfoCard}>
        <View style={styles.userIconContainer}>
          <FontAwesome5 name="user-circle" size={40} color={COLORS.primary} />
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{foundUser?.Ad} {foundUser?.Soyad}</Text>
          <Text style={styles.userInfo}>TC: {foundUser?.TcNo}</Text>
          <Text style={styles.userInfo}>Tel: +90 {foundUser?.TelNo}</Text>
          <Text style={styles.userInfo}>Doğum: {foundUser?.DogumTarihi}</Text>
          <Text style={styles.userInfo}>Cinsiyet: {foundUser?.Cinsiyet}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ig Değerleri</Text>
        <FlatList
          data={igValues}
          renderItem={renderIgValue}
          keyExtractor={item => item.key}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={styles.igValuesContainer}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kılavuz Değerlendirmesi</Text>
      </View>
    </>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#487DD2', '#2196F3']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <FontAwesome5 name="bars" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tahlil Detayları</Text>
      </LinearGradient>

      {foundUser ? (
        <FlatList
          data={guideValues}
          renderItem={renderGuideValue}
          keyExtractor={item => item.key}
          ListHeaderComponent={ListHeaderComponent}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Veriler Yükleniyor...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING * 2,
    paddingTop: SPACING * 4,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: SPACING * 2,
  },
  content: {
    padding: SPACING * 2,
  },
  userInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: SPACING * 2,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING * 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userIconContainer: {
    marginRight: SPACING * 2,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SPACING,
  },
  userInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: SPACING / 2,
  },
  section: {
    marginBottom: SPACING * 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SPACING,
  },
  igValuesContainer: {
    justifyContent: 'space-between',
  },
  igValueCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: SPACING,
    marginBottom: SPACING,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  igValueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SPACING / 2,
  },
  igValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  guideCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: SPACING,
    marginBottom: SPACING,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  guideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING,
  },
  guideTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  statusBadge: {
    paddingHorizontal: SPACING,
    paddingVertical: SPACING / 4,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  guideValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  guideText: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
});

export default TahlilDetailScreen;
