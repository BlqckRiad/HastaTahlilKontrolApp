import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import SPACING from '../config/SPACING';
import COLORS from '../config/COLORS';

const SThreeScreen = ({navigation}) => {
    return (
        <ScrollView style={{ flex: 1, marginHorizontal: SPACING * 2 }}>
            {/* Drawer'ı açan özel ikon */}
            <TouchableOpacity
                style={{ position: "absolute", top: SPACING * 5, left: SPACING * 2 }}
                onPress={() => navigation.openDrawer()}
            >
                <MaterialIcons name="menu" size={32} color="black" />
            </TouchableOpacity>

            <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: SPACING * 7 }}>
                <Text style={styles.title}>Sık Sorulan Sorular</Text>

                <View style={styles.faqContainer}>
                    <View style={styles.faqItem}>
                        <Text style={styles.question}>Randevu nasıl alabilirim?</Text>
                        <Text style={styles.answer}>Randevu almak için uygulama üzerinden doktor seçip, uygun saatleri görerek randevu oluşturabilirsiniz.</Text>
                    </View>

                    <View style={styles.faqItem}>
                        <Text style={styles.question}>Randevumu değiştirebilir miyim?</Text>
                        <Text style={styles.answer}>Evet, randevunuzu almış olduğunuz tarihten önce değiştirebilirsiniz. Değişiklik işlemi uygulama üzerinden yapılabilir.</Text>
                    </View>

                    <View style={styles.faqItem}>
                        <Text style={styles.question}>Hangi doktorları seçebilirim?</Text>
                        <Text style={styles.answer}>Uygulama üzerinden farklı uzmanlık alanlarındaki doktorları seçebilirsiniz. Tüm doktorlar detaylı profilleriyle listelenmiştir.</Text>
                    </View>

                    <View style={styles.faqItem}>
                        <Text style={styles.question}>Randevum için iptal ücreti var mı?</Text>
                        <Text style={styles.answer}>Randevunuzu iptal etmek ücretsizdir ancak iptal işlemi belirli bir süre önceden yapılmalıdır. Detaylı bilgi için uygulama içinden duyuruları takip edebilirsiniz.</Text>
                    </View>

                    <View style={styles.faqItem}>
                        <Text style={styles.question}>Doktorlarla nasıl iletişim kurabilirim?</Text>
                        <Text style={styles.answer}>Doktorlarınızla uygulama üzerinden mesajlaşarak veya telefon ile iletişim kurabilirsiniz.</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: SPACING * 3,
        color: COLORS.dark,
        fontWeight: '700',
        paddingBottom: SPACING * 3,
    },
    faqContainer: {
        width: '100%',
        paddingHorizontal: SPACING * 3,
    },
    faqItem: {
        marginBottom: SPACING * 3,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.primaryLight,
        paddingBottom: SPACING * 2,
    },
    question: {
        fontSize: SPACING * 2,
        fontWeight: '600',
        color: COLORS.dark,
    },
    answer: {
        fontSize: SPACING * 1.8,
        color: COLORS.darkGray,
        marginTop: SPACING * 1,
    },
});

export default SThreeScreen;
