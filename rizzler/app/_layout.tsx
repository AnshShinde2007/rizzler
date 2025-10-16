import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import Settings from './Settings';
import Home from './index';
import About from './About';



export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <Image
          source={require('./assets/logo2.png')} // replace with your logo path
          style={styles.reactLogo}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <Drawer screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="index" options={{ title: 'Home' }} />
      <Drawer.Screen name="Settings" options={{ title: 'Settings' }} />
      <Drawer.Screen name="About" options={{ title: 'About' }} />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reactLogo: {
    height: 200,
    width: 200,
  },
});
