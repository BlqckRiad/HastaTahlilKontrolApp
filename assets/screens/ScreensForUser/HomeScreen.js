import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  RefreshControl,
  StatusBar,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import doktorImage from "../../image/doktor.jpg";
import avatarImage from "../../image/avatar.png";
import COLORS from "../../config/COLORS";
import SPACING from "../../config/SPACING";
import SearchField from "../../componets/SearchField";
import NewsField from '../../componets/NewsField.js';
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedName = await AsyncStorage.getItem("Ad");
      const storedRole = await AsyncStorage.getItem("Rol");
      if (storedName) setUserName(storedName);
      if (storedRole) setUserRole(storedRole);
    } catch (error) {
      console.error("Veri yükleme hatası:", error);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadUserData();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={['#487DD2', '#2196F3']}
          style={styles.headerContainer}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigation.openDrawer()}
            >
              <FontAwesome5 name="bars" size={24} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.userInfo}>
              <Text style={styles.welcomeText}>Hoş Geldin,</Text>
              {/*
              <Text style={styles.userName}>{userName}</Text>
              */}
            </View>

            <TouchableOpacity style={styles.avatarContainer}>
              <Image source={avatarImage} style={styles.avatar} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.searchBox}>
              <Ionicons name="search" size={24} color={COLORS.primary} style={styles.searchIcon} />
              <TextInput
                placeholder="Ne aramak istersiniz?"
                placeholderTextColor="#666"
                style={styles.searchInput}
              />
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => navigation.navigate("TahlilUser")}
              >
                <FontAwesome5 name="file-medical-alt" size={24} color={COLORS.primary} />
                <Text style={styles.actionButtonText}>Tahlillerim</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => navigation.navigate("Settings")}
              >
                <FontAwesome5 name="user-cog" size={24} color={COLORS.primary} />
                <Text style={styles.actionButtonText}>Profil</Text>
              </TouchableOpacity>

              {userRole === "Admin" && (
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => navigation.navigate("Users")}
                >
                  <FontAwesome5 name="users-cog" size={24} color={COLORS.primary} />
                  <Text style={styles.actionButtonText}>Kullanıcılar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.newsSection}>
            <Text style={styles.sectionTitle}>Sağlık Haberleri</Text>
            <NewsField />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    paddingTop: SPACING * 2,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING * 2,
    paddingTop: SPACING,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    marginLeft: SPACING * 2,
  },
  welcomeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING * 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  searchContainer: {
    padding: SPACING * 2,
    marginTop: SPACING,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: SPACING * 2,
    height: 50,
  },
  searchIcon: {
    marginRight: SPACING,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.dark,
  },
  content: {
    padding: SPACING * 2,
  },
  quickActions: {
    marginBottom: SPACING * 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SPACING,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  actionButton: {
    width: '30%',
    backgroundColor: '#fff',
    padding: SPACING,
    borderRadius: 15,
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
  actionButtonText: {
    marginTop: SPACING / 2,
    color: COLORS.dark,
    fontSize: 14,
    fontWeight: '500',
  },
  newsSection: {
    marginTop: SPACING * 2,
  },
});

export default HomeScreen;
