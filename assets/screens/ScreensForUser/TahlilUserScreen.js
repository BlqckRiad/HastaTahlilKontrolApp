import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from "@expo/vector-icons";
import firebase from "../../firebase/firebase";
import "firebase/compat/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SPACING from "../../config/SPACING";
import COLORS from "../../config/COLORS";

const { width } = Dimensions.get("window");

const TahlilUserScreen = ({ navigation }) => {
  const [tahlilSonuc, setTahlilSonuc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tcNo, setTcNo] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedTcNo = await AsyncStorage.getItem("TcNo");
      if (storedTcNo) {
        setTcNo(storedTcNo);
        const snapshot = await firebase.database().ref("TahlilSonuc").once("value");
        const tahlilData = snapshot.val();

        if (tahlilData) {
          const filteredTahlils = Object.values(tahlilData).filter(
            (tahlil) => tahlil.TcNo === storedTcNo
          );
          setTahlilSonuc(filteredTahlils);
        }
      }
    } catch (error) {
      console.error("Veri yükleme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderTahlilItem = ({ item }) => {
    const hasIgValues = Object.keys(item).some(key => 
      key.startsWith("Ig") && item[key] !== 0 && item[key] !== "0"
    );

    if (!hasIgValues) return null;

    return (
      <TouchableOpacity
        style={styles.tahlilCard}
        onPress={() => navigation.navigate("TahlilDetail", { item })}
      >
        <View style={styles.cardHeader}>
          <FontAwesome5 name="file-medical-alt" size={24} color={COLORS.primary} />
          <Text style={styles.dateText}>{item.Tarih || "Tarih Belirtilmemiş"}</Text>
        </View>
        
        <View style={styles.igValuesContainer}>
          {Object.entries(item).map(([key, value]) => {
            if (key.startsWith("Ig") && value !== 0 && value !== "0") {
              return (
                <View key={key} style={styles.igValueItem}>
                  <Text style={styles.igValueTitle}>{key}</Text>
                  <Text style={styles.igValue}>{value}</Text>
                </View>
              );
            }
            return null;
          })}
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.viewDetailsText}>Detayları Görüntüle</Text>
          <FontAwesome5 name="chevron-right" size={16} color={COLORS.primary} />
        </View>
      </TouchableOpacity>
    );
  };

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
        <Text style={styles.headerTitle}>Tahlillerim</Text>
      </LinearGradient>

      {tahlilSonuc.length > 0 ? (
        <FlatList
          data={tahlilSonuc}
          renderItem={renderTahlilItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <FontAwesome5 name="file-medical" size={50} color={COLORS.primary} />
          <Text style={styles.emptyText}>Henüz tahlil sonucunuz bulunmamaktadır</Text>
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
  listContainer: {
    padding: SPACING * 2,
  },
  tahlilCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: SPACING * 2,
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING,
  },
  dateText: {
    marginLeft: SPACING,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
  },
  igValuesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: SPACING,
  },
  igValueItem: {
    width: '50%',
    paddingVertical: SPACING / 2,
  },
  igValueTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  igValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING,
    paddingTop: SPACING,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  viewDetailsText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING * 2,
  },
  emptyText: {
    marginTop: SPACING,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default TahlilUserScreen;