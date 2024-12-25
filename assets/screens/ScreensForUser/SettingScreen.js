import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "../../firebase/firebase";
import "firebase/compat/database";
import SPACING from "../../config/SPACING";
import COLORS from "../../config/COLORS";

const SettingScreen = ({ navigation }) => {
  const [ad, setAd] = useState("");
  const [soyad, setSoyad] = useState("");
  const [tcNo, setTcNo] = useState("");
  const [telNo, setTelNo] = useState("");
  const [sex, setSexs] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedAd = await AsyncStorage.getItem("Ad");
      const storedSoyad = await AsyncStorage.getItem("Soyad");
      const storedTcNo = await AsyncStorage.getItem("TcNo");
      const storedTelNo = await AsyncStorage.getItem("TelNo");
      const storedSex = await AsyncStorage.getItem("Cinsiyet");
      const storedDate = await AsyncStorage.getItem("DogumTarihi");

      if (storedAd) setAd(storedAd);
      if (storedSoyad) setSoyad(storedSoyad);
      if (storedTcNo) setTcNo(storedTcNo);
      if (storedTelNo) setTelNo(storedTelNo);
      if (storedSex) setSexs(storedSex);
      if (storedDate) setDate(storedDate);
    } catch (error) {
      console.error("AsyncStorage okuma hatası:", error);
    }
  };

  const updateUser = async () => {
    setLoading(true);
    try {
      const userRef = firebase.database().ref("Users");
      const snapshot = await userRef.once("value");
      const users = snapshot.val();

      let userId = null;
      Object.keys(users).forEach((key) => {
        if (users[key].TcNo === tcNo) {
          userId = key;
        }
      });

      if (userId) {
        await userRef.child(userId).update({
          Ad: ad,
          Soyad: soyad,
          TcNo: tcNo,
          TelNo: telNo,
          Cinsiyet: sex,
          DogumTarihi: date,
        });

        await AsyncStorage.setItem("Ad", ad);
        await AsyncStorage.setItem("Soyad", soyad);
        await AsyncStorage.setItem("TcNo", tcNo);
        await AsyncStorage.setItem("TelNo", telNo);
        await AsyncStorage.setItem("Cinsiyet", sex);
        await AsyncStorage.setItem("DogumTarihi", date);

        alert("Profiliniz başarıyla güncellendi!");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("Profil güncellenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
          <Text style={styles.headerTitle}>Profil Ayarları</Text>
        </LinearGradient>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.content}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                <Image
                  style={styles.avatar}
                  source={require("../../image/avatar.png")}
                />
              </View>
              <Text style={styles.welcomeText}>
                Merhaba, {ad} {soyad}
              </Text>
            </View>

            <View style={styles.formSection}>
              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Ad</Text>
                  <TextInput
                    placeholder="Adınız"
                    style={styles.input}
                    value={ad}
                    onChangeText={setAd}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Soyad</Text>
                  <TextInput
                    placeholder="Soyadınız"
                    style={styles.input}
                    value={soyad}
                    onChangeText={setSoyad}
                  />
                </View>
              </View>

              <View style={styles.fullWidthInput}>
                <Text style={styles.inputLabel}>TC Kimlik No</Text>
                <TextInput
                  placeholder="TC Kimlik Numaranız"
                  style={styles.input}
                  keyboardType="numeric"
                  value={tcNo}
                  onChangeText={setTcNo}
                  maxLength={11}
                />
              </View>

              <View style={styles.fullWidthInput}>
                <Text style={styles.inputLabel}>Telefon</Text>
                <TextInput
                  placeholder="Telefon Numaranız"
                  style={styles.input}
                  keyboardType="numeric"
                  value={telNo}
                  onChangeText={setTelNo}
                  maxLength={11}
                />
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Cinsiyet</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={sex}
                      onValueChange={setSexs}
                      style={styles.picker}
                    >
                      <Picker.Item label="Erkek" value="Erkek" />
                      <Picker.Item label="Kadın" value="Kadın" />
                      <Picker.Item label="Diğer" value="Diğer" />
                    </Picker>
                  </View>
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Doğum Tarihi</Text>
                  <TextInput
                    placeholder="GG/AA/YYYY"
                    style={styles.input}
                    value={date}
                    onChangeText={setDate}
                  />
                </View>
              </View>
            </View>

            <View style={styles.actionSection}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={updateUser}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>KAYDET</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.changePasswordButton}
                onPress={() => navigation.navigate("ChangePassword")}
              >
                <Text style={styles.changePasswordText}>
                  Şifreni değiştirmek için tıkla
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = {
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
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    padding: SPACING * 2,
  },
  avatarContainer: {
    marginBottom: SPACING,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginTop: SPACING,
  },
  formSection: {
    padding: SPACING * 2,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING * 2,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: SPACING,
  },
  fullWidthInput: {
    marginHorizontal: SPACING,
    marginBottom: SPACING * 2,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SPACING / 2,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: SPACING,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    color: COLORS.dark,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  actionSection: {
    padding: SPACING * 2,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING,
    paddingHorizontal: SPACING * 4,
    marginBottom: SPACING * 2,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  changePasswordButton: {
    padding: SPACING,
  },
  changePasswordText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
};

export default SettingScreen;
