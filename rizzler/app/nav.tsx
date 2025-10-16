import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
export default function Nav() {
  const navigation = useNavigation();
  return(
    <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={28} color="#6A1B9A" />
        </TouchableOpacity>
        <Image source={require('./assets/logo2.png')} style={styles.logo} />
        <Text style={styles.headerText}>Rizzler</Text>
      </View>
  )
  
}
const styles = StyleSheet.create({
    header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  logo: { width: 30, height: 30 },
  headerText: { fontSize: 20, fontWeight: 'bold', color: '#6A1B9A' }
});