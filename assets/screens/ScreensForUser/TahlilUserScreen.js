import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SPACING from '../../config/SPACING';
import COLORS from '../../config/COLORS';
import Entypo from '@expo/vector-icons/Entypo';
import firebase from '../../firebase/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TahlilUserScreen = ({ navigation }) => {
  const [tcNo, setTcNo] = useState();
  const [tahlilData, setTahlilData] = useState([]);
  const [filteredTahlils, setFilteredTahlils] = useState([]);
  const [selectedTahlil, setSelectedTahlil] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const snapshot = await firebase.database().ref('TahlilSonuc').once('value');
        const tahlils = snapshot.val();
        const storedTcNo = await AsyncStorage.getItem('TcNo');
        setTcNo(storedTcNo);

        const filtered = Object.values(tahlils || {}).filter(
          (item) => item.TcNo === storedTcNo
        );
        setFilteredTahlils(filtered);
        setTahlilData(filtered);
      } catch (error) {
        console.error('Tahlil Sonuçları Gelmiyor:', error);
      }
    };

    loadData();
  }, []);

  const renderTahlilItem = ({ item }) => (
    <View style={styles.tahlilItem}>
      <TouchableOpacity
        style={styles.tahlilHeader}
        onPress={() => {
          setSelectedTahlil(selectedTahlil === item ? null : item);
        }}
      >
        <Text style={styles.tahlilDate}>{item.Tarih}</Text>
        <Entypo
          name={selectedTahlil === item ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="black"
        />
      </TouchableOpacity>
      {selectedTahlil === item && (
        <View style={styles.tahlilDetails}>
          {Object.entries(item).map(([key, value]) => (
            key !== 'TcNo' && key !== 'Tarih' && (
              <Text key={key} style={styles.tahlilDetailText}>
                {key}: {value}
              </Text>
            )
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView
      style={{
        marginHorizontal: SPACING * 2,
        marginVertical: SPACING * 5,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            backgroundColor: COLORS.light,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: SPACING,
          }}
        >
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Entypo name="menu" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Text
          style={{
            fontSize: SPACING * 1.8,
            fontWeight: 'bold',
          }}
        >
          TAHLİL SONUÇLARINIZ
        </Text>
        <View style={styles.divider} />
      </View>
      <FlatList
        data={filteredTahlils}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderTahlilItem}
        contentContainerStyle={styles.listContainer}
      />
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Detaylar için bir tarih seçiniz!</Text>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.textStyle}>Kapat</Text>
          </Pressable>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    width: '100%',
    marginVertical: SPACING,
  },
  tahlilItem: {
    backgroundColor: COLORS.light,
    padding: SPACING,
    marginBottom: SPACING,
    borderRadius: SPACING / 2,
  },
  tahlilHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tahlilDate: {
    fontSize: SPACING * 1.6,
    fontWeight: 'bold',
  },
  tahlilDetails: {
    marginTop: SPACING,
  },
  tahlilDetailText: {
    fontSize: SPACING * 1.4,
    color: COLORS.darkGray,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: COLORS.primary,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default TahlilUserScreen;